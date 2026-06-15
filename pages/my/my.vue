<template>
	<view>
		<view class="u-page">
			<!-- 所有内容的容器 -->
			<view class="header">
				<image src="/static/icon/user_bg.png" mode="widthFix" class="bg" />
				<view class="header_thumb" @click="NavToHead()">
					<image :src="infos.headimgurl" mode="widthFix" />
				</view>
				<view class="header_info" @click="NavToProfi()">
					<p>类型：{{infos.ac_name}}</p>
					<p>名称：{{infos.nickname}}</p>
					<p class="lineover">地址：{{infos.prov_name}}{{infos.city_name}}{{infos.label_name}}{{infos.street}}</p>
					<p>账号：{{infos.phone}}</p>
					<p>账号等级：{{infos.ac_level_name}}</p>
					<p>是否签约：{{infos.ac_credit>0?'是':'否'}}</p>
				</view>
				<view class="header_right" @click="NavToProfi()">
					<image mode="widthFix" src="/static/icon/ic_right_wt.png" />
				</view>
			</view>

			<view class="navi">
				<view class="navi_item" @click="NavToOrder(0)">
					<image mode="widthFix" src="/static/icon/ic_ord_pay.png" />
					<p>待付款</p>
					<span v-if="infos.order_wait>0">{{infos.order_wait}}</span>
				</view>
				<view class="navi_item" @click="NavToOrder(1)">
					<image mode="widthFix" src="/static/icon/ic_ord_trans.png" />
					<p>待发货</p>
					<span v-if="infos.order_trans>0">{{infos.order_trans}}</span>
				</view>
				<view class="navi_item" @click="NavToOrder(2)">
					<image mode="widthFix" src="/static/icon/ic_ord_save.png" />
					<p>待收货</p>
					<span v-if="infos.order_saves>0">{{infos.order_saves}}</span>
				</view>
				<view class="navi_item" @click="NavToOrder(3)">
					<image mode="widthFix" src="/static/icon/ic_ord_roll.png" />
					<p>已完成</p>
				</view>

			</view>

			<view class="line" @click="NavToCart()">
				<view class="d_a">
					<image mode="widthFix" src="/static/icon/ic_caty.png" />
					<span>购物车</span>
				</view>
				<image  src="/static/icon/ic_right_gy.png" class="line_image_right" />
			</view>
			<view class="line" @click="gotoReport()">
				<view class="d_a">
					<image mode="widthFix" src="/static/icon/ic_b_list.png" />
					<span>报价单</span>
				</view>

				<image  src="/static/icon/ic_right_gy.png" class="line_image_right" />
			</view>
			<view class="line" @click="gotoReportLis()">

				<view class="d_a">
					<image mode="widthFix" src="/static/icon/ic_b_his.png" />
					<span>历史报价单</span>
				</view>

				<image  src="/static/icon/ic_right_gy.png" class="line_image_right" />
			</view>
			<view class="line" @click="NavToAddr()">
				<view class="d_a">
					<image mode="widthFix" src="/static/icon/ic_addr.png" />
					<span>地址管理</span>
				</view>

				<image  src="/static/icon/ic_right_gy.png" class="line_image_right" />
			</view>
			<view class="line" @click="NavToTicket()">
				<view class="d_a">
					<image mode="widthFix" src="/static/icon/ic_ticket.png" />
					<span>发票管理</span>
				</view>
				<image  src="/static/icon/ic_right_gy.png" class="line_image_right" />
			</view>
			<view class="line" @click="NavToHelp()">
				<view class="d_a">
					<image mode="widthFix" src="/static/icon/ic_help.png" />
					<span>帮助中心</span>
				</view>
				<image  src="/static/icon/ic_right_gy.png" class="line_image_right" />
			</view>
			<view class="line" @click="NavToSetting()">
				<view class="d_a">
					<image mode="widthFix" src="/static/icon/ic_setting.png" />
					<span>设置</span>
				</view>
				<image  src="/static/icon/ic_right_gy.png" class="line_image_right" />
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
							uni.reLaunch({
								url: '/pages/login_md/login_md'
							})
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			} else {
				console.log(userInfo);
				this.uid = userInfo.id
				this.doIninit()
			}
			uni.$on("upset_head",data=>{
				this.doIninit()
			})
		},

		methods: {
			NavToHead(){
				uni.navigateTo({
					url:'/pages/my/pohead'
				})
			},
			NavToOrder(st) {
				uni.navigateTo({
					url: '/pages/my/order/order?st=' + st
				})
			},
			NavToSetting() {
				uni.navigateTo({
					url: '/pages/my/setindex/setindex'
				})
			},
			NavToHelp() {
				uni.navigateTo({
					url: '/pages/my/heindex/heindex'
				})
			},
			NavToCart() {
				uni.navigateTo({
					url: '/pages/cart/cart?pushType=1'
				})
			},
			NavToAddr() {
				uni.navigateTo({
					url: '/pages/my/adindex/adindex'
				})
			},
			NavToTicket() {
				uni.navigateTo({
					url: '/pages/my/tiindex/tiindex'
				})
			},
			gotoReport() {
				uni.navigateTo({
					url: '/pages/report/repinfos'
				})
			},
			gotoReportLis() {
				uni.navigateTo({
					url: '/pages/report/repindex'
				})
			},
			doIninit() {
				let that = this;
				var params = {
					uid: uni.getStorageSync('loginTicket').id,
					new:1,
				};
				this.$api.Users(params).then(res => {
					this.infos = res.data;
				}).catch(err => {});
			},
			/**
			 * 个人信息
			 */
			NavToProfi() {
				uni.navigateTo({
					url: '/pages/poindex/poindex'
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.header {
		position: relative;
		width: 100%;
	}

	.header image.bg {
		vertical-align: middle;
		width: 100%;
	}

	.header_thumb {
		border-radius: 50%;
		height: 150rpx;
		left: 20rpx;
		overflow: hidden;
		position: absolute;
		top: 63rpx;
		width: 150rpx;
		z-index: 10;
	}

	.header_thumb image {
		vertical-align: middle;
		width: 100%;

	}

	.header_info {
		color: white;
		font-size: 24rpx;
		left: 250rpx;
		position: absolute;
		right: 60rpx;
		top: 20rpx;
		padding-top: var(--status-bar-height);
	}

	.header_info p {
		margin: 0rem 0rem 0.3rem;
	}

	.header_right {
		position: absolute;
		right: 24rpx;
		top: 52rpx;
	}

	.header_right image {
		vertical-align: middle;
		width: 40rpx;
	}

	.navi {
		display: flex;
	}

	.navi_item {
		flex: 1;
		padding: 30rpx 0rem 40rpx;
		position: relative;
		text-align: center;
	}

	.navi_item2 {
		box-shadow: -10px 0px 17px 0px rgba(0, 0, 0, 0.04);
		flex: 1.5;
	}

	.navi_item image {
		vertical-align: middle;
		width: 56rpx;
	}

	.navi_item p {
		color: #333333;
		font-size: 24rpx;
		margin: 0.4rem 0rem 0rem;
	}

	.navi_item span {
		background: #d0021b;
		display: inline-block;
		border-radius: 50%;
		color: white;
		font-size: 20rpx;
		height: 36rpx;
		line-height: 36rpx;
		position: absolute;
		text-align: center;
		width: 36rpx;
		right: 50rpx;
		top: 30rpx;
	}

	.line {
		border-top: 0.1rem solid #eeeeee;
		height: 100rpx;
		font-size: 30rpx;
		line-height: 100rpx;
		padding: 0rem 20rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.line:last-child {
		border-bottom: 2rpx solid #eeeeee;
	}

	.line image {
		margin-right: 12rpx;
		margin-top: -6rpx;
		vertical-align: middle;
		width: 50rpx;
	}

	.line_image_right {
		width: 40rpx;
		height: 40rpx;
	}
</style>