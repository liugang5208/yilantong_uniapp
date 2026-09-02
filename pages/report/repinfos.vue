<template>
	<view class="modern-report-page">
		
		<!-- 顶部：全局控制与比例调整胶囊舱 -->
		<view class="hero-control-header amber-theme-box">
			<view class="header-title-row">
				<text class="main-label">全品统一调价比例</text>
				<view class="stepper-box">
					<view class="step-btn" @click="revCeil()">-</view>
					<text :class="['step-value', repratio > 0 ? 'text-red' : repratio < 0 ? 'text-green' : 'text-gray']">
						{{ repratio > 0 ? '+' + Number(repratio).toFixed(1) : Number(repratio).toFixed(1) }}%
					</text>
					<view class="step-btn" @click="addCeil()">+</view>
				</view>
			</view>

			<!-- 发票通栏选择胶囊 -->
			<view class="filter-capsule-row">
				<view class="capsule-pill full-width-pill" @click="ticketNameShow = true">
					<view class="pill-left-group">
						<text class="pill-key">发票税率控制</text>
					</view>
					<view class="pill-right-group">
						<text class="pill-val">{{ ticket_name || '选择发票类型' }}</text>
						<u-icon name="arrow-right" size="18" color="#94a3b8"></u-icon>
					</view>
				</view>
			</view>
		</view>

		<!-- 中部：商品清单 -->
		<view class="product-stream-section">
			<view class="section-heading">
				<text class="sec-title">报价商品清单</text>
				<text class="sec-count">共 {{ list.length }} 项</text>
			</view>

			<view class="empty-state" v-if="list.length === 0">
				<text>暂无商品，请在选品页添加或录入数据</text>
			</view>

			<!-- 商品卡片：现代化重构版 -->
			<view :class="['floating-card-item', i % 2 === 0 ? 'card-even' : 'card-odd']" v-for="(item, i) in list" :key="item.id || i">
				
				<view class="sketch-row-1 card-header-bar-custom">
					<view class="index-slot">
						<text class="item-index-badge-custom">序号：{{ String(i + 1).padStart(3, '0') }}</text>
					</view>
					<view class="center-pill-slot">
						<text :class="['mini-ratio-pill-top', Number(item.up || 0) > 0 ? 'pill-red-solid' : (Number(item.up || 0) < 0 ? 'pill-green-solid' : 'pill-gray-solid')]">
							{{ Number(item.up || 0) > 0 ? '+' + Number(item.up).toFixed(1) + '%' : (Number(item.up || 0) < 0 ? Number(item.up).toFixed(1) + '%' : '+0.0%') }}
						</text>
					</view>
					<view class="right-action-slot">
						<!-- 文字显示修正：将主页卡片上的“条件 / 修改”统一规范修正为【调价 / 修改】 -->
						<view class="batch-adjust-btn-custom-subtle" @click="openItemPopup(item, i)">
							<text class="adjust-txt-custom">调价 / 修改</text>
							<u-icon name="arrow-right" size="12" color="#64748b"></u-icon>
						</view>
						<text class="del-icon-btn" @click="quickDelete(item, i)">×</text>
					</view>
				</view>

				<!-- 第二行：商品名称 -->
				<view class="card-title-section-inline" @click="openDetailModalConditionally('商品名称全称', item.name || item.title || item.goods_name, $event)">
					<text class="card-title-header-label">商品名称：</text>
					<text class="card-goods-name ellipsis-text card-goods-name-styled">
						{{ item.name || item.title || item.goods_name || '暂无商品名称（接口未对接）' }}
					</text>
				</view>

				<!-- 第三行：产品参数详情区 -->
				<view class="card-attr-grid">
					<view class="attr-row-flex">
						<view class="attr-col-item" @click="openDetailModalConditionally('产品型号全称', item.attr2, $event)">
							<text class="attr-label" style="margin-right: 6px;">产品型号：</text>
							<text class="attr-val ellipsis-text text-blue-bright">{{ item.attr2 || '-' }}</text>
						</view>
						<view class="attr-col-item" @click="openDetailModalConditionally('电压等级全称', item.attr1, $event)">
							<text class="attr-label">电压等级：</text>
							<text class="attr-val ellipsis-text text-blue-bright">{{ item.attr1 || '-' }}</text>
						</view>
					</view>
					<view class="attr-row-item-full" @click="openDetailModalConditionally('产品规格全称', item.attr3, $event)">
						<text class="attr-label">产品规格：</text>
						<text class="attr-val ellipsis-text text-blue-bright">{{ item.attr3 || '-' }}</text>
					</view>
				</view>

				<!-- 第四行：压轴财务/数量结算区 -->
				<view class="card-financial-dock">
					<view class="fin-item">
						<text class="fin-label">数量：</text>
						<text class="fin-num-bold">{{ item.nums || 0 }}</text>
					</view>
					<view class="fin-item">
						<text class="fin-label">单价：</text>
						<text :class="['fin-price-unit', Number(item.up || 0) > 0 ? 'text-red' : (Number(item.up || 0) < 0 ? 'text-green' : '')]">
							¥{{ item.change_price !== undefined ? item.change_price : (item.price || 0) }}
						</text>
					</view>
					<view class="fin-item subtotal-alignment">
						<text class="fin-label">小计：</text>
						<text class="fin-subtotal-red">¥{{ Number(item.total || 0).toFixed(2) }}</text>
					</view>
				</view>

			</view>
		</view>

		<!-- 商务条款及表单填写区域 -->
		<view class="floating-section-card">
			<view class="form-group-title">商务与履约条款</view>

			<view class="modern-form-item clickable-item" @click="openCustomSelector('check_type')">
				<text class="form-label">付款方式：</text>
				<view class="picker-value-box">
					<text class="val-text">{{ check_type || '选择付款方式' }}</text>
					<u-icon name="arrow-right" size="18" color="#94a3b8"></u-icon>
				</view>
			</view>

			<view class="modern-form-item clickable-item" @click="openCustomSelector('trans_type')">
				<text class="form-label">运输方式：</text>
				<view class="picker-value-box">
					<text class="val-text">{{ trans_type || '选择运输方式' }}</text>
					<u-icon name="arrow-right" size="18" color="#94a3b8"></u-icon>
				</view>
			</view>

			<view class="modern-form-item clickable-item" @click="openCustomSelector('fees_out')">
				<text class="form-label">运输费用：</text>
				<view class="picker-value-box">
					<text class="val-text">{{ fees_out || '选择运费负担' }}</text>
					<u-icon name="arrow-right" size="18" color="#94a3b8"></u-icon>
				</view>
			</view>

			<view class="modern-form-item clickable-item" @click="openCustomSelector('pack_recyle')">
				<text class="form-label">包装选项：</text>
				<view class="picker-value-box">
					<text class="val-text">{{ pack_recyle || '选择包装要求' }}</text>
					<u-icon name="arrow-right" size="18" color="#94a3b8"></u-icon>
				</view>
			</view>
		</view>

		<!-- 基础档案表单输入群 -->
		<view class="floating-section-card">
			<view class="form-group-title header-row-flex">
				<text>抬头与人员档案</text>
				<!-- 修复：解耦报价单位与询价单位的快速选择按钮，提供独立的主题视觉区分 -->
				<div class="template-header-actions">
					<div class="template-badge-btn amber-btn" @click="openRepCompModal('rep')">选择报价单位</div>
					<div class="template-badge-btn blue-btn" @click="openRepCompModal('question')">选择询价单位</div>
				</div>
			</view>

			<view class="modern-form-item">
				<text class="form-label">报价单位：</text>
				<input @input="inChange($event,'rep_comp')" v-model="rep_comp" class="modern-input" placeholder-class="input-placeholder-light" placeholder="请输入公司名称" />
			</view>

			<view class="modern-form-item">
				<text class="form-label">询价单位：</text>
				<input @input="inChange($event,'question_comp')" v-model="question_comp" class="modern-input" placeholder-class="input-placeholder-light" placeholder="请输入公司名称" />
			</view>
			
			<view class="modern-form-item">
				<text class="form-label">项目名称：</text>
				<input @input="inChange($event,'project_comp')" v-model="project_comp" class="modern-input" placeholder-class="input-placeholder-light" placeholder="请输入项目名称" />
			</view>

			<view class="modern-form-item">
				<text class="form-label">报价人员：</text>
				<input @input="inChange($event,'rep_user')" v-model="rep_user" class="modern-input" placeholder-class="input-placeholder-light" placeholder="请输入报价人员" />
			</view>

			<view class="modern-form-item">
				<text class="form-label">手机号码：</text>
				<input @input="inChange($event,'rep_phone')" v-model="rep_phone" class="modern-input" placeholder-class="input-placeholder-light" placeholder="请输入手机号码" />
			</view>
		</view>

		<!-- 备注信息卡片 -->
		<view class="floating-section-card compact-remark-card">
			<view class="form-group-title header-row-flex">
				<text>备注与说明</text>
				<div class="template-header-actions">
					<div class="template-badge-btn" @click="openQuickTemplateModal">选择与管理模板</div>
				</div>
			</view>

			<view class="textarea-box">
				<textarea @input="inChange($event,'tags')" class="modern-textarea auto-grow-textarea" placeholder-class="input-placeholder-light" placeholder="请输入补充备注条款..." v-model="tags" auto-height></textarea>
			</view>
		</view>

		<view class="bottom-spacer"></view>

		<!-- 底部高定悬浮结算舱 -->
		<view class="floating-checkout-dock">
			<view class="dock-summary-info">
				<view class="sum-row-top">
					<text class="sum-item"><text class="dock-title-black">条数：</text><text class="dock-val-red">{{ list.length }}</text></text>
					<text class="sum-item"><text class="dock-title-black">总量：</text><text class="dock-val-red">{{ count }}</text></text>
					<text :class="['tax-flag-badge', ticket === 2 ? 'badge-special' : (ticket === 1 ? 'badge-normal' : 'badge-none')]">{{ ticket_name }}</text>
				</view>
				<view class="sum-row-bottom">
					<text class="total-money-label"><text class="dock-title-black">总计：</text><text class="money-num-red">¥{{ total }}</text></text>
				</view>
				<view class="sum-row-words">
					<text class="chinese-words"><text class="dock-title-black">大写：</text><text class="dock-content-red">{{ total_n }}</text></text>
				</view>
			</view>

			<view class="dock-actions-row">
				<button class="btn-clear" @click="clearall()">清空全部</button>
				<button class="btn-submit" @click="apply()">立即生成报价单</button>
			</view>
			<view class="dock-tips">
				<text>提示：点击卡片任意处可进入单独调价与参数修改</text>
			</view>
		</view>

		<!-- 自定义弹窗群 -->
		<view class="custom-modal-mask" v-if="customModalShow" @click="cancelCustomModal">
			<view class="custom-modal-container" @click.stop>
				<view class="custom-modal-title">{{ customModalTitle }}</view>
				<view class="custom-modal-content">{{ customModalContent }}</view>
				<view class="custom-modal-footer">
					<button class="c-modal-btn c-btn-cancel" @click="cancelCustomModal">取消</button>
					<button class="c-modal-btn c-btn-confirm" @click="confirmCustomModal">确定</button>
				</view>
			</view>
		</view>

		<!-- 统一的字段全称查看弹窗 -->
		<view class="custom-modal-mask" v-if="detailModalShow" @click="closeDetailModal">
			<view class="custom-modal-container" @click.stop>
				<view class="custom-modal-title">{{ detailModalTitle }}</view>
				<view class="custom-modal-content detail-content-box">{{ detailModalContent || '暂无详细内容' }}</view>
				<view class="custom-modal-footer">
					<button class="c-modal-btn c-btn-confirm" @click="closeDetailModal">关闭</button>
				</view>
			</view>
		</view>

		<!-- 弹窗宽度向两边延伸扩宽 -->
		<view class="custom-modal-mask" v-if="customSelectorShow" @click="closeCustomSelector">
			<view class="custom-modal-container wide-modal-container" @click.stop>
				<view class="custom-modal-title">{{ currentSelectorTitle }}</view>
				<view class="sub-modal-desc">请点击下方选项快速设定，或选择自定义输入</view>

				<scroll-view scroll-y class="template-items-scroll">
					<view class="template-manage-card" v-for="(opt, idx) in currentSelectorOptions" :key="idx" @click="selectCustomOption(opt)">
						<view class="manage-card-body" style="margin-bottom: 0; display: flex; justify-content: space-between; align-items: center;">
							<view style="display: flex; align-items: center; gap: 10rpx;">
								<view class="dot-icon" style="width: 10rpx; height: 10rpx; background: #d97706; border-radius: 50%;"></view>
								<text class="manage-item-text" style="font-weight: bold; color: #1e293b;">{{ opt }}</text>
							</view>
							<text style="font-size: 22rpx; color: #d97706; background: #fffbeb; padding: 4rpx 14rpx; border-radius: 8rpx;">选用</text>
						</view>
					</view>
				</scroll-view>

				<view class="custom-modal-footer" style="margin-top: 24rpx;">
					<button class="c-modal-btn c-btn-cancel" @click="closeCustomSelector">取消</button>
				</view>
			</view>
		</view>

		<view class="custom-modal-mask" v-if="quickModalShow" @click="closeQuickTemplateModal">
			<view class="custom-modal-container wide-modal-container" @click.stop>
				<view class="custom-modal-title">商务备注模板库</view>
				<view class="sub-modal-desc">点击模板即可一键选用，支持个性化录入或清理</view>
				
				<div class="add-template-input-row">
					<input class="modal-inline-input" placeholder="输入新的自定义备注文案..." v-model="newQuickText" />
					<button class="inline-add-btn" @click="addQuickTemplateItem">新增模板</button>
				</div>

				<scroll-view scroll-y class="template-items-scroll">
					<view class="empty-quick-tips" v-if="quickTemplates.length === 0">暂无快捷模板，赶快添加一条吧~</view>
					<view class="template-manage-card" v-for="(item, idx) in quickTemplates" :key="idx">
						<view class="manage-card-body" @click="applyQuickTemplate(item)">
							<view class="card-mini-indicator">
								<view class="dot-icon"></view>
								<text class="indicator-title">快捷条款</text>
							</view>
							<text class="manage-item-text">{{ item }}</text>
						</view>
						<view class="manage-card-footer">
							<div class="action-btn-pill use-pill" @click="applyQuickTemplate(item)"><text>选用</text></div>
							<div class="action-btn-pill del-pill" @click="deleteQuickTemplateItem(idx)"><text>删除</text></div>
						</view>
					</view>
				</scroll-view>

				<view class="custom-modal-footer" style="margin-top: 24rpx;">
					<button class="c-modal-btn c-btn-confirm" @click="closeQuickTemplateModal">关闭窗口</button>
				</view>
			</view>
		</view>

		<view class="custom-modal-mask" v-if="repCompModalShow" @click="closeRepCompModal">
			<view class="custom-modal-container wide-modal-container" @click.stop>
				<!-- 动态弹窗标题：精准区分是选择报价单位还是询价单位 -->
				<view class="custom-modal-title">{{ repCompTarget === 'question' ? '快速选择询价单位库' : '快速选择报价单位库' }}</view>
				<view class="sub-modal-desc">点击选用直接录入，支持录入管理</view>
				
				<div class="add-template-input-row">
					<input class="modal-inline-input" placeholder="输入新的单位公司名称..." v-model="newRepCompText" />
					<button class="inline-add-btn" @click="addRepCompItem">新增单位</button>
				</div>

				<scroll-view scroll-y class="template-items-scroll">
					<view class="empty-quick-tips" v-if="repCompList.length === 0">暂无常用单位，赶快添加一个吧~</view>
					<view class="template-manage-card" v-for="(item, idx) in repCompList" :key="idx">
						<view class="manage-card-body" @click="applyRepComp(item)">
							<view class="card-mini-indicator">
								<view class="dot-icon"></view>
								<text class="indicator-title">公司抬头名称</text>
							</view>
							<text class="manage-item-text">{{ item }}</text>
						</view>
						<view class="manage-card-footer">
							<div class="action-btn-pill use-pill" @click="applyRepComp(item)"><text>选用</text></div>
							<div class="action-btn-pill del-pill" @click="deleteRepCompItem(idx)"><text>删除</text></div>
						</view>
					</view>
				</scroll-view>

				<view class="custom-modal-footer" style="margin-top: 24rpx;">
					<button class="c-modal-btn c-btn-confirm" @click="closeRepCompModal">关闭窗口</button>
				</view>
			</view>
		</view>

		<u-modal v-model="checkTypeModalShow" show-cancel-button title="自定义付款方式" @confirm="checkTypeModalConfirm">
			<view class="slot-content"><input class="modal-input" placeholder="请输入自定义付款方式" v-model="check_type_i" /></view>
		</u-modal>
		<u-modal v-model="transTypeModalShow" show-cancel-button title="自定义运输方式" @confirm="transTypeModalConfirm">
			<view class="slot-content"><input class="modal-input" placeholder="请输入自定义运输方式" v-model="trans_type_i" /></view>
		</u-modal>
		<u-modal v-model="feesOutModalShow" show-cancel-button title="自定义运输费用" @confirm="feesOutModalConfirm">
			<view class="slot-content"><input class="modal-input" placeholder="请输入自定义运输费用说明" v-model="fees_out_i" /></view>
		</u-modal>
		<u-modal v-model="packRecyleModalShow" show-cancel-button title="自定义包装选项" @confirm="packRecyleModalConfirm">
			<view class="slot-content"><input class="modal-input" placeholder="请输入自定义包装说明" v-model="pack_recyle_i" /></view>
		</u-modal>

		<!-- 独立修改子项弹窗 -->
		<u-modal v-model="nameModalShow" title="修改商品名称">
			<view class="slot-content"><input class="modal-input" placeholder="请输入商品名称" v-model="chData.name" /></view>
		</u-modal>
		<u-modal v-model="attr2ModalShow" title="修改产品型号">
			<view class="slot-content"><input class="modal-input" placeholder="请输入产品型号" v-model="chData.attr2" /></view>
		</u-modal>
		<u-modal v-model="attr1ModalShow" title="修改电压等级">
			<view class="slot-content"><input class="modal-input" placeholder="请输入电压等级" v-model="chData.attr1" /></view>
		</u-modal>
		<u-modal v-model="attr3ModalShow" title="修改产品规格">
			<view class="slot-content"><input class="modal-input" placeholder="请输入产品规格" v-model="chData.attr3" /></view>
		</u-modal>
		<u-modal v-model="unitModalShow" title="修改计量单位">
			<view class="slot-content"><input class="modal-input" placeholder="请输入计量单位" v-model="chData.unit" /></view>
		</u-modal>

		<u-select v-model="ticketNameShow" @confirm="ticketNameConfirm" :list="ticketNameList" :default-value="[ticket]"></u-select>

		<!-- 单品精细微调弹窗 -->
		<uni-popup ref="popup" type="center">
			<div class="amber-popup-card-box">
				<div class="popup-title">单项商品单独调价与参数修改</div>
				
				<div class="popup-form-item">
					<span class="pop-label">商品名称：{{ chData.name || '无' }}</span>
					<view class="amber-mini-btn" @click="nameModalShow=true">修改</view>
				</div>
				<div class="popup-form-item">
					<span class="pop-label">产品型号：{{ chData.attr2 || '无' }}</span>
					<view class="amber-mini-btn" @click="attr2ModalShow=true">修改</view>
				</div>
				<div class="popup-form-item">
					<span class="pop-label">电压等级：{{ chData.attr1 || '无' }}</span>
					<view class="amber-mini-btn" @click="attr1ModalShow=true">修改</view>
				</div>
				<div class="popup-form-item">
					<span class="pop-label">产品规格：{{ chData.attr3 || '无' }}</span>
					<view class="amber-mini-btn" @click="attr3ModalShow=true">修改</view>
				</div>
				<div class="popup-form-item">
					<span class="pop-label">计量单位：{{ chData.unit || '无' }}</span>
					<view class="amber-mini-btn" @click="unitModalShow=true">修改</view>
				</div>

				<div class="popup-form-item">
					<span class="pop-label-red">修改数量：</span>
					<div class="popup-stepper">
						<span @click="cnrCeil(0)">-</span>
						<input type="number" v-model="chData.nums" class="pop-input-red" />
						<span @click="cnrCeil(1)">+</span>
					</div>
				</div>

				<div class="popup-form-item">
					<span class="pop-label">单品浮动（0.5%步长）：</span>
					<div class="popup-stepper">
						<span @click="priceCeil(0)">-</span>
						<text :class="['pop-val-text', Number(chData.up || 0) > 0 ? 'text-red' : (Number(chData.up || 0) < 0 ? 'text-green' : 'text-gray')]">
							{{ Number(chData.up || 0) > 0 ? '+' + Number(chData.up).toFixed(1) : Number(chData.up || 0).toFixed(1) }}%
						</text>
						<span @click="priceCeil(1)">+</span>
					</div>
				</div>

				<div class="popup-calc-preview">
					当前计算单价：<text class="preview-price">¥{{ (Number(chData.price || 0) * (1 + Number(chData.up || 0)/100) * (Number(chData.ticket_fee || 1)) * (1 + Number(repratio)/100)).toFixed(2) }}</text>
				</div>

				<!-- 重置功能与按钮排布（四按钮均分平铺：保存、重置、删除、取消） -->
				<div class="popup-buttons-row">
					<view class="amber-pop-btn confirm-btn" @click="changAttr()">保存</view>
					<view class="amber-pop-btn reset-btn" @click="resetItemData()">重置</view>
					<view class="amber-pop-btn delete-btn" @click="changDels()">删除</view>
					<view class="amber-pop-btn cancel-btn" @click="cancellation()">取消</view>
				</div>
			</div>
		</uni-popup>

	</view>
