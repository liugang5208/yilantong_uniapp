<template>
	<view class="wrap">
		<!-- 自定义导航栏 -->
		<u-navbar :is-back="false" title="" :background="{ background: '#ffffff' }" :border-bottom="false">
			<view class="nav-bar-content">
				<view class="nav-back-icon" @click="back">
					<u-icon name="arrow-left" color="#333333" :size="36"></u-icon>
				</view>
				<view class="nav-title">编辑账号资料</view>
				<view style="width: 80rpx;"></view>
			</view>
		</u-navbar>

		<!-- 表单主体区域 -->
		<view class="form-container">
			<u-form :model="form" ref="uForm" label-width="160">
				
				<!-- 1. 登录账号 -->
				<u-form-item label="登录账号" :border-bottom="true">
					<u-input disabled v-model="infos.phone" input-align="right" placeholder="获取中..." />
				</u-form-item>

				<!-- 2. 注册日期（只读展示） -->
				<u-form-item label="注册日期" :border-bottom="true">
					<text class="readonly-text">{{ infos.formatted_time || '-' }}</text>
				</u-form-item>

				<!-- 3. 会员级别 + 签约状态 -->
				<u-form-item label="会员级别" :border-bottom="true">
					<view class="status-capsule-group">
						<text class="capsule-tag level-tag" v-if="infos.ac_level_name">{{ infos.ac_level_name }}</text>
						<text :class="['capsule-tag', (infos.ac_credit > 0 || infos.apply_check > 0) ? 'signed-tag' : 'unsigned-tag']">
							{{ (infos.ac_credit > 0 || infos.apply_check > 0) ? '已签约' : '未签约' }}
						</text>
					</view>
				</u-form-item>

				<!-- 4. 账号类型选择 -->
				<u-form-item label="账号类型" :required="true" :border-bottom="true">
					<view class="type-selector">
						<text :class="['type-btn', form.accountType === 'enterprise' ? 'active-enterprise' : 'inactive-btn']" @click="selectAccountType('enterprise')">企业单位</text>
						<text :class="['type-btn', form.accountType === 'personal' ? 'active-personal' : 'inactive-btn']" @click="selectAccountType('personal')">个人用户</text>
					</view>
				</u-form-item>

				<!-- 5. 单位名称/用户姓名 -->
				<u-form-item :label="form.accountType === 'enterprise' ? '单位名称' : '用户姓名'" :required="true" :border-bottom="true">
					<u-input 
						v-model="form.nickname" 
						input-align="right" 
						:custom-style="{ color: '#333333' }"
						@input="isNicknameModified = true"
						:placeholder="form.accountType === 'enterprise' ? '请输入单位名称' : '请输入用户姓名'" 
					/>
				</u-form-item>

				<!-- 6. 所在地址 -->
				<u-form-item label="所在地址" :required="true" :border-bottom="true">
					<view class="region-select-box" @click="showRegionPicker = true">
						<text :class="['region-text', form.street ? (isStreetModified ? 'has-val-modified' : 'has-val-original') : 'placeholder-val']">
							{{ form.street || '请选择省/市/县（区）' }}
						</text>
						<u-icon name="arrow-right" color="#c0c4cc" :size="28"></u-icon>
					</view>
				</u-form-item>

				<!-- 7. 证件号码 -->
				<u-form-item :label="form.accountType === 'enterprise' ? '营业执照号' : '身份证号'" :border-bottom="true">
					<u-input v-model="form.idCardOrLicence" input-align="right" :placeholder="form.accountType === 'enterprise' ? '请输入营业执照号（选填）' : '请输入身份证号（选填）'" />
				</u-form-item>

				<!-- 8. 其他选填 -->
				<u-form-item label="联系电话" :border-bottom="true">
					<u-input v-model="form.contactPhone" input-align="right" placeholder="请输入其他联系电话（选填）" type="number" />
				</u-form-item>
				<u-form-item label="微信账号" :border-bottom="true">
					<u-input v-model="form.wechat" input-align="right" placeholder="请输入微信号（选填）" />
				</u-form-item>
				<u-form-item label="电子邮箱" :border-bottom="false">
					<u-input v-model="form.email" input-align="right" placeholder="请输入电子邮箱（选填）" />
				</u-form-item>
			</u-form>
		</view>

		<!-- 9. 证件照上传区域 -->
		<view class="upload-card">
			<view class="upload_title">
				<text class="title-text">
					{{ form.accountType === 'enterprise' ? '请上传营业执照和负责人证件照' : '请上传身份证正反面' }}
				</text>
			</view>
			<view class="upload-sub-tip">并非强制项，有需要可上传（点击图片可直接重新选择更换）</view>
			
			<template v-if="form.accountType === 'enterprise'">
				<view class="upload_file">
					<view class="upload_file_item">
						<view class="upload_box has-image-box" v-if="isValidImage(form.pic_id)" @click="chooseImage('pic_id')">
							<image mode="aspectFill" :src="form.pic_id" class="imgs" />
						</view>
						<view class="upload_box empty-box" v-else @click="chooseImage('pic_id')">
							<u-icon name="plus" color="#909399" :size="32"></u-icon>
							<text class="main-tip">上传营业执照</text>
						</view>
					</view>
					<view class="upload_file_item">
						<view class="upload_box has-image-box" v-if="isValidImage(form.pic_back)" @click="chooseImage('pic_back')">
							<image mode="aspectFill" :src="form.pic_back" class="imgs" />
						</view>
						<view class="upload_box empty-box" v-else @click="chooseImage('pic_back')">
							<u-icon name="plus" color="#909399" :size="32"></u-icon>
							<text class="main-tip">负责人证件照</text>
						</view>
					</view>
				</view>
			</template>

			<template v-else>
				<view class="upload_file">
					<view class="upload_file_item">
						<view class="upload_box has-image-box" v-if="isValidImage(form.pic_id)" @click="chooseImage('pic_id')">
							<image mode="aspectFill" :src="form.pic_id" class="imgs" />
						</view>
						<view class="upload_box empty-box" v-else @click="chooseImage('pic_id')">
							<u-icon name="plus" color="#909399" :size="32"></u-icon>
							<text class="main-tip">身份证正面</text>
						</view>
					</view>
					<view class="upload_file_item">
						<view class="upload_box has-image-box" v-if="isValidImage(form.pic_back)" @click="chooseImage('pic_back')">
							<image mode="aspectFill" :src="form.pic_back" class="imgs" />
						</view>
						<view class="upload_box empty-box" v-else @click="chooseImage('pic_back')">
							<u-icon name="plus" color="#909399" :size="32"></u-icon>
							<text class="main-tip">身份证反面</text>
						</view>
					</view>
				</view>
			</template>
		</view>

		<!-- 底部防遮挡 -->
		<view style="width: 100%; height: 160rpx;"></view>

		<!-- 底部保存按钮 -->
		<view class="footer-bar">
			<view class="save-btn" @click="saveUserInfo">保存修改</view>
		</view>

		<!-- 省市区选择组件 -->
		<u-picker v-model="showRegionPicker" mode="region" @confirm="onRegionConfirm"></u-picker>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				uid: '',
				infos: {},
				showRegionPicker: false,
				isNicknameModified: false,
				isStreetModified: false,
				form: {
					accountType: 'enterprise',
					nickname: '',
					street: '',
					idCardOrLicence: '',
					contactPhone: '',
					wechat: '',
					email: '',
					pic_id: '',
					pic_back: '',
				}
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
						}
					}
				});
			} else {
				this.uid = userInfo.id;
				this.doIninit();
			}
		},
		methods: {
			back() {
				uni.navigateBack();
			},
			selectAccountType(type) {
				this.form.accountType = type;
			},
			onRegionConfirm(e) {
				let province = e.province ? e.province.label : (e.provinceName || '');
				let city = e.city ? e.city.label : (e.cityName || '');
				let area = e.area ? e.area.label : (e.areaName || '');
				this.form.street = `${province}-${city}-${area}`;
				this.isStreetModified = true;
			},
			isValidImage(url) {
				if (!url) return false;
				let str = String(url).trim().toLowerCase();
				if (str === '' || str === 'null' || str === 'undefined' || str === 'nil') {
					return false;
				}
				return true;
			},
			chooseImage(field) {
				let that = this;
				uni.chooseImage({
					count: 1,
					sizeType: ['compressed'],
					success: (res) => {
						that.form[field] = res.tempFilePaths[0];
					}
				});
			},
			doIninit() {
				let that = this;
				let params = {
					uid: that.uid,
					new: 1
				};
				this.$api.Users(params).then(ret => {
					let data = ret.data || {};
					that.infos = data;
					
					let rawTime = data.create_time || data.reg_time || data.times;
					if (rawTime && !isNaN(rawTime)) {
						let dateObj = new Date(Number(rawTime) * 1000);
						let year = dateObj.getFullYear();
						let month = String(dateObj.getMonth() + 1).padStart(2, '0');
						let day = String(dateObj.getDate()).padStart(2, '0');
						that.$set(that.infos, 'formatted_time', `${year}-${month}-${day}`);
					} else {
						that.$set(that.infos, 'formatted_time', rawTime || '-');
					}

					that.form.nickname = data.name || data.nickname || data.company_name || data.company || '';
					that.isNicknameModified = false;

					if (data.street) {
						that.form.street = data.street;
					} else if (data.address) {
						that.form.street = data.address;
					} else if (data.prov_name || data.city_name || data.label_name) {
						let p = data.prov_name || '';
						let c = data.city_name || '';
						let l = data.label_name || '';
						that.form.street = [p, c, l].filter(Boolean).join('·');
					} else {
						that.form.street = '';
					}
					that.isStreetModified = false;
					
					if (data.accountType) {
						that.form.accountType = data.accountType;
					} else {
						that.form.accountType = 'enterprise';
					}

					that.form.idCardOrLicence = data.idCardOrLicence || data.licence || data.card_id || '';
					that.form.contactPhone = data.contactPhone || data.phone2 || '';
					that.form.wechat = data.wechat || '';
					that.form.email = data.email || '';
					that.form.pic_id = that.isValidImage(data.pic_id) ? data.pic_id : '';
					that.form.pic_back = that.isValidImage(data.pic_back) ? data.pic_back : '';
				}).catch(err => {
					console.log(err);
				});
			},
			saveUserInfo() {
				let that = this;
				
				if (!that.form.accountType) {
					uni.showToast({ title: '请选择账号类型', icon: 'none', duration: 2500 });
					return;
				}
				if (!that.form.nickname.trim()) {
					let msg = that.form.accountType === 'enterprise' ? '请输入单位名称' : '请输入用户姓名';
					uni.showToast({ title: msg, icon: 'none', duration: 2500 });
					return;
				}
				if (!that.form.street.trim()) {
					uni.showToast({ title: '请选择所在地址', icon: 'none', duration: 2500 });
					return;
				}

				let params = {
					uid: that.uid,
					nickname: that.form.nickname,
					street: that.form.street,
					accountType: that.form.accountType,
					idCardOrLicence: that.form.idCardOrLicence,
					contactPhone: that.form.contactPhone,
					wechat: that.form.wechat,
					email: that.form.email,
					pic_id: that.isValidImage(that.form.pic_id) ? that.form.pic_id : '',
					pic_back: that.isValidImage(that.form.pic_back) ? that.form.pic_back : ''
				};

				this.$api.updates(params).then(ret => {
					uni.showToast({
						title: '信息更新成功',
						icon: 'success',
						duration: 2000,
						success: () => {
							uni.$emit("upset_head");
							setTimeout(() => {
								uni.navigateBack();
							}, 2000);
						}
					});
				}).catch(err => {
					console.log(err);
				});
			}
		}
	}
