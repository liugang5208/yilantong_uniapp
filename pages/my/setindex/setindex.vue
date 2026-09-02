<template>
	<view class="settings-container">
		
		<!-- 第一组：常规服务与帮助 -->
		<view class="menu-card">
			<view class="menu-item" @click="gotoCustom()">
				<text class="menu-text">客服中心</text>
				<image mode="widthFix" src="/static/icon/ic_right_gy.png" class="right-icon" />
			</view>
			<!-- 新增：意见反馈 -->
			<view class="menu-item" @click="gotoFeedback()">
				<text class="menu-text">意见反馈</text>
				<image mode="widthFix" src="/static/icon/ic_right_gy.png" class="right-icon" />
			</view>
			<view class="menu-item last-item" @click="gotoAbout()">
				<text class="menu-text">关于易缆通APP</text>
				<view class="right-box">
					<text class="sub-text">v{{ currentVersion }}</text>
					<image mode="widthFix" src="/static/icon/ic_right_gy.png" class="right-icon" />
				</view>
			</view>
		</view>
		
		<!-- 第二组：合规与系统工具 -->
		<view class="menu-card">
			<view class="menu-item" @click="ysfw('http://appfwxy.elccc.cn','服务协议')">
				<text class="menu-text">服务协议</text>
				<image mode="widthFix" src="/static/icon/ic_right_gy.png" class="right-icon" />
			</view>
			<view class="menu-item" @click="ysfw('http://appys.elccc.cn','隐私政策')">
				<text class="menu-text">隐私政策</text>
				<image mode="widthFix" src="/static/icon/ic_right_gy.png" class="right-icon" />
			</view>
			<!-- 新增：清理缓存（带动态缓存大小计算） -->
			<view class="menu-item" @click="clearCache">
				<text class="menu-text">清除缓存</text>
				<text class="sub-text">{{ cacheSize }}</text>
			</view>
			<!-- 检查更新 -->
			<view class="menu-item last-item" @click="update">
				<text class="menu-text">检查更新</text>
				<image mode="widthFix" src="/static/icon/ic_right_gy.png" class="right-icon" />
			</view>
		</view>
		
		<!-- 第三组：账号安全与操作 -->
		<view class="menu-card">
			<view class="menu-item" @click="gotoChangePwd()">
				<text class="menu-text">修改密码</text>
				<image mode="widthFix" src="/static/icon/ic_right_gy.png" class="right-icon" />
			</view>
			<view class="menu-item" @click="writeOff()">
				<text class="menu-text danger-text">注销账号</text>
				<image mode="widthFix" src="/static/icon/ic_right_gy.png" class="right-icon" />
			</view>
			<view class="menu-item last-item" @click="sessionOut()">
				<text class="menu-text danger-text">退出登录</text>
				<image mode="widthFix" src="/static/icon/ic_right_gy.png" class="right-icon" />
			</view>
		</view>

	</view>
</template>

