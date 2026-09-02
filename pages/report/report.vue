<template>
	<view class="wrap">
		<u-navbar :is-back="false" title="">
			<view class="d_a_sb" style="width: 750rpx;">
				<view style="width: 200rpx; visibility: hidden;">占位</view>
				<view style="font-size: 32rpx; color: #1a202c; font-weight: bold; text-align: center; flex-grow: 1;">报价中心</view>
				<view style="width: 200rpx; visibility: hidden;">占位</view>
			</view>
		</u-navbar>
		
		<!-- 极简高级感双卡片布局 -->
		<view class="dashboard-container">
			
			<!-- 1. 查看报价单：核心主打卡片（沉浸式科技蓝渐变） -->
			<view class="hero-card primary" @click="baojidan()">
				<view class="card-content">
					<view class="text-group">
						<text class="card-title">查看/制作报价单</text>
						<text class="card-desc">快速调取当前规格并生成正式报价明细</text>
					</view>
					<view class="icon-box">
						<image src="/static/imgs/baojiadan.png" class="card-img" mode="aspectFit" />
					</view>
				</view>
				<view class="card-arrow">→</view>
			</view>
			
			<!-- 2. 历史报价单：次级主打卡片（优雅红/高级质感渐变） -->
			<view class="hero-card secondary" @click="gotoReportLis()">
				<view class="card-content">
					<view class="text-group">
						<text class="card-title">历史报价单查阅</text>
						<text class="card-desc">检索、筛选、复用及管理往期历史记录</text>
					</view>
					<view class="icon-box">
						<image src="/static/imgs/lsbaojiadan.png" class="card-img" mode="aspectFit" />
					</view>
				</view>
				<view class="card-arrow">→</view>
			</view>

		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: 'Hello',
			}
		},
		async onLoad() {
			
		},
		methods: {
			baojidan(){
				uni.navigateTo({
					url: "/pages/report/repinfos"
				})
			},
			gotoReportLis(){
				uni.navigateTo({
					url: '/pages/report/repindex'
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.wrap {
		display: flex;
		flex-direction: column;
		width: 100%;
		background-color: #f8fafc;
		min-height: 100vh;
		box-sizing: border-box;
	}

	/* 容器排版 */
	.dashboard-container {
		padding: 40rpx 30rpx;
		display: flex;
		flex-direction: column;
		gap: 30rpx;

		/* 现代大卡片通用样式 */
		.hero-card {
			position: relative;
			border-radius: 28rpx;
			padding: 40rpx 36rpx;
			color: #ffffff;
			box-shadow: 0 12rpx 32rpx rgba(0, 0, 0, 0.08);
			display: flex;
			align-items: center;
			justify-content: space-between;
			overflow: hidden;
			transition: all 0.25s cubic-bezier(0.25, 1, 0.5, 1);

			&:active {
				transform: scale(0.97);
				box-shadow: 0 6rpx 16rpx rgba(0, 0, 0, 0.06);
			}

			/* 第一张主打：高级蓝渐变 */
			&.primary {
				background: linear-gradient(135deg, #165dff, #0034d1);
			}

			/* 第二张副打：高级红渐变 */
			&.secondary {
				background: linear-gradient(135deg, #f53f3f, #d91d1d);
			}

			.card-content {
				display: flex;
				align-items: center;
				justify-content: space-between;
				width: 100%;
				z-index: 2;

				.text-group {
					display: flex;
					flex-direction: column;
					gap: 10rpx;
					flex: 1;

					.card-title {
						font-size: 36rpx;
						font-weight: bold;
						letter-spacing: 0.5rpx;
					}

					.card-desc {
						font-size: 24rpx;
						opacity: 0.85;
						line-height: 1.4;
					}
				}

				.icon-box {
					width: 88rpx;
					height: 88rpx;
					background: rgba(255, 255, 255, 0.15);
					border-radius: 20rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					flex-shrink: 0;
					margin-left: 20rpx;

					.card-img {
						width: 52rpx;
						height: 44rpx;
					}
				}
			}

			/* 装饰性右侧轻量箭头 */
			.card-arrow {
				position: absolute;
				right: -20rpx;
				bottom: -20rpx;
				font-size: 120rpx;
				font-weight: bold;
				color: rgba(255, 255, 255, 0.06);
				z-index: 1;
				pointer-events: none;
			}
		}
	}
</style>