<template>
	<view class="login-container">
		<!-- 顶部纯净 Banner 区域 -->
		<view class="banner-box">
			<image class="banner-img" mode="widthFix" src="/static/imgs/login_banner.png" />
		</view>

		<!-- 表单核心区域 -->
		<view class="form-box">
			<!-- 顶部快捷返回栏：只保留左侧返回登录，右侧留空或不放重复按钮 -->
			<view class="form-top-action">
				<text class="switch-btn" @click="toLogin()">&lt; 返回登录</text>
			</view>

			<!-- 输入框卡片群组 -->
			<view class="input-card-group">
				<!-- 地区选择行（扩大点击热区，彻底解决部分手机点不动、无法选择的问题） -->
				<view class="input-row region-row" @click="show = true">
					<text class="row-label">选择地区</text>
					<view class="row-val-box">
						<text class="selected-text" v-if="prov && prov !== 0">{{prov}} - {{city}} - {{label}}</text>
						<text class="placeholder-text" v-else>请选择省市区</text>
					</view>
					<text class="arrow-icon">&gt;</text>
				</view>

				<view class="input-row">
					<u-field v-model="nickname" label="用户姓名" placeholder="请输入您的名称" :border-bottom="false"></u-field>
				</view>
				
				<view class="input-row">
					<u-field v-model="phone" label="手机号码" type="number" placeholder="请输入注册手机号码" :border-bottom="false"></u-field>
				</view>
				
				<view class="input-row code-row">
					<u-field v-model="code" label="验证码" placeholder="请输入验证码" :border-bottom="false"></u-field>
					<view class="code-btn-box" @click.stop="getCodes()">
						<text class="code-text">{{code_tip}}</text>
					</view>
				</view>
				
				<view class="input-row">
					<u-field v-model="passwd" type="safe-password" label="密 码" placeholder="请输入登录密码" :border-bottom="false"></u-field>
				</view>
				
				<view class="input-row">
					<u-field v-model="vipass" type="safe-password" label="确认密码" placeholder="请再次输入新密码" :border-bottom="false"></u-field>
				</view>
			</view>
			
			<!-- 底部协议勾选（强制单行展示，不换行） -->
			<view class="agreement-box">
				<u-checkbox v-model="regtool" active-color="#2563eb" size="32"></u-checkbox>
				<text class="agreement-text">注册账号即代表您同意并认可<text class="link" @click.stop="viewTools()">《易缆通APP使用条款》</text></text>
			</view>

			<!-- 注册主按钮 -->
			<div class="submit-btn" @click="doRegist()">立即注册</div>
		</view>

		<!-- 底部轻量化版权信息 -->
		<view class="footer-box">
			<text class="footer-txt">© 2026 四川亚建线缆有限公司 版权所有</text>
		</view>

		<!-- 地区选择器组件 -->
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
				nickname: "",
				phone: "",
				code: "",
				passwd: "",
				vipass: "",
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
			toLogin() {
				uni.navigateBack({
					delta: 1,
					fail: () => {
						uni.redirectTo({
							url: '/pages/login_md/login'
						})
					}
				});
			},
			confirm(e) {
				this.prov = e.province.label
				this.city = e.city.label
				this.label = e.area.label
				console.log(e);
			},
			/**
			 * 获取验证码（接口保持原样）
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
	.login-container {
		min-height: 100vh;
		background-color: #f7f9fc;
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
	}

	/* 顶部纯净 Banner 区 */
	.banner-box {
		width: 100%;
		background-color: #ffffff;
		overflow: hidden;
		
		.banner-img {
			width: 100%;
			display: block;
		}
	}

	/* 表单核心区域 */
	.form-box {
		flex: 1;
		padding: 32rpx 32rpx 60rpx;
		display: flex;
		flex-direction: column;
		
		.form-top-action {
			display: flex;
			justify-content: flex-start;
			align-items: center;
			margin-bottom: 24rpx;
			padding: 0 4rpx;
			
			.switch-btn {
				font-size: 28rpx;
				color: #2563eb;
				font-weight: 500;
			}
		}
		
		/* 输入框卡片群组 */
		.input-card-group {
			background: #ffffff;
			border-radius: 24rpx;
			padding: 12rpx 24rpx;
			box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.02);
			border: 1rpx solid #edf2f7;
			margin-bottom: 24rpx;
			
			.input-row {
				position: relative;
				border-bottom: 1rpx solid #f1f5f9;
				
				&:last-child {
					border-bottom: none;
				}
			}

			/* 地区选择行 */
			.region-row {
				display: flex;
				align-items: center;
				padding: 24rpx 12rpx;
				font-size: 28rpx;
				color: #333;
				
				.row-label {
					width: 140rpx;
					color: #303133;
					font-weight: 500;
				}
				
				.row-val-box {
					flex: 1;
					text-align: right;
					padding-right: 16rpx;
					
					.selected-text {
						color: #303133;
					}
					
					.placeholder-text {
						color: #c0c4cc;
					}
				}
				
				.arrow-icon {
					color: #c0c4cc;
					font-size: 28rpx;
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
						color: #c20f22;
						font-weight: 600;
					}
				}
			}
		}
		
		/* 协议勾选区：强制不换行，单行完整展示 */
		.agreement-box {
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 24rpx;
			color: #64748b;
			margin-bottom: 36rpx;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			
			.agreement-text {
				margin-left: 12rpx;
				
				.link {
					color: #2563eb;
					font-weight: 500;
				}
			}
		}

		/* 高端琉璃渐变主按钮 */
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
	}

	/* 底部微标 */
	.footer-box {
		text-align: center;
		padding: 10rpx 0 40rpx;
		
		.footer-txt {
			font-size: 24rpx;
			color: #94a3b8;
			letter-spacing: 1rpx;
		}
	}
</style>