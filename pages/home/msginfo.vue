<template>
	<view>
		<div class="panel">
			<div class="list_item_notice">
				<div class="list_item_notice-msg">
					<image mode="widthFix" :src="'/static/icon/ic_msg_' +info.icon+'.png'" />
					{{info.types>0?'订单发货通知':'系统通知消息'}}
				</div>
			</div>
			<div class="list_item_time">{{info.time_zone}}</div>
			<div class="list_item_msg">主题：
				<span :class="info.color==1 ? 'green' : info.color==2?'red':info.color==3?'blue':''">{{info.theme}}</span>
			</div>
		</div>
		<div class="panel_data">{{info.context}}</div>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				id: '',
				info: {},
			}
		},
		onLoad(option) {
			this.id = option.ids ? option.ids : '';
			this.doIninit()
		},
		methods: {
			doIninit() {
				let that = this;
				var params = {
					ids: that.id
				};
				//
				that.$api.msg_info( params).then(ret => {
					
					that.info = ret.data;
				}).catch(err => {
					console.log(err.status);
					console.log(err.error);
					console.log(err.headers);
				});
			}
		}
	}
</script>

<style scoped lang="scss">
	.green {
		color: green;
	}

	.red {
		color: red;
	}

	.blue {
		color: blue;
	}

	.content-ios {
		background: #f8f8f8;
	}

	.panel {
		padding: 32rpx 24rpx;
	}

	.list_item_notice {
		display: flex;
	}

	.list_item_notice-msg {
		flex: 2;
		height: 38rpx;
		line-height: 38rpx;
	}

	.list_item_notice-msg image {
		margin-top: -4rpx;
		margin-right: 16rpx;
		vertical-align: middle;
		width: 38rpx;
	}

	.list_item_time {
		color: #999999;
		height: 60rpx;
		line-height: 60rpx;
	}

	.list_item_msg {
		font-size: 30rpx;
		margin-bottom: 40rpx;
	}

	.panel_data {
		background: white;
		font-size: 30rpx;
		padding: 20rpx 24rpx;
		_text-indent: 80rpx;
	}
</style>