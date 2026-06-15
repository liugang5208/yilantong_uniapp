<template>
	<view>
		<web-view :src="url"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				url:'',
				title:'隐私政策'
			}
		},
		onLoad(option) {
			console.log(option.title)
			 const title = decodeURIComponent(option.title || '')
			  console.log("设置标题为：", title)
			uni.setNavigationBarTitle({
				title:title
			})
			this.url=option.url?option.url:''
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
