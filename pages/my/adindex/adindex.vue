<template>
	<view>
		<u-navbar :is-back="false" title="">
			<view class="d_a_sb " style="width: 750rpx;">
				<view style="width: 200rpx;padding-left: 30rpx;" @click="back">
					<u-icon name="nav-back" color="#606266" :size="44">
					</u-icon>
				</view>
				<view style="font-size: 30rpx; color: #000; font-weight: bold; text-align: center; flex-grow: 1;">地址管理</view>
				<view style="width: 200rpx;padding-right: 30rpx; color: #488aff; text-align: right;" @click="gotoAddon">添加地址</view>
			</view>
		</u-navbar>
		<view class="ticket" v-for="(item,index) in list" :key="index">
			<view class="ticket_info">
				<p>收货人：{{item.name}}</p>
				<p>地址：{{item.p_name}}{{item.c_name}}{{item.l_name}}{{item.street}}</p>
				<p>联系电话：{{item.phone}}</p>
			</view>
			<view class="ticket_button">
				<view class="ticket_btn_left">{{item.def>0?'默认地址':'-'}}</view>
				<view class="ticket_btn_item" @click="doDels(item.id)">删除</view>
				<view class="ticket_btn_item" @click="gotoEdit(item.id)">编辑</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				uid: '',
				list: '',
				loading: '',
			}
		},
		onLoad(option) {
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
				uni.$on("adadds",data=>{
					this.doIninit()
				})
				uni.$on("adedit",data=>{
					this.doIninit()
				})
			}
		},
		beforeCreate() {
			uni.$off(['adadds',"adedit"]); //页面销毁  移除 监听websocket回复通知  事件
		},
		methods: {
			back() {
				uni.navigateBack()
			},
			gotoAddon() {
				uni.navigateTo({
					url: '/pages/my/adindex/adadds'
				})
			},
			gotoEdit(id) {
				uni.navigateTo({
					url:'/pages/my/adindex/adedit?ids='+id
				})
			},
			doIninit() {
				let that = this;
				var params = {
					uid: that.uid
				};
				that.$api.uaddr_list(params).then(ret => {
					that.list = ret.data;
				})
			},
			doDels(id) {
				let that = this;
				var params = {
					id: id
				};
				uni.showLoading({
					title: "处理中..."
				})
				that.$api.uaddr_dels(params).then(ret => {
					that.doIninit();
					uni.hideLoading()
				}).catch(err => {
					uni.hideLoading()
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.ticket {
		background: white;
		margin-bottom: 16rpx;
		padding: 32rpx 24rpx;
	}

	.ticket_info {
		padding-top: 8rpx;
	}

	.ticket_info p {
		color: #666666;
		font-size: 26rpx;
		margin: 0rem 0rem 16rpx;
		padding: 0rem;
	}

	.ticket_info p:first-child {
		color: black;
		font-size: 30rpx;
		margin-bottom: 24rpx;
	}

	.ticket_button {
		text-align: right;
	}

	.ticket_button::after {
		clear: both;
		content: " ";
		display: table;
	}

	.ticket_btn_left {
		color: #f5a623;
		display: inline-block;
		float: left;
		font-size: 28rpx;
		margin-top: 4rpx;
	}

	.ticket_btn_item {
		border: 1px solid #c20f22;
		border-radius: 4rpx;
		color: #c20f22;
		display: inline-block;
		font-size: 24rpx;
		height: 56rpx;
		line-height: 56rpx;
		margin-left: 16rpx;
		text-align: center;
		width: 144rpx;
	}
</style>