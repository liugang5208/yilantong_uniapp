<template>
	<view>
		<u-navbar :is-back="false" title="">
			<view class="d_a_sb " style="width: 750rpx;">
				<view style="width: 200rpx;padding-left: 30rpx;" @click="back">
					<u-icon name="nav-back" color="#606266" :size="44">
					</u-icon>
				</view>
				<view style="font-size: 30rpx; color: #000; font-weight: bold; text-align: center; flex-grow: 1;">结算中心
				</view>
				<view style="width: 200rpx;padding-right: 30rpx; color: #488aff; text-align: right;" @click="custom">
					联系客服</view>
			</view>
		</u-navbar>
		<view class="">
			<view class="addr" @click="addrPicker(0)">
				<view class="addr_title">收货人信息</view>
				<view v-if="addr>=-1 && addrinf">
					<view class="addr_line">收货姓名：<span>{{addrinf.name}}</span></view>
					<view class="addr_line">手机号码：<span>{{addrinf.phone}}</span></view>
					<view class="addr_line">
						收货地址：<span>{{addrinf.p_name}}{{addrinf.c_name}}{{addrinf.l_name}}{{addrinf.street}}</span>
					</view>
				</view>
				<image src="/static/icon/ic_right_gy.png" />
			</view>

			<view class="panel">
				<view class="panel_box">
					<view class="panel_box-item" v-for="(x,index) in list" :key="index">
						<view v-if="x.types=='0'">
							<view class="panel_box-item_title">{{x.list.gnames}}</view>
							<view class="panel_box-item_image">
								<view class="panel_box-item_image-item panel_box-item_image-item_center">
									<image mode="widthFix" :src="x.list.gimage" />
								</view>
								<view class="panel_box-item_image-item">
									<p>{{x.list.key_0}}：<span>{{x.list.value_0}}</span></p>
									<p>{{x.list.key_1}}：<span>{{x.list.value_1}}</span></p>
									<p>{{x.list.key_2}}：<span>{{x.list.value_2}}</span></p>
									<p>是否含税：<span>{{x.ticket=='0'?'不含发票':''}}{{x.ticket=='1'?'普通发票':''}}{{x.ticket=='2'?'专用发票':''}}</span>
									</p>
								</view>
							</view>
							<view class="panel_box-item_attr">
								<view class="panel_box-item_attr-info">
									<view class="panel_box-item_attr-info_i">
										¥<span>{{transpoint(x.list.market*ulevel.up*x.ticket_fee)}}</span></view>
									<view class="panel_box-item_attr-info_i">购买数量：<span>{{x.nums}}</span></view>
									<view class="panel_box-item_attr-info_i">单品合计：<span>¥
											{{transpoint(x.price)}}</span>元</view>
								</view>
							</view>
						</view>



						<view v-if="x.types=='1'">
							<view class="panel_box-item_title">{{x.gnames}}</view>
							<view class="panel_box-item_image">
								<view class="panel_box-item_image-item panel_box-item_image-item_center">
									<image mode="widthFix" :src="x.gimage" />
								</view>
								<view class="panel_box-item_image-item">
									<p>{{x.datr.key_0}}：<span>{{x.datr.value_0}}</span></p>
									<p>{{x.datr.key_1}}：<span>{{x.datr.value_1}}</span></p>
									<p>{{x.datr.key_2}}：<span>{{x.datr.value_2}}</span></p>
									<p>是否含税：<span>
											{{x.ticket=='0'?'不含发票':''}}{{x.ticket=='1'?'普通发票':''}}{{x.ticket=='2'?'专用发票':''}}</span>
									</p>
								</view>
							</view>
							<view class="panel_box-item_attr" v-for="(r,index) in x.list" :key="index">
								<view class="panel_box-item_attr-title">{{r.info.name}}</view>
								<view class="panel_box-item_attr-info">
									<view class="panel_box-item_attr-info_i">
										¥<span>{{transpoint(r.info.market*ulevel.up*x.ticket_fee)}}</span></view>
									<view class="panel_box-item_attr-info_i">购买数量：<span>{{r.nums}}</span></view>
									<view class="panel_box-item_attr-info_i">单品合计：<span>¥
											{{transpoint(r.nums*r.info.market*ulevel.up*x.ticket_fee)}}</span>元</view>
								</view>
							</view>
						</view>

						<view class="panel_box-item_total">
							共<span>{{x.nums}}</span>件商品，合计金额：<span>{{transpoint(x.price)}}</span> 元</view>
					</view>

				</view>
			</view>

			<view class="stitle">交易信息</view>
			<view class="line">
				<view class="line_info-right">
					<text>选择交易模式</text>
					<view class="line_info-tag" @click="addrPaytype()">
						{{paytype==0?'在线支付':''}} {{paytype==1?'货到付款':''}} {{paytype==2?'平台代发货':''}}
						{{paytype==3?'银行转账':''}}
						{{paytype==4?'签约商户':''}}
					</view>
				</view>
				<view class="line_info-right" v-if="paytype<3">
					<text>选择付款方式</text>
					<view class="line_info-tag" @click="addrOnltype()">
						<!--img src="assets/icon/ic_wechat.png" /-->
						<span>
							{{online==1?'微信支付':''}}
							{{online==2?'支付宝支付':''}}
						</span>
					</view>
				</view>
				<view class="line_info">
					<text>附带销售清单</text>
					<view class="line_info-tag">
						<!-- <i class="fa fa-check-circle" v-if="select==1" @click="selector(0)"></i>
						<i class="fa fa-circle-o" v-if="select==0" @click="selector(1)"></i>
						<span class="line_info-tagm">需要</span>
						
						<i class="fa fa-check-circle" *ngIf="select==0" (click)="selector(1)"></i>
						<i class="fa fa-circle-o" *ngIf="select==1" (click)="selector(0)"></i>
						<span>不需要</span> -->

						<u-radio-group v-model="select" @change="radioGroupChange">
							<u-radio @change="radioChange" v-for="(item, index) in listRadio" :key="index"
								:name="item.name">
								{{item.title}}
							</u-radio>
						</u-radio-group>


					</view>
				</view>
				<view class="line_info line_info2">
					<text>买家留言</text>
					<textarea style="height: 100rpx;" placeholder="如有特殊需求请在这里告诉卖家" v-model="tags"></textarea>
				</view>
			</view>


			<view v-if="ticket>0">
				<view class="stitle">选择购买方的发票信息（{{ticket=='1'?'普票':''}}{{ticket=='2'?'专票':''}}）</view>
				<view class="line">
					<view class="line_info-right">
						<text>*单位资料</text>
						<view class="line_info-tag" @click="addrTicket()">
							<span v-if="comp<0">请选择单位信息</span>
							<span v-if="comp>=0">{{cmlist[comp]['comp_name']}}</span>
						</view>
					</view>
					<view class="line_info line_info2">
						<label>发票备注</label>
						<textarea style="height: 100rpx;" placeholder="发票备注栏信息" v-model="tiktag" class="bg"></textarea>
					</view>
					<view class="line_info-right">
						<text>发票邮寄</text>
						<view class="line_info-tag" @click="addrPicker(1)">
							<span v-if="tikadinx<0">请选择发票及合同邮寄地址</span>
							<span v-if="tikadinx>=0">{{adlist[tikadinx]['name']}}</span>
						</view>
					</view>
				</view>
			</view>

			<view v-if="paytype==2">
				<view class="stitle">平台发货地址</view>
				<view class="line">
					<view class="line_info">
						<text>发货人名称</text>
						<view class="line_info-tag">
							<input type="text" placeholder="发货人名称" v-model="save_name" />
						</view>
					</view>
					<view class="line_info">
						<text>发货人电话</text>
						<view class="line_info-tag">
							<input type="text" placeholder="发货人电话" v-model="save_phone" />
						</view>
					</view>
					<view class="line_info">
						<text>发货人地址</text>
						<view class="line_info-tag">
							<input type="text" placeholder="发货人地址" v-model="save_addr" />
						</view>
					</view>
				</view>
			</view>


			<view v-if="paytype==3 && ticket==1">
				<view class="stitle stitle2">易缆平台对公收款账户</view>
				<view class="line" v-if="info.bank_pub">
					<view class="line_info">
						<text>公司名称</text>
						<view class="line_info-tag">{{info.bank_pub.tic_1.name}}</view>
					</view>
					<view class="line_info">
						<text>开户银行</text>
						<view class="line_info-tag">{{info.bank_pub.tic_1.open_bank}}</view>
					</view>
					<view class="line_info">
						<text>银行账号</text>
						<view class="line_info-tag">{{info.bank_pub.tic_1.cardid}}</view>
					</view>
					<view class="line_info">
						<text>开户行号</text>
						<view class="line_info-tag">{{info.bank_pub.tic_1.open_bank_id}}</view>
					</view>
				</view>
			</view>

			<view v-if="paytype==3 && ticket==2">
				<view class="stitle stitle2">易缆平台对公收款账户</view>
				<view class="line" v-if="info.bank_pub">
					<view class="line_info">
						<text>公司名称</text>
						<view class="line_info-tag">{{info.bank_pub.tic_2.name}}</view>
					</view>
					<view class="line_info">
						<text>开户银行</text>
						<view class="line_info-tag">{{info.bank_pub.tic_2.open_bank}}</view>
					</view>
					<view class="line_info">
						<text>银行账号</text>
						<view class="line_info-tag">{{info.bank_pub.tic_2.cardid}}</view>
					</view>
					<view class="line_info">
						<text>开户行号</text>
						<view class="line_info-tag">{{info.bank_pub.tic_2.open_bank_id}}</view>
					</view>
				</view>
			</view>

			<view v-if="paytype==3 && ticket<1">
				<view class="stitle stitle3">
					<!--span>账户</span-->
					<span class="left">平台指定收款账户</span>
					<span :class="paybank==i?'active':''" @click="changebankID(i)"
						v-for="(item,i) in info.bank_pri">{{item.bank}}</span>
				</view>

				<view class="line" :class="paybank==i?'':'none'" v-for="(item,i) in info.bank_pri">
					<view class="line_info">
						<text>开户银行</text>
						<view class="line_info-tag">{{item.bank_name}}—{{item.bank}}</view>
					</view>
					<view class="line_info">
						<text>银行户名</text>
						<view class="line_info-tag">{{item.name}}</view>
					</view>
					<view class="line_info">
						<text>银行账号</text>
						<view class="line_info-tag">{{item.cardid}}</view>
					</view>
					<view class="line_info">
						<text>开户行</text>
						<view class="line_info-tag">{{item.open_bank}}</view>
					</view>
				</view>

			</view>

			<view class="stitle">支付金额详情展示</view>
			<view class="line">
				<view class="line_info">
					<text>订单交易类型</text>
					<view class="line_info-tag">
						{{ulevel.trans>0?'含运费':'不含运费'}} {{ticket=='0'?'不含发票':''}} {{ticket=='1'?'普通发票':''}}
						{{ticket=='2'?'专用发票':''}}
					</view>
				</view>
				<view class="line_info">
					<text>订单合计金额</text>
					<view class="line_info-tag"><span class="red">{{transpoint(price)}}</span>元</view>
				</view>
				<view class="line_info">
					<text>订单应付金额</text>
					<view class="line_info-tag"><span class="red">{{transpay(price)}}</span>元</view>
				</view>
				<view class="line_info">
					<text>订单支付模式</text>
					<view class="line_info-tag">
						{{paytype==0?'在线支付':''}} {{paytype==1?'货到付款':''}} {{paytype==2?'平台代发货':''}}
						{{paytype==3?'银行转账':''}}
						{{paytype==4?'签约商户':''}}
					</view>
				</view>
			</view>



			<uni-popup ref="popup" type="center" @change="popupChange">
				<view class="mask_addr d_a" style="flex-direction: column;" v-if="mask_addr>0">
					<view class="w_100 d_a_sb" style="height: 100rpx;">
						<text style="font-size: 36rpx;font-weight: bold;">请选择收货地址</text>
						<text style="color: #488aff;" @click="gotoAddr()">添加地址</text>
					</view>
					<u-line color="#e1e1e1"></u-line>
					<view @click="comfirmAddr(i,item.id)" v-for="(item,i) in adlist " :key="i" class="w_100"
						style="display: flex;flex-direction: column;padding: 30rpx;">
						<text style="font-size: 36rpx;font-weight: bold;color: #000;">{{item.name}}</text>
						<text style="margin-top: 5rpx;font-size: 32rpx;">{{item.phone}}</text>
						<text
							style="margin-top: 5rpx;font-size: 26rpx;">{{item.p_name}}{{item.c_name}}{{item.l_name}}{{item.street}}</text>
						<u-line style="margin-top: 30rpx;" color="#e1e1e1"></u-line>
					</view>
				</view>


				<view class="mask_addr" v-if="mask_ticket>0">
					<view class="w_100 d_a_sb" style="height: 100rpx;">
						<text style="font-size: 36rpx;font-weight: bold;">请选择发票及合同邮寄地址</text>
						<text style="color: #488aff;" @click="gotoAddr()">添加地址</text>
					</view>
					<u-line color="#e1e1e1"></u-line>
					<view @click="comfirmTicketAddr(i,item.id)" v-for="(item,i) in adlist " :key="i" class="w_100"
						style="display: flex;flex-direction: column;padding: 30rpx;">
						<text style="font-size: 36rpx;font-weight: bold;color: #000;">{{item.name}}</text>
						<text style="margin-top: 5rpx;font-size: 32rpx;">{{item.phone}}</text>
						<text
							style="margin-top: 5rpx;font-size: 26rpx;">{{item.p_name}}{{item.c_name}}{{item.l_name}}</text>
						<u-line style="margin-top: 30rpx;" color="#e1e1e1"></u-line>
					</view>
				</view>



				<view class="mask_addr" style="flex-direction: column;" v-if="mask_online>0">
					<view class="w_100 d_a_sb" style="height: 100rpx;">
						<text style="font-size: 36rpx;font-weight: bold;">请选择支付方式</text>
					</view>
					<u-line color="#e1e1e1"></u-line>

					<view class="w_100 d_a_sb" @click="comfirmOnltype(1)" style="height: 100rpx;">
						<text style="font-size: 32rpx;">微信支付</text>
					</view>
					<u-line color="#e1e1e1"></u-line>
					<view class="w_100 d_a_sb" @click="comfirmOnltype(2)" style="height: 100rpx;">
						<text style="font-size: 32rpx;">支付宝支付</text>
					</view>
					<u-line color="#e1e1e1"></u-line>
				</view>


				<view class="mask_addr" v-if="mask_pays>0">
					<view class="w_100 d_a_sb" style="height: 100rpx;">
						<text style="font-size: 36rpx;font-weight: bold;">请选择支付方式</text>
					</view>
					<u-line color="#e1e1e1"></u-line>
					<view class="w_100" style=" flex-direction: column;padding: 30rpx;display: flex;"
						@click="comfirmPaytype(0)" v-if="ticket<1">
						<text style="font-size: 36rpx;font-weight: bold;color: #000;">在线支付</text>
						<text
							style="margin-top: 10rpx;color: #8e9093;font-size: 24rpx;">在线支付该笔订单的全部总计金额，支付完成后，生成订单后由平台安排发货。</text>
					</view>
					<u-line color="#e1e1e1"></u-line>

					<view class="w_100" style=" flex-direction: column;padding: 30rpx;display: flex;"
						@click="comfirmPaytype(1)" v-if="ticket<1">
						<text style="font-size: 36rpx;font-weight: bold;color: #000;">货到付款</text>
						<text
							style="margin-top: 10rpx;color: #8e9093;font-size: 24rpx;">您只需要在线支付该笔订单总额30%比例的金额，剩余70%的款项将由承运物流代为收取，由平台安排发货。</text>
					</view>
					<u-line color="#e1e1e1"></u-line>

					<view class="w_100" style=" flex-direction: column;padding: 30rpx;display: flex;"
						@click="comfirmPaytype(3)">
						<text style="font-size: 36rpx;font-weight: bold;color: #000;">银行转账</text>
						<text
							style="margin-top: 10rpx;color: #8e9093;font-size: 24rpx;">系统自动生成该笔订单金额，订单页面将提供平台指定的收款账户，待您完成银行转账后并
							上传【汇款凭证】至平台即可完成订单，待平台确认对应款项到位后将会第一时间为您安排发货，【如果该笔订单属于含税的订单】在订单完成7个工作日内，平台将会为您开具全额对应金额的增值税发票，并邮寄至您指定地址
						</text>
					</view>
					<u-line color="#e1e1e1"></u-line>


					<view class="w_100" style=" flex-direction: column;padding: 30rpx;display: flex;"
						@click="comfirmPaytype(4)" v-if="uinfo.ac_credit>0">
						<text style="font-size: 36rpx;font-weight: bold;color: #000;">签约商户</text>
						<text style="margin-top: 10rpx;color: #8e9093;font-size: 24rpx;">
							如果您是易缆通签约经销商，您将拥有该级别的特权，平台为您提供一定额度的赊销额度，该选项您不需要支付货款，直接生成订单，平台安排发货即可，后期根据协议统一结算。
						</text>
					</view>
					<u-line color="#e1e1e1"></u-line>

					<view class="w_100" style=" flex-direction: column;padding: 30rpx;display: flex;"
						@click="comfirmPaytype(2)" v-if="ticket<1">
						<text style="font-size: 36rpx;font-weight: bold;color: #000;">平台代发货</text>
						<text style="margin-top: 10rpx;color: #8e9093;font-size: 24rpx;">
							该选项对所有用户开放，选择该平台代发业务，您需要在线支付该笔订单全部金额，选择收货人及发货人信息，易缆通将按您要求的进行代发货业务，直至订单完成。
						</text>
					</view>
					<u-line color="#e1e1e1"></u-line>

				</view>


				<view class="mask_addr" v-if="mask_comp>0">
					<view class="w_100 d_a_sb" style="height: 100rpx;">
						<text style="font-size: 36rpx;font-weight: bold;">请选择单位信息</text>
						<text style="color: #488aff;" @click="gotoComp()">添加单位信息</text>
					</view>
					<u-line color="#e1e1e1"></u-line>
					<view @click="comfirmBank(i,item.id)" v-for="(item,i) in cmlist " :key="i" class="w_100"
						style="display: flex;flex-direction: column;padding: 30rpx;">
						<text style="font-size: 36rpx;font-weight: bold;color: #000;">{{item.comp_name}}</text>
						<text style="margin-top: 5rpx;font-size: 32rpx;">{{item.tex_type>1?'一般纳税人':'小规模纳税人'}}</text>
						<text
							style="margin-top: 5rpx;font-size: 26rpx;">{{item.ticket_type>1?'增值税专用发票':'增值税普通发票'}}</text>
						<u-line style="margin-top: 30rpx;" color="#e1e1e1"></u-line>
					</view>
				</view>


			</uni-popup>




		</view>

		<view class="list_footer">
			<view class="list_footer-info">
				<p>所选订单合计金额：<span>{{transpay(price)}}</span>元</p>
			</view>
			<view class="list_footer-btn" @click="creatOrd()">{{paybtn}}</view>
		</view>
	</view>
