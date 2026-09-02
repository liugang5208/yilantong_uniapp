<template>
	<view class="help-container">
		<!-- 顶部横向分类标签栏 -->
		<scroll-view scroll-x="true" class="tab-scroll" show-scrollbar="false">
			<view class="tab-box">
				<view 
					v-for="(tab, index) in categories" 
					:key="index" 
					:class="['tab-item', currentTab === index ? 'active-tab' : '']"
					@click="switchTab(index)"
				>
					{{ tab }}
				</view>
			</view>
		</scroll-view>

		<!-- 帮助列表内容区 -->
		<view class="list-content">
			<view class="help-card" @click="gotoChild(item.id)" v-for="(item, index) in filteredList" :key="index">
				<view class="card-left">
					<view class="dot"></view>
					<text class="card-title">{{ item.cleanTitle }}</text>
				</view>
				<image mode="widthFix" src="/static/icon/ic_right_gy.png" class="right-icon" />
			</view>
			
			<view class="empty-tip" v-if="filteredList.length === 0">
				暂无相关帮助内容
			</view>
		</view>

		<!-- 底部固定“联系客服”悬浮条 -->
		<view class="service-bar" @click="showServiceModal">
			<text class="service-text">没有找到答案？点击联系客服/微信</text>
		</view>

		<!-- 客服微信/电话弹窗 -->
		<view class="uni-popup-mask" v-if="isModalVisible" @click="closeServiceModal">
			<view class="popup-content" @click.stop>
				<view class="popup-title">联系客服支持</view>
				
				<!-- 使用你最新的图片路径 -->
				<image src="/static/icon/elantewm.jpg" class="qrcode-img" mode="aspectFit" @click="previewImage" />
				<text class="tip-text">长按识别二维码，或添加微信咨询</text>
				
				<!-- 客服电话快捷拨打区 -->
				<view class="phone-box" @click="makePhoneCall">
					<text class="phone-label">客服热线：</text>
					<text class="phone-number">18883333289</text>
					<text class="call-btn">拨打</text>
				</view>

				<button class="close-btn" @click="closeServiceModal">我知道了</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				rawList: [],      
				categories: [], 
				currentTab: 0,    
				isModalVisible: false, 
			}
		},
		computed: {
			filteredList() {
				if (this.categories.length === 0) return [];
				const selectedCategory = this.categories[this.currentTab];
				return this.rawList.filter(item => item.category === selectedCategory);
			}
		},
		onLoad() {
			this.doIninit()
		},
		methods: {
			doIninit() {
				let that = this;
				that.$api.helps([]).then(ret => {
					const resData = ret.data || [];
					let catSet = new Set();
					
					that.rawList = resData.map(item => {
						let title = item.title || '';
						let match = title.match(/【(.*?)】/);
						let category = '常用帮助';
						let cleanTitle = title;
						
						if (match) {
							category = match[1]; 
							catSet.add(category);
							cleanTitle = title.replace(/【(.*?)】/, '').trim(); 
						} else {
							catSet.add(category);
						}
						
						return {
							...item,
							category: category,
							cleanTitle: cleanTitle
						};
					});
					
					that.categories = Array.from(catSet);
					that.currentTab = 0;
				}).catch(err => {
					console.log(err);
				});
			},
			switchTab(index) {
				this.currentTab = index;
			},
			gotoChild(id){
				uni.navigateTo({
					url:'/pages/my/heindex/heinfo?id='+id
				})
			},
			showServiceModal() {
				this.isModalVisible = true;
			},
			closeServiceModal() {
				this.isModalVisible = false;
			},
			makePhoneCall() {
				uni.makePhoneCall({
					phoneNumber: '18883333289'
				});
			},
			previewImage() {
				uni.previewImage({
					urls: ['/static/icon/elantewm.jpg']
				});
			}
		}
	}
</script>

