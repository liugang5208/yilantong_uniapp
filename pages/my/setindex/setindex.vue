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

		<!-- 注销账号-验证码二次确认弹窗 -->
		<view class="del-modal-mask" v-if="showDelCodeModal" @tap.stop="closeDelCodeModal">
			<view class="del-modal-box" @tap.stop="">
				<view class="del-modal-title">身份验证</view>
				<view class="del-modal-desc">为保护您的账号安全，请输入发送至 {{ maskedPhone }} 的验证码后确认注销</view>
				<view class="del-code-row">
					<u-field v-model="delCode" placeholder="请输入验证码" :border-bottom="false"></u-field>
					<view class="del-code-btn" @click.stop="sendDelCode()">
						<text>{{ delCodeTip }}</text>
					</view>
				</view>
				<view class="del-modal-btns">
					<view class="del-modal-btn cancel" @click="closeDelCodeModal">取消</view>
					<view class="del-modal-btn confirm" @click="confirmDelCode">确认注销</view>
				</view>
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
				currentVersion: '1.0.0', // 当前版本号
				// 注销账号-验证码二次确认
				showDelCodeModal: false,
				delCode: '',
				delCodeTim: 0,
				delCodeTip: '获取验证码',
				delSubmitting: false,
				userPhone: ''
			}
		},
		computed: {
			maskedPhone() {
				let p = this.userPhone;
				if (!p || p.length < 7) return p || '';
				return p.substring(0, 3) + '****' + p.substring(p.length - 4);
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
			gotoFeedback() {
				uni.navigateTo({
					url: '/pages/my/setindex/setfeedback'
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
				let that = this;
				// 前置检查：有未完成订单（待付款/待发货/待收货）时直接拦截，不进入确认流程
				uni.showLoading({ title: '检查中...', mask: true });
				that.$api.userDelPrecheck({ uid: that.uid }).then(() => {
					uni.hideLoading();
					that.showDelStepOne();
				}).catch(err => {
					uni.hideLoading();
					uni.showModal({
						title: '提示',
						content: (err && err.msg) || '您有未完成的订单，请先处理后再注销账号',
						showCancel: false
					});
				});
			},
			// 第一次确认
			showDelStepOne() {
				let that = this;
				uni.showModal({
					title: '提示',
					content: '是否注销账号？',
					success: (res) => {
						if (res.confirm) {
							that.showDelStepTwo();
						}
					}
				});
			},
			// 第二次确认：明确告知会删除所有资料信息
			showDelStepTwo() {
				let that = this;
				uni.showModal({
					title: '再次确认',
					content: '注销后，您的账号资料、订单、购物车、报价单等所有信息将被删除且无法恢复，是否确认注销？',
					confirmText: '确认注销',
					confirmColor: '#E11D48',
					success: (res) => {
						if (res.confirm) {
							that.openDelCodeModal();
						}
					}
				});
			},
			// 拉取账号绑定手机号（本地登录态里只有 uid，没有存手机号），打开验证码弹窗
			openDelCodeModal() {
				let that = this;
				uni.showLoading({ title: '加载中...', mask: true });
				that.$api.Users({ uid: that.uid }).then(ret => {
					uni.hideLoading();
					that.userPhone = ret.data ? ret.data.phone : '';
					if (!that.userPhone) {
						uni.showToast({ title: '获取账号信息失败，请重试', icon: 'none' });
						return;
					}
					that.delCode = '';
					that.showDelCodeModal = true;
				}).catch(() => {
					uni.hideLoading();
					uni.showToast({ title: '获取账号信息失败，请重试', icon: 'none' });
				});
			},
			closeDelCodeModal() {
				this.showDelCodeModal = false;
			},
			sendDelCode() {
				let that = this;
				if (that.delCodeTim > 0) return;
				if (!that.userPhone) return;
				uni.showLoading({ title: '获取中...' });
				that.$api.getSmsCode({ phone: that.userPhone }).then(() => {
					uni.hideLoading();
					that.delCodeTim = 120;
					let timer = setInterval(() => {
						that.delCodeTim = that.delCodeTim - 1;
						if (that.delCodeTim < 1) {
							that.delCodeTip = '获取验证码';
							clearInterval(timer);
							return;
						}
						that.delCodeTip = that.delCodeTim + 's';
					}, 1000);
				}).catch(err => {
					uni.hideLoading();
					uni.showToast({ title: (err && err.msg) || '获取验证码失败', icon: 'none' });
				});
			},
			confirmDelCode() {
				let that = this;
				if (!that.delCode) {
					uni.showToast({ title: '请输入验证码', icon: 'none' });
					return;
				}
				if (that.delSubmitting) return;
				that.delSubmitting = true;
				uni.showLoading({ title: '处理中...', mask: true });
				that.$api.userDel({ uid: that.uid, code: that.delCode }).then(() => {
					uni.hideLoading();
					that.delSubmitting = false;
					that.showDelCodeModal = false;
					uni.setStorageSync("loginTicket", null)
					uni.reLaunch({
						url: '/pages/login_md/login_md'
					})
				}).catch(err => {
					uni.hideLoading();
					that.delSubmitting = false;
					uni.showToast({ title: (err && err.msg) || '注销失败，请重试', icon: 'none' });
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

	/* 注销账号-验证码二次确认弹窗 */
	.del-modal-mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.55);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 999;
	}

	.del-modal-box {
		width: 84%;
		background: #ffffff;
		border-radius: 20rpx;
		padding: 40rpx 32rpx 32rpx;
		box-sizing: border-box;
	}

	.del-modal-title {
		font-size: 32rpx;
		font-weight: bold;
		color: #1A1A1A;
		text-align: center;
		margin-bottom: 16rpx;
	}

	.del-modal-desc {
		font-size: 26rpx;
		color: #666666;
		line-height: 1.6;
		text-align: center;
		margin-bottom: 32rpx;
	}

	.del-code-row {
		display: flex;
		align-items: center;
		border: 1rpx solid #e2e8f0;
		border-radius: 12rpx;
		padding: 4rpx 16rpx;
		margin-bottom: 36rpx;

		.del-code-btn {
			flex-shrink: 0;
			padding: 10rpx 20rpx;
			background-color: #f8fafc;
			border: 1rpx solid #e2e8f0;
			border-radius: 10rpx;
			margin-left: 16rpx;

			text {
				font-size: 24rpx;
				color: #2563eb;
				font-weight: 600;
			}
		}
	}

	.del-modal-btns {
		display: flex;
		gap: 20rpx;
	}

	.del-modal-btn {
		flex: 1;
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
		border-radius: 40rpx;
		font-size: 28rpx;
		font-weight: 600;
	}

	.del-modal-btn.cancel {
		background: #F0F2F5;
		color: #666666;
	}

	.del-modal-btn.confirm {
		background: #E11D48;
		color: #ffffff;
	}
</style>