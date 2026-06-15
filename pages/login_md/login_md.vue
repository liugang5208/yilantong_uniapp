<template>
	<view>
		<view class="banner">
			<image mode="widthFix" src="/static/imgs/login_banner.png" />
		</view>

		<view class="form">
			<view class="form_new_reg">
				<span @click="doCode()" class="left">
					验证码登录
				</span>
				<span @click="regirest()">新用户注册></span>
			</view>
			<view>
				<u-field v-model="phone" label="手机号" placeholder="请输入注册手机号码">
				</u-field>
				<u-field password v-model="passwd" label="密码" placeholder="请输入密码">
				</u-field>
			</view>
			<view class="form_action">
				<view class="form_action-item" @click="forget()">忘记密码？</view>
			</view>
			<view class="form_button" @click="doLogin()">登录易缆通商城</view>
			<view class="form_tips">
				<u-checkbox v-model="regtool" active-color="red"></u-checkbox>
				<span @click="viewTools()">登录即代表您同意并认可<i>《易缆通服务条款》</i></span>
			</view>
		</view>
		<view class="footer d_a_j">
			<image mode="widthFix" src="/static/imgs/login_footer.png" />
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				phone: '',
				passwd: '',
				regtool: false
			}
		},
		methods: {
			getLocation(userInfo) {
				uni.getLocation({
					type: 'wgs84',
					success:  (res)=> {
						console.log('当前位置的经度：' + res.longitude);
						console.log('当前位置的纬度：' + res.latitude);
						const latitude = res.latitude;
						const longitude = res.longitude;
						const amapKey = 'fa3fef17cc0470481e01b9b0eea509a1';
						// 构建请求URL
						const url = `https://restapi.amap.com/v3/geocode/regeo?key=${amapKey}&location=${longitude},${latitude}`;
						// 使用uni.request进行请求
						uni.request({
						    url: url, // 请求的地址
						    method: 'GET', // 请求方法
						    success: (res) => {
						        if (res.statusCode === 200 && res.data && res.data.regeocode) {
									console.log(res.data)
						            const address = res.data.regeocode.addressComponent.district;
									this.label=address
									this.$api.regionAdd({
										uid:userInfo.id,
										prov:res.data.regeocode.addressComponent.province,
										city:res.data.regeocode.addressComponent.city,
										label:res.data.regeocode.addressComponent.district
									})
						            console.log('解析的地址是:', address);
									
									
						            // 这里可以进行后续操作，例如更新UI显示解析的地址等
						        } else {
						            console.error('解析失败:', res.data);
						        }
						    },
						    fail: (err) => {
						        console.error('请求失败:', err);
						    }
						});
					}
				});
				
			},
			forget(){
				uni.navigateTo({
					url:'/pages/login_md/passwd'
				})
			},
			doCode(){
				uni.navigateTo({
					url:'/pages/login_md/login'
				})
			},
			viewTools() {
				uni.navigateTo({
					url: '/pages/login_md/regtool/regtool'
				})
			},
			regirest() {
				uni.navigateTo({
					url:'/pages/login_md/regirest'
				})
			},
			doLogin() {
				var that = this;
				if (!that.regtool) {
					uni.showToast({
						icon: 'none',
						title: "请阅读并同意协议"
					})
					return false;
				}
				if (that.phone.length < 1) {
					uni.showToast({
						icon: 'none',
						title: "请输入手机号码"
					})
					return false;
				}
				if (that.passwd.length < 1) {
					uni.showToast({
						icon: 'none',
						title: "请输入密码"
					})
					return false;

				}
				
				uni.showModal({
					title: '提示',
					content: '登录即代表您同意并认可《易缆通服务条款》',
					
					success: (res) => {
						if (res.confirm) {
							uni.showLoading({
								mask: true,
								title: "登录中..."
							})
							this.$api.login({
								phone: that.phone,
								passwd: that.passwd
							}).then(ret => {
								that.doJump(ret.data);
								// this.getLocation(ret.data)
							}).finally(f => {
								uni.hideLoading()
							})
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
				
				
				
				////////////////////////



				/***************/

			},
			doJump(id) {
				let that = this;
				uni.setStorageSync("loginTicket", id)
				uni.reLaunch({
					url: '/pages/index/index'
				})
			}




		}
	}
</script>

<style scoped lang="scss">
	.banner {
		width: 100%;
	}

	.banner image {
		vertical-align: middle;
		width: 100%;
	}

	.footer {
		width: 100%;
	}

	.form {
		padding: 36rpx 24rpx 0rem;
	}

	.list-ios {
		margin: 0rem;
	}

	.list-ios>.item-block {
		font-size: 32rpx;
		padding: 0rem;
	}

	.list-ios>.item-block:first-child {
		border: 0rem;
	}

	.item-input {
		text-align: justify;
		width: 120rpx;
	}

	.form_new_reg {
		color: #c20f22;
		text-align: right;
		padding: 0rem 0rem 20rpx;
	}

	.form_new_reg span.left {
		color: #4a90e2;
		float: left;
	}

	.form_new_reg::after {
		clear: both;
		display: table;
		content: " ";
	}

	.form_action {
		display: flex;
	}

	.form_action-item {
		color: #999999;
		font-size: 32rpx;
		flex: 1;
		height: 100rpx;
		line-height: 100rpx;
	}

	.form_action-item:last-child {
		text-align: right;
	}

	.form_button {
		background: #c20f22;
		border-radius: 4rpx;
		color: white;
		font-size: 36rpx;
		height: 88rpx;
		line-height: 88rpx;
		margin-top: 24rpx;
		text-align: center;
	}

	.form_reg {
		color: #4a90e2;
		font-size: 32rpx;
		margin-top: 32rpx;
		text-align: center;
	}

	.form_tips {
		font-size: 26rpx;
		margin-bottom: 200rpx;
		padding: 32rpx 0rem 0rem;
		text-align: center;
	}

	.form_tips image {
		margin-top: -4rpx;
		margin-right: 16rpx;
		vertical-align: middle;
		width: 38rpx;
	}

	.form_tips i.fa {
		color: #c20f22;
		margin: -2px 10rpx 0rem 0rem;
		vertical-align: middle;
		font-size: 40rpx;
	}

	.form_tips span i {
		color: #c20f22;
		font-style: normal;
	}
</style>