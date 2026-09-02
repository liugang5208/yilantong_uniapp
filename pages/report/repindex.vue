<template>
	<view class="modern-report-list-page">
			<!-- 状态栏高度动态占位 -->
			<view class="status-bar-placeholder"></view>
			
			<!-- 顶部的普通静态导航栏（随页面滚动） -->
			<view class="static-top-navbar">
			<view class="nav-bar-content">
				<view class="nav-left-box" @click="back">
					<u-icon name="arrow-left" color="#334155" :size="38"></u-icon>
				</view>
				<view class="nav-center-title">历史报价单</view>
				<!-- 精致克制的清空当前列表按钮 -->
				<view class="nav-right-box" @click="clearCurrentList">
					<text class="clear-icon">🗑️</text>
					<text class="clear-btn-text">清空列表</text>
				</view>
			</view>
		</view>

		<!-- 搜索与多维筛选控制栏 -->
		<view class="filter-container">
			<view class="search-box">
				<u-icon name="search" color="#94a3b8" size="32"></u-icon>
				<input 
					type="text" 
					v-model="searchKeyword" 
					placeholder="搜索询价单位/报价单位/项目名称" 
					placeholder-class="search-placeholder"
				/>
				<u-icon v-if="searchKeyword" name="close-circle-fill" color="#cbd5e1" size="32" @click="clearSearch"></u-icon>
			</view>
			
			<!-- 快捷时间筛选标签（“全部”右上角采用更大、更鲜艳的明亮蓝色正圆角标） -->
			<view class="time-tabs">
				<view 
					v-for="(tab, idx) in timeTabs" 
					:key="idx" 
					:class="['tab-item', currentTab === tab.value ? 'active-tab' : '']"
					@click="switchTab(tab.value)"
				>
					<text class="tab-dot" :class="currentTab === tab.value ? 'dot-active-time' : 'dot-time'"></text>
					<text>{{ tab.name }}</text>
				</view>
			</view>

			<!-- 税率分类筛选Tab（不含发票、普通税票、专用税票，采用鲜艳醒目的红色大圆标） -->
			<view class="tax-filter-tabs">
				<view 
					v-for="(tax, tIdx) in taxTabs" 
					:key="tIdx" 
					:class="['tax-tab-item', currentTaxTab === tax.value ? 'active-tax-tab' : '']"
					@click="switchTaxTab(tax.value)"
				>
					<text class="tax-text-label">{{ tax.name }}</text>
					<!-- 优化后的鲜艳大圆红标 -->
					<text class="tax-badge-circle" v-if="getTaxCount(tax.value) > 0">{{ getTaxCount(tax.value) }}</text>
				</view>
			</view>
		</view>

		<!-- 列表主体区域 -->
		<view class="list-container">
			<view class="empty-state" v-if="filteredList.length === 0">
				<u-icon name="file-text" color="#cbd5e1" size="80" style="margin-bottom: 20rpx;"></u-icon>
				<text>暂无符合条件的报价单记录</text>
			</view>

			<!-- 报价单卡片 -->
			<view class="report-card-item" v-for="(item, index) in filteredList" :key="item.id || index">
				<!-- 卡片头部 -->
				<view class="card-header-banner">
					<view class="time-box">
						<text class="time-icon">🕒</text>
						<text class="time-text">{{ item.time_zone || '未知时间' }}</text>
					</view>
					<view class="card-index-badge">
						<text class="index-symbol">No.</text>
						<text class="index-num">{{ filteredList.length - index }}</text>
					</view>
				</view>

				<!-- 卡片核心内容网格 -->
				<view class="card-body-grid">
					<view class="grid-row main-highlight-row">
						<view class="left-info">
							<text class="g-label">订单金额：</text>
							<text :class="['money-num', (item.ratio || 0) < 0 ? 'text-green' : 'text-red']">
								¥{{ item.money || 0 }}
							</text>
						</view>
						<text class="goods-count-tag">{{ item.goods_count || 0 }}条商品</text>
					</view>

					<view class="sub-info-grid">
						<view class="sub-row">
							<text class="g-label">税率类型：</text>
							<text :class="['tax-pill', getTaxPillClass(item.ticket)]">
								{{ getTaxLabel(item.ticket) }}
							</text>
						</view>

						<view class="sub-row" v-if="item.ratio">
							<text class="g-label">上调比例：</text>
							<text :class="['g-val', (item.ratio || 0) < 0 ? 'text-green' : 'text-amber']">
								{{ item.ratio > 0 ? '+' + item.ratio : item.ratio }}%
							</text>
						</view>

						<view class="sub-row" v-if="false">
							<text class="g-label">付款方式：</text>
							<text class="g-val text-blue text-ellipsis">{{ item.check_type }}</text>
						</view>

						<view class="sub-row" v-if="item.rep_comp">
							<text class="g-label">报价单位：</text>
							<text class="g-val text-ellipsis" style="background-color: #f1f5f9; color: #334155; padding: 4rpx 16rpx; border-radius: 6rpx; font-size: 24rpx;">{{ item.rep_comp }}</text>
						</view>

						<view class="sub-row" v-if="item.question_comp">
							<text class="g-label">询价单位：</text>
							<text class="g-val text-ellipsis" style="background-color: #fef3c7; color: #b45309; padding: 4rpx 16rpx; border-radius: 6rpx; font-size: 24rpx;">{{ item.question_comp }}</text>
						</view>

						<view class="sub-row" v-if="item.project_comp">
							<text class="g-label">项目名称：</text>
							<text class="g-val text-ellipsis" style="background-color: #f1f5f9; color: #dc2626; padding: 4rpx 16rpx; border-radius: 6rpx; font-size: 24rpx;">{{ item.project_comp }}</text>
						</view>
					</view>
				</view>

				<!-- 卡片底部操作按钮 -->
				<view class="card-footer-actions">
					<button class="action-btn-item btn-sub-action" @click="copyReportSummary(item)">复制摘要</button>
					<button class="action-btn-item btn-danger-action" @click="promptDelete(item.id)">删除</button>
					<button class="action-btn-item btn-sub-action" @click="promptReportAgain(item.id)">引用</button>
					<button class="action-btn-item btn-primary-highlight" @click="gotoinfo(item)">详情</button>
				</view>
			</view>
		</view>
		
		<view class="bottom-spacer"></view>

		<!-- 右下角浮现的置底小图标（半透明微型悬浮球） -->
		<view :class="['scroll-fab scroll-fab-bottom', showScrollToBottom ? 'fab-show' : '']" @click="scrollToBottom">
			<text class="fab-icon">▼</text>
			<text class="fab-text">底部</text>
		</view>

		<!-- 右下角浮现的返回顶部小图标（半透明微型悬浮球） -->
		<view :class="['scroll-fab scroll-fab-top', showBackToTop ? 'fab-show' : '']" @click="scrollToTop">
			<text class="fab-icon">▲</text>
			<text class="fab-text">顶部</text>
		</view>

		<!-- 自定义高颜值模态弹窗 -->
		<view class="custom-modal-mask" v-if="modalConfig.show" @tap.stop="closeCustomModal">
			<view class="custom-modal-container" @tap.stop="">
				<view class="modal-header-icon" :class="modalConfig.type === 'danger' ? 'icon-danger-bg' : 'icon-warning-bg'">
					<text class="modal-icon-symbol">{{ modalConfig.type === 'danger' ? '🗑️' : '💡' }}</text>
				</view>
				<view class="modal-title">{{ modalConfig.title }}</view>
				<view class="modal-content-text">{{ modalConfig.content }}</view>
				<view class="modal-footer-btns">
					<button class="modal-btn-cancel" @click="closeCustomModal">取消</button>
					<button 
						:class="['modal-btn-confirm', modalConfig.type === 'danger' ? 'btn-confirm-danger' : 'btn-confirm-primary']" 
						@click="handleModalConfirm"
					>
						{{ modalConfig.confirmText || '确定' }}
					</button>
				</view>
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
				searchKeyword: '',
				currentTab: 'all',
				currentTaxTab: '0', 
				showBackToTop: false,
				showScrollToBottom: true, // 默认在顶部时显示“置底”图标
				timeTabs: [
					{ name: '全部', value: 'all' },
					{ name: '本月', value: 'month' },
					{ name: '近3个月', value: 'recent3' }
				],
				taxTabs: [
					{ name: '不含税票', value: '0' },
					{ name: '普通税票', value: '1' },
					{ name: '专用税票', value: '2' }
				],
				modalConfig: {
					show: false,
					type: 'warning',
					title: '',
					content: '',
					confirmText: '确定',
					callback: null
				}
			}
		},
		computed: {
			totalListCount() {
				if (!this.list || this.list.length === 0) return 0;
				let baseList = this.list.filter(item => String(item.ticket) === String(this.currentTaxTab));
				return baseList.length;
			},
			filteredList() {
				let result = this.list || [];
				
				if (this.searchKeyword.trim() !== '') {
					const keyword = this.searchKeyword.trim().toLowerCase();
					result = result.filter(item => {
						const repComp = (item.rep_comp || '').toLowerCase();
						const questionComp = (item.question_comp || '').toLowerCase();
						const projectComp = (item.project_comp || '').toLowerCase();
						return repComp.includes(keyword) || questionComp.includes(keyword) || projectComp.includes(keyword);
					});
				}
				
				if (this.currentTaxTab !== 'all') {
					result = result.filter(item => {
						return String(item.ticket) === String(this.currentTaxTab);
					});
				}
				
				if (this.currentTab !== 'all') {
					const now = new Date();
					const currentYear = now.getFullYear();
					const currentMonth = now.getMonth();
					
					result = result.filter(item => {
						if (!item.time_zone) return false;
						const itemDate = new Date(item.time_zone.replace(/-/g, '/'));
						if (isNaN(itemDate.getTime())) return true;
						
						if (this.currentTab === 'month') {
							return itemDate.getFullYear() === currentYear && itemDate.getMonth() === currentMonth;
						} else if (this.currentTab === 'recent3') {
							const threeMonthsAgo = new Date();
							threeMonthsAgo.setMonth(currentMonth - 3);
							return itemDate >= threeMonthsAgo;
						}
						return true;
					});
				}
				
				return result;
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
		onPageScroll(e) {
			// 控制“返回顶部”图标的显示与隐藏
			if (e.scrollTop > 300) {
				if (!this.showBackToTop) this.showBackToTop = true;
			} else {
				if (this.showBackToTop) this.showBackToTop = false;
			}

			// 控制“置底”图标的显示与隐藏（当接近顶部小于 100px 时显示，往下滚动就隐藏）
			if (e.scrollTop < 100) {
				if (!this.showScrollToBottom) this.showScrollToBottom = true;
			} else {
				if (this.showScrollToBottom) this.showScrollToBottom = false;
			}
		},
		methods: {
			doIninit() {
				let that = this;
				var params = { uid: that.uid };
				that.$api.replist(params).then(ret => {
					that.list = ret.data || [];
				}).catch(err => {
					that.list = [];
				});
			},
			back() {
				uni.navigateBack();
			},
			clearSearch() {
				this.searchKeyword = '';
			},
			switchTab(tabVal) {
				this.currentTab = tabVal;
			},
			switchTaxTab(taxVal) {
				this.currentTaxTab = taxVal;
			},
			scrollToTop() {
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 350
				});
			},
			// 点击置底：动态获取页面实际总高度，实现带有视觉过渡的平滑滚动到底部
			scrollToBottom() {
				uni.createSelectorQuery().in(this).select('.modern-report-list-page').boundingClientRect(res => {
					if (res) {
						let targetHeight = res.height;
						let scrollDuration = Math.min(Math.max(targetHeight / 3, 300), 800);
						uni.pageScrollTo({
							scrollTop: targetHeight,
							duration: scrollDuration
						});
					} else {
						uni.pageScrollTo({
							scrollTop: 99999,
							duration: 600
						});
					}
				}).exec();
			},
			getTaxCount(taxVal) {
				if (!this.list || this.list.length === 0) return 0;
				return this.list.filter(item => String(item.ticket) === String(taxVal)).length;
			},
			getTaxLabel(ticket) {
				if (ticket == 0) return '不含税票';
				if (ticket == 1) return '增值税普通税票';
				if (ticket == 2) return '增值税专用税票';
				return '常规税票';
			},
			getTaxPillClass(ticket) {
				if (ticket == 0) return 'pill-gray';
				if (ticket == 1) return 'pill-blue';
				if (ticket == 2) return 'pill-purple';
				return 'pill-gray';
			},
			copyReportSummary(item) {
				const taxText = this.getTaxLabel(item.ticket);
				const summaryText = `【报价单摘要】\n` +
					`生成时间：${item.time_zone || '无'}\n` +
					(item.question_comp ? `询价单位：${item.question_comp}\n` : '') +
					(item.rep_comp ? `报价单位：${item.rep_comp}\n` : '') +
					(item.project_comp ? `项目名称：${item.project_comp}\n` : '') +
					`商品数量：${item.goods_count || 0}条\n` +
					`订单金额：¥${item.money || 0}\n` +
					`税率类型：${taxText}\n` +
					(item.check_type ? `付款方式：${item.check_type}` : '');

				uni.setClipboardData({
					data: summaryText,
					success: () => {
						uni.showToast({ title: '摘要已复制', icon: 'success' });
					}
				});
			},
			clearCurrentList() {
				let that = this;
				const targetList = that.filteredList;

				if (targetList.length === 0) {
					uni.showToast({ title: '当前列表已经是空的', icon: 'none' });
					return;
				}

				let viewTypeName = '不含税票';
				if (that.currentTaxTab === '1') viewTypeName = '普通税票';
				else if (that.currentTaxTab === '2') viewTypeName = '专用税票';

				this.showCustomModal({
					type: 'danger',
					title: '清空当前列表确认',
					content: `当前【${viewTypeName}】视图下共有 ${targetList.length} 条报价单记录，确定要全部清空吗？清空后将无法恢复。`,
					confirmText: '确认清空',
					callback: () => {
						let deletePromises = targetList.map(item => that.$api.repdel({ id: item.id }));
						Promise.all(deletePromises).then(() => {
							uni.showToast({ title: '当前列表已清空', icon: 'success' });
							that.doIninit();
						}).catch(() => {
							uni.showToast({ title: '部分清理失败', icon: 'none' });
							that.doIninit();
						});
					}
				});
			},
			promptDelete(ids) {
				let that = this;
				this.showCustomModal({
					type: 'danger',
					title: '删除提示',
					content: '确定要删除该条报价记录吗？删除后列表序号将自动补位更新。',
					confirmText: '确认删除',
					callback: () => {
						that.$api.repdel({ id: ids }).then(ret => {
							uni.showToast({ title: '已删除', icon: 'success' });
							that.doIninit();
						});
					}
				});
			},
			async promptReportAgain(id) {
				try {
					let res = await this.$api.checkReport({ uid: this.uid });
					let msg = "确定要引用该历史报价单吗？系统将自动对比并更新至最新商品价格。";
					if (res && res.data && res.data.report_count > 0) {
						msg = '当前存在未完成的报价草稿，继续引用将会清除未完成的数据，是否继续？';
					}
					this.showCustomModal({
						type: 'warning',
						title: '引用提示',
						content: msg,
						confirmText: '确认引用',
						callback: () => {
							this.$api.reportAgain({
								uid: this.uid,
								id: id
							}).then(ret => {
								let tipText = '引用成功，已更新最新行情';
								if (ret && ret.data && ret.data.invalid_notice) {
									tipText = ret.data.invalid_notice;
								}
								uni.showToast({ title: tipText, icon: 'none', duration: 2500 });
								uni.navigateTo({ url: '/pages/report/repinfos' });
								this.doIninit();
							}).catch(err => {
								uni.showToast({
									title: err.data && err.data.msg ? err.data.msg : '引用失败',
									icon: 'none'
								});
							});
						}
					});
				} catch (e) {
					console.error(e);
				}
			},
			showCustomModal(config) {
				this.modalConfig = {
					show: true,
					type: config.type || 'warning',
					title: config.title || '提示',
					content: config.content || '',
					confirmText: config.confirmText || '确定',
					callback: config.callback || null
				};
			},
			closeCustomModal() {
				this.modalConfig.show = false;
			},
			handleModalConfirm() {
				const cb = this.modalConfig.callback;
				this.closeCustomModal();
				if (typeof cb === 'function') {
					cb();
				}
			},
			gotoinfo(info) {
				uni.navigateTo({ url: '/pages/report/repdata?id=' + info.id });
			}
		}
	}
