<template>
	<view class="custom-container">
		
		<!-- 第一组：核心团队/服务人员卡片 -->
		<view class="info-card">
			<!-- 客服经理 -->
			<view class="info-item">
				<view class="left-box">
					<text class="label">产品经理</text>
				</view>
				<view class="value-box">
					<text class="value-text">{{ managerName || '专属客服' }}</text>
				</view>
			</view>

			<!-- 客服电话 -->
			<view class="info-item" @click="extractPhoneNumber">
				<view class="left-box">
					<text class="label">客服电话</text>
				</view>
				<view class="value-box">
					<text class="phone-text">{{ cleanPhone || '暂无' }}</text>
					<text class="action-btn">立即拨打</text>
				</view>
			</view>

			<!-- 客服微信（已加粗并改成醒目颜色） -->
			<view class="info-item last-item" @click="copyWechat(pureWechatText)">
				<view class="left-box">
					<text class="label">客服微信</text>
				</view>
				<view class="value-box">
					<text class="wechat-text">{{ pureWechatText || '暂无' }}</text>
					<text class="action-btn copy-btn">复制微信</text>
				</view>
			</view>
		</view>

		<!-- 第二组：二维码扫码卡片 -->
		<view class="info-card qrcode-card">
			<view class="card-title">客服二维码</view>
			<view class="qrcode-wrapper">
				<!-- 
					开启 show-menu-by-longpress: 让手机底层原生接管长按，长按直接呼出微信/系统自带的“保存图片”菜单！
					这样能彻底解决直接下载失败的问题。
					点击则继续保持大图预览。
				-->
				<image 
					v-if="qrcodeUrl" 
					class="qrcode-img" 
					:src="qrcodeUrl" 
					mode="aspectFit" 
					:show-menu-by-longpress="true"
					@click="previewImage(qrcodeUrl)">
				</image>
				<text v-else class="no-qrcode">暂无二维码</text>
				<text class="qrcode-tip">长按二维码可直接保存，点击查看大图</text>
			</view>
		</view>

		<!-- 底部服务时间提示 -->
		<view class="service-time">
			<text>服务时间：周一至周日 09:00 - 18:00</text>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				info: {},
				qrcodeUrl: '' 
			}
		},
		computed: {
			managerName() {
				if (!this.info.cus_phone) return '';
				let plainText = this.info.cus_phone.replace(/<[^>]+>/g, '');
				let text = plainText.replace(/\d{11}/g, '').trim();
				return text;
			},
			cleanPhone() {
				if (!this.info.cus_phone) return '';
				let plainText = this.info.cus_phone.replace(/<[^>]+>/g, '');
				const match = plainText.match(/\d+/g);
				if (!match) return '';
				let fullNums = match.join('');
				if (fullNums.length >= 11) {
					return fullNums.slice(-11);
				}
				return fullNums;
			},
			pureWechatText() {
				if (!this.info.cus_wechat) return '';
				let plainText = this.info.cus_wechat.replace(/<[^>]+>/g, '');
				return plainText.trim();
			}
		},
		onLoad() {
			this.doIninit()
		},
		methods: {
			extractPhoneNumber() {
				let phoneToCall = this.cleanPhone;
				if (!phoneToCall || phoneToCall.length < 7) {
					uni.showToast({ title: '暂无有效的电话号码', icon: 'none' });
					return;
				}

				// #ifdef H5
				uni.showModal({
					title: '客服电话',
					content: '当前为网页预览环境，电话号码为：' + phoneToCall,
					showCancel: false
				});
				// #endif

				// #ifndef H5
				uni.makePhoneCall({
					phoneNumber: phoneToCall,
					success: () => {},
					fail: (err) => {
						console.log('拨号取消或失败:', err);
					}
				});
				// #endif
			},
			copyWechat(wechat) {
				if (!wechat) {
					uni.showToast({ title: '暂无微信号', icon: 'none' });
					return;
				}
				uni.setClipboardData({
					data: wechat,
					success: () => {
						uni.showToast({ title: '复制微信成功', icon: 'success' });
					}
				});
			},
			extractImageSrc(html) {
				if (!html) return '';
				const match = html.match(/src=["'](.*?)["']/);
				if (!match || !match[1]) return '';
				return match[1];
			},
			previewImage(url) {
				uni.previewImage({
					urls: [url],
					current: 0
				});
			},
			doIninit() {
				var that = this;
				var param = { types: "0" };
				that.$api.artall(param).then(ret => {
					that.info = ret.data || {};
					if (ret.data && ret.data.cus_qrcode) {
						that.qrcodeUrl = that.extractImageSrc(ret.data.cus_qrcode);
					}
				}).catch(err => {
					console.log(err);
				});
			}
		}
	}
</script>

<style scoped lang="scss">
	.custom-container {
		background-color: #f7f9fc;
		min-height: 100vh;
		padding: 30rpx 24rpx;
		box-sizing: border-box;
	}

	.info-card {
		background-color: #ffffff;
		border-radius: 20rpx;
		box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.02);
		overflow: hidden;
		padding: 0 32rpx;
		margin-bottom: 24rpx;

		.info-item {
			display: flex;
			align-items: center;
			justify-content: space-between;
			min-height: 110rpx;
			border-bottom: 1rpx solid #f2f2f2;
			box-sizing: border-box;

			&.last-item {
				border-bottom: none;
			}

			.label {
				font-size: 30rpx;
				color: #333333;
				font-weight: 500;
				flex-shrink: 0;
			}

			.value-box {
				display: flex;
				align-items: center;
				justify-content: flex-end;
				flex: 1;
				margin-left: 20rpx;

				.value-text {
					font-size: 28rpx;
					color: #666666;
					text-align: right;
					margin-right: 16rpx;
				}

				.phone-text {
					font-size: 28rpx;
					color: #007aff;
					font-weight: 600;
					margin-right: 16rpx;
					text-align: right;
				}

				/* 【新增】把客服微信文字加粗、改成和电话一样的醒目蓝色 */
				.wechat-text {
					font-size: 28rpx;
					color: #007aff;
					font-weight: 600;
					margin-right: 16rpx;
					text-align: right;
				}

				.action-btn {
					font-size: 24rpx;
					color: #ffffff;
					background-color: #007aff;
					padding: 6rpx 20rpx;
					border-radius: 30rpx;
					flex-shrink: 0;

					&.copy-btn {
						background-color: #52c41a;
					}
				}
			}
		}
	}

	.qrcode-card {
		padding: 32rpx;
		text-align: center;

		.card-title {
			font-size: 30rpx;
			color: #333333;
			font-weight: 600;
			margin-bottom: 24rpx;
			text-align: left;
		}

		.qrcode-wrapper {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			background-color: #fcfcfc;
			border: 1rpx solid #f0f0f0;
			border-radius: 16rpx;
			padding: 30rpx 0;

			.qrcode-img {
				width: 300rpx;
				height: 300rpx;
				border-radius: 12rpx;
				margin-bottom: 16rpx;
			}

			.no-qrcode {
				font-size: 28rpx;
				color: #999999;
				height: 200rpx;
				line-height: 200rpx;
			}

			.qrcode-tip {
				font-size: 26rpx;
				color: #999999;
			}
		}
	}

	.service-time {
		text-align: center;
		margin-top: 40rpx;
		
		text {
			font-size: 26rpx;
			color: #888888;
		}
	}
</style>