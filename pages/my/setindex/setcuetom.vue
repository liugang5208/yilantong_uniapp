<template>
	<view>
		<view class="line">
			<span>联系电话</span>
			<span @click="extractPhoneNumber(info.cus_phone)" class="right" style="color: blue;">
				{{info.cus_phone}}
			</span>
		</view>
		<view class="line">
			<span>客服微信</span>
			<span class="right">{{info.cus_wechat}}</span>
		</view>
		<view class=" line d_a_sb">
			<view>微信二维码</view>
			<view style="width: 150rpx;height: 150rpx;margin-top: 20rpx;margin-bottom: 20rpx;">
				<rich-text v-if="info.cus_qrcode" :nodes="getQrcode(info.cus_qrcode)"></rich-text>
			</view>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				info: {},
			}
		},
		onLoad() {
			this.doIninit()
		},
		methods: {
			extractPhoneNumber(text) {
				const match = text.match(/\d{11}/); // 正则表达式匹配11位数字
				if (match && match[0]) {
					uni.makePhoneCall({
						phoneNumber: match[0], // 使用提取的电话号码
						success() {
							console.log('拨打电话成功');
						},
						fail() {
							console.log('拨打电话失败');
						},
					});
				}
			},
			getQrcode(nodes) {
				if (!nodes) {
					return false
				}
				var reg = /<img/gi
				return nodes.replace(reg, '<img style="width:100%!important;height:auto;!important"')
			},
			doIninit() {
				var that = this;
				var param = {
					types: "0"
				};
				uni.showLoading({
					title: '读取中...'
				})
				that.$api.artall(param).then(ret => {
					uni.hideLoading()
					that.info = ret.data;
				}).catch(err => {
					uni.hideLoading()
					console.log(err.status);
					console.log(err.error);
					console.log(err.headers);
				});
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
		width: 130rpx;
	}
</style>