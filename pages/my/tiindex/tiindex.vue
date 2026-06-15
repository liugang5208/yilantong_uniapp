<template>
	<view>
		<u-navbar :is-back="false" title="">
			<view class="d_a_sb " style="width: 750rpx;">
				<view style="width: 200rpx;padding-left: 30rpx;" @click="back">
					<u-icon name="nav-back" color="#606266" :size="44">
					</u-icon>
				</view>
				<view style="font-size: 30rpx; color: #000; font-weight: bold; text-align: center; flex-grow: 1;">发票资料列表</view>
				<view style="width: 200rpx;padding-right: 30rpx; color: #488aff; text-align: right;" @click="gotoAddon">添加发票</view>
			</view>
		</u-navbar>


		<view class="nav">
			<view :class="type==2?'active':''" class="nav_item " @click="changeType(2)">
				<span>增值税专用发票</span>
			</view>
			<view :class="type==1?'active':''" class="nav_item" @click="changeType(1)">
				<span>增值税普通发票</span>
			</view>
		</view>

		<view class="ticket" v-for="(item,i) in list" :key="i">
			<view class="ticket_info">
				<p>{{item.name}}</p>
				<p>纳税类别：{{item.ticket_type>1?'增值税专用发票':'增值税普通发票'}}</p>
				<p>公司名称：{{item.comp_name}}</p>
				<p>信用代码：{{item.comp_tex}}</p>
				<p>公司地址：{{item.comp_addr}}</p>
				<p>公司电话：{{item.comp_tele}}</p>
				<p>开户银行：{{item.comp_bank}}</p>
				<p>银行账户：{{item.bank_id}}</p>
				<p>开户行号：{{item.bank_sn}}</p>
			</view>
			<view class="ticket_button">
				<view class="ticket_btn_item" @click="gotoCopy(item)">复制</view>
				<view class="ticket_btn_item" @click="gotoEdit(item.id)">修改资料</view>
				<view class="ticket_btn_item" @click="doels(item.id)">删除资料</view>
			</view>

		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				uid: '',
				type: 2,
				list: [],
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
			gotoEdit(id) {
				uni.navigateTo({
					url:'/pages/my/tiindex/tiedit?id='+id
				})
			  },
			doels(ids) {
				let that = this;
				var params = {
					ids: ids
				};
				uni.showModal({
					title: '提示',
					content: '确定要删除？',
					success: (res) => {
						if (res.confirm) {
							that.$api.ticket_dels( params).then(ret => {
								that.doIninit();
							})
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			gotoCopy(item) {
				var html = "公司名称：" + item.comp_name + "\r\n" + "信用代码：" + item.comp_tex + "\r\n" + "公司地址：" + item.comp_addr;
				html += "\r\n" + "公司电话：" + item.comp_tele + "\r\n" + "开户银行：" + item.comp_bank + "\r\n" + "银行账户：";
				html += item.bank_id + "\r\n" + "开户行号：" + item.bank_sn;
				uni.setClipboardData({
					data: html,
					success: function() {
						console.log('success');
					}
				});
			},
			gotoAddon() {
				uni.navigateTo({
					url: '/pages/my/tiindex/tiadds'
				})
			},
			back() {
				uni.navigateBack()
			},
			changeType(index) {
				this.type = index;
				this.doIninit();
			},
			doIninit() {
				let that = this;
				var params = {
					uid: that.uid,
					type: that.type
				};
				that.$api.ticket_list(params).then(ret => {
					that.list = ret.data;
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.nav {
		background: white;
		border-bottom: 1px solid #eeeeee;
		display: flex;
	}

	.nav_item {
		color: #999999;
		flex: 1;
		font-size: 32rpx;
		height: 150rpx;
		line-height: 150rpx;
		text-align: center;
	}

	.nav_item span {
		position: relative;
	}

	.nav_item.active {
		color: #c20f22;
	}

	.nav_item.active span::after {
		background: #c20f22;
		border-radius: 4rpx;
		bottom: -16rpx;
		content: " ";
		display: table;
		height: 8rpx;
		left: 50%;
		margin-left: -16rpx;
		position: absolute;
		width: 32rpx;
	}

	.ticket {
		background: white;
		margin-bottom: 16rpx;
		padding: 32rpx 24rpx;
		position: relative;
	}

	.ticket_info {
		padding-top: 8rpx;
	}

	.ticket_info p {
		color: #999999;
		font-size: 26rpx;
		margin: 0rem 0rem 16rpx;
		padding: 0rem;
	}

	.ticket_info p:first-child {
		color: black;
		font-size: 30rpx;
		margin-bottom: 24rpx;
	}

	.ticket_button {
		padding-top: 24rpx;
		text-align: right;
	}

	.ticket_btn_item {
		border: 1px solid #eeeeee;
		border-radius: 4rpx;
		display: inline-block;
		font-size: 24rpx;
		height: 56rpx;
		line-height: 56rpx;
		margin-left: 16rpx;
		text-align: center;
		width: 144rpx;
	}

	.ticket_btn_share {
		border: 1px solid #c20f22;
		border-radius: 4rpx;
		color: #c20f22;
		font-size: 24rpx;
		height: 56rpx;
		line-height: 56rpx;
		position: absolute;
		right: 24rpx;
		top: 32rpx;
		text-align: center;
		width: 144rpx;
	}
</style>