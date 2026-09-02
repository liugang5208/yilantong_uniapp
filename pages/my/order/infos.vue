<template>
	<view class="container">
		<!-- 0. 顶部订单状态提示条 -->
		<view class="status_header_card">
			<view class="status_icon">📦</view>
			<view class="status_info">
				<text class="status_name">{{ getStatusText(info.status, info.paymode, info.ticket) }}</text>
				<text class="status_desc">{{ getStatusDesc(info.status, info.paymode, info.ticket) }}</text>
			</view>
		</view>

		<!-- 1. 收货信息卡片（高度压缩版） -->
		<view class="order_card compact_addr_card" v-if="info.addr">
			<view class="order_title">
				<text class="title_text">收货信息</text>
			</view>
			<view class="addr_box">
				<view class="addr_line">
					<text class="addr_label_tag">姓&emsp;名：</text>
					<text class="addr_val bold">{{info.addr.name}}</text>
				</view>
				<view class="addr_line">
					<text class="addr_label_tag">电&emsp;话：</text>
					<text class="addr_val bold selectable">{{info.addr.phone}}</text>
				</view>
				<view class="addr_line address_line">
					<text class="addr_label_tag">地&emsp;址：</text>
					<text class="addr_val">{{info.addr.p_name}}{{info.addr.c_name}}{{info.addr.l_name}}{{info.addr.street}}</text>
				</view>
			</view>
		</view>

		<!-- 2. 订单信息卡片 -->
		<view class="order_card" id="order-info-card">
			<view class="order_title">
				<text class="title_text">订单信息</text>
				<text class="copy_btn" @click.stop="copyOrderSummary">复制订单信息</text>
			</view>
			<view class="addr_box">
				<!-- 6. 订单编号前增加当前订单状态显示 -->
				<view class="addr_line">
					<text class="addr_label_tag">订单状态：</text>
					<text class="addr_val status_highlight" :style="{ color: getStatusColor(info.status) }">
						{{ getOrderStatusName(info.status) }}
					</text>
				</view>
				<view class="addr_line">
					<text class="addr_label_tag">订单编号：</text>
					<text class="addr_val bold selectable">{{info.sn}}</text>
				</view>
				<view class="addr_line">
					<text class="addr_label_tag">下单时间：</text>
					<text class="addr_val">{{info.time_zone}}</text>
				</view>
				<!-- 订单金额及物流代收分项展示（针对不含税且支付方式为货到付款/物流代收场景进行精确展开） -->
				<template v-if="info.paymode == '1'">
					<view class="addr_line">
						<text class="addr_label_tag">订单总额：</text>
						<text class="addr_val money_highlight"><i>{{info.money}}</i> 元</text>
					</view>
					<view class="addr_line">
						<text class="addr_label_tag">线上支付：</text>
						<text class="addr_val money_highlight"><i>{{ getOnlinePayMoney(info.money) }}</i> 元 (预付部分)</text>
					</view>
					<view class="addr_line">
						<text class="addr_label_tag">物流代收：</text>
						<text class="addr_val money_highlight"><i>{{ getLogisticsCollectMoney(info.money) }}</i> 元 (线下代收)</text>
					</view>
				</template>
				<template v-else>
					<view class="addr_line">
						<text class="addr_label_tag">订单金额：</text>
						<text class="addr_val money_highlight"><i>{{info.money}}</i> 元</text>
					</view>
				</template>

				<view class="addr_line">
					<text class="addr_label_tag">支付方式：</text>
					<text class="addr_val">
						{{info.paymode==0?'在线支付':''}}
						{{info.paymode==1?'货到付款':''}}
						{{info.paymode==2?'平台代发货':''}}
						{{info.paymode==3?'银行转账':''}}
						{{info.paymode==4?'签约商户':''}}
					</text>
				</view>
				<view class="addr_line">
					<text class="addr_label_tag">配送运费：</text>
					<text class="addr_val">{{ info.trans == 1 ? '含运费' : '不含运费' }}</text>
				</view>
				<view class="addr_line">
					<text class="addr_label_tag">发票类型：</text>
					<text class="addr_val">{{info.ticket=='0'?'不含发票':(info.ticket=='1'?'普通发票':'专用发票')}}</text>
				</view>
				<view class="addr_line">
					<text class="addr_label_tag">随货清单：</text>
					<text class="addr_val">{{info.needlist==0?'无需清单':'需要清单'}}</text>
				</view>
				<view class="addr_line address_line" v-if="info.tags">
					<text class="addr_label_tag">您的留言：</text>
					<text class="addr_val">{{info.tags}}</text>
				</view>
				<view class="addr_line address_line" v-if="info.ticket > 0 && info.ticket_tag">
					<text class="addr_label_tag">发票备注：</text>
					<text class="addr_val">{{info.ticket_tag}}</text>
				</view>
			</view>
		</view>

		<!-- 3. 购买单位信息卡片 -->
		<view class="order_card" v-if="info.ticket_comp>0">
			<view class="order_title">
				<text class="title_text" @click="toggleCompOpen">购买单位信息</text>
				<view class="toggle_right_wrap">
					<text class="copy_btn" @click.stop="copyCompInfo">复制信息</text>
					<div class="collapse_trigger_box" @click="toggleCompOpen">
						<text class="toggle_tip">{{ isCompOpen ? '收起' : '展开' }}</text>
						<text class="arrow_icon" :class="{ 'is_open': isCompOpen }">▼</text>
					</div>
				</view>
			</view>

			<view class="addr_box" v-if="info.tik_comp">
				<view class="addr_line first_line">
					<text class="addr_label_tag">单位名称：</text>
					<text class="addr_val bold">{{info.tik_comp.comp_name}}</text>
				</view>

				<view class="collapse_content" :class="{ 'collapsed': !isCompOpen }">
					<view class="addr_line">
						<text class="addr_label_tag">信用代码：</text>
						<text class="addr_val selectable">{{info.tik_comp.comp_tex || info.tik_comp.tax_code || '-'}}</text>
					</view>
					<view class="addr_line">
						<text class="addr_label_tag">银行账号：</text>
						<text class="addr_val selectable">{{info.tik_comp.bank_name || info.tik_comp.bank_id || '-'}}</text>
					</view>
					<view class="addr_line">
						<text class="addr_label_tag">开户银行：</text>
						<text class="addr_val">{{info.tik_comp.comp_bank || info.tik_comp.cardid || '-'}}</text>
					</view>
					<view class="addr_line">
						<text class="addr_label_tag">单位地址：</text>
						<text class="addr_val">{{info.tik_comp.comp_addr || info.tik_comp.addr || '-'}}</text>
					</view>
					<view class="addr_line">
						<text class="addr_label_tag">联系电话：</text>
						<text class="addr_val selectable">{{info.tik_comp.comp_tele || info.tik_comp.phone || '-'}}</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 3-2. 销售/开票单位信息卡片（仅含税订单展示，颜色适当加深区分） -->
		<view class="order_card seller_comp_card" v-if="info.ticket > 0 && sellerCompData">
			<view class="order_title">
				<text class="title_text" @click="toggleSellerCompOpen">销售方信息</text>
				<div class="toggle_right_wrap">
					<text class="copy_btn" @click.stop="copySellerCompInfo">复制信息</text>
					<div class="collapse_trigger_box" @click="toggleSellerCompOpen">
						<text class="toggle_tip">{{ isSellerCompOpen ? '收起' : '展开' }}</text>
						<text class="arrow_icon" :class="{ 'is_open': isSellerCompOpen }">▼</text>
					</div>
				</div>
			</view>

			<view class="addr_box">
				<view class="addr_line first_line">
					<text class="addr_label_tag">公司名称：</text>
					<text class="addr_val bold">{{sellerCompData.name || '-'}}</text>
				</view>

				<view class="collapse_content" :class="{ 'collapsed': !isSellerCompOpen }">
					<view class="addr_line">
						<text class="addr_label_tag">开户银行：</text>
						<text class="addr_val">{{sellerCompData.open_bank || '-'}}</text>
					</view>
					<view class="addr_line">
						<text class="addr_label_tag">银行账号：</text>
						<text class="addr_val selectable">{{sellerCompData.cardid || '-'}}</text>
					</view>
					<view class="addr_line">
						<text class="addr_label_tag">开户行号：</text>
						<text class="addr_val selectable">{{sellerCompData.open_bank_id || '-'}}</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 4 & 5. 不含税且银行转账：平铺卡片 + 分割线 + 展开收起逻辑 + 一键复制三条银行信息按钮 -->
		<view class="order_card" v-if="info.paymode=='3' && info.ticket<1">
			<view class="order_title">
				<text class="title_text">银行账户</text>
				<view class="toggle_right_wrap">
					<text class="copy_btn" @click.stop="copyAllBankInfo">复制账号信息</text>
					<div class="collapse_trigger_box" @click="toggleBankOpen" v-if="info.bank_pri && info.bank_pri.length > 1">
						<text class="toggle_tip">{{ isBankOpen ? '收起' : '展开全部' }}</text>
						<text class="arrow_icon" :class="{ 'is_open': isBankOpen }">▼</text>
					</div>
				</view>
			</view>

			<!-- 平铺式卡片展示银行账户，通过隔离线分割 -->
			<view class="addr_box bank_flat_box" v-if="info.bank_pri && info.bank_pri.length > 0">
				<template v-for="(item, i) in info.bank_pri">
					<view class="bank_item_wrapper" v-if="isBankOpen || i === 0" :key="i">
						<view class="addr_line first_line" v-if="info.bank_pri.length > 1">
							<text class="addr_label_tag">账户序号：</text>
							<text class="addr_val bold">账户 {{ i + 1 }}</text>
						</view>
						<view class="addr_line">
							<text class="addr_label_tag">开户银行：</text>
							<text class="addr_val">{{item.bank_name}}—{{item.bank}}</text>
						</view>
						<view class="addr_line" v-if="item.name">
							<text class="addr_label_tag">银行户名：</text>
							<text class="addr_val">{{item.name}}</text>
						</view>
						<view class="addr_line">
							<text class="addr_label_tag">银行账号：</text>
							<text class="addr_val selectable">{{item.cardid}}</text>
						</view>
						<view class="addr_line">
							<text class="addr_label_tag">开户分行：</text>
							<text class="addr_val">{{item.open_bank}}</text>
						</view>
						<!-- 隔离线：多条银行信息之间增加清晰的分割线 -->
						<view class="bank_divider" v-if="isBankOpen && i < info.bank_pri.length - 1"></view>
					</view>
				</template>
			</view>
		</view>
		
		<!-- 5. 商品明细清单卡片（已全面对齐草图及购物车完美网格风格） -->
		<view class="order_card" v-if="info.oinfo">
			<view class="order_title"><text class="title_text">商品明细清单</text></view>
			
			<view class="panel_box">
				<view v-for="(x,i) in info.oinfo" :key="i">
					
					<!-- 类型 0：标准电缆商品卡片 [修复：动态绑定奇偶类名 .card-item-odd / .card-item-even 实现外边框色相交替] -->
					<view class="modern-card" :class="i % 2 === 1 ? 'card-item-even' : 'card-item-odd'" v-if="x.types=='0'">
						<!-- 序号展示（与草图“序号：001”对齐） -->
						<view class="card-top-row">
							<text class="card-serial-title">序号：{{ String(i + 1).padStart(3, '0') }}</text>
						</view>

						<!-- 商品主内容区 -->
						<view class="card-main-content">
							<!-- 1. 商品名称占满整行（支持点击弹窗查看完整名称） -->
							<div class="spec-grid-item title-grid-item" @click="showFullGoodsName(x.name)">
								<text class="s-k">商品名称：</text>
								<text class="s-v font-dark name-ellipsis">{{x.name}}</text>
							</div>
							
							<!-- 2. 双列规格格栅（草图精准对齐版：产品型号、电压等级、产品规格、质量标准、购买数量、发票税率、执行单价、单品小计） -->
							<div class="spec-grid-box-double">
								<!-- 左列：产品型号 -->
								<div class="spec-grid-item" v-if="x.attr2">
									<text class="s-k">产品型号：</text>
									<text class="s-v font-blue" v-html="x.attr2.replace(/^[^：:]*[：:]/, '')"></text>
								</div>
								<!-- 右列：电压等级 -->
								<div class="spec-grid-item" v-if="x.attr1">
									<text class="s-k">电压等级：</text>
									<text class="s-v font-blue" v-html="x.attr1.replace(/^[^：:]*[：:]/, '')"></text>
								</div>

								<!-- 左列：产品规格 -->
								<div class="spec-grid-item" v-if="x.attr3">
									<text class="s-k">产品规格：</text>
									<text class="s-v font-blue" v-html="x.attr3.replace(/^[^：:]*[：:]/, '')"></text>
								</div>
								<!-- 右列：质量标准（若无则展示默认国标保检或自定义字段） -->
								<div class="spec-grid-item">
									<text class="s-k">质量标准：</text>
									<text class="s-v font-blue">{{ x.quality || '国标保检' }}</text>
								</div>

								<!-- 左列：购买数量 -->
								<div class="spec-grid-item">
									<text class="s-k">购买数量：</text>
									<text class="s-v font-price">{{x.nums}}</text>
								</div>
								<!-- 右列：发票税率（或发票类型映射） -->
								<div class="spec-grid-item">
									<text class="s-k">发票税率：</text>
									<text class="s-v font-price">{{ info.ticket == 0 ? '不含发票' : (info.ticket == 1 ? '普通发票' : '专用发票') }}</text>
								</div>

								<!-- 左列：执行单价 -->
								<div class="spec-grid-item">
									<text class="s-k">执行单价：</text>
									<text class="s-v font-price"><text class="yuan-sign">¥</text>{{transpoint(x.market)}}</text>
								</div>
								<!-- 右列：单品小计（不被省略） -->
								<div class="spec-grid-item">
									<text class="s-k">单品小计：</text>
									<text class="s-v font-price"><text class="yuan-sign">¥</text>{{transpoint(x.market*x.nums)}}</text>
								</div>
							</div>

							<!-- 3. 底部单品备注（根据草图要求：前端传过来的单条信息带有单品信息/备注时才在底部特意增加一个格显示，无备注则自动隐藏） -->
							<div class="spec-grid-item full-width-cell" v-if="x.remark || x.note || x.memo" style="margin-top: 10rpx;">
								<text class="s-k">单品备注：</text>
								<text class="s-v font-price">{{ x.remark || x.note || x.memo }}</text>
							</div>
						</view>
					</view>

					<!-- 类型 1：多属性组合电缆商品卡片 [修复：同步动态绑定奇偶类名 .card-item-odd / .card-item-even] -->
					<view class="modern-card" :class="i % 2 === 1 ? 'card-item-even' : 'card-item-odd'" v-if="x.types=='1'">
						<view class="card-top-row">
							<text class="card-serial-title">序号：{{ String(i + 1).padStart(3, '0') }}</text>
							<text class="card-type-badge">多规格组合包</text>
						</view>

						<view class="card-main-content">
							<div class="spec-grid-item title-grid-item" @click="showFullGoodsName(x.name)">
								<text class="s-k">商品名称：</text>
								<text class="s-v font-dark name-ellipsis">{{x.name}}</text>
							</div>
						</view>

						<div class="sub-attr-list-container">
							<view class="sub-attr-item" v-for="(r,ri) in x.child" :key="ri">
								<view class="sub-attr-name">{{r.info.name}}</view>
								<view class="sub-attr-control-row">
									<text class="sub-attr-price"><text class="yuan-sign-sm">¥</text>{{transpoint(r.info.market)}} (数量: {{r.nums}})</text>
								</view>
							</view>
						</div>

						<view class="card-main-content" style="margin-top: 10rpx;">
							<div class="spec-grid-box-double">
								<div class="spec-grid-item"></div>
								<div class="spec-grid-item">
									<text class="s-k">组合合计：</text>
									<text class="s-v font-price"><text class="yuan-sign">¥</text>{{transpoint(x.money || (x.child ? x.child.reduce((sum, item) => sum + (item.nums * item.info.market), 0) : 0))}}</text>
								</div>
							</div>
						</view>

						<!-- 多属性组合商品底部备注支持 -->
						<div class="spec-grid-item full-width-cell" v-if="x.remark || x.note || x.memo" style="margin-top: 10rpx;">
							<text class="s-k">单品备注：</text>
							<text class="s-v font-price">{{ x.remark || x.note || x.memo }}</text>
						</div>
					</view>

				</view>
			</view>
			
			<!-- [修复重构] 底部统计与运费、发票、总数及总金额展示区：采用完美三行结构，消除挤压，运费与发票采用轻量时尚小胶囊，数量与合计分类清晰呈现 -->
			<view class="summary_box">
				<view class="summary_line_tags">
					<view class="summary_tag_item">
						<text class="tag_label">运费标识：</text>
						<text class="tag_pill">{{ info.trans == 1 ? '含运费' : '不含运费' }}</text>
					</view>
					<view class="summary_tag_item">
						<text class="tag_label">发票类型：</text>
						<text class="tag_pill">{{info.ticket=='0'?'不含发票':(info.ticket=='1'?'普通发票':'专用发票')}}</text>
					</view>
				</view>
				<view class="summary_count_line">
					<text class="count_label">商品统计：</text>
					<text class="count_value">共 <span class="highlight">{{ info.oinfo ? info.oinfo.length : 0 }}</span> 个序号（总数量：<span class="highlight">{{info.count}}</span>）</text>
				</view>
				<view class="summary_total_line">
					<text class="total_label">合计金额：</text>
					<text class="highlight_money">¥ {{info.money}}</text>
				</view>
			</view>
		</view>

		<!-- 6. 转账凭证卡片 -->
		<view class="order_card" v-if="info.paymode=='3'">
			<view class="order_title"><text class="title_text">转账凭证</text></view>
			<view class="order_trans">
				<!-- 未上传 -->
				<view class="order_trans_tip_box" v-if="base64s < 1">
					<view class="tip_content_center">
						<text class="tip_emoji">😊</text>
						<view class="tip_text_group">
							<text class="tip_line">亲，您的转账截图还未上传，等待您的操作中</text>
							<text class="tip_line">请点击下方选择转账凭证添加截图并提交审核</text>
						</view>
					</view>
				</view>
				<!-- 已上传 -->
				<view class="order_trans_info2" v-if="base64s > 0" @tap="photoviewer">
					<image mode="aspectFill" :src="base64Image" />
					<view class="preview_tip_mask">点击查看大图</view>
				</view>
			</view>
		</view>

		<!-- 7. 物流信息卡片 -->
		<view class="order_card trans" v-if="info.trans_vo && info.status == '2'">
			<view class="order_title"><text class="title_text">物流信息详情</text></view>
			<view class="addr_box">
				<view class="addr_line"><text class="addr_label_tag">承运物流：</text><text class="addr_val">{{info.trans_vo.trans}}</text></view>
				<view class="addr_line"><text class="addr_label_tag">货运单号：</text><text class="addr_val selectable">{{info.trans_vo.trans_sn}}</text></view>
				<view class="addr_line"><text class="addr_label_tag">货物编号：</text><text class="addr_val">{{info.trans_vo.trade_sn}}</text></view>
				<view class="addr_line"><text class="addr_label_tag">发货时间：</text><text class="addr_val">{{info.trans_vo.time_zon}}</text></view>
				<view class="addr_line"><text class="addr_label_tag">代收货款：</text><text class="addr_val">{{info.trans_vo.agent_money}}元</text></view>
				<view class="addr_line"><text class="addr_label_tag">物流运费：</text><text class="addr_val">{{info.trans_vo.trans_fee}}元</text></view>
				<view class="addr_line"><text class="addr_label_tag">联系物流：</text><text class="addr_val link_text">{{info.trans_vo.trans_phone}}</text></view>
				<view class="addr_line address_line"><text class="addr_label_tag">取货地址：</text><text class="addr_val">{{info.trans_vo.get_addr}}</text></view>
			</view>
		</view>
		
		<view style="width: 750rpx;height: 140rpx;"></view>
		
		<!-- 8. 底部操作栏 -->
		<view class="footers" v-if="info.paymode=='3' && info.status=='0'">
			<view class="footer_btn_left" @tap.stop="openFileDir('WRITE_EXTERNAL_STORAGE')">
				<text class="foot_icon">📁</text>选择转账凭证
			</view>
			<view class="submit-btn" @tap.stop="applyTrans()">
				<text class="foot_icon">🚀</text>提交转账凭证
			</view>
		</view>

		<!-- ================= 自定义美化弹窗组件 ================= -->
		<view class="custom_modal_mask" v-if="modalConfig.show" @tap.stop="handleModalMaskClick">
			<view class="custom_modal_container" @tap.stop>
				<view class="custom_modal_header">
					<text class="custom_modal_title">{{ modalConfig.title }}</text>
				</view>
				<view class="custom_modal_body">
					<text class="custom_modal_content">{{ modalConfig.content }}</text>
				</view>
				<view class="custom_modal_footer">
					<view class="custom_modal_btn cancel" v-if="modalConfig.showCancel" @tap="onModalCancel">
						{{ modalConfig.cancelText }}
					</view>
					<view class="custom_modal_btn confirm" @tap="onModalConfirm">
						{{ modalConfig.confirmText }}
					</view>
				</view>
			</view>
		</view>
		<!-- ===================================================== -->
	</view>