</template>

<script>
	import uniPopup from '@/uni_modules/uni-popup/components/uni-popup/uni-popup.vue'
	export default {
		components: {
			uniPopup
		},
		data() {
			return {
				listRadio: [{
						name: 1,
						title: '需要'

					},
					{
						name: 0,
						title: '不需要'

					},
				],
				uid: '',
				ulevel: '',
				uinfo: '',
				info: '',
				list: '',
				nums: 0,
				price: 0,
				ticket: '',
				ticket_fee: '',
				mask: '',
				mask_addr: 0,
				mask_pays: 0,
				mask_online: 0,
				mask_comp: 0,
				mask_ticket: 0,
				adlist: '', //地址
				addr: -1,
				addrinf: null,
				addrval: "0",
				paytype: 0,
				online: 1,
				select: 0,
				tags: '',
				cmlist: '', //公司
				comp: -1,
				compval: "0",
				tiktag: '',
				tikadinx: -1,
				tikaddr: '',
				save_name: '',
				save_phone: '',
				save_addr: '',
				//
				paybank: 0,
				base64s: 0,
				base64Image: '',
				//
				paybtn: "立即支付",
				//
				alipayIdf: 0,
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
			// uni.$on("appOnShow",data=>{
			// 	uni.$emit("confirm")
			// 	uni.navigateBack()
			// })
		},
		methods: {
			gotoComp() {
				// this.navCtrl.push(TiindexPage);
				uni.navigateTo({
					url: '/pages/my/tiindex/tiindex'
				})

			},
			gotoAddr() {
				uni.navigateTo({
					url: '/pages/my/adindex/adindex'
				})
			},
			comfirmTicketAddr(index, id) {
				let that = this;
				that.tikadinx = index;
				that.tikaddr = id;
				this.$refs.popup.close()
				that.hideMasks();
			},
			comfirmBank(index, id) {
				let that = this;
				//////
				that.comp = index;
				that.compval = id;
				this.$refs.popup.close()
				that.hideMasks();
			},
			addrTicket() {
				let that = this;
				var params = {
					uid: that.uid
				};
				////
				that.$api.ticket_list(params).then(ret => {
					that.cmlist = ret.data;
					this.$refs.popup.open()
					that.mask_comp = 1;
					////
				}).catch(err => {
					console.log(err.status);
					console.log(err.error);
					console.log(err.headers);
				});
			},
			creatOrd() {
				let that = this;
				var params = {
					uid: that.uid,
					addr_id: that.addrval,
					paymode: that.paytype,
					paytype: that.online,
					needlist: that.select,
					tags: that.tags,
					trade_type: 0,
					////
					ticket: that.ticket,
					ticket_fee: that.ticket_fee,
					ticket_comp: that.compval,
					ticket_tag: that.tiktag,
					ticket_addr: that.tikaddr,
					////
					save_name: that.save_name,
					save_phone: that.save_phone,
					save_addr: that.save_addr,
					////
					image: that.base64Image,
				};
				////
				that.$api.order(params).then(ret => {
					this.innerAudioContext = uni.createInnerAudioContext();
					this.innerAudioContext.src = "/static/voice/ord.mp3"; // 设置音频资源的地址
					this.innerAudioContext.play(); // 播放音频
					//银行转账
					if (that.paytype == 3) {
						/**提示语开始**/
						var tips =
							"您的订单已生成，请您按照页面所提供的银行账户进行转款操作，待您完成汇款操作后，请前往【待付款】页面进行【汇款凭证上传】以完成付款流程，订单经公司审核后会为您安排发货";
						tips += "并开具对应税率的机打增值税发票邮寄至您指定收件人及收件地址，感谢您的支持。";
						if (that.ticket < 1) {
							tips = "您的订单已生成，请您按照页面所提供的银行账户进行转款操作，待您完成汇款操作后，请前往【待付款】页面进行【汇款凭证上传】以完成付款流程";
							tips += "，待确认款项到位后，我们会第一时间将您购买的货物发出，感谢您的支持。";
						}
						if (that.ticket > 0) {
							tips = "您的订单已生成，请您按照页面所提供的银行账户进行转款操作，待您完成汇款操作后，请前往【待付款】页面进行【汇款凭证上传】以完成付款流程，";
							tips += "订单经公司审核后会为您安排发货并开具对应税率的机打增值税发票邮寄至您指定收件人及收件地址，感谢您的支持。";
						}
						////
						/**提示语截止**/

						uni.showModal({
							title: '提示',
							content: tips,
							showCancel: false,
							success: (res) => {
								if (res.confirm) {

									// that.navCtrl.push(OrinfosPage, {
									// 	oid: ret.data.id,
									// 	order: 1
									// });
									uni.navigateTo({
										url: '/pages/my/order/infos?oid=' + ret.data.id +
											'&order=1'
									})

								} else if (res.cancel) {
									console.log('用户点击取消');
								}
							}
						});

						return;
					}
					//签约商户
					if (that.paytype == 4) {
						uni.showModal({
							title: '提示',
							content: '您是签约商户，系统已直接生成订单，平台安排发货，后期根据协议统一结算。',
							showCancel: false,
							success: (res) => {
								if (res.confirm) {

									uni.navigateTo({
										url: '/pages/my/order/infos?oid=' + ret.data.id +
											'&order=1'
									})
								} else if (res.cancel) {
									console.log('用户点击取消');
								}
							}
						});

						return;
					}
					return that.setPay(ret.data);
				}).catch(err => {
					console.log("PAYLOF");
					console.log(JSON.stringify(params));
					console.log(err.status);
					console.log(err.error);
					console.log(err.headers);
				});
			},
			radioChange(e) {
				// console.log(e);
			},
			setPay(r) {
				var that = this;
				var params = {
					oid: r.id
				};
				that.$api.order_pay(params).then(ret => {
					that.alipayIdf = 0;
					if (r.paytype < 2) {
						that.openWechatpay(ret.data, r.id);
						return false
					}
					that.openAlipay(ret.data, r.id);
				}).catch(err => {
					console.log("ALNPAY");
					console.log(err.status);
					console.log(err.error);
					console.log(err.headers);
				});
			},
			comfirmPaytype(type) {
				let that = this;
				//////
				that.paytype = type;
				if (type == 3) {
					that.paybtn = "生成订单";
				}
				if (type == 4) {
					that.paybtn = "生成订单";
				}
				if (type != 3 && type != 4) {
					that.paybtn = "立即支付";
				}
				this.$refs.popup.close()
				that.hideMasks();
			},
			addrOnltype() {
				let that = this;
				//////
				this.$refs.popup.open()
				that.mask_online = 1;
			},
			addrPaytype() {
				let that = this;
				//////
				that.mask = 1;
				that.mask_pays = 1;
				this.$refs.popup.open()
			},
			comfirmOnltype(type) {
				let that = this;
				//////
				that.online = type;
				this.$refs.popup.close()
				that.hideMasks();
			},
			comfirmAddr(index, id) {
				let that = this;
				this.addr = index;
				this.addrinf = this.adlist[index];
				this.addrval = id;
				//
				this.$refs.popup.close()
				that.hideMasks();
			},
			// 选中任一radio时，由radio-group触发
			radioGroupChange(e) {
				this.select = e;
			},
			changebankID(id) {
				this.paybank = id;
			},
			hideMasks(e) {
				let that = this;
				that.mask = 0;
				that.mask_addr = 0;
				that.mask_pays = 0;
				that.mask_online = 0;
				that.mask_comp = 0;
				that.mask_ticket = 0;
			},
			popupChange(e) {
				console.log(e.show);
				if (!e.show) {
					this.hideMasks();
				}
			},
			transpay(value) {
				let that = this;
				if (that.paytype == 1) {
					value = value * 0.3;
				}
				return Math.floor(value * 100) / 100;
			},
			transpoint(value) {
				return Math.floor(value * 100) / 100;
			},
			doIninit() {
				let that = this;
				var params = {
					uid: that.uid,
					type: 1
				};
				//
				that.$api.Carts(params).then(ret => {
					that.info = ret.data;
					that.list = ret.data.list;
					if (that.list.length < 1) {
						return that.navCtrl.pop();
					}
					that.ulevel = ret.data.ulevel;
					that.uinfo = ret.data.users;
					that.nums = ret.data.nums;
					that.price = ret.data.price;
					that.ticket = ret.data.ticket;
					that.ticket_fee = ret.data.ticket_fee;
					that.adlist = ret.data.adlist;
					that.addr = ret.data.adef;
					that.addrinf = ret.data.adlist[ret.data.adef];
					that.addrval = ret.data.adlist[ret.data.adef]["id"];
					if (that.ticket > 0) {
						that.paytype = 3;
					}
					////
				}).catch(err => {

				});
			},
			addrPicker(type) {
				let that = this;
				var params = {
					uid: that.uid
				};
				that.$api.uaddr_list(params).then(ret => {
					that.adlist = ret.data;
					that.mask = 1;
					this.$refs.popup.open()
					if (type < 1) {
						that.mask_addr = 1;
					}
					if (type > 0) {
						that.mask_ticket = 1;
					}

				}).catch(err => {

				});
			},
			back() {
				uni.navigateBack()
			},
			custom() {
				uni.navigateTo({
					url: '/pages/my/setindex/setcuetom'
				})
			},
			openWechatpay(payinfo, r) {
				let that = this;
				this.alipayIdf = r
				let orderInfo = payinfo;
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

								},
								complete: function(err) {
									uni.$emit("confirm")
									uni.navigateBack()
								},
							});
						}
					}
				});

			},
			openAlipay(payinfo, r) {
				let that = this;
				that.alipayIdf = r;
				var orderInfo = payinfo; //从服务器获取的订单
				uni.getProvider({
					service: 'payment',
					success: function(res) {
						console.log(res.provider)
						if (~res.provider.indexOf('alipay')) {
							uni.requestPayment({
								"provider": "alipay", //固定值为"alipay"
								"orderInfo": orderInfo, //此处为服务器返回的订单信息字符串
								success: function(res) {
									var rawdata = JSON.parse(res.rawdata);
									console.log("支付成功");
								},
								fail: function(err) {
									console.log('支付失败:' + JSON.stringify(err));
								},
								complete: function(err) {
									uni.$emit("confirm")
									uni.navigateBack()

								},
							});
						}
					}
				});
			}
		}
	}