</template>

<script>
	import uniPopup from '@/uni_modules/uni-popup/components/uni-popup/uni-popup.vue'
	export default {
		components: {
			uniPopup
		},
		data() {
			return {
				checkTypeOptions: ['货到付款', '款到发货', '双方协商', '自定义输入'],
				transTypeOptions: ['物流运输', '专车运输', '买方自提', '自定义输入'],
				feesOutOptions: ['买方负责', '卖方负责', '双方协商', '自定义输入'],
				packRecyleOptions: ['报价包含产品包装', '报价不含产品包装', '包装需要退还卖方', '买卖双方协商包装', '自定义输入'],
				
				customSelectorShow: false,
				currentSelectorTitle: '',
				currentSelectorOptions: [],
				currentSelectorKey: '',

				// 全称查看弹窗相关状态
				detailModalShow: false,
				detailModalTitle: '',
				detailModalContent: '',

				trans_type_i: '',
				trans_bids_i: '',
				check_type_i: '',
				fees_out_i: '',
				pack_recyle_i: '',
				packRecyleModalShow: false,
				nameModalShow: false,
				attr2ModalShow: false,
				attr1ModalShow: false,
				attr3ModalShow: false,
				unitModalShow: false,
				feesOutModalShow: false,
				transTypeModalShow: false,
				checkTypeModalShow: false,
				ticketNameShow: false,
				ticketNameList: [
					{ value: 0, label: '不含发票' },
					{ value: 2, label: '含专用发票' },
					{ value: 1, label: '含普通发票' },
				],
				uid: '',
				list: [],
				ticket_color: "blue",
				ticket_name: "",
				total: 0,
				total_n: '',
				ratio: '',
				ticket: 0,
				check_type: "",
				trans_bids: "",
				trans_type: "",
				fees_out: "",
				pack_recyle: "",
				rep_comp: "",
				use_comp: "",
				pro_time: "",
				rep_user: "",
				rep_phone: "",
				repdate: '',
				repratio: 0,
				tags: "",
				chData: {},
				originalChData: {}, // 用于记录单品重置的原始载入状态
				clickIndex: null,
				question_comp: "",
				project_comp: "",
				logoInfo: { img_site: '' },
				count: 0,
				customModalShow: false,
				customModalTitle: '提示',
				customModalContent: '确定要清空报价单全部商品吗？',
				quickModalShow: false,
				newQuickText: '',
				quickTemplates: [],
				repCompModalShow: false,
				repCompTarget: 'rep', // 记录当前快速选择单位的目标：'rep'代表报价单位，'question'代表询价单位
				newRepCompText: '',
				repCompList: []
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
				this.loadLocalQuickTemplates();
				this.loadLocalRepComps();
			}
			uni.$on("noteInformation", data => {
				this.myCallbackNoteInformation(data)
			})
		},
		beforeCreate() {
			uni.$off(["noteInformation"]);
		},
		methods: {
			openDetailModal(title, content) {
				this.detailModalTitle = title;
				this.detailModalContent = content || '暂无详细内容';
				this.detailModalShow = true;
			},
			openDetailModalConditionally(title, content, event) {
				if (!content || String(content).length <= 15) {
					return;
				}
				if (event && event.currentTarget) {
					const { scrollWidth, clientWidth } = event.currentTarget;
					if (scrollWidth <= clientWidth) {
						return;
					}
				}
				this.openDetailModal(title, content);
			},
			closeDetailModal() {
				this.detailModalShow = false;
			},
			openCustomSelector(key) {
				this.currentSelectorKey = key;
				if (key === 'check_type') {
					this.currentSelectorTitle = '选择付款方式';
					this.currentSelectorOptions = this.checkTypeOptions;
				} else if (key === 'trans_type') {
					this.currentSelectorTitle = '选择运输方式';
					this.currentSelectorOptions = this.transTypeOptions;
				} else if (key === 'fees_out') {
					this.currentSelectorTitle = '选择运输费用负担';
					this.currentSelectorOptions = this.feesOutOptions;
				} else if (key === 'pack_recyle') {
					this.currentSelectorTitle = '选择包装选项要求';
					this.currentSelectorOptions = this.packRecyleOptions;
				}
				this.customSelectorShow = true;
			},
			closeCustomSelector() {
				this.customSelectorShow = false;
			},
			selectCustomOption(opt) {
				this.customSelectorShow = false;
				let idx = this.currentSelectorOptions.indexOf(opt);
				let key = this.currentSelectorKey;

				if (opt === '自定义输入' || idx === this.currentSelectorOptions.length - 1) {
					if (key === 'check_type') this.checkTypeModalShow = true;
					if (key === 'trans_type') this.transTypeModalShow = true;
					if (key === 'fees_out') this.feesOutModalShow = true;
					if (key === 'pack_recyle') this.packRecyleModalShow = true;
					return;
				}

				if (key === 'check_type') {
					this.check_type = opt;
					this.bjChange(opt, 'check_type');
				} else if (key === 'trans_type') {
					this.trans_type = opt;
					this.bjChange(opt, 'trans_type');
				} else if (key === 'fees_out') {
					this.fees_out = opt;
					this.bjChange(opt, 'fees_out');
				} else if (key === 'pack_recyle') {
					this.pack_recyle = opt;
					this.bjChange(opt, 'pack_recyle');
				}
				uni.showToast({ title: '已设定', icon: 'success' });
			},
			loadLocalQuickTemplates() {
				let storageKey = 'local_quick_remark_templates_' + this.uid;
				let localData = uni.getStorageSync(storageKey);
				if (localData && Array.isArray(localData)) {
					this.quickTemplates = localData;
				} else {
					this.quickTemplates = [
						'本报价单含运费及税金，有效期为15天。',
						'定制规格产品非质量问题概不退换。',
						'货到现场后请当面清点验收，如有异议请于3日内提出。'
					];
					this.saveLocalQuickTemplates();
				}
			},
			saveLocalQuickTemplates() {
				let storageKey = 'local_quick_remark_templates_' + this.uid;
				uni.setStorageSync(storageKey, this.quickTemplates);
			},
			openQuickTemplateModal() {
				this.newQuickText = '';
				this.quickModalShow = true;
			},
			closeQuickTemplateModal() {
				this.quickModalShow = false;
			},
			addQuickTemplateItem() {
				if (!this.newQuickText || !this.newQuickText.trim()) {
					uni.showToast({ title: '请输入有效的文案内容', icon: 'none' });
					return;
				}
				this.quickTemplates.push(this.newQuickText.trim());
				this.saveLocalQuickTemplates();
				this.newQuickText = '';
				uni.showToast({ title: '添加成功', icon: 'success' });
			},
			deleteQuickTemplateItem(index) {
				uni.showModal({
					title: '提示',
					content: '确定要删除这条快捷模板吗？',
					success: (res) => {
						if (res.confirm) {
							this.quickTemplates.splice(index, 1);
							this.saveLocalQuickTemplates();
							uni.showToast({ title: '已删除', icon: 'success' });
						}
					}
				});
			},
			applyQuickTemplate(text) {
				if (this.tags && this.tags.trim().length > 0) {
					this.tags = this.tags + (this.tags.endsWith('\n') ? '' : '\n') + text;
				} else {
					this.tags = text;
				}
				this.reportNewChange({ tags: this.tags });
				this.closeQuickTemplateModal();
				uni.showToast({ title: '已成功选用模板', icon: 'success' });
			},
			loadLocalRepComps() {
				let storageKey = 'local_rep_comp_list_' + this.uid;
				let localData = uni.getStorageSync(storageKey);
				if (localData && Array.isArray(localData)) {
					this.repCompList = localData;
				} else {
					this.repCompList = [
						'某某电缆销售有限公司',
						'某某线缆集团股份有限公司'
					];
					this.saveLocalRepComps();
				}
			},
			saveLocalRepComps() {
				let storageKey = 'local_rep_comp_list_' + this.uid;
				uni.setStorageSync(storageKey, this.repCompList);
			},
			// 修复：支持接收 target 参数，区分是为“报价单位(rep)”还是“询价单位(question)”打开单位库
			openRepCompModal(target = 'rep') {
				this.repCompTarget = target;
				this.newRepCompText = '';
				this.repCompModalShow = true;
			},
			closeRepCompModal() {
				this.repCompModalShow = false;
			},
			addRepCompItem() {
				if (!this.newRepCompText || !this.newRepCompText.trim()) {
					uni.showToast({ title: '请输入有效的公司名称', icon: 'none' });
					return;
				}
				this.repCompList.push(this.newRepCompText.trim());
				this.saveLocalRepComps();
				this.newRepCompText = '';
				uni.showToast({ title: '添加成功', icon: 'success' });
			},
			deleteRepCompItem(index) {
				uni.showModal({
					title: '提示',
					content: '确定要删除这个常用单位吗？',
					success: (res) => {
						if (res.confirm) {
							this.repCompList.splice(index, 1);
							this.saveLocalRepComps();
							uni.showToast({ title: '已删除', icon: 'success' });
						}
					}
				});
			},
			// 修复：根据 repCompTarget 精准回填对应字段，互不干扰
			applyRepComp(compName) {
				if (this.repCompTarget === 'question') {
					this.question_comp = compName;
					this.reportNewChange({ question_comp: this.question_comp });
				} else {
					this.rep_comp = compName;
					this.reportNewChange({ rep_comp: this.rep_comp });
				}
				uni.showToast({ title: '已选用', icon: 'success' });
				this.closeRepCompModal();
			},
			changDels() {
				let that = this;
				let params = { id: that.chData.id };
				that.$api.reportDel(params).then(ret => {
					this.$refs.popup.close();
					that.doIninit();
				})
			},
			quickDelete(item, i) {
				let that = this;
				uni.showModal({
					title: '提示',
					content: '确定要移除该商品吗？',
					success: (res) => {
						if (res.confirm) {
							that.$api.reportDel({ id: item.id }).then(ret => {
								that.doIninit();
							})
						}
					}
				});
			},
			changAttr() {
				let that = this;
				var params = {
					ids: that.chData.id,
					nums: that.chData.nums,
					...this.chData,
				};
				that.$api.reportChange(params).then(ret => {
					this.$refs.popup.close();
					that.doIninit();
				})
			},
			// 实现精准重置方法：点击重置时清空并返回快照初始状态（名称、型号、电压、规格、计量单位、数量及浮动率归零），确保id完整并支持后续正常保存
			resetItemData() {
				if (this.originalChData) {
					let originId = this.chData.id;
					this.chData = Object.assign({}, this.originalChData, { id: originId, up: 0 });
				}
				// 修复：改用无图标轻提示，防止遮挡文字内容，并且不影响后续的保存操作
				uni.showToast({ title: '商品信息已重置', icon: 'none' });
			},
			priceCeil(type) {
				let up = parseFloat(this.chData.up || 0);
				if (type == 1) {
					let num = up + 0.5;
					this.chData.up = num > 100 ? 100 : Number(num.toFixed(1));
				} else {
					let num = up - 0.5;
					this.chData.up = num >= -100 ? Number(num.toFixed(1)) : -100;
				}
			},
			cnrCeil(type) {
				let that = this;
				let temp = type > 0 ? parseInt(that.chData.nums || 0) + 1 : that.chData.nums - 1;
				let nums = temp < 1 ? 1 : temp;
				that.chData.nums = nums;
			},
			openItemPopup(e, i) {
				let that = this;
				this.clickIndex = i;
				// 优先使用缓存的最初原始状态快照作为重置基准
				let initialObj = e._initial ? e._initial : e;
				that.originalChData = Object.assign({}, initialObj);
				that.chData = Object.assign({}, e);
				that.chData.sort = parseInt(e.sort || i + 1);
				this.$refs.popup.open();
			},
			cancellation() {
				this.$refs.popup.close();
				this.doIninit();
			},
			goNoteInformation() {
				uni.navigateTo({
					url: '/pages/report/noteInformation'
				})
			},
			myCallbackNoteInformation(_params) {
				this.tags = _params.title;
				this.reportNewChange({ tags: this.tags });
			},
			clearall() {
				this.customModalTitle = '提示';
				this.customModalContent = '确定要清空报价单全部商品吗？';
				this.customModalShow = true;
			},
			confirmCustomModal() {
				let that = this;
				var params = { uid: that.uid };
				that.$api.clearall(params).then(ret => {
					that.customModalShow = false;
					that.doIninit();
				});
			},
			cancelCustomModal() {
				this.customModalShow = false;
			},
			apply() {
				if (!this.check_type) {
					uni.showToast({ title: '请选择付款方式', icon: 'none' });
					return;
				}
				if (!this.trans_type) {
					uni.showToast({ title: '请选择运输方式', icon: 'none' });
					return;
				}
				if (!this.fees_out) {
					uni.showToast({ title: '请选择运输费用', icon: 'none' });
					return;
				}
				if (!this.pack_recyle) {
					uni.showToast({ title: '请选择包装选项', icon: 'none' });
					return;
				}

				uni.showModal({
					title: '提示',
					content: '确认无误，是否立即生成报价单？',
					success: (res) => {
						if (res.confirm) {
							let that = this;
							var params = {
								uid: that.uid,
								trans_bids: that.trans_bids,
								ratio: that.repratio,
								ticket: that.ticket,
								ticket_fee: that.ratio,
								check_type: that.check_type,
								trans_type: that.trans_type,
								fees_out: that.fees_out,
								pack_recyle: that.pack_recyle,
								rep_comp: that.rep_comp,
								use_comp: that.use_comp,
								pro_time: that.pro_time,
								rep_user: that.rep_user,
								rep_phone: that.rep_phone,
								rep_date: that.repdate,
								tags: that.tags,
								count: that.count,
								money: that.total,
								question_comp: that.question_comp,
								project_comp: that.project_comp,
							};
							that.$api.lists_add(params).then(ret => {
								this.innerAudioContext = uni.createInnerAudioContext();
								this.innerAudioContext.src = "/static/voice/report.mp3";
								this.innerAudioContext.play();
								uni.navigateTo({
									url: '/pages/report/repindex'
								})
							})
						}
					}
				});
			},
			inChange(e, key) {
				this.reportNewChange({ [key]: e.detail.value });
			},
			packRecyleModalConfirm(e) {
				this.pack_recyle = this.pack_recyle_i;
				this.bjChange(this.pack_recyle, "pack_recyle");
			},
			feesOutModalConfirm(e) {
				this.fees_out = this.fees_out_i;
				this.bjChange(this.fees_out, "fees_out");
			},
			transTypeModalConfirm(e) {
				this.trans_type = this.trans_type_i;
				this.bjChange(this.trans_type, "trans_type");
			},
			checkTypeModalConfirm(e) {
				this.check_type = this.check_type_i;
				this.bjChange(this.check_type, "check_type");
			},
			bjChange(e, key) {
				this.reportNewChange({ [key]: e });
			},
			ticketNameConfirm(e) {
				this.ticket_name = e[0].label;
				this.ticket = Number(e[0].value);
				this.$api.changeTicket({ uid: this.uid, ticket: this.ticket }).then(res => {
					this.doIninit();
				}).catch(err => {});
			},
			revCeil() {
				let num = Number(this.repratio || 0) - 0.5;
				this.repratio = num >= -100 ? Number(num.toFixed(1)) : 0;
				this.reportNewChange({ ratio: this.repratio });
				setTimeout(() => { this.doIninit(); }, 200);
			},
			addCeil() {
				let num = Number(this.repratio || 0) + 0.5;
				this.repratio = num <= 100 ? Number(num.toFixed(1)) : 100;
				this.reportNewChange({ ratio: this.repratio });
				setTimeout(() => { this.doIninit(); }, 200);
			},
			reportNewChange(data) {
				this.$api.ReportNewChange({ uid: this.uid, ...data });
			},
			doIninit() {
				let that = this;
				var params = { uid: that.uid, ratio: that.repratio };
				that.$api.ReportNewList(params).then(ret => {
					that.list = ret.data.list || [];
					this.count = 0;
					this.list.forEach((item) => {
						this.count += parseInt(item.nums || 0);
						// 记录并缓存每个商品初次进入报价单时的纯净原始状态快照，确保重置时万无一失
						if (!item._initial) {
							item._initial = {
								id: item.id,
								name: item.name || item.title || item.goods_name || '',
								attr1: item.attr1 || '',
								attr2: item.attr2 || '',
								attr3: item.attr3 || '',
								unit: item.unit || '',
								nums: item.nums || 0,
								up: 0,
								price: item.price || 0,
								change_price: item.change_price
							};
						}
					});

					that.total = ret.data.total;
					that.total_n = ret.data.total_n;
					that.ratio = ret.data.ratio;
					
					let remoteTicket = ret.data.report_temp ? ret.data.report_temp.ticket : ret.data.ticket;
					that.ticket = (remoteTicket !== undefined && remoteTicket !== null && remoteTicket !== '') ? Number(remoteTicket) : 0;

					if (ret.data.report_temp) {
						that.check_type = ret.data.report_temp.check_type;
						that.trans_type = ret.data.report_temp.trans_type;
						that.fees_out = ret.data.report_temp.fees_out;
						that.pack_recyle = ret.data.report_temp.pack_recyle;
						that.rep_comp = ret.data.report_temp.rep_comp;
						that.use_comp = ret.data.report_temp.use_comp;
						that.pro_time = ret.data.report_temp.pro_time;
						that.rep_user = ret.data.report_temp.rep_user;
						that.rep_phone = ret.data.report_temp.rep_phone;
						that.tags = ret.data.report_temp?.tags;
						that.question_comp = ret.data.report_temp.question_comp;
						that.project_comp = ret.data.report_temp.project_comp;
						this.trans_bids = ret.data.report_temp.trans_bids;
						that.repratio = parseFloat(ret.data.report_temp.ratio || 0);
					} else {
						that.check_type = '';
						that.trans_type = '';
						that.fees_out = '';
						that.pack_recyle = '';
						that.rep_comp = '';
						that.use_comp = '';
						that.pro_time = '';
						that.rep_user = '';
						that.rep_phone = '';
						that.tags = '';
						that.question_comp = '';
						that.project_comp = '';
						this.trans_bids = '';
						that.repratio = ret.data.ratio ? parseFloat(ret.data.ratio) : 0;
					}

					if (that.ticket === 0) {
						that.ticket_color = "blue";
						that.ticket_name = "不含发票";
					} else if (that.ticket === 1) {
						that.ticket_color = "blue";
						that.ticket_name = "含普通发票";
					} else if (that.ticket === 2) {
						that.ticket_color = "blue";
						that.ticket_name = "含专用发票";
					} else {
						that.ticket_color = "blue";
						that.ticket_name = "不含发票";
					}
				}).catch(err => {});
			}
		}
	}
