<template>
	<view>
		<view class="header_lin">
			<view class="header_img" @tap.stop="openFileDir('WRITE_EXTERNAL_STORAGE')">
				<image mode="widthFix" :src="infos.headimgurl" v-if="base64s<1" />
				<image :src="base64Image" v-if="base64s>0" />
			</view>
		</view>
		<view class="header_btn d_a">
			<button @click="applyTrans()">修改头像</button>
			<button @click="back()">取消</button>
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
				uid: '',
				infos: {},
				base64s: 0,
				base64Image: '',
				permissionID:'',
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
			chooseImage(){
				let that = this;
				
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: (res)=> {
						//需要使用uni,getImageInfo获取图片的本地存储路径
						uni.getImageInfo({
							src: res.tempFilePaths[0],
							success: (path) => {
								console.log(path.path, '======')
								pathToBase64(path.path).then(base64 => {
										this.base64s = 1;
										this.base64Image = base64; //拍照地址
										console.log(this.base64Image)
									})
									.catch(error => {
										console.error(error)
									})
							}
						})
					}
				});
			},
			applyTrans() {
				let that = this;
				var params = {
					uid: that.uid,
					image: that.base64Image
				};
				if (that.base64s < 1) {
					uni.showToast({
						title: "请先上传图片",
						icon: "none"
					})
					return false
				}
				that.$api.upset_head(params).then(ret => {
					uni.showToast({
						title: "头像更新成功",
						icon: "none"
					})
					uni.$emit('upset_head')
				})
			},
			doIninit() {
				let that = this;
				var params = {
					uid: that.uid
				};
				that.$api.Users(params).then(ret => {
					that.infos = ret.data;
				}).catch(err => {
					console.log(err.status);
					console.log(err.error);
					console.log(err.headers);
				});
			},
		
			
			back() {
				uni.navigateBack()
			}
		}
	}
</script>

<style scoped lang="scss">
	.header_lin {
		padding-top: 56rpx;
		text-align: center;
	}

	.header_img {
		border-radius: 50%;
		display: inline-block;
		height: 150px;
		overflow: hidden;
		width: 150px;
	}

	.header_img image {
		vertical-align: middle;
		width: 100%;
	}

	.header_btn {
		padding-top: 56rpx;
		text-align: center;
	}
</style>