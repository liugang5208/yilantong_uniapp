<template>
	<view class="detail-container">
		<!-- 文章精美主体卡片 -->
		<view class="article-card">
			<!-- 顶部大标题 -->
			<view class="article-header">
				<text class="title-text">{{ title }}</text>
				<view class="divider"></view>
			</view>
			
			<!-- 富文本正文 -->
			<rich-text :nodes="nodes" class="rich-content"></rich-text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: "",
				id: '',
				nodes: '',
			}
		},
		onLoad(option) {
			this.id = option.id ? option.id : ''
			this.doIninit()
		},
		methods: {
			doIninit() {
				let that = this;
				that.$api.helps_info({ id: that.id }).then(ret => {
					that.info = ret.data;
					// 过滤掉后台标题里的中括号，让页面上方显示干净的大标题
					let rawTitle = this.info.title || '';
					this.title = rawTitle.replace(/【(.*?)】/, '').trim();
					
					this.nodes = this.info.context;
					
					// 图片自适应
					var reg = /<img/gi;
					this.nodes = this.nodes.replace(reg, '<img style="width:100%!important;height:auto!important;display:block;"');
					
					uni.setNavigationBarTitle({
						title: "帮助详情" 
					});
				}).catch(err => {
					console.log(err);
				});
			}
		}
	}
</script>

<style scoped lang="scss">
	.detail-container {
		background-color: #f7f9fc;
		min-height: 100vh;
		padding: 24rpx;
		box-sizing: border-box;
	}

	.article-card {
		background-color: #ffffff;
		border-radius: 20rpx;
		padding: 40rpx 30rpx;
		box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.03);

		/* 顶部大标题样式 */
		.article-header {
			margin-bottom: 40rpx;

			.title-text {
				font-size: 38rpx;
				font-weight: bold;
				color: #1a1a1a;
				line-height: 1.4;
				display: block;
			}

			.divider {
				width: 100%;
				height: 2rpx;
				background-color: #f0f0f0;
				margin-top: 30rpx;
			}
		}
	}

	/* 富文本内容高级排版美化 */
	.rich-content {
		font-size: 30rpx;
		color: #333333;
		line-height: 1.85; 
		word-break: break-all;

		::v-deep p {
			margin-bottom: 28rpx;
			color: #3f3f3f;
		}

		::v-deep h1, ::v-deep h2, ::v-deep h3 {
			font-weight: bold;
			color: #111111;
			margin: 40rpx 0 20rpx 0;
			line-height: 1.4;
		}

		::v-deep img {
			max-width: 100% !important;
			border-radius: 16rpx; /* 图片加上更柔和的大圆角 */
			margin: 30rpx 0;
			box-shadow: 0 6rpx 16rpx rgba(0, 0, 0, 0.08); /* 图片带微弱阴影，质感倍增 */
		}
		
		::v-deep ul, ::v-deep ol {
			padding-left: 40rpx;
			margin-bottom: 28rpx;
		}
		
		::v-deep li {
			margin-bottom: 14rpx;
		}
	}
</style>