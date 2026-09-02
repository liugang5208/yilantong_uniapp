<template>
	<view class="edit-container">
		<!-- 自定义导航栏：右上角已精简，不再显示多余文字 -->
		<u-navbar :is-back="false" title="" :background="{ background: '#ffffff' }" :border-bottom="false">
			<view class="d_a_sb" style="width: 750rpx;">
				<view style="width: 200rpx;padding-left: 30rpx;" @click="back">
					<u-icon name="nav-back" color="#333333" :size="40"></u-icon>
				</view>
				<view style="font-size: 32rpx; color: #1a1a1a; font-weight: 600; text-align: center; flex-grow: 1;">修改收货地址</view>
				<view style="width: 200rpx;"></view>
			</view>
		</u-navbar>

		<!-- 表单卡片区域 -->
		<view class="form-card">
			<!-- 收货姓名 -->
			<view class="form-item">
				<text class="uni-label">收货人</text>
				<input v-model="name" class="uni-input" placeholder="请填写收货人姓名" placeholder-style="color: #c0c4cc;" />
			</view>

			<!-- 手机号码 -->
			<view class="form-item">
				<text class="uni-label">手机号码</text>
				<input v-model="phone" type="number" maxlength="11" class="uni-input" placeholder="请填写手机号码" placeholder-style="color: #c0c4cc;" />
			</view>

			<!-- 选择省市区 -->
			<view class="form-item" @click="showPicker = true">
				<text class="uni-label">所在地区</text>
				<view class="picker-display">
					<text v-if="prov && prov != 0" class="selected-text">{{prov}} {{city}} {{label}}</text>
					<text v-else class="placeholder-text">省、市、区县</text>
					<u-icon name="arrow-right" color="#c0c4cc" size="28"></u-icon>
				</view>
			</view>

			<!-- 详细地址（街道、镇、村、门牌号手动输入） -->
			<view class="form-item textarea-item">
				<text class="uni-label">详细地址</text>
				<textarea v-model="street" class="uni-textarea" placeholder="请输入街道、乡镇、村、门牌号等信息" placeholder-style="color: #c0c4cc;" auto-height />
			</view>

			<!-- 设为默认地址 -->
			<view class="form-item switch-item">
				<text class="uni-label">设为默认收货地址</text>
				<u-switch v-model="isDefault" active-color="#2979ff"></u-switch>
			</view>
		</view>

		<!-- 底部大按钮 -->
		<view class="footer-btn-box">
			<button class="save-btn" @click="apply">保存并使用</button>
		</view>

		<!-- 省市区选择弹窗 -->
		<u-picker mode="region" @confirm="confirmRegion" v-model="showPicker" :params="params"></u-picker>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				params: {
					province: true,
					city: true,
					area: true
				},
				showPicker: false,
				isDefault: false,

				uid: '',
				name: "",
				phone: "",
				prov: "",
				city: "",
				label: "",
				street: "",
				addr_id: '',
			}
		},
		onLoad(option) {
			this.addr_id = option.ids ? option.ids : '';
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
						}
					}
				});
			} else {
				this.uid = userInfo.id
				this.doIninit()
			}
		},
		methods: {
			confirmRegion(e) {
				this.prov = e.province.label;
				this.city = e.city.label;
				this.label = e.area.label;
			},
			apply() {
				let that = this;
				if (!that.name) { uni.showToast({ title: '请填写收货人', icon: 'none' }); return; }
				if (!that.phone) { uni.showToast({ title: '请填写手机号', icon: 'none' }); return; }
				if (!that.prov) { uni.showToast({ title: '请选择所在地区', icon: 'none' }); return; }
				if (!that.street) { uni.showToast({ title: '请填写详细地址', icon: 'none' }); return; }

				let param = {
					ids: that.addr_id,
					uid: that.uid,
					prov: that.prov,
					city: that.city,
					label: that.label,
					name: that.name,
					phone: that.phone,
					street: that.street,
					def: that.isDefault ? 1 : 0,
				};
				
				uni.showLoading({ title: "保存中..." })
				that.$api.uaddr_edits(param).then(ret => {
					uni.hideLoading()
					uni.navigateBack()
					uni.$emit("adedit")
				}).catch(err => {
					uni.hideLoading()
				});
			},
			back() {
				uni.navigateBack()
			},
			doIninit() {
				let that = this;
				let params = { addrid: that.addr_id };
				that.$api.uaddr_info(params).then(ret => {
					if (ret.data && ret.data.info) {
						let info = ret.data.info;
						that.name = info.name;
						that.phone = info.phone;
						that.prov = info.prov;
						that.city = info.city;
						that.label = info.label;
						that.street = info.street;
						that.isDefault = info.def > 0 ? true : false;
					}
				}).catch(err => {});
			}
		}
	}
</script>

<style scoped lang="scss">
	.edit-container {
		background-color: #f4f6f9;
		min-height: 100vh;
		padding: 24rpx;
	}

	.form-card {
		background: #ffffff;
		border-radius: 20rpx;
		padding: 0 32rpx;
		box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.03);
	}

	.form-item {
		display: flex;
		align-items: center;
		padding: 32rpx 0;
		border-bottom: 1px solid #f2f3f5;

		&:last-child {
			border-bottom: none;
		}

		.uni-label {
			width: 180rpx;
			font-size: 28rpx;
			color: #333333;
			font-weight: 500;
		}

		.uni-input {
			flex: 1;
			font-size: 28rpx;
			color: #1a1a1a;
		}
		
		.uni-textarea {
			flex: 1;
			font-size: 28rpx;
			color: #1a1a1a;
			min-height: 80rpx;
			padding-top: 6rpx;
		}
	}

	.picker-display {
		flex: 1;
		display: flex;
		justify-content: space-between;
		align-items: center;

		.selected-text {
			font-size: 28rpx;
			color: #1a1a1a;
		}

		.placeholder-text {
			font-size: 28rpx;
			color: #c0c4cc;
		}
	}

	.switch-item {
		justify-content: space-between;
		
		.uni-label {
			width: auto;
		}
	}

	.footer-btn-box {
		margin-top: 60rpx;
		padding: 0 20rpx;

		.save-btn {
			background: #2979ff;
			color: #ffffff;
			font-size: 32rpx;
			font-weight: 600;
			height: 88rpx;
			line-height: 88rpx;
			border-radius: 44rpx;
			box-shadow: 0 8rpx 20rpx rgba(41, 121, 255, 0.3);
			border: none;
			
			&:active {
				opacity: 0.9;
			}
		}
	}
</style>
```[cite: 4]