<script>
	import appUpdate from '@/uni_modules/leruge-app-update/js_sdk/leruge-app-update.js'
	export default {
		data() {
			return {
				uid: uni.getStorageSync('loginTicket') ? uni.getStorageSync('loginTicket').id : '',
				cacheSize: '0KB', // 缓存大小
				currentVersion: '1.0.0' // 当前版本号
			}
		},
		onLoad() {
			this.getCacheSize();
			this.getVersion();
		},
		methods: {
			// 获取当前App版本号
			getVersion() {
				// #ifdef APP-PLUS
				this.currentVersion = plus.runtime.version;
				// #endif
			},
			// 计算缓存大小
			getCacheSize() {
				let res = uni.getStorageInfoSync();
				let size = res.currentSize; // 单位是 KB
				if (size > 1024) {
					this.cacheSize = (size / 1024).toFixed(2) + 'MB';
				} else {
					this.cacheSize = size + 'KB';
				}
			},
			// 清除缓存
			clearCache() {
				uni.showModal({
					title: '提示',
					content: '确定要清除缓存吗？',
					success: (res) => {
						if (res.confirm) {
							// 保留登录信息，清理其他临时缓存（根据需要调整）
							let ticket = uni.getStorageSync('loginTicket');
							uni.clearStorageSync();
							if (ticket) {
								uni.setStorageSync('loginTicket', ticket);
							}
							this.getCacheSize();
							uni.showToast({
								title: '清除成功',
								icon: 'success'
							});
						}
					}
				});
			},
			ysfw(url, title){
				uni.navigateTo({
					url: "/pages/my/ysfw?url=" + url + '&title=' + encodeURIComponent(title)
				})
			},
			gotoCustom() {
				uni.navigateTo({
					url: '/pages/my/setindex/setcuetom'
				})
			},
			// 意见反馈页面跳转（预留路径）
			gotoFeedback() {
				uni.navigateTo({
					url: '/pages/my/setindex/feedback' 
				})
			},
			gotoAbout() {
				uni.navigateTo({
					url: '/pages/my/setindex/setabout'
				})
			},
			gotoChangePwd() {
				uni.navigateTo({
					url: '/pages/my/setindex/changepwd' 
				})
			},
			writeOff(){
				uni.showModal({
					title: '提示',
					content: '是否注销账号？注销后数据将无法恢复',
					success: (res) => {
						if (res.confirm) {
							this.$api.userDel({ uid: this.uid }).then(res => {
								uni.setStorageSync("loginTicket", null)
								uni.reLaunch({
									url: '/pages/login_md/login_md'
								})
							})
						}
					}
				});
			},
			async update() {
				// #ifdef APP-IOS
				let system = 2;
				// #endif
				// #ifdef APP-ANDROID
				let system = 1;
				// #endif
				// #ifndef APP-PLUS
				let system = 1; // 默认
				// #endif
				
				let code = '1.0.0';
				// #ifdef APP-PLUS
				code = plus.runtime.version;
				// #endif

				this.$api.update_version({
					version: code,
					system: system
				}).then(res => {
					if(!res.data || !res.data.url) {
						uni.showToast({ title: '已是最新版本', icon: 'none' });
						return;
					}
					let updateInfo = {
						platform: system == 1 ? 'android' : 'ios',
						updateContent: res.data.prompt,
						downUrl: res.data.url,
						version: res.data.version,
						force: res.data.is_mandatory == 1 ? false : true,
						mainColor: 'FF5B78',
					}
					appUpdate(updateInfo)
				}).catch(err => {
					console.log(err);
				})
			},
			sessionOut() {
				uni.showModal({
					title: '提示',
					content: '确定要退出登录？',
					success: (res) => {
						if (res.confirm) {
							uni.setStorageSync("loginTicket", null)
							uni.reLaunch({
								url: '/pages/login_md/login_md'
							})
						}
					}
				});
			}
		}
	}
</script>

<style scoped lang="scss">
	.settings-container {
		background-color: #f7f9fc;
		min-height: 100vh;
		padding: 30rpx 24rpx;
		box-sizing: border-box;
	}

	/* 卡片式分组容器 */
	.menu-card {
		background-color: #ffffff;
		border-radius: 20rpx;
		margin-bottom: 24rpx;
		box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.02);
		overflow: hidden;
	}

	/* 每一项菜单 */
	.menu-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 104rpx;
		padding: 0 32rpx;
		position: relative;
		border-bottom: 1rpx solid #f2f2f2;

		&.last-item {
			border-bottom: none;
		}

		&:active {
			background-color: #f9f9f9;
		}

		.menu-text {
			font-size: 30rpx;
			color: #333333;
			font-weight: 500;

			&.danger-text {
				color: #ff3b30;
			}
		}

		.right-box {
			display: flex;
			align-items: center;
		}

		.sub-text {
			font-size: 26rpx;
			color: #999999;
			margin-right: 12rpx;
		}

		.right-icon {
			width: 32rpx;
			height: 32rpx;
			opacity: 0.3;
		}
	}
</style>