<style scoped lang="scss">
	.help-container {
		background-color: #f7f9fc;
		min-height: 100vh;
		padding-bottom: 140rpx;
	}

	.tab-scroll {
		width: 100%;
		background-color: #ffffff;
		white-space: nowrap;
		position: sticky;
		top: 0;
		z-index: 10;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.03);

		.tab-box {
			display: inline-flex;
			padding: 0 24rpx;
			height: 100rpx;
			align-items: center;

			.tab-item {
				padding: 0 36rpx;
				height: 64rpx;
				line-height: 64rpx;
				font-size: 28rpx;
				color: #555555;
				background-color: #f0f2f5;
				border-radius: 32rpx;
				margin-right: 20rpx;
				font-weight: 500;
				transition: all 0.3s;

				&.active-tab {
					color: #ffffff;
					background-color: #007aff; 
					font-weight: bold;
					box-shadow: 0 4rpx 12rpx rgba(0, 122, 255, 0.3);
				}
			}
		}
	}

	.list-content {
		padding: 24rpx;

		.help-card {
			background-color: #ffffff;
			border-radius: 16rpx;
			padding: 32rpx 24rpx;
			margin-bottom: 20rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.02);

			.card-left {
				display: flex;
				align-items: center;
				flex: 1;
				margin-right: 20rpx;

				.dot {
					width: 12rpx;
					height: 12rpx;
					background-color: #007aff;
					border-radius: 50%;
					margin-right: 16rpx;
					flex-shrink: 0;
				}

				.card-title {
					font-size: 30rpx;
					color: #333333;
					line-height: 1.4;
					font-weight: 500;
				}
			}

			.right-icon {
				width: 32rpx;
				height: 32rpx;
				opacity: 0.3;
			}
		}
	}

	.service-bar {
		position: fixed;
		bottom: 30rpx;
		left: 30rpx;
		right: 30rpx;
		background: linear-gradient(135deg, #007aff, #00c6ff);
		border-radius: 44rpx;
		height: 88rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 8rpx 20rpx rgba(0, 122, 255, 0.3);

		.service-text {
			color: #ffffff;
			font-size: 30rpx;
			font-weight: bold;
		}
	}

	/* 弹窗样式 */
	.uni-popup-mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.6);
		z-index: 999;
		display: flex;
		align-items: center;
		justify-content: center;

		.popup-content {
			width: 80%;
			background-color: #ffffff;
			border-radius: 24rpx;
			padding: 40rpx 30rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.2);

			.popup-title {
				font-size: 34rpx;
				font-weight: bold;
				color: #333333;
				margin-bottom: 24rpx;
			}

			.qrcode-img {
				width: 360rpx;
				height: 360rpx;
				border-radius: 12rpx;
				border: 2rpx solid #eee;
			}

			.tip-text {
				font-size: 24rpx;
				color: #888888;
				margin-top: 16rpx;
				margin-bottom: 30rpx;
			}

			.phone-box {
				width: 100%;
				background-color: #f7f9fc;
				border-radius: 12rpx;
				padding: 20rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin-bottom: 30rpx;
				box-sizing: border-box;

				.phone-label {
					font-size: 28rpx;
					color: #555555;
				}

				.phone-number {
					font-size: 30rpx;
					font-weight: bold;
					color: #007aff;
					flex: 1;
					margin-left: 10rpx;
				}

				.call-btn {
					background-color: #007aff;
					color: #ffffff;
					font-size: 24rpx;
					padding: 8rpx 24rpx;
					border-radius: 20rpx;
				}
			}

			.close-btn {
				width: 100%;
				height: 80rpx;
				line-height: 80rpx;
				background-color: #f0f2f5;
				color: #333333;
				font-size: 30rpx;
				border-radius: 40rpx;
				font-weight: 500;
				margin: 0;
			}
		}
	}

	.empty-tip {
		text-align: center;
		color: #999999;
		font-size: 28rpx;
		margin-top: 100rpx;
	}
</style>