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

		<!-- 历史反馈记录 -->
		<view class="history-section" v-if="list.length > 0">
			<view class="history-title">我的反馈记录</view>
			<view class="history-item" v-for="(item, index) in list" :key="item.id">
				<view class="history-header">
					<text class="history-time">{{ formatTime(item.times) }}</text>
					<text :class="['history-status', item.status > 0 ? 'status-replied' : 'status-pending']">
						{{ item.status > 0 ? '已回复' : '待回复' }}
					</text>
				</view>
				<view class="history-content">{{ item.context }}</view>
				<view class="history-reply" v-if="item.status > 0 && item.reply">
					<text class="reply-label">客服回复：</text>
					<text class="reply-text">{{ item.reply }}</text>
				</view>
			</view>
		</view>

		<view class="history-empty" v-else-if="loadedOnce">
			<text>暂无反馈记录</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				uid: '',
				content: '', // 反馈内容
				contact: '',  // 联系方式
				list: [],
				loadedOnce: false
			}
		},
		onLoad() {
			let userInfo = uni.getStorageSync('loginTicket');
			if (userInfo == null || userInfo == "") {
				uni.showModal({
					title: '提示',
					content: '您还未登录，前往登录',
					showCancel: false,
					success: (res) => {
						if (res.confirm) {
							uni.reLaunch({ url: '/pages/login_md/login_md' });
						}
					}
				});
				return;
			}
			this.uid = userInfo.id;
			this.loadFeedbackList();
		},
		methods: {
			formatTime(times) {
				if (!times) return '';
				let d = new Date(Number(times) * 1000);
				let pad = n => String(n).padStart(2, '0');
				return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
			},
			loadFeedbackList() {
				let that = this;
				that.$api.feedbackList({ uid: that.uid }).then(res => {
					that.list = res.data || [];
					that.loadedOnce = true;
				}).catch(err => {
					console.log(err);
					that.loadedOnce = true;
				});
			},
			submitFeedback() {
				if (!this.uid) {
					uni.showToast({ title: '请先登录', icon: 'none' });
					return;
				}
				if (!this.content.trim()) {
					uni.showToast({ title: '请输入反馈内容', icon: 'none' });
					return;
				}

				uni.showLoading({ title: '提交中...' });

				let params = {
					uid: this.uid,
					content: this.content,
					contact: this.contact
				};

				this.$api.feedbackAdd(params).then(res => {
					uni.hideLoading();
					uni.showToast({ title: '提交成功，谢谢您的建议', icon: 'success' });
					this.content = '';
					this.contact = '';
					this.loadFeedbackList();
				}).catch(err => {
					uni.hideLoading();
					console.log(err);
					uni.showToast({ title: (err && err.msg) || '提交失败，请稍后重试', icon: 'none' });
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

		.history-section {
			margin-top: 50rpx;

			.history-title {
				font-size: 30rpx;
				font-weight: 600;
				color: #333333;
				margin-bottom: 20rpx;
			}

			.history-item {
				background-color: #ffffff;
				border-radius: 16rpx;
				padding: 24rpx;
				margin-bottom: 20rpx;
				box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.02);

				.history-header {
					display: flex;
					align-items: center;
					justify-content: space-between;
					margin-bottom: 16rpx;

					.history-time {
						font-size: 24rpx;
						color: #999999;
					}

					.history-status {
						font-size: 22rpx;
						padding: 4rpx 16rpx;
						border-radius: 20rpx;
					}

					.status-pending {
						background-color: #fff4e5;
						color: #ff9500;
					}

					.status-replied {
						background-color: #e8f9ee;
						color: #34c759;
					}
				}

				.history-content {
					font-size: 28rpx;
					color: #333333;
					line-height: 1.5;
				}

				.history-reply {
					margin-top: 16rpx;
					padding: 16rpx;
					background-color: #f0f7ff;
					border-radius: 12rpx;
					font-size: 26rpx;
					line-height: 1.5;

					.reply-label {
						color: #007aff;
						font-weight: 600;
					}

					.reply-text {
						color: #333333;
					}
				}
			}
		}

		.history-empty {
			margin-top: 60rpx;
			text-align: center;
			font-size: 26rpx;
			color: #999999;
		}
	}
</style>
