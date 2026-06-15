<template>
	<view>
		<div class="banner">
			<image mode="widthFix" src="/static/imgs/login_banner.png" />
		</div>

		<view class="uni-list">

			<!-- 选择地区 -->
			<view class="uni-item">
				<text class="uni-label">选择地区</text>
				<view class="" @click="show=true">
					<text v-if="prov">{{prov}}-{{city}}-{{label}}</text>
					<text v-else>请选择</text>
				</view>
			</view>

			<view class="uni-item">
				<text class="uni-label">用户姓名</text>
				<input v-model="nickname" placeholder="请输入您的名称" class="uni-input" />
			</view>

			<view class="uni-item">
				<text class="uni-label">手机号码</text>
				<input v-model="phone" placeholder="请输入注册手机号码" type="number" class="uni-input" />
			</view>

			<view class="uni-item" style="position: relative;">
				<text class="uni-label">验证码</text>
				<input v-model="code" placeholder="请输入验证码" class="uni-input" />
				<div class="codes" @click="getCodes()">{{code_tip}}</div>
			</view>

			<view class="uni-item">
				<text class="uni-label">密 码</text>
				<input v-model="passwd" type="safe-password" placeholder="请输入登录密码" class="uni-input" />
			</view>

			<view class="uni-item">
				<text class="uni-label">确认密码</text>
				<input v-model="vipass" type="safe-password" placeholder="请再次输入新密码" class="uni-input" />
			</view>

		</view>



		<div class="form_tips">
			<u-checkbox v-model="regtool" active-color="red"></u-checkbox>
			<span @click="viewTools()">注册账号即代表您同意并认可<i>《易缆通APP使用条款》</i></span>
		</div>
		<div class="form_button" @click="doRegist()">立即注册</div>

		<u-picker mode="region" @confirm="confirm" v-model="show" :params="params"></u-picker>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				regtool: false,
				ac_type: 2,
				prov: 0,
				prov_list: '',
				city: 0,
				city_list: '',
				label: 0,
				label_list: '',
				////
				nickname: "",
				phone: "",
				code: "",
				passwd: "",
				vipass: "",
				////

				//
				code_tim: 0,
				code_tip: "获取验证码",
				params: {
					province: true,
					city: true,
					area: true
				},
				show: false,
			}
		},
		methods: {
			viewTools() {
				uni.navigateTo({
					url: '/pages/login_md/regtool/regtool'
				})
			},
			confirm(e) {
				this.prov = e.province.label
				this.city = e.city.label
				this.label = e.area.label
				console.log(e);
			},
			/**
			 * 获取验证码
			 */
			getCodes() {
				var that = this;
				if (that.phone.length < 1) {
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
			doRegist() {
				let that = this;
				var param = {
					prov: that.prov,
					city: that.city,
					label: that.label,
					nickname: that.nickname,
					phone: that.phone,
					code: that.code,
					passwd: that.passwd,
					vipass: that.vipass,
				};
				if (!that.regtool) {
					uni.showToast({
						title: "请阅读并同意注册协议",
						icon: "none"
					})
					return false;
				}

				uni.showModal({
					title: '提示',
					content: '注册账号即代表您同意并认可《易缆通APP使用条款》',
					success: (res) => {
						if (res.confirm) {
							that.$api.reg(param).then(ret => {
								uni.navigateBack()
							}).catch(err => {});
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
		position: absolute;
		right: 30rpx;
		top: 30rpx;
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