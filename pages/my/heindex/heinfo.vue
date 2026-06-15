<template>
	<view>
		<view class="" style="width: 750rpx;padding: 30rpx;">
			<rich-text :nodes="nodes">
				
			</rich-text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title:"",
				id:'',
				nodes:'',
			}
		},
		onLoad(option) {
			this.id=option.id?option.id:''
			this.doIninit()
		},
		methods: {
			 doIninit() {
			    let that = this;
			    that.$api.helps_info({ id: that.id }).then(ret => {
			      that.info = ret.data;
				  this.title=this.info.title
				  this.nodes=this.info.context
				  var reg=/<img/gi
				  this.nodes=this.nodes.replace(reg, '<img style="width:100%!important;height:auto;!important"')
				  uni.setNavigationBarTitle({
				    title: this.title // 这里设置你的页面标题
				  });
			    }).catch(err => {
			      console.log(err.status);
			      console.log(err.error);
			      console.log(err.headers);
			    });
			  }
		}
	}
</script>

<style>

</style>
