<template>
	<view class="modern-report-page">
		<!-- 头部 Logo 区域 -->
		<view class="logo-box" v-if="infos.logo">
			<image class="logo-img" mode="aspectFit" :src="infos.logo" />
		</view>
		
		<!-- 顶部看板：统调比例与商品税率双区块展示 (同步Data风格) -->
		<view class="hero-control-header amber-theme-box">
			<view class="header-title-row">
				<text class="main-label">全品统一调价比例</text>
				<view class="stepper-box">
					<text :class="['step-value', (infos.ratio > 0 || ratioVal > 0) ? 'text-red' : (infos.ratio < 0 || ratioVal < 0) ? 'text-green' : 'text-gray']">
						{{ (infos.ratio !== undefined && infos.ratio !== null && infos.ratio !== '') ? ((infos.ratio > 0 ? '+' + infos.ratio : infos.ratio) + '%') : '0%' }}
					</text>
				</view>
			</view>

			<!-- 发票通栏选择胶囊 -->
			<view class="filter-capsule-row">
				<view class="capsule-pill full-width-pill">
					<view class="pill-left-group">
						<text class="pill-key">发票税率控制</text>
					</view>
					<view class="pill-right-group">
						<text class="pill-val">{{ actualTaxText }}</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 商品列表明细区域 -->
		<view class="product-stream-section">
			<view class="section-heading">
				<text class="sec-title">报价商品清单</text>
				<text class="sec-count">共 {{ list ? list.length : 0 }} 项</text>
			</view>

			<block v-if="list && list.length > 0">
				<!-- 商品明细卡片 (【修复】：优化卡片交替颜色，奇偶错开，采用质感浅米色与白色交替，消除视觉连贯眩晕感) -->
				<view :class="['floating-card-item', i % 2 === 0 ? 'card-even' : 'card-odd']" v-for="(item, i) in list" :key="item.id || i">
					<!-- 卡片第一行：No.徽章序号 -->
					<div class="card-header-line">
						<div class="left-header-group">
							<text class="item-index-badge">序号 {{ i + 1 }}</text>
						</div>
					</div>

					<!-- 产品参数行：【修复】将产品名称独立提到最上方第一行，电压等级、产品型号、规格依次对齐，符合电商黄金阅读逻辑 -->
					<view class="card-grid-boxes-line">
						<!-- 【修复新增】：产品名称独立置顶第一行 -->
						<view class="param-box-item name-box-item">
							<text class="box-label">产品名称：</text>
							<text class="box-val custom-blue-text">{{ cleanField(item.name || item.title || item.product_name, 'name') }}</text>
						</view>

						<view class="combined-row-half">
							<view class="half-param-item">
								<text class="box-label">{{ item.key_5 || '电压等级' }}：</text>
								<text class="box-val custom-blue-text">{{ cleanField(item.attr1, 'voltage') }}</text>
							</view>
							<view class="half-param-item">
								<text class="box-label">{{ item.key_6 || '产品型号' }}：</text>
								<text class="box-val custom-blue-text">{{ cleanField(item.model || item.attr2, 'model') }}</text>
							</view>
						</view>

						<!-- 产品规格跟质量标准合并到同一行，避免产品规格单独占一整行、后面留一大块空白 -->
						<view class="combined-row-half">
							<view class="half-param-item">
								<text class="box-label">{{ item.key_7 || '产品规格' }}：</text>
								<text class="box-val custom-blue-text">{{ cleanField(item.attr3 || item.spec, 'spec') }}</text>
							</view>
							<view class="half-param-item">
								<text class="box-label">{{ item.key_1 || '质量标准' }}：</text>
								<text class="box-val custom-blue-text">{{ item.value_1 || '暂无' }}</text>
							</view>
						</view>

						<!-- 跟"商品基础信息"卡片统一读取 key_N/value_N -->
						<view class="combined-row-half">
							<view class="half-param-item">
								<text class="box-label">{{ item.key_2 || '执行标准' }}：</text>
								<text class="box-val custom-blue-text">{{ item.value_2 || '暂无' }}</text>
							</view>
							<view class="half-param-item">
								<text class="box-label">{{ item.key_4 || '计量单位' }}：</text>
								<text class="box-val custom-blue-text">{{ item.value_4 || '暂无' }}</text>
							</view>
						</view>
						<view class="combined-row-half">
							<view class="half-param-item">
								<text class="box-label">{{ item.key_0 || '供应方式' }}：</text>
								<text class="box-val custom-blue-text">{{ item.value_0 || '暂无' }}</text>
							</view>
							<view class="half-param-item">
								<text class="box-label">{{ item.key_3 || '起订数量' }}：</text>
								<text class="box-val custom-blue-text">{{ item.value_3 || 500 }}</text>
							</view>
						</view>
						<view class="param-box-item">
							<text class="box-label">{{ item.key_8 || '交货周期' }}：</text>
							<text class="box-val custom-blue-text">{{ item.value_8 || '暂无' }}</text>
						</view>
					</view>

					<!-- 卡片底部行：数量、单价、小计 (标题黑色分离，数值保持红色) -->
					<view class="card-footer-line">
						<view class="footer-item">
							<text class="f-label-black">数量：</text>
							<text class="f-val-red">{{ item.nums || item.product_nums || 0 }}</text>
						</view>
						<view class="footer-item price-plain-item">
							<text class="f-label-black">单价：</text>
							<text class="f-val-red price-highlight-red">¥{{ item.final_price || item.price || 0 }}</text>
						</view>
						<view class="footer-item subtotal-item-group">
							<text class="f-label-black">小计：</text>
							<text class="f-val-red subtotal-num-red">¥{{ (item.total && item.total > 0) ? item.total : 0 }}</text>
						</view>
					</view>
				</view>
			</block>
			
			<!-- 空数据占位 -->
			<view v-else class="empty-state">
				<text>暂无商品明细数据</text>
			</view>
		</view>

		<!-- 商务条款与备注卡片 -->
		<view class="floating-section-card" v-if="hasTerms">
			<view class="form-group-title">商务与履约条款</view>
			<view class="modern-form-item" v-if="infos.check_type"><text class="form-label">付款方式：</text><text class="val-text">{{ infos.check_type }}</text></view>
			<view class="modern-form-item" v-if="infos.trans_type"><text class="form-label">运输方式：</text><text class="val-text">{{ infos.trans_type }}</text></view>
			<view class="modern-form-item" v-if="infos.fees_out"><text class="form-label">运输费用：</text><text class="val-text">{{ infos.fees_out }}</text></view>
			<view class="modern-form-item" v-if="infos.pack_recyle"><text class="form-label">包装选项：</text><text class="val-text">{{ infos.pack_recyle }}</text></view>
		</view>

		<!-- 抬头与人员档案卡片 -->
		<view class="floating-section-card">
			<view class="form-group-title">抬头与人员档案</view>
			<view class="modern-form-item" v-if="infos.rep_comp"><text class="form-label">报价单位：</text><text class="val-text">{{ infos.rep_comp }}</text></view>
			<view class="modern-form-item" v-if="infos.question_comp"><text class="form-label">询价单位：</text><text class="val-text">{{ infos.question_comp }}</text></view>
			<view class="modern-form-item" v-if="infos.project_comp"><text class="form-label">项目名称：</text><text class="val-text">{{ infos.project_comp }}</text></view>
			<view class="modern-form-item" v-if="infos.rep_user"><text class="form-label">报价人员：</text><text class="val-text">{{ infos.rep_user }}</text></view>
			<view class="modern-form-item" v-if="infos.rep_phone || infos.tel || infos.phone"><text class="form-label">手机号码：</text><text class="val-text">{{ infos.rep_phone || infos.tel || infos.phone }}</text></view>
		</view>

		<!-- 备注信息卡片 -->
		<view class="floating-section-card compact-remark-card" v-if="infos.tags">
			<view class="form-group-title">备注与说明</view>
			<view class="textarea-box">
				<text class="remark-content" space="nbsp">{{ infos.tags }}</text>
			</view>
		</view>
		
		<!-- 底部高定悬浮结算舱 (样式与DATA页完全对齐) -->
		<view class="floating-checkout-dock">
			<view class="dock-summary-info">
				<view class="sum-row-top">
					<text class="sum-item"><text class="dock-title-black">条数：</text><text class="dock-val-red">{{ list ? list.length : 0 }}</text></text>
					<text class="sum-item"><text class="dock-title-black">总量：</text><text class="dock-val-red">{{ count || 0 }}</text></text>
					<text class="tax-flag-badge badge-special">{{ actualTaxText }}</text>
				</view>
				<view class="sum-row-bottom">
					<!-- 总计金额支持显示后两位（小数点后两位） -->
					<text class="total-money-label"><text class="dock-title-black">总计：</text><text class="money-num-red">¥{{ formatMoney(total) }}</text></text>
				</view>
				<view class="sum-row-words">
					<text class="chinese-words"><text class="dock-title-black">大写：</text><text class="dock-content-red">{{ total_n || '零元整' }}</text></text>
				</view>
			</view>
		</view>

		<!-- 底部免责提示 -->
		<view class="page-tip-text">
			<text>本报价仅供参考，具体条款以最终盖章文本为准</text>
		</view>

		<!-- 加大底部留白高度，确保滑动到最底部时抬头与人员档案内容不被底栏遮挡 -->
		<view style="height: 320rpx;"></view>
		
		<!-- 底部固定分享操作栏（恢复老版本四个入口） -->
		<view class="fenxiang">
			<view class="item metal-btn" @click="shareBg()">
				<image class="icon-img" src="/static/imgs/biaoge.png" mode="aspectFit" />
				<text>生成表格</text>
			</view>
			<view class="item metal-btn" @click="shareImage()">
				<image class="icon-img" src="/static/imgs/tupian.png" mode="aspectFit" />
				<text>生成图片</text>
			</view>
			<view class="item metal-btn" @click="sharetoWechat()">
				<image class="icon-img" src="/static/imgs/weixin.png" mode="aspectFit" />
				<text>微信分享</text>
			</view>
			<view class="item metal-btn" @click="sharetoFriend()">
				<image class="icon-img" src="/static/imgs/wxpyq.png" mode="aspectFit" />
				<text>朋友圈</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				id: '',
				uid: '',
				list: [], 
				total: '',
				total_n: '',
				ratioVal: 0,
				infos: {},
				excel_url: '',
				img_url: "",
				count: 0,
				elcc_sn: '',
				rawTaxKey: '',
			}
		},
		computed: {
			hasTerms() {
				let info = this.infos;
				return !!(info.check_type || info.trans_type || info.fees_out || info.pack_recyle);
			},
			actualTaxText() {
				let info = this.infos || {};
				let candidateFields = [
					this.rawTaxKey,
					info.tax_type,
					info.invoice_type,
					info.tax,
					info.tax_name,
					info.tax_title,
					info.ticket
				];

				for (let i = 0; i < candidateFields.length; i++) {
					let val = candidateFields[i];
					if (val !== undefined && val !== null && val !== '') {
						let str = String(val).trim();
						if (str === '2' || str.includes('专') || str.includes('专用')) {
							return "含专用发票";
						}
						if (str === '1' || str.includes('普') || str.includes('普通')) {
							return "含普通发票";
						}
						if (str === '0' || str.includes('不含') || str.includes('无')) {
							return "不含发票";
						}
					}
				}

				let val = Number(info.ratio !== undefined ? info.ratio : this.ratioVal);
				if (val >= 7) {
					return "含专用发票";
				} else if (val > 0 && val < 7) {
					return "含普通发票";
				} else {
					return "不含发票";
				}
			},
			taxTagClass() {
				let text = this.actualTaxText;
				if (text.includes('专用')) {
					return 'tax-zhuan';
				} else if (text.includes('普通')) {
					return 'tax-pu';
				} else {
					return 'tax-none';
				}
			}
		},
		onLoad(option) {
			this.id = option.id ? option.id : ''
			let userInfo = uni.getStorageSync('loginTicket');
			if (!userInfo) {
				uni.showModal({
					title: '提示',
					content: '您还未登录，前往登录',
					showCancel: false,
					success: (res) => {
						if (res.confirm) {
							uni.reLaunch({ url: '/pages/login_md/login_md' })
						}
					}
				});
			} else {
				this.uid = userInfo.id
				this.doIninit()
				this.outUrl()
			}
		},
		methods: {
			formatMoney(val) {
				if (val === undefined || val === null || val === '') return '0.00';
				let num = Number(val);
				if (isNaN(num)) return val;
				return num.toFixed(2);
			},
			cleanField(val, type) {
				if (!val) return '暂无';
				let str = String(val).trim();
				str = str.replace(/^(产品型号|型号|产品规格|规格|电压等级|电压|等级|产品名称|名称)[\s]*[:：\-]*/g, '');
				str = str.replace(/^(产品|等级)[\s]*[:：\-]*/g, '');
				str = str.replace(/(产品型号|型号|产品规格|规格|电压等级|电压|产品名称|名称)[\s]*[:：\-]+/g, '');
				return str.trim() || '暂无';
			},
			shareBg() {
				if (!this.excel_url) {
					uni.showToast({
						icon: "none",
						title: "正在获取链接请稍后"
					})
					return false
				}
				if (uni.getSystemInfoSync().platform == "android") {
					const wechat_fileshare = uni.requireNativePlugin("wechat-fileshare");
					if (wechat_fileshare) {
						uni.downloadFile({
							url: this.excel_url,
							header: {
								'Content-Type': 'application/pdf; charset=UTF-8',
							},
							success: (res) => {
								if (res.statusCode === 200) {
									console.log('下载成功');
								}
								wechat_fileshare.send({
										path: res.tempFilePath,
										uni_app_id: '__UNI__94C6955',
										filetype: 'xls',
										package_name: 'com.tencent.mm',
										filename: this.elcc_sn
									}, e => {}
								)
							}
						})
					} else {
						this.doShare(this.excel_url, 0, "WXSceneSession");
					}
				} else {
					this.doShare(this.excel_url, 0, "WXSceneSession");
				}
			},
			shareImage() {
				if (!this.img_url) {
					uni.showToast({
						icon: "none",
						title: "正在获取链接请稍后"
					})
					return false
				}
				this.doShare(this.img_url, 0, "WXSceneSession", this.img_url);
			},
			sharetoWechat() {
				this.doShare("http://app.elccc.cn/Inter/Wcins/repinfos/id/" + this.id, 0, "WXSceneSession", "/static/logo.png");
			},
			sharetoFriend() {
				this.doShare("http://app.elccc.cn/Inter/Wcins/repinfos/id/" + this.id, 0, "WXSceneTimeline", "/static/logo.png");
			},
			doShare(href, type, scene, imageUrl) {
				uni.share({
					provider: "weixin",
					scene: scene,
					type: type,
					href: href,
					title: this.elcc_sn,
					imageUrl: imageUrl || this.img_url,
					success: function(res) { console.log("分享成功"); },
					fail: function(err) { console.log("分享失败", err); }
				});
			},
			doIninit() {
				let that = this;
				let params = { uid: that.uid, id: that.id };

				that.$api.repinfos(params).then(ret => {
					if(!ret.data) return;
					let resData = ret.data;
					that.list = resData.list || resData.goods || resData.goods_list || [];
					that.total = resData.total || 0;
					that.total_n = resData.total_n || '零元整';
					
					this.count = 0;
					this.list.forEach((item) => {
						this.count += parseInt(item.nums || item.product_nums || 0);
					});
					
                    that.infos = resData.info || resData || {};
					that.ratioVal = Number(that.infos.ratio || resData.ratio || 0);
					
					that.rawTaxKey = resData.tax_type || resData.invoice_type || resData.tax || resData.ticket || 
					                 that.infos.tax_type || that.infos.invoice_type || that.infos.tax || that.infos.ticket || '';
				}).catch(err => {
					console.error("获取报价单详情报错", err);
					that.list = [];
				});
			},
			outUrl() {
				uni.showLoading({
					title: "生成中...",
					mask: true
				})
				this.$api.outUrl({ id: this.id, uid: this.uid }).then(ret => {
					if (ret && ret.data) {
						this.excel_url = ret.data.excel_url || '';
						this.img_url = ret.data.img_url || '';
						this.elcc_sn = ret.data.elcc_sn || '报价单';
					}
				}).catch(e => {
					console.error(e);
				}).finally(e => {
					uni.hideLoading()
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.modern-report-page {
		background-color: #f8fafc;
		min-height: 100vh;
		padding: 20rpx;
		box-sizing: border-box;
		font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
	}

	.logo-box {
		width: 100%;
		display: flex;
		justify-content: center;
		margin-bottom: 20rpx;
		.logo-img {
			width: 100%;
			max-height: 120rpx;
		}
	}

	.text-red { color: #dc2626 !important; }
	.text-green { color: #16a34a !important; }
	.text-gray { color: #64748b !important; }

	.custom-blue-text {
		color: #2563eb !important;
		font-weight: 500 !important;
	}

	.f-label-black {
		color: #1e293b !important;
		font-size: 22rpx;
		font-weight: 500;
		margin-right: 4rpx;
	}
	.f-val-red {
		color: #dc2626 !important;
		font-weight: 500;
		font-size: 22rpx;
	}
	.price-highlight-red {
		color: #e11d48 !important;
		font-weight: bold !important;
		font-size: 24rpx !important;
	}
	.subtotal-num-red {
		color: #e11d48 !important;
		font-weight: 600 !important;
		font-size: 24rpx !important;
	}

	.dock-title-black {
		color: #1e293b !important;
		font-weight: 500 !important;
	}
	.dock-val-red {
		color: #dc2626 !important;
		font-weight: bold !important;
	}
	.money-num-red {
		color: #dc2626 !important;
		font-weight: bold !important;
		font-size: 34rpx !important;
		margin-left: 6rpx;
	}
	.dock-content-red {
		color: #dc2626 !important;
	}

	.tax-flag-badge {
		padding: 2rpx 12rpx;
		border-radius: 6rpx;
		font-size: 20rpx;
		font-weight: bold;
		&.badge-special {
			background: #fff1f2;
			color: #e11d48;
			border: 1rpx solid #fecdd3;
		}
	}

	/* 顶部琥珀主题看板 - 同步Data页 */
	.hero-control-header.amber-theme-box {
		background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
		border: 1rpx solid #fde68a;
		border-radius: 20rpx;
		padding: 20rpx 24rpx;
		box-shadow: 0 8rpx 20rpx -4rpx rgba(217, 119, 6, 0.12);
		margin-bottom: 20rpx;

		.header-title-row {
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-bottom: 14rpx;

			.main-label {
				font-size: 26rpx;
				font-weight: bold;
				color: #92400e;
			}

			.stepper-box {
				display: flex;
				align-items: center;
				background: #ffffff;
				border-radius: 28rpx;
				padding: 2rpx 16rpx;
				border: 1rpx solid #fcd34d;

				.step-value {
					font-size: 26rpx;
					font-weight: bold;
				}
			}
		}

		.filter-capsule-row {
			display: flex;

			.capsule-pill.full-width-pill {
				width: 100%;
				background: #ffffff;
				border: 1rpx solid #fde68a;
				border-radius: 12rpx;
				padding: 14rpx 20rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.02);

				.pill-left-group {
					.pill-key {
						font-size: 24rpx;
						color: #78350f;
						font-weight: bold;
					}
				}

				.pill-right-group {
					display: flex;
					align-items: center;
					gap: 8rpx;

					.pill-val {
						font-size: 24rpx;
						color: #b45309;
						font-weight: bold;
					}
				}
			}
		}
	}

	.product-stream-section {
		margin-bottom: 20rpx;

		.section-heading {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 14rpx;
			padding: 0 6rpx;

			.sec-title {
				font-size: 26rpx;
				font-weight: bold;
				color: #1e293b;
			}

			.sec-count {
				font-size: 22rpx;
				color: #64748b;
			}
		}

		.empty-state {
			background: #ffffff;
			border-radius: 20rpx;
			padding: 30rpx;
			text-align: center;
			color: #94a3b8;
			font-size: 26rpx;
			box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.04);
		}

		/* 商品卡片同步Data风格：【修复】强化奇偶项颜色交替，偶数行采用质感浅米色（#fffcf5）与金色边缘，消除眩晕感 */
		.floating-card-item {
			border-radius: 20rpx;
			padding: 18rpx 24rpx;
			margin-bottom: 20rpx;
			box-shadow: 0 10rpx 25rpx rgba(100, 116, 139, 0.06);
			border: 1rpx solid #e2e8f0;

			&.card-odd { background-color: #ffffff; }
			&.card-even { background-color: #fffcf5; border-color: #fde68a; }

			.card-header-line {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding-bottom: 12rpx;
				border-bottom: 1rpx dashed #f1f5f9;
				margin-bottom: 12rpx;

				.left-header-group {
					.item-index-badge {
						font-size: 20rpx;
						font-weight: bold;
						padding: 4rpx 10rpx;
						border-radius: 8rpx;
						background: #fffbeb;
						color: #b45309;
						border: 1rpx solid #fde68a;
					}
				}
			}

			.card-grid-boxes-line {
				display: flex;
				flex-direction: column;
				gap: 6rpx;
				margin-bottom: 12rpx;
				background: #f8fafc;
				padding: 8rpx 10rpx;
				border-radius: 12rpx;
				border: 1rpx solid #f1f5f9;

				.combined-row-half {
					display: flex;
					gap: 8rpx;
					width: 100%;

					.half-param-item {
						flex: 1;
						background: #ffffff;
						border: 1rpx solid #e2e8f0;
						border-radius: 8rpx;
						padding: 8rpx 10rpx;
						display: flex;
						align-items: center;

						.box-label {
							font-size: 22rpx;
							color: #64748b;
							font-weight: 500;
							flex-shrink: 0;
						}

						.box-val {
							font-size: 24rpx;
							color: #334155;
							word-break: break-all;
							flex: 1;
							text-align: left;
						}
					}
				}

				.param-box-item {
					background: #ffffff;
					border: 1rpx solid #e2e8f0;
					border-radius: 8rpx;
					padding: 8rpx 10rpx;
					display: flex;
					align-items: center;

					.box-label {
						font-size: 22rpx;
						color: #64748b;
						font-weight: 500;
						flex-shrink: 0;
					}

					.box-val {
						font-size: 24rpx;
						color: #334155;
						word-break: break-all;
						flex: 1;
						text-align: left;
					}
				}
			}

			.card-footer-line {
				display: flex;
				justify-content: space-between;
				align-items: center;
				border-top: 1rpx dashed #f1f5f9;
				padding-top: 10rpx;
			}
		}
	}

	.floating-section-card {
		background: #ffffff;
		border-radius: 20rpx;
		padding: 4rpx 24rpx;
		margin-bottom: 20rpx;
		box-shadow: 0 8rpx 20rpx rgba(148, 163, 184, 0.08);
		border: 1rpx solid #e2e8f0;

		&.compact-remark-card {
			padding-bottom: 16rpx;
			.textarea-box {
				padding: 8rpx 0;
				.remark-content {
					font-size: 26rpx;
					color: #334155;
					line-height: 1.5;
					word-break: break-all;
				}
			}
		}

		.form-group-title {
			font-size: 24rpx;
			font-weight: bold;
			color: #b45309;
			padding: 18rpx 0 10rpx 0;
			border-bottom: 1rpx solid #fef3c7;
			margin-bottom: 4rpx;
		}

		.modern-form-item {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 16rpx 0;
			border-bottom: 1rpx solid #f8fafc;

			&:last-child { border-bottom: none; }

			.form-label {
				font-size: 26rpx;
				color: #334155;
				font-weight: 500;
			}

			.val-text {
				font-size: 26rpx;
				color: #1f293b;
				font-weight: 500;
				text-align: right;
				max-width: 70%;
				word-break: break-all;
			}
		}
	}

	/* 底部高定悬浮结算舱 - 同步Data风格 */
	.floating-checkout-dock {
		position: fixed;
		bottom: 160rpx;
		left: 0;
		right: 0;
		width: 100%;
		max-width: 750rpx;
		margin: 0 auto;
		background: #ffffff;
		box-shadow: 0 -12rpx 35rpx rgba(0, 0, 0, 0.08);
		border-radius: 28rpx 28rpx 0 0;
		z-index: 98;
		padding: 20rpx 28rpx;
		box-sizing: border-box;

		.dock-summary-info {
			background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
			border-radius: 16rpx;
			padding: 14rpx 20rpx;
			border: 1rpx solid #fde68a;

			.sum-row-top {
				display: flex;
				justify-content: space-between;
				align-items: center;
				font-size: 22rpx;
				margin-bottom: 6rpx;
			}

			.sum-row-bottom {
				margin-bottom: 2rpx;
				.total-money-label { font-size: 24rpx; font-weight: bold; }
			}

			.sum-row-words {
				.chinese-words { font-size: 20rpx; }
			}
		}
	}

	.page-tip-text {
		text-align: center;
		padding: 10rpx 20rpx 30rpx 20rpx;
		text { font-size: 22rpx; color: #9CA3AF; }
	}

	/* 底部固定分享栏 */
	.fenxiang { 
		width: 100vw; 
		height: 160rpx; 
		position: fixed; 
		display: flex; 
		align-items: center; 
		justify-content: space-between; 
		background-color: rgba(255, 255, 255, 0.98); 
		backdrop-filter: blur(10px);
		border-top: 1rpx solid #E5E7EB;
		bottom: 0rpx; 
		left: 0;
		z-index: 99; 
		box-shadow: 0 -16rpx 40rpx rgba(0, 0, 0, 0.15);
		padding: 0 32rpx;
		box-sizing: border-box;

		.item {
			flex: 1;
			height: 128rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			border-radius: 16rpx;
			box-shadow: 0 4rpx 14rpx rgba(0, 0, 0, 0.08);

			&:not(:last-child) { margin-right: 16rpx; }

			&.metal-btn {
				background: linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%);
				border: 1rpx solid #CBD5E1;
				text { color: #1E293B; }
			}

			.icon-img {
				width: 44rpx;
				height: 44rpx;
				margin-bottom: 6rpx;
			}

			text {
				font-size: 22rpx;
				font-weight: 600;
				letter-spacing: 1rpx;
			}
		}
	}
</style>