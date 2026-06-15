<template>
	<view>
		<view class="line" @click="gotoChild(item.id)" v-for="(item,index) in list">
			<span>{{item.title}}</span>
			<image mode="widthFix" src="/static/icon/ic_right_gy.png" class="right" />
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [],
			}
		},
		onLoad() {
			this.doIninit()
		},
		methods: {
			doIninit() {
				let that = this;
				var urls = "Index/helps.html";
				//
				that.$api.helps([]).then(ret => {
					that.list = ret.data;
				}).catch(err => {
					console.log(err.status);
					console.log(err.error);
					console.log(err.headers);
				});
			},
			gotoChild(id){
				uni.navigateTo({
					url:'/pages/my/heindex/heinfo?id='+id
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.line {
		border-top: 2rpx solid #eeeeee;
		min-height: 100rpx;
		font-size: 34rpx;
		line-height: 100rpx;
		padding: 0rem 24rpx;
		position: relative;
	}

	.line:last-child {
		border-bottom: 2rpx solid #eeeeee;
	}

	.line span.right {
		top: 0rem;
		position: absolute;
		right: 24rpx;
	}

	.line::after {
		display: table;
		clear: both;
		content: " ";
	}

	.line image {
		float: right;
		margin: 24rpx 0rem;
		vertical-align: middle;
		width: 40rpx;
	}
</style>