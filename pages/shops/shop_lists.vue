<template>
	<view class="page">
		<view class="pageTab d_a_sa">
			<image mode="widthFix" src="/static/icon/ic_back.png" @click="backNav()" />
			<p :class="act_index==0?'active':''" @click="changePage(0)">商品</p>
			<p :class="act_index==1?'active':''" @click="changePage(1)">参数</p>
			<p :class="act_index==2?'active':''" @click="changePage(2)">详情</p>
		</view>


		<view :class="act_index==0?'':'none'">

			<view class="banner" style="margin: 0;padding: 0;">
				<image mode="widthFix" v-if='blank_info.source_url' :src="blank_info.source_url[0]"
					style="width: 100%;" />
				<image mode="widthFix" src="/static/icon/ic_buyer.png" style="width: 48rpx;height: 48rpx;"
					class="banner_icon banner_buyer" @click="goCart()" />
				<image mode="widthFix" src="/static/icon/ic_contect.png" style="width: 48rpx;height: 48rpx;"
					class="banner_icon banner_tel" @click="callnumber()" />
			</view>

			<view class="iosTba" style="position: sticky;z-index: 100">
				<view class="nav">
					<view class="nav_item" v-for="(x,i) in blank" :key="i">
						<span :class="cat_index==i+1?'active':''" @click="blankChange(i+1)">{{x.catname}}</span>
					</view>
				</view>
				<view v-if="list_count>0">
					<view class="lists bg">
						<view class="lists_item d_a_j">{{keys.key_1}}</view>
						<view class="lists_pisr d_a_j">{{keys.key_2}}</view>
						<view class="lists_pisr d_a_j">
							<span>{{keys.key_3}}</span>
						</view>
						<view class="lists_item d_a_j">商品单价</view>
					</view>
				</view>
			</view>



			<!-- 	<jp-virtual-list code="id" class="h100" :data="list" ref="search" :refresher='false'>
				<template v-slot="{ list }">
					<view v-for="(x,i) in list" :key="i" class="lists" :class="{'ticket_color': clickIndex==i}"
						@click="openBuyer(x,i)">
						<view class="lists_item d_a">
							<span style="margin-left: 10rpx">{{x.value_0}}</span>
						</view>
						<view class="lists_pisr  d_a">
							<span style="margin-left: 10rpx">{{x.value_1}}</span>
						</view>
						<view class="lists_pisr d_a ">
							<span style="margin-left: 10rpx">{{x.value_2}}</span>
						</view>
						<view class="lists_item d_a " :class="ticket_color">
							<span style="margin-left: 10rpx">{{transpoint(x.market*ticket*ulevel['up'])}}</span>
						</view>
					</view>
				</template>
			</jp-virtual-list> -->


			<view v-for="(x,i) in list" :key="i" class="lists" :class="{'ticket_color': clickIndex==i}"
				@click="openBuyer(x,i)">
				<view class="lists_item d_a">
					<span style="margin-left: 10rpx">{{x.value_0}}</span>
				</view>
				<view class="lists_pisr  d_a">
					<span style="margin-left: 10rpx">{{x.value_1}}</span>
				</view>
				<view class="lists_pisr d_a ">
					<span style="margin-left: 10rpx">{{x.value_2}}</span>
				</view>
				<view class="lists_item d_a " :class="ticket_color">
					<span style="margin-left: 10rpx">{{transpoint(x.market*ticket*ulevel['up'])}}</span>
				</view>
			</view>






		</view>
		<view style="width: 100%;height: 150rpx;">
			
		</view>




		<view  v-if="act_index==1"  >
			<rich-text style="width: 750rpx;" :nodes=" setNodes(ginfo.g_attr)"></rich-text>
		</view>
		<view  v-if="act_index==2"  >
			<rich-text style="width: 750rpx;" :nodes="setNodes(ginfo.g_desc)"></rich-text>
		</view>
		<!-- <view :class="act_index==2?'':'none'" v-html="ginfo.g_desc"></view> -->


		<view class="footer" v-if="act_index==0" style="display: flex;flex-direction: column">
			<view class="w_100 d_a_j" style="margin-top: 10rpx">
				<view style="width: 30%;height: 1px;background: #333"></view>
				<span style="font-weight: 700;margin-left: 20rpx;margin-right: 10rpx">点击选择价格税率</span>
				<view style="width: 30%;height: 1px;background: #333"></view>
			</view>
			<view class="d_a_sa w_100" style="margin-top: 4rpx">
				<div :class="ticket_index==0?'primary':'default'"  @click="texChange(0)">
					不含发票
				</div>
				<div :class="ticket_index==2?'primary':'default'"  @click="texChange(2)">
					含专用发票
				</div>
				<div  :class="ticket_index==1?'primary':'default'"  @click="texChange(1)">
					含普通发票
				</div>
				
			</view>

		</view>


		<view class="masks" @touchmove.stop.prevent="preventScroll" style="opacity:0.9" v-if="copen>0"></view>

		<view v-if="copen>0" @touchmove.stop.prevent="preventScroll"
			style="position: fixed;top:0px;width: 100%;z-index: 101;">
			<view class="nav">
				<view class="nav_item" v-for="(x,i) in blank" :key="i">
					<span :class="cat_index==i+1?'active':''" @click="blankChange(i+1)">{{x.catname}}</span>
				</view>
			</view>
			<view v-if="list_count>0">
				<view class="lists bg">
					<view class="lists_item d_a_j">{{keys.key_1}}</view>
					<view class="lists_pisr d_a_j">{{keys.key_2}}</view>
					<view class="lists_pisr d_a_j">{{keys.key_3}}</view>
					<view class="lists_item d_a_j">商品单价</view>
				</view>
			</view>
			<view class="lists" v-if="list.length>0" style="background: #FFFFFF">
				<view class="lists_item d_a_j">{{list[clickIndex].value_0}}</view>
				<view class="lists_pisr d_a_j">{{list[clickIndex].value_1}}</view>
				<view class="lists_pisr d_a_j">{{list[clickIndex].value_2}}</view>
				<view class="lists_item d_a_j" :class="ticket_color">
					{{transpoint(list[clickIndex].market*ticket*ulevel['up'])}}
				</view>
			</view>
		</view>

		<view class="masks_panel" @touchmove.stop.prevent="preventScroll" v-if="copen>0">
			<view class="masks_panel_close" @click="closeBuyer()">
				<image mode="widthFix" src="/static/icon/ic_close.png" />
			</view>
			<view class="list_linr">
				<view class="list_line_title">{{blank_info.gnames}}</view>
				<view class="list_line_infos">
					<view class="list_line_infos_thumb">
						<!-- <image mode="widthFix" :src="blank_info.goods_url" /> -->
						<u-image :src="blank_info.goods_url" mode="widthFix">
							<u-loading slot="loading"></u-loading>
						</u-image>
					</view>
					<view class="list_line_infos_attrs">
						<p><span>{{cdata.key_0}}：<i class="fw_700 ">{{cdata.value_0}}</i></span></p>
						<p><span>{{cdata.key_1}}：<i class="fw_700">{{cdata.value_1}}</i></span></p>
						<p><span>{{cdata.key_2}}：<i class="fw_700">{{cdata.value_2}}</i></span></p>
						<p><span>{{cdata.key_3}}：<i class="fw_700">{{cdata.value_3}}</i></span></p>
						<p>
							<span style="margin-right: 0.2rem;">
								是否含税：<i>{{ticket_index==0?'不含发票':''}}{{ticket_index==2?'专用发票':''}}{{ticket_index==1?'普通发票':''}}</i></span>
							<span>运费标识：<i>{{ulevel['trans']>0?'含运费':'不含运费'}}</i></span>
						</p>
						<p><span>发货时效：<i>{{cdata.trans}}</i></span></p>
						<p><span>执行价格：<i class='color'>{{transpoint(cprice)}}</i>元</span></p>
					</view>
				</view>
			</view>
			<image mode="widthFix" src="/static/imgs/panel_adsr.png" class="imgfull" />
			<view class="masks_panel_nums">
				<span>需要购买的数量：</span>
				<u-number-box v-model="nums" @change="numsChange"></u-number-box>
			</view>
			<view class="masks_panel_count">
				已选数量：<span>{{nums}}</span>，合计金额：<span>{{transpoint(nums*cprice)}}元</span>
			</view>
			<view class="masks_panel_btns">
				<button @click="addReport()">加入报价单</button>
				<button style="margin-left: 10rpx;margin-right: 10rpx;" @click="addCart(0)">加入购物车</button>
				<button @click="addCart(1)">立即购买</button>
			</view>

		</view>



	</view>
