<template>
	<view class="container">
		<!-- 顶部企业身份看板 -->
		<view class="header-card" style="background: linear-gradient(135deg, rgba(51, 65, 85, 0.95) 0%, rgba(30, 41, 59, 0.98) 100%);">
			<view class="card-top-row">
				<view class="account-box">
					<text class="account-label">登录账号：</text>
					<text class="account-val">{{ infos.phone || '-' }}</text>
				</view>
				<view class="edit-btn" @click="NavToProfi()">
					<text>编辑资料 ⚙</text>
				</view>
			</view>
			
			<view class="info-row">
				<text class="label">账户类别：</text>
				<text class="val">{{ infos.ac_name || '企业单位' }}</text>
			</view>
			<view class="info-row">
				<text class="label">账户名称：</text>
				<text class="val lineover">{{ infos.nickname || '成都市金川电缆集团有限公司' }}</text>
			</view>
			<view class="info-row">
				<text class="label">注册地址：</text>
				<text class="val lineover">{{ infos.prov_name || '四川' }}·{{ infos.city_name || '成都' }}·{{ infos.label_name || '金牛区' }}</text>
			</view>
			<view class="info-row">
				<text class="label">注册日期：</text>
				<text class="val">{{ infos.formatted_time || '-' }}</text>
			</view>

			<view class="card-bottom-row">
				<view class="tags-group">
					<text class="biz-tag standard-tag" :style="{ background: currentTagBgColor }">
						{{ infos.ac_level_name || '标准一' }}
					</text>
					<text class="biz-tag" :class="infos.ac_credit > 0 ? 'signed-tag' : 'unsigned-tag'">
						{{ infos.ac_credit > 0 ? '已签约' : '未签约' }}
					</text>
				</view>
				<text class="card-service-btn" @click="makePhoneCall()">
					<text class="service-icon">🎧</text>
					<text class="service-label">联系客服</text>
				</text>
			</view>
		</view>

		<!-- 悬浮订单状态卡片 -->
		<view class="card-box navi-card-box">
			<view class="navi-item" @click="NavToOrder(0)">
				<image mode="widthFix" :src="svgIcons.pay" />
				<text class="navi-text">待付款</text>
				<text class="badge" v-if="infos.order_wait > 0">{{ infos.order_wait }}</text>
			</view>
			<view class="navi-item" @click="NavToOrder(1)">
				<image mode="widthFix" :src="svgIcons.trans" />
				<text class="navi-text">待发货</text>
				<text class="badge" v-if="infos.order_trans > 0">{{ infos.order_trans }}</text>
			</view>
			<view class="navi-item" @click="NavToOrder(2)">
				<image mode="widthFix" :src="svgIcons.save" />
				<text class="navi-text">待收货</text>
				<text class="badge" v-if="infos.order_saves > 0">{{ infos.order_saves }}</text>
			</view>
			<view class="navi-item" @click="NavToOrder(3)">
				<image mode="widthFix" :src="svgIcons.roll" />
				<text class="navi-text">已完成</text>
			</view>
		</view>

		<!-- 功能列表菜单区 -->
		<view class="card-box menu-list-box">
			<view class="line" @click="NavToCart()">
				<view class="d_a">
					<image mode="widthFix" :src="svgIcons.cart" />
					<text>购物车</text>
				</view>
				<image src="/static/icon/ic_right_gy.png" class="line_image_right" />
			</view>
			<view class="line" @click="gotoReport()">
				<view class="d_a">
					<image mode="widthFix" :src="svgIcons.report" />
					<text>报价单</text>
				</view>
				<image src="/static/icon/ic_right_gy.png" class="line_image_right" />
			</view>
			<view class="line" @click="gotoReportLis()">
				<view class="d_a">
					<image mode="widthFix" :src="svgIcons.history" />
					<text>历史报价单</text>
				</view>
				<image src="/static/icon/ic_right_gy.png" class="line_image_right" />
			</view>
			<view class="line" @click="NavToAddr()">
				<view class="d_a">
					<image mode="widthFix" :src="svgIcons.addr" />
					<text>地址管理</text>
				</view>
				<image src="/static/icon/ic_right_gy.png" class="line_image_right" />
			</view>
			<view class="line" @click="NavToTicket()">
				<view class="d_a">
					<image mode="widthFix" :src="svgIcons.ticket" />
					<text>发票管理</text>
				</view>
				<image src="/static/icon/ic_right_gy.png" class="line_image_right" />
			</view>
			<view class="line" @click="NavToHelp()">
				<view class="d_a">
					<image mode="widthFix" :src="svgIcons.help" />
					<text>帮助中心</text>
				</view>
				<image src="/static/icon/ic_right_gy.png" class="line_image_right" />
			</view>
			<view class="line" @click="NavToSetting()">
				<view class="d_a">
					<image mode="widthFix" :src="svgIcons.setting" />
					<text>设置</text>
				</view>
				<image src="/static/icon/ic_right_gy.png" class="line_image_right" />
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: 'Hello',
				infos: {},
				uid: '',

				tagColors: [
					'#0284c7', 
					'#d97706', 
					'#6366f1', 
					'#8b5cf6', 
					'#0d9488'  
				],

				svgIcons: {
					pay: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23e0f2fe' stroke='%230284c7' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><rect x='2' y='5' width='20' height='14' rx='3'/><path d='M2 10h20'/><circle cx='17' cy='15' r='1.5' fill='%230284c7'/></svg>",
					trans: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23e0f2fe' stroke='%230284c7' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><rect x='1' y='3' width='15' height='13' rx='2'/><polygon points='16 8 20 8 23 11 23 16 16 16 16 8'/><circle cx='5.5' cy='18.5' r='2.5' fill='%230284c7'/><circle cx='18.5' cy='18.5' r='2.5' fill='%230284c7'/></svg>",
					save: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23e0f2fe' stroke='%230284c7' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M21 8v13H3V8z'/><path d='M1 3h22v5H1z'/><path d='M10 12h4' stroke-width='2.5'/></svg>",
					roll: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23e0f2fe' stroke='%230284c7' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><circle cx='12' cy='12' r='10' fill='%23e0f2fe'/><path d='M9 12l2 2 4-4'/></svg>",

					cart: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23f1f5f9' stroke='%23475569' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><circle cx='9' cy='21' r='1.5' fill='%23475569'/><circle cx='20' cy='21' r='1.5' fill='%23475569'/><path d='M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6'/></svg>",
					report: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23f1f5f9' stroke='%23475569' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z'/><polyline points='14 2 14 8 20 8'/><line x1='16' y1='13' x2='8' y2='13'/><line x1='16' y1='17' x2='8' y2='17'/></svg>",
					history: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23f1f5f9' stroke='%23475569' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><circle cx='12' cy='12' r='10' fill='%23f1f5f9'/><path d='M12 6v6l4 2'/></svg>",
					addr: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23f1f5f9' stroke='%23475569' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z'/><circle cx='12' cy='10' r='3' fill='%23475569'/></svg>",
					ticket: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23f1f5f9' stroke='%23475569' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1z'/><line x1='8' y1='8' x2='16' y2='8'/><line x1='8' y1='12' x2='16' y2='12'/></svg>",
					help: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23f1f5f9' stroke='%23475569' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><circle cx='12' cy='12' r='9'/><path d='M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3'/><line x1='12' y1='17' x2='12.01' y2='17' stroke-width='3'/></svg>",
					setting: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><circle cx='12' cy='12' r='10' fill='%23f1f5f9'/><path d='M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06-.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z' fill='none' stroke='%23475569' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/><circle cx='12' cy='12' r='3' fill='%23475569'/></svg>"
				}
			}
		},
		computed: {
			currentTagBgColor() {
				const levelName = (this.infos && this.infos.ac_level_name) ? this.infos.ac_level_name : '';
				if (!levelName) return this.tagColors[0];
				const matchNum = levelName.match(/\d+/);
				if (matchNum) {
					const num = parseInt(matchNum[0], 10);
					return this.tagColors[(Math.abs(num) - 1) % this.tagColors.length];
				}
				if (levelName.indexOf('一') !== -1) return this.tagColors[0];
				if (levelName.indexOf('二') !== -1 || levelName.indexOf('中') !== -1) return this.tagColors[1];
				if (levelName.indexOf('三') !== -1 || levelName.indexOf('高') !== -1) return this.tagColors[2];
				if (levelName.indexOf('四') !== -1) return this.tagColors[3];
				if (levelName.indexOf('五') !== -1) return this.tagColors[4];
				return this.tagColors[0];
			}
		},
		async created() {
			let userInfo = uni.getStorageSync('loginTicket');
			if (!userInfo) {
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
			}
			uni.$on("upset_head", () => {
				this.doIninit();
			})
		},
		onUnload() {
			uni.$off("upset_head");
		},
		onPullDownRefresh() {
			if (uni.getStorageSync('loginTicket')) {
				this.doIninit();
			} else {
				uni.stopPullDownRefresh();
			}
		},
		methods: {
			makePhoneCall() {
				let phone = this.infos && this.infos.ac_level_tel;
				if (!phone) {
					uni.showToast({ title: '暂无客服电话', icon: 'none' });
					return;
				}
				uni.makePhoneCall({ phoneNumber: phone });
			},
			NavToOrder(st) {
				uni.navigateTo({ url: '/pages/my/order/order?st=' + st });
			},
			NavToSetting() {
				uni.navigateTo({ url: '/pages/my/setindex/setindex' });
			},
			NavToHelp() {
				uni.navigateTo({ url: '/pages/my/heindex/heindex' });
			},
			NavToCart() {
				uni.navigateTo({ url: '/pages/cart/cart?pushType=1' });
			},
			NavToAddr() {
				uni.navigateTo({ url: '/pages/my/adindex/adindex' });
			},
			NavToTicket() {
				uni.navigateTo({ url: '/pages/my/tiindex/tiindex' });
			},
			gotoReport() {
				uni.navigateTo({ url: '/pages/report/repinfos' });
			},
			gotoReportLis() {
				uni.navigateTo({ url: '/pages/report/repindex' });
			},
			doIninit() {
				var params = { uid: uni.getStorageSync('loginTicket').id, new: 1 };
				this.$api.Users(params).then(res => {
					let data = res.data || {};
					
					// 精准适配时间戳转换：同时兼容 create_time, reg_time, times 等可能的字段
					let rawTime = data.create_time || data.reg_time || data.times;
					if (rawTime && !isNaN(rawTime)) {
						let dateObj = new Date(Number(rawTime) * 1000);
						let year = dateObj.getFullYear();
						let month = String(dateObj.getMonth() + 1).padStart(2, '0');
						let day = String(dateObj.getDate()).padStart(2, '0');
						data.formatted_time = `${year}-${month}-${day}`;
					} else {
						data.formatted_time = rawTime || '-';
					}

					this.infos = data;
					uni.stopPullDownRefresh();
				}).catch(() => {
					uni.stopPullDownRefresh();
					uni.showToast({ title: '网络开小差了，请下拉刷新', icon: 'none' });
				});
			},
			NavToProfi() {
				uni.navigateTo({ url: '/pages/poindex/poindex' });
			}
		}
	}
