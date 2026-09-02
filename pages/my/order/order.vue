<template>
	<view class="container">
		<!-- 顶部分类导航栏 & 右侧精致筛选按钮 -->
		<view class="nav">
			<view :class="navi==0?'active':''" class="nav_item" @click="changeNav(0)">
				<text class="nav-text">待付款</text>
				<text class="nav-badge badge-pay" v-if="payCount > 0">{{ payCount }}</text>
			</view>
			<view :class="navi==1?'active':''" class="nav_item" @click="changeNav(1)">
				<text class="nav-text">待发货</text>
				<text class="nav-badge" v-if="deliverCount > 0">{{ deliverCount }}</text>
			</view>
			<view :class="navi==2?'active':''" class="nav_item" @click="changeNav(2)">
				<text class="nav-text">待收货</text>
				<text class="nav-badge" v-if="receiveCount > 0">{{ receiveCount }}</text>
			</view>
			<view :class="navi==3?'active':''" class="nav_item" @click="changeNav(3)">
				<text class="nav-text">已完成</text>
			</view>
			<!-- 需求6&7：顶部右侧精致筛选按钮 -->
			<view class="nav_filter_btn" @click="openFilterDrawer">
				<text class="filter-icon-symbol">🔍</text>
				<text class="filter-text">筛选</text>
				<text class="filter-active-dot" v-if="hasActiveFilter"></text>
			</view>
		</view>

		<view class="panel">
			<!-- 需求2：当待付款或其他页面无信息时，增加友好、自然的空状态展示，避免页面太空旷 -->
			<view class="empty-state-box" v-if="!displayedList || displayedList.length === 0">
				<text class="empty-icon">📭</text>
				<text class="empty-text">暂无相关订单数据</text>
				<text class="empty-subtext">您可以切换其他状态标签，或点击右上角筛选试试看</text>
			</view>

			<view :class="['panel_box', item._zebraAlt ? 'panel-zebra-alt' : '', activeCardId === item.id ? 'panel-pressed' : '']" v-for="(item, index) in displayedList" :key="item.id" @click="handleCardTap(item.id)">
				
				<!-- 1. 头部：单号与状态 -->
				<view class="panel_header">
					<view class="header_left">
						<view class="sn-row">
							<text :class="['order-index-badge', item._zebraAlt ? 'index-badge-alt' : '']">NO.{{ formatIndex(item._realIndex) }}</text>
							<view class="sn-copy-wrap" @tap.stop="copyOrderSummary(item)">
								<text class="sn-text">单号：{{item.sn}}</text>
								<text class="copy-icon" title="复制整单摘要">📋</text>
							</view>
						</view>
						<text class="date-text">下单时间：{{ getOrderTime(item) }}</text>
					</view>
					<view :class="['status-badge', 'status-' + item.status]">
						{{item.o_name}}
					</view>
				</view>

				<!-- 2. 中部 -->
				<view class="panel_middle_bar">
					<view class="middle_row">
						<div class="data-group">
							<text class="label-gray">品名项数：</text>
							<text class="val-highlight-blue">{{item.oinfo ? item.oinfo.length : 0}}</text>
							<text class="label-unit">项</text>
						</div>
						<text class="data-group">
							<text class="label-gray">总数量：</text>
							<text class="val-highlight-blue">{{item.count}}</text>
						</text>
					</view>

					<view class="middle_row attribute_row">
						<view class="tag-group-left triple-tags">
						    <text :class="['tax-tag', getTaxClass(item)]">{{ getTaxText(item) }}</text>
						    <text class="paymode-tag-inline">{{ getPayModeText(item.paymode) }}</text>
						    <text class="paytype-tag-inline" v-if="getPayChannelText(item)">{{ getPayChannelText(item) }}</text>
						    <text class="paytype-tag-inline" style="border-color: #ffccc7; color: #ff4d4f; background-color: #fff5f5;" v-if="String(item.paymode) === '1'">物流代收</text>
						    
						    <text class="paytype-tag-inline" style="color: #faad14;" v-if="String(item.paymode) === '3' && item.status == 0">凭证待上传</text>
						    <text class="paytype-tag-inline" style="color: #1890ff;" v-if="String(item.paymode) === '3' && item.status == 1">凭证待审核</text>
						    <text class="paytype-tag-inline" style="color: #52c41a;" v-if="String(item.paymode) === '3' && item.status >= 2">凭证已通过</text>
						</view>
					</view>

					<view class="middle_row amount_row">
						<div class="footer-placeholder"></div>
						<div class="money-wrap">
							<text class="label-gray" style="margin-right: 8rpx;">订单应付总金额：</text>
							<text class="money-symbol">¥</text>
							<text class="money-highlight">{{ String(item.paymode) === '1' ? getCodPaidMoney(item) : item.money }}</text>
						</div>
					</view>

					<!-- 需求2：物流代收展示比例调整为50%+50% -->
					<view class="cod_vertical_row" v-if="String(item.paymode) === '1'">
						<view class="cod_col">
							<text class="c_sub_label">订单总额</text>
							<text class="c_sub_val dark">¥{{item.money}}</text>
						</view>
						<view class="c_vertical_divider"></view>
						<view class="cod_col">
							<text class="c_sub_label">在线支付(50%)</text>
							<text class="c_sub_val green">¥{{ getCodPaidMoney(item) }}</text>
						</view>
						<view class="cod_col">
							<text class="c_sub_label">物流代收(50%)</text>
							<text class="c_sub_val orange">¥{{ getCodCollectMoney(item) }}</text>
						</view>
					</view>
				</view>

				<!-- 3. 底部操作按钮区 -->
				<view class="panel_footer_btn" @tap.stop="">
					<view class="footer-placeholder"></view>
					<view class="btn-group">
						<button v-if="item.status==0 && item.paymode==3" class="btn-primary-soft" @click="gotoInfos(item.id)">上传付款截图</button>
						<button v-if="item.status==0 && item.paymode==4" class="btn-primary-soft" @click="handleSignMerchantOrder(item)">协议商户订单</button>
						<button v-if="item.status==0 && item.paymode!=3 && item.paymode!=4" class="btn-primary-soft" @click="setPay(item)">立即付款</button>
						<button v-if="item.status==0" class="btn-default-soft" @click="promptCancelOrder(item.id)">取消订单</button>
						<button v-if="item.status==1" class="btn-primary-soft" @click="gotoInfos(item.id)">订单详情</button>
						<button v-if="item.status==2" class="btn-primary-soft" @click="openLogisticsModal(item)">物流信息</button>
						<!-- 需求5：待收货页面增加手动确认收货按钮 -->
						<button v-if="item.status==2" class="btn-danger-soft" @click="do_fixed(item.id,3)">确认收货</button>
						<button v-if="item.status==3" class="btn-primary-soft" @click="openLogisticsModal(item)">物流信息</button>
						<button v-if="item.status==3" class="btn-default-soft" @click="gotoInfos(item.id)">订单详情</button>
					</view>
				</view>

			</view>

			<!-- 需求7：当使用筛选功能时，筛选出来的结果页面在底部增加一个统计板块 -->
			<view class="filter-stats-footer-card" v-if="appliedFilter">
				<view class="stats-title-row">
					<text class="stats-title-text">📊 筛选结果统计面板</text>
					<text class="stats-count-tag">共 {{ displayedList.length }} 笔订单</text>
				</view>
				<view class="stats-detail-row">
					<text class="stats-label">已选筛选条件：</text>
					<text class="stats-value-text">{{ getActiveFilterDescription() }}</text>
				</view>
				<view class="stats-amount-row">
					<text class="stats-label">筛选订单总计金额：</text>
					<text class="stats-money-symbol">¥</text>
					<text class="stats-money-val">{{ getFilteredTotalMoney() }}</text>
				</view>
			</view>
		</view>

		<view v-if="showScrollBtn" class="smart-scroll-fab" @click="handleScrollAction">
			<text class="fab-icon">{{ isAtTop ? '⬇' : '⬆' }}</text>
			<text class="fab-text">{{ isAtTop ? '置底' : '置顶' }}</text>
		</view>

		<view class="custom-modal-mask" v-if="showCancelModal" @tap.stop="closeCancelModal">
			<view class="custom-modal-box" @tap.stop="">
				<view class="modal-header-icon">⚠️</view>
				<view class="modal-title">操作确认</view>
				<view class="modal-content">取消后该订单将关闭且无法恢复，确定要放弃当前订单吗？</view>
				<view class="modal-footer-btns">
					<button class="modal-btn-cancel" @click="closeCancelModal">再想想</button>
					<button class="modal-btn-confirm" @click="confirmCancelOrder">确认取消</button>
				</view>
			</view>
		</view>

		<!-- 需求5：美化确认收货弹窗样式 -->
		<view class="custom-modal-mask" v-if="showConfirmReceiveModal" @tap.stop="closeConfirmReceiveModal">
			<view class="custom-modal-box receive-beautify-box" @tap.stop="">
				<view class="receive-modal-icon-wrap">📦</view>
				<view class="modal-title">确认收货提醒</view>
				<view class="modal-content">
					订单已完成；感谢您使用易缆通，我们百分百努力只为您十分满意！确认收货后将无法更改。
				</view>
				<view class="modal-footer-btns">
					<button class="modal-btn-cancel" @click="closeConfirmReceiveModal">取消</button>
					<button class="modal-btn-confirm receive-confirm-btn" @click="executeConfirmReceive">确认收货</button>
				</view>
			</view>
		</view>

		<!-- 需求4、6&7：高级筛选抽屉/弹窗页面（集成按年/月/年月日筛选与日期选择器组件） -->
		<view class="custom-modal-mask" v-if="showFilterDrawer" @tap.stop="closeFilterDrawer">
			<view class="filter-drawer-container" @tap.stop="">
				<view class="filter-drawer-header">
					<text class="filter-title">订单高级筛选</text>
					<text class="filter-close" @click="closeFilterDrawer">✕</text>
				</view>
				<scroll-view scroll-y="true" class="filter-drawer-body">
					<!-- 时间范围筛选与选项卡切换 (需求4) -->
					<view class="filter-section">
						<text class="filter-label">时间筛选类型</text>
						<view class="filter-chips">
							<text :class="['chip', filterForm.timeType === 'create' ? 'active' : '']" @click="filterForm.timeType = 'create'">下单时间</text>
							<text :class="['chip', filterForm.timeType === 'complete' ? 'active' : '']" @click="filterForm.timeType = 'complete'">完成时间</text>
						</view>
						
						<!-- 顶部带有按年、按月、按具体年月日日期进行筛选的选项 (需求4) -->
						<text class="filter-sub-label" style="margin-top: 16rpx;">日期粒度选择</text>
						<view class="filter-chips">
							<text :class="['chip', filterForm.dateGranularity === 'year' ? 'active' : '']" @click="changeDateGranularity('year')">按年筛选</text>
							<text :class="['chip', filterForm.dateGranularity === 'month' ? 'active' : '']" @click="changeDateGranularity('month')">按月筛选</text>
							<text :class="['chip', filterForm.dateGranularity === 'day' ? 'active' : '']" @click="changeDateGranularity('day')">按年月日筛选</text>
						</view>

						<!-- 日期选择控件：支持点击调出 picker 选择，杜绝纯手动输入 (需求4) -->
						<view class="filter-date-inputs">
							<picker mode="date" :fields="pickerFields" :value="filterForm.startDate || '2026-01-01'" @change="bindStartDateChange" class="picker-box-flex">
								<view class="f-input-picker">{{ filterForm.startDate || '请选择开始日期' }}</view>
							</picker>
							<text class="to-text">至</text>
							<picker mode="date" :fields="pickerFields" :value="filterForm.endDate || '2026-12-31'" @change="bindEndDateChange" class="picker-box-flex">
								<view class="f-input-picker">{{ filterForm.endDate || '请选择结束日期' }}</view>
							</picker>
						</view>
					</view>

					<!-- 关键词搜索筛选 -->
					<view class="filter-section">
						<text class="filter-label">关键词搜索 (单号/收货人/手机号)</text>
						<input class="f-input-full" type="text" v-model="filterForm.keyword" placeholder="请输入单号、收货人或手机号模糊查询" />
					</view>

					<!-- 支付方式筛选 -->
					<view class="filter-section">
						<text class="filter-label">支付方式筛选</text>
						<view class="filter-chips">
							<text :class="['chip', filterForm.payChannel === '' ? 'active' : '']" @click="filterForm.payChannel = ''">全部</text>
							<text :class="['chip', filterForm.payChannel === 'wechat' ? 'active' : '']" @click="filterForm.payChannel = 'wechat'">微信支付</text>
							<text :class="['chip', filterForm.payChannel === 'alipay' ? 'active' : '']" @click="filterForm.payChannel = 'alipay'">支付宝支付</text>
						</view>
					</view>

					<!-- 付款方式筛选 -->
					<view class="filter-section">
						<text class="filter-label">付款方式筛选</text>
						<view class="filter-chips">
							<text :class="['chip', filterForm.payMode === '' ? 'active' : '']" @click="filterForm.payMode = ''">全部</text>
							<text :class="['chip', filterForm.payMode === '0' ? 'active' : '']" @click="filterForm.payMode = '0'">在线支付</text>
							<text :class="['chip', filterForm.payMode === '1' ? 'active' : '']" @click="filterForm.payMode = '1'">货到付款</text>
							<text :class="['chip', filterForm.payMode === '2' ? 'active' : '']" @click="filterForm.payMode = '2'">平台代发</text>
							<text :class="['chip', filterForm.payMode === '3' ? 'active' : '']" @click="filterForm.payMode = '3'">银行转账</text>
							<text :class="['chip', filterForm.payMode === '4' ? 'active' : '']" @click="filterForm.payMode = '4'">签约商户</text>
						</view>
					</view>

					<!-- 发票状态筛选 -->
					<view class="filter-section">
						<text class="filter-label">发票状态筛选</text>
						<view class="filter-chips">
							<text :class="['chip', filterForm.invoiceStatus === '' ? 'active' : '']" @click="filterForm.invoiceStatus = ''">全部</text>
							<text :class="['chip', filterForm.invoiceStatus === '0' ? 'active' : '']" @click="filterForm.invoiceStatus = '0'">不含税</text>
							<text :class="['chip', filterForm.invoiceStatus === '1' ? 'active' : '']" @click="filterForm.invoiceStatus = '1'">含普通发票</text>
							<text :class="['chip', filterForm.invoiceStatus === '2' ? 'active' : '']" @click="filterForm.invoiceStatus = '2'">含专用发票</text>
						</view>
					</view>
				</scroll-view>
				<view class="filter-drawer-footer">
					<button class="f-btn-reset" @click="resetFilterForm">重置条件</button>
					<button class="f-btn-submit" @click="applyFilterForm">确认筛选</button>
				</view>
			</view>
		</view>

		<view class="custom-modal-mask" v-if="showLogisticsModal" @tap.stop="closeLogisticsModal">
			<view class="custom-modal-box" @tap.stop="" style="height: auto; max-height: 80vh; width: 88%;">
				<view style="display: flex; justify-content: space-between; align-items: center; width: 100%; border-bottom: 1rpx solid #E2E8F0; padding-bottom: 20rpx; margin-bottom: 10rpx;">
					<text style="font-size: 40rpx; font-weight: 888; color: #0F172A;">物流详情信息</text>
					<text @click="closeLogisticsModal" style="font-size: 40rpx; color: #64748B; padding: 0 10rpx; cursor: pointer;">✕</text>
				</view>
				
				<view v-if="logisticsLoading" style="padding: 60rpx 0; color: #64748B; font-size: 28rpx;">
					<text>正在实时同步物流信息...</text>
				</view>
				
				<view v-else-if="!logisticsData || logisticsData.length === 0" style="padding: 60rpx 0; color: #64748B; font-size: 28rpx;">
					<text>暂无实时物流轨迹信息</text>
				</view>
				
				<scroll-view v-else scroll-y="true" style="max-height: 50vh; width: 100%; text-align: left; padding: 10rpx 0;">
					<view v-for="(item, index) in logisticsData" :key="index" style="margin-bottom: 16rpx; line-height: 1.6; font-size: 28rpx;">
						<text style="color: #333333; font-weight: bold;">{{item.label}}</text>
						<text :style="{ color: item.type === 'red' ? '#FF4D4F' : '#0052D9', wordBreak: 'break-all', fontWeight: 'bold' }">{{item.val}}</text>
					</view>
				</scroll-view>
				
				<view style="display: flex; gap: 20rpx; width: 100%; margin-top: 24rpx;">
					<button @tap="copyLogisticsInfo" style="flex: 1; background-color: #52c41a; color: #fff; border-radius: 40rpx; font-size: 28rpx; height: 80rpx; line-height: 80rpx; font-weight: 600;">一键复制信息</button>
					<button @tap="closeLogisticsModal" style="flex: 1; background-color: #E11D48; color: #fff; border-radius: 40rpx; font-size: 28rpx; height: 80rpx; line-height: 80rpx; font-weight: 600;">我知道了</button>
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
				navi: 0, 
				list: [],
				allList: [], 
				scrollTop: 0,
				pageHeight: 0,
				windowHeight: 0,
				showScrollBtn: false,
				showCancelModal: false,
				currentCancelOid: null,
				
				// 确认收货弹窗控制
				showConfirmReceiveModal: false,
				pendingReceiveOid: null,
				
				// 筛选抽屉控制与日期粒度 (需求4)
				showFilterDrawer: false,
				filterForm: {
					timeType: 'create', // create 下单时间, complete 完成时间
					dateGranularity: 'day', // year 年, month 月, day 日
					startDate: '',
					endDate: '',
					keyword: '',
					payChannel: '', // wechat, alipay
					payMode: '', // 0, 1, 2, 3, 4
					invoiceStatus: '' // 0, 1, 2
				},
				appliedFilter: null,
				
				showLogisticsModal: false,
				logisticsLoading: false,
				logisticsData: [],
				rawTransData: null,
				
				activeCardId: null,
				
				// 缓存池，提升读取与切换速度 (需求8)
				orderCache: {}
			}
		},
		computed: {
			pickerFields() {
				if (this.filterForm.dateGranularity === 'year') return 'year';
				if (this.filterForm.dateGranularity === 'month') return 'month';
				return 'day';
			},
			hasActiveFilter() {
				let f = this.appliedFilter;
				if (!f) return false;
				return !!(f.startDate || f.endDate || f.keyword || f.payChannel !== '' || f.payMode !== '' || f.invoiceStatus !== '');
			},
			displayedList() {
				let raw = this.list || [];
				
				// 需求3 & 4：自动化边界过滤逻辑（7天未付款自动取消不保存、15天待收货自动改为已完成）
				const nowTimestamp = new Date().getTime();
				
				raw = raw.filter(item => {
					let itemTime = Number(item.times || item.time_zone || item.create_time || item.add_time || item.time || 0);
					if (itemTime < 1000000000) itemTime *= 1000; // 兼容秒级时间戳
					
					// 需求3：待付款订单超时隐藏（以天数为单位判断，比如超过 10 天）
					if (String(item.status) === '0' && itemTime > 0) {
					    // 限制：必须确保 itemTime 是正常的时间戳（比如小于当前时间，且大于 2020 年 1577836800000）
					    const minValidTime = 1577836800000; 
					    
					    if (itemTime > minValidTime) {
					        const nowTime = new Date().getTime();
					        const days = (nowTime - itemTime) / (1000 * 60 * 60 * 24); // 计算真正相差的天数
					        
					        // 如果超过 10 天未付款，则隐藏
					        if (days > 10) {
					            return false;
					        }
					    }
					}
					
					// 需求4：待收货状态（status == 2）最多维持 15 天，超时自动视为完成
					if (String(item.status) === '2' && itemTime > 0) {
						const fifteenDaysMs = 15 * 24 * 60 * 60 * 1000;
						if (nowTimestamp - itemTime > fifteenDaysMs) {
							item.status = 3; 
						}
					}
					
					return true;
				});

				// 需求6：待发货板块（navi == 1）需要按照提交时间进行展示，越晚提交的订单，在待发货页面排最上面
				if (Number(this.navi) === 1) {
					raw.sort((a, b) => {
						let timeA = Number(a.times || a.time_zone || a.create_time || a.add_time || a.time || 0);
						let timeB = Number(b.times || b.time_zone || b.create_time || b.add_time || b.time || 0);
						return timeB - timeA; // 降序：越晚提交（时间戳越大）排在最上面
					});
				}

				// 应用高级筛选逻辑（仅针对当前停留页进行筛选）
				if (this.appliedFilter) {
					let f = this.appliedFilter;
					raw = raw.filter(item => {
						// 日期范围匹配 (需求4)
						if (f.startDate || f.endDate) {
							let targetTimestamp = Number(item.times || item.time_zone || item.create_time || item.add_time || item.time || 0);
							if (targetTimestamp < 1000000000) targetTimestamp *= 1000;
							if (targetTimestamp > 0) {
								let dateObj = new Date(targetTimestamp);
								let itemDateStr = '';
								let y = dateObj.getFullYear();
								let m = String(dateObj.getMonth() + 1).padStart(2, '0');
								let d = String(dateObj.getDate()).padStart(2, '0');
								
								if (f.dateGranularity === 'year') {
									itemDateStr = String(y);
								} else if (f.dateGranularity === 'month') {
									itemDateStr = `${y}-${m}`;
								} else {
									itemDateStr = `${y}-${m}-${d}`;
								}
								
								if (f.startDate && itemDateStr < f.startDate) return false;
								if (f.endDate && itemDateStr > f.endDate) return false;
							}
						}

						// 关键词筛选（按单号、收货人、手机号）
						if (f.keyword) {
							let kw = f.keyword.toLowerCase();
							let snStr = String(item.sn || '').toLowerCase();
							let receiverStr = String(item.receiver || item.name || '').toLowerCase();
							let phoneStr = String(item.phone || item.mobile || '').toLowerCase();
							if (!snStr.includes(kw) && !receiverStr.includes(kw) && !phoneStr.includes(kw)) {
								return false;
							}
						}
						// 支付方式筛选 (wechat/alipay)
						if (f.payChannel) {
							let channelText = this.getPayChannelText(item);
							if (f.payChannel === 'wechat' && !channelText.includes('微信')) return false;
							if (f.payChannel === 'alipay' && !channelText.includes('支付宝')) return false;
						}
						// 付款方式筛选
						if (f.payMode !== '') {
							if (String(item.paymode) !== String(f.payMode)) return false;
						}
						// 发票状态筛选
						if (f.invoiceStatus !== '') {
							if (String(this.getTaxValue(item)) !== String(f.invoiceStatus)) return false;
						}
						return true;
					});
				}

				return raw.map((item, index) => {
					return {
						...item,
						_realIndex: index, 
						_zebraAlt: index % 2 === 1 
					};
				});
			},
			isAtTop() {
				return this.scrollTop < 150;
			},
			payCount() { 
				return this.allList.filter(item => String(item.status) === '0' && String(item.paymode) !== '4').length; 
			},
			deliverCount() { 
				return this.allList.filter(item => String(item.status) === '1' || String(item.paymode) === '4').length; 
			},
			receiveCount() { 
				return this.allList.filter(item => String(item.status) === '2').length; 
			}
		},
		onLoad(option) {
			let targetSt = option.st !== undefined && option.st !== '' ? option.st : option.status;
			this.navi = targetSt !== undefined && targetSt !== '' ? Number(targetSt) : 0;
			
			let userInfo = uni.getStorageSync('loginTicket');
			const sysInfo = uni.getSystemInfoSync();
			this.windowHeight = sysInfo.windowHeight;

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
			}
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
			this.checkScrollNeedShow();
		},
		methods: {
			openFilterDrawer() {
				this.showFilterDrawer = true;
			},
			closeFilterDrawer() {
				this.showFilterDrawer = false;
			},
			changeDateGranularity(type) {
				this.filterForm.dateGranularity = type;
				this.filterForm.startDate = '';
				this.filterForm.endDate = '';
			},
			bindStartDateChange(e) {
				this.filterForm.startDate = e.detail.value;
			},
			bindEndDateChange(e) {
				this.filterForm.endDate = e.detail.value;
			},
			resetFilterForm() {
				this.filterForm = {
					timeType: 'create',
					dateGranularity: 'day',
					startDate: '',
					endDate: '',
					keyword: '',
					payChannel: '',
					payMode: '',
					invoiceStatus: ''
				};
				this.appliedFilter = null;
				this.showFilterDrawer = false;
				uni.showToast({ title: '筛选条件已重置', icon: 'none' });
			},
			applyFilterForm() {
				this.appliedFilter = JSON.parse(JSON.stringify(this.filterForm));
				this.showFilterDrawer = false;
				uni.showToast({ title: '筛选应用成功', icon: 'success' });
			},
			getActiveFilterDescription() {
				let f = this.appliedFilter;
				if (!f) return '无';
				let parts = [];
				if (f.startDate || f.endDate) {
					parts.push(`时间[${f.startDate || '不限'} ~ ${f.endDate || '不限'}]`);
				}
				if (f.keyword) parts.push(`关键词[${f.keyword}]`);
				if (f.payChannel) parts.push(`支付[${f.payChannel === 'wechat' ? '微信' : '支付宝'}]`);
				if (f.payMode !== '') parts.push(`付款方式[${this.getPayModeText(f.payMode)}]`);
				if (f.invoiceStatus !== '') parts.push(`发票[${f.invoiceStatus === '0' ? '不含税' : f.invoiceStatus === '1' ? '普通发票' : '专用发票'}]`);
				return parts.length > 0 ? parts.join(' | ') : '全部订单';
			},
			getFilteredTotalMoney() {
				let list = this.displayedList || [];
				let sum = 0;
				list.forEach(item => {
					let m = String(item.paymode) === '1' ? Number(this.getCodPaidMoney(item)) : Number(item.money || 0);
					if (!isNaN(m)) sum += m;
				});
				return sum.toFixed(2);
			},
			handleCardTap(id) {
				if (this.activeCardId) return;
				this.activeCardId = id;
				setTimeout(() => {
					this.activeCardId = null;
					this.gotoInfos(id);
				}, 200);
			},
			handleSignMerchantOrder(item) {
				uni.showModal({
					title: '签约商户提示',
					content: '该订单为签约商户协议订单，无需在线付款，已自动转入待发货流程。',
					confirmText: '查看待发货',
					success: (res) => {
						if (res.confirm) {
							this.changeNav(1); 
						}
					}
				});
			},
			openLogisticsModal(item) {
				let that = this;
				that.showLogisticsModal = true;
				that.logisticsLoading = true;
				that.logisticsData = [];
				that.rawTransData = null;
	
				let apiFunc = that.$api.orderOinfo || that.$api.order_info;
	
				if (!apiFunc) {
					that.logisticsLoading = false;
					uni.showToast({ title: '未找到物流接口方法', icon: 'none' });
					return;
				}
	
				apiFunc({ oid: item.id }).then(ret => {
					that.logisticsLoading = false;
					let detail = ret.data || ret;
					
					if (detail && detail.trans_vo) {
						that.rawTransData = {
							orderNo: item.order_sn || item.sn || item.id,
							tradeSn: detail.trans_vo.trade_sn,
							transSn: detail.trans_vo.trans_sn,
							trans: detail.trans_vo.trans,
							timeZon: detail.trans_vo.time_zon,
							agentMoney: '¥' + detail.trans_vo.agent_money,
							transFee: '¥' + detail.trans_vo.trans_fee,
							transPhone: detail.trans_vo.trans_phone,
							getAddr: detail.trans_vo.get_addr
						};

						that.logisticsData = [
							{ label: '订单编号：', val: that.rawTransData.orderNo, type: 'blue' },
							{ label: '货物编号：', val: that.rawTransData.tradeSn, type: 'blue' },
							{ label: '货运单号：', val: that.rawTransData.transSn, type: 'blue' },
							{ label: '承运物流：', val: that.rawTransData.trans, type: 'blue' },
							{ label: '发货时间：', val: that.rawTransData.timeZon, type: 'blue' },
							{ label: '代收货款：', val: that.rawTransData.agentMoney, type: 'red' },
							{ label: '物流运费：', val: that.rawTransData.transFee, type: 'red' },
							{ label: '联系电话：', val: that.rawTransData.transPhone, type: 'blue' },
							{ label: '取货地址：', val: that.rawTransData.getAddr, type: 'blue' }
						];
					} else {
						that.logisticsData = [];
						that.rawTransData = null;
					}
				}).catch(err => {
					that.logisticsLoading = false;
					console.error(err);
					uni.showToast({ title: '获取物流信息失败', icon: 'none' });
				});
			},
			copyLogisticsInfo() {
				let that = this;
				if (!that.rawTransData) {
					uni.showToast({ title: '暂无物流信息可复制', icon: 'none' });
					return;
				}
				let copyText = 
					`订单编号：${that.rawTransData.orderNo}\n\n` +
					`货物编号：${that.rawTransData.tradeSn}\n\n` +
					`货运单号：${that.rawTransData.transSn}\n\n` +
					`承运物流：${that.rawTransData.trans}\n\n` +
					`发货时间：${that.rawTransData.timeZon}\n\n` +
					`代收货款：${that.rawTransData.agentMoney}\n\n` +
					`物流运费：${that.rawTransData.transFee}\n\n` +
					`联系电话：${that.rawTransData.transPhone}\n\n` +
					`取货地址：${that.rawTransData.getAddr}`;

				uni.setClipboardData({
					data: copyText,
					success: function() {
						uni.showToast({ title: '已成功复制物流信息', icon: 'success' });
					}
				});
			},
			closeLogisticsModal() {
				this.showLogisticsModal = false;
				this.logisticsData = [];
				this.rawTransData = null;
			},
			getOrderTime(item) {
				if (!item) return '';
				let rawTime = item.times || item.time_zone || item.create_time || item.add_time || item.time;
				if (!rawTime) return '暂无时间';
				
				if (/^\d{10}$/.test(rawTime)) {
					let date = new Date(Number(rawTime) * 1000);
					let y = date.getFullYear();
					let m = String(date.getMonth() + 1).padStart(2, '0');
					let d = String(date.getDate()).padStart(2, '0');
					let h = String(date.getHours()).padStart(2, '0');
					let min = String(date.getMinutes()).padStart(2, '0');
					let s = String(date.getSeconds()).padStart(2, '0');
					return `${y}/${m}/${d} ${h}:${min}:${s}`;
				}
				
				return String(rawTime);
			},
			copyOrderSummary(item) {
				if (!item || !item.sn) return;
				
				let kinds = item.oinfo ? item.oinfo.length : 0;
				let totalMoney = String(item.paymode) === '1' ? this.getCodPaidMoney(item) : item.money;
				let payModeDesc = this.getPayModeText(item.paymode);
				let taxDesc = this.getTaxText(item);
				let orderTimeStr = this.getOrderTime(item);

				let summaryText = `【易缆通订单摘要】\n` +
					`单号：${item.sn}\n` +
					`时间：${orderTimeStr}\n` +
					`项数：${kinds} 项\n` +
					`数量：${item.count || 0}\n` +
					`发票：${taxDesc}\n` +
					`结算：${payModeDesc}\n` +
					`金额：¥${totalMoney}`;

				uni.setClipboardData({
					data: summaryText,
					success: () => {
						uni.showToast({
							title: '已成功复制摘要',
							icon: 'none',
							duration: 1800
						});
					}
				});
			},
			getPayModeText(paymode) {
				const mode = String(paymode);
				switch (mode) {
					case '0': return '在线支付';
					case '1': return '货到付款';
					case '2': return '平台代发货';
					case '3': return '银行转账';
					case '4': return '签约商户';
					default: return '在线支付';
				}
			},
			getPayChannelText(item) {
				if (String(item.paymode) === '3') {
					return '';
				}
				if (item.paytype == '4' || item.paymode == '4') {
					return '协议付款';
				}
				if (item.paytype !== undefined && item.paytype !== null && item.paytype !== '') {
					return Number(item.paytype) < 2 ? '微信支付' : '支付宝支付';
				}
				return '';
			},
			getCodPaidMoney(item) {
				if (item.paid_money !== undefined && item.paid_money !== null) {
					return item.paid_money;
				}
				return (Number(item.money) * 0.5).toFixed(2); 
			},
			getCodCollectMoney(item) {
				if (item.collect_money !== undefined && item.collect_money !== null) {
					return item.collect_money;
				}
				let paid = Number(this.getCodPaidMoney(item));
				return (Number(item.money) - paid).toFixed(2);
			},
			getTaxValue(item) {
				return item.ticket !== undefined ? item.ticket : 0;
			},
			getTaxText(item) {
				const taxVal = String(this.getTaxValue(item));
				if (taxVal === '2') {
					return '含专用发票';
				} else if (taxVal === '1') {
					return '含普通发票';
				} else {
					return '不含税';
				}
			},
			getTaxClass(item) {
				const taxVal = String(this.getTaxValue(item));
				if (taxVal === '2') {
					return 'tax-special'; 
				} else if (taxVal === '1') {
					return 'tax-normal';  
				} else {
					return 'tax-none';    
				}
			},
			checkScrollNeedShow() {
				const query = uni.createSelectorQuery().in(this);
				query.select('.container').boundingClientRect(data => {
					if (data) {
						this.pageHeight = data.height;
						if (this.pageHeight > this.windowHeight * 1.3) {
							this.showScrollBtn = true;
						} else {
							this.showScrollBtn = false;
						}
					}
				}).exec();
			},
			handleScrollAction() {
				if (this.isAtTop) {
					uni.pageScrollTo({ scrollTop: this.pageHeight, duration: 300 });
				} else {
					uni.pageScrollTo({ scrollTop: 0, duration: 300 });
				}
			},
			formatIndex(index) {
				const num = index + 1;
				return num < 10 ? '0' + num : num;
			},
			changeNav(index) {
				this.navi = index;
				this.appliedFilter = null; // 切换Tab时重置筛选
				this.doIninit();
			},
			promptCancelOrder(id) {
				this.currentCancelOid = id;
				this.showCancelModal = true;
			},
			closeCancelModal() {
				this.showCancelModal = false;
				this.currentCancelOid = null;
			},
			confirmCancelOrder() {
				let that = this;
				let id = that.currentCancelOid;
				that.closeCancelModal();
				if (!id) return;

				let params = { oid: id, status: -1 };
				that.$api.oinfo_fixd(params).then(ret => {
					uni.showToast({
						title: '订单已成功取消',
						icon: 'success'
					});
					that.doIninit();
				});
			},
			// 需求5：触发美化确认收货弹窗
			do_fixed(id, st) {
				this.pendingReceiveOid = id;
				this.showConfirmReceiveModal = true;
			},
			closeConfirmReceiveModal() {
				this.showConfirmReceiveModal = false;
				this.pendingReceiveOid = null;
			},
			executeConfirmReceive() {
				let that = this;
				let id = that.pendingReceiveOid;
				that.closeConfirmReceiveModal();
				if (!id) return;

				let params = { oid: id, status: 3 };
				that.$api.oinfo_fixd(params).then(ret => {
					uni.showToast({ title: '确认收货成功', icon: 'success' });
					that.doIninit();
				});
			},
			setPay(r) {
				let that = this;
				if (r.paymode == 3 || r.paymode == 4) {
					uni.showModal({
						title: '提示',
						content: '您没有选择在线支付，请您使用对公转账信息转账给商户',
						showCancel: false,
					});
					return;
				}
				let params = { oid: r.id };
				that.$api.order_pay(params).then(ret => {
					if (r.paytype < 2) {
						return that.openWechatpay(ret.data);
					}
					return that.openAlipay(ret.data);
				});
			},
			openAlipay(data) {
				var orderInfo = data;
				uni.getProvider({
				    service: 'payment',
				    success: function (res) {
				        if (~res.provider.indexOf('alipay')) {
				            uni.requestPayment({
				                "provider": "alipay",
				                "orderInfo": orderInfo,
				                success: function (res) { console.log("支付成功"); },
				                fail: function (err) { console.log('支付失败:' + JSON.stringify(err)); }
				            });
				        }
				    }
				});
			},
			openWechatpay(data) {
				let orderInfo = data;
				uni.getProvider({
					service: 'payment',
					success: function(res) {
						if (~res.provider.indexOf('wxpay')) {
							uni.requestPayment({
								"provider": "wxpay",
								"orderInfo": orderInfo,
								success: function(res) { console.log("支付成功"); },
								fail: function(err) { console.log('支付失败:' + JSON.stringify(err)); }
							});
						}
					}
				});
			},
			gotoInfos(id) {
				uni.navigateTo({
					url: '/pages/my/order/infos?oid=' + id
				})
			},
			// 需求8：引入内存缓存池优化切换页面的速度与读取响应速度
			doIninit() {
				let that = this;
				let cacheKey = `st_${that.navi}_uid_${that.uid}`;
				
				// 优先检查内存缓存以实现秒开、零卡顿切换
				if (that.orderCache[cacheKey]) {
					that.list = that.orderCache[cacheKey];
					setTimeout(() => { that.checkScrollNeedShow(); }, 50);
				}

				let params = {
					uid: that.uid,
					st: that.navi
				};
				that.$api.orderIndex(params).then(ret => {
					let rawList = ret.data || [];
					that.list = rawList;
					that.orderCache[cacheKey] = rawList; // 写入缓存
					setTimeout(() => {
						that.checkScrollNeedShow();
					}, 200);
				});
				
				// 异步预加载角标统计数据
				let badgeCacheKey = `st_10_uid_${that.uid}`;
				if (that.orderCache[badgeCacheKey]) {
					that.allList = that.orderCache[badgeCacheKey];
				}
				that.$api.orderIndex({ uid: that.uid, st: 10 }).then(ret => {
					that.allList = ret.data || [];
					that.orderCache[badgeCacheKey] = that.allList;
				});
			}
		}
	}
