<template>
	<view>
		<view class="logo" style="width: 100vw;height:200rpx;" v-if="infos.logo">
			<image style="width: 750rpx;height: 107rpx;" :src="infos.logo" />
		</view>
		<view class="ceilNumb" style="display: flex;align-items: center;justify-content: center;">
			全部商品统一比例调整:
			<view  :class="infos.ratio>0 ? 'red' :infos.ratio<0?'green':infos.ratio==0?'black':''"
				class="ceilNumb_value">{{infos.ratio }}%</view>
		</view>
		<view class="goods">
			<view class="goods_line">
				<view style="font-size: 22rpx;color: red;" class="goods_line_item title mrleft">
					质量标准：{{infos.trans_bids}}
				</view>
				<view style="font-size: 22rpx;color: red;" class="goods_line_item title nobor">是否含税：{{ratio}}</view>
			</view>

			<view class="custom-table" style="margin-bottom: 30rpx" v-for="(item,i) in list">
				<view class="d_a w_100" style="flex-direction: row;align-items: stretch;">
					<view class="xuhao">
						<p>序号</p>
						<p>{{ item.sort }}</p>
					</view>
					<view class="uni-grid">
						<view class="uni-row">
							<view class="uni-col" style="border-bottom: none; border-right: none;">
								{{ item.attr1 }}
							</view>
							<view class="uni-col" style="border-bottom: none;">
								{{ item.attr2 }}
							</view>
						</view>
						<view class="uni-row">
							<view class="uni-col" style="border-bottom: none; border-right: none;">
								{{ item.attr3 }}
							</view>
							<view class="uni-col" style="border-bottom: none;background-color: yellow;color: blue;">
								产品数量:{{ item.nums }}（{{ item.unit }}）
							</view>
						</view>
						<view class="uni-row">
							<view class="uni-col" style="border-right: none;background-color: yellow;color: blue;">
								产品价格:{{ item.price?item.price:0 }}元
								<text
									:class="{'red-text': item.up > 0, 'green-text': item.up < 0, 'black-text': item.up === 0}"
									style="margin-left: 1rem">
									( {{item.up>0 ? '+' : ''}} {{ item.up }}%)
								</text>
							</view>
							<view class="uni-col" style="background-color: yellow;color: blue;">
								合计金额:{{ item.total<0 ? 0 : item.total }}元
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="rep_tags">
				<span style="margin-left: 30rpx">报价单备注信息</span>
			</view>

			<view class="uni-item">
				<text class="uni-label">付款方式</text>
				<view class="uni-select" >
					{{ infos.check_type }}
				</view>
			</view>
			<view class="uni-item">
				<text class="uni-label">运输方式</text>
				<view class="uni-select">
					{{ infos.trans_type }}
				</view>
			</view>
			<view class="uni-item">
				<text class="uni-label">运输费用</text>
				<view class="uni-select">
					{{ infos.fees_out }}
				</view>
			</view>

			<view class="uni-item">
				<text class="uni-label">包装选项</text>
				<view class="uni-select">
					{{ infos.pack_recyle }}
				</view>
			</view>
			
			<view class="uni-item">
				<text class="uni-label">报价单位（选填）</text>
				<view class="uni-select">
					{{ infos.rep_comp }}
				</view>
			</view>

			<view class="uni-item">
				<text class="uni-label">询价单位（选填)</text>
				<view class="uni-select">
					{{ infos.question_comp }}
				</view>
			</view>

			<view class="uni-item">
				<text class="uni-label">项目名称（选填）</text>
				<view class="uni-select">
					{{ infos.project_comp  }}
				</view>
			</view>
			
			
			<view class="uni-item">
				<text class="uni-label">报价人员（选填）</text>
				<view class="uni-select">
					{{ infos.rep_user  }}
				</view>
			</view>

			

			<view class="uni-item">
				<text class="uni-label">联系方式（选填）</text>
				<view class="uni-select">
					{{ infos.rep_user }}
				</view>
			</view>

			<view class="" style="color: blue;padding: 10rpx 20rpx;">
				<text style="flex-shrink: 0;margin-left: 30rpx;font-size: 26rpx;">报价单备注:</text>
				<view  style="display: flex;align-items: center;margin-top: 10rpx;font-size: 26rpx;">
					<text  space="nbsp">{{ infos.tags }}</text>
					<!-- <rich-text :nodes="infos.tags"></rich-text> -->
				</view>
			</view>

		</view>
            
		<view class="totals">
			<p>
				<text>商品总条数：{{ list.length }} </text>
				<text style="margin-left: 20rpx;">合计数量：{{count}}</text>
			</p>

			<p>合计总金额：<span>{{total}}</span>元</p>
			<p>总金额大写：<span style=" color: #1677ff;">{{total_n}}</span></p>
			<p>订单税率标识：{{ratio}}</p>
		</view>
		<view class="footers d_a_j" style="margin-top: 30rpx;">
			<image mode="widthFix" src="/static/imgs/login_footer2.png" />
		</view>
		<view style="height: 200rpx;"></view>
		<view class="fenxiang ">
			<view class="item" @click="shareBg()">
				<image mode="widthFix" src="/static/imgs/biaoge.png" />
				<p>生成表格</p>
			</view>
			<view class="item" @click="shareImage()">
				<image mode="widthFix" src="/static/imgs/tupian.png" />
				<p>生成图片</p>
			</view>
			<view class="item" @click="sharetoWechat()">
				<image mode="widthFix" src="/static/imgs/weixin.png" />
				<p>微信分享</p>
			</view>
			<view class="item" @click="sharetoFriend()">
				<image mode="widthFix" src="/static/imgs/wxpyq.png" />
				<p>分享微信朋友圈</p>
			</view>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				id: '',
				uid: '',
				list: '',
				total: '',
				total_n: '',
				ratio: '',
				//
				mask: 0,
				mask_pays: 0,
				infos: '',
				excel_url: '',
				img_url: "",
				count: 0,
				elcc_sn: '',
			}
		},
		onLoad(option) {
			this.id = option.id ? option.id : ''
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
				this.outUrl()
			}
		},
		methods: {
			shareBg() {
				console.log(this.excel_url);
				if (!this.excel_url) {
					uni.showToast({
						icon: "none",
						title: "正在获取链接请稍后"
					})
					return false
				}
				let self = this
				if (uni.getSystemInfoSync().platform == "android") {
					const wechat_fileshare = uni.requireNativePlugin("wechat-fileshare");
					if (wechat_fileshare) {
						uni.downloadFile({
							url: this.excel_url,
							header: {
								'Content-Type': 'application/pdf; charset=UTF-8', // 这里把pdf改成你要的文件名
							},
							success: (res) => {
								if (res.statusCode === 200) {
									console.log('下载成功');
								}
								let that = this;
								wechat_fileshare.send({
										path: res.tempFilePath,
										uni_app_id: '__UNI__94C6955', //改成你的uniapp的appid在  项目根目录>manifest.json>基础配置
										filetype: 'xls', //填入文件类型
										package_name: 'com.tencent.mm', //填入要传递的应用包名，比如微信是com.tencent.mm, qq是com.tencent.mobileqq 其他的上网稍微查一下就知道了
										filename: this.elcc_sn //不需要填入null filename:null
									}, e => {
										// 回调函数
										// uni.showToast({
										// 	title: '响应数据：' + JSON.stringify(e),
										// 	icon: 'none'
										// });
									}

								)
							}
						})
					}else{
						uni.share({
							provider: "weixin",
							scene: "WXSceneSession", // WXSceneSession 分享到聊天界面，WXSceneTimeline 分享到朋友圈
							type: 0, // 0表示文字，1表示图片，2表示音乐，3表示视频，4表示小程序，5表示文件（5仅App支持），6表示URL
							href: this.excel_url,
							title: this.elcc_sn,
							imageUrl: this.img_url,
							success: function(res) {
								console.log("分享成功");
							},
							fail: function(err) {
								console.log("分享失败", err);
							}
						});
					}

				} else {
					uni.share({
						provider: "weixin",
						scene: "WXSceneSession", // WXSceneSession 分享到聊天界面，WXSceneTimeline 分享到朋友圈
						type: 0, // 0表示文字，1表示图片，2表示音乐，3表示视频，4表示小程序，5表示文件（5仅App支持），6表示URL
						href: this.excel_url,
						title: this.elcc_sn,
						imageUrl: this.img_url,
						success: function(res) {
							console.log("分享成功");
						},
						fail: function(err) {
							console.log("分享失败", err);
						}
					});
				}




			},
			shareImage() {
				if (!this.img_url) {
					uni.showToast({
						icon: "none",
						title: "正在获取链接请稍后"
					})
					return false
				}
				// console.log(11);
				// console.log(this.elcc_sn);
				// console.log(this.img_url);
				uni.share({
					provider: "weixin",
					scene: "WXSceneSession", // WXSceneSession 分享到聊天界面，WXSceneTimeline 分享到朋友圈
					type: 0,
					href:this.img_url,
					title: this.elcc_sn,
					imageUrl: this.img_url,
					success: function(res) {
						console.log("分享成功");
					},
					fail: function(err) {
						console.log("分享失败", err);
					}
				});
			},
			sharetoWechat() {
				uni.share({
					provider: "weixin",
					scene: "WXSceneSession", // WXSceneSession 分享到聊天界面，WXSceneTimeline 分享到朋友圈
					type: 0, // 0表示文字，1表示图片，2表示音乐，3表示视频，4表示小程序，5表示文件（5仅App支持），6表示URL
					href: "http://app.elccc.cn/Inter/Wcins/repinfos/id/" + this.id,
					title: this.elcc_sn,
					imageUrl: "/static/logo.png",
					success: function(res) {
						console.log("分享成功");
					},
					fail: function(err) {
						console.log("分享失败", err);
					}
				});
			},
			sharetoFriend() {
				uni.share({
					provider: "weixin",
					scene: "WXSceneTimeline", // WXSceneSession 分享到聊天界面，WXSceneTimeline 分享到朋友圈
					type: 0, // 0表示文字，1表示图片，2表示音乐，3表示视频，4表示小程序，5表示文件（5仅App支持），6表示URL
					href: "http://app.elccc.cn/Inter/Wcins/repinfos/id/" + this.id,
					title: this.elcc_sn,
					imageUrl: "/static/logo.png",
					success: function(res) {
						console.log("分享成功");
					},
					fail: function(err) {
						console.log("分享失败", err);
					}
				});
			},
			doIninit() {
				let that = this;
				let params = {
					uid: that.uid,
					id: that.id
				};

				that.$api.repinfos(params).then(ret => {
					that.list = ret.data.list;
					that.total = ret.data.total;
					that.total_n = ret.data.total_n;
					this.count = 0
					this.list.forEach((item, index) => {
						this.count += parseInt(item.nums)
					})
					if (ret.data.ratio < 1) {
						that.ratio = "不含税票";
					}
					if (ret.data.ratio > 0 && ret.data.ratio < 7) {
						that.ratio = "含普通发票";
					}
					if (ret.data.ratio > 7) {
						that.ratio = "含专用发票";
					}
					that.infos = ret.data.info;
				})
			},
			outUrl() {
				uni.showLoading({
					title:"生成中...",
					mask:true
				})
				this.$api.outUrl({
					id: this.id,
					uid: this.uid
				}).then(ret => {
					this.excel_url = ret.data.excel_url
					this.img_url = ret.data.img_url
					this.elcc_sn = ret.data.elcc_sn
				}).finally(e=>{
					uni.hideLoading()
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.fenxiang {
		width: 750rpx;
		height: 160rpx;
		position: fixed;
		display: flex;
		align-items: center;
		justify-content: space-around;
		background-color: #c4c4c4;
		bottom: 0rpx;

		.item {
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;

			image {
				width: 60rpx;
				height: 60rpx;
			}

			p {
				font-size: 24rpx;
				color: #333333;
				margin: 10rpx 0 0 0;
			}
		}
	}

	.green {
		color: green;
	}

	.red {
		color: red;
	}



	.blue {
		color: blue;
	}

	.footerFlex {
		position: fixed;
		bottom: 0px;
		left: 0rpx;
		width: 750rpx;
	}

	.uni-input {
		flex: 1;
		padding: 10rpx;
		text-align: right;
	}

	.uni-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 10rpx 20rpx;
		border-bottom: 1px solid #eee;
	}

	.uni-label {
		flex: 1;
		color: #000;
	}

	.uni-select {
		border-radius: 5px;
		padding: 10rpx;
		text-align: right;
		color: blue;
	}

	.uni-grid {
		display: flex;
		flex-direction: column;
		flex-grow: 1;
	}

	.uni-row {
		display: flex;
	}

	.uni-col {
		flex: 1;
		/* 让列平均分配宽度 */
		padding: 20rpx;
		/* 根据需要调整内边距 */
		box-sizing: border-box;
		font-size: 20rpx;
		border: 1rpx solid #dcdcdc;
	}

	/* 边框样式，你可能需要根据实际情况进行调整 */
	.uni-col:not(:last-child) {
		border-right: 1rpx solid #dcdcdc;
		/* 给列右侧添加边框 */
	}

	.uni-row:not(:last-child) .uni-col {
		border-bottom: 1rpx solid #dcdcdc;
		/* 给行底部的列添加边框 */
	}

	/* 文本颜色样式 */
	.red-text {
		color: red;
		/* 红色表示价格上涨 */
	}

	.green-text {
		color: green;
		/* 绿色表示价格下跌 */
	}

	.black-text {
		color: black;
		/* 黑色表示价格不变 */
	}

	.red-text {
		color: red;
	}

	.green-text {
		color: green;
	}

	.black-text {
		color: black;
	}

	.custom-table {
		width: 100%;

	}

	.custom-table .table-row {
		display: flex;
		height: 100%;

	}

	.goods_line_item .select-icon {
		height: 100% !important;
	}




	.custom-table .xuhao {
		width: 100rpx;
		flex-shrink: 0;
		display: flex;
		font-size: 20rpx;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		//border: 1px solid #333333;
		border-bottom: 1rpx solid #dcdcdc;
		border-top: 1rpx solid #dcdcdc;
		/* 使用父的高度*/
	}

	.custom-table .foot {
		width: 100%;
		height: 120rpx;
		display: flex;
		padding: 20rpx;
		align-items: center;
	}

	.ltr-textarea {
		direction: ltr;
		/* Left-to-Right direction */
		text-align: left !important;
	}





	.select-ios .select-placeholder {
		color: #000000;
	}

	.ceilNumb {
		background: #f8f8f8;
		font-size: 30rpx;
		text-align: center;
		padding: 20rpx 24rpx 20rpx 56rpx;
	}
	.ceilNumb_value{
		background: white;
		border: 1px solid #e5e5e5;
		display: inline-block;
		font-size: 44rpx;
		height: 60rpx;
		line-height: 60rpx;
		vertical-align: top;
		text-align: center;
		font-size: 24rpx;
		margin-left: 16rpx;
		width: 100rpx;
	}

	.ceilNumb span {
		background: white;
		border: 1px solid #e5e5e5;
		color: #1677ff;
		display: inline-block;
		font-size: 44rpx;
		height: 60rpx;
		line-height: 60rpx;
		margin-top: -10rpx;
		vertical-align: top;
		text-align: center;
		width: 60rpx;
	}

	.ceilNumb span.value {
		color: black;
		font-size: 24rpx;
		margin-left: -6rpx;
		width: 100rpx;
	}

	.ceilNumb input {
		border: 2rpx solid #e5e5e5;
		color: black;
		display: inline-block;
		font-size: 24rpx;
		height: 60rpx;
		line-height: 60rpx;
		margin: -10rpx 0rem 0rem 2rpx;
		vertical-align: middle;
		text-align: center;
		width: 100rpx;
	}

	.ceilNumb span:first-child {
		margin-right: -10rpx;
	}

	.ceilNumb span:last-child {
		margin-left: -8rpx;
	}

	.goods_line {
		display: flex;
	}

	.goods_line .red {
		color: #c20f22;
	}

	.goods_line .blue {
		color: #4a90e2;
	}

	.goods_line .black {
		color: black;
	}

	.goods {
		border-top: 2rpx solid #dcdcdc;
		//border-bottom: 1px solid #dcdcdc;
	}

	.goods_line_item {
		border-right: 2rpx solid #dcdcdc;
		//border-bottom: 1px solid #eeeeee;
		box-sizing: border-box;
		font-size: 20rpx;
		flex: 1;
		min-height: 96rpx;
		line-height: 96rpx;
		text-align: center;
	}

	.goods_line_item.title {
		font-size: 28rpx;
	}

	.goods_line_item.mrleft {
		margin-left: 0px;
	}

	.goods_line_item.nobor {
		border-right: 0px;
	}

	.goods_line_item .select-ios {
		padding: 0px;
		text-align: center;
	}

	.goods_line_item .item-ios.item-block .item-inner {
		border: 0px;
	}

	.goods_line_item .select-icon {
		margin-right: 20rpx;
	}

	.goods_line_imsr {
		border-right: 1px solid #dcdcdc;
		border-bottom: 1px solid #dcdcdc;
		box-sizing: border-box;
		flex: 4;
		font-size: 16rpx;
		min-height: 96rpx;
		line-height: 48rpx;
		padding-left: 10rpx;
		text-align: left;
	}

	.goods_line_imsr.size {
		line-height: 96rpx;
		text-align: center;
	}

	.goods_line_imse {
		border-bottom: 2rpx solid #dcdcdc;
		box-sizing: border-box;
		flex: 2;
		font-size: 20rpx;
		min-height: 96rpx;
		line-height: 96rpx;
		text-align: center;
	}

	.totals {
		background: #fffad8;
		padding: 8rpx 20rpx 20rpx;
	}

	.totals p {
		font-size: 24rpx;
		margin: 0rem;
		padding-top: 10rpx;
	}

	.totals p span {
		color: #d0021b;
	}

	.totals p span.blue {
		color: #1677ff;
	}

	.totals p span.red {
		color: #c20f22;
	}

	.totals p span.black {
		color: black;
	}

	.rep_tags {
		background: #4a90e2;
		box-sizing: border-box;
		color: white;
		font-size: 24rpx;
		height: 80rpx;
		display: flex;
		align-items: center;

		//margin-top: 2rem;
		//padding: 0.6rem 1.2rem;
	}

	.ticket_color {
		background: #f8bebe;
	}

	.rep_tags2 {
		margin-top: 0rem;
	}

	ion-list {
		background: #f8f8f8;
	}

	.select-ios {
		flex: 1;
		text-align: right;
	}

	.item-ios {
		padding-left: 0px;
	}

	.item-inner {
		font-size: 30rpx;
	}

	.text-input {
		position: relative;
		text-align: right;
	}

	.text-input::after {
		display: table;
		content: ">";
		height: 1rem;
		position: absolute;
		top: 0rem;
		right: 0rem;
		width: 20rpx;
	}

	.item-input ion-label {
		margin-left: 24rpx;
	}

	.list-ios .item-block .item-inner {
		border-bottom: 2rpx solid #dcdcdc;
	}

	.list-ios>.item-block:first-child {
		border-top: 0px;
	}

	.list-ios>.item-block:last-child {
		border-bottom: 2rpx solid #dcdcdc;
	}

	.item-select ion-label {
		margin-left: 24rpx;
	}

	textarea.text-input {
		height: 100rpx;
	}

	.footer_bg {
		background: #f8f8f8;
		height: 48rpx;
	}

	.footer {
		//padding: 1.6rem 1.2rem;
	}

	.footer button {
		background: #c20f22;
		border-radius: 4rpx;
		display: block;
		font-size: 24rpx;
		color: white;
		height: 60rpx;
		line-height: 60rpx;
		width: 100%;
	}

	.footer button:last-child {
		background: white;
		border: 1px solid #c20f22;
		color: #c20f22;

	}

	.mask {
		bottom: 0rem;
		background: black;
		opacity: 0.3;
		position: fixed;
		top: 0rem;
		width: 100%;
		z-index: 10;
	}

	.mark_body {
		background: white;
		border-radius: 30rpx;
		padding: 30rpx 0rem;
		width: 690rpx;
		display: flex;
		align-items: center;
		flex-direction: column;
	}

	.mark_body_footer {
		border-top: 1px solid #999;
		display: flex;
		padding-top: 40rpx;
		text-align: center;
	}

	.mark_body_footer-item {
		flex: 1;
	}

	.mark_body_footer-item.red {
		color: #c20f22;
	}
</style>