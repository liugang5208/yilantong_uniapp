<template>
	<view class="wrap custom-class" :style="{ paddingBottom: isTabEmbedded ? '260rpx' : '180rpx' }">
		<!-- 顶部导航栏 -->
		<u-navbar :is-back="false" title="" :border-bottom="false">
			<view class="navbar-content-box">
				<view class="nav-left-slot" @click.stop="handleBackClick">
					<u-icon name="arrow-left" color="#1e293b" :size="38"></u-icon>
				</view>
				<view class="nav-title-text">我的购物车</view>
				<view class="nav-right-actions">
					<view class="nav-action-btn select-all-btn" @click.stop="toggleSelectAll">
						<u-icon :name="isAllSelected ? 'checkmark-circle-fill' : 'checkmark-circle'" :color="isAllSelected ? '#0062ff' : '#475569'" :size="22"></u-icon>
						<text class="action-text">{{ isAllSelected ? '反选' : '全选' }}</text>
					</view>
					<view class="nav-action-btn clear-btn" @click.stop="clear">
						<u-icon name="trash" color="#d93838" :size="22"></u-icon>
						<text class="action-text red-text">清空</text>
					</view>
				</view>
			</view>
		</u-navbar>

		<!-- 顶部切换栏 -->
		<div class="tab-header-container">
			<div class="line-segmented-control">
				<div 
					v-for="(item, index) in tabsList" 
					:key="index" 
					class="line-tab-item" 
					:class="{ active: current === index }"
					@click.stop="texChange(index)">
					<text class="line-tab-text">{{ item.name }}</text>
					<text class="tab-badge-num" v-if="getTabCount(index) > 0">{{ getTabCount(index) }}</text>
				</div>
			</div>
		</div>

		<!-- 购物车列表区域 -->
		<view class="cart-scroll-container">
			<view class="cart-scroll-inner">
				<view v-for="(x,i) in list" :key="i">
					
					<!-- 类型 0：标准电缆商品卡片（严格对照草图网格与顺序，加入连续序号与交替背景） -->
					<!-- 【视觉优化注释】：强化卡片立体层次、交替色搭配与连续自增序号标记 -->
					<view class="modern-card" :class="i % 2 === 1 ? 'card-item-even' : 'card-item-odd'" v-if="x.types=='0'">
						<view class="card-top-row">
							<view class="card-index-badge-wrap">
								<text class="card-serial-number">NO.{{ i + 1 }}</text>
							</view>
							<view class="check-box-wrap">
								<u-checkbox shape="circle" v-model="x.status" @change="selector($event, x)">
									<text class="check-label-text">勾选结算</text>
								</u-checkbox>
							</view>
							<view class="del-action-btn" @click.stop="del(x.id)">
								<u-icon name="close" color="#d93838" :size="18"></u-icon>
								<text class="del-text">移除</text>
							</view>
						</view>

						<!-- 商品主内容区（严格对照草图的网格卡片排列顺序） -->
						<view class="card-main-content">
							<!-- 1. 商品名称占满整行 -->
							<div class="spec-grid-item title-grid-item" @click.stop="showLongText('商品名称', x.list.gnames)">
								<text class="s-k">商品名称：</text>
								<text class="s-v font-dark">{{x.list.gnames}}</text>
							</div>
							
							<!-- 2. 双列规格格栅（严格对应草图左右位置：左边产品型号/右边电压等级 等） -->
							<div class="spec-grid-box-double">
								<div class="spec-grid-item">
									<text class="s-k">{{x.list.key_1 || '电压等级'}}：</text>
									<text class="s-v font-blue">{{x.list.value_1}}</text>
								</div>
								<div class="spec-grid-item">
									<text class="s-k">{{x.list.key_0 || '产品型号'}}：</text>
									<text class="s-v font-blue">{{x.list.value_0}}</text>
								</div>
								<div class="spec-grid-item">
									<text class="s-k">{{x.list.key_2 || '产品规格'}}：</text>
									<text class="s-v font-blue">{{x.list.value_2}}</text>
								</div>
								<div class="spec-grid-item">
									<text class="s-k">质量标准：</text>
									<text class="s-v font-blue">{{ x.standard || x.list.standard || x.standard_name || x.bz_name || x.bz || x.product_standard || '国标保检' }}</text>
								</div>
								<div class="spec-grid-item">
									<text class="s-k">计量单位：</text>
									<text class="s-v font-blue">{{x.info.g_unit}}</text>
								</div>
								<div class="spec-grid-item">
								    <text class="s-k">起订数量：</text>
								    <text class="s-v font-blue">{{x.minNum || 500}}</text>
								</div>

								<!-- 3. 单品备注（条件渲染：有则完整显示占一个格子或整行，无则自动隐藏不留空白） -->
								<div class="spec-grid-item full-width-cell" v-if="x.remark || x.list.remark || x.memo" @click.stop="showLongText('单品备注', x.remark || x.list.remark || x.memo)">
									<text class="s-k">单品备注：</text>
									<text class="s-v font-remark">{{ x.remark || x.list.remark || x.memo }}</text>
								</div>

								<!-- 4. 执行单价与小计金额：严格作为表格中的最后两格，单品小计精确后两位显示 -->
								<div class="spec-grid-item">
									<text class="s-k">执行单价：</text>
									<text class="s-v font-price"><text class="yuan-sign">¥</text>{{transpoint(x.list.market*x.ticket_fee*ulevel['up']).toFixed(2)}}</text>
								</div>
								<div class="spec-grid-item">
									<text class="s-k">单品小计：</text>
									<text class="s-v font-price"><text class="yuan-sign">¥</text>{{transpoint(x.price).toFixed(2)}}</text>
								</div>
							</div>
						</view>

						<!-- 5. 调整数量行（取消左侧起订量胶囊，右侧调整数量和加减框靠右） -->
						<view class="card-nums-lower-row">
							<view class="nums-right-group">
								<text class="label-muted">调整数量：</text>
								<div class="nums-step-action-enlarged" @click.stop>
									<div class="custom-step-btn" @click.stop="handleStepMinus(x)">-</div>
									<input class="custom-step-input" type="number" v-model="x.nums" @blur="onInputBlur(x)" />
									<div class="custom-step-btn" @click.stop="handleStepPlus(x)">+</div>
								</div>
							</view>
						</view>
					</view>

					<!-- 类型 1：多属性组合电缆商品卡片 -->
					<!-- 【视觉优化注释】：组合商品卡片同样具备连续序号标记与统一现代科技边框风格 -->
					<view class="modern-card" :class="i % 2 === 1 ? 'card-item-even' : 'card-item-odd'" v-if="x.types=='1'">
						<view class="card-top-row">
							<view class="card-index-badge-wrap">
								<text class="card-serial-number">NO.{{ i + 1 }}</text>
								<text class="card-type-badge">多规格组合包</text>
							</view>
							<view class="del-action-btn" @click.stop="del(x.id)">
								<u-icon name="close" color="#d93838" :size="18"></u-icon>
								<text class="del-text">移除</text>
							</view>
						</view>

						<view class="card-main-content">
							<div class="spec-grid-item title-grid-item" @click.stop="showLongText('组合名称', x.gnames)">
								<text class="s-k">商品名称：</text>
								<text class="s-v font-dark">{{x.gnames}}</text>
							</div>
							<div class="spec-grid-box-double" v-if="x.datr">
								<div class="spec-grid-item" @click.stop="showLongText(x.datr.key_0, x.datr.value_0)">
									<text class="s-k">{{x.datr.key_0}}：</text>
									<text class="s-v font-blue">{{x.datr.value_0}}</text>
								</div>
								<div class="spec-grid-item" @click.stop="showLongText(x.datr.key_1, x.datr.value_1)">
									<text class="s-k">{{x.datr.key_1}}：</text>
									<text class="s-v font-blue">{{x.datr.value_1}}</text>
								</div>
							</div>
						</view>

						<div class="spec-grid-item full-width-cell" v-if="x.remark || x.memo" @click.stop="showLongText('单品备注', x.remark || x.memo)">
							<text class="s-k">单品备注：</text>
							<text class="s-v font-remark">{{ x.remark || x.memo }}</text>
						</div>

						<div class="sub-attr-list-container" @click.stop>
							<view class="sub-attr-item" v-for="(r,index) in x.list" :key="index">
								<view class="sub-attr-name">{{r.info.name}}</view>
								<view class="sub-attr-control-row">
									<text class="sub-attr-price"><text class="yuan-sign-sm">¥</text>{{transpoint(r.info.market*x.ticket_fee*ulevel['up']).toFixed(2)}}</text>
									<view class="sub-nums-wrapper">
										<div class="btn-box-custom" @click.stop="addNums(r.id,r.nums,1)">+</div>
										<input class="input-box-custom" type="text" v-model="r.nums" @change="changeData(r.id,r.nums,1)">
										<div class="btn-box-custom" @click.stop="ceilNums(r.id,r.nums,1)">-</div>
									</view>
								</view>
							</view>
						</div>

						<view class="card-main-content" style="margin-top: 10rpx;">
							<div class="spec-grid-box-double">
								<div class="spec-grid-item"></div>
								<div class="spec-grid-item">
									<text class="s-k">组合合计：</text>
									<text class="s-v font-price"><text class="yuan-sign">¥</text>{{transpoint(x.price).toFixed(2)}}</text>
								</div>
							</div>
						</view>
					</view>

				</view>
				
				<view class="empty-wrap" v-if="list.length==0">
					<u-empty text="当前分类下没有商品，快去选购吧" :src="pureCodeEmptyIcon" img-width="220" img-height="220"></u-empty>
				</view>
			</view>
		</view>

		<!-- 底部结算悬浮栏（科技橘金微光重构：包含精准后两位小计、运费与发票接口自动判断、精简时尚胶囊下单按钮） -->
		<view class="list_footer_wrapper" :style="{ bottom: isTabEmbedded ? '110rpx' : '10rpx' }" v-if="list.length > 0">
			<div class="footer-inner-container">
				<view class="footer-marquee-tip-bar">
					<view class="marquee-icon">
						<u-icon name="volume" color="#f59e0b" :size="18"></u-icon>
					</view>
					<view class="marquee-box">
						<div class="marquee-content">
							<span class="tip-segment-pay">【付款通知】不同发票类型的商品需分别结算，请切换顶部标签查看。</span>
							<span class="tip-segment-divider"></span>
							<span class="tip-segment-notice">【温馨提示】行情价格由系统实时AI计算更新，下单前请仔细核对规格与价格。</span>
							<span class="tip-segment-divider"></span>
						</div>
					</view>
				</view>

				<view class="list_footer">
					<view class="list_footer-info">
						<view class="footer-main-row">
							<text class="footer-label">所选合计：</text>
							<text class="price-red-large"><text class="yuan-sign-sm">¥</text>{{transpoint(price).toFixed(2)}}</text>
							<text class="yuan-unit-text">元</text>
						</view>
						<view class="footer-p-sub" v-if="ulevel">
							<text class="footer-tag-mini freight-tag">{{ulevel.trans > 0 ? '含运费' : '不含运费'}}</text>
							<text class="footer-tag-mini invoice-tag">{{ticket == '0' ? '不含发票' : (ticket == '1' ? '普通发票' : '专用发票')}}</text>
						</view>
					</view>
					<view class="list_footer-btn-capsule" @click.stop="gotoconfirm()">
						<text class="capsule-btn-text">下单结算</text>
						<u-icon name="arrow-right" color="#ffffff" :size="26"></u-icon>
					</view>
				</view>
			</div>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: 'Hello',
				value: 1,
				tabsList: [
					{ name: '不含发票商品' },
					{ name: '普通发票商品' },
					{ name: '专用发票商品' }
				],
				tabCounts: { 0: 0, 1: 0, 2: 0 },
				uid: '',
				ulevel: '',
				list: [],
				nums: 0,
				price: 0,
				ticket: 0,
				loading: '',
				typeIndex: 0,
				current: 0,
				status: false,
				totalRpx: 0,
				pushType: 0,
				showBack: true,
				isTabEmbedded: false,
				pureCodeEmptyIcon: "data:image/svg+xml;utf8," + encodeURIComponent(`
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
						<defs>
							<linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
								<stop offset="0%" stop-color="#0062ff" stop-opacity="0.8"/>
								<stop offset="100%" stop-color="#0045b3" stop-opacity="1"/>
							</linearGradient>
						</defs>
						<circle cx="100" cy="100" r="70" fill="#f1f5f9" />
						<path d="M55 70 h110 l-18 55 h-74 z" fill="none" stroke="url(#grad)" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
						<path d="M40 50 h20 l15 20" fill="none" stroke="#94a3b8" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
						<circle cx="75" cy="142" r="8" fill="#0062ff"/>
						<circle cx="135" cy="142" r="8" fill="#0062ff"/>
					</svg>
				`)
			}
		},
		computed: {
			isAllSelected() {
				if (!this.list || this.list.length === 0) return false;
				return this.list.every(item => item.status === true);
			}
		},
		onLoad(option) {
			this.pushType = option.pushType ? parseInt(option.pushType) : 0;
			this.showBack = true;
			const pages = getCurrentPages();
			const currentPage = pages[pages.length - 1];
			if (currentPage && currentPage.route && currentPage.route.includes('index/index')) {
				this.isTabEmbedded = true;
			} else if (pages.length === 1) {
				this.isTabEmbedded = true;
			}
		},
		onBackPress(options) {
			const pages = getCurrentPages();
			if (pages.length > 1) {
				return false;
			} else {
				uni.switchTab({
					url: '/pages/index/index',
					fail: () => {
						uni.reLaunch({ url: '/pages/index/index' });
					}
				});
				return true; 
			}
		},
		async created() {
			let userInfo = uni.getStorageSync('loginTicket');
			if (userInfo == null || userInfo == "") {
				uni.showModal({
					title: '提示',
					content: '您还未登录，前往登录',
					showCancel: false,
					success: (res) => {
						if (res.confirm) {
							uni.reLaunch({ url: '/pages/login_md/login_md' });
						}
					}
				});
			} else {
				this.uid = userInfo.id;
				this.doIninit();
				this.fetchAllTabCounts();
			}
			uni.$on("confirm", data => {
				this.doIninit();
				this.fetchAllTabCounts();
			});
		},
		methods: {
			handleBackClick() {
				const pages = getCurrentPages();
				if (pages.length > 1) {
					uni.navigateBack({ delta: 1 });
				} else {
					uni.switchTab({
						url: '/pages/index/index',
						fail: () => { uni.reLaunch({ url: '/pages/index/index' }); }
					});
				}
			},
			toggleSelectAll() {
				if (!this.list || this.list.length === 0) return;
				const targetStatus = !this.isAllSelected;
				uni.showLoading({ title: "处理中..." });
				let promises = this.list.map(x => {
					x.status = targetStatus;
					return this.$api.cartcancel({ id: x.id, status: targetStatus ? 1 : 0 });
				});
				Promise.all(promises).then(() => {
					this.doIninit();
					this.fetchAllTabCounts();
					uni.hideLoading();
					uni.showToast({
						title: targetStatus ? '已为您全选本类商品' : '已取消本类全选',
						icon: 'none',
						duration: 1500
					});
				}).catch(() => { uni.hideLoading(); });
			},
			handleStepMinus(x) {
				let limitMin = parseInt(x.minNum || 1);
				let newVal = parseInt(x.nums) - 1;
				if (newVal < limitMin) {
					uni.showToast({ title: `购买数量必须达到起订量（${limitMin}）`, icon: 'none', duration: 2000 });
					return;
				}
				x.nums = newVal;
				this.changeData(x.id, newVal, 0);
			},
			handleStepPlus(x) {
				let newVal = parseInt(x.nums) + 1;
				x.nums = newVal;
				this.changeData(x.id, newVal, 0);
			},
			onInputBlur(x) {
				let val = parseInt(x.nums);
				let limitMin = parseInt(x.minNum || 1);
				if (isNaN(val) || val < limitMin) {
					val = limitMin;
					uni.showToast({ title: `购买数量必须达到起订量（${limitMin}）`, icon: 'none', duration: 2000 });
				}
				x.nums = val;
				this.changeData(x.id, val, 0);
			},
			showLongText(title, val) {
				if (!val) return;
				uni.showModal({
					title: title || '详细内容',
					content: String(val),
					showCancel: false
				});
			},
			clear() {
				let that = this;
				uni.showModal({
					title: '提示',
					content: '确定要清空购物车吗？',
					success: (res) => {
						if (res.confirm) {
							uni.showLoading({ title: "处理中..." });
							that.$api.cartclear({ uid: that.uid }).then(ret => {
								that.doIninit();
								that.fetchAllTabCounts();
								uni.hideLoading();
							}).catch(err => { uni.hideLoading(); });
						}
					}
				});
			},
			del(id) {
				let that = this;
				uni.showModal({
					title: '提示',
					content: '确定要移除这条商品吗？',
					confirmColor: '#d93838', // 确认按钮设为醒目的红色
					success: (res) => {
						if (res.confirm) {
							uni.showLoading({ title: "处理中..." });
							that.$api.cartdel({ id: id }).then(ret => {
								that.doIninit();
								that.fetchAllTabCounts();
								uni.hideLoading();
								uni.showToast({ title: '已成功移除', icon: 'none' });
							}).catch(err => { 
								uni.hideLoading(); 
							});
						}
					}
				});
			},
			gotoconfirm() {
				let that = this;
				if (that.price < 1) {
					uni.showModal({
						title: '提示',
						content: '请至少勾选一个商品',
						showCancel: false,
						success: (res) => {}
					});
					return;
				}
				uni.navigateTo({ url: '/pages/cart/confirm' });
			},
			selector(e, x) {
				let that = this;
				let isChecked = false;
				if (typeof e === 'object' && e !== null) {
					isChecked = e.value !== undefined ? e.value : x.status;
				} else {
					isChecked = Boolean(e);
				}
				uni.showLoading({ title: "处理中..." });
				that.$api.cartcancel({ id: x.id, status: isChecked ? 1 : 0 }).then(ret => {
					that.doIninit();
					that.fetchAllTabCounts();
					uni.hideLoading();
				}).catch(err => { uni.hideLoading(); });
			},
			texChange(typeIndex) {
				this.current = typeIndex;
				this.ticket = typeIndex;
				this.doIninit();
			},
			changeData(e, newNums, type) {
				let that = this;
				uni.showLoading({ title: "处理中..." });
				that.$api.cartup({ id: e, nums: newNums, type: type }).then(ret => {
					uni.hideLoading();
					that.doIninit();
					that.fetchAllTabCounts();
				}).catch(err => { uni.hideLoading(); });
			},
			doIninit() {
				let that = this;
				var params = { uid: that.uid, type: 0, ticket: that.ticket, new: 1 };
				this.$api.Carts(params).then(ret => {
					this.list = ret.data.list || [];
					this.list.forEach(r => {
						r.nums = parseInt(r.nums);
						r.minNum = parseInt(r.info?.min_nums || r.min_nums || 500);
						if (r.nums < r.minNum) r.nums = r.minNum;
						r.status = r.status > 0 ? true : false;
					});
					that.ulevel = ret.data.ulevel;
					that.nums = ret.data.nums;
					that.price = ret.data.price;
					this.$forceUpdate();
				});
			},
			fetchAllTabCounts() {
				if (!this.uid) return;
				[0, 1, 2].forEach(t => {
					this.$api.Carts({ uid: this.uid, type: 0, ticket: t, new: 1 }).then(res => {
						if (res && res.data && res.data.list) {
							this.$set(this.tabCounts, t, res.data.list.length);
						} else {
							this.$set(this.tabCounts, t, 0);
						}
					}).catch(() => { this.$set(this.tabCounts, t, 0); });
				});
			},
			getTabCount(index) {
				return this.tabCounts[index] || 0;
			},
			transpoint(value) {
				return Math.floor((value || 0) * 100) / 100;
			}
		}
	}
