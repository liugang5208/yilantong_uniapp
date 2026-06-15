<template>
	<view>
		<u-navbar :is-back="false" title="">
			<view class="d_a_sb " style="width: 750rpx;">
				<view style="width: 200rpx;padding-left: 30rpx;" @click="back">
					<u-icon name="nav-back" color="#606266" :size="44">
					</u-icon>
				</view>
				<view style="font-size: 30rpx; color: #000; font-weight: bold; text-align: center; flex-grow: 1;">
					管理表头logo图标
				</view>
				<view style="width: 200rpx;padding-right: 30rpx; color: #488aff; text-align: right;" @click="confirms">
				</view>
			</view>
		</u-navbar>


		<view class="list" v-if="list.length>0">
			<view class="d_a list_item hh" v-for="(item,i) in list " :key="i" @click="itemClick(item,i)">
				<u-checkbox v-model="item.checked" shape="circle"></u-checkbox>
				<view style="width: 100%" class="d_a_sb">
					<view class="d_a">
						<image style="width: 500rpx;height: 71rpx;" :src="item.img_site" class=" ml_2 ">
					</view>
					<view class="d_a_j">
						<u-button type="error" @click.stop="deleteLogo(item,i)" size="mini">删除</u-button>
					</view>

				</view>
			</view>
		</view>
		<view class="d_a_j w_100 mt_2">
			<u-button @click="confirms()" type="primary">提交选择</u-button>
		</view>
		<view class="d_a_j mt_2" style="flex-direction: column">
			<view class="w_100 d_a_j fw_700 ">
				添加模板
			</view>

			<view class="d_a_j mt_2">
				<p>模板名称：</p>

				<view class="d_a_j  upload" style="flex-direction: column"
					@tap.stop="openFileDir('WRITE_EXTERNAL_STORAGE')">
					<image :src='pic_id' class="uploadImg" />
					<p class="mt_1">上传</p>
				</view>

			</view>
			<p class="fw_700" style="margin-top: 20rpx;">推荐大小700*100包含企业 Logo及名称</p>

			<!-- <view class="d_a_j" style="height: 100rpx;">
        <p class="mr_2 c_000">公司名称:</p>
        <input placeholder="请输入内容" style="border: 1px solid #dcdcdc;padding-left: 10rpx;height: 70rpx;" type="text" v-model="title" />
      </view> -->

			<view class="w_100 d_a mt_2" style="justify-content: flex-end">

			</view>
			<u-button @click="save()" type="primary">确认上传</u-button>

		</view>

		<view class="search_val">
			<p>温馨提示：上传公司商标及名称可生成对应的报价单表头，不设置则报价单默认系统自定义表头</p>
		</view>



	</view>
</template>

<script>
	import ykAuthpup from "@/components/yk-authpup/yk-authpup";
	import {
		pathToBase64
	} from 'image-tools'

	export default {
		data() {
			return {
				permissionID: '',
				list: [],
				pic_id: "/static/imgs/sc.png",
				title: "",
				uid: '',
				checkedIndex: null,
				img: "",
				checked: false,
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
				this.getList()
			}

		},

		onShow() {

		},


		methods: {
			confirms() {
				if (this.checkedIndex == null) {
					uni.showModal({
						title: '提示',
						content: '请选择一个logo',
						showCancel: false,
					});
					return false;
				}
				uni.navigateBack()
				uni.$emit("manageTableLogo", this.list[this.checkedIndex])
			},
			save() {
				let that = this;
				this.$api.logo_save({
					title: that.title,
					uid: that.uid,
					img: this.pic_id
				}).then(ret => {
					this.title = '';
					this.getList()
					////
				}).catch(err => {

				});
			},
			itemClick(item, index) {
				// 先将所有的设置为false
				this.list.forEach((item) => {
					item.checked = false;
				})
				this.list[index].checked = true;
				this.checkedIndex = index;
			},
			edit(item, index) {
				this.title = item.title;
				this.id = item.id;
			},


			async openFileDir(permissionID) {
				let that = this;
				let flag = true
				// #ifdef APP
				// flag = await this.$util.permission(permissionID)
				
				// const platform = uni.getSystemInfoSync().platform;
				// if (platform === 'android') {
				// 	const sdkInt = plus.android.runtimeMainActivity().getApplicationContext().getApplicationInfo().targetSdkVersion;
				// 	if (sdkInt >= 33) {
				// 		// Android 13+ 请求 READ_MEDIA_IMAGES 权限
				// 		this.chooseImage()
				// 		return true;
				// 	}
				// }
				
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
									 this.chooseImage()
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
					this.chooseImage()
				}
			},
			chooseImage() {
				let that = this;
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: (res) => {
						//需要使用uni,getImageInfo获取图片的本地存储路径
						uni.getImageInfo({
							src: res.tempFilePaths[0],
							success: (path) => {
								console.log(path.path, '======')
								pathToBase64(path.path).then(
										base64 => {
											that.pic_id =
												base64; //拍照地址
											this.img = base64;
										})
									.catch(error => {
										console.error(error)
									})
							}
						})
					}
				});
			},
			getList() {
				let that = this;
				that.$api.getLogoList({
					uid: this.uid
				}).then(ret => {
					ret.data.forEach(e => {
						e.checked = false
					})
					that.list = ret.data
					this.$forceUpdate()

				}).catch(err => {

				});
			},
			back() {
				uni.navigateBack()
			},
			deleteLogo(item, index) {
				uni.showModal({
					title: '提示',
					content: '确定要删除吗？',
					success: (res) => {
						if (res.confirm) {
							this.list.splice(index, 1);
							this.logo_dels(item.id)
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			logo_dels(id) {
				this.$api.logo_dels({
					id: id
				}).then(res => {
					this.getList()
				}).catch(err => {

				});
			}
		}
	}
</script>

<style scoped lang="scss">
	.search_val {
		background: #2979ff;
		box-sizing: border-box;
		bottom: 0;
		color: white;
		padding: 30rpx;
		font-size: 24rpx;
		width: 100%;
		position: fixed;
	}

	.list {
		width: 100%;
		max-height: 40vh;
		overflow: scroll;

		.list_item {
			padding: 20rpx;
			border-bottom: 2rpx solid #e5e5e5;

			.image {
				width: 450rpx;
				height: 60rpx;
			}

			.item_text {
				margin-left: 40rpx;
				font-size: 28rpx;
				line-height: 60rpx;
				color: #323232;
			}
		}
	}

	.upload {
		width: 160rpx;
		height: 160rpx;
		border: 2rpx solid #e5e5e5;
		border-radius: 10rpx;

		.uploadImg {
			width: 60rpx;
			height: 60rpx;
		}

		p {
			margin: 0;
			padding: 0;
		}
	}

	.footer {
		width: 100%;
		height: 120rpx;
		background: #1677ff;
		position: fixed;
		bottom: 0;
		padding: 2rpx;
		left: 0;
		z-index: 100;
		color: #ffffff;

	}
</style>