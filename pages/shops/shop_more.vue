<template>
	<view>
		<view class="pageTab d_a_sa">
			<image mode="widthFix" src="/static/icon/ic_back.png" @click="backNav()" />
			<p :class="act_index==0?'active':''" @click="changePage(0)">商品</p>
			<p :class="act_index==1?'active':''" @click="changePage(1)">参数</p>
			<p :class="act_index==2?'active':''" @click="changePage(2)">详情</p>
		</view>

		<view :class="act_index==0?'':'none'">
			<view class="banner" style="margin: 0;padding: 0;">
				<image mode="widthFix" v-if='blank_info.source_url' :src="blank_info.source_url[0]" style="width: 100%;" />
				<image mode="widthFix" src="/static/icon/ic_buyer.png" style="width: 48rpx;height: 48rpx;" class="banner_icon banner_buyer" @click="goCart()" />
				<image mode="widthFix" src="/static/icon/ic_contect.png" style="width: 48rpx;height: 48rpx;" class="banner_icon banner_tel" @click="callnumber()" />
			</view>
			<view class="nav">
				<view class="nav_item" v-for="(x,i) in blank" :key="i">
					<span :class="cat_index==i+1?'active':''" @click="blankChange(i+1)">{{x.catname}}</span>
				</view>
			</view>

			<view v-for="(r,index) in list " :key="index">

				<view class="list_linr" @click="openBuyer(r)">
					<view class="list_line_title">{{ginfo.title}}</view>
					<view class="list_line_infos">
						<view class="list_line_infos_thumb">
							<image mode="widthFix" :src="r.source_url" />
						</view>
						<view class="list_line_infos_attrs">
							<p><span>{{r.key_0}}：<i>{{r.value_0}}</i></span></p>
							<p><span>{{r.key_1}}：<i>{{r.value_1}}</i></span></p>
							<p><span>{{r.key_2}}：<i>{{r.value_2}}</i></span></p>
							<p>
								<span style="margin-right: 0.2rem;">
									是否含税：
									<i>{{ticket_index==0?'不含发票':''}}{{ticket_index==2?'专用发票':''}}{{ticket_index==1?'普通发票':''}}</i>
								</span>
								<span>运费标识：<i>{{ulevel['trans']>0?'含运费':'不含运费'}}</i></span>
							</p>
							<p><span>发货时效：<i>{{r.trans}}</i></span></p>
							<p>
								<span>
									执行价格：
									<i class='color' :class="ticket_color">
										{{transpoint(r.s_price_arr[0]*ticket*ulevel['up'])}}~{{transpoint(r.s_price_arr[1]*ticket*ulevel['up'])}}
									</i>
									元
								</span>
							</p>
						</view>
					</view>
					<view class="list_line_attr">
						<view class="list_line_attr_title">颜色规格选择</view>
						<view class="list_line_attr_value">
							<p v-for="(s,i) in r.child" :key="i">
								{{s.name}}
								<span :class="ticket_color">{{transpoint(s.market*ticket*ulevel['up'])}}</span>
							</p>
						</view>
						<view class="list_line_attr_mores">查看更多</view>
					</view>
				</view>
				<view class="list_line_spac"></view>

			</view>

		</view>


		<view class="masks" @touchmove.stop.prevent="preventScroll" style="opacity:0.9" v-if="copen>0"></view>



		<view class="masks_panel" @touchmove.stop.prevent="preventScroll" v-if="copen>0">
			<view class="masks_panel_close" @click="closeBuyer()">
				<image mode="widthFix" src="/static/icon/ic_close.png" />
			</view>

			<view class="list_linr">
				<view class="list_line_title">{{cdata.gnames}}</view>
				<view class="list_line_infos">
					<view class="list_line_infos_thumb">
						<image mode="widthFix" :src="cdata.source_url" />
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
			<view class="masks_panel_attr">属性分类 ｜ 购买数量</view>

			<view class="masks_panel_list">
				<view class="masks_panel_list_line" v-for="(s,i) in cdata.child" :key="i">
					<view class="masks_panel_list_linetop">{{s.name}}</view>
					<view class="masks_panel_list_linefot">
						<view class="masks_panel_list_linemon">¥ {{transpoint(s.market*ticket*ulevel['up'])}}</view>
						<view class="masks_panel_list_linenums">
							<span class="ceil" @click="numsChange(0,i)">-</span>
							<input type="number" v-model="s.nums" @change="changeData(s,i)" />
							<span class="adds" @click="numsChange(1,i)">+</span>
						</view>
					</view>
				</view>
			</view>
			<view class="masks_panel_count">
				已选数量：<span>{{nums}}</span>，合计金额：<span>{{transpoint(money)}}元</span>
			</view>
			<view class="masks_panel_btns">
				<button @click="addReport()">加入报价单</button>
				<button style="margin-left: 10rpx;margin-right: 10rpx;" @click="addCart(0)">加入购物车</button>
				<button @click="addCart(1)">立即购买</button>
			</view>
		</view>





		<view class="footer" v-if="act_index==0" style="display: flex;flex-direction: column">
			<view class="w_100 d_a_j" style="margin-top: 10rpx">
				<view style="width: 30%;height: 1px;background: #333"></view>
				<span style="font-weight: 700;margin-left: 20rpx;margin-right: 10rpx">点击选择价格税率</span>
				<view style="width: 30%;height: 1px;background: #333"></view>
			</view>
			<view class="d_a_sa w_100" style="margin-top: 4rpx">
				<u-button :type="ticket_index==0?'primary':'default'" size="mini" @click="texChange(0)">不含发票</u-button>
				<u-button size="mini" :type="ticket_index==2?'primary':'default'" @click="texChange(2)">含专用发票</u-button>
				<u-button size="mini" :type="ticket_index==1?'primary':'default'" @click="texChange(1)">含普通发票</u-button>
			</view>
		</view>

		<view :class="act_index==1?'':'none'">
			<rich-text style="width: 750rpx;" :nodes=" setNodes(ginfo.g_attr)"></rich-text>
		</view>
		<view :class="act_index==2?'':'none'">
			<rich-text style="width: 750rpx;" :nodes="setNodes(ginfo.g_desc)"></rich-text>
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
				list: '',
				list_count: 0,
				keys: '',
				ticket_index: 0,
				ticket: 1,
				ticket_color: "red",
				copen: 0,
				cdata: '',
				cprice: 0,
				nums: 1,
				money: 0,
			}
		},
		onLoad(option) {
			this.gid = option.ids ? option.ids : 34
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
			callnumber() {
				uni.makePhoneCall({
					phoneNumber: this.ginfo.g_phone 
				});
			},
			goCart() {
			   uni.navigateTo({
			   	url:'/pages/cart/cart?pushType=1'
			   })
			 },
			addCart(type) {
				this.addCartOP(type);
			},
			addCartOP(type) {
				let that = this;
				var params = {
					uid: that.uid,
					buyer: type,
					types: 1,
					cont_id: that.gid,
					logs_id: that.cdata['id'],
					carts_logs: that.cdata['child'],
					nums: that.nums,
					ticket: that.ticket_index,
					ticket_fee: that.ticket,
					status: 1
				};
				if (that.money < 1) {
					uni.showToast({
						icon: "none",
						title: "请至少选择一个属性规格"
					})
					return false;
				}
				uni.showLoading({
					title: "处理中..."
				})
				that.$api.cartadd(params).then(ret => {
					that.closeBuyer();
					uni.hideLoading()
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
				that.cdata = [];
				that.nums = 1;
				that.copen = 0;
			},
			addReport() {
				let that = this;
				var params = {
					uid: that.uid,
					types: 1,
					cont_id: that.gid,
					logs_id: that.cdata['id'],
					report_logs: that.cdata['child'],
					nums: that.nums,
					ticket: that.ticket_index,
					ticket_fee: that.ticket,
					status: 1
				};
				if (that.money < 1) {
					uni.showToast({
						icon: 'none',
						title: "请至少选择一个属性规格"
					})
					return false
				}
				uni.showLoading({
					title: "处理中..."
				})
				that.$api.Newcartadd(params).then(ret => {
					uni.hideLoading()
					that.closeBuyer();
					uni.navigateTo({
						url: '/pages/report/repinfos'
					})
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
			numsChange(type, index) {
				let that = this;
				let list = that.cdata['child'][index];
				let vals = list.nums;
				////
				let temp = type > 0 ? vals + 1 : vals - 1;
				that.cdata['child'][index].nums = temp > 0 ? temp : 1;
				that.piexlToMoney();
			},
			openBuyer(data) {
				let that = this;
				////
				that.cdata = data;
				that.copen = 1;
				that.piexlToMoney();
			},
			piexlToMoney() {
				let that = this;
				let list = that.cdata['child'];
				////
				var numb = 0;
				var money = 0;
				for (var i = 0; i < list.length; i++) {
					numb = parseInt(list[i]['nums']) + numb;
					money = money + (list[i]['nums'] * list[i]['market']);
				}
				that.nums = numb;
				that.money = money * that.ticket * that.ulevel['up'];
			},
			texChange(type) {
				console.log(type);
				let that = this;
				that.ticket_index = type;
				this.$forceUpdate()
				////
				if (type == 0) {
					that.ticket = 1;
					that.ticket_color = "red";
				}
				if (type == 1) {
					that.ticket = 1 + that.blank_info["ticket_nor"] / 100;
					that.ticket_color = "blue";
				}
				if (type == 2) {
					that.ticket = 1 + that.blank_info["ticket_person"] / 100;
					that.ticket_color = "blue";
				}
				//

			},
			setNodes(nodes) {
				var reg = /<img/gi
				if (!nodes) {
					return
				}
				return nodes.replace(reg, '<img style="width:100%!important;height:auto;!important"')
			},
			changePage(id) {
				let that = this;
				that.act_index = id;
			},
			transpoint(value) {
				//return Math.floor(value * 100) / 100;
				return parseFloat(value).toFixed(2);
			},
			backNav() {
				uni.navigateBack()
			},
			doIninit() {
				let that = this;
				var params = {
					uid: that.uid,
					gid: that.gid,
					cat_index: that.cat_index
				};
				that.$api.gmores(params).then(ret => {
					that.ginfo = ret.data.info;
					that.ulevel = ret.data.ulevel;
					that.cat_index = ret.data.cat_index;
					that.blank = ret.data.blank;
					that.blank_info = ret.data.blank_info;
					if (that.blank_info.source_url != null) {
						that.blank_img = that.blank_info.source_url.length;
					}
					///
					that.list = ret.data.list;
					that.list_count = ret.data.list.length;
					////
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





	.tab {
		font-size: 28rpx;
		text-align: center;
		position: fixed;
		width: 100%;
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
		line-height: 70rpx;
		overflow: hidden;

	}

	.list_line_attr_value span {
		color: #c20f22;
		margin-left: 1rem;
	}

	.list_line_attr_value span.blue {
		color: #3447d7;
	}

	.list_line_attr_value span.black {
		color: black;
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
</style>