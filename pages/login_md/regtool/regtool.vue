<template>
	<view style="padding: 30rpx;">
		 <rich-text style="" :nodes="nodes"></rich-text>
	</view>
</template>

<script>
import login_mdVue from '../login_md.vue'
	export default {
		data() {
			return {
				nodes:'',
			}
		},
		onLoad() {
			this.$api.article({types: "reg_tool"}).then(res=>{
				this.nodes=res.data.context
			})
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
