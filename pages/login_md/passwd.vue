<template>
	<view class="login-container">
		<!-- 顶部导航栏保持不变 -->
		<u-navbar :is-back="false" title="">
			<view class="d_a_sb " style="width: 750rpx;">
				<view style="width: 200rpx;padding-left: 30rpx;" @click="back">
					<u-icon name="nav-back" color="#606266" :size="44"></u-icon>
				</view>
				<view style="font-size: 30rpx; color: #000; font-weight: bold; text-align: center; flex-grow: 1;">找回密码</view>
				<view style="width: 200rpx;padding-right: 30rpx; color: #488aff; text-align: right; opacity: 0;" @click="doForget">保存</view>
			</view>
		</u-navbar>

		<!-- 整体下移、居中且带精致卡片风格的内容区域 -->
		<view class="form-wrapper">
			<!-- 标题引导 -->
			<view class="page-header-title">
				<text class="main-title">重置密码</text>
				<text class="sub-title">请通过手机验证码安全重置您的登录密码</text>
			</view>

			<!-- 输入框卡片群组 -->
			<view class="input-card-group">
				<view class="input-row">
					<u-field v-model="phone" label="手机号码" type="number" placeholder="请输入注册手机号码" :border-bottom="false"></u-field>
				</view>

				<view class="input-row code-row">
					<u-field v-model="code" label="验证码" placeholder="短信验证码" :border-bottom="false"></u-field>
					<view class="code-btn-box" @click.stop="getCodes()">
						<text class="code-text">{{code_tip}}</text>
					</view>
				</view>

				<view class="input-row">
					<u-field v-model="passwd" type="password" label="新密码" placeholder="请输入新密码" :border-bottom="false"></u-field>
				</view>

				<view class="input-row">
					<u-field v-model="vipass" type="password" label="确认密码" placeholder="请再次输入新密码" :border-bottom="false"></u-field>
				</view>
			</view>

			<!-- 琉璃蓝渐变提交主按钮 -->
			<div class="submit-btn" @click="doForget()">确认修改</div>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				phone: "",
				code: "",
				passwd: "",
				vipass: "",
				code_tim: 0,
				code_tip: "获取验证码",
			}
		},
		methods: {
			back() {
				uni.navigateBack()
			},

			/**
			 * 接口逻辑保持原样
			 */
			doForget() {
				let that = this;
				var param = {
					phone: that.phone,
					code: that.code,
					passwd: that.passwd,
					vipass: that.vipass,
				};
				if (that.phone.length < 1) {
					uni.showToast({
						icon: 'none',
						title: "请输入手机号码"
					})
					return false;
				}
				if (that.code.length < 1) {
					uni.showToast({
						icon: 'none',
						title: "请输入验证码"
					})
					return false;
				}
				if (that.passwd.length < 1) {
					uni.showToast({
						icon: 'none',
						title: "请输入新密码"
					})
					return false;
				}
				if (that.vipass.length < 1) {
					uni.showToast({
						icon: 'none',
						title: "请再次输入新密码"
					})
					return false;
				}
				if (that.vipass != that.passwd) {
					uni.showToast({
						icon: 'none',
						title: "两次密码不一致"
					})
					return false;
				}
				uni.showLoading({
					title: "处理中..."
				})
				
				that.$api.forget(param).then(ret => {
					uni.hideLoading()
					uni.showToast({
						title: "修改成功",
						icon: "success"
					})
					setTimeout(() => {
						uni.navigateBack()
					}, 1500)
				}).catch(err => {
					uni.hideLoading()
				});
			},

			getCodes() {
				var that = this;
				if (!that.phone) {
					uni.showToast({
						title: "请输入手机号码",
						icon: 'none'
					})
					return false;
				}
				if (that.code_tim > 0) {
					return;
				}
				var param = {
					phone: that.phone,
				};
				uni.showLoading({
					title: "获取中..."
				})
				that.$api.getSmsCode(param).then(ret => {
					uni.hideLoading()
					return that.getCodesVal();
				}).catch(err => {
					uni.hideLoading()
				});
			},
			
			getCodesVal() {
				var that = this;
				that.code_tim = 120;
				var timer = setInterval(function() {
					that.code_tim = that.code_tim - 1;
					if (that.code_tim < 1) {
						that.code_tip = "获取验证码";
						clearInterval(timer);
						return;
					}
					that.code_tip = that.code_tim + "s";
				}, 1000);
			},
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

	/* 整体往下移并集中在视觉中心 */
	.form-wrapper {
		flex: 1;
		padding: 40rpx 32rpx;
		display: flex;
		flex-direction: column;
		justify-content: center; /* 垂直居中偏移，告别顶部贴顶难看的问题 */
		max-width: 680rpx;
		width: 100%;
		margin: 0 auto;
		box-sizing: border-box;

		.page-header-title {
			margin-bottom: 40rpx;
			padding-left: 10rpx;

			.main-title {
				font-size: 44rpx;
				font-weight: 700;
				color: #1e293b;
				display: block;
				margin-bottom: 12rpx;
			}

			.sub-title {
				font-size: 26rpx;
				color: #64748b;
			}
		}

		/* 卡片化区块包裹 */
		.input-card-group {
			background: #ffffff;
			border-radius: 24rpx;
			padding: 12rpx 24rpx;
			box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.02);
			border: 1rpx solid #edf2f7;
			margin-bottom: 48rpx;

			.input-row {
				position: relative;
				border-bottom: 1rpx solid #f1f5f9;

				&:last-child {
					border-bottom: none;
				}
			}

			.code-row {
				display: flex;
				align-items: center;
				justify-content: space-between;

				.code-btn-box {
					padding: 12rpx 24rpx;
					background-color: #f8fafc;
					border: 1rpx solid #e2e8f0;
					border-radius: 12rpx;
					flex-shrink: 0;
					margin-left: 20rpx;

					.code-text {
						font-size: 26rpx;
						color: #2563eb;
						font-weight: 600;
					}
				}
			}
		}

		/* 高端琉璃蓝渐变主按钮 */
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
			letter-spacing: 2rpx;
		}
	}
</style>