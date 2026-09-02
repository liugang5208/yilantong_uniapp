<template>
	<view class="feedback-container">
		<!-- 意见内容输入框 -->
		<view class="input-box">
			<textarea 
				v-model="content" 
				placeholder="请详细描述您遇到的问题或宝贵建议..." 
				maxlength="500"
				placeholder-style="color: #999;"
			/>
			<text class="word-count">{{ content.length }}/500</text>
		</view>

		<!-- 联系方式（选填） -->
		<view class="contact-box">
			<input 
				type="text" 
				v-model="contact" 
				placeholder="请输入您的联系方式/手机号（选填）" 
				placeholder-style="color: #999;"
			/>
		</view>

		<!-- 提交按钮 -->
		<button class="submit-btn" @click="submitFeedback">提交反馈</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				content: '', // 反馈内容
				contact: ''  // 联系方式
			}
		},
		methods: {
			submitFeedback() {
				if (!this.content.trim()) {
					uni.showToast({ title: '请输入反馈内容', icon: 'none' });
					return;
				}

				uni.showLoading({ title: '提交中...' });

				// 组装传给后台的参数（根据你们后端接口要求的字段名调整，比如 content / contact 等）
				let params = {
					content: this.content,
					contact: this.contact
				};

				// 调用后端接口
				// 提示：请确保你的 $api 里面有对应的请求方法，或者换成你们项目通用的请求方式
				this.$api.feedbackAdd(params).then(res => {
					uni.hideLoading();
					uni.showToast({ title: '提交成功，谢谢您的建议', icon: 'success' });
					setTimeout(() => {
						uni.navigateBack(); // 提交成功后自动返回上一页
					}, 1500);
				}).catch(err => {
					uni.hideLoading();
					console.log(err);
					uni.showToast({ title: '提交失败，请稍后重试', icon: 'none' });
				});
			}
		}
	}
</script>

<style scoped lang="scss">
	.feedback-container {
		background-color: #f7f9fc;
		min-height: 100vh;
		padding: 30rpx 24rpx;
		box-sizing: border-box;

		.input-box {
			background-color: #ffffff;
			border-radius: 20rpx;
			padding: 30rpx;
			position: relative;
			margin-bottom: 24rpx;
			box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.02);

			textarea {
				width: 100%;
				height: 300rpx;
				font-size: 28rpx;
				color: #333333;
			}

			.word-count {
				position: absolute;
				bottom: 20rpx;
				right: 30rpx;
				font-size: 24rpx;
				color: #999999;
			}
		}

		.contact-box {
			background-color: #ffffff;
			border-radius: 20rpx;
			padding: 0 30rpx;
			margin-bottom: 50rpx;
			box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.02);

			input {
				height: 100rpx;
				font-size: 28rpx;
				color: #333333;
			}
		}

		.submit-btn {
			background-color: #007aff;
			color: #ffffff;
			font-size: 32rpx;
			height: 96rpx;
			line-height: 96rpx;
			border-radius: 48rpx;
			border: none;
			box-shadow: 0 6rpx 16rpx rgba(0, 122, 255, 0.2);
		}
	}
</style>