<template>
	<view>
		<u-navbar :is-back="false" title="">
			<view class="d_a_sb " style="width: 750rpx;">
				<view style="width: 200rpx;padding-left: 30rpx;" @click="back">
					<u-icon name="nav-back" color="#606266" :size="44">
					</u-icon>
				</view>
				<view style="font-size: 30rpx; color: #000; font-weight: bold; text-align: center; flex-grow: 1;">找回密码</view>
				<view style="width: 200rpx;padding-right: 30rpx; color: #488aff; text-align: right;" @click="doForget">保存</view>
			</view>
		</u-navbar>
		<view class="uni-list">
			<view class="uni-item">
				<text class="uni-label">手机号码</text>
				<input v-model="phone" placeholder="请输入注册手机号码" type="number" class="uni-input" />
			</view>

			<view class="uni-item">
				<text class="uni-label">验证码</text>
				<input v-model="code " placeholder="短信验证码" class="uni-input" />
			</view>

			<view class="uni-item">
				<text class="uni-label">新密码</text>
				<input v-model="passwd" type="password" placeholder="请输入新密码" class="uni-input" />
			</view>

			<view class="uni-item">
				<text class="uni-label">确认密码</text>
				<input v-model="vipass" type="password" placeholder="请再次输入新密码" class="uni-input" />
			</view>
		</view>
		<div class="codes" @click="getCodes()">{{code_tip}}</div>
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
				/***************/
				that.$api.forget(param).then(ret => {
					uni.hideLoading()
					uni.navigateBack()
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
					that.code_tip = "" + that.code_tim;
				}, 1000);
			},
		}
	}
</script>

<style scoped lang="scss">
	.uni-list {
		margin: 0;
		padding: 0;
	}

	.uni-item {
		display: flex;
		align-items: center;
		padding: 10px;
		border-bottom: 1px solid #eee;
	}

	.uni-label {
		flex: 1;
	}

	.uni-input,
	.uni-select {
		flex: 2;
		padding: 5px;
		border-radius: 5px;
	}

	.uni-switch {
		margin-left: auto;
	}

	.banner {
		width: 100%;
	}

	.banner image {
		vertical-align: middle;
		width: 100%;
	}

	.form {
		padding: 36rpx 24rpx;
	}

	.codes {
		color: #c20f22;
		margin-right: 0rem;
		margin-top: -240rpx;
		position: absolute;
		right: 30rpx;
		text-align: right;
		width: 200rpx;
	}

	.list-ios {
		margin: 0rem;
	}

	.list-ios>.item-block {
		font-size: 32rpx;
		padding: 0rem;
		position: relative;
	}

	.list-ios>.item-block:first-child {
		border: 0rem;
	}


	.input-wrapper>.select-ios:first-child {
		padding-left: 0rem;
	}

	.form_tips {
		font-size: 26rpx;
		padding: 72rpx 30rpx 40rpx 30rpx;
	}

	.form_tips image {
		margin-top: -4rpx;
		margin-right: 16rpx;
		vertical-align: middle;
		width: 38rpx;
	}

	.form_tips i.fa {
		color: #c20f22;
		margin: -4rpx 10rpx 0rem 0rem;
		vertical-align: middle;
		font-size: 40rpx;
	}

	.form_tips span i {
		color: #4a90e2;
		font-style: normal;
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
</style>