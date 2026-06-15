<template>
	<view class="wrap">
		<u-navbar :is-back="false" title="">
			<view class="d_a_sb " style="width: 750rpx;">
				<view style="width: 200rpx;padding-left: 30rpx;" @click="back">
					<u-icon name="nav-back" color="#606266" :size="44">
					</u-icon>
				</view>
				<view style="font-size: 30rpx; color: #000; font-weight: bold; text-align: center; flex-grow: 1;">编辑账号资料</view>
				<view style="width: 200rpx;padding-right: 30rpx; color: #488aff; text-align: right;" @click="saveUserInfo">保持</view>
			</view>
		</u-navbar>
		<view class="">
			<view style="padding-left: 30rpx;padding-right: 30rpx;">
				<u-form :model="infos">
					<u-form-item label-width='150' label="类型" prop="name">
						<u-input disabled v-model="infos.ac_name" />
					</u-form-item>
					<u-form-item label-width='150' label="名称" prop="intro">
						<u-input v-model="nickname" />
					</u-form-item>
					<u-form-item label-width='150' label="地址" prop="intro">
						<u-input v-model="street" />
					</u-form-item>
					<u-form-item label-width='150' label="账号" prop="intro">
						<u-input disabled v-model="infos.phone" />
					</u-form-item>

					<u-form-item label-width='150' label="会员级别" prop="intro">
						<u-input disabled v-model="infos.ac_level_name" />
					</u-form-item>
				</u-form>
			</view>
			<view class="upload">
				<view class="upload_title">上传证照</view>
				<view class="upload_file">
					<view class="upload_file_item">
						<view class="upload_file_item_thumb">
							<span>+上传</span>
							<image mode="widthFix" :src='pic_id' class="imgs" @click="photoviewer(pic_id)" v-if="pic_id!=null" />
						</view>
					</view>
					<view class="upload_file_item">
						<view class="upload_file_item_thumb">
							<span>+上传</span>
							<image mode="widthFix" :src='pic_back' class="imgs" @click="photoviewer(pic_back)" v-if="pic_back!=null" />
						</view>
					</view>
				</view>

				<view class="upload_file">
					<view class="upload_file_item">
						<view class="upload_file_item_thumb">
							<span>+上传</span>
							<image mode="widthFix" :src='pic_head' class="imgs" @click="photoviewer(pic_head)" v-if="pic_head!=null" />
						</view>
					</view>
					<view class="upload_file_item">
						<view class="upload_file_item_thumb">
							<span>+上传</span>
							<image mode="widthFix" :src='pic_cont' class="imgs" @click="photoviewer(pic_cont)" v-if="pic_cont!=null" />
						</view>
					</view>
				</view>

			</view>


			<view style="width: 100%;height: 150rpx;"></view>
			<view class="footer">
				<view class="footer_item" @click="editInfo()">
					<text class="footer_item_text">账号资料修改</text>
				</view>
				<view class="footer_item" @click="editApply()">
					<text class="footer_item_text" :class="infos.apply_check>0?'gray':''">账号角色类型</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				form: {},
				uid: '',
				infos: {},
				nickname: "",
				street: "",
				pic_id: "",
				pic_back: "",
				pic_head: "",
				pic_cont: "",
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
		},
		methods: {
			back() {
				uni.navigateBack()
			},
			saveUserInfo() {
				let that = this;
				let params = {
					uid: that.uid,
					nickname: that.nickname,
					street: that.street
				};
				this.$api.updates(params).then(ret => {
					uni.showModal({
						title: '提示',
						content: '信息更新成功',
						showCancel: false,
						success: (res) => {
							if (res.confirm) {
								uni.navigateBack()
							}
						}
					});
				}).catch(err => {

				});
			},
			doIninit() {
				let that = this;
				let params = {
					uid: that.uid
				};
				this.$api.Users(params).then(ret => {
					that.infos = ret.data;
					that.nickname = ret.data.nickname;
					that.street = ret.data.street;
					that.pic_id = ret.data.pic_id;
					that.pic_back = ret.data.pic_back;
					that.pic_head = ret.data.pic_head;
					that.pic_cont = ret.data.pic_cont;
				}).catch(err => {

				});
			},
			editInfo() {
				uni.navigateTo({
					url: '/pages/poindex/poedit/poedit'
				})
			},
			editApply() {
				let that = this;
				if (this.infos.apply_check > 0) {
					return;
				}
				this.$api.up_check({
					uid: this.uid,
					apply_check: 1
				}).then(ret => {
					uni.showModal({
						title: '提示',
						content: '已提交',
						showCancel: false,
						success: (res) => {
							if (res.confirm) {

							}
						}
					});
					this.doIninit();
				}).catch(err => {

				});
			},
			photoviewer(url) {
               uni.previewImage({
               	urls:[url]
               })
			}
		}
	}
</script>

<style scoped lang="scss">
	.footer {
		bottom: 32rpx;
		display: flex;
		position: fixed;
		width: 100%;
		z-index: 10;
	}

	.footer_item {
		flex: 1;
		padding: 0rem 16rpx;
		text-align: center;
	}

	.footer_item_text {
		border: 4rpx solid #c20f22;
		border-radius: 0.2rem;
		color: #c20f22;
		display: block;
		font-size: 30rpx;
		height: 80rpx;
		line-height: 80rpx;
	}


	.gray {
		border: 3rpx solid #eeeeee;
		color: #eeeeee;
	}

	.upload {
		padding: 24rpx 0rem;
	}

	.upload_title {
		font-size: 34rpx;
		padding: 0rem 24rpx;
	}

	.upload_file {
		display: flex;
		margin-top: 32rpx;
	}

	.upload_file_item {
		flex: 1;
		padding: 0rem 24rpx;
		text-align: center;
	}

	.upload_file_item_thumb {
		background: #f8f8f8;
		color: #999999;
		font-size: 22rpx;
		height: 190rpx;
		line-height: 190rpx;
		overflow: hidden;
		position: relative;
		width: 100%;
	}

	.upload_file_item image.imgs {
		left: 0rem;
		position: absolute;
		top: 0rem;
		width: 100%;
		z-index: 3;
	}

	.upload_file_item input {
		bottom: 0rem;
		left: 0rem;
		opacity: 0;
		position: absolute;
		top: 0rem;
		width: 100%;
		z-index: 10;
	}

	.upload_file_item_descr {
		color: #999999;
		font-size: 24rpx;
		height: 64rpx;
		line-height: 64rpx;
	}
</style>