<template>
	<view class="container">
		<view class="item" style="justify-content: space-between;">
			<text>*纳税类别</text>
			<picker mode="selector" :range="taxTypes" @change="onTaxTypeChange">
				<view class="d_a">
					<view>{{selectedTaxType|| '请选择'}}</view>
					<u-icon style="margin-left: 20rpx;" name="arrow-down-fill" color="#606266" :size="22">
					</u-icon>
				</view>
			</picker>
		</view>
		<view class="item" style="justify-content: space-between;">
			<text>*发票类型</text>
			<picker mode="selector" :range="invoiceTypes" @change="onInvoiceTypeChange">
				<view class="d_a">
					<view>{{selectedInvoiceType|| '请选择'}}</view>
					<u-icon style="margin-left: 20rpx;" name="arrow-down-fill" color="#606266" :size="22">
					</u-icon>
				</view>

			</picker>
		</view>
		<view class="item">
			<text class="text" style="width: 150rpx;">*公司名称</text>
			<input type="text"  style="text-align: right;" placeholder-style="color:blue" placeholder="请输入公司名称" v-model="comp_name" />
		</view>
		<view class="item">
			<text class="text" style="width: 150rpx;">*信用代码</text>
			<input type="text"  style="text-align: right;" placeholder-style="color:blue" placeholder="请输入信用代码" v-model="comp_tex" />
		</view>
		<view class="item">
			<text class="text" style="width: 150rpx;">*公司地址</text>
			<input type="text" style="text-align: right;"  placeholder-style="color:blue" placeholder="请输入公司地址" v-model="comp_addr" />
		</view>
		<view class="item">
			<text class="text" style="width: 150rpx;">*联系电话</text>
			<input type="text"  style="text-align: right;" placeholder-style="color:blue" placeholder="请输入联系电话" v-model="comp_tele" />
		</view>
		<view class="item">
			<text class="text" style="width: 150rpx;">*开户银行</text>
			<input type="text" style="text-align: right;" placeholder-style="color:blue" placeholder="请输入开户银行" v-model="comp_bank" />
		</view>
		<view class="item"> 
			<text class="text" style="width: 150rpx;">*银行账户</text>
			<input type="text" style="text-align: right;"  placeholder-style="color:blue" placeholder="请输入银行账户" v-model="bank_id" />
		</view>
		<view class="item">
			<text class="text" style="width: 150rpx;">开户行号</text>
			<input type="text" style="text-align: right;" placeholder-style="color:blue" placeholder="请输入开户行号" v-model="bank_sn" />
		</view>

		<view class="comfirm" @click="apply()">
			确认无误，提交上传
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				taxTypes: ['小规模纳税人', '一般纳税人'],
				invoiceTypes: ['增值税普通发票', '增值税专用发票'],
				selectedTaxType: '请选择',
				selectedInvoiceType: '请选择',
				comp_name: '',
				comp_tex:'',
				
				comp_addr: '',
				comp_tele: '',
				
				comp_bank: '',
				bank_id: '',
				bank_sn: '',
				tex_type:'',
				ticket_type:'',
				uid:'',
				tid:'',
			};
		},
		onLoad(option) {
			this.tid=option.id?option.id:''
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
			    var params = { uid: that.uid, tid: that.tid };
			    that.$api.ticket_info(params).then(ret => {
			      that.info = ret.data;
			      ////////
			      that.tex_type = ret.data.tex_type;
			      that.ticket_type = ret.data.ticket_type;
			      that.comp_name = ret.data.comp_name;
			      that.comp_tex = ret.data.comp_tex;
			      that.comp_addr = ret.data.comp_addr;
			      that.comp_tele = ret.data.comp_tele;
			      that.comp_bank = ret.data.comp_bank;
			      that.bank_id = ret.data.bank_id;
			      that.bank_sn = ret.data.bank_sn;
			      //that.pic_id = ret.data.pic_id;
			      //that.pic_bank = ret.data.pic_bank;
				  
				  
				  this.selectedTaxType=this.taxTypes[Number(that.tex_type)-1]
				  
				  this.selectedInvoiceType=this.invoiceTypes[Number(this.ticket_type)-1]
				  
			      ////////
			    }).catch(err => {
			      console.log(err.status);
			      console.log(err.error);
			      console.log(err.headers);
			    });
			  },
			
			onTaxTypeChange(e) {
				this.tex_type = e.detail.value+1;
				this.selectedTaxType=this.taxTypes[e.detail.value];
			},
			onInvoiceTypeChange(e) {
				this.ticket_type = e.detail.value+1;
				this.selectedInvoiceType = this.invoiceTypes[e.detail.value];
			},
			apply() {
			    let that = this;
			    var param = {
			      uid: that.uid,
			      tex_type: that.tex_type,
			      ticket_type: that.ticket_type,
			      comp_name: that.comp_name,
			      comp_tex: that.comp_tex,
			      comp_addr: that.comp_addr,
			      comp_tele: that.comp_tele,
			      comp_bank: that.comp_bank,
			      bank_id: that.bank_id,
			      bank_sn: that.bank_sn,
			      //pic_id: that.pic_id,
			      //pic_bank: that.pic_bank,
			    };
			    console.log(param);
				uni.showLoading({
					title:"添加中..."
				})
			    that.$api.ticket_addon( param).then(ret => {
					uni.hideLoading()
			      uni.navigateBack()
			    }).catch(err => {
			      uni.hideLoading()
			    });
			  }
		}
	};
</script>

<style scoped>
	.container {
		display: flex;
		flex-direction: column;
	}

	.comfirm {
		background: #c20f22;
		color: white;
		display: block;
		font-size: 36rpx;
		height: 88rpx;
		line-height: 88rpx;
		text-align: center;
		position: fixed;
		bottom: 0;
		width: 100%;
	}

	.item {
		display: flex;
		padding: 30rpx;
		width: 750rpx;
		align-items: center;
		border-bottom: 1rpx solid #e1e1e1;
		justify-content: space-between;

		input {
			margin-right: 0rpx;
			text-align: right;
			color: blue;
		}
	}
</style>