<template>
	<view>
		<u-navbar :is-back="false" title="">
			<view class="d_a_sb " style="width: 750rpx;">
				<view style="width: 200rpx;padding-left: 30rpx;" @click="back">
					<u-icon name="nav-back" color="#606266" :size="44">
					</u-icon>
				</view>
				<view style="font-size: 30rpx; color: #000; font-weight: bold; text-align: center; flex-grow: 1;">添加收货地址
				</view>
				<view style="width: 200rpx;padding-right: 30rpx; color: #488aff; text-align: right;" @click="apply">保存
				</view>
			</view>
		</u-navbar>

		<view class="uni-list">
			<!-- 收货姓名 -->
			<view class="uni-item">
				<text class="uni-label">*收货姓名</text>
				<input v-model="name" class="uni-input" />
			</view>

			<!-- 手机号码 -->
			<view class="uni-item">
				<text class="uni-label">*手机号码</text>
				<input v-model="phone" type="number" class="uni-input" />
			</view>

			<!-- 选择地区 -->
			<view class="uni-item">
				<text class="uni-label">*选择地区</text>
				<!-- <view class="" @click="show=true">
					<text v-if="prov">{{prov}}-{{city}}-{{label}}</text>
					<text v-else>请选择</text>
				</view> -->
				<uni-data-picker placeholder="选择地区" popup-title="请选择所在地区" :localdata="dataTree" v-model="classes"
					@change="onchange" @nodeclick="onnodeclick" @popupopened="onpopupopened"
					@popupclosed="onpopupclosed">
				</uni-data-picker>
			</view>

			<!-- 街道详情 -->
			<view class="uni-item">
				<text class="uni-label">*街道详情</text>
				<input v-model="street" class="uni-input" />
			</view>

			<!-- 设为默认地址 -->
			<view class="uni-item">
				<text class="uni-label">设为默认地址</text>
				<u-switch v-model="isDefault"></u-switch>
			</view>
		</view>

		<u-picker mode="region" @confirm="confirm" v-model="show" :params="params"></u-picker>



	</view>
</template>

<script>
	export default {
		data() {
			return {

				classes: '',
				dataTree:uni.getStorageSync("address") || [],
				params: {
					province: true,
					city: true,
					area: true
				},
				show: false,
				regionRange: [], // 地区选择器的范围数组
				selectedRegion: ['', '', ''], // 已选择的地区
				isDefault: false, // 是否设为默认地址

				uid: '',
				name: "",
				phone: "",
				//////
				prov: 0,
				prov_list: '',
				city: 0,
				city_list: '',
				label: 0,
				label_list: '',
				////
				street: "",
				def: 0,
			}
		},
		onLoad(option) {
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
				this.regionAll()
			}
			
		},
		methods: {
			regionAll(){
				this.$api.regionAll().then(res=>{
					this.dataTree=res.data
					uni.setStorageSync("address",res.data)
				})
			},
			onnodeclick(e) {
				console.log(e);
			},
			onpopupopened(e) {
				console.log('popupopened');
			},
			onpopupclosed(e) {
				console.log('popupclosed');
			},
			onchange(e) {
				console.log('onchange:', e);
				
				this.prov = e.detail.value[0].value
				this.city =e.detail.value[1].value
				this.label = e.detail.value[2].value
				
			},
			apply() {
				let that = this;
				var param = {
					uid: that.uid,
					prov: that.prov,
					city: that.city,
					label: that.label,
					name: that.name,
					phone: that.phone,
					street: that.street,
					def: that.isDefault ? 1 : 0,
				};
				uni.showLoading({
					title: "添加中..."
				})
				/***************/
				that.$api.addr_addon(param).then(ret => {
					uni.navigateBack()
					uni.$emit("adadds")
					uni.hideLoading()
				}).catch(err => {
					uni.hideLoading()
				});
			},
			back() {
				uni.navigateBack()
			},
			confirm(e) {
				this.prov = e.province.label
				this.city = e.city.label
				this.label = e.area.label
				console.log(e);
			}
		}
	}
</script>

<style scoped lang="scss">
	.uni-list {
		margin: 0;
		padding: 0;
	}

	.uni-item {
		display: flex;
		align-items: center;
		padding: 10px;
		border-bottom: 1px solid #eee;
	}

	.uni-label {
		flex: 1;
	}

	.uni-input,
	.uni-select {
		flex: 2;
		padding: 5px;
		border-radius: 5px;
	}

	.uni-switch {
		margin-left: auto;
	}
</style>