</script>

<style scoped lang="scss">
	.container {
		position: relative;
		min-height: 100vh;
		padding-bottom: 60rpx;
	}

	page {
		background-color: #E8ECF2; 
	}

	.nav {
		background: #FFFFFF;
		display: flex;
		align-items: center;
		border-bottom: 1rpx solid #E5E7EB;
		position: sticky;
		top: 0;
		z-index: 10;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.02);
		padding-right: 10rpx;
	}

	.nav_item {
		flex: 1;
		font-size: 26rpx;
		height: 88rpx;
		line-height: 88rpx;
		position: relative;
		text-align: center;
		color: #4B5563;
		font-weight: 400;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 2rpx;
		padding: 0 4rpx;
	}

	/* 需求2：无数据空状态样式 */
	.empty-state-box {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 100rpx 40rpx;
		background: #FFFFFF;
		border-radius: 24rpx;
		margin: 20rpx 0;
		box-shadow: 0 4rpx 16rpx rgba(15, 23, 42, 0.04);
		border: 1rpx solid #E2E8F0;

		.empty-icon {
			font-size: 72rpx;
			margin-bottom: 20rpx;
		}

		.empty-text {
			font-size: 32rpx;
			font-weight: 750;
			color: #334155;
			margin-bottom: 10rpx;
		}

		.empty-subtext {
			font-size: 24rpx;
			color: #64748B;
			text-align: center;
			line-height: 1.5;
		}
	}

	/* 需求6&7：顶部右侧精致筛选按钮样式 */
	.nav_filter_btn {
		display: flex;
		align-items: center;
		gap: 4rpx;
		padding: 10rpx 16rpx;
		background: #F1F5F9;
		border: 1rpx solid #CBD5E1;
		border-radius: 30rpx;
		margin-left: 6rpx;
		margin-right: 10rpx;
		position: relative;
		cursor: pointer;

		&:active {
			background: #E2E8F0;
		}

		.filter-icon-symbol {
			font-size: 22rpx;
			line-height: 1;
		}

		.filter-text {
			font-size: 24rpx;
			color: #334155;
			font-weight: 600;
		}

		.filter-active-dot {
			position: absolute;
			top: -4rpx;
			right: -4rpx;
			width: 16rpx;
			height: 16rpx;
			background: #E11D48;
			border-radius: 50%;
			border: 2rpx solid #FFFFFF;
		}
	}

	.nav-text {
		white-space: nowrap;
	}

	.nav_item.active {
		color: #2563EB;
		font-weight: 600;
	}

	.nav_item.active::after {
		background: #2563EB;
		border-radius: 4rpx;
		bottom: 8rpx;
		content: " ";
		display: table;
		height: 6rpx;
		left: 50%;
		margin-left: -16rpx;
		position: absolute;
		width: 32rpx;
	}

	.nav-badge {
		font-size: 20rpx; 
		background: #E11D48 !important;
		color: #FFFFFF !important;
		padding: 0 10rpx; 
		height: 30rpx; 
		line-height: 30rpx;          
		text-align: center;          
		border-radius: 15rpx; 
		font-weight: 500 !important;   
		transform: scale(0.95); 
		white-space: nowrap;
	}
	.badge-pay {
		background: #E11D48 !important; 
	}

	.panel {
		padding: 24rpx;
	}

	.panel_box {
		background: #FFFFFF;
		box-shadow: 0 10rpx 28rpx rgba(15, 23, 42, 0.08), 0 2rpx 8rpx rgba(15, 23, 42, 0.04);
		border-radius: 24rpx;
		margin-bottom: 36rpx;
		overflow: hidden;
		border: 2rpx solid #CBD5E1; 
		
		transition: transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275), background-color 0.2s ease;
		
		&.panel-pressed {
			transform: scale(0.88); 
			background-color: #E2E8F0;
		}
		
		&:active {
			transform: scale(0.88);
			background-color: #E2E8F0;
		}
	}

	.panel-zebra-alt {
		background-color: #E2E8F0;
		border-color: #94A3B8;
	}

	.panel_header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 24rpx;
		background: rgba(0, 0, 0, 0.015);
		border-bottom: 1rpx solid rgba(0, 0, 0, 0.05);
	}

	.header_left {
		display: flex;
		flex-direction: column;
		gap: 6rpx;
	}

	.sn-row {
		display: flex;
		align-items: center;
		gap: 12rpx;
	}

	.order-index-badge {
		font-size: 22rpx;
		font-weight: 600;
		color: #475569;
		background: #F1F5F9;
		padding: 2rpx 10rpx;
		border-radius: 6rpx;
		border: 1rpx solid #E2E8F0;
		letter-spacing: 1rpx;
	}

	.index-badge-alt {
		color: #334155;
		background: #E2E8F0;
		border-color: #CBD5E1;
	}

	.sn-copy-wrap {
		display: flex;
		align-items: center;
		gap: 8rpx;
		cursor: pointer;
		padding: 2rpx 4rpx;
		border-radius: 4rpx;
		transition: background-color 0.15s;

		&:active {
			background-color: rgba(0, 0, 0, 0.05);
		}
	}

	.sn-text {
		font-size: 25rpx;
		color: #334155;
		font-weight: 500;
		white-space: nowrap;
		letter-spacing: -0.2rpx;
	}

	.copy-icon {
		font-size: 22rpx;
		line-height: 1;
		opacity: 0.7;
	}

	.date-text {
		font-size: 23rpx;
		color: #64748B;
		font-weight: 500;
		margin-left: 2rpx;
		white-space: nowrap;
	}

	.status-badge {
		font-size: 24rpx;
		padding: 6rpx 20rpx;
		border-radius: 30rpx;
		color: #FFFFFF;
		font-weight: 400; 
		letter-spacing: 1rpx;
		box-shadow: 0 2rpx 4rpx rgba(0,0,0,0.05);
		white-space: nowrap;
		flex-shrink: 0;
	}

	.status-0 { background: #E11D48; opacity: 0.85; } 
	.status-1 { background: #3B82F6; opacity: 0.85; } 
	.status-2 { background: #8B5CF6; opacity: 0.85; } 
	.status-3 { background: #10B981; opacity: 0.85; } 
	.status--1, .status-4 { background: #64748B; opacity: 0.85; }

	.panel_middle_bar {
		display: flex;
		flex-direction: column;
		gap: 16rpx;
		padding: 24rpx;
		background: transparent;
		border-bottom: 1rpx solid rgba(0, 0, 0, 0.05);
	}

	.middle_row {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.attribute_row {
		border-top: 1rpx dashed rgba(0, 0, 0, 0.06);
		padding-top: 16rpx;
	}

	.amount_row {
		border-top: 1rpx dashed rgba(0, 0, 0, 0.06);
		padding-top: 16rpx;
	}

	.cod_vertical_row {
		display: flex;
		align-items: center;
		justify-content: space-around;
		background: #F8FAFC;
		border: 1rpx solid #E2E8F0;
		border-radius: 12rpx;
		padding: 14rpx 10rpx;
		margin-top: 4rpx;
		border-top: 1rpx dashed rgba(0, 0, 0, 0.06);
	}

	.cod_col {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4rpx;
	}

	.c_sub_label {
		font-size: 20rpx;
		color: #64748B;
		font-weight: 500;
	}

	.c_sub_val {
		font-size: 26rpx;
		font-weight: 700;
		letter-spacing: -0.5rpx;
		
		&.dark { color: #0F172A; }
		&.green { color: #16A34A; }
		&.orange { color: #D97706; }
	}

	.c_vertical_divider {
		width: 1rpx;
		height: 36rpx;
		background-color: #E2E8F0;
	}

	.tag-group-left {
		display: flex;
		align-items: center;
		gap: 10rpx;
	}

	.tax-tag {
		font-size: 22rpx;
		padding: 4rpx 14rpx;
		border-radius: 6rpx;
		font-weight: 600;
		white-space: nowrap;
	}
	.tax-special {
		background: #FFE4E6;
		color: #BE123C;
		border: 1rpx solid #FECDD3;
	}
	.tax-normal {
		background: #DCFCE7;
		color: #15803D;
		border: 1rpx solid #BBF7D0;
	}
	.tax-none {
		background: #FEF3C7;
		color: #B45309;
		border: 1rpx solid #FDE68A;
	}

	.paymode-tag-inline {
		font-size: 22rpx;
		color: #475569;
		background: #F1F5F9;
		padding: 4rpx 14rpx;
		border-radius: 6rpx;
		border: 1rpx solid #CBD5E1;
		font-weight: 500;
		white-space: nowrap;
	}

	.paytype-tag-inline {
		font-size: 22rpx;
		color: #1D4ED8;
		background: #EFF6FF;
		padding: 4rpx 14rpx;
		border-radius: 6rpx;
		border: 1rpx solid #BFDBFE;
		font-weight: 500;
		white-space: nowrap;
	}

	.data-group {
		display: flex;
		align-items: baseline;
		white-space: nowrap;
	}

	.label-gray {
		font-size: 26rpx;
		color: #475569;
		white-space: nowrap;
	}

	.val-highlight-blue {
		font-size: 30rpx;
		color: #2563EB;
		font-weight: 800;
		margin-left: 4rpx;
		white-space: nowrap;
	}

	.label-unit {
		font-size: 24rpx;
		color: #64748B;
		margin-left: 2rpx;
	}

	.money-wrap {
		display: flex;
		align-items: baseline;
	}

	.money-symbol {
		color: #C20F22;
		font-size: 26rpx;
		font-weight: bold;
		margin-left: 4rpx;
	}

	.money-highlight {
		color: #C20F22;
		font-size: 36rpx;
		font-weight: 800;
		letter-spacing: -1rpx;
		white-space: nowrap;
	}

	.panel_footer_btn {
		display: flex;
		padding: 20rpx 24rpx;
		justify-content: space-between;
		align-items: center;
		background: rgba(0, 0, 0, 0.015);
	}

	.footer-placeholder {
		flex: 1;
	}

	.btn-group {
		display: flex;
		align-items: center;
		gap: 16rpx;
	}

	button {
		margin: 0;
		padding: 0 28rpx;
		height: 60rpx;
		line-height: 58rpx;
		font-size: 26rpx;
		border-radius: 30rpx;
		font-weight: 500;
	}

	button::after {
		border: none;
	}

	.btn-default-soft {
		background: #F1F5F9;
		border: 1rpx solid #CBD5E1;
		color: #475569;
	}

	.btn-primary-soft {
		background: #EFF6FF;
		border: 1rpx solid #BFDBFE;
		color: #1D4ED8;
		font-weight: 600;
	}

	.btn-danger-soft {
		background: #FFF1F2;
		border: 1rpx solid #FECDD3;
		color: #E11D48;
		font-weight: 600;
	}

	/* 需求7：筛选结果统计面板样式 */
	.filter-stats-footer-card {
		background: linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%);
		border: 2rpx solid #93C5FD;
		border-radius: 20rpx;
		padding: 24rpx;
		margin-top: 30rpx;
		margin-bottom: 20rpx;
		box-shadow: 0 6rpx 20rpx rgba(37, 99, 235, 0.12);

		.stats-title-row {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 12rpx;
			border-bottom: 1rpx solid rgba(59, 130, 246, 0.2);
			padding-bottom: 10rpx;

			.stats-title-text {
				font-size: 28rpx;
				font-weight: 750;
				color: #1E40AF;
			}

			.stats-count-tag {
				font-size: 22rpx;
				background: #2563EB;
				color: #FFFFFF;
				padding: 2rpx 14rpx;
				border-radius: 20rpx;
				font-weight: 600;
			}
		}

		.stats-detail-row {
			display: flex;
			align-items: flex-start;
			margin-bottom: 10rpx;
			font-size: 24rpx;

			.stats-label {
				color: #475569;
				font-weight: 600;
				white-space: nowrap;
			}

			.stats-value-text {
				color: #1E293B;
				word-break: break-all;
				font-weight: 500;
				margin-left: 6rpx;
			}
		}

		.stats-amount-row {
			display: flex;
			align-items: baseline;
			justify-content: flex-end;
			margin-top: 12rpx;
			border-top: 1rpx dashed rgba(59, 130, 246, 0.3);
			padding-top: 12rpx;

			.stats-label {
				font-size: 26rpx;
				color: #1E3A8A;
				font-weight: 700;
				margin-right: 8rpx;
			}

			.stats-money-symbol {
				font-size: 26rpx;
				color: #DC2626;
				font-weight: bold;
			}

			.stats-money-val {
				font-size: 38rpx;
				color: #DC2626;
				font-weight: 850;
				letter-spacing: -0.5rpx;
			}
		}
	}

	.smart-scroll-fab {
		position: fixed;
		right: 36rpx;
		bottom: 100rpx;
		width: 92rpx;
		height: 92rpx;
		background: rgba(15, 23, 42, 0.65);
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
		border-radius: 50%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.18);
		z-index: 99;
		transition: all 0.2s ease;
		border: 2rpx solid rgba(255, 255, 255, 0.35);

		&:active {
			transform: scale(0.92);
			background: rgba(37, 99, 235, 0.85);
		}

		.fab-icon {
			font-size: 28rpx;
			color: #FFFFFF;
			line-height: 1;
			margin-bottom: 2rpx;
			text-shadow: 0 1rpx 2rpx rgba(0,0,0,0.3);
		}

		.fab-text {
			font-size: 20rpx;
			color: #FFFFFF;
			font-weight: 600;
			line-height: 1;
			text-shadow: 0 1rpx 2rpx rgba(0,0,0,0.3);
		}
	}

	.custom-modal-mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(15, 23, 42, 0.6);
		backdrop-filter: blur(4px);
		-webkit-backdrop-filter: blur(4px);
		z-index: 999;
		display: flex;
		align-items: center;
		justify-content: center;
		animation: fadeIn 0.2s ease-out;
	}

	.custom-modal-box {
		width: 82%;
		max-width: 600rpx;
		background: #FFFFFF;
		border-radius: 28rpx;
		padding: 40rpx 32rpx 32rpx 32rpx;
		box-shadow: 0 20rpx 40rpx rgba(0, 0, 0, 0.2);
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		transform: translateY(0);
		animation: scaleUp 0.2s ease-out;
	}

	/* 需求5美化：收货弹窗专属样式 */
	.receive-beautify-box {
		border: 2rpx solid #BFDBFE;
		background: linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%);
	}
	.receive-modal-icon-wrap {
		font-size: 64rpx;
		margin-bottom: 12rpx;
		line-height: 1;
		background: #EFF6FF;
		width: 110rpx;
		height: 110rpx;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 2rpx solid #DBEAFE;
	}
	.receive-confirm-btn {
		background: #2563EB !important;
		box-shadow: 0 4rpx 12rpx rgba(37, 99, 235, 0.35) !important;
		color: #FFFFFF !important;
	}

	/* 需求4、6&7美化：高级筛选抽屉面板样式 */
	.filter-drawer-container {
		position: absolute;
		right: 0;
		top: 0;
		bottom: 0;
		width: 80%;
		max-width: 640rpx;
		background: #FFFFFF;
		box-shadow: -10rpx 0 30rpx rgba(0, 0, 0, 0.15);
		display: flex;
		flex-direction: column;
		animation: slideInRight 0.25s ease-out;
	}

	.filter-drawer-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 30rpx 24rpx;
		border-bottom: 1rpx solid #E2E8F0;
		background: #F8FAFC;

		.filter-title {
			font-size: 32rpx;
			font-weight: 700;
			color: #0F172A;
		}

		.filter-close {
			font-size: 36rpx;
			color: #64748B;
			padding: 0 10rpx;
			cursor: pointer;
		}
	}

	.filter-drawer-body {
		flex: 1;
		padding: 24rpx;
		text-align: left;
	}

	.filter-section {
		margin-bottom: 28rpx;

		.filter-label {
			font-size: 26rpx;
			font-weight: 600;
			color: #334155;
			margin-bottom: 14rpx;
			display: block;
		}
		
		.filter-sub-label {
			font-size: 24rpx;
			font-weight: 600;
			color: #475569;
			margin-bottom: 10rpx;
			display: block;
		}
	}

	.filter-chips {
		display: flex;
		flex-wrap: wrap;
		gap: 12rpx;

		.chip {
			font-size: 24rpx;
			padding: 10rpx 20rpx;
			background: #F1F5F9;
			color: #475569;
			border-radius: 8rpx;
			border: 1rpx solid #CBD5E1;
			font-weight: 500;

			&.active {
				background: #EFF6FF;
				color: #2563EB;
				border-color: #2563EB;
				font-weight: 600;
			}
		}
	}

	.filter-date-inputs {
		display: flex;
		align-items: center;
		gap: 10rpx;
		margin-top: 12rpx;

		.picker-box-flex {
			flex: 1;
		}

		.f-input-picker {
			width: 100%;
			box-sizing: border-box;
			height: 64rpx;
			line-height: 62rpx;
			background: #F8FAFC;
			border: 1rpx solid #CBD5E1;
			border-radius: 8rpx;
			font-size: 22rpx;
			padding: 0 12rpx;
			color: #0F172A;
			text-align: center;
		}

		.to-text {
			font-size: 24rpx;
			color: #64748B;
		}
	}

	.f-input-full {
		width: 100%;
		box-sizing: border-box;
		height: 72rpx;
		background: #F8FAFC;
		border: 1rpx solid #CBD5E1;
		border-radius: 8rpx;
		font-size: 26rpx;
		padding: 0 16rpx;
		color: #0F172A;
	}

	.filter-drawer-footer {
		display: flex;
		gap: 20rpx;
		padding: 20rpx 24rpx;
		border-top: 1rpx solid #E2E8F0;
		background: #F8FAFC;

		.f-btn-reset, .f-btn-submit {
			flex: 1;
			height: 76rpx;
			line-height: 76rpx;
			border-radius: 38rpx;
			font-size: 28rpx;
			font-weight: 600;
		}

		.f-btn-reset {
			background: #F1F5F9;
			color: #475569;
			border: 1rpx solid #CBD5E1;
		}

		.f-btn-submit {
			background: #2563EB;
			color: #FFFFFF;
			box-shadow: 0 4rpx 12rpx rgba(37, 99, 235, 0.3);
		}
	}

	.modal-header-icon {
		font-size: 56rpx;
		margin-bottom: 12rpx;
		line-height: 1;
	}

	.modal-title {
		font-size: 32rpx;
		font-weight: 700;
		color: #0F172A;
		margin-bottom: 16rpx;
	}

	.modal-content {
		font-size: 28rpx;
		color: #475569;
		line-height: 1.6;
		margin-bottom: 40rpx;
		padding: 0 16rpx;
	}

	.modal-footer-btns {
		display: flex;
		width: 100%;
		gap: 20rpx;
	}

	.modal-btn-cancel,
	.modal-btn-confirm {
		flex: 1;
		height: 80rpx;
		line-height: 80rpx;
		border-radius: 40rpx;
		font-size: 28rpx;
		font-weight: 600;
	}

	.modal-btn-cancel {
		background: #F1F5F9;
		color: #64748B;
		border: 1rpx solid #CBD5E1;
	}

	.modal-btn-confirm {
		background: #E11D48;
		color: #FFFFFF;
		box-shadow: 0 4rpx 12rpx rgba(225, 29, 72, 0.3);
	}

	@keyframes fadeIn {
		from { opacity: 0; }
		to { opacity: 1; }
	}

	@keyframes scaleUp {
		from { transform: scale(0.95); opacity: 0; }
		to { transform: scale(1); opacity: 1; }
	}

    @keyframes slideInRight {
		from { transform: translateX(100%); }
		to { transform: translateX(0); }
	}
</style>