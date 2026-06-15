<template>
	<view>
		<view class="addr">
			<view class="addr_title">收货信息</view>
			<view class="addr_infos" v-if="info.addr">
				<p>收货人姓名：<span>{{info.addr.name}}</span></p>
				<p>收货人号码：<span>{{info.addr.phone}}</span></p>
				<p>收货人地址：<span>{{info.addr.p_name}}{{info.addr.c_name}}{{info.addr.l_name}}{{info.addr.street}}</span>
				</p>
			</view>
		</view>

		<view class="line"></view>
		<view class="order_title">订单信息</view>
		<view class="order_line">
			<text>订单编号</text>
			<span>{{info.sn}}</span>
		</view>
		<view class="order_line">
			<text>下单时间</text>
			<span>{{info.time_zone}}</span>
		</view>
		<view class="order_line">
			<text>订单金额</text>
			<span><i>{{info.money}}</i>元</span>
		</view>
		<view class="order_line">
			<text>支付方式</text>
			<span>
				{{info.paymode==0?'在线支付':''}}
				{{info.paymode==1?'货到付款':''}}
				{{info.paymode==2?'平台代发货':''}}
				{{info.paymode==3?'银行转账':''}}
				{{info.paymode==4?'签约商户':''}}
			</span>
		</view>
		<view class="order_line">
			<text>是否需要清单</text>
			<span>
				{{info.needlist==0?'无需清单':''}}
				{{info.paymode==1?'需要清单':''}}
			</span>
		</view>
		<view class="order_line">
			<text>您的留言</text>
			<span>{{info.tags}}</span>
		</view>

		<view v-if="info.ticket>0">
			<view class="order_line">
				<text>发票备注</text>
				<span>{{info.ticket_tag}}</span>
			</view>
		</view>

		<view v-if="info.ticket_comp>0">
			<view class="order_title">购买单位</view>
			<view class="order_line red">
				<text>单位名称</text>
				<span>{{info.tik_comp.comp_name}}</span>
			</view>
			<view class="order_line red">
				<text>信用代码</text>
				<span>{{info.tik_comp.comp_tex}}</span>
			</view>
		</view>


		<view v-if="info.paymode=='3' && info.ticket<1">
			<view class="order_title">
				银行账户
				<span :class="paybank==i?'active':''" @click="changebankID(i)" v-for="(item,i) in info.bank_pri"
					:key="i">{{item.bank}}</span>
			</view>


			<view :class="paybank==i?'':'none'" v-for="(item,i) in info.bank_pri" :key="i">
				<view class="order_line">
					<text>开户银行</text>
					<span>{{item.bank_name}}—{{item.bank}}</span>
				</view>
				<view class="order_line">
					<text>银行户名</text>
					<span v-if="item.name">{{item.name}}</span>
				</view>
				<view class="order_line">
					<text>银行账号</text>
					<span>{{item.cardid}}</span>
				</view>
				<view class="order_line">
					<text>开户行</text>
					<span>{{item.open_bank}}</span>
				</view>
			</view>

		</view>
		<view v-if="info.paymode=='3' && info.ticket=='1'">
			<view class="order_title">易缆平台对公收款账户</view>
			<view class="order_line">
				<text>公司名称</text>
				<span v-if="info.bank_pub">{{info.bank_pub.tic_1.name}}</span>
			</view>
			<view class="order_line">
				<text>银行账号</text>
				<span v-if="info.bank_pub">{{info.bank_pub.tic_1.open_bank}}</span>
			</view>
			<view class="order_line">
				<text>开户行</text>
				<span>{{info.bank_pub.tic_1.cardid}}</span>
			</view>
			<view class="order_line">
				<text>开户行号</text>
				<span>{{info.bank_pub.tic_1.open_bank_id}}</span>
			</view>
		</view>
		<view v-if="info.paymode=='3' && info.ticket=='2'">
			<view class="order_title">易缆平台对公收款账户</view>
			<view class="order_line">
				<text>公司名称</text>
				<span>{{info.bank_pub.tic_2.name}}</span>
			</view>
			<view class="order_line">
				<text>银行账号</text>
				<span>{{info.bank_pub.tic_2.open_bank}}</span>
			</view>
			<view class="order_line">
				<text>开户行</text>
				<span>{{info.bank_pub.tic_2.cardid}}</span>
			</view>
			<view class="order_line">
				<text>开户行号</text>
				<span>{{info.bank_pub.tic_2.open_bank_id}}</span>
			</view>
		</view>


		<view class="line"></view>

		<view class="goods">
			<view class="order_title goods_title">商品信息</view>

			<view class="panel_box">

				<view class="panel_box-item_title">{{info.sn}}</view>
				<view class="panel_box-item" v-for="(x,i) in info.oinfo" :key="i">
					<view v-if="x.types=='0'">
						<view class="panel_box-item_title">{{x.name}}</view>
						<view class="panel_box-item_image">
							<view class="panel_box-item_image-item">
								<image mode="widthFix" :src="x.imgs" />
							</view>
							<view class="panel_box-item_image-item">
								<p v-html="x.attr1"></p>
								<p v-html="x.attr2"></p>
								<p v-html="x.attr3"></p>
								<p>是否含税：
									<span>{{info.ticket=='0'?'不含发票':''}}{{info.ticket=='1'?'普通发票':''}}{{info.ticket=='2'?'专用发票':''}}</span>
								</p>
							</view>
						</view>
						<view class="panel_box-item_attr">
							<view class="panel_box-item_attr-info">
								<view class="panel_box-item_attr-info_i">单价：<span>{{x.market}}</span></view>
								<view class="panel_box-item_attr-info_i">数量：<span>{{x.nums}}</span></view>
								<view class="panel_box-item_attr-info_i">金额：<span>{{transpoint(x.market*x.nums)}}</span>
								</view>
							</view>
						</view>
					</view>



					<view v-if="x.types=='1'">
						<view class="panel_box-item_title">{{x.name}}</view>
						<view class="panel_box-item_image">
							<view class="panel_box-item_image-item">
								<image mode="widthFix" :src="x.imgs" />
							</view>
							<view class="panel_box-item_image-item">
								<p v-html="x.attr1"></p>
								<p v-html="x.attr2"></p>
								<p v-html="x.attr3"></p>
								<p>是否含税：
									<span>{{info.ticket=='0'?'不含发票':''}}{{info.ticket=='1'?'普通发票':''}}{{info.ticket=='2'?'专用发票':''}}</span>
								</p>
							</view>
						</view>
						<view class="panel_box-item_attr" v-for="(r,i) in  x.child" :key="i">
							<view class="panel_box-item_attr-title">{{r.info.name}}</view>
							<view class="panel_box-item_attr-info">
								<view class="panel_box-item_attr-info_i">单价：<span>{{r.info.market}}</span></view>
								<view class="panel_box-item_attr-info_i">数量：<span>{{r.nums}}</span></view>
								<view class="panel_box-item_attr-info_i">
									金额：<span>{{transpoint(r.nums*r.info.market)}}</span>
								</view>
							</view>
						</view>
					</view>


				</view>
			</view>

			<view class="list_item-info">
				<view class="list_item_i">运费标识：{{info.trans=='0'?'不含运费':''}} {{info.trans=='1'?'含运费':''}}</view>
				<view class="list_item_i">
					税价标识： {{info.ticket=='0'?'不含发票':''}} {{info.ticket=='1'?'普通发票':''}} {{info.ticket=='2'?'专用发票':''}}
				</view>
			</view>

			<view class="list_item-info">
				<view class="list_item_i">购买数量：<span>{{info.count}}</span></view>
				<view class="list_item_i">合计金额：<span>{{info.money}}元</span></view>
			</view>
		</view>
		<view class="line"></view>


		<view v-if="info.paymode=='3'">
			<view class="order_title">转账凭证</view>
			<view class="order_trans">
				<view class="order_trans_info" v-if="base64s<1" @click="openFileDir()">+上传汇款凭证图片</view>
				<view class="order_trans_info2" v-if="base64s>0">
					<image mode="widthFix" :src="base64Image" @click="photoviewer(base64Image)" />
				</view>

			</view>
		</view>

		<view class="trans" v-if="info.status=='2'">
			<view class="order_title goods_title">物流信息详情</view>
			<p class="trans_line">承运物流：{{info.trans_vo.trans}}</p>
			<p class="trans_line">货运单号：{{info.trans_vo.trans_sn}}</p>
			<p class="trans_line">货物编号：{{info.trans_vo.trade_sn}}</p>
			<p class="trans_line">发货时间：{{info.trans_vo.time_zon}}</p>
			<p class="trans_line">代收货款：<span>{{info.trans_vo.agent_money}}元</span></p>
			<p class="trans_line">物流运费：<span>{{info.trans_vo.trans_fee}}元</span></p>
			<p class="trans_line">联系物流：{{info.trans_vo.trans_phone}}</p>
			<p class="trans_line">取货地址：{{info.trans_vo.get_addr}}</p>
		</view>
		<view style="width: 750rpx;height: 150rpx;"></view>
		<view class="footers" v-if="info.paymode=='3' && info.status=='0'">
			<span class="left" @tap.stop="openFileDir('WRITE_EXTERNAL_STORAGE')">选择上传转账凭证</span>
			<span @click="applyTrans()">提交转账凭证</span>
		</view>

		
	</view>
