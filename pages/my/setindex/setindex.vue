<template>
	<view>
		<view class="line" @click="gotoCustom()">
			<span>客服中心</span>
			<image mode="widthFix" src="/static/icon/ic_right_gy.png" class="right" />
		</view>
		<view class="line" @click="gotoAbout()">
			<span>关于易缆通APP</span>
			<image mode="widthFix" src="/static/icon/ic_right_gy.png" class="right" />
		</view>
		
		<view class="line" @click="ysfw('http://appfwxy.elccc.cn','服务协议')">
			<span>服务协议</span>
			<image mode="widthFix" src="/static/icon/ic_right_gy.png" class="right" />
		</view>
		<view class="line" @click="ysfw('http://appys.elccc.cn','隐私政策')">
			<span>隐私政策</span>
			<image mode="widthFix" src="/static/icon/ic_right_gy.png" class="right" />
		</view>
		
		<!-- <view class="line" @click="update()">
			<span>检查更新</span>
			<image mode="widthFix" src="/static/icon/ic_right_gy.png" class="right" />
		</view> -->
		
		<view class="line" @click="writeOff()">
			<span>注销账号</span>
			<image mode="widthFix" src="/static/icon/ic_right_gy.png" class="right" />
		</view>
		<view class="line" @click="sessionOut()">
			<span>退出登录</span>
			<image mode="widthFix" src="/static/icon/ic_right_gy.png" class="right" />
		</view>
	</view>
</template>

<script>
	import appUpdate from '@/uni_modules/leruge-app-update/js_sdk/leruge-app-update.js'
	export default {
		data() {
			return {
				uid:uni.getStorageSync('loginTicket').id
			}
		},
		onLoad() {
			
		},
		methods: {
			ysfw(url,title){
				uni.navigateTo({
					url:"/pages/my/ysfw?url="+url+'&title='+encodeURIComponent(title)
				})
			},
			gotoCustom() {
				uni.navigateTo({
					url: '/pages/my/setindex/setcuetom'
				})
			},
			gotoAbout() {
				uni.navigateTo({
					url: '/pages/my/setindex/setabout'
				})
			},
			writeOff(){
				uni.showModal({
					title: '提示',
					content: '是否注销账号？',
					success: (res) => {
						if (res.confirm) {
							console.log(this.uid);
							this.$api.userDel({uid:this.uid}).then(res=>{
								uni.setStorageSync("loginTicket", null)
								uni.reLaunch({
									url: '/pages/login_md/login_md'
								})
							})
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			async update() {
				let code  = plus.runtime.version;
				let system =''
				// #ifdef APP-IOS
				  system=2
				// #endif
				// #ifdef APP-ANDROID
				 system=1
				// #endif
				
				
				
				 this.$api.update_version({
					version: code,
					system:system
				}).then(res=>{
					console.log(res);	
					let updateInfo = {
						platform:system==1?'android':'ios',
						updateContent: res.data.prompt,
						downUrl: res.data.url,
						version: res.data.version,
						force: res.data.is_mandatory==1?false:true,
						mainColor: 'FF5B78',
					}
					appUpdate(updateInfo)
					
				})
				
			},
			sessionOut() {
				var that = this;
				/***************************/
				uni.showModal({
					title: '提示',
					content: '确定要退出登录？',
					success: (res) => {
						if (res.confirm) {
							uni.setStorageSync("loginTicket", null)
							uni.reLaunch({
								url: '/pages/login_md/login_md'
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
	.line {
		border-top: 2rpx solid #eeeeee;
		height: 100rpx;
		font-size: 34rpx;
		line-height: 100rpx;
		padding: 0rem 24rpx;
		position: relative;
	}

	.line:last-child {
		border-bottom: 1rpx solid #eeeeee;
	}

	.line image {
		margin-right: 24rpx;
		margin-top: -6rpx;
		vertical-align: middle;
		width: 50rpx;
	}

	.line image.right {
		top: 30rpx;
		vertical-align: middle;
		position: absolute;
		right: 24rpx;
		width: 40rpx;
	}
</style>