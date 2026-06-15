<template>
	<view>
		 
	</view>
</template>

<script>
	var wv;//计划创建的webview
	export default {
		data() {
			return {
				title: 'Hello',
				webviewStyles: {
					progress: {
						color: '#FF3333'
					},
					height:"100px",
					width:'300px'
				}

			}
		},
		async created() {
            
		},
		methods: {

		}
	}
</script>

<style>
	 .webView{
		 width: 100%;
		 height: calc(100vh);
	 }
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
</style>