</template>

<script>
	import {
		pathToBase64
	} from 'image-tools'
	export default {
		data() {
			return {
				permissionID: '',
				action: '',
				oid: '',
				info: '',
				paybank: 0,
				base64s: 0,
				base64Image: '',
			}
		},
		onLoad(option) {
			this.oid = option.oid ? option.oid : ''
			this.doIninit()
		},
		methods: {
			changebankID(id) {
				this.paybank = id;
			},
			photoviewer(url) {
				uni.previewImage({
					urls: [url]
				})
			},
			transpoint(value) {
				return Math.floor(value * 100) / 100;
			},
			doIninit() {
				let that = this;
				var params = {
					oid: that.oid
				};
				that.$api.orderOinfo(params).then(ret => {
					that.info = ret.data;
					that.base64Image = ret.data.pic_imgs;
					that.base64s = ret.data.save_imgs.length;
				}).catch(err => {
					console.log(err.status);
					console.log(err.error);
					console.log(err.headers);
				});
			},
			applyTrans() {
				let that = this;
				let params = {
					oid: that.oid,
					image: that.base64Image
				};
				if (that.base64s < 1) {
					uni.showModal({
						title: '提示',
						content: '请先上传图片',
						showCancel: false,
					});
					return false;
				}
				that.$api.oinfo_up(params).then(ret => {
					uni.showModal({
						title: '提示',
						confirmText: '我已知晓',
						content: '您的【转账凭证】已提交，转账凭证视作付款依据，平台财务会进行确认收款并确认金额无误后会及时为您安排发货，若您提交的订单属于【含税订单】我们将及时为您开具发票。平台发货后会为您发送短信【发货通知】请您留意并及时核对物流信息，易缆商城欢迎您的再次使用，谢谢。',
						showCancel: false,
						success: (res) => {
							if (res.confirm) {
								that.doIninit();
							} else if (res.cancel) {
								console.log('用户点击取消');
							}
						}
					});
				})
			},
		  async	openFileDir(permissionID) {
				let that = this;
				let flag = true
				// #ifdef APP
				flag = await this.$util.permission(permissionID)
				// #endif
				if (!flag) {
					uni.showModal({
						title: "易揽通对存储空间/照片权限申请说明",
						content: "便于您使用该功能上传您的照片/图片/及用于上传转账凭证场景中读取和写入相册和文件内容。",
						cancelText: "取消",
						confirmText: "确定",
						showCancel: true,
						confirmColor: '#000',
						cancelColor: '#666',
						success: async (res) => {
							if (res.confirm) {
								let flagQ = await this.$util.requestPermissions(permissionID)
								if (flagQ) {
									this.chooseImage()
								} else {
									uni.showModal({
										title: '温馨提示',
										content: '还没有该权限，立即去设置开启？',
										cancelText: "取消",
										confirmText: "去设置",
										showCancel: true,
										confirmColor: '#000',
										cancelColor: '#666',
										success: (res) => {
											if (res.confirm) {
												this.$util.goSetting();
											}
										}
									})
								}
							}
						}
					})
				} else {
					this.chooseImage()
				}


			},
			chooseImage() {
				let that = this;
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: function(res) {
						//需要使用uni,getImageInfo获取图片的本地存储路径
						uni.getImageInfo({
							src: res.tempFilePaths[0],
							success: (path) => {
								console.log(path.path, '======')
								pathToBase64(path.path).then(base64 => {
										console.log(base64)
										that.base64s = 1;
										that.base64Image = base64 //拍照地址
									})
									.catch(error => {
										console.error(error)
									})
							}
						})
					}
				});
			}
		}
	}
