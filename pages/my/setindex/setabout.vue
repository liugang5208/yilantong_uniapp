<template>
	<view class="about-container">
		<view class="content-box">
			<!-- 加上了富文本过滤和排版样式的渲染容器 -->
			<rich-text :nodes="formatRichText(info.context)"></rich-text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				info: {}
			}
		},
		onLoad() {
			this.doIninit()
		},
		methods: {
			// 核心优化：自动给富文本里的图片和文字加上美观的样式控制
			formatRichText(html) {
				if (!html) return '';
				// 1. 让所有的图片最大宽度100%，高度自适应，并加上圆角和上下间距，防止图片撑破屏幕
				let newHtml = html.replace(/<img/gi, '<img style="max-width:100%!important;height:auto!important;border-radius:12rpx;margin:20rpx 0;display:block;"');
				// 2. 优化段落和文字的基础样式（行高、字号、颜色）
				newHtml = newHtml.replace(/<p/gi, '<p style="line-height:1.8;font-size:30rpx;color:#333333;margin-bottom:24rpx;"');
				return newHtml;
			},
			doIninit() {
				var that = this;
				// 后台"文本分类"（sys_article）里"关于易缆通"这条记录的 models 是 "about"，
				// 之前写成不存在的 "agreement" 会查不到任何数据，页面一直是空白
				var param = { types: "about" };
				uni.showLoading({ title: '加载中...' });
				that.$api.article(param).then(ret => {
					uni.hideLoading();
					that.info = ret.data;
				}).catch(err => {
					uni.hideLoading();
				});
			}
		}
	}
</script>

<style scoped lang="scss">
	.about-container {
		background-color: #ffffff;
		min-height: 100vh;
		padding: 40rpx 30rpx;
		box-sizing: border-box;
	}

	.content-box {
		width: 100%;
		box-sizing: border-box;
		
		/* 全局约束富文本内部的默认标签排版 */
		::v-deep p {
			line-height: 1.8;
			font-size: 30rpx;
			color: #333333;
			margin-bottom: 24rpx;
		}
		
		::v-deep img {
			max-width: 100% !important;
			height: auto !important;
			border-radius: 12rpx;
			margin: 20rpx 0;
		}
	}
</style>