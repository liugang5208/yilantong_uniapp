<template>
	<view class="page">
		<!-- 广告内容区：只有当资源加载完成准备好时才显示，之前保持干净的背景，绝不出现丑陋的转圈 -->
		<div class="loadheight fade-in-container" v-if="resourceLoaded">
			
			<!-- 情况 A：后台配置的是【视频】 -->
			<block v-if="info.type === 'video' && info.url">
				<video 
					class="full-video"
					:src="singleLineVideoUrl"
					:autoplay="true"
					:muted="isMuted" 
					:controls="false"
					:loop="false"
					object-fit="cover"
					@loadedmetadata="onVideoLoaded"
					@ended="doJump">
				</video>

				<!-- 声音开关控制按钮 -->
				<div class="sound-btn" @click="toggleSound">
					<text>{{ isMuted ? '🔇 点击开启声音' : '🔊 声音已开启' }}</text>
				</div>
			</block>

			<!-- 情况 B：后台配置的是【图片】 -->
			<block v-else-if="info.type === 'image' && info.url">
				<image 
					:src="singleLineBase64" 
					mode="aspectFill" 
					class="full-image"
					@load="onImageLoaded"
					@error="onImageError">
				</image>
			</block>

			<!-- 右上角统一的跳过按钮 -->
			<div class="jump" @click="doJump()">({{initNumb}})跳过</div>
		</div>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				info: {
					type: 'image',
					url: '',
				},
				initNumb: 5,
				singleLineBase64: '',
				singleLineVideoUrl: '',
				initStatus: 0,
				setval: null,
				resourceLoaded: false, // 只有准备好了才显示
				isMuted: true
			}
		},
		onLoad() {
			this.init()
		},
		methods: {
			async init() {
				try {
					let res = await this.$api.load_banner()

					// 没有配置/启用任何开屏广告时，不展示空白/异常界面，直接跳过进入首页
					if (!res.data || !res.data.url) {
						return this.doJump();
					}

					this.info.type = res.data.type === 'video' ? 'video' : 'image';
					this.info.url = res.data.url;

					if (this.info.type === 'video') {
						this.singleLineVideoUrl = this.info.url.replace(/(\r\n|\n|\r)/gm, "");
					} else {
						this.singleLineBase64 = this.info.url.replace(/(\r\n|\n|\r)/gm, "");
						// 图片直接给予渲染许可
						this.resourceLoaded = true;
						this.startCountdown(5);
					}
				} catch (e) {
					// 广告接口异常（网络失败等）：不能让用户卡在黑屏上，直接跳过
					console.log(e);
					this.doJump();
				}
			},

			onVideoLoaded(e) {
				this.resourceLoaded = true;
				let duration = Math.ceil(e.detail.duration || 5);
				this.initNumb = duration;
				this.startCountdown(duration);
			},

			onImageLoaded() {
				// 图片加载成功
			},

			onImageError() {
				this.resourceLoaded = true;
			},

			startCountdown(seconds) {
				this.initNumb = seconds;
				let offset = 0;
				this.setval = setInterval(() => {
					this.initNumb = seconds - offset;
					if (this.initStatus > 0) {
						clearInterval(this.setval);
						return;
					}
					if (offset >= seconds) {
						clearInterval(this.setval);
						return this.doJump();
					}
					offset = offset + 1;
				}, 1000);
			},

			toggleSound() {
				this.isMuted = !this.isMuted;
			},

			async doJump() {
				if (this.initStatus === 1) return;
				this.initStatus = 1;
				if (this.setval) {
					clearInterval(this.setval);
				}
				uni.reLaunch({
					url: '/pages/index/index'
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.page{
		width: 100vw;
		height: 100vh;
		overflow: hidden;
		position: relative;
		background-color: #000000; // 纯黑极简底色
	}

	.loadheight {
		height: 100vh;
		width: 100vw;
		overflow: hidden;
		position: relative;
		text-align: center;
	}

	/* 优雅的淡入渐变，绝不生硬 */
	.fade-in-container {
		animation: smoothFadeIn 0.5s ease-out forwards;
	}

	@keyframes smoothFadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	/* 强制视频、图片全屏无缝隙铺满 */
	.full-video, .full-image {
		width: 100vw;
		height: 100vh;
		display: block;
		position: absolute;
		top: 0;
		left: 0;
		object-fit: cover !important; 
	}

	/* 右上角跳过按钮 */
	.jump {
		background: rgba(0, 0, 0, 0.4);
		border-radius: 30rpx;
		color: white;
		font-size: 34rpx;
		position: absolute;
		height: 64rpx;
		line-height: 64rpx;
		text-align: center;
		right: 40rpx;
		top: 100rpx;
		width: 150rpx;
		z-index: 10;
	}

	/* 声音开关悬浮按钮样式 */
	.sound-btn {
		position: absolute;
		left: 40rpx;
		top: 100rpx;
		background: rgba(0, 0, 0, 0.4);
		color: white;
		font-size: 28rpx;
		padding: 0 24rpx;
		height: 64rpx;
		line-height: 64rpx;
		border-radius: 30rpx;
		z-index: 10;
	}
</style>