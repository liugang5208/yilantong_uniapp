<template>
	<view class="page">
		
		<!-- 1. 顶部导航栏 -->
		<view :class="['pageTab', 'fixed-nav', act_index !== 0 ? 'nav-shadow-active' : '']">
			<view class="nav-item-box" @click="backNav()">
				<image mode="widthFix" :src="backSvgIcon" class="nav-icon-original" />
			</view>
			<view class="nav-center">
				<p :class="act_index==0?'active':''" @click="changePage(0)">商品</p>
				<p :class="act_index==1?'active':''" @click="changePage(1)">参数</p>
				<p :class="act_index==2?'active':''" @click="changePage(2)">详情</p>
			</view>
			<view class="nav-right-group">
				<!-- 报价单入口 -->
				<view :class="['nav-item-box', 'report-item-box', isReportBouncing ? 'report-bounce-anim' : '']" id="report-target-icon" @click="goReport()">
					<view class="svg-icon-wrapper">
						<image mode="widthFix" :src="reportSvgIcon" class="nav-icon-original" />
					</view>
					<view class="cart-badge-count" v-if="reportBadgeCount > 0">{{ reportBadgeCount }}</view>
				</view>
				<!-- 购物车图标入口 -->
				<view :class="['nav-item-box', 'cart-item-box', isCartBouncing ? 'cart-bounce-anim' : '']" id="cart-target-icon" @click="goCart()">
					<view class="svg-icon-wrapper">
						<image mode="widthFix" :src="cartSvgIcon" class="nav-icon-original" />
					</view>
					<view class="cart-badge-count" v-if="cartBadgeCount > 0">{{ cartBadgeCount }}</view>
				</view>
				<!-- 电话咨询入口 -->
				<view class="nav-item-box" @click="callnumber()">
					<view class="svg-icon-wrapper">
						<image mode="widthFix" :src="phoneSvgIcon" class="nav-icon-original" />
					</view>
				</view>
			</view>
		</view>

		<!-- 弹跳、缩成原点并带有拖拽尾巴的精准跳入动效元素 -->
		<view :class="['classic-fly-streak', flyType === 'report' ? 'streak-green' : 'streak-red']" v-if="isFlying" :style="{ 
			transform: `translate3d(${flyX}px, ${flyY}px, 0) scale(${flyScale})`, 
			opacity: flyOpacity 
		}">
			<view class="streak-tail-trail"></view>
			<view class="streak-core-dot"></view>
		</view>

		<view style="width: 100%; height: 88rpx;"></view>

		<view :class="act_index==0?'':'none'">
			<!-- Banner 区域 -->
			    <view class="banner" style="margin: 0;padding: 0;" v-if="blank_info && blank_info.source_url && blank_info.source_url.length > 0 && blank_info.source_url[0]">
			      <image mode="widthFix" :src="blank_info.source_url[0]">
			    </view>

			<!-- 2. 商品表格标题栏 (自适应 4 列网格) -->
			<view :class="['iosTba', (isSticky && act_index==0) ? 'fixed-header' : '']" v-if="act_index==0 && list_count>0">
				<view class="lists bg table-header-floating adaptive-grid-row">
					<div class="col-item" v-if="keys">{{keys.key_5}}</div>
					<div class="col-item" v-if="keys">{{keys.key_6}}</div>
					<div class="col-item" v-if="keys">
						<span>{{keys.key_7}}</span>
					</div>
					<div class="col-item">商品单价</div>
				</view>
			</view>

			<view class="table-placeholder" v-if="isSticky && act_index==0"></view>

			<!-- 列表数据区 -->
			<view v-for="(x,i) in list" :key="i" class="lists adaptive-grid-row click-scale-effect" :class="{'ticket_color': clickIndex==i}"
				@click="openBuyer(x,i)">
				<div class="col-item modal-cell-text">
					<span>{{x.value_5}}</span>
				</div>
				<div class="col-item modal-cell-text">
					<span>{{x.value_6}}</span>
				</div>
				<div class="col-item modal-cell-text">
					<span>{{x.value_7}}</span>
				</div>
				<div class="col-item modal-cell-text">
					<span :class="getPriceColorClass()">
						{{transpoint(x.market*ticket*ulevel['up'])}}
					</span>
				</div>
			</view>

			<!-- 底部友好提示 -->
			<view class="list-bottom-tip" v-if="list_count>0">
				<view class="tip-line-primary">工业品供应链一站式服务 · 易缆通为您省力省心更省钱</view>
				<view class="tip-line-secondary">如果没有找到合适的产品，请咨询客服为您提供帮助</view>
			</view>
		</view>
		
		<view style="width: 100%;height: 380rpx;"></view>

		<!-- 参数与详情页 -->
		<view :class="['detail-content-box', act_index !== 0 ? 'detail-content-pulled' : '']">
			<view v-if="act_index==1">
				<rich-text style="width: 750rpx;" :nodes="setNodes(ginfo && ginfo.g_attr)"></rich-text>
			</view>
			<view v-if="act_index==2">
				<rich-text style="width: 750rpx;" :nodes="setNodes(ginfo && ginfo.g_desc)"></rich-text>
			</view>
		</view>

		<!-- 底部筛选面板：升级轻奢乳灰微透渐变与立体上阴影，实现视觉彻底隔离 -->
		<view class="footer" v-if="act_index==0">
			<!-- 标准选项：来自"标准选项管理"分组 -->
			<view class="footer-row">
				<text class="footer-label">标准:</text>
				<view class="footer-pills-scroll">
					<view v-for="(g, i) in groups" :key="g.id"
						:class="['pill-transition', group_id == g.id ? 'pill-success' : 'pill-default']"
						@click="groupChange(g)">
						{{ g.name }}
					</view>
				</view>
			</view>
			<!-- 类型选项：来自"商品属性管理"，随所选标准分组联动 -->
			<view class="footer-row">
				<text class="footer-label">类型:</text>
				<view class="footer-pills-scroll">
					<view v-for="(x, i) in blank" :key="x.id"
						v-if="i < 10"
						:class="['pill-transition', cat_index == x.cat_index ? 'pill-navy' : 'pill-default']"
						@click="blankChange(x)">
						{{ x.catname }}
					</view>
				</view>
			</view>
			<view class="footer-row">
				<text class="footer-label">发票:</text>
				<view class="footer-pills-fixed">
					<view :class="['pill-transition', ticket_index==0?'pill-maroon':'pill-default']" @click="texChange(0)">不含发票价</view>
					<view :class="['pill-transition', ticket_index==2?'pill-blue':'pill-default']" @click="texChange(2)">含专用发票</view>
					<view :class="['pill-transition', ticket_index==1?'pill-purple':'pill-default']" @click="texChange(1)">含普通发票</view>
				</view>
			</view>
		</view>

		<!-- 遮罩层 -->
		<view class="masks" @click="closeBuyer()" @touchmove.stop.prevent="preventScroll" v-if="copen>0 || isClosingPanel"></view>

		<!-- 顶部的悬浮选中行 (已修复：弹窗时独立锁定，顶部标题为灰色框加常规白字，选中内容为白色框加常规字，价格为醒目红色，整体往上提了一格) -->
		<view v-if="copen>0" @touchmove.stop.prevent="preventScroll" class="popup-top-sticky-container">
			<view v-if="list_count>0">
				<view class="lists bg table-header-selected-black adaptive-grid-row">
					<div class="col-item" v-if="keys">{{keys.key_5}}</div>
					<div class="col-item" v-if="keys">{{keys.key_6}}</div>
					<div class="col-item" v-if="keys">{{keys.key_7}}</div>
					<div class="col-item">商品单价</div>
				</view>
			</view>
			<view class="lists popup-row-bright adaptive-grid-row" v-if="list.length>0 && list[clickIndex]">
				<div class="col-item modal-cell-text">{{list[clickIndex].value_5}}</div>
				<div class="col-item modal-cell-text">{{list[clickIndex].value_6}}</div>
				<div class="col-item modal-cell-text">{{list[clickIndex].value_7}}</div>
				<div class="col-item popup-price-text modal-cell-text price-red">
					{{transpoint(list[clickIndex].market*ticket*ulevel['up'])}}
				</div>
			</view>
		</view>

		<!-- 弹窗面板 (已优化结构间隔与区块视觉排版) -->
		<view :class="['masks_panel', isClosingPanel ? 'panel-slide-down' : '']" @touchmove.stop.prevent="preventScroll" v-if="copen>0 || isClosingPanel">
			<view class="masks_panel_close" @click="closeBuyer()">
				<div class="close-icon-white">×</div>
			</view>
			
			<view class="panel-header-box">
				<view class="panel-title">商品基础信息
                    <text class="icon-help" @click="showTermsModal = true">?</text>
                </view>
			</view>

			<!-- 1. 产品信息与价格明细 (优化间距与现代卡片边距) -->
			<view class="category-section-box red-section-bg">
				<div class="specs-grid-box">
					<view class="spec-item-full spec-item-name-row" v-if="blank_info">
						<text class="s-label">商品名称：</text>
						<view class="s-val-outer">
							<view class="s-val-marquee" :class="{'marquee-running': isTextOverflow(blank_info.gnames, 20)}">
								<text class="s-val product-name-custom">{{ blank_info.gnames }}</text>
								<text class="s-val product-name-custom duplicate-text" v-if="isTextOverflow(blank_info.gnames, 20)">{{ blank_info.gnames }}</text>
							</view>
						</view>
					</view>
					<view class="spec-item">
						<text class="s-label">{{keys ? keys.key_6 : '产品型号'}}：</text>
						<view class="s-val-outer">
							<view class="s-val-marquee" :class="{'marquee-running': isTextOverflow(cdata.value_6, 12)}">
								<text class="s-val text-content-red">{{cdata.value_6}}</text>
								<text class="s-val text-content-red duplicate-text" v-if="isTextOverflow(cdata.value_6, 12)">{{cdata.value_6}}</text>
							</view>
						</view>
					</view>
					<view class="spec-item">
						<text class="s-label">{{keys ? keys.key_5 : '电压等级'}}：</text>
						<view class="s-val-outer">
							<view class="s-val-marquee" :class="{'marquee-running': isTextOverflow(cdata.value_5, 12)}">
								<text class="s-val text-content-red">{{cdata.value_5}}</text>
								<text class="s-val text-content-red duplicate-text" v-if="isTextOverflow(cdata.value_5, 12)">{{cdata.value_5}}</text>
							</view>
						</view>
					</view>
					<view class="spec-item">
						<text class="s-label">{{keys ? keys.key_7 : '产品规格'}}：</text>
						<view class="s-val-outer">
							<view class="s-val-marquee" :class="{'marquee-running': isTextOverflow(cdata.value_7, 12)}">
								<text class="s-val text-content-red">{{cdata.value_7}}</text>
								<text class="s-val text-content-red duplicate-text" v-if="isTextOverflow(cdata.value_7, 12)">{{cdata.value_7}}</text>
							</view>
						</view>
					</view>
					<view class="spec-item">
						<text class="s-label">{{keys ? keys.key_1 : '质量标准'}}：</text>
						<view class="s-val-outer">
							<view class="s-val-marquee">
								<text class="s-val text-content-red">{{cdata.value_1}}</text>
							</view>
						</view>
					</view>
					<view class="spec-item">
						<text class="s-label">发票标识：</text>
						<view class="s-val-outer">
							<view class="s-val-marquee">
								<text class="s-val text-content-red">{{ticket_index==0?'不含发票':(ticket_index==2?'含专用发票':'含普通发票')}}</text>
							</view>
						</view>
					</view>
					<view class="spec-item">
						<text class="s-label">商品单价：</text>
						<view class="s-val-outer">
							<view class="s-val-marquee">
								<text class="s-val text-content-red">￥{{transpoint(cprice)}}</text>
							</view>
						</view>
					</view>
				</div>
			</view>

			<!-- 2. 技术参数与交货说明 (区块清晰隔离，避免揉成一团) -->
			<view class="category-section-box blue-section-bg">
				<view class="specs-grid-box">
					<view class="spec-item">
						<text class="s-label">{{keys ? keys.key_4 : '计量单位'}}：</text>
						<view class="s-val-outer">
							<view class="s-val-marquee">
								<text class="s-val text-content-blue">{{cdata.value_4 || '米'}}</text>
							</view>
						</view>
					</view>
					<view class="spec-item">
						<text class="s-label">{{keys ? keys.key_3 : '起订数量'}}：</text>
						<view class="s-val-outer">
							<view class="s-val-marquee">
								<text class="s-val text-content-blue">{{minNums}}</text>
							</view>
						</view>
					</view>
					<view class="spec-item">
						<text class="s-label">参考重量：</text>
						<view class="s-val-outer">
							<view class="s-val-marquee" :class="{'marquee-running': isTextOverflow(cdata.weight ? cdata.weight + ' kg' : '5.27 kg', 12)}">
								<text class="s-val text-content-blue">{{cdata.weight ? cdata.weight + ' kg' : '5.27 kg'}}</text>
								<text class="s-val text-content-blue duplicate-text" v-if="isTextOverflow(cdata.weight ? cdata.weight + ' kg' : '5.27 kg', 12)">{{cdata.weight ? cdata.weight + ' kg' : '5.27 kg'}}</text>
							</view>
						</view>
					</view>
					<view class="spec-item">
						<text class="s-label">运输费用：</text>
						<view class="s-val-outer">
							<view class="s-val-marquee">
								<text class="s-val text-content-blue">{{ulevel && ulevel['trans']>0?'含运费':'不含运费'}}</text>
							</view>
						</view>
					</view>
					<view class="spec-item">
						<text class="s-label">{{keys ? keys.key_0 : '供应方式'}}：</text>
						<view class="s-val-outer">
							<view class="s-val-marquee">
								<text class="s-val text-content-blue">{{cdata.value_0 || '现货供应'}}</text>
							</view>
						</view>
					</view>
					<view class="spec-item">
					    <text class="s-label" style="display: inline-block;">{{keys ? keys.key_8 : '交货周期'}}：</text>
					    <view class="s-val-outer">
					        <view class="s-val-marquee" :class="{'marquee-running': isTextOverflow(cdata.value_8 || '24小时内发货', 10)}">
					            <text class="s-val text-content-blue">{{cdata.value_8 || '24小时内发货'}}</text>
					            <text class="s-val text-content-blue duplicate-text" v-if="isTextOverflow(cdata.value_8 || '24小时内发货', 10)">{{cdata.value_8 || '24小时内发货'}}</text>
					        </view>
					    </view>
					</view>
					<view class="spec-item-full spec-item-name-row">
						<text class="s-label">{{keys ? keys.key_2 : '执行标准'}}：</text>
						<view class="s-val-outer">
							<view class="s-val-marquee" :class="{'marquee-running': isTextOverflow(cdata.value_2, 20)}">
								<text class="s-val text-content-blue">{{ cdata.value_2 }}</text>
								<text class="s-val text-content-blue duplicate-text" v-if="isTextOverflow(cdata.value_2, 20)">{{ cdata.value_2 }}</text>
							</view>
						</view>
					</view>
				</view>
			</view>

			<!-- 单品备注静态展示与弹窗触发/修改行 -->
			<view class="spec-item-full item-remark-row" style="display: flex; align-items: center; background: #ffffff; border: 1px solid #cbd5e1; border-radius: 14rpx; padding: 6rpx 24rpx; height: 66rpx; margin-bottom: 12rpx;">
			    <text class="s-label" style="font-size: 24rpx; color: #475569; font-weight: 600; flex-shrink: 0; width: 130rpx; margin: 0;">单品备注：</text>
			    <view class="s-val-outer" style="flex: 1; min-width: 0; margin-left: 8rpx; overflow: hidden; display: flex; align-items: center; justify-content: space-between;" @click="openRemarkModal">
			        <view class="remark-static-container" style="flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
			            <text class="remark-display-text" :style="{color: item_remark ? '#d97706' : '#94a3b8'}">{{ item_remark || '分段/包装/颜色等要求' }}</text>
			        </view>
			        <view v-if="item_remark" style="margin-left: 16rpx; flex-shrink: 0;">
			            <text class="remark-edit-btn" @click.stop="openRemarkModal">修改</text>
			        </view>
			    </view>
			</view>

			<!-- 购买数量与合计金额面板 -->
			<view class="action-calc-box-compact">
				<view class="masks_panel_nums" @click.stop>
					<text class="calc-label-main">购买数量：</text>
					<div class="number-box-wrapper" @click.stop>
						<u-number-box v-model="nums" :min="1" :step="1" @change="numsChange" @blur="numsBlur"></u-number-box>
					</div>
				</view>
				
				<view class="min-nums-gray-tip" v-if="nums < minNums">
					* 提示: 低于起订量(<text class="red-num-highlight">{{minNums}}</text>), 仅支持加入报价单
				</view>
				
				<view style="display: flex; justify-content: center; align-items: center; font-size: 26rpx; background: linear-gradient(135deg, #FF9500 0%, #FF6B00 100%) !important; border: 2rpx dashed #ffd1a4; border-radius: 12rpx; padding: 14rpx 20rpx; margin: 10rpx 0;">
				    <view>
				        <text style="color: #4a3828 !important; font-weight: 500;">已选数量：</text>
				        <text style="font-size: 32rpx; font-weight: bold; color: #ffffff !important; text-shadow: 0 1rpx 2rpx rgba(0,0,0,0.15);">{{nums}}</text>
				    </view>
				    <view style="margin-left: 50rpx;">
				        <text style="color: #4a3828 !important; font-weight: 500;">合计金额：</text>
				        <text style="font-size: 32rpx; font-weight: bold; color: #ffffff !important; text-shadow: 0 1rpx 2rpx rgba(0,0,0,0.15);">¥{{transpoint(nums*cprice)}}</text>
				    </view>
				</view>
			</view>

			<!-- 弹窗底部三个操作按钮（带点击收缩动效与震动效果） -->
			<view class="masks_panel_btns">
				<button :class="{'btn-pressed-anim': activeBtn === 1}" @click="handleBtnClick(1, addReport)">加入报价单</button>
				<button :class="{'btn-pressed-anim': activeBtn === 2}" style="margin-left: 12rpx;margin-right: 12rpx;" @click="handleBtnClick(2, () => addCart(0))">加入购物车</button>
				<button :class="{'btn-pressed-anim': activeBtn === 3}" @click="handleBtnClick(3, () => addCart(1))">立即购买</button>
			</view>
		</view>

        <!-- 条款说明弹窗（已完美支持手机端手指上下顺畅惯性滑动查看，各条目之间带清晰空隙，拒绝堆挤） -->
        <view class="custom-modal-mask" v-if="showTermsModal" @touchmove.stop.prevent="preventScroll">
            <view class="custom-modal-box terms-modal-optimized">
                <view class="cm-title terms-modal-title">商品信息提示与免责说明</view>
                <!-- [已修复] 升级为原生 scroll-view 组件，完美支持 iOS / Android / 鸿蒙等各端触控上下顺畅惯性滑动，不再卡死或出现吃劲阴影 -->
                <scroll-view :scroll-y="true" class="terms-scroll-container">
                    
                    <!-- 卡片 1：采购与供货 -->
                    <view class="terms-card-item">
                        <view class="terms-card-header">
                            <text class="terms-card-dot red-dot"></text>
                            <text class="terms-card-label">采购与供货</text>
                        </view>
                        <view class="terms-card-body">
                            <view class="terms-text-row">1. 下单需满足商品最小起订量；线缆每米重量仅为理论参考数值。</view>
                            <view class="terms-text-row">2. 发货时效以页面标注时效为准。</view>
                            <view class="terms-text-row">3. 线缆计米允许±0.5%行业标准合理公差。</view>
                            <view class="terms-text-row">4. 常规现货统一品牌发货；库存不足时，可调配多品牌组合供货，产品规格、执行标准、产品质量均不降级。</view>
                            <view class="terms-text-row">5. 若产品存在原厂制造质量问题，可享受包修、包换、包退完整三包服务。</view>
                        </view>
                    </view>

                    <!-- 卡片 2：运费与签收 -->
                    <view class="terms-card-item">
                        <view class="terms-card-header">
                            <text class="terms-card-dot blue-dot"></text>
                            <text class="terms-card-label">运费与签收</text>
                        </view>
                        <view class="terms-card-body">
                            <view class="terms-text-row">1. 运费规则以页面标注为准，运费仅限国内普通区域，不含西藏、新疆、海南、内蒙古、青海、宁夏等偏远地区附加运费，偏远订单运费需另行协商。</view>
                            <view class="terms-text-row">2. 收货当场检查外包装，外包装破损可直接拒收，并同步联系物流及本店客服报备；完成签收后72小时内，可提交数量、外观异常问题并附上对应凭证，逾期未反馈视为货物验收合格。</view>
                        </view>
                    </view>

                    <!-- 卡片 3：付款要求 -->
                    <view class="terms-card-item">
                        <view class="terms-card-header">
                            <text class="terms-card-dot orange-dot"></text>
                            <text class="terms-card-label">付款要求</text>
                        </view>
                        <view class="terms-card-body">
                            <view class="terms-text-row">1. 转账付款请上传付款凭证，转账备注统一填写：电缆采购货款。</view>
                            <view class="terms-text-row">2. 企业、个人采购均不接受第三方代付；为保障资金合规、规避对账、税务及资金核查风险，付款账户需与下单主体保持一致。</view>
                            <view class="terms-text-row">3. 企业采购：下单主体、开票抬头、付款账户必须为同一企业；个人采购：仅限下单本人账户支付，平台可要求提供身份证完成主体信息核验。</view>
                            <view class="terms-text-row">4. 付款主体与下单主体不一致，平台可原路退回订单款项，由此产生手续费、时间损耗由采购方自行承担。</view>
                        </view>
                    </view>

                    <!-- 卡片 4：售后免责 -->
                    <view class="terms-card-item">
                        <view class="terms-card-header">
                            <text class="terms-card-dot purple-dot"></text>
                            <text class="terms-card-label">售后免责</text>
                        </view>
                        <view class="terms-card-body">
                            <view class="terms-text-row">1. 页面标价为实际销售价，可直接下单成交；产品各项参数仅作选型参考。</view>
                            <view class="terms-text-row">2. 电线电缆属于特殊定制货品，售出后若非产品自身制造质量问题，不予退换。</view>
                            <view class="terms-text-row">3. 选型失误、自行施工不当、人为外力损坏导致的故障，不在三包保障范围内。</view>
                            <view class="terms-text-row">4. 已排产、裁切下料的订单，不支持随意更改规格、取消订单。</view>
                        </view>
                    </view>

                </scroll-view>
                <button class="cm-btn-confirm terms-confirm-btn" @click="showTermsModal = false">知道了</button>
            </view>
        </view>

		<!-- 异税率冲突弹窗 -->
		<view class="custom-modal-mask" v-if="showConflictModal" @touchmove.stop.prevent="preventScroll">
			<view class="custom-modal-box">
				<view class="cm-icon-header">
					<div class="cm-warning-icon-wrapper">
						<div class="cm-warning-icon">!</div>
					</div>
				</view>
				<view class="cm-title">无法添加商品</view>
				<view class="cm-subtitle">税率类型校验提示</view>
				<view class="cm-content">
					<view class="cm-content-line">仅支持同税率商品，当前税率不同无法加入。</view>
					<view class="cm-content-line">如需添加，请处理报价单内已有的商品税率。</view>
				</view>
				<view class="cm-btns">
					<button class="cm-btn-cancel" @click="onConflictStay">留在此页</button>
					<button class="cm-btn-confirm" @click="onConflictGoReport">去报价单处理</button>
				</view>
			</view>
		</view>

		<!-- 单品备注独立填写/修改弹窗 -->
		<view class="custom-modal-mask" v-if="showRemarkModal" @touchmove.stop.prevent="preventScroll">
			<view class="custom-modal-box">
				<view class="cm-title" style="margin-bottom: 20rpx;">单品备注填写</view>
				<view class="cm-content" style="padding: 0;">
					<textarea v-model="tempRemark" placeholder="请输入分段、包装、颜色等特殊要求...      （限60字符内)" placeholder-style="color: #94a3b8; font-size: 26rpx;" style="width: 100%; height: 160rpx; background: #f8fafc; border: 1rpx solid #cbd5e1; border-radius: 12rpx; padding: 16rpx; box-sizing: border-box; font-size: 26rpx; text-align: left; color: #1e293b;" maxlength="60" />
				</view>
				<view class="cm-btns" style="margin-top: 20rpx;">
					<button class="cm-btn-cancel" @click="closeRemarkModal">取消</button>
					<button class="cm-btn-confirm" @click="confirmRemark">确定</button>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
                showTermsModal: false,
				isExpand: false,
				gid: '',
				act_toite: 0,
				act_index: 0,
				cat_index: null,
				groups: [],
				group_id: 0,

				item_remark: '', // 单品备注字段
				showRemarkModal: false, // 控制单品备注填写弹窗显隐
				tempRemark: '', // 弹窗中暂存的备注内容

				activeBtn: null, // 控制底部三个操作按钮的点击收缩动效状态

				backSvgIcon: 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="#f8fafc" stroke="#cbd5e1" stroke-width="3"/><polyline points="37,20 25,32 37,44" fill="none" stroke="#1e293b" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'),
				reportSvgIcon: 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="#f0fdf4" stroke="#86efac" stroke-width="3"/><path d="M40 18H24a3 3 0 0 0-3 3v22a3 3 0 0 0 3 3h16a3 3 0 0 0 3-3V21a3 3 0 0 0-3-3z" fill="#ffffff" stroke="#16a34a" stroke-width="3" stroke-linejoin="round"/><polyline points="40 18 40 26 32 26" fill="none" stroke="#16a34a" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><line x1="36" y1="33" x2="28" y2="33" stroke="#16a34a" stroke-width="3" stroke-linecap="round"/><line x1="36" y1="39" x2="28" y2="39" stroke="#16a34a" stroke-width="3" stroke-linecap="round"/></svg>'),
				cartSvgIcon: 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="#eff6ff" stroke="#93c5fd" stroke-width="3"/><circle cx="26" cy="48" r="3" fill="#2563eb"/><circle cx="44" cy="48" r="3" fill="#2563eb"/><path d="M16 18h6l4.5 20h17.5L48 26H24" fill="none" stroke="#2563eb" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'),
				phoneSvgIcon: 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="#fff1f2" stroke="#fecdd3" stroke-width="3"/><path d="M45.5 42.5v3.5a3 3 0 0 1-3.27 3 29.69 29.69 0 0 1-12.91-4.58 29.25 29.25 0 0 1-8.98-8.98 29.69 29.69 0 0 1-4.58-12.91 3 3 0 0 1 3-3.27h3.5a3 3 0 0 1 3 2.58c.23 1.62.68 3.19 1.34 4.67a3 3 0 0 1-.68 3.26l-2.15 2.15a24 24 0 0 0 9 9l2.15-2.15a3 3 0 0 1 3.26-.68c1.48.66 3.05 1.11 4.67 1.34a3 3 0 0 1 2.58 3z" fill="#e11d48"/></svg>'),

				loading: '',
				uid: '',
				ulevel: '',
				ginfo: '',
				blank: [], 
				blank_info: '',
				blank_img: 0,
				blank_img_index: 1,
				list: [],
				list_count: 0,
				keys: '',
				ticket_index: 0,
				ticket: 1,
				ticket_color: "red",
				copen: 0,
				isClosingPanel: false,
				cdata: '',
				cprice: 0,
				nums: 500,
				minNums: 500,
				clickIndex: null,

				visibleList: [],
				pageNum: 1,
				pageSize: 20,
				isSticky: false,

				cartBadgeCount: 0,
				reportBadgeCount: 0, 
				isFlying: false,
				flyType: 'cart',
				flyX: 0,
				flyY: 0,
				flyScale: 1,
				flyOpacity: 1,
				isCartBouncing: false,
				isReportBouncing: false,

				showConflictModal: false
			}
		},
		onPageScroll(e) {
			if (e.scrollTop > 220) {
				if (!this.isSticky) { this.isSticky = true; }
			} else {
				if (this.isSticky) { this.isSticky = false; }
			}
		},
		onReachBottom() {
			this.loadMoreData();
		},
		onLoad(option) {
			this.gid = option.ids
			let userInfo = uni.getStorageSync('loginTicket');
			if (userInfo == null || userInfo == "") {
				uni.showModal({
					title: '提示',
					content: '您还未登录，前往登录',
					showCancel: false,
					success: (res) => {
						if (res.confirm) {
							uni.reLaunch({ url: '/pages/login_md/login_md' })
						}
					}
				});
			} else {
				this.uid = userInfo.id
				this.cat_index = null;
				this.group_id = 0;
				this.ticket_index = 0;
				this.doIninit()
			}
			uni.$on("confirm", data => {
				this.doIninit()
			})
		},
		onShow() {
			if (this.uid) {
				this.getReportBadgeCount();
				this.getCartBadgeCount();
			}
		},
		onBackPress(options) {
			if (this.showConflictModal) {
				this.showConflictModal = false;
				return true;
			}
			if (this.showRemarkModal) {
				this.showRemarkModal = false;
				return true;
			}
			if (this.copen > 0) {
				this.closeBuyer();
				return true;
			}
			return false;
		},
		methods: {
			openRemarkModal() {
				this.tempRemark = this.item_remark;
				this.showRemarkModal = true;
			},
			closeRemarkModal() {
				this.showRemarkModal = false;
				this.tempRemark = '';
			},
			confirmRemark() {
				this.item_remark = this.tempRemark;
				this.closeRemarkModal();
			},
			isTextOverflow(text, threshold) {
				if (!text) return false;
				let str = String(text);
				return str.length > (threshold || 12);
			},
			getActiveStandardName() {
				let that = this;
				if (that.blank && that.blank.length > 0) {
					let currentStandard = that.blank.find(b => b.cat_index == that.cat_index);
					if (currentStandard && currentStandard.catname) {
						return currentStandard.catname;
					}
				}
				if (that.blank_info) {
					if (that.blank_info.standard_name) return that.blank_info.standard_name;
					if (that.blank_info.name) return that.blank_info.name;
				}
				return 'GB/T12706.1-2020 GB/T19666-2018';
			},
			getReportBadgeCount() {
				let that = this;
				var params = { uid: that.uid }; 
				that.$api.ReportNewList(params).then(ret => {
					if (!ret) { return; }
					let rawData = (ret.data !== undefined) ? ret.data : ret;
					if (Array.isArray(rawData)) {
						that.reportBadgeCount = rawData.length;
					} else if (rawData && Array.isArray(rawData.list)) {
						that.reportBadgeCount = rawData.list.length;
					} else if (rawData && typeof rawData.total !== 'undefined') {
						that.reportBadgeCount = Number(rawData.total) || 0;
					}
				}).catch(err => { console.log(err); });
			},
			getCartBadgeCount() {
				let that = this;
				var params = { uid: that.uid }; 
				that.$api.Carts(params).then(ret => {
					if (!ret) { return; }
					let rawData = (ret.data !== undefined) ? ret.data : ret;
					if (Array.isArray(rawData)) {
						that.cartBadgeCount = rawData.length;
					} else if (rawData && Array.isArray(rawData.list)) {
						that.cartBadgeCount = rawData.list.length;
					} else if (rawData && typeof rawData.total !== 'undefined') {
						that.cartBadgeCount = Number(rawData.total) || 0;
					}
				}).catch(err => { console.log(err); });
			},
			getPriceColorClass() {
				if (this.ticket_index === 1) return 'price-purple';
				if (this.ticket_index === 2) return 'price-blue';
				return 'price-red';
			},
			loadMoreData() {
				const nextData = this.list.slice(this.pageSize * (this.pageNum - 1), this.pageSize * this.pageNum);
				if (nextData.length > 0) {
					this.visibleList = this.visibleList.concat(nextData);
					this.pageNum++;
				}
			},
			setNodes(nodes) {
				var reg = /<img/gi
				if (!nodes) { return '' }
				return nodes.replace(reg, '<img style="width:100%!important;height:auto!important"')
			},
			callnumber() {
				if (typeof plus !== 'undefined') {
					plus.runtime.openURL('tel:' + (this.ulevel ? this.ulevel.tel : ''));
				} else {
					uni.showToast({ title: '仅支持 App 拨打电话', icon: 'none' });
				}
			},
			blankChange(item) {
				let that = this;
				if (that.cat_index == item.cat_index) return;
				uni.vibrateShort();
				that.cat_index = item.cat_index;
				that.doIninit();
			},
			groupChange(g) {
				let that = this;
				if (that.group_id == g.id) return;
				uni.vibrateShort();
				that.group_id = g.id;
				that.cat_index = null;
				that.doIninit();
			},
			goCart() {
				uni.navigateTo({ url: '/pages/cart/cart?pushType=1' })
			},
			goReport() {
				uni.navigateTo({ url: '/pages/report/repinfos' })
			},
			// 底部三个按钮点击事件包装函数：加入震动反馈与缩放释放动画
			handleBtnClick(index, callback) {
				let that = this;
				uni.vibrateShort({
					type: 'medium',
					success: function () {},
					fail: function () {
						uni.vibrateShort();
					}
				});
				that.activeBtn = index;
				setTimeout(() => {
					that.activeBtn = null;
				}, 180);
				if (callback) {
					callback();
				}
			},
			async addReport() {
				let that = this;
				let currentNums = parseInt(that.nums);
				if (isNaN(currentNums) || currentNums <= 0) {
					uni.showToast({ title: '请输入有效的商品数量', icon: 'none', duration: 2000 });
					return;
				}
				
				var params = {
					uid: that.uid, 
					types: 0, 
					cont_id: that.gid, 
					logs_id: that.cdata.id,
					nums: currentNums, 
					ticket: that.ticket_index, 
					ticket_fee: that.ticket, 
					status: 1,
					cat_index: that.cat_index,
					standard_name: that.getActiveStandardName(),
					item_remark: that.item_remark
				};

				let handleRealSuccess = () => {
					that.smoothClosePanelWithAction(() => {
						that.startPreciseJumpFlyAnimation('report', () => {
							that.getReportBadgeCount();
							that.isReportBouncing = true;
							setTimeout(() => { that.isReportBouncing = false; }, 600);
							uni.showToast({ title: '已成功加入报价单', icon: 'none', duration: 2000 });
						});
					});
				};

				let handleRealError = () => {
					that.showConflictModal = true;
				};

				try {
					let ret = null;
					if (typeof that.$api.Newcartadd === 'function') {
						ret = await that.$api.Newcartadd(params);
					} else {
						throw new Error('API_NOT_EXISTS');
					}

					let isSuccess = false;
					let serverMsg = '';
					let failCode = false;
					if (ret) {
						let code = ret.code !== undefined ? ret.code : (ret.status !== undefined ? ret.status : ret.errno);
						serverMsg = ret.msg || ret.message || ret.err_msg || '';
						
						if (code !== 200 && code !== 1 && code !== '200' && code !== '1' && code !== 0 && code !== '0') {
							failCode = true;
						}
						
						if (!failCode) {
							if (!serverMsg || serverMsg === '成功' || serverMsg === 'success' || serverMsg.indexOf('成功') !== -1) {
								isSuccess = true;
							}
						}
					}

					if (failCode || (serverMsg && (serverMsg.indexOf('税率') !== -1 || serverMsg.indexOf('不一致') !== -1 || serverMsg.indexOf('冲突') !== -1 || serverMsg.indexOf('失败') !== -1))) {
						isSuccess = false;
					}

					if (isSuccess) {
						handleRealSuccess();
					} else {
						if (serverMsg && serverMsg.indexOf('税率') === -1 && serverMsg.indexOf('不一致') === -1 && serverMsg.indexOf('冲突') === -1) {
							uni.showToast({ title: serverMsg, icon: 'none', duration: 2000 });
						}
						handleRealError();
					}
				} catch (err) {
					try {
						if (typeof that.$api.cartadd === 'function') {
							let ret2 = await that.$api.cartadd(Object.assign({}, params, { buyer: 0 }));
							let isSuccess2 = false;
							let failCode2 = false;
							if (ret2) {
								let code2 = ret2.code !== undefined ? ret2.code : (ret2.status !== undefined ? ret2.status : ret2.errno);
								let serverMsg2 = ret2.msg || ret2.message || ret2.err_msg || '';
								
								if (code2 !== 200 && code2 !== 1 && code2 !== '200' && code2 !== '1' && code2 !== '0' && code2 !== 0) {
									failCode2 = true;
								}
								
								if (!failCode2) {
									if (!serverMsg2 || serverMsg2 === '成功' || serverMsg2 === 'success') {
										isSuccess2 = true;
									}
								}
								if (failCode2 || (serverMsg2 && (serverMsg2.indexOf('税率') !== -1 || serverMsg2.indexOf('不一致') !== -1 || serverMsg2.indexOf('冲突') !== -1 || serverMsg2.indexOf('失败') !== -1))) {
									isSuccess2 = false;
									if (serverMsg2 && serverMsg2.indexOf('税率') === -1 && serverMsg2.indexOf('不一致') === -1 && serverMsg2.indexOf('冲突') === -1) {
										uni.showToast({ title: serverMsg2, icon: 'none', duration: 2000 });
									}
								}
							}
							if (isSuccess2) {
								handleRealSuccess();
								return;
							}
							handleRealError();
							return;
						}
						handleRealError();
					} catch (err2) {
						handleRealError();
					}
				}
			},
			onConflictStay() {
				this.showConflictModal = false;
				this.smoothClosePanelWithAction(null);
			},
			onConflictGoReport() {
				this.showConflictModal = false;
				this.smoothContextAction(() => {
					uni.navigateTo({ url: '/pages/report/repinfos' });
				});
			},
			backNav() {
				if (this.showConflictModal) {
					this.showConflictModal = false;
				} else if (this.showRemarkModal) {
					this.showRemarkModal = false;
				} else if (this.copen > 0) {
					this.closeBuyer();
				} else {
					uni.navigateBack();
				}
			},
			addCart(type) { this.addCartOP(type); },
			async addCartOP(type) {
				let that = this;
				let currentNums = parseInt(that.nums);
				if (isNaN(currentNums) || currentNums < that.minNums) {
					uni.showToast({
						title: `该商品起订量为 ${that.minNums} 米，无法直接加购或购买`,
						icon: 'none',
						duration: 2500
					});
					return;
				}

				var params = {
					uid: that.uid, 
					buyer: type, 
					types: 0, 
					cont_id: that.gid, 
					logs_id: that.cdata.id,
					nums: currentNums, 
					ticket: that.ticket_index, 
					ticket_fee: that.ticket, 
					status: 1,
					cat_index: that.cat_index,
					standard_name: that.getActiveStandardName(),
					item_remark: that.item_remark
				};

				try {
					let ret = await that.$api.cartadd(params);
					let isSuccess = false;
					if (ret) {
						let code = ret.code !== undefined ? ret.code : (ret.status !== undefined ? ret.status : ret.errno);
						if (code === 200 || code === 1 || code === '200' || code === '1' || code === 0 || code === '0') {
							isSuccess = true;
						}
					}
					
					if (!isSuccess && ret && (ret.msg || ret.message)) {
						uni.showToast({ title: ret.msg || ret.message, icon: 'none', duration: 2500 });
						return; 
					}

					that.smoothClosePanelWithAction(() => {
						if (type > 0) {
							uni.navigateTo({ url: '/pages/cart/confirm' })
							return;
						}
						that.startPreciseJumpFlyAnimation('cart', () => {
							that.getCartBadgeCount();
							that.isCartBouncing = true;
							setTimeout(() => { that.isCartBouncing = false; }, 600);

							uni.showToast({ title: '已成功加购，请到购物车查看并结算', icon: 'none', duration: 2200 });
						});
					});
				} catch (err) {
					uni.showToast({ title: '加入购物车失败', icon: 'none' });
				}
			},
			startPreciseJumpFlyAnimation(type, callback) {
				let that = this;
				that.flyType = type;
				
				let targetSelector = (type === 'report') ? '#report-target-icon' : '#cart-target-icon';
				
				let query = uni.createSelectorQuery().in(this);
				query.select(targetSelector).boundingClientRect(rect => {
					uni.getSystemInfo({
						success: function(res) {
							let startX = res.windowWidth / 2 - 20;
							let startY = res.windowHeight - 340; 
							
							let targetX = rect ? (rect.left + rect.width / 2 - 20) : ((type === 'report') ? (res.windowWidth - 116) : (res.windowWidth - 60));
							let targetY = rect ? (rect.top + rect.height / 2 - 20) : 36;
							
							that.flyX = startX;
							that.flyY = startY;
							that.flyScale = 1.8; 
							that.flyOpacity = 0.1;
							that.isFlying = true;
							
							let duration = 1100; 
							let startTime = Date.now();
							
							let safeAnimFrame = (typeof window !== 'undefined' && window.requestAnimationFrame) 
								? window.requestAnimationFrame 
								: (cb => setTimeout(cb, 16));
							
							function frame() {
								let elapsed = Date.now() - startTime;
								let progress = elapsed / duration;
								if (progress > 1) progress = 1;
								
								let easeProgress = 1 - Math.pow(1 - progress, 3);
								let parabolaHeight = -360 * Math.sin(progress * Math.PI); 
								
								that.flyX = startX + (targetX - startX) * easeProgress;
								that.flyY = startY + (targetY - startY) * easeProgress + parabolaHeight;
								
								if (progress < 0.15) {
									that.flyOpacity = (progress / 0.15) * 0.95;
								} else if (progress > 0.85) {
									that.flyOpacity = 1.0 - (progress - 0.85) / 0.15 * 0.4;
								} else {
									that.flyOpacity = 1.0;
								}
								
								that.flyScale = 1.8 - 1.68 * easeProgress;
								
								if (progress < 1) {
									safeAnimFrame(frame);
								} else {
									that.isFlying = false;
									if (callback) callback();
								}
							}
							safeAnimFrame(frame);
						}
					});
				}).exec();
			},
			smoothClosePanelWithAction(actionCallback) {
				let that = this;
				if (that.isClosingPanel) return;
				that.isClosingPanel = true;
				setTimeout(() => {
					that.cdata = [];
					that.nums = that.minNums;
					that.item_remark = '';
					that.copen = 0;
					that.isClosingPanel = false;
					if (actionCallback) actionCallback();
				}, 220);
			},
			smoothContextAction(actionCallback) {
				let that = this;
				if (that.isClosingPanel) return;
				that.isClosingPanel = true;
				setTimeout(() => {
					that.cdata = [];
					that.nums = that.minNums;
					that.item_remark = '';
					that.copen = 0;
					that.isClosingPanel = false;
					if (actionCallback) actionCallback();
				}, 220);
			},
			closeBuyer() {
				let that = this;
				if (that.copen === 0 || that.isClosingPanel) return;
				that.smoothClosePanelWithAction(null);
			},
			preventScroll(event) {},
			numsChange(val) {
				let that = this;
				let v = parseInt(val);
				if (!isNaN(v) && v > 0) {
					that.nums = v;
				}
			},
			numsBlur(val) {
				let that = this;
				let v = parseInt(val);
				if (!isNaN(v) && v > 0) {
					that.nums = v;
				}
			},
			openBuyer(data, index) {
				let that = this;
				uni.hideToast(); 
				
				// 【修改点】：将原先过长的 vibrateLong 调整为适中的中等震动值 (type: medium)
				uni.vibrateShort({
					type: 'medium',
					success: function () {},
					fail: function () {
						uni.vibrateShort();
					}
				});

				that.clickIndex = index;
				that.cdata = data;
				that.cprice = that.transpoint(data.market * that.ticket * (that.ulevel ? that.ulevel.up : 1));
				
				// 起订数量来自"商品设置"的 key_3/value_3（比如 782/阻燃C级 存的是 起订数量/500），
				// 之前读的 blank_info.min_nums / data.min_nums 这些字段库里根本不存在，一直在吃兜底值 500
				let fetchedMin = data.value_3 ? Number(data.value_3) : 500;
				that.minNums = !isNaN(fetchedMin) && fetchedMin > 0 ? fetchedMin : 500;
				
				that.nums = that.minNums;
				that.item_remark = '';
				that.copen = 1;
			},
			texChange(type) {
				let that = this;
				uni.vibrateShort(); 
				that.ticket_index = type;
				if (type == 0) { that.ticket = 1; that.ticket_color = "red"; }
				if (type == 1) { that.ticket = 1 + (that.blank_info ? that.blank_info.ticket_nor : 0) / 100; that.ticket_color = "purple"; }
				if (type == 2) { that.ticket = 1 + (that.blank_info ? that.blank_info.ticket_person : 0) / 100; that.ticket_color = "blue"; }
				if (that.copen > 0 && that.cdata) {
					that.cprice = that.transpoint(that.cdata.market * that.ticket * (that.ulevel ? that.ulevel.up : 1));
				}
				this.$forceUpdate()
			},
			changePage(id) { this.act_index = id; },
			transpoint(value) { return parseFloat(value || 0).toFixed(2); },
			async doIninit() {
				let that = this;
				var params = {
					uid: that.uid,
					gid: that.gid,
					group_id: that.group_id,
					cat_index: that.cat_index,
					_t: Date.now()
				};
				try {
					let ret = await that.$api.glist(params);
					if (!ret || !ret.data) return;
					that.ginfo = ret.data.info;
					that.ulevel = ret.data.ulevel;
					that.groups = ret.data.groups || [];
					that.group_id = ret.data.group_id;
					that.cat_index = ret.data.cat_index;
					that.blank = ret.data.blank;
					that.blank_info = ret.data.blank_info;

					if (that.blank_info && that.blank_info.source_url != null) { that.blank_img = that.blank_info.source_url.length; }
					that.list = ret.data.list || [];
					that.list_count = that.list.length;
					that.keys = ret.data.keys;
					this.pageNum = 1; this.pageSize = 15; this.visibleList = [];
					this.loadMoreData();
					
					that.getReportBadgeCount();
					that.getCartBadgeCount();
				} catch (err) {
					console.log(err);
				}
			}
		}
	}
