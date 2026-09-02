<template>
	<view class="address-container">
		<!-- 自定义导航栏 -->
		<u-navbar :is-back="false" title="" :background="{ background: '#ffffff' }" :border-bottom="false">
			<view class="d_a_sb" style="width: 750rpx;">
				<view style="width: 200rpx;padding-left: 30rpx;" @click="back">
					<u-icon name="nav-back" color="#333333" :size="40"></u-icon>
				</view>
				<view style="font-size: 32rpx; color: #1a1a1a; font-weight: 600; text-align: center; flex-grow: 1;">地址管理</view>
				
				<!-- 右上角：灰色系精致带图标的添加按钮 -->
				<view style="width: 220rpx; padding-right: 30rpx; text-align: right;" @click="gotoAddon">
					<view class="header-add-btn">
						<u-icon name="plus" color="#606266" size="24" style="margin-right: 4rpx;"></u-icon>
						<text class="header-add-text">添加地址</text>
					</view>
				</view>
			</view>
		</u-navbar>

		<!-- 地址列表区域 -->
		<view class="address-list" v-if="list && list.length > 0">
			<view class="address-card" v-for="(item, index) in list" :key="index">
				
				<!-- 主体信息区 -->
				<view class="card-main" @click="gotoEdit(item.id)">
					<view class="user-row">
						<view class="user-info">
							<text class="name">{{item.name}}</text>
							<text class="phone">{{item.phone}}</text>
						</view>
						<!-- 默认地址精致小标 -->
						<view class="default-badge" v-if="item.def > 0">
							<text class="badge-text">默认</text>
						</view>
					</view>
					
					<view class="address-row">
						<text class="address-detail">{{item.p_name}}{{item.c_name}}{{item.l_name}}{{item.street}}</text>
					</view>
				</view>
				
				<!-- 底部操作栏：左侧支持直接点击设为默认，右侧删除/编辑 -->
				<view class="card-footer">
					<view class="footer-left-tip" @click="setDefault(item)">
						<view class="default-radio-box" :class="{ 'is-active': item.def > 0 }">
							<u-icon :name="item.def > 0 ? 'checkbox-mark' : ''" color="#ffffff" size="20" v-if="item.def > 0"></u-icon>
						</view>
						<text class="edit-hint" :class="{ 'active-text': item.def > 0 }">{{ item.def > 0 ? '默认地址' : '设为默认' }}</text>
					</view>
					<view class="action-buttons">
						<view class="btn-item plain" @click="doDels(item.id)">删除</view>
						<view class="btn-item primary" @click="gotoEdit(item.id)">编辑</view>
					</view>
				</view>
				
			</view>
		</view>

		<!-- 更具设计感的空状态 -->
		<view class="empty-state" v-else-if="list && list.length === 0">
			<view class="empty-box">
				<text class="empty-icon">📭</text>
				<text class="empty-title">还没有收货地址</text>
				<text class="empty-desc">添加一个地址，下单更方便哦</text>
				<view class="empty-btn" @click="gotoAddon">立即添加</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				uid: '',
				list: [],
				loading: '',
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
						}
					}
				});
			} else {
				this.uid = userInfo.id
				this.doIninit()
				uni.$on("adadds", data => { this.doIninit() })
				uni.$on("adedit", data => { this.doIninit() })
			}
		},
		beforeDestroy() {
			uni.$off(['adadds', "adedit"]);
		},
		methods: {
			back() {
				uni.navigateBack()
			},
			gotoAddon() {
				uni.navigateTo({
					url: '/pages/my/adindex/adadds'
				})
			},
			gotoEdit(id) {
				uni.navigateTo({
					url: '/pages/my/adindex/adedit?ids='+id
				})
			},
			doIninit() {
				let that = this;
				var params = { uid: that.uid };
				that.$api.uaddr_list(params).then(ret => {
					that.list = ret.data || [];
				})
			},
			// 核心新增：直接在列表层快捷设为默认地址
			setDefault(item) {
				// 如果已经是默认地址了，就不用重复提交了
				if (item.def > 0) return;

				let that = this;
				uni.showLoading({ title: "设置中..." });

				// 调用的参数根据你后端的实际更新接口结构调整
				// 通常修改默认需要把该条地址的其他核心字段带上，或者后端支持只传 id 和 def
				let params = {
					ids: item.id,
					uid: that.uid,
					prov: item.prov,
					city: item.city,
					label: item.label,
					name: item.name,
					phone: item.phone,
					street: item.street,
					def: 1 // 设为默认
				};

				that.$api.uaddr_edits(params).then(ret => {
					uni.hideLoading();
					uni.showToast({ title: '设置成功', icon: 'success' });
					that.doIninit(); // 刷新列表
				}).catch(err => {
					uni.hideLoading();
				});
			},
			doDels(id) {
				let that = this;
				uni.showModal({
					title: '安全提示',
					content: '确定要删除这个收货地址吗？',
					confirmColor: '#2979ff',
					success: (res) => {
						if (res.confirm) {
							uni.showLoading({ title: "删除中..." })
							that.$api.uaddr_dels({ id: id }).then(ret => {
								that.doIninit();
								uni.hideLoading()
							}).catch(err => {
								uni.hideLoading()
							})
						}
					}
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	/* 右上角灰色系精致添加按钮样式 */
	.header-add-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		background-color: #f2f3f5;
		padding: 8rpx 18rpx;
		border-radius: 30rpx;
		transition: opacity 0.2s;

		&:active {
			opacity: 0.7;
		}

		.header-add-text {
			font-size: 26rpx;
			color: #606266;
			font-weight: 500;
		}
	}

	/* 整个页面背景采用极浅的高级灰蓝调，告别纯白大白墙 */
	.address-container {
		background-color: #f4f6f9;
		min-height: 100vh;
		padding-bottom: 40rpx;
	}

	.address-list {
		padding: 24rpx;
	}

	/* 卡片立体悬浮效果 */
	.address-card {
		background: #ffffff;
		border-radius: 20rpx;
		margin-bottom: 24rpx;
		box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.03);
		overflow: hidden;
		transition: transform 0.1s;
		
		&:active {
			transform: scale(0.99);
		}
	}

	.card-main {
		padding: 32rpx 32rpx 24rpx 32rpx;
	}

	.user-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 16rpx;

		.user-info {
			display: flex;
			align-items: baseline;
			
			.name {
				font-size: 32rpx;
				font-weight: 600;
				color: #1a1a1a;
				margin-right: 20rpx;
			}

			.phone {
				font-size: 28rpx;
				color: #8a9099;
				font-family: -apple-system, BlinkMacSystemFont, sans-serif;
			}
		}

		.default-badge {
			background: linear-gradient(135deg, #ff6b6b, #ff8e53);
			padding: 4rpx 14rpx;
			border-radius: 20rpx;
			
			.badge-text {
				color: #ffffff;
				font-size: 20rpx;
				font-weight: 500;
			}
		}
	}

	.address-row {
		.address-detail {
			font-size: 28rpx;
			color: #4e5969;
			line-height: 1.5;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
			overflow: hidden;
		}
	}

	/* 卡片底部操作栏优化：左侧增加单选钮互动样式 */
	.card-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20rpx 32rpx;
		background-color: #fafbfd;
		border-top: 1px solid #f2f3f5;

		.footer-left-tip {
			display: flex;
			align-items: center;
			cursor: pointer;

			.default-radio-box {
				width: 32rpx;
				height: 32rpx;
				border-radius: 50%;
				border: 2rpx solid #c0c4cc;
				display: flex;
				align-items: center;
				justify-content: center;
				margin-right: 10rpx;
				transition: all 0.2s;

				&.is-active {
					background-color: #2979ff;
					border-color: #2979ff;
				}
			}

			.edit-hint {
				font-size: 26rpx;
				color: #909399;

				&.active-text {
					color: #2979ff;
					font-weight: 500;
				}
			}
		}

		.action-buttons {
			display: flex;
			align-items: center;

			.btn-item {
				font-size: 24rpx;
				height: 52rpx;
				line-height: 52rpx;
				margin-left: 16rpx;
				text-align: center;
				width: 120rpx;
				border-radius: 26rpx;
				font-weight: 500;

				&.plain {
					background: #ffffff;
					border: 1px solid #dcdfe6;
					color: #606266;
				}

				&.primary {
					background: #eef2ff;
					border: 1px solid #c7d2fe;
					color: #4f46e5;
				}
			}
		}
	}

	.empty-state {
		display: flex;
		justify-content: center;
		align-items: center;
		padding-top: 250rpx;

		.empty-box {
			text-align: center;
			
			.empty-icon {
				font-size: 80rpx;
				margin-bottom: 20rpx;
				display: block;
			}

			.empty-title {
				font-size: 32rpx;
				color: #1a1a1a;
				font-weight: 600;
				display: block;
				margin-bottom: 8rpx;
			}

			.empty-desc {
				font-size: 26rpx;
				color: #8a9099;
				display: block;
				margin-bottom: 40rpx;
			}

			.empty-btn {
				background: #2979ff;
				color: #ffffff;
				font-size: 28rpx;
				padding: 16rpx 60rpx;
				border-radius: 40rpx;
				display: inline-block;
				box-shadow: 0 8rpx 16rpx rgba(41, 121, 255, 0.2);
			}
		}
	}
</style>