</script>

<style scoped lang="scss">
	.back-button-ios {
		color: black;
	}

	.back-button-text-ios {
		display: none;
	}

	.content-ios {
		background: #f8f8f8;
	}

	.addr {
		background: #f8f8f8;
		padding: 32rpx 24rpx;
		position: relative;
	}

	.addr_title {
		font-size: 32rpx;
		font-weight: bold;
		margin-bottom: 8rpx;
	}

	.addr_line {
		color: #666666;
		font-size: 30rpx;
		margin-top: 16rpx;
	}

	.addr_line span {
		color: #3447d7;
	}

	.addr image {
		height: 40rpx;
		position: absolute;
		top: 32rpx;
		right: 24rpx;
		width: 40rpx;
	}

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
		padding: 10rpx 0rem;
	}

	.panel_box-item_image-item {
		flex: 2;
	}

	.panel_box-item_image-item_center {
		flex: 1;
		text-align: center;
	}

	.panel_box-item_image-item image {
		margin-top: 25rpx;
		vertical-align: middle;
		width: 80%;
	}

	.panel_box-item_image-item p {
		font-size: 20rpx;
		height: 44rpx;
		line-height: 44rpx;
		margin: 0rem;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		padding-right: 4rpx;
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
		height: 76rpx;
		line-height: 76rpx;
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
		flex: 3;
	}

	.panel_box-item_attr-info_i:last-child {
		flex: 4;
	}

	.panel_box-item_total {
		background: #fffad8;
		font-size: 30rpx;
		height: 96rpx;
		line-height: 96rpx;
		text-align: center;
	}

	.panel_box-item_total span {
		color: #d0021b;
	}

	/**Footer**/
	.list_footer {
		background: white;
		box-shadow: 0px -12rpx 32rpx 0px rgba(0, 0, 0, 0.04);
		padding: 32rpx 24rpx;
		position: relative;
		text-align: left;
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
		display: inline-block;
		font-size: 30rpx;
		height: 72rpx;
		line-height: 72rpx;
		margin-top: -32rpx;
		position: absolute;
		right: 24rpx;
		top: 50%;
		text-align: center;
		width: 200rpx;
	}

	/*******/
	.stitle {
		background: #4a90e2;
		color: white;
		height: 90rpx;
		line-height: 90rpx;
		padding: 0rem 24rpx;
	}

	.stitle2 {
		background: #e65757;
	}

	.stitle3 {
		background: #e65757;
		height: 90rpx;
		line-height: 90rpx;
		text-align: right;
	}

	.stitle3 span {
		border-radius: 10rpx;
		padding: 10rpx 10rpx;
	}

	.stitle3 span.active {
		background: white;
		color: #e65757;
	}

	.stitle3 span.left {
		float: left;
		padding: 0rem;
	}

	.stitle3::after {
		clear: both;
		content: "";
	}

	/*******/
	.line {
		background: white;
	}

	.line_info {
		border-top: 0.5px solid #eeeeee;
		min-height: 90rpx;
		line-height: 90rpx;
		padding: 0rem 24rpx;
		position: relative;
	}

	.line_info::before {
		clear: both;
		content: " ";
		display: table;
	}

	.line_info-right {
		border-top: 0.5px solid #eeeeee;
		min-height: 90rpx;
		line-height: 90rpx;
		padding: 0rem 60rpx 0rem 24rpx;
		position: relative;
	}

	.line_info-right::after {
		background: url("/static/icon/ic_right_gy.png") no-repeat;
		background-size: 100% 100%;
		content: " ";
		height: 24rpx;
		position: absolute;
		top: 34rpx;
		right: 24rpx;
		width: 24rpx;
	}

	.line_info::after {
		content: " ";
		clear: both;
		display: table;
	}

	.line_info-tag {
		float: right;
	}

	.line_info-tag i {
		color: #c20f22;
		font-size: 40rpx;
		margin-top: -4rpx;
		margin-left: 10rpx;
		vertical-align: middle;
	}

	.line_info-tag input {
		border: 0rem;
		min-height: 86rpx;
		line-height: 86rpx;
		text-align: right;
		width: 21rem;
	}

	.line_info-tag select {
		border: 0rem;
		height: 86rpx;
		line-height: 86rpx;
		text-align: right;
		width: 400rpx;
	}

	.line_info-tag image {
		margin-top: -2rpx;
		margin-right: 16rpx;
		vertical-align: middle;
		width: 40rpx;
	}

	.line_info-tag span.red {
		color: #d0021b;
	}

	.line_info-tagm {
		margin-right: 70rpx;
	}

	.line_pic {
		background: white;
		padding: 20rpx;
	}

	.line_pic_cont {
		background: #f8f8f8;
		height: 360rpx;
		line-height: 360rpx;
		text-align: center;
		width: 100%;
	}

	.line_pic_cont image {
		height: 100%;
		vertical-align: middle;
		width: 100%;
	}

	/**********************************************/
	.mask {
		background: black;
		bottom: 0rem;
		opacity: 0.5;
		position: fixed;
		top: 0rem;
		width: 100%;
		z-index: 10;
	}

	.mask_addr {
		background: white;
		border-radius: 5rpx;
		overflow-y: scroll;
		padding: 20rpx;
		width: 630rpx;
		min-height: 50vh;
	}
</style>