<template>
	<view>
		<u-navbar :is-back="false" title="">
			<view class="d_a_sb " style="width: 750rpx;">
				<view style="width: 200rpx;padding-left: 30rpx;" @click="back">
					<u-icon name="nav-back" color="#606266" :size="44">
					</u-icon>
				</view>
				<view style="font-size: 30rpx; color: #000; font-weight: bold; text-align: center; flex-grow: 1;">
					备注信息模板入录入</view>
				<view style="width: 200rpx;padding-right: 30rpx; color: #488aff; text-align: right;">
					</view>
			</view>
		</u-navbar>
		<view class="list">
			<view class="d_a list_item hh" v-for="(item,i) in list" :key="i" @click="itemClick(item,i)">
				<u-checkbox v-model="item.checked" shape="circle"></u-checkbox>
				<view style="width: 100%" class="d_a_sb">
					<view class="d_a">
						<text  space="nbsp" class="item_text hh">{{item.title}}</text>
					</view>
					<view class="d_a">
						<u-button type="primary" @click.stop="edit(item,i)" size="mini">编辑</u-button>
						<u-button type="error" style="margin-left: 20rpx;" @click.stop="deleteRemark(item,i)"
							size="mini">删除</u-button>
					</view>
				</view>


			</view>
		</view>
		<view class="d_a_j w_100 mt_2">
			<u-button @click="confirms()" type="primary">提交选择</u-button>
		</view>
		<view class="foot">
			<view class="d_a_j title fw_700">
				添加模板
			</view>
			<view style="width: 85%">
				备注信息：
			</view>
			<view style="width: 85%">
				<textarea style="border: none;height: 200rpx;background-color: #ffffff;padding: 20rpx;" v-model="title"
					class="mt_1 w_100" placeholder="请输入备注信息"></textarea>
			</view>
			<view style="width: 85%;justify-content: space-between" class="d_a mt_2">
				<view></view>
				<u-button type="primary" @click.stop="save()">保存</u-button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [],
				pic_id: "/static/imgs/sc.png",
				name: "",
				title: "",
				uid: '',
				id: '',
				checkedIndex: null,
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
		methods: {
			back() {
				uni.navigateBack()
			},
			edit(item,index) {
				// evt.stopPropagation();
				this.title = item.title;
				this.id = item.id;
			},

			deleteRemark(item, index) {
				uni.showModal({
					title: '提示',
					content: '确定要删除吗？',
					success: (res) => {
						if (res.confirm) {
							this.list.splice(index, 1);
							this.remark_dels(item.id)
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			remark_dels(id) {
				let that = this;
				that.$api.remark_dels({
					id: id
				}).then(ret => {
					this.title = '';
					this.getList()
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
			confirms() {
				if (this.checkedIndex == null) {
					uni.showModal({
						title: '提示',
						content: '请选择一个模板',
						showCancel: false,
					});
					return false;
				}
				uni.navigateBack()
				uni.$emit("noteInformation", this.list[this.checkedIndex])

			},
			getList() {
				let that = this;
				that.$api.getRemarkList({
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
			save() {
				let that = this;
				that.$api.remark_save({
					uid: this.uid,
					title: this.title,
					id: this.id
				}).then(ret => {
					this.title = ''
					this.id = '';
					this.getList()

				}).catch(err => {

				});
			}
		}
	}
</script>

<style scoped lang="scss">
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

	.foot {
		width: 95%;
		background: #f0f0f0;
		margin: 60rpx auto 0 auto;
		display: flex;
		align-items: center;
		padding-bottom: 30rpx;
		flex-direction: column;

		.title {
			width: 100%;
			height: 80rpx;
			color: #333333;
		}
	}
</style>