</script>

<style scoped lang="scss">
/* 状态栏高度动态适配 */
.status-bar-placeholder {
	height: var(--status-bar-height, 44px);
	width: 100%;
}
	.modern-report-list-page {
		background-color: #e8ecef;
		min-height: 100vh;
		padding: 20rpx;
		box-sizing: border-box;
		font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
	}

	/* 顶部静态导航栏 */
	.static-top-navbar {
		background-color: #ffffff;
		height: 88rpx;
		display: flex;
		align-items: center;
		border-radius: 16rpx;
		margin-bottom: 24rpx;
		box-shadow: 0 4rpx 12rpx rgba(15, 23, 42, 0.05);
	}

	.nav-bar-content {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		padding: 0 24rpx;
		box-sizing: border-box;

		.nav-left-box {
			display: flex;
			align-items: center;
		}

		.nav-center-title {
			font-size: 32rpx;
			color: #0f172a;
			font-weight: bold;
		}

		.nav-right-box {
			background: #f8fafc;
			border: 1rpx solid #cbd5e1;
			padding: 6rpx 16rpx;
			border-radius: 10rpx;
			display: flex;
			align-items: center;
			gap: 6rpx;
			box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.02);

			.clear-icon {
				font-size: 20rpx;
			}

			.clear-btn-text {
				font-size: 24rpx;
				color: #475569;
				font-weight: 600;
			}
		}
	}

	.filter-container {
		margin-bottom: 24rpx;

		.search-box {
			background: #ffffff;
			border-radius: 16rpx;
			display: flex;
			align-items: center;
			padding: 16rpx 24rpx;
			box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.04);
			border: 1rpx solid #cbd5e1;

			input {
				flex: 1;
				font-size: 26rpx;
				margin-left: 12rpx;
				color: #1e293b;
			}

			.search-placeholder {
				color: #94a3b8;
				font-size: 26rpx;
			}
		}

		.time-tabs {
			display: flex;
			gap: 16rpx;
			margin-top: 16rpx;

			.tab-item {
				flex: 1;
				background: #ffffff;
				text-align: center;
				padding: 14rpx 0;
				font-size: 24rpx;
				color: #64748b;
				border-radius: 12rpx;
				border: 1rpx solid #cbd5e1;
				font-weight: 500;
				display: flex;
				align-items: center;
				justify-content: center;
				gap: 8rpx;
				position: relative; 
				box-shadow: 0 2rpx 6rpx rgba(0,0,0,0.02);

				.tab-dot {
					width: 10rpx;
					height: 10rpx;
					border-radius: 50%;
					background: #cbd5e1;
					&.dot-active-time {
						background: #d97706;
					}
				}

				/* “全部”角标：正圆形，明亮蓝 */
				.all-total-badge {
					position: absolute;
					top: -12rpx;
					right: -10rpx;
					background: #2563eb;
					color: #ffffff;
					font-size: 22rpx;
					width: 38rpx;
					height: 38rpx;
					border-radius: 50%;
					display: flex;
					align-items: center;
					justify-content: center;
					font-weight: bold;
					box-shadow: 0 3rpx 8rpx rgba(37, 99, 235, 0.4);
					border: 2rpx solid #ffffff;
					z-index: 2;
					line-height: 1;
				}

				&.active-tab {
					background: #fef3c7;
					color: #b45309;
					border-color: #fde68a;
					font-weight: bold;
				}
			}
		}

		/* 税率分类筛选：正圆形，鲜艳红 */
		.tax-filter-tabs {
			display: flex;
			gap: 12rpx;
			margin-top: 14rpx;

			.tax-tab-item {
				flex: 1;
				background: #ffffff;
				text-align: center;
				padding: 18rpx 4rpx;
				font-size: 24rpx;
				white-space: nowrap;
				color: #475569;
				border-radius: 12rpx;
				border: 1rpx solid #cbd5e1;
				font-weight: 600;
				position: relative; 
				display: flex;
				align-items: center;
				justify-content: center;
				box-shadow: 0 2rpx 6rpx rgba(0,0,0,0.02);

				.tax-text-label {
					line-height: 1;
				}

				.tax-badge-circle {
					position: absolute;
					top: -12rpx;
					right: -10rpx;
					background: #f43f5e;
					color: #ffffff;
					font-size: 22rpx;
					width: 38rpx;
					height: 38rpx;
					border-radius: 50%;
					display: flex;
					align-items: center;
					justify-content: center;
					font-weight: bold;
					box-shadow: 0 3rpx 8rpx rgba(244, 63, 94, 0.45);
					border: 2rpx solid #ffffff; 
					z-index: 2;
					line-height: 1;
				}

				&.active-tax-tab {
					background: #eff6ff;
					color: #1d4ed8;
					border-color: #93c5fd;
					font-weight: bold;
				}
			}
		}
	}

	.list-container {
		margin-top: 10rpx;
	}

	.empty-state {
		background: #ffffff;
		border-radius: 18rpx;
		padding: 80rpx 30rpx;
		text-align: center;
		color: #94a3b8;
		font-size: 26rpx;
		box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.05);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	/* 卡片整体样式 */
	.report-card-item {
		background: #ffffff;
		border-radius: 20rpx;
		margin-bottom: 36rpx;
		box-shadow: 0 12rpx 32rpx rgba(15, 23, 42, 0.08), 0 2rpx 8rpx rgba(15, 23, 42, 0.04);
		border: 2rpx solid #cbd5e1;
		overflow: hidden;

		.card-header-banner {
			background: #fef3c7;
			padding: 14rpx 22rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			border-bottom: 1rpx solid #e2e8f0;

			.time-box {
				display: flex;
				align-items: center;
				gap: 6rpx;

				.time-text {
					font-size: 26rpx;
					color: #1e293b;
					font-weight: bold;
				}
			}

			.card-index-badge {
				display: flex;
				align-items: center;
				gap: 4rpx;
				background: #f1f5f9;
				color: #64748b;
				padding: 2rpx 14rpx;
				border-radius: 20rpx;
				border: 1rpx solid #cbd5e1;

				.index-symbol {
					font-size: 18rpx;
					opacity: 0.8;
					font-weight: 500;
				}

				.index-num {
					font-size: 22rpx;
					font-weight: bold;
					color: #475569;
				}
			}
		}

		.card-body-grid {
			padding: 20rpx 22rpx;

			.main-highlight-row {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 14rpx;
				padding-bottom: 14rpx;
				border-bottom: 1rpx dashed #e2e8f0;

				.left-info {
					display: flex;
					align-items: baseline;
					gap: 6rpx;

					.g-label {
						font-size: 26rpx;
						color: #64748b;
					}

					.money-num {
						font-size: 34rpx;
						font-weight: bold;
					}
				}

				.goods-count-tag {
					font-size: 24rpx;
					background: #f1f5f9;
					color: #1e293b;
					padding: 2rpx 12rpx;
					border-radius: 8rpx;
					font-weight: bold;
					border: 1rpx solid #e2e8f0;
				}
			}

			.sub-info-grid {
				display: flex;
				flex-direction: column;
				gap: 10rpx;

				.sub-row {
					display: flex;
					justify-content: space-between;
					align-items: center;
					font-size: 26rpx;

					.g-label {
						color: #64748b;
						flex-shrink: 0;
					}

					/* 已淡化、缩小的右侧卡片明细文字样式 */
					.g-val {
						color: #64748b;         
						font-size: 24rpx;       
						font-weight: 500;       
						text-align: right;
					}
				}
			}

			.tax-pill {
				font-size: 24rpx;
				padding: 2rpx 14rpx;
				border-radius: 8rpx;
				font-weight: bold;

				&.pill-gray {
					background: #1e3a8a;
					color: #ffffff;
					border: 1rpx solid #3b82f6;
				}
				&.pill-blue {
					background: #065f46;
					color: #ffffff;
					border: 1rpx solid #10b981;
				}
				&.pill-purple {
					background: #701a75;
					color: #ffffff;
					border: 1rpx solid #d946ef;
				}
			}

			.text-green { color: #16a34a !important; }
			.text-red { color: #dc2626 !important; }
			.text-amber { color: #d97706 !important; }
			
			/* 付款方式等蓝色高亮文字配套微调 */
			.text-blue { 
				color: #3b82f6 !important; 
				font-size: 24rpx !important;
				font-weight: 600 !important; 
			}
			
			.text-ellipsis {
				max-width: 440rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
		}

		/* 卡片底部4个操作按钮 */
		.card-footer-actions {
			display: flex;
			gap: 14rpx;
			padding: 16rpx 22rpx 20rpx 22rpx;
			background: #f8fafc;
			border-top: 1rpx solid #e2e8f0;

			.action-btn-item {
				flex: 1;
				height: 64rpx;
				border-radius: 12rpx;
				font-size: 24rpx;
				font-weight: bold;
				display: flex;
				align-items: center;
				justify-content: center;
				margin: 0;
				padding: 0;

				&.btn-sub-action {
					background: #ffffff;
					color: #475569;
					border: 1rpx solid #cbd5e1;
					box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.02);
				}

				&.btn-danger-action {
					background: #fff5f5;
					color: #e11d48;
					border: 1rpx solid #fecdd3;
				}

				&.btn-primary-highlight {
					background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
					color: #ffffff;
					border: none;
					box-shadow: 0 4rpx 12rpx rgba(245, 158, 11, 0.35);
				}
			}
		}
	}

	/* 右下角悬浮通用样式（微型化、高半透明、不遮挡内容） */
	.scroll-fab {
		position: fixed;
		right: 30rpx;
		width: 72rpx;   
		height: 72rpx;
		background: rgba(30, 41, 59, 0.45); 
		backdrop-filter: blur(4px);
		border-radius: 50%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		color: rgba(255, 255, 255, 0.85); 
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.12);
		z-index: 998;
		opacity: 0;
		visibility: hidden;
		transform: translateY(15rpx);
		transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
		border: 1rpx solid rgba(255, 255, 255, 0.2);

		&.fab-show {
			opacity: 1;
			visibility: visible;
			transform: translateY(0);
		}

		.fab-icon {
			font-size: 18rpx;
			line-height: 1;
			margin-bottom: 1rpx;
		}

		.fab-text {
			font-size: 16rpx;
			font-weight: 600;
			letter-spacing: 0.5rpx;
		}
	}

	.scroll-fab-bottom {
		bottom: 70rpx; 
	}

	.scroll-fab-top {
		bottom: 156rpx; 
	}

	/* 自定义高颜值模态弹窗 */
	.custom-modal-mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(15, 23, 42, 0.6);
		backdrop-filter: blur(4px);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 9999;
		animation: fadeInMask 0.2s ease-out;

		.custom-modal-container {
			background: #ffffff;
			width: 82%;
			max-width: 600rpx;
			border-radius: 24rpx;
			padding: 40rpx 30rpx 30rpx 30rpx;
			box-shadow: 0 20rpx 40rpx rgba(0, 0, 0, 0.15);
			display: flex;
			flex-direction: column;
			align-items: center;
			text-align: center;
			animation: scaleUpModal 0.2s cubic-bezier(0.16, 1, 0.3, 1);
			border: 1rpx solid #e2e8f0;

			.modal-header-icon {
				width: 88rpx;
				height: 88rpx;
				border-radius: 50%;
				display: flex;
				align-items: center;
				justify-content: center;
				margin-bottom: 24rpx;
				font-size: 38rpx;

				&.icon-danger-bg {
					background: #fff1f2;
					border: 2rpx solid #fee2e2;
				}

				&.icon-warning-bg {
					background: #fef3c7;
					border: 2rpx solid #fde68a;
				}
			}

			.modal-title {
				font-size: 32rpx;
				font-weight: bold;
				color: #0f172a;
				margin-bottom: 14rpx;
			}

			.modal-content-text {
				font-size: 28rpx;
				color: #64748b;
				line-height: 1.5;
				margin-bottom: 36rpx;
				padding: 0 10rpx;
			}

			.modal-footer-btns {
				display: flex;
				gap: 20rpx;
				width: 100%;

				button {
					flex: 1;
					height: 80rpx;
					border-radius: 14rpx;
					font-size: 28rpx;
					font-weight: bold;
					display: flex;
					align-items: center;
					justify-content: center;
					margin: 0;
					border: none;
				}

				.modal-btn-cancel {
					background: #f1f5f9;
					color: #475569;
					border: 1rpx solid #cbd5e1 !important;
				}

				.modal-btn-confirm {
					color: #ffffff;

					&.btn-confirm-danger {
						background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
						box-shadow: 0 4rpx 12rpx rgba(239, 68, 68, 0.35);
					}

					&.btn-confirm-primary {
						background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
						box-shadow: 0 4rpx 12rpx rgba(245, 158, 11, 0.35);
					}
				}
			}
		}
	}

	@keyframes fadeInMask {
		from { opacity: 0; }
		to { opacity: 1; }
	}

	@keyframes scaleUpModal {
		from { opacity: 0; transform: scale(0.9); }
		to { opacity: 1; transform: scale(1); }
	}

	.bottom-spacer {
		height: 60rpx;
	}

	@media screen and (min-width: 768px) {
		.modern-report-list-page {
			max-width: 750rpx;
			margin: 0 auto;
		}
	}
</style>