<template>
	<view class="login-container">
		<!-- 顶部纯净 Banner 区域 -->
		<view class="banner-box">
			<image class="banner-img" mode="widthFix" src="/static/imgs/login_banner.png" />
		</view>

		<!-- 表单核心区域 -->
		<view class="form-box">
			<!-- 顶部快捷切换栏 -->
			<view class="form-top-action">
				<text class="switch-btn" @click="toCodeLogin()">&lt; 验证码登录</text>
				<text class="reg-btn" @click="regirest()">新用户注册 &gt;</text>
			</view>

			<!-- 输入框卡片群组 -->
			<view class="input-card-group">
				<view class="input-row">
					<u-field v-model="phone" label="手机号" placeholder="请输入注册手机号码" :border-bottom="false"></u-field>
				</view>
				
				<view class="input-row">
					<u-field v-model="passwd" type="password" label="密码" placeholder="请输入登录密码" :border-bottom="false"></u-field>
				</view>
			</view>
			
			<view class="form_action">
				<view class="form_action-item" @click="forget()">忘记密码？</view>
			</view>

			<!-- 登录主按钮 -->
			<div class="submit-btn" @click="doLogin()">立即登录</div>
			
			<!-- 底部协议勾选 -->
			<view class="agreement-box">
				<u-checkbox v-model="regtool" active-color="#2563eb" size="32"></u-checkbox>
				<text class="agreement-text">我已阅读并同意 <text class="link" @click.stop="viewTools()">《服务与隐私政策》</text></text>
			</view>
		</view>

		<!-- 底部轻量化版权信息 -->
		<view class="footer-box">
			<text class="footer-txt">© 2026 四川亚建线缆有限公司 版权所有</text>
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
			forget() {
				uni.navigateTo({
					url: '/pages/login_md/passwd'
				})
			},
			toCodeLogin() {
				uni.navigateTo({
					url: '/pages/login_md/login'
				})
			},
			viewTools() {
				uni.navigateTo({
					url: '/pages/login_md/regtool/regtool'
				})
			},
			regirest() {
				uni.navigateTo({
					url: '/pages/login_md/regirest'
				})
			},
			doLogin() {
				var that = this;
				
				if (!that.regtool) {
					uni.showToast({
						icon: 'none',
						title: "请先阅读并勾选同意服务协议"
					})
					return false;
				}
				if (!that.phone) {
					uni.showToast({
						icon: 'none',
						title: "请输入手机号码"
					})
					return false;
				}
				if (!that.passwd) {
					uni.showToast({
						icon: 'none',
						title: "请输入登录密码"
					})
					return false;
				}
				
				// 已经有了底部的勾选框，直接流畅发起登录，不再弹出任何丑陋的原生弹窗！
				uni.showLoading({
					mask: true,
					title: "登录中..."
				})
				
				this.$api.login({
					phone: that.phone,
					passwd: that.passwd
				}).then(ret => {
					that.doJump(ret.data);
				}).catch(err => {
					// 异常处理
				}).finally(f => {
					uni.hideLoading()
				})
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
	.login-container {
		min-height: 100vh;
		background-color: #f7f9fc;
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
	}

	.banner-box {
		width: 100%;
		background-color: #ffffff;
		overflow: hidden;
		
		.banner-img {
			width: 100%;
			display: block;
		}
	}

	.form-box {
		flex: 1;
		padding: 32rpx 32rpx 60rpx;
		display: flex;
		flex-direction: column;
		
		.form-top-action {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 24rpx;
			padding: 0 4rpx;
			
			.switch-btn {
				font-size: 28rpx;
				color: #2563eb;
				font-weight: 500;
			}
			
			.reg-btn {
				font-size: 28rpx;
				color: #64748b;
			}
		}
		
		.input-card-group {
			background: #ffffff;
			border-radius: 24rpx;
			padding: 12rpx 24rpx;
			box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.02);
			border: 1rpx solid #edf2f7;
			margin-bottom: 12rpx;
			
			.input-row {
				position: relative;
				border-bottom: 1rpx solid #f1f5f9;
				
				&:last-child {
					border-bottom: none;
				}
			}
		}

		.form_action {
			display: flex;
			padding: 0 4rpx;
			margin-bottom: 24rpx;
		}

		.form_action-item {
			color: #999999;
			font-size: 28rpx;
			flex: 1;
			height: 60rpx;
			line-height: 60rpx;
			text-align: right;
		}
		
		.submit-btn {
			background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
			border-radius: 16rpx;
			color: white;
			font-size: 32rpx;
			font-weight: 600;
			height: 92rpx;
			line-height: 92rpx;
			text-align: center;
			box-shadow: 0 10rpx 24rpx rgba(37, 99, 235, 0.2);
			margin-bottom: 36rpx;
			letter-spacing: 2rpx;
		}
		
		.agreement-box {
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 26rpx;
			color: #64748b;
			
			.agreement-text {
				margin-left: 12rpx;
				
				.link {
					color: #2563eb;
					font-weight: 500;
				}
			}
		}
	}

	.footer-box {
		text-align: center;
		padding: 20rpx 0 40rpx;
		
		.footer-txt {
			font-size: 24rpx;
			color: #94a3b8;
			letter-spacing: 1rpx;
		}
	}
</style>