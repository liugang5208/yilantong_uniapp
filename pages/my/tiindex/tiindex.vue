<template>
	<view class="invoice-container">
		<!-- 自定义导航栏 -->
		<u-navbar :is-back="false" title="" :background="{ background: '#ffffff' }" :border-bottom="false">
			<view class="d_a_sb" style="width: 750rpx;">
				<view style="width: 200rpx;padding-left: 30rpx;" @click="back">
					<u-icon name="nav-back" color="#333333" :size="40"></u-icon>
				</view>
				<view style="font-size: 32rpx; color: #1a1a1a; font-weight: 600; text-align: center; flex-grow: 1;">发票资料列表</view>
				
				<!-- 右上角：精致的添加按钮 -->
				<view style="width: 220rpx; padding-right: 30rpx; text-align: right;" @click="gotoAddon">
					<view class="header-add-btn">
						<u-icon name="plus" color="#606266" size="24" style="margin-right: 4rpx;"></u-icon>
						<text class="header-add-text">添加发票</text>
					</view>
				</view>
			</view>
		</u-navbar>

		<!-- 顶部切换 Tab：点击时颜色错开、形态区分，更具辨识度 -->
		<view class="nav-container">
			<view :class="['nav-item', type==2 ? 'active-special' : '']" @click="changeType(2)">
				<text>增值税专用发票</text>
			</view>
			<view :class="['nav-item', type==1 ? 'active-normal' : '']" @click="changeType(1)">
				<text>增值税普通发票</text>
			</view>
		</view>

		<!-- 发票列表内容区 -->
		<view class="ticket-list" v-if="list && list.length > 0">
			<view :class="['ticket-card', item.ticket_type > 1 ? 'card-special-theme' : 'card-normal-theme']" v-for="(item,i) in list" :key="i">
				<!-- 头部：高度降低，根据专票/普票区分不同的背景与色彩 -->
				<view :class="['ticket-header', item.ticket_type > 1 ? 'header-special' : 'header-normal']">
					<view class="company-title">{{item.name}}</view>
					<view :class="['type-tag', item.ticket_type > 1 ? 'tag-special' : 'tag-normal']">
						{{item.ticket_type > 1 ? '专用发票' : '普通发票'}}
					</view>
				</view>

				<!-- 详细字段区域：冒号、微粗、内容颜色按专票/普票错开 -->
				<view class="ticket-body">
					<view class="info-row"><text class="label">公司名称：</text><text :class="['val', item.ticket_type > 1 ? 'val-special' : 'val-normal']">{{item.comp_name}}</text></view>
					<view class="info-row"><text class="label">信用代码：</text><text :class="['val', item.ticket_type > 1 ? 'val-special' : 'val-normal']">{{item.comp_tex}}</text></view>
					<view class="info-row" v-if="item.comp_addr"><text class="label">公司地址：</text><text :class="['val', item.ticket_type > 1 ? 'val-special' : 'val-normal']">{{item.comp_addr}}</text></view>
					<view class="info-row" v-if="item.comp_tele"><text class="label">联系电话：</text><text :class="['val', item.ticket_type > 1 ? 'val-special' : 'val-normal']">{{item.comp_tele}}</text></view>
					<view class="info-row" v-if="item.comp_bank"><text class="label">开户银行：</text><text :class="['val', item.ticket_type > 1 ? 'val-special' : 'val-normal']">{{item.comp_bank}}</text></view>
					<view class="info-row" v-if="item.bank_id"><text class="label">银行账户：</text><text :class="['val', item.ticket_type > 1 ? 'val-special' : 'val-normal']">{{item.bank_id}}</text></view>
					<view class="info-row" v-if="item.bank_sn"><text class="label">开户行号：</text><text :class="['val', item.ticket_type > 1 ? 'val-special' : 'val-normal']">{{item.bank_sn}}</text></view>
				</view>

				<!-- 底部操作按钮 -->
				<view class="ticket-footer">
					<view class="btn plain-blue" @click="gotoCopy(item)">一键复制</view>
					<div class="right-group">
						<view class="btn plain" @click="gotoEdit(item.id)">修改资料</view>
						<view class="btn danger" @click="doels(item.id)">删除</view>
					</div>
				</view>
			</view>
		</view>

		<!-- 空状态 -->
		<view class="empty-state" v-else>
			<text class="empty-icon">📃</text>
			<text class="empty-title">暂无发票资料</text>
			<text class="empty-desc">点击右上角或下方按钮添加发票信息</text>
			<view class="empty-btn" @click="gotoAddon">立即添加</view>
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
				this.uid = userInfo.id
				this.doIninit()
			}
		},
		methods: {
			gotoEdit(id) {
				uni.navigateTo({
					url: '/pages/my/tiindex/tiedit?id=' + id
				})
			},
			doels(ids) {
				let that = this;
				var params = { ids: ids };
				uni.showModal({
					title: '安全提示',
					content: '确定要删除这个发票资料吗？',
					confirmColor: '#2979ff',
					success: (res) => {
						if (res.confirm) {
							that.$api.ticket_dels(params).then(ret => {
								that.doIninit();
							})
						}
					}
				});
			},
			gotoCopy(item) {
				var html = "公司名称：" + item.comp_name + "\r\n" + "信用代码：" + item.comp_tex + "\r\n" + "公司地址：" + item.comp_addr;
				html += "\r\n" + "联系电话：" + item.comp_tele + "\r\n" + "开户银行：" + item.comp_bank + "\r\n" + "银行账户：";
				html += item.bank_id + "\r\n" + "开户行号：" + item.bank_sn;
				uni.setClipboardData({
					data: html,
					success: function() {
						uni.showToast({ 
							title: '复制成功', 
							icon: 'none' 
						});
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
					that.list = ret.data || [];
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.invoice-container {
		background-color: #f4f6f9;
		min-height: 100vh;
		padding-bottom: 40rpx;
	}

	/* 右上角添加按钮 */
	.header-add-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		background-color: #f2f3f5;
		padding: 8rpx 18rpx;
		border-radius: 30rpx;

		.header-add-text {
			font-size: 26rpx;
			color: #606266;
			font-weight: 500;
		}
	}

	/* 顶部 Tab 切换栏 */
	.nav-container {
		background: #ffffff;
		display: flex;
		padding: 16rpx 24rpx;
		border-bottom: 1px solid #f2f3f5;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.02);

		.nav-item {
			flex: 1;
			text-align: center;
			font-size: 28rpx;
			color: #606266;
			height: 76rpx;
			line-height: 76rpx;
			font-weight: 500;
			background: #f7f8fa;
			margin: 0 8rpx;
			border-radius: 12rpx;
			transition: all 0.2s;

			&.active-special {
				color: #2979ff;
				background: #eef2ff;
				font-weight: 600;
				box-shadow: 0 4rpx 12rpx rgba(41, 121, 255, 0.12);
			}

			&.active-normal {
				color: #07c160;
				background: #e8f8f0;
				font-weight: 600;
				box-shadow: 0 4rpx 12rpx rgba(7, 193, 96, 0.12);
			}
		}
	}

	/* 卡片列表区 */
	.ticket-list {
		padding: 24rpx;
	}

	.ticket-card {
		background: #ffffff;
		border-radius: 24rpx;
		margin-bottom: 24rpx;
		box-shadow: 0 6rpx 20rpx rgba(0, 0, 0, 0.04);
		overflow: hidden;
		border: 1px solid rgba(0, 0, 0, 0.02);

		/* 顶部标题栏：高度降低（padding 缩减），且专票与普票背景颜色区分开 */
		.ticket-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 18rpx 32rpx;
			border-bottom: 1px solid #f2f3f5;

			&.header-special {
				background: linear-gradient(135deg, #f0f5ff, #ffffff);
			}

			&.header-normal {
				background: linear-gradient(135deg, #f0fff6, #ffffff);
			}

			.company-title {
				font-size: 30rpx;
				font-weight: 600;
				color: #1a1a1a;
				max-width: 440rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}

			.type-tag {
				font-size: 22rpx;
				padding: 4rpx 16rpx;
				border-radius: 20rpx;
				font-weight: 500;

				&.tag-special {
					color: #2979ff;
					background: #eef2ff;
				}

				&.tag-normal {
					color: #07c160;
					background: #e8f8f0;
				}
			}
		}

		.ticket-body {
			padding: 24rpx 32rpx;

			.info-row {
				display: flex;
				font-size: 26rpx;
				margin-bottom: 16rpx;

				&:last-child {
					margin-bottom: 0;
				}

				.label {
					color: #8a9099;
					width: 160rpx;
					flex-shrink: 0;
				}

				/* 内容稍微增粗，并且根据专票和普票错开不一样的颜色 */
				.val {
					flex: 1;
					word-break: break-all;
					font-weight: 500;

					&.val-special {
						color: #1d4ed8; /* 专票内容呈现微深蓝系 */
					}

					&.val-normal {
						color: #047857; /* 普票内容呈现微深绿系 */
					}
				}
			}
		}

		.ticket-footer {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 20rpx 32rpx;
			background-color: #fafbfd;
			border-top: 1px solid #f2f3f5;

			.right-group {
				display: flex;
			}

			.btn {
				font-size: 24rpx;
				height: 56rpx;
				line-height: 56rpx;
				padding: 0 28rpx;
				border-radius: 28rpx;
				text-align: center;
				margin-left: 16rpx;
				font-weight: 500;

				&.plain-blue {
					background: #eef2ff;
					border: 1px solid #d4e3ff;
					color: #2979ff;
				}

				&.plain {
					background: #ffffff;
					border: 1px solid #dcdfe6;
					color: #606266;
				}

				&.danger {
					background: #fff2f2;
					border: 1px solid #ffdbdb;
					color: #ff4d4f;
				}
			}
		}
	}

	/* 空状态样式 */
	.empty-state {
		text-align: center;
		padding-top: 200rpx;

		.empty-icon {
			font-size: 80rpx;
			display: block;
			margin-bottom: 20rpx;
		}

		.empty-title {
			font-size: 32rpx;
			font-weight: 600;
			color: #1a1a1a;
			display: block;
			margin-bottom: 8rpx;
		}

		.empty-desc {
			font-size: 26rpx;
			color: #909399;
			display: block;
			margin-bottom: 40rpx;
		}

		.empty-btn {
			display: inline-block;
			background: #2979ff;
			color: #ffffff;
			font-size: 28rpx;
			padding: 16rpx 60rpx;
			border-radius: 40rpx;
			box-shadow: 0 8rpx 16rpx rgba(41, 121, 255, 0.2);
		}
	}
</style>