</template>

<script>
	export default {
		data() {
			return {
				gid: '',
				act_toite: 0,
				act_index: 0,
				cat_index: 1,
				loading: '',
				uid: '',
				ulevel: '',
				ginfo: '',
				blank: '',
				blank_info: '',
				blank_img: 0,
				blank_img_index: 1,
				list: [],
				list_count: 0,
				keys: '',
				ticket_index: 0,
				ticket: 1,
				ticket_color: "red",
				copen: 0,
				cdata: '',
				cprice: 0,
				nums: 1,
				clickIndex: null,


				visibleList: [], // 当前可见的数据列表
				pageNum: 1, // 当前页码
				pageSize: 20, // 每页数据量
			}
		},
		onReachBottom() {
			console.log("onReachBottom")
			this.loadMoreData();
		},
		
		onLoad(option) {
			this.gid = option.ids
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
			uni.$on("confirm",data=>{
				this.doIninit()
			})

		},

		methods: {
			loadMoreData() {
				const nextData = this.list.slice(this.pageSize * (this.pageNum - 1), this.pageSize * this.pageNum);
				console.log(nextData)
				if (nextData.length > 0) {
					this.visibleList = this.visibleList.concat(nextData); // 将新数据追加到可见数据列表
					this.pageNum++; // 页码增加，准备下一次加载
				}
			},
			
			setNodes(nodes) {
				var reg = /<img/gi
				if (!nodes) {
					return
				}
				return nodes.replace(reg, '<img style="width:100%!important;height:auto;!important"')
			},
			callnumber() {
				// 判断是否支持 plus（仅在 App 端生效）
					if (typeof plus !== 'undefined') {
						plus.runtime.openURL('tel:' + this.ginfo.g_phone);
					} else {
						// 非 App 端提示或处理
						uni.showToast({
							title: '仅支持 App 拨打电话',
							icon: 'none'
						});
					}
				// uni.makePhoneCall({
				// 	phoneNumber: this.ginfo.g_phone
				// });
			},
			blankChange(type) {
				let that = this;
				that.cat_index = type;
				that.ticket = 1;
				that.ticket_color = "red";
				that.ticket_index = 0;
				that.blank_img_index = 1;
				////
				that.doIninit();
			},
			goCart() {
				uni.navigateTo({
					url: '/pages/cart/cart?pushType=1'
				})
			},
			addReport() {
				let that = this;
				var params = {
					uid: that.uid,
					types: 0,
					cont_id: that.gid,
					logs_id: that.cdata.id,
					nums: that.nums,
					ticket: that.ticket_index,
					ticket_fee: that.ticket,
					status: 1
				};
				uni.showLoading({
					title: "处理中..."
				})
				that.$api.Newcartadd(params).then(ret => {
					uni.hideLoading()
					that.closeBuyer();
					uni.navigateTo({
						url: '/pages/report/repinfos'
					})
					// return that.navCtrl.push(RepinfosPage);
				}).catch(err => {
					uni.hideLoading()
				});
			},
			backNav() {
				uni.navigateBack()
			},
			addCart(type) {
				this.addCartOP(type);
			},
			addCartOP(type) {
				let that = this;
				var params = {
					uid: that.uid,
					buyer: type,
					types: 0,
					cont_id: that.gid,
					logs_id: that.cdata.id,
					nums: that.nums,
					ticket: that.ticket_index,
					ticket_fee: that.ticket,
					status: 1
				};

				uni.showLoading({
					title: "处理中..."
				})
				that.$api.cartadd(params).then(ret => {
					uni.hideLoading()
					that.closeBuyer();
					if (type > 0) {
						uni.navigateTo({
							url: '/pages/cart/confirm'
						})
						return
					}
					uni.showModal({
						title: '提示',
						content: '加入购物车成功',
						cancelText: '查看',
						success: (res) => {
							if (res.confirm) {

							} else if (res.cancel) {
								//跳转到购物车
								uni.navigateTo({
									url: '/pages/cart/cart?pushType=1'
								})
							}
						}
					});

				}).catch(err => {
					uni.hideLoading()
				});
			},




			closeBuyer() {
				let that = this;
				////
				that.cdata = [];
				that.nums = 1;
				that.copen = 0;
			},
			preventScroll(event) {
				// 这个方法什么都不做，只是用来阻止 touchmove 事件的默认行为
			},
			numsChange(type) {
				let that = this;
				that.nums = temp > 0 ? temp : 1;
			},
			openBuyer(data, index) {
				let that = this;
				that.clickIndex = index;
				that.cdata = data;
				that.cprice = that.transpoint(data.market * that.ticket * that.ulevel.up);
				that.copen = 1;
			},
			texChange(type) {
				console.log(type);
				let that = this;
				that.ticket_index = type;
				if (type == 0) {
					that.ticket = 1;
					that.ticket_color = "red";
				}
				if (type == 1) {
					that.ticket = 1 + that.blank_info.ticket_nor / 100;
					that.ticket_color = "blue";
				}
				if (type == 2) {
					that.ticket = 1 + that.blank_info.ticket_person / 100;
					that.ticket_color = "blue";
				}
				this.$forceUpdate()
				//

			},
			changePage(id) {
				let that = this;
				that.act_index = id;
			},
			transpoint(value) {
				//return Math.floor(value * 100) / 100;
				return parseFloat(value).toFixed(2);
			},

			doIninit() {
				let that = this;
				var params = {
					uid: that.uid,
					gid: that.gid,
					cat_index: that.cat_index
				};
				that.$api.glist(params).then(ret => {
					that.ginfo = ret.data.info;
					that.ulevel = ret.data.ulevel;
					that.cat_index = ret.data.cat_index;
					that.blank = ret.data.blank;
					that.blank_info = ret.data.blank_info;
					if (that.blank_info.source_url != null) {
						that.blank_img = that.blank_info.source_url.length;
					}

					that.list = ret.data.list;
					that.list_count = ret.data.list.length;
					that.keys = ret.data.keys;
					this.pageNum=1
					this.pageSize=15
					this.visibleList=[]
					this.loadMoreData(); 

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
	.page {
		padding-top: var(--status-bar-height);
	}

	.iosTba {
		top: var(--status-bar-height);
	}
	
	.primary{
		padding: 5rpx 30rpx;
		background-color: #2979ff;
		color: #ffffff;
		font-size: 24rpx;
		border-radius: 10rpx;
	}
	.default{
		background-color: #e1e1e1;
		border: 1rpx solid #e1e1e1;
		color: #333;
		font-size: 24rpx;
		padding: 5rpx 30rpx;
		border-radius: 10rpx;
	}

	.banner {
		position: relative;
		min-height: 300rpx;
	}

	.custom-size-button {
		width: 170rpx;
		/* 自定义宽度 */
		height: 60rpx;
		/* 自定义高度 */
		font-size: 24rpx;
		/* 可选：调整字体大小 */
		/* 其他样式 */
	}

	.pageTab {
		width: 100%;
		height: 100rpx;
	}

	.pageTab .active {
		color: #c20f22;
		font-weight: bold;
	}

	.pageTab image {
		vertical-align: middle;
		width: 40rpx;
	}

	.ticket_color {
		background: #f8bebe;
	}

	.banner image {
		width: 100%;
		vertical-align: middle;
	}

	.banner_icon {
		left: 24rpx;
		position: absolute;
		top: 24rpx;
		vertical-align: middle;
		width: 48rpx;
		z-index: 5;
	}

	.banner_buyer {
		left: auto;
		right: 104rpx;
	}

	.banner_tel {
		left: auto;
		right: 24rpx;
	}

	.banner_share {
		left: auto;
		right: 24rpx;
	}

	.banner_pager {
		background: #000000;
		bottom: 24rpx;
		color: white;
		font-size: 22rpx;
		height: 42rpx;
		line-height: 42rpx;
		opacity: 0.25;
		position: absolute;
		right: 24rpx;
		text-align: center;
		width: 88rpx;
		z-index: 5;
	}









	/**********************************/
	.nav {
		background: #c20f22;
		display: flex;
		text-align: center;
	}

	.nav_item {
		font-size: 28rpx;
		flex: 1;
		height: 72rpx;
		line-height: 72rpx;
	}

	.nav_item span {
		border-radius: 4rpx;
		color: white;
		padding: 4rpx 14rpx;
	}

	.nav_item span.active {
		background: white;
		color: #c20f22;
	}

	/**********************************/
	.lists {
		display: flex;
		width: 100%;
		/**text-align: center;*/
	}

	.lists.bg {
		background: #eeeeee;
		color: #1407e0;
		text-align: center;
	}

	.lists_item {
		border-right: 2rpx solid #dddddd;
		border-bottom: 2rpx solid #dddddd;
		flex: 1;
		font-size: 24rpx;
		font-weight: bold;
		min-height: 88rpx;
		padding-left: 6rpx;
	}

	.overflow {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.lists_pisr {
		border-right: 2rpx solid #dddddd;
		border-bottom: 2rpx solid #dddddd;
		flex: 2;
		font-size: 24rpx;
		font-weight: bold;
		min-height: 88rpx;

		word-wrap: break-word;
		word-break: break-all;
		padding-left: 6rpx;

	}

	.lists_item.red {
		color: #c20f22;
	}

	.lists_item.blue {
		color: #1407e0;
	}

	.lists_item.black {
		color: black;
	}

	/**********************************/
	.list_linr {
		padding: 12rpx 0rem;
		width: 100%;
	}

	.list_line_title {
		font-size: 28rpx;
		font-weight: bold;
		margin-bottom: 10rpx;
		padding: 0rem 24rpx;
		width: 90%;
	}

	.list_line_infos {
		display: flex;
	}

	.list_line_infos_thumb {
		flex: 1.8;
		padding: 5rpx;
	}

	.list_line_infos_thumb image {
		vertical-align: top;
		width: 95%;
	}

	.list_line_infos_attrs {
		flex: 3;
	}

	.list_line_infos_attrs P {
		font-size: 20rpx;
		height: 44rpx;
		line-height: 44rpx;
		margin: 0rem;
	}

	.list_line_infos_attrs P i {
		color: #3447d7;
		font-style: normal;
	}

	.list_line_infos_attrs P i.color {
		color: #d0021b;
	}

	.list_line_attr {
		border-top: 1px solid #dddddd;
		display: flex;
		text-align: center;
	}

	.list_line_attr_title {
		color: #4a90e2;
		flex: 1;
		height: 124rpx;
		line-height: 124rpx;
	}

	.list_line_attr_value {
		flex: 2;
		font-size: 20rpx;
		height: 124rpx;
		line-height: 40rpx;
	}

	.list_line_attr_mores {
		background: #4a90e2;
		color: white;
		flex: 1;
		height: 124rpx;
		line-height: 124rpx;
	}

	.list_line_spac {
		height: 20rpx;
		background: linear-gradient(180deg, #f1f1f1 0%, #ffffff 46%, #efefef 100%);
	}

	/**********************************/
	.footer {
		width: 750rpx;
		background: #ffff99;
		font-size: 24rpx;
		min-height: 100rpx;
		padding: 0rem 12rpx;
		position: fixed;
		bottom: 0;
		left: 0;
	}

	.footer span {
		margin-right: 20rpx;
	}

	.footer span i {
		color: #c20f22;
		font-size: 32rpx;
		vertical-align: middle;
		margin-right: 10rpx;
		margin-top: 4rpx;
	}

	.footer image {
		margin-top: -4rpx;
		margin-right: 4rpx;
		vertical-align: middle;
		width: 34rpx;
	}

	.h100 {
		height: calc(60vh);
	}

	.list_item {
		display: flex;
		justify-content: center;
		align-items: center;
		border: 1px solid #f5f5f5;
	}
</style>