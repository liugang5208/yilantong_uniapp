<template>
	<view class="edit-container">
		<!-- 自定义导航栏 -->
		<u-navbar :is-back="false" title="" :background="{ background: '#ffffff' }" :border-bottom="false">
			<view class="d_a_sb" style="width: 750rpx;">
				<view style="width: 200rpx;padding-left: 30rpx;" @click="back">
					<u-icon name="nav-back" color="#333333" :size="40"></u-icon>
				</view>
				<view style="font-size: 32rpx; color: #1a1a1a; font-weight: 600; text-align: center; flex-grow: 1;">添加发票资料</view>
				<view style="width: 200rpx;"></view>
			</view>
		</u-navbar>

		<!-- 悬浮微立体表单卡片 -->
		<view class="form-card">
			<!-- 纳税类别：悬浮胶囊选择器 -->
			<view class="selector-section">
				<text class="section-title">纳税类别 <text class="required">*</text></text>
				<view class="pill-group">
					<view 
						class="pill-item" 
						:class="{ 'active-tax': tex_type === 1 }" 
						@click="selectTaxType(1)">
						小规模纳税人
					</view>
					<view 
						class="pill-item" 
						:class="{ 'active-tax': tex_type === 2 }" 
						@click="selectTaxType(2)">
						一般纳税人
					</view>
				</view>
			</view>

			<!-- 发票类型：悬浮胶囊选择器（普票绿、专票蓝） -->
			<view class="selector-section">
				<text class="section-title">发票类型 <text class="required">*</text></text>
				<view class="pill-group">
					<view 
						class="pill-item" 
						:class="{ 'active-normal': ticket_type === 1 }" 
						@click="selectTicketType(1)">
						增值税普通发票
					</view>
					<view 
						class="pill-item" 
						:class="{ 'active-special': ticket_type === 2 }" 
						@click="selectTicketType(2)">
						增值税专用发票
					</view>
				</view>
			</view>

			<!-- 文本输入项 -->
			<view class="form-item">
				<text class="uni-label">公司名称</text>
				<input type="text" class="uni-input" placeholder="请输入公司名称" placeholder-style="color: #c0c4cc;" v-model="comp_name" />
			</view>

			<view class="form-item">
				<text class="uni-label">信用代码</text>
				<input type="text" class="uni-input" placeholder="请输入信用代码" placeholder-style="color: #c0c4cc;" v-model="comp_tex" />
			</view>

			<view class="form-item">
				<text class="uni-label">公司地址</text>
				<input type="text" class="uni-input" placeholder="请输入公司地址" placeholder-style="color: #c0c4cc;" v-model="comp_addr" />
			</view>

			<view class="form-item">
				<text class="uni-label">联系电话</text>
				<input type="text" class="uni-input" placeholder="请输入联系电话" placeholder-style="color: #c0c4cc;" v-model="comp_tele" />
			</view>

			<view class="form-item">
				<text class="uni-label">开户银行</text>
				<input type="text" class="uni-input" placeholder="请输入开户银行" placeholder-style="color: #c0c4cc;" v-model="comp_bank" />
			</view>

			<view class="form-item"> 
				<text class="uni-label">银行账户</text>
				<input type="text" class="uni-input" placeholder="请输入银行账户" placeholder-style="color: #c0c4cc;" v-model="bank_id" />
			</view>

			<!-- 开户行号（无选填字样，支持非必填） -->
			<view class="form-item">
				<text class="uni-label">开户行号</text>
				<input type="text" class="uni-input" placeholder="请输入开户行号" placeholder-style="color: #c0c4cc;" v-model="bank_sn" />
			</view>
		</view>

		<!-- 底部悬浮渐变大按钮 -->
		<view class="footer-btn-box">
			<button class="save-btn" @click="apply()">确认无误，提交上传</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				taxTypes: ['小规模纳税人', '一般纳税人'],
				invoiceTypes: ['增值税普通发票', '增值税专用发票'],
				comp_name: '',
				comp_tex: '',
				comp_addr: '',
				comp_tele: '',
				comp_bank: '',
				bank_id: '',
				bank_sn: '',
				tex_type: 1,      // 默认选中第一个
				ticket_type: 2,   // 默认选中第二个（专用发票）
				uid: '',
			};
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
				this.uid = userInfo.id
			}
		},
		methods: {
			selectTaxType(val) {
				this.tex_type = val;
			},
			selectTicketType(val) {
				this.ticket_type = val;
			},
			apply() {
				let that = this;

				// 逐项严格校验（开户行号 bank_sn 除外，因为是选填）
				if (!that.tex_type) {
					uni.showToast({ title: '请选择纳税类别', icon: 'none', duration: 2500 });
					return;
				}
				if (!that.ticket_type) {
					uni.showToast({ title: '请选择发票类型', icon: 'none', duration: 2500 });
					return;
				}
				if (!that.comp_name || that.comp_name.trim() === '') {
					uni.showToast({ title: '请输入公司名称', icon: 'none', duration: 2500 });
					return;
				}
				if (!that.comp_tex || that.comp_tex.trim() === '') {
					uni.showToast({ title: '请输入信用代码', icon: 'none', duration: 2500 });
					return;
				}
				if (!that.comp_addr || that.comp_addr.trim() === '') {
					uni.showToast({ title: '请输入公司地址', icon: 'none', duration: 2500 });
					return;
				}
				if (!that.comp_tele || that.comp_tele.trim() === '') {
					uni.showToast({ title: '请输入联系电话', icon: 'none', duration: 2500 });
					return;
				}
				if (!that.comp_bank || that.comp_bank.trim() === '') {
					uni.showToast({ title: '请输入开户银行', icon: 'none', duration: 2500 });
					return;
				}
				if (!that.bank_id || that.bank_id.trim() === '') {
					uni.showToast({ title: '请输入银行账户', icon: 'none', duration: 2500 });
					return;
				}

			    var param = {
			      uid: that.uid,
			      tex_type: that.tex_type,
			      ticket_type: that.ticket_type,
			      comp_name: that.comp_name.trim(),
			      comp_tex: that.comp_tex.trim(),
			      comp_addr: that.comp_addr.trim(),
			      comp_tele: that.comp_tele.trim(),
			      comp_bank: that.comp_bank.trim(),
			      bank_id: that.bank_id.trim(),
			      bank_sn: that.bank_sn ? that.bank_sn.trim() : '',
			    };
			    
				uni.showLoading({
					title: "添加中..."
				})
			    that.$api.ticket_addon(param).then(ret => {
					uni.hideLoading();
					uni.showToast({ title: '添加成功', icon: 'success', duration: 2000 });
					setTimeout(() => {
						uni.navigateBack();
					}, 1500);
			    }).catch(err => {
			      uni.hideLoading();
			    });
			},
			back() {
				uni.navigateBack();
			}
		}
	};
