<template>
	<view>
		<view class="w_100 d_a_j"
			style="background-color: #f8f8f8;padding-top: 20rpx;padding-bottom: 20rpx;position: relative"
			@click="goManageTableLogo()">
		
			<view class="xzLogo" v-if="!logoInfo.img_site" style="margin-left: 20rpx">选择公司LOGO图片</view>
			<image v-if="logoInfo.img_site" :src="logoInfo.img_site" style="width: 750rpx;height: 107rpx;" />
			<image v-if="logoInfo.img_site" @click.stop="chaLogo()" src="/static/imgs/cha.png"
				style="width: 60rpx;height: 60rpx;position: absolute;right: 20rpx;top: 20rpx;" />
		</view>
		<view class="ceilNumb">
			全部商品统一比例调整:：
			<span @click="revCeil()">-</span>
			
			<span  :class="repratio>0 ? 'red' : repratio<0?'green':repratio==0?'black':''"
				class="value">{{repratio }}%</span>
			<span @click="addCeil()">+</span>
		</view>

		<view class="goods">
			<view class="goods_line">
				<view class="goods_line_item title mrleft" style="flex-grow: 1;">
					<view @click="transBidsShow=true"
						style="display: flex;align-items: center;justify-content: center;width: 100%;position: relative;height: 100%">
						<view style="font-size: 20rpx">产品标准:</view>
						<view style="font-size: 20rpx;color: blue;margin-left: 20rpx;">{{trans_bids}}</view>
						<view style="margin-left: 20rpx;">
							<u-icon v-if="!transBidsShow" name="arrow-down-fill" color="#606266" :size="22">
							</u-icon>
							<u-icon v-if="transBidsShow" name="arrow-up-fill" color="#606266" :size="22">
							</u-icon>
						</view>

					</view>
				</view>
				<view class="goods_line_item title nobor">
					<view @click="ticketNameShow=true"
						style="display: flex;align-items: center;justify-content: center;width: 100%; position: relative;height: 100%">
						<view style="font-size: 1rem">是否含税:</view>
						<view style="font-size: 20rpx;color: blue;margin-left: 20rpx;">{{ticket_name}}</view>
						<view style="margin-left: 20rpx;">
							<u-icon v-if="!ticketNameShow" name="arrow-down-fill" color="#606266" :size="22">
							</u-icon>
							<u-icon v-if="ticketNameShow" name="arrow-up-fill" color="#606266" :size="22">
							</u-icon>
						</view>
					</view>
				</view>
			</view>

			<view class="custom-table" style="margin-bottom: 30rpx" v-for="(item,i) in list"
				:class="{'ticket_color': clickIndex==i}" @click="changInfo(item,i)">
				<view class="d_a w_100" style="flex-direction: row;align-items: stretch;">
					<view class="xuhao">
						<p>序号</p>
						<p>{{ item.sort }}</p>
					</view>
					<view class="uni-grid">
						<view class="uni-row">
							<view class="uni-col" style="border-bottom: none; border-right: none;">
								{{item.attr1_key}}:{{ item.attr1 }}
							</view>
							<view class="uni-col" style="border-bottom: none;">
							   {{item.attr2_key}}:{{ item.attr2 }}
							</view>
						</view>
						<view class="uni-row">
							<view class="uni-col" style="border-bottom: none; border-right: none;">
								  {{item.attr3_key}}:{{ item.attr3 }}
							</view>
							<view class="uni-col" style="border-bottom: none;background-color: yellow;color: blue;">
								产品数量:{{ item.nums }}（{{ item.unit }}）
							</view>
						</view>
						<view class="uni-row">
							<view class="uni-col" style="border-right: none;background-color: yellow;color: blue;">
								产品单价:{{ item.change_price? item.change_price : 0 }}元
								<text
									:class="{'red-text': item.up > 0, 'green-text': item.up < 0, 'black-text': item.up === 0}"
									style="margin-left: 1rem">
									( {{item.up>0 ? '+' : ''}} {{ item.up }}%)
								</text>
							</view>
							<view class="uni-col" style="background-color: yellow;color: blue;">
								合计金额:{{ item.total ? item.total : 0 }}元
							</view>
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
			<picker mode="selector" :range="checkTypeOptions" @change="checkTypeChange">
				<view class="uni-select">
					<text class="blue">{{ check_type || '请选择付款方式' }}</text>
					<u-icon style="margin-left: 10rpx;" name="arrow-down-fill" color="#606266" :size="22">
					</u-icon>
				</view>
			</picker>
		</view>

		<view class="uni-item">
			<text class="uni-label">运输方式</text>
			<picker mode="selector" :range="transTypeOptions" @change="transTypeChange">
				<view class="uni-select">
					<text class="blue">{{ trans_type || '请选择运输方式' }}</text>
					<u-icon style="margin-left: 10rpx;" name="arrow-down-fill" color="#606266" :size="22">
					</u-icon>
				</view>
			</picker>
		</view>

		<view class="uni-item">
			<text class="uni-label">运输费用</text>
			<picker mode="selector" :range="feesOutOptions" @change="feesOutChange">
				<view class="uni-select">
					<text class="blue">{{ fees_out || '请选择运输费用' }}</text>
					<u-icon style="margin-left: 10rpx;" name="arrow-down-fill" color="#606266" :size="22">
					</u-icon>
				</view>
			</picker>
		</view>

		<view class="uni-item">
			<text class="uni-label">包装选项</text>
			<picker mode="selector" :range="packRecyleOptions" @change="packRecyleChange">
				<view class="uni-select">
					<text class="blue">	{{ pack_recyle || '请选择包装费用' }}</text>
					<u-icon style="margin-left: 10rpx;" name="arrow-down-fill" color="#606266" :size="22">
					</u-icon>
				</view>
			</picker>
		</view>

		<view class="uni-item">
			<text class="uni-label">报价单位（选填）</text>
			<input @input="inChange($event,'rep_comp')" v-model="rep_comp"  class="uni-input" placeholder="输入报价单位名称" />
		</view>

		<view class="uni-item">
			<text class="uni-label">询价单位（选填）</text>
			<input @input="inChange($event,'question_comp')" v-model="question_comp" class="uni-input"
				placeholder="输入询价单位名称" />
		</view>
		
		
		<view class="uni-item">
			<text class="uni-label">项目名称（选填）</text>
			<input @input="inChange($event,'project_comp')" v-model="project_comp" class="uni-input"
				placeholder="输入施工项目名称" />
		</view>
		

		<view class="uni-item">
			<text class="uni-label">报价人员（选填)</text>
			<input @input="inChange($event,'rep_user')" v-model="rep_user" class="uni-input" placeholder="请输入报价人姓名" />
		</view>

		<view class="uni-item">
			<text class="uni-label">联系手机（选填）</text>
			<input @input="inChange($event,'rep_phone')" v-model="rep_phone" class="uni-input" placeholder="报价人的联系方式" />
		</view>


		<view class="uni-item">
			<view class="d_a">
				<span>报价备注（选填）</span>
				<view class="moban" @click="goNoteInformation()">快捷模板</view>
			</view>
			<span></span>
		</view>
		<view class="uni-item">
			<textarea @input="inChange($event,'tags')" style="min-height: 150rpx;color: blue;width: 100%;text-align: left;" placeholder="请输入报价单备注信息"
				v-model="tags"></textarea>
		</view>






		<view style="width: 750rpx;height: 350rpx;">

		</view>
		<view class="footerFlex">
			<view class="totals">
				<p>
					<span style="color: blue;">商品总条数：{{ list.length }} </span>
					<span style="margin-left: 120rpx;color: blue;">合计数量：{{count}}</span>
				</p>
				<p style="color: red;">合计总金额：{{ total }}元</p>
				<p style="color: red;">总金额大写:{{ total_n }}</p>
				<p class="c_000">订单税率标识：{{ ticket_name }}</p>
			</view>
			<view class="footer d_a">
				<button @click="apply()">确认无误，生产报价单</button>
				<button @click="clearall()">清空报价单全部商品</button>
			</view>
			<view class="rep_tags rep_tags2 d_a_j" style="text-align:center;">
				<text style="margin-left: 20rpx;">点击单个商品可进行数据修改或调整顺序及删除</text>
			</view>
		</view>










		<u-modal v-model="transBidsModalShow" show-cancel-button title="自定义输入" @confirm="transBidsModalConfirm">
			<view class="slot-content">
				<input style="padding: 30rpx;" placeholder="请输入自定义填写质量标准信息" type="text" v-model="trans_bids_i" />
			</view>
		</u-modal>


		<u-modal v-model="checkTypeModalShow" show-cancel-button title="自定义输入" @confirm="checkTypeModalConfirm">
			<view class="slot-content">
				<input style="padding: 30rpx;"   placeholder="请输入自定义信息" type="text" v-model="check_type_i" />
			</view>
		</u-modal>

		<u-modal v-model="transTypeModalShow" show-cancel-button title="自定义输入" @confirm="transTypeModalConfirm">
			<view class="slot-content">
				<input style="padding: 30rpx;" placeholder="请输入自定义信息" type="text" v-model="trans_type_i" />
			</view>
		</u-modal>

		<u-modal v-model="feesOutModalShow" show-cancel-button title="自定义输入" @confirm="feesOutModalConfirm">
			<view class="slot-content">
				<input style="padding: 30rpx;" placeholder="请输入自定义信息" type="text" v-model="fees_out_i" />
			</view>
		</u-modal>

		<u-modal v-model="packRecyleModalShow" show-cancel-button title="自定义输入" @confirm="packRecyleModalConfirm">
			<view class="slot-content">
				<input style="padding: 30rpx;" placeholder="请输入自定义信息" type="text" v-model="pack_recyle_i" />
			</view>
		</u-modal>



		<u-modal v-model="attr2ModalShow" title="产品型号">
			<view class="slot-content">
				<input style="padding: 30rpx;" placeholder="请输入产品型号" type="text" v-model="chData.attr2" />
			</view>
		</u-modal>

		<u-modal v-model="attr1ModalShow" title="电压等级">
			<view class="slot-content">
				<input style="padding: 30rpx;" placeholder="请输入电压等级" type="text" v-model="chData.attr1" />
			</view>
		</u-modal>





		<u-select v-model="transBidsShow" @confirm="transBidsConfirm" :list="transBidsList"></u-select>
		<u-select v-model="ticketNameShow" @confirm="ticketNameConfirm" :list="ticketNameList"></u-select>

		<uni-popup ref="popup" type="center">
			<view class="mark_body">
				<view class="w_100 d_a_j fw_700 " style="color: #000;font-size: 32rpx;margin-bottom: 20rpx;">
					报价单（单项商品）信息修改器</view>
				<view class="d_a" style="flex-direction: column;width: 80%">
					<!-- <view class="d_a_sb w_100 mt_1">
						<view>
							<span>商品排序：</span>
							<span>{{ chData.sort }}</span>
						</view>
						<view class="ceilNumb" style="padding: 0">
							<u-button type="primary" size="mini" @click="sortRevCeil()">下调</u-button>
							<u-button style="margin-left: 10rpx;" @click="sortAddCeil()" type="error"
								size="mini">上调</u-button>
						</view>
					</view> -->
					<view class="w_100 mt_2 d_a_sb">
						<text>电压等级：{{chData.attr1}}</text>
						<view>
							<u-button @click="attr1ModalShow=true" type="primary" size="mini">点击修改</u-button>
						</view>

					</view>
					<view class="w_100 mt_2 d_a_sb">
						<text>产品型号：{{chData.attr2}}</text>
						<view>
							<u-button @click="attr2ModalShow=true" type="primary" size="mini">点击修改</u-button>
						</view>

					</view>
					<view class="w_100 mt_2 d_a_sb">
						<span>产品数量：{{chData.nums}}<span>{{chData.unit}}</span></span>
						<view class="ceilNumb" style="padding: 0">
							<span @click="cnrCeil(0)">-</span>
							<input type="text" v-model="chData.nums" />
							<span @click="cnrCeil(1)">+</span>
						</view>
					</view>

					<view class="w_100 mt_2 d_a_sb ">
						<view>
							<span class="">产品价格：</span>
							<span
								class="value">{{ (chData.price * (1+ chData.up/100) * chData.ticket_fee *(1+repratio/100)).toFixed(2) }}元</span>
						</view>
						<view class="ceilNumb" style="padding: 0">
							<span @click="priceCeil(0)">-</span>
							<span :class="chData.up>0 ? 'red' : chData.up<0?'green':chData.up==0?'black':''"
								class="value">{{ chData.up }}%</span>
							<span @click="priceCeil(1)">+</span>
						</view>
					</view>


				</view>

				<view class="w_100 d_a_sa" style="margin-top: 40rpx; height: 80rpx">
					<u-button @click="changAttr()" type="primary">确认</u-button>
					<u-button @click="changDels()" type="error">删除</u-button>
					<u-button @click="cancellation()">取消</u-button>
				</view>


			</view>

		</uni-popup>


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
				checkTypeOptions: ['货到付款', '款到发货', '双方协商', '自定义输入'],
				transTypeOptions: ['物流运输', '专车运输', '买方自提', '自定义输入'],
				feesOutOptions: ['买方负责', '卖方负责', '双方协商', '自定义输入'],
				packRecyleOptions: ['报价包含产品包装', '报价不含产品包装', '包装需要退还卖方', '买卖双方协商包装', '自定义输入'],
				// 当前选中的选项索引
				trans_type_i: '',
				trans_bids_i: '',
				check_type_i: '',
				fees_out_i: '',
				pack_recyle_i: '',
				packRecyleModalShow: false,
				attr2ModalShow: false,
				attr1ModalShow: false,


				feesOutModalShow: false,
				transTypeModalShow: false,
				checkTypeModalShow: false,
				transBidsModalShow: false,
				ticketNameShow: false,
				ticketNameList: [{
						value: 0,
						label: '不含发票'
					},
					{
						value: 2,
						label: '含专用发票'
					},
					{
						value: 1,
						label: '含普通发票'
					},
				],
				transBidsList: [{
						value: '国家标准',
						label: '国家标准'
					},
					{
						value: '市场标准',
						label: '市场标准'
					},
					{
						value: '企业标准',
						label: '企业标准'
					},
					{
						value: '自定义填写质量标准信息',
						label: '自定义填写质量标准信息'
					}
				],
				transBidsShow: false,
				uid: '',
				list: '',
				ticket_color: "red",
				ticket_name: "",
				total: '',
				total_n: '',
				ratio: '',
				ticket: '',
				//
				check_type: "",
				trans_bids: "国家标准",
				trans_type: "",
				fees_out: "",
				pack_recyle: "",
				rep_comp: "",
				use_comp: "",
				pro_time: "",
				rep_user: "",
				rep_phone: "",
				repdate: '',
				repratio: 0,
				tags: "",
				//
				chshow: 0,
				chData: '',
				customTicketInfo: '', // 添加这个属性
				sortNumber: 0, //排序的数字
				clickIndex: null, //点击的索引
				question_comp: "",
				project_comp: "",
				logoInfo: {
					img_site: ''
				},
				templateInfo: null,
				logo: null,
				comp_title: null,
				count: 0,
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
			uni.$on("manageTableLogo", data => {
				this.myCallbackFunction(data)
			})

			uni.$on("noteInformation", data => {
				this.myCallbackNoteInformation(data)
			})

		},
		beforeCreate() {
			uni.$off(['manageTableLogo', "noteInformation"]); //页面销毁  移除 监听websocket回复通知  事件
		},
		methods: {
			changDels() {
				let that = this;
				let params = {
					id: that.chData.id,
				};
				that.$api.reportDel(params).then(ret => {
					this.$refs.popup.close()
					that.doIninit();
				})
			},
			changAttr() {
				let that = this;
				var params = {
					ids: that.chData.id,
					nums: that.chData.nums,
					...this.chData,
				};
				that.$api.reportChange(params).then(ret => {
					this.$refs.popup.close()
					that.doIninit();
				})
			},
			sortRevCeil() {
				console.log(111111)
				if (this.chData.sort == 0) {
					return;

				}
				this.chData.sort--;
				let that = this;
				var params = {
					ids: that.chData.id,
					sort: this.chData.sort,
				};
				that.$api.reportChange(params).then(ret => {
					that.doIninit();
				})

			},
			sortAddCeil() {
				console.log(222)
				this.chData.sort++;
				let that = this;
				var params = {
					ids: that.chData.id,
					sort: this.chData.sort,
				};
				that.$api.reportChange(params).then(ret => {
					console.log(ret)
					that.doIninit();
				})

			},
			priceCeil(type) {
				this.chData.up = parseInt(this.chData.up)
				if (type == 1) { //加
					let num = this.chData.up + 1;
					this.chData.up = num > 100 ? 100 : num;
				} else {
					let num = this.chData.up - 1;
					this.chData.up = num >= -100 ? num : 0;
				}
			},
			cnrCeil(type) {
				let that = this;
				let temp = type > 0 ? parseInt(that.chData.nums) + 1 : that.chData.nums - 1;
				let nums = temp < 1 ? 1 : temp;
				that.chData.nums = nums;
			},
			changInfo(e, i) {
				let that = this;
				this.clickIndex = i;
				that.chData = e;
				that.chData.sort = parseInt(e.sort);
				this.$refs.popup.open()
				////
				console.log(e);
			},
			cancellation() {
				this.$refs.popup.close()
				this.doIninit()
			},
			goNoteInformation() {
				uni.navigateTo({
					url: '/pages/report/noteInformation'
				})
			},
			myCallbackFunction(_params) {
				this.logoInfo = _params;
				this.logo = _params.img_site;
				this.comp_title = _params.title;

				this.reportNewChange({
					logo: _params.img
				})
				this.reportNewChange({
					comp_title: _params.title
				})
				console.log(_params)
			},
			myCallbackNoteInformation(_params) {
				this.templateInfo = _params;
				this.tags = _params.title;
				this.reportNewChange({
					tags: this.tags
				})
			},
			clearall() {
				let that = this;
				var params = {
					uid: that.uid
				};
				uni.showModal({
					title: '提示',
					content: '确定要清空报价单的全部内容',
					success: (res) => {
						if (res.confirm) {
							that.$api.clearall(params).then(ret => {
								that.doIninit();
							})
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			apply() {
				uni.showModal({
					title: '提示',
					content: '是否生成报价单内容？',
					success: (res) => {
						if (res.confirm) {
							let that = this;
							var params = {
								uid: that.uid,
								trans_bids: that.trans_bids,
								ratio: that.repratio,
								ticket: that.ticket,
								ticket_fee: that.ratio,
								check_type: that.check_type,
								trans_type: that.trans_type,
								fees_out: that.fees_out,
								pack_recyle: that.pack_recyle,
								rep_comp: that.rep_comp,
								use_comp: that.use_comp,
								pro_time: that.pro_time,
								rep_user: that.rep_user,
								rep_phone: that.rep_phone,
								rep_date: that.repdate,
								tags: that.tags,
								count: that.count,
								money: that.total,
								question_comp: that.question_comp,
								project_comp: that.project_comp,
							};
							if (that.trans_bids.length < 1) {
								uni.showToast({
									icon: 'none',
									title: "请选择质量标准"
								})
								return false;
							}

							that.$api.lists_add(params).then(ret => {
								this.innerAudioContext = uni.createInnerAudioContext();
								this.innerAudioContext.src = "/static/voice/report.mp3"; // 设置音频资源的地址
								this.innerAudioContext.play(); // 播放音频
								uni.navigateTo({
									url: '/pages/report/repindex'
								})
							})
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			inChange(e, key) {
				console.log(e.detail.value, key)
				this.reportNewChange({
					[key]: e.detail.value
				})
			},
			//
			packRecyleChange(e) {
				if (e.detail.value == 4) {
					this.packRecyleModalShow = true
				} else {
					this.pack_recyle = this.packRecyleOptions[e.detail.value]
					this.bjChange(this.fees_out, "pack_recyle")
				}
			},
			feesOutChange(e) {
				if (e.detail.value == 3) {
					this.feesOutModalShow = true
				} else {
					this.fees_out = this.feesOutOptions[e.detail.value]
					this.bjChange(this.fees_out, "fees_out")
				}
			},
			transTypeChange(e) {
				if (e.detail.value == 3) {
					this.transTypeModalShow = true
				} else {
					this.trans_type = this.transTypeOptions[e.detail.value]
					this.bjChange(this.trans_type, "trans_type")
				}
			},
			checkTypeChange(e) {
				if (e.detail.value == 3) {
					this.checkTypeModalShow = true
				} else {
					this.check_type = this.checkTypeOptions[e.detail.value]
					this.bjChange(this.check_type, "check_type")
				}
			},
			packRecyleModalConfirm(e) {
				this.pack_recyle = this.pack_recyle_i
				this.bjChange(this.pack_recyle, "pack_recyle")

			},
			feesOutModalConfirm(e) {
				this.fees_out = this.fees_out_i
				this.bjChange(this.fees_out, "fees_out")
			},
			transTypeModalConfirm(e) {
				this.trans_type = this.trans_type_i

				this.bjChange(this.trans_type, "trans_type")
			},
			checkTypeModalConfirm(e) {
				this.check_type = this.check_type_i
				this.bjChange(this.check_type, "check_type")
			},
			transBidsModalConfirm(e) {
				this.trans_bids = this.trans_bids_i
				this.bjChange(this.trans_bids_i, "trans_bids")
			},
			bjChange(e, key) {
				this.reportNewChange({
					[key]: e
				})
				console.log(e, key)
			},
			ticketNameConfirm(e) {
				this.ticket_name = e[0].label
				this.ticket=e[0].value
				this.$api.changeTicket({uid:this.uid,ticket:this.ticket}).then(res => {
				  this.doIninit()
				}).catch(err => {
							
				});
			},
			
			
			
			
			transBidsConfirm(e) {
				if (e[0].value == "自定义填写质量标准信息") {
					this.transBidsModalShow = true
				} else {
					this.trans_bids = e[0].value

					this.bjChange(e[0].value, "trans_bids")
				}
				console.log(e[0].value)

			},
			chaLogo() {
				this.logoInfo.img_site = '';
				this.reportNewChange({
					logo: null
				})
			},

			revCeil() {
				let num = this.repratio - 1;
				this.repratio = num >= -100 ? num : 0;
				this.reportNewChange({
					ratio: this.repratio
				})
				setTimeout(()=>{
					this.doIninit();
				},200)
				
			},
			addCeil() {
				let num = this.repratio + 1;
				this.repratio = num >= 100 ? 100 : num;
				this.reportNewChange({
					ratio: this.repratio
				})
				
				setTimeout(()=>{
					this.doIninit();
				},200)
			},
			goManageTableLogo() {
				uni.navigateTo({
					url: '/pages/report/manageTableLogo'
				})
			},
			reportNewChange(data) {
				this.$api.ReportNewChange({
					uid: this.uid,
					...data
				})
			},
			doIninit() {
				let that = this;
				var params = {
					uid: that.uid,
					ratio: that.repratio
				};
				that.$api.ReportNewList(params).then(ret => {
					that.list = ret.data.list;
					console.log("11111111")
					this.count = 0
					this.list.forEach((item, index) => {
						this.count += parseInt(item.nums)
					})

					that.total = ret.data.total;
					that.total_n = ret.data.total_n;
					that.ratio = ret.data.ratio;
					that.ticket = ret.data.ticket;

					if (ret.data.report_temp) {
						this.logoInfo.img_site = ret.data.report_temp.logo;
						that.check_type = ret.data.report_temp.check_type;
						that.trans_type = ret.data.report_temp.trans_type;
						that.fees_out = ret.data.report_temp.fees_out;
						that.pack_recyle = ret.data.report_temp.pack_recyle;
						that.rep_comp = ret.data.report_temp.rep_comp;
						that.use_comp = ret.data.report_temp.use_comp;

						that.pro_time = ret.data.report_temp.pro_time;
						that.rep_user = ret.data.report_temp.rep_user;
						that.rep_phone = ret.data.report_temp.rep_phone;
						that.tags = ret.data.report_temp?.tags;
						that.question_comp = ret.data.report_temp.question_comp;
						that.project_comp = ret.data.report_temp.project_comp;
						that.logo = ret.data.report_temp.logo;
						that.comp_title = ret.data.report_temp.comp_title;

						this.trans_bids = ret.data.report_temp.trans_bids
						that.ticket = ret.data.report_temp.ticket;
						
						that.repratio = parseInt(ret.data.report_temp.ratio);

					}else {
						this.logoInfo.img_site='';
						that.check_type = '';
						that.trans_type = '';
						that.fees_out = '';
						that.pack_recyle = '';
						that.rep_comp = '';
						that.use_comp = '';
						
						that.pro_time = '';
						that.rep_user = '';
						that.rep_phone = '';
						that.tags = '';
						that.question_comp = '';
						that.project_comp = '';
						that.logo = '';
						that.comp_title = '';
						this.trans_bids = '';
						that.ticket = '';
						that.repratio=ret.data.ratio?ret.data.ratio:0
					}
					if (that.repratio == 0) {
						that.repratio = parseInt(ret.data.report_temp.ratio);
					}

					//
					if (that.ticket == 0) {
						that.ticket_color = "red";
						that.ticket_name = "不含发票";
					}
					if (that.ticket == 1) {
						that.ticket_color = "blue";
						that.ticket_name = "含普通发票";
					}
					if (that.ticket == 2) {
						that.ticket_color = "black";
						that.ticket_name = "含专用发票";
					}
					////
				}).catch(err => {

				});
			}
		}
	}
</script>

<style scoped lang="scss">
	.green {
		color: green !important;
	}

	.red {
		color: red !important;
	}

	.blue {
		color: blue !important;
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
		font-size: 28rpx;
		
	}
	.placeholder{
		color: #a5a5a5;
		font-size: 28rpx;
	}

	.uni-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 10rpx 20rpx;
		color: #000000;
		border-bottom: 1px solid #eee;
	}
	.moban{
		
		height: 35rpx;
		padding-left: 10rpx;
		padding-right: 10rpx;
		background-color: #1677ff;
		color: #ffffff;
		text-align: center;
		line-height: 35rpx;
		border-radius: 10rpx;
		font-size: 22rpx;
		
	}
	.xzLogo{
		height: 45rpx;
		padding-left: 20rpx;
		padding-right: 20rpx;
		background-color: #1677ff;
		color: #ffffff;
		text-align: center;
		border-radius: 10rpx;
		line-height: 45rpx;
		font-size: 22rpx;
	}

	.uni-label {
		flex: 1;
		
	}

	.uni-select {
		border-radius: 5px;
		padding: 10rpx;
		text-align: right;
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
		padding: 1rem 24rpx 1rem 56rpx;
	}

	.ceilNumb span {
		background: white;
		border: 1px solid #e5e5e5;
		color: #333333;
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
		padding: 8rpx 8rpx 20rpx 20rpx;
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