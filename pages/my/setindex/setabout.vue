<template>
	<view>
		<view class="" style="width: 690rpx;margin: 0 auto;">
			<rich-text :nodes="info.context" ></rich-text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				info:{}
			}
		},
		onLoad() {
			this.doIninit()
		},
		methods: {
			 doIninit() {
			    var that = this;
			    var param = { types: "about" };
			    that.$api.article( param).then(ret => {
			      that.info = ret.data;
			    }).catch(err => {
			    });
			  }
		}
	}
</script>

<style>

</style>