</script>

<style lang="scss" scoped>
	.wrap {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		background-color: #f4f6f9;
		box-sizing: border-box;
		align-items: stretch;
	}
	
	.navbar-content-box {
		display: flex;
		align-items: center;
		width: 750rpx;
		height: 112rpx;
		padding: 24rpx 24rpx 0 24rpx;
		box-sizing: border-box;
		position: relative;
	}
	.nav-left-slot {
		width: 80rpx;
		display: flex;
		align-items: center;
		z-index: 2;
	}
	.nav-title-text {
		position: absolute;
		left: 0;
		right: 0;
		font-size: 36rpx;
		color: #0f172a;
		font-weight: 700;
		text-align: center;
		z-index: 1;
	}
	.nav-right-actions {
		margin-left: auto;
		display: flex;
		align-items: center;
		gap: 12rpx;
		z-index: 2;
	}
	.nav-action-btn {
		display: flex;
		align-items: center;
		gap: 4rpx;
		font-size: 24rpx;
		font-weight: 600;
		padding: 6rpx 14rpx;
		border-radius: 16rpx;
	}
	.select-all-btn {
		background: #eff6ff;
		border: 1rpx solid #bfdbfe;
		color: #0062ff;
	}
	.clear-btn {
		background: #fef2f2;
		border: 1rpx solid #fecaca;
		.red-text { color: #d93838; }
	}
	
	.tab-header-container {
		width: 100%;
		background: #ffffff;
		box-sizing: border-box;
		border-bottom: 1rpx solid #cbd5e1;
		border-top: 1rpx solid #e2e8f0;
		margin-top: 4rpx;
		position: relative;
		z-index: 10;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.03);
	}
	.line-segmented-control {
		display: flex;
		width: 100%;
		background-color: transparent;
		position: relative;
		height: 72rpx;
		box-sizing: border-box;
		padding: 0 10rpx;
	}
	.line-tab-item {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		transition: all 0.2s ease;
		.line-tab-text {
			font-size: 26rpx;
			color: #64748b;
			font-weight: 600;
		}
		.tab-badge-num {
			position: absolute;
			top: 10rpx;
			right: 12rpx;
			background-color: #d0021b;
			color: #ffffff;
			font-size: 18rpx;
			font-weight: 700;
			padding: 0 8rpx;
			height: 28rpx;
			line-height: 28rpx;
			border-radius: 14rpx;
			text-align: center;
		}
		&.active {
			.line-tab-text {
				color: #0062ff;
				font-weight: 700;
				font-size: 27rpx;
			}
			&::after {
				content: '';
				position: absolute;
				bottom: 0;
				width: 52rpx;
				height: 4rpx;
				background-color: #0062ff;
				border-radius: 4rpx;
			}
		}
	}
	
	.cart-scroll-container {
		width: 100%;
		display: flex;
		justify-content: center;
		box-sizing: border-box;
	}
	.cart-scroll-inner {
		width: 100%;
		max-width: 750rpx; 
		padding: 24rpx 20rpx 4rpx 20rpx;
		box-sizing: border-box;
	}
	
	/* 科技感微光渐变卡片（已加深边框及纵向间距，支持奇偶交替微调及连续序号区分） */
	.modern-card {
	    border-radius: 20rpx;
	    padding: 22rpx;
	    margin-bottom: 32rpx;
	    box-shadow: 0 10rpx 28rpx rgba(202, 138, 4, 0.12), inset 0 1rpx 0 rgba(255, 255, 255, 0.9);
	    box-sizing: border-box;
	    overflow: hidden;
	    transition: all 0.3s ease;
	}
	
	/* 奇偶交替底色优化：奇数行经典微黄暖调，偶数行细腻科技微光暖米调，交替清晰可辨 */
	.card-item-odd { 
	    background: linear-gradient(135deg, #FFFDEB 0%, #FFF9C4 50%, #FFFBEA 100%);
	    border: 1.5rpx solid rgba(234, 179, 8, 0.75);
	}
	.card-item-even { 
	    background: linear-gradient(135deg, #FFFFFF 0%, #FFFBEB 60%, #FEF9C3 100%);
	    border: 1.5rpx solid rgba(217, 119, 6, 0.5);
	}
	
	.card-top-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 16rpx;
	}
	
	/* 连续序号徽章样式 */
	.card-index-badge-wrap {
		display: flex;
		align-items: center;
		gap: 8rpx;
	}
	.card-serial-number {
		background: #d97706;
		color: #ffffff;
		font-size: 22rpx;
		font-weight: 700;
		padding: 2rpx 12rpx;
		border-radius: 8rpx;
		letter-spacing: 1rpx;
	}
	
	.check-box-wrap {
		background: #f8fafc;
		border: 1rpx solid #cbd5e1;
		padding: 2rpx 12rpx;
		border-radius: 10rpx;
		display: flex;
		align-items: center;
	}
	.check-label-text {
		font-size: 24rpx;
		color: #0f172a;
		margin-left: 6rpx;
		font-weight: 700;
	}
	.card-type-badge {
		background: #0284c7;
		color: #ffffff;
		font-size: 20rpx;
		padding: 4rpx 12rpx;
		border-radius: 8rpx;
		font-weight: 700;
	}
	.del-action-btn {
		display: flex;
		align-items: center;
		gap: 2rpx;
		font-size: 22rpx;
		color: #1e293b;
		background: #ffffff;
		border: 1rpx solid #cbd5e1;
		padding: 4rpx 12rpx;
		border-radius: 10rpx;
		font-weight: 600;
	}
	
	.card-main-content {
		margin-bottom: 4rpx;
	}
	
	/* 统一的双列网格布局系统：让价格和小计完美对齐并排进入单元格 */
	.spec-grid-box-double {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 10rpx 12rpx;
	}
	.spec-grid-item {
		background: transparent;
		border: none;
		padding: 0;
		display: flex;
		align-items: center; 
		font-size: 24rpx; 
		line-height: 1.3;
		&.title-grid-item {
			grid-column: span 2;
			margin-bottom: 10rpx;
		}
		&.full-width-cell {
			grid-column: span 2;
		}
		.s-k { 
			color: #475569; 
			font-weight: 600; 
			white-space: nowrap; 
			margin-right: 4rpx; 
			flex-shrink: 0; 
			font-size: 23rpx;
		}
		.s-v { 
			background: #f8fafc; 
			color: #1e293b; 
			font-weight: 600; 
			overflow: hidden; 
			text-overflow: ellipsis; 
			white-space: nowrap; 
			flex: 1;
			min-width: 0; 
			padding: 8rpx 12rpx; 
			border-radius: 6rpx;
			border: 0.5rpx solid #cbd5e1; 
			font-size: 24rpx; 
		}
		.font-blue { color: #0052d9 !important; font-weight: 700; }
		.font-red { color: #d93838 !important; font-weight: 700; }
		.font-dark { color: #0f172a !important; font-weight: 700; }
		.font-remark { color: #d97706 !important; font-weight: 700; }
		.font-price { color: #d93838 !important; font-size: 28rpx; font-weight: 700; }
		.yuan-sign { font-size: 20rpx; font-weight: 600; margin-right: 2rpx; }
	}
	
	/* 底部调整数量：右侧对齐并保持横向 */
	.card-nums-lower-row {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		padding-top: 14rpx;
		border-top: 1rpx dashed rgba(202, 138, 4, 0.4);
		margin-top: 14rpx;
	}
	
	/* 右侧调整数量容器（靠右排布） */
	.nums-right-group {
		display: flex;
		align-items: center;
		.label-muted { 
			font-size: 24rpx; 
			color: #475569; 
			font-weight: 600; 
			margin-right: 6rpx;
			white-space: nowrap;
		}
	}
	
	.nums-step-action-enlarged {
		display: flex;
		align-items: center;
		background: #ffffff;
		border: 1rpx solid #cbd5e1;
		border-radius: 8rpx;
		overflow: hidden;
		box-shadow: 0 2rpx 6rpx rgba(0,0,0,0.02);
		.custom-step-btn {
			width: 52rpx;
			height: 48rpx;
			background: #f8fafc;
			color: #0062ff;
			font-size: 32rpx;
			font-weight: 700;
			display: flex;
			align-items: center;
			justify-content: center;
			&:active { background: #e2e8f0; }
		}
		.custom-step-input {
			width: 84rpx;
			height: 48rpx;
			text-align: center;
			font-size: 28rpx;
			font-weight: 700;
			color: #0f172a;
			background: #ffffff;
			border-left: 1rpx solid #cbd5e1;
			border-right: 1rpx solid #cbd5e1;
		}
	}
	
	.sub-attr-list-container {
		background: #f8fafc;
		border-radius: 8rpx;
		padding: 6rpx 10rpx;
		margin-bottom: 6rpx;
		border: 1rpx solid #e2e8f0;
	}
	.sub-attr-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 4rpx 0;
		border-bottom: 1rpx solid #cbd5e1;
		&:last-child { border-bottom: none; }
	}
	.sub-attr-name { font-size: 24rpx; color: #334155; font-weight: 600; }
	.sub-attr-control-row {
		display: flex;
		align-items: center;
		gap: 10rpx;
		.sub-attr-price { font-size: 24rpx; color: #d93838; font-weight: 700; }
	}
	.sub-nums-wrapper {
		display: flex;
		align-items: center;
		.btn-box-custom {
			width: 34rpx;
			height: 34rpx;
			border: 1rpx solid #cbd5e1;
			background: #fff;
			color: #0062ff;
			text-align: center;
			line-height: 32rpx;
			font-size: 24rpx;
			border-radius: 4rpx;
		}
		.input-box-custom {
			width: 56rpx;
			height: 34rpx;
			border-top: 1rpx solid #cbd5e1;
			border-bottom: 1rpx solid #cbd5e1;
			text-align: center;
			font-size: 24rpx;
			color: #0f172a;
		}
	}
	
	/* 底部结算悬浮栏：科技橘金重构版，彻底告别单调纯白，拥有高质感沉浸包裹区 */
	.list_footer_wrapper {
		position: fixed;
		left: 20rpx;
		right: 20rpx;
		background: linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%);
		border-radius: 20rpx;
		box-shadow: 0 -8rpx 30rpx rgba(217, 119, 6, 0.18); 
		z-index: 999;
		box-sizing: border-box;
		border: 1.5rpx solid rgba(245, 158, 11, 0.6);
		overflow: hidden;
		padding-bottom: env(safe-area-inset-bottom);
	}
	.footer-inner-container {
		width: 100%;
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
	}
	.footer-marquee-tip-bar {
		background: rgba(255, 255, 255, 0.7);
		border-bottom: 1rpx solid rgba(245, 158, 11, 0.25);
		height: 40rpx;
		display: flex;
		align-items: center;
		padding: 0 20rpx;
		box-sizing: border-box;
		overflow: hidden;
	}
	.marquee-icon { display: flex; align-items: center; margin-right: 8rpx; flex-shrink: 0; }
	.marquee-box { flex: 1; overflow: hidden; position: relative; height: 100%; display: flex; align-items: center; }
	.marquee-content {
		display: flex;
		width: max-content;
		white-space: nowrap;
		will-change: transform;
		animation: seamlessMarquee 24s linear infinite;
	}
	.tip-segment-pay { font-size: 22rpx; color: #d97706; font-weight: 700; }
	.tip-segment-notice { font-size: 22rpx; color: #64748b; font-weight: 600; }
	.tip-segment-divider { display: inline-block; width: 100rpx; }
	@keyframes seamlessMarquee {
		0% { transform: translateX(0) translateZ(0); }
		100% { transform: translateX(-50%) translateZ(0); }
	}
	
	.list_footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 16rpx 24rpx;
		box-sizing: border-box;
		background: transparent;
	}
	.list_footer-info { display: flex; flex-direction: column; gap: 6rpx; }
	.footer-main-row {
		display: flex;
		align-items: baseline;
		.footer-label { font-size: 25rpx; color: #475569; font-weight: 600; }
		.price-red-large { font-size: 38rpx; font-weight: 700; color: #d93838; margin-left: 2rpx; }
		.yuan-unit-text { font-size: 23rpx; color: #d93838; font-weight: 600; margin-left: 2rpx; }
	}
	.footer-p-sub { display: flex; align-items: center; gap: 12rpx; }
	.footer-tag-mini { font-size: 20rpx; padding: 2rpx 10rpx; border-radius: 6rpx; font-weight: 600; }
	.freight-tag { background: #eff6ff; color: #0062ff; border: 1rpx solid #bfdbfe; }
	.invoice-tag { background: #f1f5f9; color: #475569; border: 1rpx solid #cbd5e1; }
	
	/* 底部科技橘金胶囊按钮重构：告别白色直角，呈现出高级交相辉映的科技炫光感 */
	.list_footer-btn-capsule {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 6rpx;
		background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%);
		color: #ffffff;
		padding: 18rpx 36rpx;
		border-radius: 40rpx;
		box-shadow: 0 6rpx 16rpx rgba(234, 88, 12, 0.35);
		transition: all 0.2s ease;
		&:active {
			transform: scale(0.96);
			opacity: 0.9;
		}
		.capsule-btn-text {
			font-size: 28rpx;
			font-weight: 700;
			letter-spacing: 1rpx;
		}
	}
	
	/* ========================================== */
	/* 专属美化：完美融合浅黄色卡片的输入框/展示框样式 */
	/* ========================================== */
	
	/* 1. 规格表单里的各项文本/数值展示框（告别发灰） */
	.modern-card .spec-grid-item .s-v {
		background: rgba(255, 255, 255, 0.85) !important; 
		border: 1rpx solid rgba(234, 179, 8, 0.35) !important; 
		box-shadow: inset 0 1rpx 2rpx rgba(0, 0, 0, 0.02);
	}
	
	/* 2. 底部数量加减中间的数字输入框 */
	.nums-step-action-enlarged {
		background: rgba(255, 255, 255, 0.9) !important;
		border: 1rpx solid rgba(234, 179, 8, 0.4) !important;
		
		.custom-step-btn {
			background: rgba(254, 243, 199, 0.5) !important; 
			color: #d97706 !important;
			border-color: rgba(234, 179, 8, 0.3) !important;
		}
		
		.custom-step-input {
			background: transparent !important;
			border-left: 1rpx solid rgba(234, 179, 8, 0.3) !important;
			border-right: 1rpx solid rgba(234, 179, 8, 0.3) !important;
		}
	}
	
	/* 3. 多属性组合包里的数值输入与背景优化 */
	.sub-attr-list-container {
		background: rgba(255, 255, 255, 0.6) !important;
		border: 1rpx solid rgba(234, 179, 8, 0.3) !important;
	}
	.sub-nums-wrapper {
		.input-box-custom {
			background: rgba(255, 255, 255, 0.9) !important;
			border-color: rgba(234, 179, 8, 0.3) !important;
		}
		.btn-box-custom {
			background: rgba(254, 243, 199, 0.6) !important;
			border-color: rgba(234, 179, 8, 0.3) !important;
			color: #d97706 !important;
		}
	}
</style>