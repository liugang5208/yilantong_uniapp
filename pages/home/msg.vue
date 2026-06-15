<template>
	<view>
		<u-navbar :is-back="false" title="">
			<view class="d_a_sb " style="width: 750rpx;">
				<view style="width: 200rpx;padding-left: 30rpx;" @click="back">
					<u-icon name="nav-back" color="#606266" :size="44">
					</u-icon>
				</view>

				<view style="font-size: 30rpx; color: #000; font-weight: bold; text-align: center; flex-grow: 1;">消息中心</view>
				<view style="width: 200rpx;padding-right: 30rpx; color: #488aff; text-align: right;" @click="qingkong">清空</view>
			</view>
		</u-navbar>

		<view class="list_item" v-for="(x,i) in info.list" :key="i">
			<view class="list_item_notice">
				<view class="list_item_notice-msg">
					<image mode="widthFix" :src="'/static/icon/ic_msg_'+x.icon+'.png'" />
					{{x.types>0?'订单发货通知':'系统通知消息'}}
				</view>
			</view>
			<view class="list_item_time">{{x.time_zone}}</view>
			<view class="list_item_msg">主题：
				<span :class="x.color==1 ? 'green' : x.color==2?'red':x.color==3?'blue':''">{{x.theme}}</span>
			</view>
			<view class="list_item_btn">
				<view>
					<u-button style="width: 130rpx;" size="mini" @click="doDels(x.id)" type="error">删除</u-button>
				</view>
				<view>
					<u-button style="width: 130rpx;margin-left: 30rpx;" size="mini" @click="gotoMsginfo(x.id)" type="primary">查看详情</u-button>
				</view>

			</view>

		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				uid: '',
				info: {},
				loading: '',

			}
		},
		onLoad() {
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
		},
		methods: {
			back() {
				uni.navigateBack()
			},
			qingkong() {
				uni.showModal({
					title: '提示',
					content: '是否清空消息？',
					success: (res) => {
						if (res.confirm) {
							let that = this;
							that.$api.msgs_dels( {
								uid: that.uid
							}).then(ret => {
								this.doIninit()
							}).catch(err => {
								console.log(err.status);
								console.log(err.error);
								console.log(err.headers);
							});
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			doIninit() {
				let that = this;
				let params = {
					uid: that.uid
				};
				that.$api.msg_list(params).then(ret => {
					that.info = ret.data;
				}).catch(err => {
					console.log(err.status);
					console.log(err.error);
					console.log(err.headers);
				});
			},
			  gotoMsginfo(id) {
				uni.navigateTo({
					url:'/pages/home/msginfo?ids='+id
				})
			  },
			doDels(id) {
				uni.showModal({
					title: '提示',
					content: '确定要删除吗？',
					success: (res) => {
						if (res.confirm) {
							let that = this;
							var params = {
								id: id
							};
							that.$api.sys_msgs(params).then(ret => {
								that.doIninit();
							})
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});

			}
		}
	}
</script>

<style scoped lang="scss">
	.content-ios {
		background: #f8f8f8;
	}

	.tops {
		display: flex;
		padding: 0rem 24rpx;
	}

	.top_item {
		color: #f5a623;
		flex: 1;
		font-size: 28rpx;
		height: 72rpx;
		line-height: 72rpx;
	}

	.top_item:last-child {
		color: #4a90e2;
		text-align: right;
	}

	.green {
		color: green;
	}

	.red {
		color: red;
	}

	.blue {
		color: blue;
	}

	.list_item {
		background: white;
		font-size: 28rpx;
		padding: 32rpx 24rpx;
		margin-bottom: 16rpx;
	}

	.list_item_notice {
		display: flex;
	}

	.list_item_notice-msg {
		flex: 2;
		height: 38rpx;
		line-height: 38rpx;
	}

	.list_item_notice-msg image {
		margin-top: -4rpx;
		margin-right: 16rpx;
		vertical-align: middle;
		width: 38rpx;
	}

	.list_item_notice-status {
		flex: 1;
		height: 38rpx;
		line-height: 38rpx;
		text-align: right;
	}

	.list_item_notice-status.active {
		color: #d0021b;
	}

	.list_item_notice-status.wait {
		color: #999999;
	}

	.list_item_time {
		color: #999999;
		height: 60rpx;
		line-height: 60rpx;
	}

	.list_item_msg {
		font-size: 30rpx;
		margin-bottom: 40rpx;
	}

	.list_item_btn {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: flex-end;
	}
</style>