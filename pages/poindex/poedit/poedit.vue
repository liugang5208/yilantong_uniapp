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
					<u-form-item label-width='150' label="商店名称">
						<u-input v-model="nickname" />
					</u-form-item>
					<u-form-item label-width='150' label="负责人员">
						<u-input v-model="manager" />
					</u-form-item>
					<u-form-item label-width='150' label="身份证号">
						<u-input v-model="idcard" />
					</u-form-item>
					<u-form-item label-width='150' label="所在地址">
						<view>
							{{infos.prov_name}}{{infos.city_name}}{{infos.label_name}}{{infos.street}}
						</view>
					</u-form-item>
					<u-form-item label-width='150' label="联系电话">
						<u-input v-model="maphone" />
					</u-form-item>

					<u-form-item label-width='150' label="微信号码">
						<u-input v-model="wechat" />
					</u-form-item>

					<u-form-item label-width='150' label="电子邮箱">
						<u-input v-model="email" />
					</u-form-item>
				</u-form>


			</view>
			<view class="upload">
				<view class="upload_title">上传证照</view>
				<view class="upload_file">
					<view class="upload_file_item">
						<view class="upload_file_item_thumb">
							<span>+上传</span>
							<image mode="widthFix" :src='pic_id' class="imgs" @tap.stop="openPic('WRITE_EXTERNAL_STORAGE',1)"  />
						</view>
						<view class="upload_file_item_descr" @tap.stop="openPic('WRITE_EXTERNAL_STORAGE',1)">（点击上传身份证头像面）</view>
					</view>
					<view class="upload_file_item">
						<view class="upload_file_item_thumb">
							<span>+上传</span>
							<image mode="widthFix" :src='pic_back' class="imgs" @tap.stop="openPic('WRITE_EXTERNAL_STORAGE',2)" />
						</view>
						<view class="upload_file_item_descr" @tap.stop="openPic('WRITE_EXTERNAL_STORAGE',2)">（点击上传身份证国徽面）</view>
					</view>
				</view>

				<view class="upload_file">
					<view class="upload_file_item">
						<view class="upload_file_item_thumb">
							<span>+上传</span>
							<image mode="widthFix" :src='pic_head' class="imgs" @tap.stop="openPic('WRITE_EXTERNAL_STORAGE',3)" />
						</view>
						<view class="upload_file_item_descr" @tap.stop="openPic('WRITE_EXTERNAL_STORAGE',3)">（点击上传商店门头招牌）</view>

					</view>
					<view class="upload_file_item">
						<view class="upload_file_item_thumb">
							<span>+上传</span>
							<image mode="widthFix" :src='pic_cont' class="imgs" @tap.stop="openPic('WRITE_EXTERNAL_STORAGE',4)" />
						</view>
						<view class="upload_file_item_descr" @tap.stop="openPic('WRITE_EXTERNAL_STORAGE',4)">（点击上传商店内部实景）</view>
					</view>
				</view>

			</view>



		</view>
	
	</view>
</template>

<script>
	import {
		pathToBase64
	} from 'image-tools'
	export default {
		data() {
			return {
				permissionID:'',
				form: {},
				uid: '',
				infos: {},
				nickname: "",
				street: "",
				pic_id: "",
				pic_back: "",
				pic_head: "",
				pic_cont: "",


				manager: "",
				idcard: "",
				maphone: "",
				wechat: "",
				email: "",
				type:'',


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
					manager: that.manager,
					idcard: that.idcard,
					maphone: that.maphone,
					wechat: that.wechat,
					email: that.email,
					pic_id: that.pic_id,
					pic_back: that.pic_back,
					pic_head: that.pic_head,
					pic_cont: that.pic_cont,
				};
				this.$api.updates(params).then(ret => {
					uni.showModal({
						title: '提示',
						content: '恭喜您信息更新成功',
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
					that.manager = ret.data.manager;
					that.idcard = ret.data.idcard;
					that.maphone = ret.data.maphone;
					that.wechat = ret.data.wechat;
					that.email = ret.data.email;
					////
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
			chooseImage(type){
				let types=type
				let that = this;
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album', 'camera'], //从相册选择
					success: (res)=> {
						//需要使用uni,getImageInfo获取图片的本地存储路径
						uni.getImageInfo({
							src: res.tempFilePaths[0],
							success: (path) => {
								console.log(path.path, '======')
								pathToBase64(path.path).then(base64 => {
										console.log(base64)
										if (types == 1) {
											that.pic_id = base64; //拍照地址
										}
										if (types == 2) {
											that.pic_back = base64; //拍照地址
										}
										if (types == 3) {
											that.pic_head = base64; //拍照地址
										}
										if (types == 4) {
											that.pic_cont = base64; //拍照地址
										}
									})
									.catch(error => {
										console.error(error)
									})
							}
						})
					}
				});
			},
			
		  async	openPic(permissionID,type) {
				let that = this;
				let flag = true
				// #ifdef APP
				flag = await this.$util.permission(permissionID)
				// #endif
				if (!flag) {
					uni.showModal({
						title: "易揽通对存储空间/照片权限申请说明",
						content: "便于您使用该功能上传您的照片/图片/及用于上传报价单LOGO场景中读取和写入相册和文件内容。",
						cancelText: "取消",
						confirmText: "确定",
						showCancel: true,
						confirmColor: '#000',
						cancelColor: '#666',
						success: async (res) => {
							if (res.confirm) {
								 let flagQ = await this.$util.requestPermissions(permissionID)
								 if(flagQ){
									 this.chooseImage(type)
								 }else{
									 uni.showModal({
									 	title: '温馨提示',
									 	content: '还没有该权限，立即去设置开启？',
									 	cancelText: "取消",
									 	confirmText: "去设置",
									 	showCancel: true,
									 	confirmColor: '#000',
									 	cancelColor: '#666',
									 	success: (res) => {
									 		if (res.confirm) {
									 			this.$util.goSetting();
									 		}
									 	}
									 })
								 }
							}
						}
					})
				} else {
					this.chooseImage(type)
				}
			},
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