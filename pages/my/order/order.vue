<template>
	<view>
		<view class="nav">
			<view :class="navi==10?'active':''" class="nav_item" @click="changeNav(10)">全部</view>
			<view :class="navi==0?'active':''" class="nav_item " @click="changeNav(0)">待付款</view>
			<view :class="navi==1?'active':''" class="nav_item " @click="changeNav(1)">待发货</view>
			<view :class="navi==2?'active':''" class="nav_item " @click="changeNav(2)">待收货</view>
			<view :class="navi==3?'active':''" class="nav_item " @click="changeNav(3)">已完成</view>
			<view :class="navi==4?'active':''" class="nav_item " @click="changeNav(4)">已取消</view>
		</view>
		<view class="panel" v-for="(item,index) in list" :key="index">
			<view class="panel_box">
				<view class="panel_box-item_title">{{item.sn}}</view>
				<view class="panel_box-item" v-for="(x,i) in item.oinfo" :key="i">
					<view v-if="x.types=='0'" @click="gotoInfos(item.id)">
						<view class="panel_box-item_title">{{x.name}}</view>
						<view class="panel_box-item_image">
							<view class="panel_box-item_image-item">
								<image mode="widthFix" :src="x.imgs" />
							</view>
							<view class="panel_box-item_image-item">
								<p v-html="x.attr1"></p>
								<p v-html="x.attr2"></p>
								<p v-html="x.attr3"></p>
								<p>是否含税：<span> {{item.ticket=='0'?'不含发票':''}}{{item.ticket=='1'?'普通发票':''}}{{item.ticket=='2'?'专用发票':''}} </span></p>
							</view>
						</view>
						<view class="panel_box-item_attr">
							<view class="panel_box-item_attr-info">
								<view class="panel_box-item_attr-info_i">单价：<span>{{x.market}}</span></view>
								<view class="panel_box-item_attr-info_i">数量：<span>{{x.nums}}</span></view>
								<view class="panel_box-item_attr-info_i">金额：<span>{{transpoint(x.market*x.nums)}}</span></view>
							</view>
						</view>
					</view>



					<view v-if="x.types=='1'" @click="gotoInfos(item.id)">
						<view class="panel_box-item_title">{{x.name}}</view>
						<view class="panel_box-item_image">
							<view class="panel_box-item_image-item">
								<image mode="widthFix" :src="x.imgs" />
							</view>
							<view class="panel_box-item_image-item">
								<p v-html="x.attr1"></p>
								<p v-html="x.attr2"></p>
								<p v-html="x.attr3"></p>
								<p>是否含税：<span> {{item.ticket=='0'?'不含发票':''}} {{item.ticket=='1'?'普通发票':''}}{{item.ticket=='2'?'专用发票':''}}</span></p>
							</view>
						</view>
						<view class="panel_box-item_attr" v-for="(r,ix) in x.child" :key="ix">
							<view class="panel_box-item_attr-title">{{r.info.name}}</view>
							<view class="panel_box-item_attr-info">
								<view class="panel_box-item_attr-info_i">单价：<span>{{r.info.market}}</span></view>
								<view class="panel_box-item_attr-info_i">数量：<span>{{r.nums}}</span></view>
								<view class="panel_box-item_attr-info_i">金额：<span>{{transpoint(r.nums*r.info.market)}}</span></view>
							</view>
						</view>
					</view>


				</view>

				<view class="panel_box-item_total">
					<label>订单日期：{{item.time_zone}}</label> 共
					<span>{{item.count}}</span>件，合计：<span>{{item.money}}</span> 元
				</view>
				<view class="panel_box-btn  d_a_sb">
					<view  style="width: 150rpx;">
						<span style="color: #d0021b;">{{item.o_name}}</span>
					</view>
					<view  style="display: flex;align-items: center;justify-content: center;">
						<!--button *ngIf="item?.status==0" (click)="do_dels(item?.id)">删除订单</button-->
						<button v-if="item.status==0 && item.paymode==3" class="check" @click="gotoInfos(item.id)">上传汇款凭证完成付款</button>
						<button v-if="item.status==0 && item.paymode!=3" class="check" @click="setPay(item)">立即结算</button>
						<button v-if="item.status==0" class="red" @click="do_fixed(item.id,-1)">取消订单</button>
						<button v-if="item.status==1" class="check" @click="gotoInfos(item.id)">查看订单详情</button>
						<button v-if="item.status==2" class="check" @click="gotoInfos(item.id)">查看物流</button>
						<button v-if="item.status==2" class="red" @click="do_fixed(item.id,3)">确认收货</button>
						<!--button *ngIf="item?.status==3" class="red">去评价</button-->
						<button v-if="item.status==3" class="check" @click="gotoInfos(item.id)">查看物流</button>
						<button v-if="item.status==3" class="red" @click="gotoInfos(item.id)">查看详情</button>
					</view>
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
				navi: 10,
				list: '',
				key: '',
			}
		},
		onLoad(option) {
			this.navi = option.st ? option.st : ''
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
			changeNav(index) {
				this.navi = index;
				this.doIninit();
			},
			do_fixed(id, st) {
				let that = this;
				let params = {
					oid: id,
					status: st
				};
				let msg = "确定要取消？";
				if (st == 3) {
					msg = "订单已完成；感谢您使用易缆通 我们百分百努力只为您十分满意";
				}
				uni.showModal({
					title: '提示',
					content: msg,
					success: (res) => {
						if (res.confirm) {
							that.$api.oinfo_fixd(params).then(ret => {
								that.doIninit();
							});
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			setPay(r) {
				let that = this;
				if (r.paymode == 3 || r.paymode == 4) {
					uni.showModal({
						title: '提示',
						content: '您没有选择在线支付，请您使用对公转账信息转账给商户',
						showCancel: false,
					});
					return;
				}
				let params = {
					oid: r.id
				};
				that.$api.order_pay(params).then(ret => {
					if (r.paytype < 2) {
						return that.openWechatpay(ret.data);
					}
					return that.openAlipay(ret.data);
				});
			},
			transpoint(value) {
				return Math.floor(value * 100) / 100;
			},
			openAlipay(data) {
				var orderInfo = data;  //从服务器获取的订单
				uni.getProvider({
				    service: 'payment',
				    success: function (res) {
				        console.log(res.provider)
				        if (~res.provider.indexOf('alipay')) {
				            uni.requestPayment({
				                "provider": "alipay",   //固定值为"alipay"
				                "orderInfo": orderInfo, //此处为服务器返回的订单信息字符串
				                success: function (res) {
				                    var rawdata = JSON.parse(res.rawdata);
				                    console.log("支付成功");
				                },
				                fail: function (err) {
				                    console.log('支付失败:' + JSON.stringify(err));
				                }
				            });
				        }
				    }
				});
			},
			openWechatpay(data) {
				let orderInfo = data;
				uni.getProvider({
					service: 'payment',
					success: function(res) {
						console.log(res.provider)
						if (~res.provider.indexOf('wxpay')) {
							uni.requestPayment({
								"provider": "wxpay", //固定值为"wxpay"
								"orderInfo": orderInfo,
								success: function(res) {
									var rawdata = JSON.parse(res.rawdata);
									console.log("支付成功");
								},
								fail: function(err) {
									console.log('支付失败:' + JSON.stringify(err));
								}
							});
						}
					}
				});
			},
			gotoInfos(id) {
				uni.navigateTo({
					url: '/pages/my/order/infos?oid=' + id
				})
			},
			doIninit() {
				let that = this;
				let params = {
					uid: that.uid,
					st: that.navi==4?-1:that.navi
				};
				that.$api.orderIndex(params).then(ret => {
					that.list = ret.data;
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.nav {
		background: #f8f8f8;
		display: flex;
	}

	.nav_item {
		flex: 1;
		font-size: 32rpx;
		height: 110rpx;
		line-height: 110rpx;
		position: relative;
		text-align: center;
	}

	.nav_item.active {
		color: #c20f22;
	}

	.nav_item.active::after {
		background: #c20f22;
		border-radius: 4rpx;
		bottom: 16rpx;
		content: " ";
		display: table;
		height: 8rpx;
		left: 50%;
		margin-left: -16rpx;
		position: absolute;
		width: 32rpx;
	}

	/******************/
	.panel {
		background: #ffffff;
		padding: 32rpx 24rpx;
	}

	.panel_box {
		background: #ffffff;
		box-shadow: 0px 4rpx 50rpx 0px rgba(0, 0, 0, 0.1);
		border-radius: 40rpx;
		margin: auto;
		overflow: hidden;
		width: 95%;
	}

	.panel_box-item {
		margin-bottom: 16rpx;
	}

	.panel_box-item:last-child {
		margin-bottom: 0rem;
	}

	.panel_box-item_title {
		font-size: 28rpx;
		font-weight: bold;
		padding: 24rpx 24rpx 0rem;
	}

	.panel_box-item_image {
		display: flex;
		padding: 10rpx;
	}

	.panel_box-item_image-item {
		flex: 2;
	}

	.panel_box-item_image-item:first-child {
		flex: 1;
	}

	.panel_box-item_image-item image {
		margin-top: 10rpx;
		vertical-align: middle;
		width: 90%;
	}

	.panel_box-item_image-item p {
		font-size: 20rpx;
		height: 44rpx;
		line-height: 44rpx;
		margin: 0rem;
	}

	.panel_box-item_image-item p:first-child {
		margin-top: 26rpx;
	}

	.panel_box-item_image-item p span {
		color: #3447d7;
	}

	.panel_box-item_attr {
		margin-bottom: 16rpx;
	}

	.panel_box-item_attr-title {
		color: #3b4ed8;
		height: 56rpx;
		line-height: 56rpx;
		padding: 0rem 24rpx;
	}

	.panel_box-item_attr-info {
		display: flex;
		padding: 0rem 24rpx;
	}

	.panel_box-item_attr-info_i {
		color: #999999;
		flex: 2;
		font-size: 24rpx;
		height: 44rpx;
		line-height: 44rpx;
	}

	.panel_box-item_attr-info_i span {
		color: #d0021b;
	}

	.panel_box-item_attr-info_i:nth-child(2) {
		_flex: 3;
	}

	.panel_box-item_attr-info_i:last-child {
		flex: 3;
	}

	.panel_box-item_total {
		background: #fffad8;
		font-size: 20rpx;
		height: 96rpx;
		line-height: 96rpx;
		padding: 0rem 10rpx;
		text-align: left;
	}

	.panel_box-item_total text {
		color: #999999;
		margin-right: 20rpx;
	}

	.panel_box-item_total span {
		color: #d0021b;
	}

	.panel_box-btn {
		display: flex;
		padding: 24rpx 20rpx 24rpx 24rpx;
	}

	.panel_box-btn_item {
		flex: 1;
		height: 56rpx;
		line-height: 56rpx;
		font-size: 22rpx;
		display: flex;
	}

	.panel_box-btn_item span {
		color: #d0021b;
	}

	button {
		border: 1px solid #999999;
		background: white;
		color: #999999;
		font-size: 20rpx;
		height: 56rpx;
		line-height: 52rpx;
		padding: 0rem 20rpx;
		margin-left: 20rpx;
		margin-right: 20rpx;
	}

	button.red {
		border: 2rpx solid #d0021b;
		color: #d0021b;
	}

	 button.check {
		border: 2rpx solid #3b4ed8;
		color: #3b4ed8;
	}
</style>