</script>

<style scoped lang="scss">
	.fa-chevron-left {
		color: black;
		font-size: 40rpx;
		margin-top: 2rpx;
		vertical-align: middle;
	}



	.line {
		background: #f8f8f8;
		height: 24rpx;
	}

	.addr {
		padding: 0rem 24rpx 32rpx;
	}

	.addr_title {
		font-size: 34rpx;
		font-weight: bold;
		height: 104rpx;
		line-height: 104rpx;
	}

	.addr_infos {
		background: #f8f8f8;
		padding: 24rpx 20;
	}

	.addr_infos p {
		font-size: 26rpx;
		margin: 8rpx 0rem;
	}

	.addr_infos p span {
		color: #3447d7;
	}

	/*****************************/
	.order_title {
		border-bottom: 1rpx solid #eeeeee;
		font-size: 34rpx;
		font-weight: bold;
		height: 110rpx;
		line-height: 110rpx;
		padding: 0rem 24rpx;
	}

	.order_title span {
		font-size: 24rpx;
		float: right;
		font-weight: normal;
		margin-left: 20rpx;
	}

	.order_title span.active {
		color: #d0021b;
	}

	.order_line {
		border-bottom: 1rpx solid #eeeeee;
		padding: 24rpx;
		text-align: right;
	}

	.order_line::after {
		clear: both;
		content: " ";
	}

	.order_line text {
		float: left;
	}

	.order_line i {
		color: #d0021b;
		font-style: normal;
	}

	.order_line.red {
		color: #d0021b;
	}

	.order_trans {
		padding: 24rpx;
	}

	.order_trans_info {
		background: #eeeeee;
		height: 160rpx;
		line-height: 160rpx;
		text-align: center;
	}

	.order_trans_info2 {
		background: #eeeeee;
		text-align: center;
	}

	.order_trans_info image {
		vertical-align: middle;
		width: 100%;
	}

	/*****************************/
	.goods {
		background: white;
		padding-bottom: 32rpx;
	}

	.goods_title {
		border-bottom: 0px;
	}

	.list_item-content {
		border-bottom: 1rpx solid #eeeeee;
		padding: 0rem 0rem 18rpx;
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
		flex: 2;
		position: relative;
	}

	.list_item-info_i:first-child {
		flex: 1;
		overflow: hidden;
		text-align: center;
	}

	.list_item-info_i:first-child image {
		margin-top: 25rpx;
		vertical-align: top;
		width: 90%;
	}

	.list_item-info_i:nth-child(2) {
		flex: 2;
		padding-top: 12rpx;
	}

	.list_item-info_i-txt {
		font-size: 24rpx;
		height: 56rpx;
		line-height: 44rpx;
		padding-top: 8rpx;
	}

	.list_item-info_i-txt span {
		color: #3447d7;
		margin-right: 24rpx;
	}

	.list_item-info_i-txt span.red {
		color: #d0021b;
		margin-right: 0rem;
	}

	.list_item-info_i-txt:first-child {
		height: 64rpx;
		padding-top: 16rpx;
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

	.panel_box {
		background: #ffffff;
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
		font-size: 24rpx;
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
		padding: 32rpx 24rpx 40rpx;
	}

	.panel_box-btn_item {
		flex: 1;
		height: 56rpx;
		line-height: 56rpx;
		text-align: right;
	}

	.panel_box-btn_item:first-child {
		text-align: left;
	}

	.panel_box-btn_item:last-child {
		flex: 3;
	}

	.panel_box-btn_item span {
		color: #d0021b;
	}

	.panel_box-btn_item button {
		border: 2rpx solid #999999;
		background: white;
		color: #999999;
		font-size: 24rpx;
		height: 56rpx;
		line-height: 52rpx;
		padding: 0rem 15rpx;
	}

	.panel_box-btn_item button.red {
		border: 2rpx solid #d0021b;
		color: #d0021b;
	}

	.panel_box-btn_item button.check {
		border: 2rpx solid #3b4ed8;
		color: #3b4ed8;
	}

	/*****************************/
	.footers {
		border-top: 2rpx solid #eeeeee;
		background: white;
		height: 100rpx;
		padding: 24rpx;
		position: fixed;
		bottom: 0;
		left: 0rpx;
		width: 690rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.footers span {
		color: #d0021b;
	}

	.footers span.left {
		color: #3b4ed8;
		padding-left: 0rem;
	}

	/*****************************/
	.trans {
		padding-bottom: 48rpx;
	}

	.trans_line {
		font-size: 30rpx;
		margin: 0rem;
		padding: 0rem 24rpx 14rpx;
	}

	.trans_line span {
		color: #d0021b;
	}
</style>