<template>
	<view class="page">
		<div class="loadheight" v-if="load>0">
			<div class="loadheight_img" v-if="info.url">
				<image :src="singleLineBase64" mode="aspectFill" class="full-image"></image>
			</div>
			<div class="jump" @click="doJump()">({{initNumb}})跳过</div>
		</div>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				info: {
					url: '',
				},
				initNumb: 4,
				load: 1,
				singleLineBase64: '',
				initStatus: 0,
				setval: null,
			}
		},
		onLoad() {
			this.init()
		},
		methods: {
			async init() {
				let res = await this.$api.load_banner()
				this.info.url = res.data.list[res.data.show]
				this.singleLineBase64 = this.info.url.replace(/(\r\n|\n|\r)/gm, "");
				let initNumb = this.initNumb;
				let offset = 0;
				this.setval = setInterval(() => {
					this.initNumb = initNumb - offset;
					if (this.initStatus > 0) {
						clearInterval(this.setval);
						return;
					}
					console.log("BannerLog");
					if (offset >= initNumb) {
						clearInterval(this.setval);
						//////
						return this.doJump();
					}
					offset = offset + 1;
				}, 1000);
			},
			async doJump() {
				this.initStatus = 1;
				clearInterval(this.setval);
				uni.reLaunch({
					url: '/pages/index/index'
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.page{
		 
	}
	.loadover {
		overflow: hidden;
	}

	.loadheight {
		height: 100vh;
		line-height: 100vh;
		overflow: hidden;
		position: relative;
		text-align: center;
		padding-top: var(--status-bar-height);
		width: 750rpx;
	}

	.loadheight_img {
		display: inline-block;
		margin: auto;
		height: 100%;
		left: 0rem;
		position: absolute;
		top: 0px;
		text-align: center;
		width: 100%;
	}

	.loadheight_img image {
		height: 100%;
		width: 100%;
	}

	.jump {
		background: #000000;
		border-radius: 30rpx;
		color: white;
		font-size: 34rpx;
		position: absolute;
		height: 64rpx;
		line-height: 64rpx;
		opacity: 0.35;
		position: absolute;
		text-align: center;
		right: 40rpx;
		top: 100rpx;
		width: 150rpx;
		z-index: 10;
	}

.full-image {
	width: 100%;
	height: 100%;
	display: block;
}

</style>