</script>

<style scoped lang="scss">
	.wrap {
		background-color: #f7f8fa;
		min-height: 100vh;
		padding-bottom: 40rpx;
	}

	.nav-bar-content {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 750rpx;
		padding: 0 30rpx;
		box-sizing: border-box;
	}
	.nav-back-icon {
		width: 80rpx;
	}
	.nav-title {
		font-size: 32rpx;
		color: #333333;
		font-weight: bold;
		text-align: center;
		flex-grow: 1;
	}

	.form-container {
		background-color: #ffffff;
		margin: 20rpx 24rpx;
		padding: 0 24rpx;
		border-radius: 16rpx;
		box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.03);
	}

	.readonly-text {
		font-size: 28rpx;
		color: #606266;
		width: 100%;
		text-align: right;
	}

	.region-select-box {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		width: 100%;
		gap: 8rpx;
		
		.region-text {
			font-size: 28rpx;
		}
		.has-val-original {
			color: #909399;
		}
		.has-val-modified {
			color: #333333;
		}
		.placeholder-val {
			color: #c0c4cc;
		}
	}

	.status-capsule-group {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		gap: 16rpx;
		width: 100%;
	}
	.capsule-tag {
		font-size: 24rpx;
		padding: 4rpx 16rpx;
		border-radius: 20rpx;
		line-height: 1.4;
	}
	.level-tag {
		background-color: #fef0f0;
		color: #f56c6c;
		border: 1rpx solid #fbc4c4;
	}
	.signed-tag {
		background-color: #f0f9eb;
		color: #67c23a;
		border: 1rpx solid #c2e7b0;
	}
	.unsigned-tag {
		background-color: #f4f4f5;
		color: #909399;
		border: 1rpx solid #dcdfe6;
	}

	.type-selector {
		display: flex;
		justify-content: flex-end;
		gap: 20rpx;
		width: 100%;
	}
	.type-btn {
		font-size: 24rpx;
		padding: 2rpx 20rpx;
		border-radius: 20rpx;
		line-height: 1.6;
		transition: all 0.2s;
	}
	.inactive-btn {
		background-color: #f4f4f5;
		color: #606266;
		border: 1rpx solid #dcdfe6;
	}
	.active-enterprise {
		background-color: #ecf5ff;
		color: #2979ff;
		border: 1rpx solid #b3d8ff;
		font-weight: 500;
	}
	.active-personal {
		background-color: #fdf6ec;
		color: #e6a23c;
		border: 1rpx solid #f3d19e;
		font-weight: 500;
	}

	.upload-card {
		background-color: #ffffff;
		margin: 20rpx 24rpx;
		padding: 24rpx;
		border-radius: 16rpx;
		box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.03);
	}
	.upload_title {
		margin-bottom: 6rpx;
		.title-text {
			font-size: 30rpx;
			font-weight: bold;
			color: #333333;
		}
	}
	.upload-sub-tip {
		font-size: 22rpx;
		color: #909399;
		margin-bottom: 20rpx;
	}
	.upload_file {
		display: flex;
		gap: 20rpx;
	}
	.upload_file_item {
		flex: 1;
		text-align: center;
	}
	
	.upload_box {
		border-radius: 12rpx;
		height: 180rpx !important;
		width: 100%;
		background-color: #f8f9fb !important;
		border: 2rpx dashed #dcdfe6;
		box-sizing: border-box;
		position: relative;
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
	}

	.empty-box {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		gap: 6rpx;
		width: 100%;
		height: 100%;
		padding: 0 10rpx;
		box-sizing: border-box;

		.main-tip {
			font-size: 22rpx;
			color: #909399;
			text-align: left;
			line-height: 1.3;
		}
	}

	.has-image-box {
		background: #ffffff !important;
		border: 2rpx solid #dcdfe6;

		.imgs {
			width: 100%;
			height: 100%;
			display: block;
			position: absolute;
			left: 0;
			top: 0;
		}
	}

	.footer-bar {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		background-color: #ffffff;
		padding: 20rpx 30rpx;
		box-shadow: 0 -4rpx 16rpx rgba(0, 0, 0, 0.04);
		box-sizing: border-box;
		z-index: 99;
	}
	.save-btn {
		width: 100%;
		height: 80rpx;
		background-color: #2979ff;
		color: #ffffff;
		font-size: 30rpx;
		font-weight: bold;
		border-radius: 40rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 4rpx 12rpx rgba(41, 121, 255, 0.3);
	}
</style>