</script>

<style scoped lang="scss">
	.edit-container {
		background-color: #f4f6f9;
		min-height: 100vh;
		padding: 24rpx;
		padding-bottom: 120rpx;
	}

	/* 飞起来的悬浮微立体卡片 */
	.form-card {
		background: #ffffff;
		border-radius: 24rpx;
		padding: 10rpx 32rpx;
		box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.04);
		border: 1px solid rgba(0, 0, 0, 0.01);
	}

	/* 自定义选择块样式 */
	.selector-section {
		padding: 28rpx 0;
		border-bottom: 1px solid #f2f3f5;

		.section-title {
			font-size: 28rpx;
			color: #333333;
			font-weight: 500;
			display: block;
			margin-bottom: 16rpx;

			.required {
				color: #ff4d4f;
			}
		}

		.pill-group {
			display: flex;
			gap: 20rpx;

			.pill-item {
				flex: 1;
				height: 72rpx;
				line-height: 72rpx;
				text-align: center;
				font-size: 26rpx;
				color: #606266;
				background: #f7f8fa;
				border-radius: 16rpx;
				font-weight: 500;
				border: 1px solid transparent;
				transition: all 0.2s ease;

				/* 纳税类别选中态 */
				&.active-tax {
					color: #2979ff;
					background: #eef2ff;
					border-color: #d4e3ff;
					font-weight: 600;
				}

				/* 普票选中态（绿色） */
				&.active-normal {
					color: #07c160;
					background: #e8f8f0;
					border-color: #abebd0;
					font-weight: 600;
					box-shadow: 0 4rpx 12rpx rgba(7, 193, 96, 0.1);
				}

				/* 专票选中态（蓝色） */
				&.active-special {
					color: #2979ff;
					background: #eef2ff;
					border-color: #d4e3ff;
					font-weight: 600;
					box-shadow: 0 4rpx 12rpx rgba(41, 121, 255, 0.1);
				}
			}
		}
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
			flex-shrink: 0;
		}

		.uni-input {
			flex: 1;
			font-size: 28rpx;
			color: #1a1a1a;
			text-align: right;
		}
	}

	/* 底部悬浮按钮 */
	.footer-btn-box {
		margin-top: 50rpx;
		padding: 0 20rpx;

		.save-btn {
			background: linear-gradient(135deg, #2979ff, #1d60e5);
			color: #ffffff;
			font-size: 32rpx;
			font-weight: 600;
			height: 92rpx;
			line-height: 92rpx;
			border-radius: 46rpx;
			box-shadow: 0 8rpx 20rpx rgba(41, 121, 255, 0.3);
			border: none;
			
			&:active {
				opacity: 0.9;
			}
		}
	}
</style>