</template>

<script>
	import { pathToBase64 } from 'image-tools'
	export default {
		data() {
			return {
				permissionID: '',
				action: '',
				oid: '',
				info: {},
				paybank: 0,
				base64s: 0,
				base64Image: '', 
				isCompOpen: false,
				isSellerCompOpen: false, // 销售方信息折叠状态
				isBankOpen: false,       // 银行账户折叠状态（默认收起状态，仅显示第一条）
				// 美化弹窗控制对象
				modalConfig: {
					show: false,
					title: '提示',
					content: '',
					showCancel: false,
					cancelText: '取消',
					confirmText: '确定',
					success: null
				}
			}
		},
		computed: {
			// 3. 根据含税订单发票类型（ticket == 1 普通发票 / ticket == 2 专用发票）实时读取对应的销售方数据源
			sellerCompData() {
				if (!this.info || !this.info.bank_pub) return null;
				if (this.info.ticket == 1) {
					return this.info.bank_pub.tic_1 || null;
				} else if (this.info.ticket == 2) {
					return this.info.bank_pub.tic_2 || null;
				}
				return null;
			}
		},
		onLoad(option) {
			this.oid = (option && option.oid) ? option.oid : '592'
			this.doIninit()
		},
		methods: {
			// 点击商品名称弹出查看完整名称
			showFullGoodsName(name) {
				this.showCustomModal({
					title: '商品完整名称',
					content: name || '暂无名称',
					showCancel: false,
					confirmText: '确定'
				});
			},
			// 自定义弹窗触发器
			showCustomModal(options) {
				this.modalConfig = {
					show: true,
					title: options.title || '提示',
					content: options.content || '',
					showCancel: options.showCancel !== undefined ? options.showCancel : false,
					cancelText: options.cancelText || '取消',
					confirmText: options.confirmText || '确定',
					success: options.success || null
				};
			},
			onModalConfirm() {
				let successCb = this.modalConfig.success;
				this.modalConfig.show = false;
				if (typeof successCb === 'function') {
					successCb({ confirm: true, cancel: false });
				}
			},
			onModalCancel() {
				let successCb = this.modalConfig.success;
				this.modalConfig.show = false;
				if (typeof successCb === 'function') {
					successCb({ confirm: false, cancel: true });
				}
			},
			handleModalMaskClick() {},

			toggleCompOpen() {
				this.isCompOpen = !this.isCompOpen;
			},
			toggleSellerCompOpen() {
				this.isSellerCompOpen = !this.isSellerCompOpen;
			},
			toggleBankOpen() {
				this.isBankOpen = !this.isBankOpen;
			},
			copyCompInfo() {
				let comp = this.info.tik_comp;
				if (!comp) {
					uni.showToast({ title: '暂无单位信息', icon: 'none' });
					return;
				}
				let text = `单位名称：\n${comp.comp_name || '-'}\n\n` +
				           `信用代码：\n${comp.comp_tex || comp.tax_code || '-'}\n\n` +
				           `银行账号：\n${comp.bank_name || comp.bank_id || '-'}\n\n` +
				           `开户银行：\n${comp.comp_bank || comp.cardid || '-'}\n\n` +
				           `单位地址：\n${comp.comp_addr || comp.addr || '-'}\n\n` +
				           `联系电话：\n${comp.comp_tele || comp.phone || '-'}`;
				
				uni.setClipboardData({
					data: text,
					success: () => {
						uni.showToast({ title: '复制成功', icon: 'success' });
					}
				});
			},
			// 复制销售方信息
			copySellerCompInfo() {
				let comp = this.sellerCompData;
				if (!comp) {
					uni.showToast({ title: '暂无销售方信息', icon: 'none' });
					return;
				}
				let text = `公司名称：\n${comp.name || '-'}\n\n` +
				           `开户银行：\n${comp.open_bank || '-'}\n\n` +
				           `银行账号：\n${comp.cardid || '-'}\n\n` +
				           `开户行号：\n${comp.open_bank_id || '-'}`;
				
				uni.setClipboardData({
					data: text,
					success: () => {
						uni.showToast({ title: '复制成功', icon: 'success' });
					}
				});
			},
			// 4. 一键复制当前全部三条银行信息
			copyAllBankInfo() {
				let banks = this.info.bank_pri;
				if (!banks || banks.length === 0) {
					uni.showToast({ title: '暂无银行账户信息', icon: 'none' });
					return;
				}
				let textArr = banks.map((item, index) => {
					return `【账户 ${index + 1}】\n` +
					       `开户银行：${item.bank_name || ''}—${item.bank || ''}\n` +
					       (item.name ? `银行户名：${item.name}\n` : '') +
					       `银行账号：${item.cardid || '-'}\n` +
					       `开户分行：${item.open_bank || '-'}`;
				});
				let text = textArr.join('\n\n--------------------\n\n');
				
				uni.setClipboardData({
					data: text,
					success: () => {
						uni.showToast({ title: '已复制全部银行信息', icon: 'success' });
					}
				});
			},
			// 7. 一键复制订单信息摘要（含订单摘要及收货人信息，排版精致有序）
			copyOrderSummary() {
				let info = this.info;
				if (!info || !info.sn) {
					uni.showToast({ title: '暂无订单信息', icon: 'none' });
					return;
				}
				let addr = info.addr || {};
				let paymodeStr = '';
				if (info.paymode == 0) paymodeStr = '在线支付';
				else if (info.paymode == 1) paymodeStr = '货到付款';
				else if (info.paymode == 2) paymodeStr = '平台代发货';
				else if (info.paymode == 3) paymodeStr = '银行转账';
				else if (info.paymode == 4) paymodeStr = '签约商户';

				let ticketStr = info.ticket == 0 ? '不含发票' : (info.ticket == 1 ? '普通发票' : '专用发票');
				
				let text = `========= 【订单信息摘要】 =========\n` +
				           `订单状态：${this.getOrderStatusName(info.status)}\n` +
				           `订单编号：${info.sn}\n` +
				           `下单时间：${info.time_zone || '-'}\n` +
				           `订单金额：¥${info.money || '0.00'}\n` +
				           `支付方式：${paymodeStr}\n` +
				           `配送运费：${info.trans == 1 ? '含运费' : '不含运费'}\n` +
				           `发票类型：${ticketStr}\n` +
				           `随货清单：${info.needlist == 0 ? '无需清单' : '需要清单'}\n` +
				           (info.tags ? `客户留言：${info.tags}\n` : '') +
				           `---------------------------------\n` +
				           `========= 【收货人信息】 =========\n` +
				           `收货姓名：${addr.name || '-'}\n` +
				           `联系电话：${addr.phone || '-'}\n` +
				           `收货地址：${addr.p_name || ''}${addr.c_name || ''}${addr.l_name || ''}${addr.street || '-'}\n` +
				           `=================================`;

				uni.setClipboardData({
					data: text,
					success: () => {
						uni.showToast({ title: '订单摘要复制成功', icon: 'success' });
					}
				});
			},
			// 计算不含税混合支付（物流代收模式）的在线支付金额（示例按 50% 分账呈现，保留两位小数）
			getOnlinePayMoney(totalMoney) {
				if (!totalMoney) return '0.00';
				let val = parseFloat(totalMoney) * 0.5;
				return (Math.floor(val * 100) / 100).toFixed(2);
			},
			// 计算不含税混合支付（物流代收模式）的物流代收金额
			getLogisticsCollectMoney(totalMoney) {
				if (!totalMoney) return '0.00';
				let onlineVal = parseFloat(totalMoney) * 0.5;
				let collectVal = parseFloat(totalMoney) - onlineVal;
				return (Math.floor(collectVal * 100) / 100).toFixed(2);
			},
			// 6. 获取订单状态名称
			getOrderStatusName(status) {
				if (status == '0') return '待付款';
				if (status == '1') return '待发货';
				if (status == '2') return '待收货';
				if (status == '3' || status == '4') return '已完成';
				return '处理中';
			},
			// 6. 获取订单状态颜色（岔开文字颜色显示）
			getStatusColor(status) {
				if (status == '0') return '#FAAD14'; // 待付款-暖黄/橙
				if (status == '1') return '#1890FF'; // 待发货-科技蓝
				if (status == '2') return '#52C41A'; // 待收货-绿色
				if (status == '3' || status == '4') return '#722ED1'; // 已完成-紫色
				return '#666666';
			},
			// 顶部状态提示标题
			getStatusText(status, paymode, ticket) {
				if (status == '0') {
					if (paymode == '3' && ticket > 0) {
						return '等待银行公对公转账与财务审核状态';
					}
					if (paymode == '3') {
						return '等待购买方私人银行转账中';
					}
					if (paymode == '2') {
						return '平台代发，待支付并确认发货信息';
					}
					if (paymode == '1') {
						return '订单已提交，待线上支付与物流代收';
					}
					if (paymode == '0') {
						return '订单已提交，等待在线支付';
					}
				}
				if (status == '1') return '仓库正在备货中';
				if (status == '2') return '商品已发出，运输中';
				if (status == '3' || status == '4') return '订单已完成';
				return '订单处理中';
			},
			// 顶部状态提示描述
			getStatusDesc(status, paymode, ticket) {
				if (status == '0') {
					if (paymode == '3' && ticket > 0) {
						return '请按订单提示核对开票及汇款信息完成银行转账，汇款后请及时上传付款凭证，经平台核定无误后将为您安排发货并开具发票。';
					}
					if (paymode == '3') {
						return '请使用与下单人一致的本人账户转账，汇款后上传对应凭证，经后台审核后再安排发货。';
					}
					if (paymode == '2') {
						return '请完成在线全款支付，支付成功后平台将按您填写的收货及发货要求录入物流单并安排代发服务';
					}
					if (paymode == '1') {
						return '本单采用混合支付方式，请先完成线上部分的付款，剩余部分由线下物流代收';
					}
					if (paymode == '0') {
						return '请在规定时间内完成在线支付，超时订单将自动关闭';
					}
				}
				if (status == '1') return '商家正在为您清点打包商品';
				if (status == '2') return '请注意查收您的货物';
				if (status == '3' || status == '4') return '感谢您的支持，期待再次光临';
				return '如有疑问请联系客服';
			},
			changebankID(id) {
				this.paybank = id;
			},
			photoviewer() {
				if (!this.base64Image) {
					uni.showToast({ title: '暂无图片可预览', icon: 'none' });
					return;
				}
				
				uni.showLoading({ title: '正在加载大图...', mask: true });

				// #ifdef APP-PLUS
				try {
					let base64Data = this.base64Image;
					if (base64Data.indexOf(',') !== -1) {
						base64Data = base64Data.split(',')[1];
					}
					let filePath = '_doc/preview_' + Date.now() + '.png';
					let bitmap = new plus.nativeObj.Bitmap('imgPreview');
					
					bitmap.loadBase64Data(base64Data, () => {
						bitmap.save(filePath, { overwrite: true, quality: 70 }, (i) => {
							uni.hideLoading();
							let localPath = plus.io.convertLocalFileSystemURL(i.target);
							uni.previewImage({
								urls: [localPath],
								current: 0,
								success: () => {
									setTimeout(() => { bitmap.clear(); }, 1500);
								},
								fail: (err) => {
									console.error('预览失败', err);
									bitmap.clear();
								}
							});
						}, (e) => {
							uni.hideLoading();
							bitmap.clear();
							uni.showToast({ title: '图片处理失败', icon: 'none' });
						});
					}, (e) => {
						uni.hideLoading();
						bitmap.clear();
						uni.showToast({ title: '图片格式错误', icon: 'none' });
					});
				} catch (err) {
					uni.hideLoading();
					uni.previewImage({ urls: [this.base64Image], current: 0 });
				}
				// #endif

				// #ifndef APP-PLUS
				uni.hideLoading();
				uni.previewImage({
					urls: [this.base64Image],
					current: 0
				});
				// #endif
			},
			transpoint(value) {
				return value ? (Math.floor(value * 100) / 100).toFixed(2) : '0.00';
			},
			doIninit() {
				let that = this;
				var params = { oid: that.oid };
				that.$api.orderOinfo(params).then(ret => {
					that.info = ret.data || {};
					if(ret.data.pic_imgs) {
						that.base64Image = ret.data.pic_imgs;
					}
					if(ret.data.save_imgs) that.base64s = ret.data.save_imgs.length;
				}).catch(err => {
					console.log(err);
				});
			},
			playSuccessAudio() {
				try {
					uni.vibrateLong();
				} catch (e) {}

				try {
				    const innerAudioContext = uni.createInnerAudioContext();
				    innerAudioContext.src = '/static/voice/report.mp3';
				    innerAudioContext.onError((res) => {
				        console.log("音频播放失败：", res);
				    });
				    innerAudioContext.play();
				} catch (e) {
				    console.log('音频初始化异常', e);
				}
			},
			applyTrans() {
				let that = this;
				if (!that.base64Image && that.base64s < 1) {
					that.showCustomModal({ 
						title: '提示', 
						content: '请先选择并上传转账凭证图片', 
						showCancel: false 
					});
					return false;
				}
				let params = { oid: that.oid, image: that.base64Image };
				that.$api.oinfo_up(params).then(ret => {
					that.playSuccessAudio();

					that.showCustomModal({
						title: '提示',
						confirmText: '我已知晓',
						content: '您的【转账凭证】已提交，财务核对无误后将及时为您安排发货。',
						showCancel: false,
						success: (res) => { 
							if (res.confirm) { 
								uni.redirectTo({
									url: '/pages/my/order/order' 
								});
							} 
						}
					});
				}).catch(err => {
					uni.showToast({ title: '提交失败，请重试', icon: 'none' });
					console.log(err);
				});
			},
			async openFileDir(permissionID) {
				let that = this;
				let flag = true;
				// #ifdef APP
				flag = await this.$util.permission(permissionID);
				// #endif
				if (!flag) {
					that.showCustomModal({
						title: "权限申请",
						content: "便于您使用该功能上传转账凭证。",
						showCancel: true,
						confirmText: "去开启",
						success: async (res) => {
							if (res.confirm) {
								let flagQ = await this.$util.requestPermissions(permissionID);
								if (flagQ) { that.showSourceAction(); }
							}
						}
					});
				} else {
					this.showSourceAction();
				}
			},
			showSourceAction() {
				let that = this;
				uni.showActionSheet({
					itemList: ['从相册选择图片', '现场拍照'],
					success: (res) => {
						if (res.tapIndex === 0) {
							that.chooseImageSource(['album']);
						} else if (res.tapIndex === 1) {
							that.chooseImageSource(['camera']);
						}
					}
				});
			},
			chooseImageSource(sourceType) {
				let that = this;
				uni.chooseImage({
					count: 1,
					sizeType: ['compressed'], 
					sourceType: sourceType,
					success: function(res) {
						let tempFilePath = res.tempFilePaths[0];
						uni.showLoading({ title: '图片处理中...', mask: true });
						
						pathToBase64(tempFilePath).then(base64 => {
							uni.hideLoading();
							that.base64s = 1;
							if (base64.indexOf('data:image') === -1) {
								that.base64Image = 'data:image/jpeg;base64,' + base64.replace(/^data:image\/\w+;base64,/, "");
							} else {
								that.base64Image = base64;
							}
							uni.showToast({ title: '图片已就绪', icon: 'none' });
						}).catch(error => { 
							uni.hideLoading();
							console.error(error);
							uni.showToast({ title: '图片加载失败', icon: 'none' });
						});
					}
				});
			}
		}
	}
