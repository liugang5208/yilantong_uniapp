<template>
	<view class="wrap custom-class">
		<u-navbar :is-back="false" title="">
			<view class="d_a_sb " style="width: 750rpx;">
				<view v-if="pushType==0" style="width: 200rpx; visibility: hidden;">占位</view>
				<view v-if="pushType==1" style="width: 200rpx;padding-left: 30rpx;" @click="back">
					<u-icon name="nav-back" color="#606266" :size="44">
					</u-icon>
				</view>

				<view style="font-size: 30rpx; color: #000; font-weight: bold; text-align: center; flex-grow: 1;">购物车</view>
				<view style="width: 200rpx;padding-right: 30rpx; color: #488aff; text-align: right;" @click="clear">清空购物车</view>
			</view>
		</u-navbar>
		<view style="width: 750rpx;padding-left: 50rpx;padding-right: 50rpx;margin-top: 20rpx;">
			<u-subsection @change="texChange" active-color="#ffffff" button-color="#1677ff" :list="tabsList" :current="current"></u-subsection>
		</view>
		<view class="" style="padding-bottom: 200rpx">
			<view v-for="(x,i) in list" :key="i">
				<view class="list_item" v-if="x.types=='0'">
					<view class="list_item-title">
						<span class="choice" style="margin-right: 10rpx;">选择</span>
						<!-- 		                <i class="fa fa-check-circle" *ngIf="x?.status>0" (click)="selector(x?.id,1,x)"></i>
			                <i class="fa fa-circle-o" *ngIf="x?.status<1" (click)="selector(x?.id,0,x)"></i> -->
						<u-checkbox shape="circle" v-model="x.status" @change="selector($event,x.id,0,x)"></u-checkbox>
						<span class="dels" @click="del(x.id)">删除</span>
					</view>
					<view class="list_item-content">
						<view class="list_item-content_title">{{x.list.gnames}}</view>
						<view class="list_item-content_info">
							<view class="list_item-info_i">
								<image mode="widthFix" :src="x.list.gimage" />
							</view>
							<view class="list_item-info_i" v-if="x.list">
								<view class="list_item-info_i-txt">{{x.list.key_0}}：<span>{{x.list.value_0}}</span></view>
								<view class="list_item-info_i-txt">{{x.list.key_1}}：<span>{{x.list.value_1}}</span></view>
								<view class="list_item-info_i-txt">{{x.list.key_2}}：<span>{{x.list.value_2}}</span></view>
								<view class="list_item-info_i-txt">
									含税标识：
									<span> {{x.ticket=='0'?'不含发票':''}} {{x.ticket=='1'?'普通发票':''}} {{x.ticket=='2'?'专用发票':''}}</span>
								</view>
								<view class="list_item-info_i-txt">计量单位：<span>{{x.info.g_unit}}</span></view>
								<view class="list_item-info_i-txt">执行价格：<span class="red">{{transpoint(x.list.market*x.ticket_fee*ulevel['up'])}}</span>元</view>
							</view>
							<view class="list_item-info_i">
								<view class="list_item-nums">
									<!-- <view class="list_item-add" @click="addNums(x.id,x.nums,0)">+</view>
									<input type="text" v-model="x.nums" @change="changeData(x.id,x.nums,0)" />
									<view class="list_item-ceil" @click="ceilNums(x.id,x.nums,0)">-</view> -->
									<u-number-box input-width='50' v-model="x.nums" @change="changeData(x.id,x.nums,0)"></u-number-box>
								</view>
							</view>
						</view>
					</view>
					<view class="list_item-info">
						<view class="list_item_i">运费标识：{{ulevel['trans']>0?'含运费':'不含运费'}}</view>
						<view class="list_item_i">
							税价标识： {{x.ticket=='0'?'不含发票':''}}{{x.ticket=='1'?'普通发票':''}}{{x.ticket=='2'?'专用发票':''}}
						</view>
					</view>
					<view class="list_item-info">
						<view class="list_item_i">购买数量：<span>{{x.nums}}</span></view>
						<view class="list_item_i">合计金额：<span>{{transpoint(x.price)}}元</span></view>
					</view>
				</view>



				<view class="list_item" v-if="x.types=='1'">
					<view class="list_item-title">
						<span class="choice">选择</span>
						<span class="dels" @click="del(x.id)">删除</span>
					</view>
					<view class="list_item-content">
						<view class="list_item-content_title">{{x.gnames}}</view>
						<view class="list_item-content_info">
							<view class="list_item-info_i">
								<image mode="widthFix" :src="x.gimage" />
							</view>
							<view class="list_item-info_i" style="flex:3;" v-if="x.datr">
								<view class="list_item-info_i-txt">{{x.datr.key_0}}：<span>{{x.datr.value_0}}</span></view>
								<view class="list_item-info_i-txt">{{x.datr.key_1}}：<span>{{x.datr.value_1}}</span></view>
								<view class="list_item-info_i-txt">{{x.datr.key_2}}：<span>{{x.datr.value_2}}</span> 计量单位：<span>{{x.info.g_unit}}</span></view>
								<view class="list_item-info_i-txt">
									含税标识：
									<span>
										{{x.ticket=='0'?'不含发票':''}}
										{{x.ticket=='1'?'普通发票':''}}
										{{x.ticket=='2'?'专用发票':''}}
									</span> 是否包邮： <span>{{ulevel['trans']>0?'含运费':'不含运费'}}</span>
								</view>
								<view class="list_item-info_i-txt">执行价格：<span class="red">{{x.s_price}}</span>元</view>
							</view>
						</view>
					</view>
					<view class="list_item-attr">属性分类 ｜ 购买数量</view>
					<view class="list_item-attrli">

						<view class="list_item-attrli_info" v-for="(r,index) in x.list">
							<view class="list_item-attrli_title">{{r.info.name}}</view>
							<view class="list_item-attrli_nums">
								<view class="list_item-attrli_nums_item">¥{{transpoint(r.info.market*x.ticket_fee*ulevel['up'])}}</view>
								<view class="list_item-attrli_nums_item">
									<view class="list_item-fied" @click="addNums(r.id,r.nums,1)">+</view>
									<input type="text" v-model="r.nums" @change="changeData(r.id,r.nums,1)">
									<view class="list_item-fied" @click="ceilNums(r.id,r.nums,1)">-</view>
								</view>
							</view>
						</view>

					</view>
					<view class="list_item-attrline">
						已选数量：
						<span>{{x.nums}}</span>， 合计金额：
						<span>{{transpoint(x.price)}}元</span>
					</view>
				</view>
			</view>
			
			<view style="width: 750rpx;padding-top: 400rpx;">
				<u-empty v-if="list.length==0"   text="暂无数据" mode="car"></u-empty>
			</view>
			
		</view>
		<view class="list_footer d_a_sb" :style="{bottom:totalRpx+'px'}">
			<view class="list_footer-info" style="margin-left: 30rpx;">
				<p>所选订单合计金额：<span>{{transpoint(price)}}</span>元</p>
				<p>
					所选订单合标识
					<span v-if="ulevel">（{{ulevel.trans>0?'含运费':'不含运费'}}）（{{ticket=='0'?'不含发票':''}}{{ticket=='1'?'普通发票':''}}{{ticket=='2'?'专用发票':''}}）</span>
				</p>
			</view>
			<view class="list_footer-btn" @click="gotoconfirm()">
				<text style="margin-left: 20rpx;margin-right: 20rpx;">立即下单</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: 'Hello',
				value: 1,
				tabsList: [{
						name: '不含发票'
					},
					{
						name: '普通发票'
					},
					{
						name: '含专用发票'
					},
				],
				uid: '',
				ulevel: '',
				list: [],
				nums: 0,
				price: 0,
				ticket: 0,
				loading: '',
				typeIndex: 0,
				current: 0,
				status: false,
				totalRpx: 0,
				pushType: 0
			}
		},
		onLoad(option) {
			this.pushType = option.pushType ? option.pushType : 0
			console.log(this.pushType);
		},
		async created() {
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
		uni.getSystemInfo({
				success: res => {
					console.log(res);
					if (this.pushType == 0) {
						this.totalRpx = res.safeAreaInsets.bottom + 60;
					} else {
						this.totalRpx = 0
					}
					
				},
				fail: (err) => {
					this.totalRpx = 0
				}
			});
			uni.$on("confirm",data=>{
				this.doIninit()
			})

		},
		methods: {
			back() {
				uni.navigateBack()
			},

			clear() {
				let that = this;
				var params = {
					uid: that.uid
				};
				uni.showModal({
					title: '提示',
					content: '确定要清空?',
					success: (res) => {
						if (res.confirm) {
							uni.showLoading({
								title: "处理中..."
							})
							that.$api.cartclear(params).then(ret => {
								that.doIninit();
								uni.hideLoading()
							}).catch(err => {
								uni.hideLoading()
							});
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			del(id) {
				let that = this;
				var params = {
					id: id
				};
				//
				uni.showLoading({
					title: "处理中..."
				})
				that.$api.cartdel(params).then(ret => {
					that.doIninit();
					uni.hideLoading()
				}).catch(err => {
					uni.hideLoading()
				});
			},
			gotoconfirm() {
				let that = this;
				if (that.price < 1) {
					uni.showModal({
						title: '提示',
						content: '请至少勾选一个商品',
						showCancel: false,
						success: (res) => {
							if (res.confirm) {

							}
						}
					});
					return
				}
				uni.navigateTo({
					url: '/pages/cart/confirm'
				})
				// that.navCtrl.push(CaconfirmPage);
			},
			/**
			 * 更新数据
			 */
			selector(e, id, status, data) {
				console.log(e);
				let that = this;
				var params = {
					id: id,
					status: e.value ? 1 : 0
				};
				uni.showLoading({
					title: "处理中..."
				})
				that.$api.cartcancel(params).then(ret => {
					that.doIninit();
					uni.hideLoading()
				}).catch(err => {
					uni.hideLoading()
				});
			},
			texChange(typeIndex) {
				console.log(typeIndex);
				this.ticket = typeIndex;
				this.doIninit();
			},



			changeData(e, newNums, type) {
				let that = this;
				var params = {
					id: e,
					nums: newNums,
					type: type
				};
				uni.showLoading({
					title: "处理中..."
				})
				that.$api.cartup(params).then(ret => {
					uni.hideLoading()
					that.doIninit();
				}).catch(err => {
					uni.hideLoading()
				});
			},
			doIninit() {
				let that = this;
				var params = {
					uid: that.uid,
					type: 0,
					ticket: that.ticket,
					new:1,
				};
				this.$api.Carts(params).then(ret => {
					this.list = ret.data.list;
					this.list.forEach(r => {
						r.nums = parseInt(r.nums)
						r.status = r.status > 0 ? true : false
					})
					that.ulevel = ret.data.ulevel;
					that.nums = ret.data.nums;
					that.price = ret.data.price;
				})
			},
			transpoint(value) {
				return Math.floor(value * 100) / 100;

			}

		}
	}
</script>

<style lang="scss" scoped>
	.wrap {
		display: flex;
		flex-direction: column;
		height: calc(100vh - 60px);
		width: 100%;
		position: relative;
	}


	.back-button-ios {
		color: black;
	}

	.custom-size-button {
		width: 160rpx;
		margin: 0;
		height: 50rpx;


	}

	.back-button-text-ios {
		display: none;
	}

	.scroll-content {
		background: #eeeeee;
	}

	.list_item {
		background: white;
		margin-top: 40rpx;
		margin-bottom: 20rpx;
	}

	.list_item:first-child {
		margin-top: 0rem;
	}

	.list_item-title {
		border-top: 0.5px solid #eeeeee;
		border-bottom: 0.5px solid #eeeeee;
		height: 75rpx;
		line-height: 75rpx;
	}

	.list_item-title::after {
		clear: both;
		content: " ";
	}

	.list_item-title image {
		margin-left: 24rpx;
		margin-top: -6rpx;
		vertical-align: middle;
		width: 38rpx;
	}

	.list_item-title i {
		color: #c20f22;
		font-size: 40rpx;
		margin-top: -4rpx;
		margin-left: 10rpx;
		vertical-align: middle;
	}

	.list_item-title span.choice {
		margin-left: 24rpx;
	}

	.list_item-title span.dels {
		float: right;
		margin-right: 24rpx;
	}

	.list_item-content {
		border-bottom: 0.5px solid #eeeeee;
		padding: 32rpx 0rem 18rpx;
	}

	.list_item-content_title {
		font-weight: bold;
		font-size: 28rpx;
		padding: 0rem 24rpx;
	}

	.list_item-content_info {
		display: flex;
	}

	.list_item-info {
		display: flex;
	}

	.list_item-info_i {
		flex: 1;
		position: relative;
	}

	.list_item-info_i:first-child {
		flex: 2;
		overflow: hidden;
		padding-top: 1rem;
		text-align: center;
	}

	.list_item-info_i:first-child image {
		vertical-align: middle;
		width: 90%;
	}

	.list_item-info_i:nth-child(2) {
		flex: 2;
		padding-top: 12rpx;
	}

	.list_item-info_i-txt {
		font-size: 24rpx;
		height: 44rpx;
		line-height: 44rpx;
		margin-top: 4rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.list_item-info_i-txt span {
		color: #3447d7;
		margin-right: 24rpx;
	}

	.list_item-info_i-txt span.red {
		color: #d0021b;
		margin-right: 0rem;
	}

	.list_item-nums {
		bottom: 10rpx;
		position: absolute;
		right: 20rpx;
		text-align: right;
		width: 200rpx;
	}

	.list_item-nums::after {
		clear: both;
		content: " ";
	}

	.list_item-add {
		border: 1px solid #e5e5e5;
		color: #1677ff;
		font-size: 24rpx;
		float: right;
		height: 44rpx;
		line-height: 44rpx;
		text-align: center;
		width: 20%;
	}

	.list_item-nums input {
		border: 1px solid #e5e5e5;
		border-left: 0px;
		border-right: 0px;
		float: right;
		height: 44rpx;
		line-height: 44rpx;
		margin-top: 0rem;
		text-align: center;
		width: 60%;
	}

	.list_item-ceil {
		border: 1px solid #e5e5e5;
		color: #1677ff;
		font-size: 24rpx;
		float: right;
		height: 44rpx;
		line-height: 44rpx;
		text-align: center;
		width: 20%;
	}

	.list_item_i {
		box-sizing: border-box;
		color: #999999;
		flex: 1;
		min-height: 88rpx;
		line-height: 88rpx;
		padding: 0rem 24rpx;
	}

	.list_item-info:last-child {
		background: #fffad8;
	}

	.list_item-info:last-child .list_item_i {
		color: #333333;
	}

	.list_item-info:last-child .list_item_i span {
		color: #d0021b;
	}

	.list_item-info:last-child .list_item_i:last-child {
		text-align: right;
	}

	.list_item-attr {
		background: #c20f22;
		color: white;
		font-size: 28rpx;
		height: 56rpx;
		line-height: 56rpx;
		text-align: center;
	}

	.list_item-attrli {
		background: #f8f8f8;
	}

	.list_item-attrli_info {
		background: white;
		font-size: 30rpx;
		padding: 0rem 24rpx 16rpx;
		margin-bottom: 16rpx;
	}

	.list_item-attrli_title {
		height: 74rpx;
		line-height: 74rpx;
	}

	.list_item-attrli_nums {
		display: flex;
	}

	.list_item-attrli_nums_item {
		color: #c20f22;
		flex: 1;
		height: 44rpx;
		line-height: 44rpx;
	}

	.list_item-attrli_nums_item .list_item-fied {
		border: 1px solid #e5e5e5;
		color: #1677ff;
		float: right;
		font-size: 1.2rem;
		height: 44rpx;
		line-height: 44rpx;
		text-align: center;
		width: 44rpx;
	}

	.list_item-attrli_nums_item input {
		border: 1px solid #e5e5e5;
		color: black;
		float: right;
		height: 44rpx;
		line-height: 44rpx;
		text-align: center;
		width: 104rpx;
	}

	.list_item-attrline {
		background: #fffad8;
		font-size: 30rpx;
		height: 88rpx;
		line-height: 88rpx;
		padding: 0rem 24rpx;
	}

	.list_item-attrline span {
		color: #c20f22;
		font-weight: bold;
	}

	.list_tips {
		background: #fff9ed;
		bottom: 0rem;
		color: #ff6010;
		font-size: 18rpx;
		min-height: 56rpx;
		line-height: 40rpx;
		margin-top: 40rpx;
		position: fixed;
		padding: 10rpx;
		text-align: left;
		width: 100%;
	}

	.list_footer {
		position: fixed;
		text-align: left;
		left: 0;
		width: 100%;
		height: 100rpx;
		background-color: #fff;
	}

	.list_footer-info {
		display: inline-block;
		font-size: 30rpx;
		margin-right: 0rem;
	}

	.list_footer-info p {
		margin: 0rem;
		text-align: left;
	}

	.list_footer-info p span {
		color: #c20f22;
	}

	.list_footer-info p:last-child {
		font-size: 20rpx;
	}

	.list_footer-btn {
		background: #c20f22;
		border-radius: 8rpx;
		color: white;
		font-size: 30rpx;
		height: 72rpx;
		margin-right: 30rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>