</script>

<style scoped lang="scss">
	.container {
		background-color: #f4f6f9;
		min-height: 100vh;
		/* 核心修改：通过 env(safe-area-inset-top) 和 var(--status-bar-height) 动态计算并空出系统状态栏高度，彻底解决重叠问题 */
		padding-top: calc(env(safe-area-inset-top) + var(--status-bar-height, 20px) + 10rpx);
		padding-right: 24rpx;
		padding-bottom: 40rpx;
		padding-left: 24rpx;
		box-sizing: border-box;
	}

	.header-card {
		border-radius: 20rpx;
		padding: 30rpx 32rpx;
		box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.12);
		margin-bottom: 20rpx;
		color: #ffffff;
		border: 1rpx solid rgba(255, 255, 255, 0.15);
	}

	.card-top-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 24rpx;
		padding-bottom: 16rpx;
		border-bottom: 1rpx solid rgba(255, 255, 255, 0.12);
		margin-bottom: 16rpx;

		.account-box {
			display: flex;
			align-items: center;
			.account-label { color: rgba(255, 255, 255, 0.75); }
			.account-val { color: #ffffff; }
		}

		.edit-btn {
			background: rgba(255, 255, 255, 0.12);
			padding: 4rpx 16rpx;
			border-radius: 20rpx;
			color: #ffffff;
			font-size: 22rpx;
			border: 1rpx solid rgba(255, 255, 255, 0.2);
		}
	}

	.info-row {
		font-size: 26rpx;
		margin-bottom: 10rpx;
		display: flex;
		line-height: 1.4;

		.label {
			color: rgba(255, 255, 255, 0.75);
			flex-shrink: 0;
		}

		.val { color: #ffffff; }
		.lineover {
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}

	.card-bottom-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 22rpx;
		padding-top: 18rpx;
		border-top: 1rpx solid rgba(255, 255, 255, 0.12);
	}

	.tags-group {
		display: flex;
		gap: 14rpx;
		align-items: center;
		flex-wrap: wrap;
		flex: 1;
		margin-right: 20rpx;

		.biz-tag {
			font-size: 22rpx;
			padding: 6rpx 20rpx;
			border-radius: 8rpx;
			font-weight: 600;
			display: inline-flex;
			align-items: center;
			white-space: nowrap;
			box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.2);
		}

		.standard-tag {
			color: #ffffff;
			border: 1rpx solid rgba(255, 255, 255, 0.5);
		}

		.signed-tag {
			background: #0284c7;
			color: #ffffff;
			border: 1rpx solid rgba(255, 255, 255, 0.5);
		}

		.unsigned-tag {
			background: #ea580c;
			color: #ffffff;
			border: 1rpx solid rgba(255, 255, 255, 0.5);
		}
	}

	.card-service-btn {
		background: rgba(255, 255, 255, 0.15);
		border: 1rpx solid rgba(255, 255, 255, 0.25);
		padding: 8rpx 20rpx;
		border-radius: 30rpx;
		display: flex;
		align-items: center;
		gap: 8rpx;
		flex-shrink: 0;
		box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.1);

		.service-icon { font-size: 24rpx; }
		.service-label { font-size: 22rpx; color: #ffffff; }
	}

	.card-box {
		background: #ffffff;
		border-radius: 20rpx;
		box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.03);
		margin-bottom: 20rpx;
		overflow: hidden;
	}

	.navi-card-box {
		display: flex;
		padding: 28rpx 0;
	}

	.navi-item {
		flex: 1;
		text-align: center;
		position: relative;

		image {
			width: 56rpx;
			height: 56rpx;
			margin-bottom: 6rpx;
		}

		.navi-text {
			display: block;
			color: #334155;
			font-size: 24rpx;
			font-weight: 500;
		}

		.badge {
			display: flex;
			align-items: center;
			justify-content: center;
			background: linear-gradient(135deg, #f43f5e 0%, #e11d48 100%);
			color: #ffffff;
			font-size: 20rpx;
			font-weight: bold;
			min-width: 36rpx;
			height: 36rpx;
			padding: 0 6rpx;
			border-radius: 18rpx;
			position: absolute;
			top: -4rpx;
			right: 22rpx;
			box-shadow: 0 4rpx 10rpx rgba(225, 29, 72, 0.4);
			border: 2rpx solid #ffffff;
			box-sizing: border-box;
		}
	}

	.line {
		height: 104rpx;
		font-size: 28rpx;
		color: #1e293b;
		padding: 0 28rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-bottom: 1rpx solid #f8fafc;

		&:last-child { border-bottom: none; }

		.d_a {
			display: flex;
			align-items: center;

			image {
				width: 44rpx;
				height: 44rpx;
				margin-right: 20rpx;
			}
		}
	}

     .line_image_right {
		width: 30rpx;
		height: 30rpx;
		opacity: 0.35;
	}
</style>