</script>

<style scoped lang="scss">
	page {
		background-color: #F7F9FC;
	}

	.container {
		padding: 24rpx;
		box-sizing: border-box;
		padding-bottom: env(safe-area-inset-bottom);
	}

	/* ================= 自定义弹窗美化样式 ================= */
	.custom_modal_mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.6);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 9999;
		backdrop-filter: blur(4px);
		animation: fadeIn 0.25s ease;
	}
	.custom_modal_container {
		width: 82%;
		max-width: 620rpx;
		background: #ffffff;
		border-radius: 24rpx;
		overflow: hidden;
		box-shadow: 0 20rpx 40rpx rgba(0, 0, 0, 0.2);
		animation: scaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1);
		border: 1rpx solid rgba(212, 175, 55, 0.2);
	}
	.custom_modal_header {
		padding: 36rpx 30rpx 16rpx 30rpx;
		text-align: center;
	}
	.custom_modal_title {
		font-size: 34rpx;
		font-weight: bold;
		color: #1A1A1A;
	}
	.custom_modal_body {
		padding: 10rpx 36rpx 36rpx 36rpx;
		text-align: center;
	}
	.custom_modal_content {
		font-size: 28rpx;
		color: #555555;
		line-height: 1.6;
		word-break: break-all;
	}
	.custom_modal_footer {
		display: flex;
		border-top: 1rpx solid #F0F2F5;
		background: #FAFBFC;
	}
	.custom_modal_btn {
		flex: 1;
		height: 96rpx;
		line-height: 96rpx;
		text-align: center;
		font-size: 30rpx;
		font-weight: 500;
	}
	.custom_modal_btn.cancel {
		color: #666666;
		border-right: 1rpx solid #F0F2F5;
	}
	.custom_modal_btn.cancel:active {
		background: #F0F2F5;
	}
	.custom_modal_btn.confirm {
		color: #3447D7;
		font-weight: bold;
		background: linear-gradient(135deg, rgba(52, 71, 215, 0.05) 0%, rgba(94, 114, 235, 0.1) 100%);
	}
	.custom_modal_btn.confirm:active {
		opacity: 0.85;
	}

	@keyframes fadeIn {
		from { opacity: 0; }
		to { opacity: 1; }
	}
	@keyframes scaleUp {
		from { transform: scale(0.85); opacity: 0; }
		to { transform: scale(1); opacity: 1; }
	}
	/* ===================================================== */

	.status_header_card {
		background: linear-gradient(135deg, #3447D7 0%, #5e72eb 100%);
		border-radius: 16rpx;
		padding: 30rpx 24rpx;
		margin-bottom: 24rpx;
		display: flex;
		align-items: center;
		color: #ffffff;
		box-shadow: 0 8rpx 20rpx rgba(52, 71, 215, 0.15);
	}
	.status_icon {
		font-size: 48rpx;
		margin-right: 20rpx;
		background: rgba(255, 255, 255, 0.2);
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.status_name {
		font-size: 32rpx;
		font-weight: bold;
		display: block;
		margin-bottom: 4rpx;
	}
	.status_desc {
		font-size: 24rpx;
		opacity: 0.85;
	}

	.order_card {
		background: #ffffff;
		border-radius: 16rpx;
		padding: 0 24rpx 16rpx;
		margin-bottom: 24rpx;
		border: 1.5rpx solid #D4AF37; 
		box-shadow: 0 6rpx 20rpx rgba(212, 175, 55, 0.12);
	}

	/* 2. 销售方模块边框和阴影颜色适当加深一点 */
	.seller_comp_card {
		border: 1.5rpx solid #B8860B;
		box-shadow: 0 6rpx 20rpx rgba(184, 134, 11, 0.18);
		background: #FFFEFA;
	}

	.compact_addr_card .order_title {
		height: 72rpx;
		line-height: 72rpx;
		margin-bottom: 6rpx;
	}
	.compact_addr_card .addr_box {
		padding: 12rpx 20rpx;
	}
	.compact_addr_card .addr_line {
		padding: 8rpx 0;
	}
	.compact_addr_card .addr_label_tag {
		padding: 4rpx 10rpx;
	}

	.order_title {
		font-size: 30rpx;
		font-weight: bold;
		color: #1A1A1A;
		height: 88rpx;
		line-height: 88rpx;
		border-bottom: 1rpx solid #F0F2F5;
		margin-bottom: 12rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		user-select: none;
	}
	
	.toggle_right_wrap {
		display: flex;
		align-items: center;
	}
	
	.copy_btn {
		font-size: 22rpx;
		color: #936C00;
		background: linear-gradient(135deg, #FFF8E1 0%, #FFF3C4 100%);
		border: 1rpx solid #D4AF37;
		padding: 2rpx 12rpx;
		border-radius: 16rpx;
		margin-right: 16rpx;
		font-weight: 500;
		line-height: 1.5;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 2rpx 4rpx rgba(212, 175, 55, 0.15);
	}
	.copy_btn:active {
		opacity: 0.8;
		transform: scale(0.96);
	}

	.collapse_trigger_box {
		display: flex;
		align-items: center;
		cursor: pointer;
		padding: 10rpx 0;
	}
	.toggle_tip {
		font-size: 24rpx;
		color: #B8860B;
		margin-right: 6rpx;
	}
	.arrow_icon {
		font-size: 18rpx;
		color: #B8860B;
		transition: transform 0.3s ease;
	}
	.arrow_icon.is_open {
		transform: rotate(180deg);
	}

	.collapse_content {
		max-height: 1000px;
		opacity: 1;
		overflow: hidden;
		transition: all 0.3s ease-in-out;
	}
	.collapse_content.collapsed {
		max-height: 0;
		opacity: 0;
	}
	
	.collapse_content .addr_val {
		color: #1890ff !important;
		font-weight: 500;
	}

	.title_text {
		position: relative;
		padding-left: 16rpx;
		color: #2C2518;
		cursor: pointer;
	}
	.title_text::before {
		content: '';
		position: absolute;
		left: 0;
		top: 50%;
		transform: translateY(-50%);
		width: 6rpx;
		height: 28rpx;
		background: linear-gradient(180deg, #E6C553 0%, #B8860B 100%);
		border-radius: 4rpx;
	}

	.addr_box {
		background: #F8F9FC;
		border-radius: 12rpx;
		padding: 20rpx 24rpx;
		margin-bottom: 8rpx;
		border: 1rpx solid #EAECEF;
	}
	.addr_line {
		display: flex;
		align-items: center;
		padding: 14rpx 0;
		border-bottom: 1rpx dashed #E5E7EB;
		font-size: 28rpx;
	}
	.addr_line.first_line {
		padding-top: 0;
	}
	.addr_line:last-child {
		border-bottom: none;
		padding-bottom: 0;
	}
	
	.addr_label_tag {
		background: #F0F2F5;
		color: #606266;
		font-size: 26rpx;
		padding: 6rpx 12rpx;
		border-radius: 6rpx;
		width: 170rpx;
		flex-shrink: 0;
		text-align: center;
		margin-right: 16rpx;
		white-space: nowrap;
	}

	.addr_val {
		color: #333333;
		text-align: left;
		word-break: break-all;
		padding-left: 4rpx;
		flex: 1;
	}
	.addr_val.bold {
		font-weight: bold;
		color: #1A1A1A;
	}
	.status_highlight {
		font-weight: bold;
		font-size: 30rpx;
	}
	.address_line {
		align-items: flex-start;
	}
	.address_line .addr_val {
		line-height: 1.5;
	}
	.money_highlight i {
		color: #FF4D4F;
		font-style: normal;
		font-weight: bold;
		font-size: 34rpx;
	}
	.link_text {
		color: #3447D7;
		text-decoration: underline;
	}

	/* 5. 银行账户平铺及卡片内部隔离线样式 */
	.bank_flat_box {
		padding: 10rpx 24rpx;
	}
	.bank_item_wrapper {
		padding: 10rpx 0;
	}
	.bank_divider {
		height: 1rpx;
		background: #D4AF37;
		margin: 16rpx 0;
		opacity: 0.4;
	}

	.panel_box {
		display: flex;
		flex-direction: column;
		gap: 20rpx;
	}

	/* ========================================== */
	/* 购物车同款卡片样式与配色方案（已完美移植）    */
	/* ========================================== */
	.modern-card {
	    border-radius: 20rpx;
	    padding: 20rpx;
	    margin-bottom: 24rpx; 
	    box-sizing: border-box;
	    overflow: hidden;
	}
	
	/* [优化新增] 奇数卡片：明亮琥珀金质感边框与清透背景 */
	.card-item-odd {
	    background: linear-gradient(135deg, #FFFDEB 0%, #FFF9C4 50%, #FFFBEA 100%);
	    border: 1.5rpx solid rgba(212, 175, 55, 0.7);
	    box-shadow: 0 8rpx 24rpx rgba(234, 179, 8, 0.08), inset 0 1rpx 0 rgba(255, 255, 255, 0.8);
	}

	/* [优化新增] 偶数卡片：微深黄褐古铜金交替边框与沉稳微暗底色，视觉更清晰分明 */
	.card-item-even {
	    background: linear-gradient(135deg, #FFF9C4 0%, #FFF3B0 50%, #FFFAEA 100%);
	    border: 1.5rpx solid rgba(184, 134, 11, 0.75);
	    box-shadow: 0 8rpx 24rpx rgba(184, 134, 11, 0.12), inset 0 1rpx 0 rgba(255, 255, 255, 0.8);
	}
	
	.card-top-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 12rpx;
		padding-bottom: 8rpx;
		border-bottom: 1rpx dashed rgba(212, 175, 55, 0.3);
	}
	.card-serial-title {
		font-size: 28rpx;
		font-weight: bold;
		color: #8C6200;
	}
	.check-box-wrap {
		background: #f8fafc;
		border: 1rpx solid #cbd5e1;
		padding: 2rpx 12rpx;
		border-radius: 10rpx;
		display: flex;
		align-items: center;
	}
	.card-type-badge {
		background: #0284c7;
		color: #ffffff;
		font-size: 20rpx;
		padding: 4rpx 12rpx;
		border-radius: 8rpx;
		font-weight: 700;
	}
	
	.card-main-content {
		margin-bottom: 4rpx;
	}
	
	.spec-grid-box-double {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 10rpx 12rpx;
	}
	.spec-grid-item {
				background: transparent;
				border: none;
				padding: 0;
				display: flex;
				align-items: center; 
				font-size: 24rpx; 
				line-height: 1.3;
				&.title-grid-item {
					grid-column: span 2;
					margin-bottom: 10rpx;
					cursor: pointer;
				}
				&.full-width-cell {
					grid-column: span 2;
				}
				.s-k { 
					color: #475569; 
					font-weight: 600; 
					white-space: nowrap; 
					margin-right: 4rpx; 
					flex-shrink: 0; 
					font-size: 23rpx;
				}
				.s-v { 
					background: rgba(255, 255, 255, 0.85) !important; 
					color: #1e293b; 
					font-weight: 600; 
					/* 商品名称允许单行省略，点击可弹窗查看；其他小计等保持完整展示不被省略 */
					overflow: hidden; 
					text-overflow: ellipsis; 
					white-space: nowrap; 
					flex: 1;
					min-width: 0; 
					padding: 8rpx 8rpx; 
					border-radius: 6rpx;
					border: 0.5rpx solid rgba(234, 179, 8, 0.35) !important; 
					font-size: 23rpx; 
					box-shadow: inset 0 1rpx 2rpx rgba(0, 0, 0, 0.02);
				}
				.s-v.name-ellipsis {
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
				.font-blue { color: #0052d9 !important; font-weight: 700; }
				.font-dark { color: #0f172a !important; font-weight: 700; }
				.font-price { color: #d93838 !important; font-size: 23rpx !important; font-weight: 700; overflow: visible; text-overflow: clip; white-space: nowrap; }
				.yuan-sign { font-size: 20rpx; font-weight: 600; margin-right: 2rpx; }
			}

	.sub-attr-list-container {
		background: rgba(255, 255, 255, 0.6) !important;
		border-radius: 8rpx;
		padding: 6rpx 10rpx;
		margin-bottom: 6rpx;
		border: 1rpx solid rgba(234, 179, 8, 0.3) !important;
	}
	.sub-attr-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 4rpx 0;
		border-bottom: 1rpx solid #cbd5e1;
		&:last-child { border-bottom: none; }
	}
	.sub-attr-name { font-size: 24rpx; color: #334155; font-weight: 600; }
	.sub-attr-control-row {
		display: flex;
		align-items: center;
		gap: 10rpx;
		.sub-attr-price { font-size: 24rpx; color: #d93838; font-weight: 700; }
	}
	/* ========================================== */

	/* [优化重构] 底部统计栏：优雅的三行排版，彻底解决被挤压问题 */
	.summary_box {
		background: #FFFDF4;
		border: 1rpx solid #FFE58F;
		border-radius: 12rpx;
		padding: 20rpx;
		margin-top: 20rpx;
		box-shadow: 0 4rpx 12rpx rgba(212, 175, 55, 0.08);
	}
	/* 第一行：运费与发票小胶囊标识 */
	.summary_line_tags {
		display: flex;
		gap: 16rpx;
		margin-bottom: 14rpx;
		align-items: center;
	}
	.summary_tag_item {
		display: flex;
		align-items: center;
		font-size: 22rpx;
	}
	.tag_label {
		color: #8C6200;
		font-weight: 600;
	}
	.tag_pill {
		background: rgba(212, 175, 55, 0.12);
		color: #936C00;
		border: 1rpx solid rgba(212, 175, 55, 0.35);
		padding: 2rpx 12rpx;
		border-radius: 16rpx;
		font-weight: 600;
	}
	/* 第二行：件数与总数量统计 */
	.summary_count_line {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 24rpx;
		color: #475569;
		margin-bottom: 12rpx;
		padding-top: 10rpx;
		border-top: 1rpx dashed rgba(255, 229, 143, 0.6);
	}
	.count_label {
		font-weight: 600;
		color: #64748b;
	}
	.count_value {
		font-weight: 600;
		color: #1e293b;
	}
	/* 第三行：合计金额大字沉浸式展示 */
	.summary_total_line {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 26rpx;
		color: #1A1A1A;
		padding-top: 12rpx;
		border-top: 1rpx solid #FFE58F;
	}
	.total_label {
		font-weight: bold;
		color: #1A1A1A;
		font-size: 28rpx;
	}
	.highlight { color: #D93838; font-weight: bold; }
	.highlight_money { color: #FF4D4F; font-size: 36rpx; font-weight: bold; letter-spacing: 1rpx; }

	.order_trans { 
		padding: 10rpx 0; 
	}
	.order_trans_tip_box {
		background: #fffdf4;
		border: 1.5rpx solid #ffeeba;
		border-radius: 12rpx;
		padding: 20rpx 16rpx;
		text-align: center;
	}
	.tip_content_center {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	.tip_emoji {
		font-size: 44rpx;
		margin-bottom: 10rpx;
		line-height: 1;
	}
	.tip_text_group {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.tip_line {
		font-size: 24rpx;
		color: #856404;
		line-height: 1.5;
		white-space: nowrap;
	}
	
	.order_trans_info2 {
		position: relative;
		width: 100%;
		height: 240rpx;
		border-radius: 12rpx;
		overflow: hidden;
		background: #000;
	}
	.order_trans_info2 image {
		width: 100%;
		height: 100%;
		display: block;
		opacity: 0.95;
	}
	.preview_tip_mask {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		background: rgba(0, 0, 0, 0.45);
		color: #fff;
		font-size: 22rpx;
		text-align: center;
		padding: 6rpx 0;
		letter-spacing: 2rpx;
	}

	.footers {
		border-top: 1rpx solid #EEEEEE;
		background: #ffffff;
		height: 116rpx;
		padding: 0 32rpx;
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		box-shadow: 0 -6rpx 20rpx rgba(0,0,0,0.08);
		z-index: 99;
	}
	.footer_btn_left {
		display: flex;
		align-items: center;
		color: #3447D7;
		font-size: 26rpx;
		font-weight: 500;
		cursor: pointer;
		background: #F0F3FF;
		padding: 16rpx 24rpx;
		border-radius: 36rpx;
		border: 1rpx solid #D6E0FF;
	}
	.foot_icon {
		margin-right: 6rpx;
		font-size: 28rpx;
	}
	.footer_btn_left:active {
		background: #E2E8FF;
	}
	.submit-btn {
		display: flex;
		align-items: center;
		background: linear-gradient(135deg, #3447D7 0%, #5e72eb 100%);
		color: #fff !important;
		padding: 16rpx 28rpx;
		border-radius: 36rpx;
		font-size: 26rpx;
		font-weight: 500;
		box-shadow: 0 6rpx 16rpx rgba(52, 71, 215, 0.35);
	}
	.submit-btn:active {
		opacity: 0.9;
		transform: scale(0.98);
	}
	.none { display: none; }
</style>