</script>

<style scoped lang="scss">
    /* 专门控制商品名称内容的颜色和粗细 */
    .product-name-custom {
        color: #5D3A9B !important;
        font-weight: 600 !important;
    }
	.duplicate-text {
	    margin-left: 40rpx !important;
	}
	.icon-help {
        display: inline-block;
        width: 36rpx;
        height: 36rpx;
        line-height: 36rpx;
        text-align: center;
        background: #007aff;
        color: #fff;
        border-radius: 50%;
        font-size: 24rpx;
        margin-left: 10rpx;
        font-weight: normal;
    }
	page {
		margin: 0; padding: 0; width: 100%; background-color: #f7f7f7; box-sizing: border-box; overflow-x: hidden;
	}
	.page {
		margin: 0; padding: 0; width: 100%; background-color: #f7f7f7; min-height: 100vh; box-sizing: border-box; padding-top: var(--status-bar-height); overflow-x: hidden;
	}
	
	.classic-fly-streak {
		position: fixed; top: 0; left: 0; width: 40rpx; height: 40rpx; z-index: 10002; pointer-events: none; will-change: transform, opacity;
		display: flex; align-items: center; justify-content: center;
	}
	.streak-core-dot {
		width: 24rpx; height: 24rpx; border-radius: 50%; position: relative; z-index: 2;
		box-shadow: 0 0 22rpx rgba(255, 255, 255, 0.95);
	}
	.streak-tail-trail {
		position: absolute; width: 72rpx; height: 22rpx; border-radius: 20rpx; right: 4rpx; top: 9rpx; filter: blur(5px); z-index: 1; transform-origin: right center; transform: rotate(-25deg);
	}
	
	.streak-red {
		.streak-core-dot { background: linear-gradient(135deg, #fff 0%, #ff003b 100%); border: 2rpx solid #ffffff; }
		.streak-tail-trail { background: linear-gradient(90deg, rgba(255,0,59,0.95) 0%, rgba(255,150,170,0) 100%); }
	}
	.streak-green {
		.streak-core-dot { background: linear-gradient(135deg, #fff 0%, #059669 100%); border: 2rpx solid #ffffff; }
		.streak-tail-trail { background: linear-gradient(90deg, rgba(5,150,105,0.95) 0%, rgba(150,230,190,0) 100%); }
	}

	.cart-bounce-anim { animation: iconBounce 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) both; }
	.report-bounce-anim { animation: iconBounce 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) both; }
	@keyframes iconBounce {
		0% { transform: scale(1); }
		30% { transform: scale(1.5) rotate(-8deg); }
		60% { transform: scale(0.85) rotate(6deg); }
		80% { transform: scale(1.22) rotate(-3deg); }
		100% { transform: scale(1) rotate(0); }
	}
	.cart-item-box, .report-item-box { position: relative; }
	.cart-badge-count {
		position: absolute; top: -8rpx; right: -14rpx; color: #ffffff; font-size: 20rpx; font-weight: 700; height: 32rpx; min-width: 32rpx; padding: 0 6rpx; border-radius: 16rpx; display: flex; align-items: center; justify-content: center; box-sizing: border-box; border: 2rpx solid #f1f3f5; background-color: #ff003b; box-shadow: 0 2rpx 6rpx rgba(255, 0, 59, 0.3); animation: badgeBounce 0.35s ease-in-out;
	}
	@keyframes badgeBounce {
		0% { transform: scale(0.5); }
		50% { transform: scale(1.3); }
		100% { transform: scale(1); }
	}
	.fixed-nav { position: fixed; top: var(--status-bar-height); left: 0; right: 0; width: 100% !important; z-index: 100; }
	.pageTab { width: 100% !important; height: 88rpx; background: #f1f3f5; border-bottom: 1rpx solid #e2e8f0; display: flex; align-items: center; justify-content: space-between; padding: 0 32rpx; box-sizing: border-box; }
	
	.pageTab.nav-shadow-active {
		box-shadow: 0 12rpx 20rpx rgba(0, 0, 0, 0.12) !important;
		border-bottom: 2rpx solid #cbd5e1 !important;
	}

	.detail-content-box {
		width: 100%;
		transition: transform 0.2s ease;
	}
	.detail-content-box.detail-content-pulled {
		margin-top: -308rpx !important;
		padding-top: 0 !important;
	}
	.iosTba { width: 100%; position: relative; z-index: 99; }
	.iosTba.fixed-header { position: fixed; top: calc(var(--status-bar-height) + 88rpx); left: 0; right: 0; width: 100%; z-index: 99; box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.06); }
	
	/* 修复：弹窗顶部悬浮选中容器，将其整体往上提了一格，高度和锁定区更加紧凑精美 */
	.popup-top-sticky-container {
		position: fixed;
		top: calc(var(--status-bar-height) + 40rpx);
		left: 0;
		right: 0;
		width: 100%;
		z-index: 9998; 
		box-shadow: 0 6rpx 16rpx rgba(0, 0, 0, 0.15);
	}

	.table-placeholder { height: 88rpx; width: 100%; }
	.banner { position: relative; min-height: 300rpx; background: #cfcfcf; }
	.nav-item-box { display: flex; align-items: center; justify-content: center; cursor: pointer; transition: transform 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
	.nav-item-box:active { transform: scale(0.92); }
	.nav-right-group { display: flex; align-items: center; gap: 24rpx; padding-right: 4rpx; }
	.cart-item-box { margin-right: 4rpx; }
	.report-item-box { margin-right: 4rpx; }
	.nav-center { display: flex; align-items: center; justify-content: center; gap: 50rpx; }
	.nav-center p { color: #475569; font-size: 30rpx; font-weight: 500; transition: all 0.3s; margin: 0; position: relative; }
	.nav-center .active { color: #ff2d55 !important; font-weight: bold; }
	.nav-center .active::after { content: ''; position: absolute; bottom: -12rpx; left: 50%; transform: translateX(-50%); width: 36rpx; height: 6rpx; background-color: #ff2d55; border-radius: 3rpx; }
	.nav-icon-original { width: 48rpx; height: 48rpx; display: block; }

	.svg-icon-wrapper {
		width: 52rpx !important;
		height: 52rpx !important;
		display: flex !important;
		align-items: center !important;
		justify-content: center !important;
		background-color: transparent !important; 
		border: none !important;
		overflow: visible !important;
		flex-shrink: 0;
	}
	.svg-icon-wrapper image {
		width: 48rpx !important;
		height: 48rpx !important;
		display: block !important;
		filter: drop-shadow(0 2rpx 4rpx rgba(0,0,0,0.08));
	}

	.ticket_color { background: #ffebee !important; }
	.price-red { color: #ff003b !important; font-weight: 700; font-size: 24rpx; }  
	.price-blue { color: #0038a8 !important; font-weight: 700; font-size: 24rpx; }  
	.price-purple { color: #6b21a8 !important; font-weight: 700; font-size: 24rpx; } 
	
	/* 修复：弹窗选中项底层白色框，常规字普通排版 */
	.popup-row-bright {
		background: #ffffff !important; border-bottom: 2rpx solid #cbd5e1 !important; box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);
		.col-item { color: #1e293b !important; font-weight: 500 !important; font-size: 24rpx; }
	}
	.popup-price-text { font-weight: 700 !important; font-size: 24rpx !important; }
	.banner image { width: 100%; vertical-align: middle; }
	
	.lists { 
		display: flex; 
		width: 100%; 
		background: #ffffff; 
		border-bottom: 1rpx solid #94a3b8; 
		box-sizing: border-box; 
		transition: background-color 0.25s ease, transform 0.15s ease;
	}
	.lists:nth-child(even) {
		background-color: #fbfbfc;
	}
	
	/* 列表点击缩放动效优化，肉眼直观可见 */
	.click-scale-effect:active {
		transform: scale(0.985);
		background-color: #f1f5f9 !important;
	}
	
	.lists.bg { background: #eef2f7; border-bottom: 1rpx solid #94a3b8; }
	
	/* 修复：弹窗顶部标题栏（灰色的标题框），独立状态不干扰正常页 */
	.lists.bg.table-header-selected-black {
		background: #64748b !important;
		border-bottom: 1rpx solid #475569 !important;
		.col-item {
			color: #ffffff !important;
			background-color: transparent !important;
			font-weight: normal !important;
		}
	}

	.table-header-floating { box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.06); position: relative; z-index: 10; }
	
	.adaptive-grid-row {
		display: grid !important;
		grid-template-columns: minmax(70px, 18%) minmax(110px, 34%) minmax(110px, 33%) minmax(65px, 15%) !important;
		width: 100% !important;
		box-sizing: border-box !important;
	}

	.lists.bg .col-item { 
		color: #1E293B !important; 
		background-color: #E2E8F0 !important;
		font-size: 26rpx; 
		font-weight: 700; 
		justify-content: center !important; 
		text-align: center !important; 
		padding-left: 0 !important; 
		border-right: 1rpx solid #94a3b8 !important;
	}
	
	.col-item { 
		border-right: 1rpx solid #94a3b8; 
		font-size: 24rpx; 
		color: #0f172a; 
		font-weight: 600; 
		min-height: 88rpx; 
		display: flex; 
		align-items: center; 
		justify-content: flex-start !important; 
		text-align: left !important; 
		padding-left: 12rpx; 
		padding-right: 12rpx;
		box-sizing: border-box; 
	}
	
	.modal-cell-text {
		white-space: normal !important;
		word-break: break-all !important;
		overflow: visible !important;
		text-overflow: clip !important;
		line-height: 1.4;
	}
	
	.list-bottom-tip {
		width: 100%; padding: 24rpx 32rpx; text-align: center; box-sizing: border-box; display: flex; flex-direction: column; gap: 6rpx;
		.tip-line-primary { font-size: 23rpx; color: #64748b; font-weight: 600; line-height: 1.4; word-break: break-all; }
		.tip-line-secondary { font-size: 22rpx; color: #94a3b8; line-height: 1.4; word-break: break-all; }
	}

	.masks { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.75); z-index: 9997; transition: opacity 0.22s ease; }
	
	/* 底部弹窗面板高度适当缩减、配色升级优化 */
	.masks_panel { 
		position: fixed; bottom: 0; left: 0 !important; right: 0 !important; width: 100% !important; max-width: 100% !important;
		background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%); 
		border-top-left-radius: 32rpx; border-top-right-radius: 32rpx; 
		border-bottom-left-radius: 0rpx; border-bottom-right-radius: 0rpx; 
		padding: 16rpx 20rpx 36rpx 20rpx; box-sizing: border-box; z-index: 9999; 
		max-height: 80vh; overflow-y: auto; 
		box-shadow: 0 -16rpx 40rpx rgba(15, 23, 42, 0.16);
		border-top: 2rpx solid rgba(255, 255, 255, 0.9);
		animation: panelSlideUp 0.3s cubic-bezier(0, 0, 0.2, 1) forwards;
	}
	@keyframes panelSlideUp {
		from { transform: translateY(100%); opacity: 0; }
		to { transform: translateY(0); opacity: 1; }
	}
	.panel-slide-down {
		animation: panelSlideDown 0.25s cubic-bezier(0.4, 0, 1, 1) forwards !important;
	}
	@keyframes panelSlideDown {
		from { transform: translateY(0); opacity: 1; }
		to { transform: translateY(100%); opacity: 0; }
	}
	
	.masks_panel_close {
		position: absolute; right: 28rpx; top: 18rpx; width: 44rpx; height: 44rpx; z-index: 10; cursor: pointer; 
		display: flex; align-items: center; justify-content: center; background-color: #f1f5f9; border-radius: 50%;
		transition: background-color 0.2s;
		&:active { background-color: #e2e8f0; }
		.close-icon-white { color: #64748b; font-size: 32rpx; font-weight: bold; line-height: 1; margin-top: -2rpx; }
	}
	.panel-header-box { text-align: center; margin-bottom: 12rpx; padding-right: 48rpx; padding-left: 48rpx; }
	.panel-title { font-size: 32rpx; font-weight: 700; color: #0f172a; letter-spacing: 0.5rpx; display: flex; align-items: center; justify-content: center;}
	
	/* 优化区块卡片排版：增强视觉间隔感，告别揉成一团 */
	.category-section-box {
		border-radius: 12rpx; padding: 12rpx 14rpx 8rpx 14rpx; margin-bottom: 10rpx; border: 2rpx solid; box-sizing: border-box;
		box-shadow: 0 3rpx 10rpx rgba(0,0,0,0.03);
		width: 100%;
	}
	.red-section-bg { 
	    background-color: #fcfbfa; 
	    border-color: #d4b16c;     
	}
	.blue-section-bg { 
	    background-color: #f4f8fe; 
	    border-color: #cbd5e1;     
	}
	.specs-grid-box { 
		display: grid; 
		grid-template-columns: repeat(2, 1fr); 
		gap: 8rpx; 
		margin-bottom: 4rpx; 
		width: 100%;
		box-sizing: border-box;
	}
	
	.spec-item {
		background: #ffffff; 
		border: 1rpx solid rgba(0,0,0,0.04); 
		border-radius: 8rpx; 
		padding: 8rpx 12rpx; 
		display: flex; 
		align-items: center; 
		justify-content: flex-start; 
		box-sizing: border-box; 
		width: 100%;
		overflow: hidden;
		.s-label { 
			font-size: 24rpx; 
			color: #475569; 
			font-weight: 600; 
			flex-shrink: 0; 
			width: 130rpx; 
		}
	}
	
	.spec-item-full {
		background: #ffffff; 
		border: 1rpx solid rgba(0,0,0,0.04); 
		border-radius: 8rpx; 
		padding: 8rpx 12rpx; 
		display: flex; 
		align-items: center; 
		justify-content: flex-start; 
		box-sizing: border-box;
		width: 100%;
		overflow: hidden;
		grid-column: span 2;
		.s-label { 
			font-size: 24rpx; 
			color: #475569; 
			font-weight: 600; 
			flex-shrink: 0; 
			width: 130rpx; 
		}
	}
	
	.spec-item-name-row {
		grid-column: span 2;
	}
	
	.s-val-outer {
		flex: 1;
		min-width: 0;
		margin-left: 8rpx;
		overflow: hidden;
		white-space: nowrap;
		box-sizing: border-box;
		display: flex;
		align-items: center;
	}

	.s-val-marquee {
		display: inline-flex;
		align-items: center;
		white-space: nowrap;
	}

	.marquee-running {
		animation: slowMarquee 50s linear infinite;
	}

	@keyframes slowMarquee {
		0% { transform: translateX(0); }
		100% { transform: translateX(-50%); }
	}

	.s-val { 
		font-size: 24rpx; 
		font-weight: 500; 
		white-space: nowrap; 
		flex-shrink: 0;
	}

	.duplicate-text {
		margin-left: 60rpx;
	}

	.text-content-red { color: #ff003b !important; font-weight: 600 !important; }
	.text-content-blue { color: #0038a8 !important; font-weight: 600 !important; }
	
	.action-calc-box-compact { 
		background: #ffffff; border-radius: 12rpx; padding: 4rpx 16rpx; margin-bottom: 12rpx; 
		border: 1rpx solid #e2e8f0; box-sizing: border-box; box-shadow: 0 2rpx 6rpx rgba(0,0,0,0.02); 
	}
	
	.masks_panel_nums {
	    display: flex; 
	    justify-content: space-between; 
	    align-items: center; 
	    padding: 2rpx 80rpx; 
	    font-weight: 600; 
	    border-top: none !important;
	}
	
	.min-nums-gray-tip {
		font-size: 22rpx; color: #f59e0b; margin-top: 2rpx; margin-bottom: 6rpx; font-weight: 500; line-height: 1.3; text-align: center; background-color: #fffbeb; padding: 3rpx 8rpx; border-radius: 6rpx;
		.red-num-highlight { color: #ff003b; font-weight: 700; }
	}
	.masks_panel_btns {
		display: flex; justify-content: space-between; gap: 12rpx;
		button {
			flex: 1; font-size: 27rpx; height: 76rpx; line-height: 76rpx; border-radius: 12rpx; border: none; color: #fff; font-weight: 600;
			box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.1);
			transition: transform 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275);
			&:active { transform: scale(0.97); }
			&:nth-child(1) { background: linear-gradient(135deg, #059669 0%, #047857 100%); }
			&:nth-child(2) { background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); }
			&:nth-child(3) { background: linear-gradient(135deg, #ff003b 0%, #e11d48 100%); }
		}
	} 

	/* 底部三个按钮点击时的收缩动画类 */
	.btn-pressed-anim {
		transform: scale(0.91) !important;
		transition: transform 0.1s ease !important;
	}

	.custom-modal-mask {
		position: fixed; top: 0; left: 0; right: 0; bottom: 0;
		background: rgba(15, 23, 42, 0.65);
		z-index: 10000;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 30rpx;
		backdrop-filter: blur(6px);
		animation: fadeInModal 0.25s cubic-bezier(0.16, 1, 0.3, 1);
	}
	@keyframes fadeInModal {
		from { opacity: 0; transform: scale(0.92) translateY(10rpx); }
		to { opacity: 1; transform: scale(1) translateY(0); }
	}
	.custom-modal-box {
		width: 100%;
		max-width: 620rpx;
		background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
		border-radius: 36rpx;
		padding: 48rpx 36rpx 40rpx 36rpx;
		box-shadow: 0 24rpx 60rpx rgba(15, 23, 42, 0.3);
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
	}
    .cm-content {
		width: 100%;
		font-size: 26rpx;
		color: #475569;
		line-height: 1.65;
		margin-bottom: 36rpx;
	}
	.cm-btns {
		display: flex;
		width: 100%;
		gap: 20rpx;
		button {
			flex: 1;
			height: 84rpx;
			line-height: 84rpx;
			font-size: 27rpx;
			font-weight: 600;
			border-radius: 18rpx;
			border: none;
		}
	}
	.cm-btn-cancel {
		background: #f1f5f9 !important;
		color: #475569 !important;
		border: 1rpx solid #cbd5e1 !important;
	}
	.cm-btn-confirm {
		background: linear-gradient(135deg, #059669 0%, #047857 100%) !important;
		color: #ffffff !important;
	}

	/* 优化后的条款说明弹窗专用样式（现代化卡片分组排版，解决行与行堆挤和触控滑动问题） */
	.terms-modal-optimized {
		max-width: 670rpx !important;
		padding: 40rpx 28rpx 32rpx 28rpx !important;
		align-items: stretch !important;
	}
	.terms-modal-title {
		margin-bottom: 24rpx;
		font-size: 32rpx;
		font-weight: 700;
		color: #0f172a;
		text-align: center;
	}
	.terms-scroll-container {
		max-height: 60vh;
		overflow-y: scroll; /* 确保使用垂直滚动 */
		text-align: left;
		padding-right: 4rpx;
		margin-bottom: 24rpx;
		-webkit-overflow-scrolling: touch; /* 修复移动端原生流畅滑动 */
		&::-webkit-scrollbar {
			display: none;
			width: 0;
			height: 0;
		}
	}
	.terms-card-item {
		background: #f8fafc;
		border: 1rpx solid #e2e8f0;
		border-radius: 16rpx;
		padding: 16rpx 20rpx;
		margin-bottom: 16rpx;
		box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.02);
	}
	.terms-card-header {
		display: flex;
		align-items: center;
		margin-bottom: 10rpx;
		border-bottom: 1rpx dashed #cbd5e1;
		padding-bottom: 8rpx;
	}
	.terms-card-dot {
		width: 12rpx;
		height: 12rpx;
		border-radius: 50%;
		margin-right: 12rpx;
		flex-shrink: 0;
	}
	.red-dot { background-color: #ef4444; }
	.blue-dot { background-color: #3b82f6; }
	.orange-dot { background-color: #f59e0b; }
	.purple-dot { background-color: #8b5cf6; }

	.terms-card-label {
		font-size: 27rpx;
		font-weight: 700;
		color: #1e293b;
	}
	.terms-card-body {
		display: flex;
		flex-direction: column;
		gap: 6rpx;
	}
	.terms-text-row {
		font-size: 24rpx;
		color: #475569;
		line-height: 1.55;
		word-break: break-all;
		margin-bottom: 10rpx; 
	}
	.terms-text-row:last-child {
		margin-bottom: 0;
	}
	.terms-confirm-btn {
		width: 100% !important;
		height: 80rpx !important;
		line-height: 80rpx !important;
		border-radius: 16rpx !important;
		font-size: 28rpx !important;
		font-weight: 600 !important;
	}

	/* 底部主栏目及卡片隔层悬浮特效优化 */
	.footer {
	    width: 100% !important;
	    background: linear-gradient(180deg, #FFFFFF 0%, #F4F6F9 100%) !important; 
	    box-shadow: 0 -8px 24px rgba(0, 0, 0, 0.15) !important;
	    border-top: 2px solid #CBD5E1 !important; 
	    font-size: 26rpx;
	    min-height: 175rpx;
	    padding: 16rpx 20rpx;
	    position: fixed;
	    bottom: 0;
	    left: 0;
	    right: 0;
	    z-index: 99; 
	}
	.footer-row { 
		display: flex; 
		align-items: center; 
		margin-bottom: 12rpx; 
		padding: 8rpx 14rpx; 
		background-color: #ffffff; 
		border-radius: 10rpx; 
		border: 1rpx solid #cbd5e1;
		width: 100%; 
	}
	.footer-label { width: 70rpx; color: #4b5563; font-size: 26rpx; font-weight: 600; flex-shrink: 0; margin-right: 12rpx; display: flex; align-items: center; height: 46rpx; }
	
	.footer-pills-scroll { 
		display: flex; 
		flex-wrap: nowrap; 
		overflow-x: auto; 
		flex: 1; 
		width: 0; 
		gap: 12rpx; 
		scrollbar-width: none; 
		align-items: center; 
		padding: 2rpx 0; 
		mask-image: linear-gradient(90deg, #000 85%, transparent 100%);
		&::-webkit-scrollbar { display: none; } 
	}
	.footer-pills-fixed { display: flex; flex-wrap: wrap; flex: 1; width: 0; gap: 12rpx; align-items: center; padding: 2rpx 0; }
	
	.pill-transition {
		transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
		cursor: pointer;
		&:active {
			transform: scale(0.92);
		}
	}
	
	.pill-default { background-color: #f1f5f9; color: #5c6b73; font-size: 22rpx; padding: 4rpx 10rpx; border-radius: 8rpx; border: 1rpx solid #cbd5e1; white-space: nowrap; flex-shrink: 0; }
	.pill-success { background: linear-gradient(135deg, #059669 0%, #047857 100%); color: #ffffff; font-size: 26rpx; padding: 4rpx 10rpx; border-radius: 8rpx; white-space: nowrap; border: 1rpx solid #047857; font-weight: 600; flex-shrink: 0; box-shadow: 0 2rpx 6rpx rgba(5,150,105,0.25); }
	.pill-navy { background: linear-gradient(135deg, #0062ff 0%, #0045b3 100%); color: #ffffff; font-size: 26rpx; padding: 4rpx 10rpx; border-radius: 8rpx; white-space: nowrap; border: 1rpx solid #0045b3; font-weight: 600; flex-shrink: 0; box-shadow: 0 2rpx 6rpx rgba(0,98,255,0.25); }
	.pill-maroon { background: linear-gradient(135deg, #ff003b 100%, #cc0030 100%); color: #ffffff; font-size: 26rpx; padding: 4rpx 10rpx; border-radius: 8rpx; white-space: nowrap; border: 1rpx solid #cc0030; font-weight: 600; flex-shrink: 0; box-shadow: 0 2rpx 6rpx rgba(255,0,59,0.25); }
	.pill-blue { background: linear-gradient(135deg, #0038a8 100%, #002270 100%); color: #ffffff; font-size: 26rpx; padding: 4rpx 10rpx; border-radius: 8rpx; white-space: nowrap; border: 1rpx solid #002270; font-weight: 600; flex-shrink: 0; box-shadow: 0 2rpx 6rpx rgba(0,56,168,0.25); }
	.pill-purple { background: linear-gradient(135deg, #7c3aed 100%, #5b21b6 100%); color: #ffffff; font-size: 26rpx; padding: 4rpx 10rpx; border-radius: 8rpx; white-space: nowrap; border: 1rpx solid #5b21b6; font-weight: 600; flex-shrink: 0; box-shadow: 0 2rpx 6rpx rgba(124,58,237,0.25); }
	
    .remark-static-container {
        flex: 1;
        min-width: 0;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        display: flex;
        align-items: center;
    }

    .remark-display-text {
        font-size: 26rpx;
        font-weight: 600;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .remark-edit-btn {
        font-size: 22rpx;
        color: #007aff;
        background: #eff6ff;
        border: 1rpx solid #bfdbfe;
        padding: 4rpx 14rpx;
        border-radius: 6rpx;
        font-weight: 600;
        cursor: pointer;
    }
</style>