<template>
	<view>
		<u-navbar :is-back="false" title="">
			<view class="d_a_sb " style="width: 750rpx;">
				<view style="width: 200rpx;padding-left: 30rpx;" @click="back">
					<u-icon name="nav-back" color="#606266" :size="44">
					</u-icon>
				</view>
				<view style="font-size: 30rpx; color: #000; font-weight: bold; text-align: center; flex-grow: 1;">报价单列表管理</view>
				<view style="width: 200rpx;padding-right: 30rpx; color: #488aff; text-align: right;" @click="clearAll">清空列表</view>
			</view>
		</u-navbar>

		<view v-for="(item,index) in list " :key="index">
			<view class="line">报价单生成时间：{{item.time_zone}}</view>
			<view class="line_box">
				<p>上调比例：
					<span :class="{'green_color': item.ratio<0}">{{item.ratio}}%</span>
				</p>
				<p>质量标准：<span style="color: blue">{{item.trans_bids}}</span></p>
				<p>
					报价税率：
					<span style="color: blue">{{item.ticket==0?'不含税票':''}}
						{{item.ticket==1?'增值税普通税票':''}}
						{{item.ticket==2?'增值税专用税票':''}}</span>

				</p>
				<p>序号数量：<span style="color: blue">{{item.goods_count}}条商品信息</span></p>
				<p>订单金额：<span :class="{'green_color': item.ratio<0}">{{item.money}}元</span></p>
				<p>报价单位：{{item.rep_comp}}</p>
				<p>询价单位：{{item.question_comp}}</p>
				<p>项目名称：{{item.project_comp}}</p>
				<p>付款方式：{{item.check_type}}</p>

			</view>
			<view class="w_100 d_a" style="margin-top: 20rpx;margin-bottom: 20rpx;justify-content: flex-end;">
				<view>
					<u-button type="error" size="mini" @click="delSing(item.id)">删除报价</u-button>
				</view>
				<view style="margin-right: 30rpx;margin-left: 30rpx">
					<u-button type="primary" size="mini" @click="reportAgain(item.id)">引用报价单</u-button>
				</view>
				<view style="margin-right: 30rpx;">
					<u-button type="success" size="mini" @click="gotoinfo(item)">查看详情</u-button>
				</view>



			</view>

		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				uid: '',
				list: '',
			}
		},
		onLoad() {
			let userInfo = uni.getStorageSync('loginTicket');
			if (userInfo == null || userInfo == "") {
				uni.showModal({
					title: '提示',
					content: '您还未登录，前往登录',
					showCancel: false,
					success: (res) => {
						if (res.confirm) {
							uni.reLaunch({
								url: '/pages/login_md/login_md'
							})
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			} else {
				console.log(userInfo);
				this.uid = userInfo.id
				this.doIninit()
			}
		},
		methods: {
			doIninit() {
				let that = this;
				var params = {
					uid: that.uid,
				};
				that.$api.replist(params).then(ret => {
					that.list = ret.data;
				})
			},
			back() {
				uni.navigateBack()
			},
			clearAll() {
				let that = this;
				let params = {
					uid: that.uid,
				};
				uni.showModal({
					title: '提示',
					content: '确定要清空?',
					success: (res) => {
						if (res.confirm) {
							that.$api.repall(params).then(ret => {
								that.doIninit();
							})
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			delSing(ids) {
				let that = this;
				let params = {
					id: ids,
				};
				uni.showModal({
					title: '提示',
					content: '确定要删除',
					success: (res) => {
						if (res.confirm) {
							that.$api.repdel(params).then(ret => {
								that.doIninit();
							})
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			async reportAgain(id) {
				
			let res = await	this.$api.checkReport({
					uid:this.uid
				})
				let msg = "确定要引用报价单？"
				if(res.data.report_count>0){
					msg = '报价单存在未完成的报价，是否继续引用该报价单，如继续引用该报价单将会清除未完成的数据'
				}
				uni.showModal({
					title: '提示',
					content: msg,
					success: (res) => {
						if (res.confirm) {
							this.$api.reportAgain({
								uid: this.uid,
								id: id
							}).then(ret => {
								uni.navigateTo({
									url:'/pages/report/repinfos'
								})
								this.doIninit();
							})
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			gotoinfo(info) {
				uni.navigateTo({
					url: '/pages/report/repdata?id=' + info.id
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.line {
		background: #4a90e2;
		box-sizing: border-box;
		color: white;
		font-size: 24rpx;
		height: 56rpx;
		line-height: 40rpx;
		padding: 12rpx 24rpx;
	}

	.line_box {
		padding: 16rpx 24rpx 32rpx;
		position: relative;
	}

	.line_box p {
		font-size: 28rpx;
		margin: 0rem;
		margin-top: 15rpx;
	}

	.line_box p span {
		color: #d0021b;
	}

	.redColor {
		color: red;
	}

	.green_color {
		color: green !important;
	}

	.line_box_btn {
		border: 2rpx solid #d0021b;
		bottom: 32rpx;
		color: #d0021b;
		font-size: 24rpx;
		height: 56rpx;
		line-height: 56rpx;
		position: absolute;
		right: 24rpx;
		text-align: center;
		width: 144rpx;
	}

	.line_box_btn2 {
		right: 176rpx;
	}
</style>