</script>

<style scoped lang="scss">
	.modern-report-page {
		background-color: #f1f5f9;
		min-height: 100vh;
		padding: 20rpx;
		box-sizing: border-box;
		font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
	}

	.text-red { color: #dc2626 !important; }
	.text-green { color: #16a34a !important; }
	.text-gray { color: #64748b !important; }
	.text-dark { color: #1e293b !important; }
	.text-blue { color: #0284c7 !important; }

	/* 产品规格、型号、电压等级的蓝色字体优化调整，采用更亮眼的鲜明亮蓝色 #2563eb */
	.text-blue-bright {
		color: #2563eb !important;
		font-weight: 500 !important;
	}

	/* 商品名称文字颜色样式类，赋予醒目且有层次的现代化深色 #666666 兼具微粗体 */
	.card-goods-name-styled {
		color: #666666 !important;
		font-weight: 600 !important;
	}

	.custom-blue-text {
		color: #2563eb !important;
		font-weight: 500 !important;
	}

	.custom-harmonized-text {
		color: #2563eb !important;
		font-weight: 500 !important;
	}

	.pop-label-red {
		color: #38bdf8 !important;
		font-weight: 600 !important;
	}
	.pop-input-red {
		color: #dc2626 !important;
		font-weight: bold !important;
	}

	.dock-title-black {
		color: #1e293b !important;
		font-weight: 500 !important;
	}
	.dock-val-red {
		color: #dc2626 !important;
		font-weight: bold !important;
	}
	.money-num-red {
		color: #dc2626 !important;
		font-weight: bold !important;
		font-size: 34rpx !important;
		margin-left: 6rpx;
	}
	.dock-content-red {
		color: #dc2626 !important;
	}

	.tax-flag-badge {
		padding: 2rpx 12rpx;
		border-radius: 6rpx;
		font-size: 20rpx;
		font-weight: bold;
		&.badge-none {
			background: #f1f5f9;
			color: #64748b;
			border: 1rpx solid #cbd5e1;
		}
		&.badge-normal {
			background: #eff6ff;
			color: #2563eb;
			border: 1rpx solid #bfdbfe;
		}
		&.badge-special {
			background: #fff1f2;
			color: #e11d48;
			border: 1rpx solid #fecdd3;
		}
	}

	.hero-control-header.amber-theme-box {
		background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
		border: 1rpx solid #fde68a;
		border-radius: 20rpx;
		padding: 20rpx 24rpx;
		box-shadow: 0 8rpx 20rpx -4rpx rgba(217, 119, 6, 0.12);
		margin-bottom: 20rpx;

		.header-title-row {
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-bottom: 14rpx;

			.main-label {
				font-size: 26rpx;
				font-weight: bold;
				color: #92400e;
			}

			.stepper-box {
				display: flex;
				align-items: center;
				background: #ffffff;
				border-radius: 28rpx;
				padding: 2rpx;
				border: 1rpx solid #fcd34d;

				.step-btn {
					width: 44rpx;
					height: 44rpx;
					background: #fef3c7;
					border-radius: 50%;
					display: flex;
					align-items: center;
					justify-content: center;
					font-size: 28rpx;
					font-weight: bold;
					color: #d97706;
					box-shadow: 0 2rpx 6rpx rgba(217, 119, 6, 0.15);
				}

				.step-value {
					padding: 0 20rpx;
					font-size: 26rpx;
					font-weight: bold;
				}
			}
		}

		.filter-capsule-row {
			display: flex;

			.capsule-pill.full-width-pill {
				width: 100%;
				background: #ffffff;
				border: 1rpx solid #fde68a;
				border-radius: 12rpx;
				padding: 14rpx 20rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.02);

				.pill-left-group {
					.pill-key {
						font-size: 24rpx;
						color: #78350f;
						font-weight: bold;
					}
				}

				.pill-right-group {
					display: flex;
					align-items: center;
					gap: 8rpx;

					.pill-val {
						font-size: 24rpx;
						color: #b45309;
						font-weight: bold;
					}
				}
			}
		}
	}

	.product-stream-section {
		margin-bottom: 20rpx;

		.section-heading {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 14rpx;
			padding: 0 6rpx;

			.sec-title {
				font-size: 26rpx;
				font-weight: bold;
				color: #1e293b;
			}

			.sec-count {
				font-size: 22rpx;
				color: #64748b;
			}
		}

		.empty-state {
			background: #ffffff;
			border-radius: 20rpx;
			padding: 30rpx;
			text-align: center;
			color: #94a3b8;
			font-size: 26rpx;
			box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.04);
		}

		.floating-card-item {
			border-radius: 20rpx;
			padding: 20rpx 24rpx;
			margin-bottom: 40rpx;
			box-shadow: 0 8rpx 24rpx rgba(100, 116, 139, 0.12);
			display: flex;
			flex-direction: column;
			gap: 12rpx;
			transition: all 0.2s ease;

			&.card-odd {
				background-color: #ffffff;
				border: 1rpx solid #cbd5e1;
				box-shadow: 0 6rpx 20rpx rgba(100, 116, 139, 0.08);
			}
			&.card-even {
				background-color: #f1f5f9;
				border: 1rpx solid #94a3b8;
				box-shadow: 0 6rpx 20rpx rgba(100, 116, 139, 0.15);
			}

			.card-header-bar-custom {
				background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
				padding: 10rpx 14rpx;
				border-radius: 12rpx;
				border: 1rpx solid #cbd5e1;

				.item-index-badge-custom {
					font-size: 24rpx;
					font-weight: 800;
					color: #0f172a;
					background: #ffffff;
					padding: 4rpx 12rpx;
					border-radius: 8rpx;
					border: 1rpx solid #cbd5e1;
					box-shadow: 0 2rpx 4rpx rgba(0,0,0,0.03);
				}
			}

			.sketch-row-1 {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding-bottom: 10rpx;
				border-bottom: 1rpx dashed #cbd5e1;

				.index-slot {
					flex: 1;
					display: flex;
					align-items: center;
				}

				.center-pill-slot {
				    flex: 1;
				    display: flex;
				    justify-content: center;
				    align-items: center;
				    margin-left: -170rpx;

					.mini-ratio-pill-top {
						font-size: 20rpx;
						font-weight: bold;
						padding: 2rpx 10rpx;
						border-radius: 6rpx;
						height: 32rpx;
						line-height: 32rpx;
						display: inline-flex;
						align-items: center;
						justify-content: center;

						&.pill-red-solid {
							background: #dc2626;
							color: #ffffff;
						}
						&.pill-green-solid {
							background: #16a34a;
							color: #ffffff;
						}
						&.pill-gray-solid {
							background: #64748b;
							color: #ffffff;
						}
					}
				}

				.right-action-slot {
					flex: 1;
					display: flex;
					justify-content: flex-end;
					align-items: center;
					gap: 50rpx;

					.batch-adjust-btn-custom-subtle {
						background: #f8fafc;
						border: 1rpx solid #cbd5e1;
						padding: 4rpx 16rpx;
						border-radius: 12rpx;
						display: flex;
						align-items: center;
						gap: 4rpx;
						flex-shrink: 0;

						.adjust-txt-custom {
							font-size: 22rpx;
							color: #475569;
							font-weight: 500;
							white-space: nowrap;
						}
					}

					.del-icon-btn {
						font-size: 38rpx;
						color: #94a3b8;
						padding: 0 4rpx;
						line-height: 1;
					}
				}
			}

			.card-title-section-inline {
				display: flex;
				align-items: baseline;
				padding: 4rpx 0 4rpx 16rpx;
				gap: 4rpx;
				margin: 0;

				.card-title-header-label {
					font-size: 24rpx;
					font-weight: 600;
					color: #64748b;
					flex-shrink: 0;
				}

				.card-goods-name {
					font-size: 26rpx;
					line-height: 1.4;
					flex: 1;
				}
			}

			.card-attr-grid {
				display: flex;
				flex-direction: column;
				gap: 10rpx;
				background: #ffffff;
				padding: 14rpx 16rpx;
				border-radius: 12rpx;
				border: 1rpx solid #e2e8f0;

				.attr-row-flex {
					display: flex;
					align-items: center;
					justify-content: space-between;
					gap: 16rpx;
					width: 100%;

					.attr-col-item {
						display: flex;
						align-items: center;
						font-size: 24rpx;
						flex: 1;
						overflow: hidden;

						.attr-label {
							color: #64748b;
							font-weight: 600;
							flex-shrink: 0;
						}

						.attr-val {
							flex: 1;
						}
					}
				}

				.attr-row-item-full {
					display: flex;
					align-items: center;
					font-size: 24rpx;
					width: 100%;

					.attr-label {
						color: #64748b;
						font-weight: 600;
						flex-shrink: 0;
						width: 130rpx;
					}

					.attr-val {
						flex: 1;
					}
				}
			}

			.card-financial-dock {
				display: flex;
				justify-content: space-between;
				align-items: center;
				background: #fff;
				border: 1rpx solid #fef3c7;
				background: linear-gradient(135deg, #fffdf4 0%, #fffbeb 100%);
				padding: 14rpx 18rpx;
				border-radius: 12rpx;
				margin-top: 4rpx;

				.fin-item {
					display: flex;
					align-items: center;
					font-size: 24rpx;
					flex-shrink: 0;
					white-space: nowrap;

					.fin-label {
						color: #78350f;
						font-weight: 600;
						margin-right: 4rpx;
					}

					.fin-num-bold {
						color: #1e293b;
						font-weight: bold;
						font-size: 26rpx;
					}

					.fin-price-unit {
						font-weight: bold;
						font-size: 26rpx;
					}

					&.subtotal-alignment {
						.fin-subtotal-red {
							color: #e11d48;
							font-weight: 800;
							font-size: 28rpx;
						}
					}
				}
			}

			.ellipsis-text {
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				cursor: pointer;
			}
		}
	}

	.floating-section-card {
		background: #ffffff;
		border-radius: 20rpx;
		padding: 4rpx 24rpx;
		margin-bottom: 20rpx;
		box-shadow: 0 8rpx 20rpx rgba(148, 163, 184, 0.08);
		border: 1rpx solid #e2e8f0;

		&.compact-remark-card {
			padding-bottom: 12rpx;

			.textarea-box {
				padding: 8rpx 0 10rpx 0;

				.modern-textarea.auto-grow-textarea {
					width: 100%;
					min-height: 72rpx;
					max-height: 240rpx;
					background: #f8fafc;
					border: 1rpx solid #e2e8f0;
					border-radius: 12rpx;
					padding: 12rpx 16rpx;
					box-sizing: border-box;
					font-size: 26rpx;
					color: #334155;
					line-height: 1.4;
				}
			}
		}

		.form-group-title {
			font-size: 24rpx;
			font-weight: bold;
			color: #b45309;
			padding: 18rpx 0 10rpx 0;
			border-bottom: 1rpx solid #fef3c7;
			margin-bottom: 4rpx;

			&.header-row-flex {
				display: flex;
				justify-content: space-between;
				align-items: center;

				.template-header-actions {
					display: flex;
					gap: 12rpx;
					align-items: center;
				}

				.template-badge-btn {
					font-size: 22rpx;
					padding: 6rpx 16rpx;
					border-radius: 16rpx;
					font-weight: bold;
					box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);

					/* 琥珀金：代表报价体系主体 */
					&.amber-btn {
						background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
						color: #ffffff;
					}

					/* 商务蓝：代表询价体系主体 */
					&.blue-btn {
						background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
						color: #ffffff;
					}
				}
			}
		}

		.modern-form-item {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 18rpx 0;
			border-bottom: 1rpx solid #f8fafc;

			&:last-child {
				border-bottom: none;
			}

			&.clickable-item {
				cursor: pointer;
			}

			.form-label {
				font-size: 26rpx;
				color: #334155;
				flex-shrink: 0;
				font-weight: 500;
			}

			.picker-value-box {
				flex: 1;
				display: flex;
				justify-content: flex-end;
				align-items: center;
				gap: 8rpx;

				.val-text {
					font-size: 26rpx;
					color: #d97706;
					font-weight: bold;
				}
			}

			.modern-input {
				flex: 1;
				text-align: right;
				font-size: 26rpx;
				color: #334155;
			}
		}
	}

	.input-placeholder-light {
		color: #adb5bd !important;
		font-weight: normal;
	}

	.bottom-spacer {
		height: 380rpx;
	}

	.floating-checkout-dock {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		width: 100%;
		max-width: 750rpx;
		margin: 0 auto;
		background: #ffffff;
		box-shadow: 0 -12rpx 35rpx rgba(0, 0, 0, 0.08);
		border-radius: 28rpx 28rpx 0 0;
		z-index: 99;
		padding: 20rpx 28rpx calc(20rpx + env(safe-area-inset-bottom)) 28rpx;
		box-sizing: border-box;

		.dock-summary-info {
			background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
			border-radius: 16rpx;
			padding: 14rpx 20rpx;
			margin-bottom: 14rpx;
			border: 1rpx solid #fde68a;

			.sum-row-top {
				display: flex;
				justify-content: space-between;
				align-items: center;
				font-size: 22rpx;
				margin-bottom: 6rpx;
			}

			.sum-row-bottom {
				margin-bottom: 2rpx;
				.total-money-label {
					font-size: 24rpx;
					font-weight: bold;
				}
			}

			.sum-row-words {
				.chinese-words {
					font-size: 20rpx;
				}
			}
		}

		.dock-actions-row {
			display: flex;
			gap: 16rpx;
			margin-bottom: 8rpx;

			button {
				flex: 1;
				height: 76rpx;
				border-radius: 16rpx;
				font-size: 26rpx;
				font-weight: bold;
				display: flex;
				align-items: center;
				justify-content: center;
				border: none;
			}

			.btn-clear {
				background: #f1f5f9;
				color: #64748b;
			}

			.btn-submit {
				background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
				color: #ffffff;
				box-shadow: 0 4rpx 12rpx rgba(217, 119, 6, 0.25);
				letter-spacing: 1rpx;
			}
		}

		.dock-tips {
			text-align: center;
			font-size: 18rpx;
			color: #94a3b8;
		}
	}

	.custom-modal-mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(15, 23, 42, 0.5);
		backdrop-filter: blur(4px);
		z-index: 999;
		display: flex;
		align-items: center;
		justify-content: center;

		.custom-modal-container {
			width: 600rpx;
			background: #ffffff;
			border-radius: 28rpx;
			padding: 40rpx 32rpx 32rpx 32rpx;
			box-sizing: border-box;
			box-shadow: 0 25rpx 50rpx -12rpx rgba(0, 0, 0, 0.25);
			border: 1rpx solid #e2e8f0;

			/* 宽体弹窗宽度扩宽至 720rpx 左右，为按钮留出充裕空间 */
			&.wide-modal-container {
				width: 720rpx;
				max-height: 82vh;
				display: flex;
				flex-direction: column;
			}

			.custom-modal-title {
				font-size: 32rpx;
				font-weight: bold;
				color: #1e293b;
				text-align: center;
				margin-bottom: 8rpx;
			}

			.sub-modal-desc {
				font-size: 22rpx;
				color: #94a3b8;
				text-align: center;
				margin-bottom: 24rpx;
			}

			.add-template-input-row {
				display: flex;
				gap: 12rpx;
				margin-bottom: 20rpx;

				.modal-inline-input {
					flex: 1;
					height: 72rpx;
					background: #f8fafc;
					border: 1rpx solid #e2e8f0;
					border-radius: 12rpx;
					padding: 0 20rpx;
					font-size: 26rpx;
					color: #334155;
				}

				.inline-add-btn {
					width: 160rpx;
					height: 72rpx;
					background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
					color: #ffffff;
					font-size: 24rpx;
					font-weight: bold;
					border-radius: 12rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					border: none;
					flex-shrink: 0;
				}
			}

			.template-items-scroll {
				max-height: 440rpx;
				width: 100%;
				box-sizing: border-box;

				.empty-quick-tips {
					text-align: center;
					color: #94a3b8;
					font-size: 24rpx;
					padding: 40rpx 0;
				}

				.template-manage-card {
					background: #f8fafc;
					border: 1rpx solid #e2e8f0;
					border-radius: 16rpx;
					padding: 20rpx;
					margin-bottom: 16rpx;

					.manage-card-body {
						cursor: pointer;
						margin-bottom: 14rpx;

						.card-mini-indicator {
							display: flex;
							align-items: center;
							gap: 6rpx;
							margin-bottom: 8rpx;

							.dot-icon {
								width: 10rpx;
								height: 10rpx;
								background: #d97706;
								border-radius: 50%;
							}

							.indicator-title {
								font-size: 20rpx;
								color: #b45309;
								font-weight: bold;
							}
						}

						.manage-item-text {
							font-size: 26rpx;
							color: #334155;
							line-height: 1.5;
							word-break: break-all;
						}
					}

					.manage-card-footer {
						display: flex;
						justify-content: flex-end;
						gap: 10rpx;
						border-top: 1rpx dashed #e2e8f0;
						padding-top: 12rpx;

						.action-btn-pill {
							padding: 8rpx 20rpx;
							border-radius: 10rpx;
							font-size: 22rpx;
							font-weight: bold;
							display: flex;
							align-items: center;

							&.use-pill {
								background: #fffbeb;
								color: #b45309;
								border: 1rpx solid #fde68a;
							}

							&.del-pill {
								background: #fef2f2;
								color: #ef4444;
								border: 1rpx solid #fecaca;
							}
						}
					}
				}
			}

			.custom-modal-content {
				font-size: 28rpx;
				color: #475569;
				text-align: center;
				line-height: 1.5;
				margin-bottom: 40rpx;
				padding: 0 10rpx;

				&.detail-content-box {
					text-align: left;
					word-break: break-all;
					max-height: 300rpx;
					overflow-y: auto;
					background: #f8fafc;
					padding: 16rpx;
					border-radius: 12rpx;
					border: 1rpx solid #e2e8f0;
					color: #1e293b;
				}
			}

			.custom-modal-footer {
				display: flex;
				gap: 20rpx;

				.c-modal-btn {
					flex: 1;
					height: 80rpx;
					border-radius: 16rpx;
					font-size: 28rpx;
					font-weight: bold;
					display: flex;
					align-items: center;
					justify-content: center;
					border: none;
				}

				.c-btn-cancel {
					background: #f1f5f9;
					color: #64748b;
				}

				.c-btn-confirm {
					background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
					color: #ffffff;
					box-shadow: 0 6rpx 16rpx rgba(217, 119, 6, 0.3);
				}
			}
		}
	}

	.slot-content {
		padding: 20rpx;
		.modal-input {
			background: #f8fafc;
			border: 1rpx solid #e2e8f0;
			border-radius: 12rpx;
			padding: 20rpx;
			font-size: 26rpx;
			color: #334155;
		}
	}

	.amber-popup-card-box {
		background: #ffffff;
		border-radius: 24rpx;
		padding: 28rpx 24rpx;
		width: 560rpx;
		max-width: 88vw;
		box-sizing: border-box;
		box-shadow: 0 20rpx 40rpx rgba(0, 0, 0, 0.18);
		border: 1rpx solid #e2e8f0;

		.popup-title {
			font-size: 28rpx;
			font-weight: bold;
			text-align: center;
			margin-bottom: 20rpx;
			color: #1e293b;
		}

		.popup-form-item {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 16rpx;
			font-size: 24rpx;
			color: #475569;
			background: #f8fafc;
			padding: 8rpx 12rpx;
			border-radius: 10rpx;
			border: 1rpx solid #f1f5f9;

			.pop-label {
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				flex: 1;
				margin-right: 10rpx;
				color: #334155;
				font-weight: 500;
			}

			.amber-mini-btn {
				background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
				color: #ffffff;
				font-size: 20rpx;
				padding: 4rpx 16rpx;
				border-radius: 8rpx;
				font-weight: bold;
				flex-shrink: 0;
			}

			.popup-stepper {
				display: flex;
				align-items: center;
				background: #ffffff;
				border-radius: 8rpx;
				overflow: hidden;
				flex-shrink: 0;
				border: 1rpx solid #e2e8f0;

				span {
					width: 40rpx;
					height: 40rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					background: #f8fafc;
					font-weight: bold;
					font-size: 24rpx;
					color: #64748b;
				}

				input, .pop-val-text {
					width: 72rpx;
					text-align: center;
					font-size: 24rpx;
					color: #1e293b;
					font-weight: bold;
				}
			}
		}

		.popup-calc-preview {
			background: #fffbeb;
			border: 1rpx solid #fef3c7;
			padding: 12rpx;
			border-radius: 10rpx;
			text-align: center;
			font-size: 24rpx;
			color: #92400e;
			margin-bottom: 20rpx;

			.preview-price {
				color: #d97706;
				font-weight: bold;
				font-size: 28rpx;
				margin-left: 6rpx;
			}
		}

		/* 底部按钮栏均分排布优化（保存、重置、删除、取消四按钮横向平铺，间距更协调） */
		.popup-buttons-row {
			display: flex;
			gap: 8rpx;
			justify-content: space-between;
			width: 100%;
			box-sizing: border-box;

			.amber-pop-btn {
				flex: 1;
				height: 68rpx;
				border-radius: 12rpx;
				font-size: 22rpx;
				font-weight: bold;
				display: flex;
				align-items: center;
				justify-content: center;
				border: none;
				padding: 0 4rpx;

				&.confirm-btn {
					background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
					color: #ffffff;
					box-shadow: 0 4rpx 10rpx rgba(217, 119, 6, 0.25);
				}

				&.reset-btn {
					background: #f8fafc;
					color: #d97706;
					border: 1rpx solid #fde68a;
				}

				&.delete-btn {
					background: #fef2f2;
					color: #ef4444;
					border: 1rpx solid #fecaca;
				}

				&.cancel-btn {
					background: #f1f5f9;
					color: #64748b;
				}
			}
		}
	}

	@media screen and (min-width: 768px) {
		.modern-report-page {
			max-width: 750rpx;
			margin: 0 auto;
			box-shadow: 0 0 20rpx rgba(0, 0, 0, 0.05);
		}
		
		.floating-checkout-dock {
			width: 750rpx !important;
			left: 50% !important;
			transform: translateX(-50%);
		}
	}
</style>