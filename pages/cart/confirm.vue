<template>
	<view class="container-page">
		<!-- 自定义导航栏 -->
		<u-navbar :is-back="false" title="" :border-bottom="false">
			<view class="d_a_sb" style="width: 750rpx;">
				<view style="width: 200rpx;padding-left: 30rpx;" @click="back">
					<u-icon name="nav-back" color="#2C3E50" :size="40"></u-icon>
				</view>
				<view style="font-size: 32rpx; color: #2C3E50; font-weight: bold; text-align: center; flex-grow: 1;">结算中心</view>
				<view style="width: 200rpx;padding-right: 30rpx; color: #0A66C2; text-align: right; font-size: 28rpx;" @click="addrCustom">客服电话</view>
			</view>
		</u-navbar>
		
		<view class="main-body">
			<!-- 1. 收货人信息卡片 -->
			<view class="card-box" style="background: #F8FAFC; border-radius: 16rpx; padding: 16rpx;">
				<view class="card-header-row">
					<view class="card-title-wrap">
						<text class="bar-icon"></text>
						<text class="card-title" style="letter-spacing: 0.5px;">收货人信息</text>
					</view>
					<view class="action-outline-btn" @click="addrPicker(0)">
						<text>{{addr >= -1 && addrinf ? '更改地址' : '选择地址'}}</text>
						<u-icon name="arrow-right" color="#0A66C2" size="20" style="margin-left: 4rpx;"></u-icon>
					</view>
				</view>
				<view v-if="addr >= -1 && addrinf" class="addr-detail-box" @click="addrPicker(0)">
					<view class="addr-top-line" style="display: flex; align-items: center;">
					    <text class="receiver-name" style="font-weight: bold; font-size: 30rpx; color: #111827;">{{addrinf.name}}</text>
					    <text class="receiver-phone" style="margin-left: 24rpx; color: #DC2626; font-weight: bold; font-size: 30rpx;">{{addrinf.phone}}</text>
					</view>
					<view class="addr-bottom-line" style="display: flex; align-items: center; align-self: flex-start; padding-left: 0rpx;">
					    <view style="display: inline-flex; align-items: center; justify-content: center; background: #DC2626; color: #FFFFFF; border-radius: 6rpx; padding: 2rpx 8rpx; height: 1.4em;">
					        <text style="font-size: 26rpx; color: inherit; font-weight: bold; line-height: 1; letter-spacing: -1rpx;">地址:</text>
					    </view>
					    <text class="addr-text" style="line-height: 1.4; flex: 1; margin-left: 16rpx; font-size: 28rpx; color: #333333;">{{addrinf.p_name}}{{addrinf.c_name}}{{addrinf.l_name}}{{addrinf.street}}</text>
					</view>
				</view>
				<view v-else class="addr-empty-box" @click="addrPicker(0)">
					<text class="empty-txt">+ 请点击选择收货地址信息</text>
				</view>
			</view>

			<!-- 2. 商品清单卡片 -->
			<view class="card-box" style="background: transparent; box-shadow: none; border: none; padding: 0;">
				<view class="card-header-row" style="background: #FFF7ED; border-radius: 16rpx; margin-bottom: 24rpx; border: 1rpx solid #E2E8F0; box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.06);">
					<view class="card-title-wrap">
						<text class="bar-icon"></text>
						<text class="card-title">结算商品清单</text>
					</view>
					<view class="goods-stats-badge-group">
						<text class="stat-tag">共 {{list.length}} 种</text>
						<text class="stat-divider">·</text>
						<text class="stat-tag">合计数量：{{nums}}</text>
					</view>
				</view>
				
				<view class="goods-list-container">
					<view class="goods-item-card" v-for="(x,index) in list" :key="index">
						<!-- 草图风格的黄色卡片顶部序号抬头 -->
						<view class="goods-item-header">
							<text class="goods-seq-txt">序号：{{index + 1 < 10 ? '0' + (index + 1) : index + 1}}</text>
						</view>

						<view class="goods-item-inner-box">
							<!-- 类型 0 商品 -->
							<template v-if="x.types=='0'">
								<view class="cart-style-form">
									<view class="cs-row" @click="showFullName(x.list.gnames)">
										<view class="cs-cell full-width-cell">
											<text class="cs-label">商品名称</text>
											<view class="cs-value-box">
												<text class="name-txt ellipsis-single">{{x.list.gnames}}</text>
											</view>
										</view>
									</view>
									<view class="cs-row">
										<view class	="cs-cell half-cell">
											<text class="cs-label">{{x.list.key_1 || '产品型号'}}</text>
											<view class="cs-value-box"><text class="val-txt blue ellipsis-single">{{x.list.value_1}}</text></view>
										</view>
											<view class="cs-cell half-cell">
												<text class="cs-label">{{x.list.key_0 || '电压等级'}}</text>
												<view class="cs-value-box"><text class="val-txt blue ellipsis-single">{{x.list.value_0}}</text></view>
											</view>
									</view>
									<view class="cs-row">
										<view class="cs-cell half-cell">
											<text class="cs-label">产品规格</text>
											<view class="cs-value-box"><text class="val-txt blue ellipsis-single">{{x.list.value_2}}</text></view>
										</view>
										<view class="cs-cell half-cell">
											<text class="cs-label">质量标准</text>
											<view class="cs-value-box"><text class="val-txt blue ellipsis-single">{{x.list.quality || '国标保检'}}</text></view>
										</view>
									</view>
									<view class="cs-row">
										<view class="cs-cell half-cell">
											<text class="cs-label">购买数量</text>
											<view class="cs-value-box"><text class="val-txt red-num ellipsis-single">{{x.nums}}</text></view>
										</view>
										<view class="cs-cell half-cell">
											<text class="cs-label">发票税率</text>
											<view class="cs-value-box">
												<text :class="x.ticket=='0' ? 'plain-red-text' : 'plain-blue-text'">{{x.ticket=='0'?'不含发票':x.ticket=='1'?'普通发票':'专用发票'}}</text>
											</view>
										</view>
									</view>
									<view class="cs-row">
										<view class="cs-cell half-cell">
											<text class="cs-label">执行单价</text>
											<view class="cs-value-box"><text class="val-txt red-num ellipsis-single">¥{{ulevel ? transpoint(x.list.market*ulevel.up*x.ticket_fee) : 0}}</text></view>
										</view>
										<view class="cs-cell half-cell">
											<text class="cs-label">单品小计</text>
											<view class="cs-value-box"><text class="total-price-txt">¥{{transpoint(x.price)}}</text></view>
										</view>
									</view>
									<!-- 传货参数带有单品统计/备注时显示，没有则自动隐藏 -->
									<view class="cs-row cs-bottom-row" v-if="x.remark || x.single_stat || x.stats || (x.list && x.list.remark)">
										<view class="cs-cell full-width-cell">
											<text class="cs-label">单品备注</text>
											<view class="cs-value-box"><text class="val-txt red-num ellipsis-single">{{x.remark || x.single_stat || x.stats || (x.list && x.list.remark)}}</text></view>
										</view>
									</view>
								</view>
							</template>

							<!-- 类型 1 商品 -->
							<template v-if="x.types=='1'">
								<view class="cart-style-form">
									<view class="cs-row" @click="showFullName(x.gnames)">
										<view class="cs-cell full-width-cell">
											<text class="cs-label">商品名称</text>
											<view class="cs-value-box"><text class="name-txt ellipsis-single">{{x.gnames}}</text></view>
										</view>
									</view>
									<view class="cs-row">
										<view class="cs-cell half-cell">
											<text class="cs-label">{{x.datr.key_0 || '参数1'}}</text>
											<view class="cs-value-box"><text class="val-txt blue ellipsis-single">{{x.datr.value_0}}</text></view>
										</view>
										<view class="cs-cell half-cell">
											<text class="cs-label">{{x.datr.key_1 || '参数2'}}</text>
											<view class="cs-value-box"><text class="val-txt blue ellipsis-single">{{x.datr.value_1}}</text></view>
										</view>
									</view>
								</view>
								<view v-for="(r,rIndex) in x.list" :key="rIndex" class="sub-batch-item">
									<view class="batch-name ellipsis-single">{{r.info.name}}</view>
									<view class="goods-info-row">
										<text class="sub-label">数量：<text class="red-num">{{r.nums}}</text> | 单价：<text class="red-num">¥{{ulevel ? transpoint(r.info.market*ulevel.up*x.ticket_fee) : 0}}</text></text>
									</view>
								</view>
								<view class="cart-style-form" style="border-top: 1rpx solid #E2E8F0;">
									<view class="cs-row">
										<view class="cs-cell half-cell">
											<text class="cs-label">发票税率</text>
											<view class="cs-value-box">
												<text :class="x.ticket=='0' ? 'plain-red-text' : 'plain-blue-text'">{{x.ticket=='0'?'不含发票':x.ticket=='1'?'普通发票':'专用发票'}}</text>
											</view>
										</view>
										<view class="cs-cell half-cell">
											<text class="cs-label">单品小计</text>
											<view class="cs-value-box"><text class="total-price-txt">¥{{transpoint(x.price)}}</text></view>
										</view>
									</view>
									<!-- 类型1的单品备注条件显示 -->
									<view class="cs-row cs-bottom-row" v-if="x.remark || x.single_stat || x.stats">
										<view class="cs-cell full-width-cell">
											<text class="cs-label">单品备注</text>
											<view class="cs-value-box"><text class="val-txt red-num ellipsis-single">{{x.remark || x.single_stat || x.stats}}</text></view>
										</view>
									</view>
								</view>
							</template>
						</view>
					</view>
				</view>
			</view>

			<!-- 3. 交易及配送信息卡片 -->
			<view class="card-box">
				<view class="card-header-row" style="border-bottom: 1px solid #E2E8F0; background-color: #FFF7ED;">
					<view class="card-title-wrap">
						<text class="bar-icon"></text>
						<text class="card-title">交易及配送信息</text>
					</view>
				</view>
				<view class="form-list">
					<view class="form-row arrow" @click="addrPaytype()">
						<text class="f-label">交易模式</text>
						<view class="f-value-with-icon">
							<view class="f-value-with-icon">
							   <view class="icon-box">
							       <image class="app-icon-img" :src="getPayTypeIcon(paytype)" />
							   </view>
							</view>
							<text class="f-value highlight">
								{{paytype==0?'在线支付':''}} {{paytype==1?'货到付款':''}} {{paytype==2?'平台代发':''}} {{paytype==3?'银行转账':''}} {{paytype==4?'签约商户':''}}
							</text>
						</view>
					</view>

					<view class="form-row arrow" v-if="ticket == 0 && paytype < 3" @click="addrOnltype()">
						<text class="f-label">付款方式</text>
						<view class="f-value-with-icon">
							<view class="icon-box">
							    <image class="app-icon-img" :src="getOnlineTypeIcon(online)" />
							</view>
							<text class="f-value">{{online==1?'微信支付':online==2?'支付宝支付':'银联云闪付'}}</text>
						</view>
					</view>
					<view class="form-row" style="align-items: center; min-height: 100rpx;">
					    <text style="color: #ff4d4f; font-weight: bold; background-color: #fff1f0; padding: 4rpx 12rpx; border-radius: 8rpx;">随货带清单?</text>
					    <view class="f-value">
					        <u-radio-group v-model="select" @change="radioGroupChange">
					            <u-radio @change="radioGroupChange" v-for="(item, index) in listRadio" :key="index" :name="item.name">
					                <text :style="{ fontWeight: select == item.name ? 'bold' : 'normal', color: select == item.name ? '#333333' : '#888888' }">
					                    {{item.title}}
					                </text>
					            </u-radio>
					        </u-radio-group>
					    </view>
					</view>
					<view class="form-row-col">
						<text class="f-label">买家留言</text>
						<textarea placeholder="选填：如有特殊交货要求请在此处留言告知" v-model="tags" class="custom-textarea"></textarea>
					</view>
				</view>
			</view>

			<!-- 4. 发票信息模块 -->
			<view class="card-box invoice-module-card" v-if="ticket>0">
				<view class="inv-module-header" style="background: #FFF7ED; border-radius: 12rpx; border: 1rpx solid #E2E8F0;">
					<view class="inv-header-left">
						<text class="bar-icon"></text>
						<text class="inv-theme-title" style="color: #222222; font-weight: bold;">购买单位资料</text>
						<text class="inv-type-badge" style="color: #EA580C; background: #FFEDD5; padding: 4rpx 12rpx; border-radius: 6rpx; margin-left: 16rpx;">{{ticket=='1'?'普通发票':'专用发票'}}</text>
					</view>
					<view class="inv-select-btn" @click="addrTicket()">选择单位</view>
				</view>

				<view class="inv-module-body" v-if="comp >= 0 && cmlist[comp]">
					<view class="inv-info-row">
						<text class="inv-info-label">单位名称：</text>
						<text class="inv-info-val"><b>{{ comp >= 0 && cmlist[comp] ? cmlist[comp]['comp_name'] : '请点击右上角选择单位信息' }}</b></text>
					</view>
					<view class="inv-info-row">
						<text class="inv-info-label">信用代码：</text>
						<text class="inv-info-val"><b>{{ comp >= 0 && cmlist[comp] ? (cmlist[comp]['comp_tex'] || cmlist[comp]['tax_code'] || '-') : '-' }}</b></text>
					</view>
					<view class="inv-info-row">
						<text class="inv-info-label">银行账号：</text>
						<text class="inv-info-val"><b>{{ comp >= 0 && cmlist[comp] ? (cmlist[comp]['comp_bank'] || cmlist[comp]['cardid'] || '-') : '-' }}</b></text>
					</view>
					<view class="inv-info-row">
						<text class="inv-info-label">开户银行：</text>
						<text class="inv-info-val"><b>{{ comp >= 0 && cmlist[comp] ? (cmlist[comp]['bank_id'] || cmlist[comp]['bank_name'] || '-') : '-' }}</b></text>
					</view>
					<view class="inv-info-row">
						<text class="inv-info-label">单位地址：</text>
						<text class="inv-info-val"><b>{{ comp >= 0 && cmlist[comp] ? (cmlist[comp]['comp_addr'] || cmlist[comp]['addr'] || '-') : '-' }}</b></text>
					</view>
					<view class="inv-info-row">
						<text class="inv-info-label">联系电话：</text>
						<text class="inv-info-val"><b>{{ comp >= 0 && cmlist[comp] ? (cmlist[comp]['comp_tele'] || cmlist[comp]['phone'] || '-') : '-' }}</b></text>
					</view>
					<view class="inv-info-row">
						<text class="inv-info-label">温馨提示：</text>
						<text class="inv-info-val inv-warning-text"><b>买方发票抬头需与付款账户一致</b></text>
					</view>
					<view class="form-row-col" style="border-top: 1rpx solid #E2E8F0; margin-top: 8rpx;">
						<text class="f-label">发票备注</text>
						<textarea placeholder="选填：发票备注栏附加信息" v-model="tiktag" class="custom-textarea"></textarea>
					</view>
				</view>
			</view>

			<!-- 5. 纸质资料邮寄地址模块 -->
			<view class="card-box invoice-module-card" v-if="ticket>0">
				<view class="inv-module-header" style="background: #FFF7ED; border-radius: 12rpx; border: 1rpx solid #E2E8F0;">
					<view class="inv-header-left">
						<text class="bar-icon"></text>
						<text class="inv-theme-title" style="color: #222222; font-weight: bold;">资料邮寄地址</text>
					</view>
					<view class="inv-select-btn" @click="addrPicker(1)">
						{{ tikadinx >= 0 && adlist[tikadinx] ? '更换地址' : '选择地址' }}
					</view>
				</view>

				<view class="inv-module-body" v-if="tikadinx >= 0 && adlist[tikadinx]">
					<template v-if="tikadinx >= 0 && adlist[tikadinx]">
						<view class="inv-info-row">
							<text class="inv-info-label">收件名称：</text>
							<text class="inv-info-val"><b>{{ adlist[tikadinx]['name'] }}</b></text>
						</view>
						<view class="inv-info-row">
							<text class="inv-info-label">联系电话：</text>
							<text class="inv-info-val"><b>{{ adlist[tikadinx]['phone'] }}</b></text>
						</view>
						<view class="inv-info-row">
							<text class="inv-info-label">收件地址：</text>
							<text class="inv-info-val"><b>{{ adlist[tikadinx]['p_name'] }}{{ adlist[tikadinx]['c_name'] }}{{ adlist[tikadinx]['l_name'] }}{{ adlist[tikadinx]['street'] }}</b></text>
						</view>
					</template>
				</view>
			</view>

			<!-- 6. 平台代发货地址 -->
			<view class="card-box" v-if="paytype==2">
				<view class="card-header-row" style="background-color: #333; padding: 20rpx 30rpx; border-radius: 8rpx;">
					<view class="card-title-wrap">
						<text class="bar-icon"></text>
						<text class="card-title" style="color: #FFFFFF;">代发货模式-发货人物流信息</text>
					</view>
					<view class="card-header-right" @click="addrPicker(2)">
						<text class="inv-select-btn">{{ save_addr ? '更换地址' : '选择地址' }}</text>
					</view>
				</view>
				
				<view class="form-list" v-if="save_addr">
					<view class="form-row">
						<text class="b-label" style="font-weight: 600;">发货人姓名：</text>
						<text class="b-val">{{ save_name }}</text>
					</view>
					<view class="form-row">
						<text class="b-label" style="font-weight: 600;">发货人电话：</text>
						<text class="b-val">{{ save_phone }}</text>
					</view>
					<view class="form-row" style="height: auto; padding: 20rpx 0;">
						<text class="b-label" style="font-weight: 600;">发货人地址：</text>
						<text class="b-val" style="flex: 1; text-align: right; line-height: 1.4;">{{ save_addr }}</text>
					</view>
				</view>
				<view v-else class="form-list" @click="addrPicker(2)" style="padding: 30rpx; text-align: center; color: #999;">
					<text>+ 请点击选择平台代发寄件人地址</text>
				</view>
			</view>

			<!-- 7. 银行转账对公账户 -->
			<view class="card-box" v-if="paytype==3 && ticket>0">
				<view class="card-header-row" style="border-bottom: 1px solid #E2E8F0; background: #FFF7ED;">
					<view class="card-title-wrap"><text class="bar-icon"></text><text class="card-title">销售方单位信息</text></view>
					<view class="action-outline-btn" @click="copyPublicBankInfo(ticket==1 ? info.bank_pub.tic_1 : info.bank_pub.tic_2)">
						<text>复制收款信息</text>
					</view>
				</view>
				<view class="form-list" v-if="info.bank_pub">
					<template v-if="ticket==1">
						<view class="form-row"><text class="f-label">公司名称:</text><text class="f-value select-all">{{info.bank_pub.tic_1.name}}</text></view>
						<view class="form-row"><text class="f-label">开户银行:</text><text class="f-value select-all">{{info.bank_pub.tic_1.open_bank}}</text></view>
						<view class="form-row"><text class="f-label">银行账号:</text><text class="f-value red-text select-all">{{info.bank_pub.tic_1.cardid}}</text></view>
						<view class="form-row"><text class="f-label">开户行号:</text><text class="f-value select-all">{{info.bank_pub.tic_1.open_bank_id}}</text></view>
					</template>
					<template v-if="ticket==2">
						<view class="form-row"><text class="f-label">公司名称:</text><text class="f-value select-all">{{info.bank_pub.tic_2.name}}</text></view>
						<view class="form-row"><text class="f-label">开户银行:</text><text class="f-value select-all">{{info.bank_pub.tic_2.open_bank}}</text></view>
						<view class="form-row"><text class="f-label">银行账号:</text><text class="f-value red-text select-all">{{info.bank_pub.tic_2.cardid}}</text></view>
						<view class="form-row"><text class="f-label">开户行号:</text><text class="f-value select-all">{{info.bank_pub.tic_2.open_bank_id}}</text></view>
					</template>
				</view>
			</view>

			<!-- 8. 银行转账对私账户 -->
			<view class="card-box bank-transfer-card" v-if="paytype==3 && ticket<1">
				<view class="bank-card-header">
					<view class="card-title-wrap">
						<text class="bar-icon"></text>
						<text class="card-title">收款账户（对私账户）</text>
					</view>
					<view class="action-outline-btn copy-all-btn" @click="copyAllBankInfo">
						<u-icon name="file-text" color="#EF4444" size="24" style="margin-right: 4rpx;"></u-icon>
						<text>复制账户信息</text>
					</view>
				</view>

				<view class="single-bank-item-block" v-for="(item, i) in info.bank_pri" :key="i" :style="{ borderBottom: i < info.bank_pri.length - 1 ? '1rpx solid #CBD5E1' : 'none', boxShadow: i < info.bank_pri.length - 1 ? 'inset 0 -1rpx 0 0 #F1F5F9' : 'none', borderRadius: '0 !important', paddingTop: i === 0 ? '24rpx' : '16rpx', paddingBottom: i === info.bank_pri.length - 1 ? '28rpx' : '16rpx', marginBottom: '-2rpx' }" style="border-top: none !important;">
				        <view class="bank-item-title-bar" style="border-top: none !important; border-bottom: none !important;">
				            <view class="bank-logo-long-box">
				                <text class="bank-pill-icon">{{item.bank ? item.bank.substring(0,1) : '银'}}</text>
				                <text class="bank-brand-text">{{item.bank}}</text>
				            </view>
				        </view>
				        <view class="b-detail-panel-inline">
				            <view class="b-info-row">
				                <text class="b-label">户名：</text>
				                <text class="b-val highlight-name select-all">{{item.name}}</text>
				            </view>
				            <view class="b-info-row">
				                <text class="b-label">账号：</text>
				                <text class="b-val red-num select-all">{{item.cardid}}</text>
				            </view>
				            <view class="b-info-row border-none">
				                <text class="b-label">地址：</text>
				                <text class="b-val select-all" style="font-size: 26rpx; color: #475569;">{{item.open_bank}}</text>
				            </view>
				        </view>
				    </view>
			</view>

			<!-- 9. 支付金额结算明细 -->
			<view class="card-box highlight-card">
				<view class="card-header-row" style="border-bottom: 1px solid #E2E8F0; background: #FFF7ED;">
					<view class="card-title-wrap"><text class="bar-icon"></text><text class="card-title">订单金额结算明细</text></view>
				</view>
				<view class="form-list">
					<view class="form-row"><text class="f-label">配送与发票服务</text><text class="f-value red-text">{{ulevel && ulevel.trans>0?'含物流运费':'不含运费'}} / {{ticket=='0'?'不含发票':ticket=='1'?'普通发票':'专用发票'}}</text></view>
					<view class="form-row"><text class="f-label">订单商品总额</text><text class="f-value">¥{{transpoint(price)}}</text></view>
					<view class="form-row"><text class="f-label">本笔实付应付金额</text><text class="f-value main-price">¥{{transpay(price)}}</text></view>
					<view class="form-row">
						<text class="f-label">当前选择支付模式</text>
						<view class="f-value-with-icon">
							<view class="modal-face-icon-box">
								<image class="app-icon-img" :src="getPayTypeIcon(paytype)" />
							</view>
							<text class="f-value highlight">{{paytype==0?'在线支付':paytype==1?'货到付款':paytype==2?'平台代发':paytype==3?'银行转账':'签约商户'}}</text>
						</view>
					</view>
				</view>
			</view>

			<!-- 底部占位 -->
			<view style="height: 140rpx;"></view>
		</view>

		<!-- 弹出层组件 -->
		<uni-popup ref="popup" type="center" @change="popupChange">
			<!-- 收货地址弹窗 -->
			<view class="floating-modal-card" v-if="mask_addr>0">
				<view class="popup-header">
					<text class="popup-title">选择收货地址</text>
					<view class="popup-action-btn" @click="gotoAddr()">
						<text class="plus-icon">+</text>
						<text>地址管理</text>
					</view>
				</view>
				<scroll-view scroll-y="true" style="max-height: 52vh;">
					<view v-for="(item,i) in adlist" :key="i" class="popup-addr-card" :class="addrval==item.id ? 'active-addr-card' : ''" @click="comfirmAddr(i,item.id)">
						<view class="p-card-top">
							<text class="p-name">{{item.name}} <text class="p-phone">{{item.phone}}</text></text>
							<text v-if="addrval==item.id" class="current-badge">当前使用</text>
						</view>
						<text class="p-addr">{{item.p_name}}{{item.c_name}}{{item.l_name}}{{item.street}}</text>
					</view>
				</scroll-view>
			</view>

			<!-- 平台代发寄件人地址弹窗 -->
			<view class="floating-modal-card" v-if="mask_save>0">
				<view class="popup-header">
					<text class="popup-title">选择平台代发寄件人地址</text>
					<view class="popup-action-btn" @click="gotoAddr()">
						<text class="plus-icon">+</text>
						<text>地址管理</text>
					</view>
				</view>
				<scroll-view scroll-y="true" style="max-height: 52vh;">
					<view @click="comfirmSaveAddr(item,i)" v-for="(item,i) in adlist" :key="i" class="popup-addr-card">
						<view class="p-card-top">
							<text class="p-name">{{item.name}} <text class="p-phone">{{item.phone}}</text></text>
						</view>
						<text class="p-addr">{{item.p_name}}{{item.c_name}}{{item.l_name}}{{item.street}}</text>
					</view>
				</scroll-view>
			</view>

			<!-- 资料邮寄地址弹窗 -->
			<view class="floating-modal-card" v-if="mask_ticket>0">
				<view class="popup-header">
					<text class="popup-title">选择资料邮寄地址</text>
					<view class="popup-action-btn" @click="gotoAddr()">
						<text class="plus-icon">+</text>
						<text>地址管理</text>
					</view>
				</view>
				<scroll-view scroll-y="true" style="max-height: 52vh;">
					<view v-for="(item,i) in adlist" :key="i" class="popup-addr-card" :class="tikaddr==item.id ? 'active-addr-card' : ''" @click="comfirmTicketAddr(i,item.id)">
						<view class="p-card-top">
							<text class="p-name">{{item.name}} <text class="p-phone">{{item.phone}}</text></text>
							<text v-if="tikaddr==item.id" class="current-badge">当前使用</text>
						</view>
						<text class="p-addr">{{item.p_name}}{{item.c_name}}{{item.l_name}}{{item.street}}</text>
					</view>
				</scroll-view>
			</view>

			<!-- 在线支付方式选择弹窗 -->
			<view class="floating-modal-card" v-if="mask_online>0">
				<view class="popup-header"><text class="popup-title">选择在线支付方式</text></view>
				
				<view class="popup-pay-item" @click="comfirmOnltype(1)">
					<view class="pay-item-left">
						<view class="official-pay-icon-box">
							<image class="app-icon-img-lg" :src="onlineTypeImages[1]" />
						</view>
						<text class="pay-item-name">微信支付</text>
					</view>
					<text class="pay-item-check" v-if="online==1">✓</text>
				</view>
				
				<view class="popup-pay-item" @click="comfirmOnltype(2)">
					<view class="pay-item-left">
						<view class="official-pay-icon-box">
							<image class="app-icon-img-lg" :src="onlineTypeImages[2]" />
						</view>
						<text class="pay-item-name">支付宝支付</text>
					</view>
					<text class="pay-item-check" v-if="online==2">✓</text>
				</view>
				
				<view class="popup-pay-item" style="border-bottom: none;" @click="comfirmOnltype(3)">
					<view class="pay-item-left">
						<view class="official-pay-icon-box">
							<image class="app-icon-img-lg" :src="onlineTypeImages[3]" />
						</view>
						<text class="pay-item-name">银联云闪付</text>
					</view>
					<text class="pay-item-check" v-if="online==3">✓</text>
				</view>
			</view>

			<!-- 交易模式选择弹窗 -->
			<view class="floating-modal-card" v-if="mask_pays>0">
				<view class="popup-header"><text class="popup-title">选择交易模式</text></view>
				<scroll-view scroll-y="true" style="max-height: 55vh;">
					<template v-if="ticket == 0">
						<view class="popup-desc-cell" @click="comfirmPaytype(0)">
							<view class="mode-row-top">
								<view class="mode-left-part">
									<view class="modal-face-icon-box">
										<image class="app-icon-img" :src="payTypeImages[0]" />
									</view>
									<text class="pd-title">在线支付</text>
								</view>
								<text class="mode-check" v-if="paytype==0">✓ 已选</text>
							</view>
							<text class="pd-desc">全额在线支付，平台担保安全快捷发货</text>
						</view>

						<view class="popup-desc-cell" @click="comfirmPaytype(1)">
							<view class="mode-row-top">
								<view class="mode-left-part">
									<view class="modal-face-icon-box">
										<image class="app-icon-img" :src="payTypeImages[1]" />
									</view>
									<text class="pd-title">货到付款</text>
								</view>
								<text class="mode-check" v-if="paytype==1">✓ 已选</text>
							</view>
							<text class="pd-desc">预付50%定金发货，尾款50%由物流代收</text>
						</view>
					</template>

					<view class="popup-desc-cell" @click="comfirmPaytype(3)">
						<view class="mode-row-top">
							<view class="mode-left-part">
								<view class="modal-face-icon-box">
									<image class="app-icon-img" :src="payTypeImages[3]" />
								</view>
								<text class="pd-title">银行转账</text>
							</view>
							<text class="mode-check" v-if="paytype==3">✓ 已选</text>
						</view>
						<text class="pd-desc">线下公对公转账汇款，凭证审核后发货</text>
					</view>

					<view class="popup-desc-cell" @click="comfirmPaytype(4)">
						<view class="mode-row-top">
							<view class="mode-left-part">
								<view class="modal-face-icon-box">
									<image class="app-icon-img" :src="payTypeImages[4]" />
								</view>
								<text class="pd-title">签约商户</text>
							</view>
							<text class="mode-check" v-if="paytype==4">✓ 已选</text>
						</view>
						<text class="pd-desc">使用平台授予的授信额度直接进行结算</text>
					</view>

					<view class="popup-desc-cell" style="border-bottom: none;" @click="comfirmPaytype(2)" v-if="ticket == 0">
						<view class="mode-row-top">
							<view class="mode-left-part">
								<view class="modal-face-icon-box">
									<image class="app-icon-img" :src="payTypeImages[2]" />
								</view>
								<text class="pd-title">平台代发</text>
							</view>
							<text class="mode-check" v-if="paytype==2">✓ 已选</text>
						</view>
						<text class="pd-desc">全款支付后,按您指定的收发件人代发</text>
					</view>
				</scroll-view>
			</view>

			<!-- 单位发票信息弹窗 -->
			<view class="floating-modal-card" v-if="mask_comp>0">
				<view class="popup-header">
					<text class="popup-title">选择开票单位资质</text>
					<view class="popup-action-btn" @click="gotoComp()">
						<text class="plus-icon">+</text>
						<text>添加单位</text>
					</view>
				</view>
				<scroll-view scroll-y="true" style="max-height: 52vh;">
					<view @click="comfirmBank(i,item.id)" v-for="(item,i) in cmlist" :key="i" class="popup-addr-card" :class="compval==item.id ? 'active-addr-card' : ''">
						<view class="p-card-top">
							<text class="p-name">{{item.comp_name}}</text>
							<text v-if="compval==item.id" class="current-badge">当前使用</text>
						</view>
						<text class="p-addr">{{item.tex_type>1?'一般纳税人':'小规模纳税人'}} | {{item.ticket_type>1?'增值税专用发票':'增值税普通发票'}}</text>
					</view>
				</scroll-view>
			</view>

			<!-- 在线支付提交成功提示弹窗 -->
			<view class="floating-modal-card" v-if="mask_online_success>0">
				<view class="popup-header" style="justify-content: center; border-bottom: none; margin-bottom: 8rpx;">
					<text class="popup-title" style="font-size: 36rpx; color: #0A66C2;">🎉 订单提交成功</text>
				</view>
				<view class="bank-success-content">
					<view class="success-desc-box">
						<text class="hl-tag blue-hl" style="color: #007aff; font-weight: bold; background-color: #e6f2ff; padding: 4px 8px; border-radius: 4px; display: inline-block; margin-bottom: 6px;">【在线支付订单已生成】</text>
						<text class="desc-line">您的订单已成功提交！请前往待付款页面进行支付。</text>
					</view>
					<view class="success-confirm-btn" @click="handleOnlineSuccessConfirm">
						<text>-我已知晓-</text>
					</view>
				</view>
			</view>

			<!-- 银行转账提交成功专属高级弹窗 -->
			<view class="floating-modal-card" v-if="mask_bank_success>0">
				<view class="popup-header" style="justify-content: center; border-bottom: none; margin-bottom: 8rpx;">
					<text class="popup-title" style="font-size: 36rpx; color: #0A66C2;">🎉 订单提交成功</text>
				</view>
				<view class="bank-success-content">
					<view class="success-desc-box">
						<text class="desc-line">订单已成功提交！请按页面提供的收款账户信息完成转账，并在 <text class="hl-tag blue-hl">【待付款】</text> 页面中找到该订单后上传 <text class="hl-tag red-hl">【银行转账凭证截图】</text>。转账时需备注（货款）字样。</text>
						<text class="desc-line" style="margin-top: 16rpx;">财务核对货款收到后我们将为您安排发货{{ ticket >= 1 ? '并邮寄材料和提供对应的发票' : '' }}。</text>
					</view>
					<view class="success-confirm-btn" @click="handleBankSuccessConfirm">
						<text>-我已知晓-</text>
					</view>
				</view>
			</view>

			<!-- 签约商户专属高级弹窗 -->
			<view class="floating-modal-card" v-if="mask_thousand > 0">
				<view class="popup-header" style="justify-content: center; border-bottom: none; margin-bottom: 8rpx;">
					<text class="popup-title" style="font-size: 36rpx; color: #0A66C2;">🎉 订单提交成功</text>
				</view>
				<view class="bank-success-content">
					<view class="success-desc-box">
						<text class="hl-tag blue-hl" style="color: #007aff; font-weight: bold; background-color: #e6f2ff; padding: 4px 8px; border-radius: 4px; display: inline-block; margin-bottom: 6px;">【签约订单已生成】</text>
						<text class="desc-line">您的订单已成功提交！作为签约商户，本次无需在线付款，平台将为您直接安排发货，后续按合同约定或商议的结算方式统一执行。</text>
					</view>
					<view class="success-confirm-btn" @click="handleThousandConfirm">
						<text>-我已知晓-</text>
					</view>
				</view>
			</view>

			<!-- 客服电话专属高级弹窗 -->
			<view class="floating-modal-card" v-if="mask_custom>0">
				<view class="popup-header">
					<text class="popup-title">客户服务与热线支持</text>
				</view>
				<view class="custom-service-box">
					<view class="cs-icon-circle">📞</view>
					<text class="cs-main-tip">技术服务与意见反馈专用号码</text>
					<text class="cs-phone-number">18883333289</text>
					<text class="cs-desc-time">服务时间：周一至周五 9:00 - 17:00</text>
					<div class="cs-call-action-btn" @click="makePhoneCall">
						<text>立即拨打客服热线</text>
					</div>
				</view>
			</view>
		</uni-popup>

		<!-- 底部固定结算栏 -->
		<view class="footer-bar">
			<view class="footer-left">
				<view class="footer-price-row">
					<text class="footer-label">应付合计：</text>
					<text class="footer-price">¥{{transpay(price)}}</text>
				</view>
				<view class="footer-tag-row">
					<text class="footer-ticket-tag tag-freight">不含运费</text>
					<text class="footer-ticket-tag" :class="ticket == '0' ? 'tag-red' : 'tag-blue'">{{ticket == '0' ? '不含发票' : (ticket == '1' ? '普通发票' : '专用发票')}}</text>
				</view>
			</view>
			<view class="footer-btn" @click="creatOrd()">生成订单</view>
		</view>
	</view>
</template>

<script>
	import uniPopup from '@/uni_modules/uni-popup/components/uni-popup/uni-popup.vue'
	export default {
		components: { uniPopup },
		data() {
			return {
				listRadio: [{ name: 1, title: '需要' }, { name: 0, title: '不需要' }],
				uid: '',
				ulevel: '',
				uinfo: '',
				info: '',
				list: [],
				nums: 0,
				price: 0,
				ticket: '',
				ticket_fee: '',
				mask: '',
				mask_addr: 0,
				mask_pays: 0,
				mask_online: 0,
				mask_comp: 0,
				mask_ticket: 0,
				mask_save: 0,
				mask_custom: 0,
				mask_bank_success: 0,
				mask_online_success: 0,
				mask_thousand: 0,
				thousandOrderId: '',
				pendingOrderId: '',
				adlist: [],
				addr: -1,
				addrinf: null,
				addrval: "0",
				paytype: 0,
				online: 1, 
				select: 0,
				tags: '',
				cmlist: [],
				comp: -1,
				compval: "0",
				tiktag: '',
				tikadinx: -1,
				tikaddr: '',
				save_name: '',
				save_phone: '',
				save_addr: '',
				base64s: 0,
				base64Image: '',
				paybtn: "生成订单",
				
				payTypeImages: {
					0: '/static/icon/ic_zaixianzhifu.png',
					1: '/static/icon/ic_huodaofukuan.png',
					2: '/static/icon/ic_daifa.png',
					3: '/static/icon/ic_yinhangzhuanzhang.png',
					4: '/static/icon/ic_qianyueshanghu.png'
				},
				onlineTypeImages: {
					1: '/static/icon/ic_weixinzhifu.png',
					2: '/static/icon/ic_zhifubao.png',
					3: '/static/icon/ic_yinlianzhifu.png'
				}
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
							uni.reLaunch({ url: '/pages/login_md/login_md' })
						}
					}
				});
			} else {
				this.uid = userInfo.id
				this.doIninit()
			}
		},
		methods: {
			getPayTypeIcon(type) {
				return this.payTypeImages[type] || '/static/image_498c77.png';
			},
			getOnlineTypeIcon(type) {
				return this.onlineTypeImages[type] || '/static/image_498c77.png';
			},
			copyPublicBankInfo(ticData) {
				if (!ticData) return;
				let text = `公司名称：${ticData.name}\n开户银行：${ticData.open_bank}\n银行账号：${ticData.cardid}\n开户行号：${ticData.open_bank_id}`;
				uni.setClipboardData({
					data: text,
					success: () => {
						uni.showToast({ title: '收款信息已完整复制', icon: 'none', duration: 2500 });
					}
				});
			},
			copyAllBankInfo() {
				let that = this;
				if (!that.info.bank_pri || that.info.bank_pri.length === 0) {
					uni.showToast({ title: '暂无可用银行信息', icon: 'none' });
					return;
				}
				let combinedText = that.info.bank_pri.map((item, index) => {
				    return `户名：${item.name}\n账号：${item.cardid}\n开户网点：${item.open_bank}`;
				}).join('\n\n');

				uni.setClipboardData({
					data: combinedText,
					success: () => {
						uni.showToast({ title: '已全部复制三条银行信息', icon: 'none', duration: 2500 });
					}
				});
			},
			copyText(text) {
				uni.setClipboardData({
					data: text,
					success: () => {
						uni.showToast({ title: '账号已复制', icon: 'none', duration: 2500 });
					}
				});
			},
			showFullName(nameStr) {
				uni.showModal({
					title: '商品全称',
					content: nameStr,
					showCancel: false,
					confirmText: '我知道了'
				});
			},
			gotoComp() { uni.navigateTo({ url: '/pages/my/tiindex/tiindex' }) },
			gotoAddr() { uni.navigateTo({ url: '/pages/my/adindex/adindex' }) },
			
			addrCustom() {
				this.hideMasks();
				this.mask_custom = 1;
				this.$refs.popup.open();
			},
			makePhoneCall() {
				uni.makePhoneCall({
					phoneNumber: '18883333289',
					fail: (err) => { console.log('取消拨打', err); }
				});
			},

			comfirmTicketAddr(index, id) {
				this.tikadinx = index;
				this.tikaddr = id;
				this.$refs.popup.close();
				this.hideMasks();
			},
			comfirmBank(index, id) {
				this.comp = index;
				this.compval = id;
				this.$refs.popup.close();
				this.hideMasks();
			},
			addrTicket() {
				var params = { uid: this.uid };
				this.$api.ticket_list(params).then(ret => {
					this.cmlist = ret.data;
					this.$refs.popup.open();
					this.mask_comp = 1;
				}).catch(err => {});
			},
			creatOrd() {
				let that = this;
				
				if (that.ticket > 0 && (!that.compval || that.compval == "0" || that.comp < 0)) {
					uni.showToast({ title: '请先选择购买单位资料', icon: 'none' });
					return;
				}
				
				if (that.ticket > 0 && (!that.tikaddr || that.tikadinx < 0)) {
					uni.showToast({ title: '请填写资料邮寄地址', icon: 'none' });
					return;
				}

				var params = {
					uid: that.uid, addr_id: that.addrval, paymode: that.paytype, paytype: that.online,
					needlist: that.select, tags: that.tags, trade_type: 0, ticket: that.ticket,
					ticket_fee: that.ticket_fee, ticket_comp: that.compval, ticket_tag: that.tiktag,
					ticket_addr: that.tikaddr, save_name: that.save_name, save_phone: that.save_phone,
					save_addr: that.save_addr, image: that.base64Image,
					selected_bank_info: (that.paytype == 3 && that.ticket < 1 && that.info.bank_pri) ? that.info.bank_pri : null
				};
				
				that.$api.order(params).then(ret => {
					this.innerAudioContext = uni.createInnerAudioContext();
					this.innerAudioContext.src = "/static/voice/ord.mp3";
					this.innerAudioContext.play();

					let createdOrderId = (ret && ret.data) ? (ret.data.id || ret.data) : '';

					if (that.paytype == 4) {
						that.thousandOrderId = createdOrderId;
						that.hideMasks();
						that.mask_thousand = 1;
						that.$refs.popup.open();
						return;
					}

					if (that.ticket > 0) {
						that.pendingOrderId = createdOrderId;
						that.hideMasks();
						if (that.paytype == 3) {
							that.mask_bank_success = 1;
						} else {
							that.mask_online_success = 1;
						}
						that.$refs.popup.open();
						return;
					}

					that.pendingOrderId = createdOrderId;
					that.hideMasks();
					if (that.paytype == 3) {
						that.mask_bank_success = 1;
					} else {
						that.mask_online_success = 1;
					}
					that.$refs.popup.open();
				}).catch(err => {
					console.log("下单失败：", err);
					uni.showToast({ title: '请选择发货人信息', icon: 'none' });
				});
			},
			handleOnlineSuccessConfirm() {
				this.$refs.popup.close();
				this.hideMasks();
				uni.redirectTo({ url: '/pages/my/order/order?status=1&st=0' });
			},
			handleBankSuccessConfirm() {
				this.$refs.popup.close();
				this.hideMasks();
				uni.redirectTo({ url: '/pages/my/order/order?status=1&st=0' });
			},
			handleThousandConfirm() {
				this.$refs.popup.close();
				this.hideMasks();
				uni.redirectTo({ url: '/pages/my/order/order?status=2&st=1' });
			},
			radioChange(e) {},
			comfirmPaytype(type) {
				this.paytype = type;
				this.$refs.popup.close();
				this.hideMasks();
			},
			addrOnltype() {
				this.$refs.popup.open();
				this.mask_online = 1;
			},
			addrPaytype() {
				this.mask = 1;
				this.mask_pays = 1;
				this.$refs.popup.open();
			},
			comfirmOnltype(type) {
				this.online = type;
				this.$refs.popup.close();
				this.hideMasks();
			},
			comfirmAddr(index, id) {
				this.addr = index;
				this.addrinf = this.adlist[index];
				this.addrval = id;
				this.$refs.popup.close();
				this.hideMasks();
			},
			radioGroupChange(e) { this.select = e; },
			hideMasks(e) {
				this.mask = 0; this.mask_addr = 0; this.mask_pays = 0;
				this.mask_online = 0; this.mask_comp = 0; this.mask_ticket = 0; this.mask_custom = 0;
				this.mask_bank_success = 0;
				this.mask_online_success = 0;
				this.mask_thousand = 0;
			},
			popupChange(e) { if (!e.show) { this.hideMasks(); } },
			transpay(value) {
				if (this.paytype == 1) { value = value * 0.5; } 
				return Math.floor(value * 100) / 100;
			},
			transpoint(value) { return Math.floor(value * 100) / 100; },
			doIninit() {
				let that = this;
				var params = { uid: that.uid, type: 1 };
				that.$api.Carts(params).then(ret => {
					that.info = ret.data;
					that.list = ret.data.list || [];
					if (that.list.length < 1) { return that.navCtrl.pop(); }
					that.ulevel = ret.data.ulevel;
					that.uinfo = ret.data.users;
					that.nums = ret.data.nums;
					that.price = ret.data.price;
					that.ticket = ret.data.ticket;
					that.ticket_fee = ret.data.ticket_fee;
					that.adlist = ret.data.adlist || [];
					that.addr = ret.data.adef;
					
					if (that.ticket > 0 && that.paytype !== 3 && that.paytype !== 4) {
						that.paytype = 3;
					}

					if(ret.data.adlist && ret.data.adef >= 0 && ret.data.adlist[ret.data.adef]) {
						that.addrinf = ret.data.adlist[ret.data.adef];
						that.addrval = ret.data.adlist[ret.data.adef]["id"];
					}
				}).catch(err => {});
			},
			addrPicker(type) {
				let that = this;
				var params = { uid: that.uid };
				that.$api.uaddr_list(params).then(ret => {
					that.adlist = ret.data;
					that.mask = 1;
					that.$refs.popup.open();
					that.mask_addr = (type === 0 ? 1 : 0);
					that.mask_ticket = (type === 1 ? 1 : 0);
					that.mask_save = (type === 2 ? 1 : 0);
				}).catch(err => {});
			},
			comfirmSaveAddr(item, i) {
				this.save_name = item.name;
				this.save_phone = item.phone;
				this.save_addr = `${item.p_name}${item.c_name}${item.l_name}${item.street}`;
				this.$refs.popup.close();
				this.mask = 0;
				this.mask_save = 0;
			},
			back() { uni.navigateBack() }
		}
	}
</script>

<style scoped lang="scss">
	.container-page {
		background-color: #F3F4F6;
		min-height: 100vh;
		box-sizing: border-box;
		padding-bottom: calc(40rpx + constant(safe-area-inset-bottom));
		padding-bottom: calc(40rpx + env(safe-area-inset-bottom));
	}

	.main-body {
		padding: 24rpx;
	}

	.card-box {
		background: #FFFFFF;
		border-radius: 16rpx;
		margin-bottom: 24rpx;
		box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.06);
		overflow: hidden;
		border: 1rpx solid #E2E8F0;
	}

	.highlight-card {
		box-shadow: 0 12rpx 32rpx rgba(0, 0, 0, 0.1);
		border: 1rpx solid #CBD5E1;
	}

	.card-header-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 24rpx 28rpx;
	}

	.card-title-wrap {
		display: flex;
		align-items: center;
	}

	.bar-icon {
		width: 6rpx;
		height: 28rpx;
		background: #0A66C2;
		border-radius: 4rpx;
		margin-right: 12rpx;
	}

	.card-title {
		font-size: 30rpx;
		font-weight: bold;
		color: #2C3E50;
	}

	.action-outline-btn {
		display: flex;
		align-items: center;
		border: 1rpx solid #0A66C2;
		color: #0A66C2;
		font-size: 24rpx;
		padding: 6rpx 18rpx;
		border-radius: 30rpx;
		font-weight: 500;
		background: transparent;
		min-height: 48rpx;
		box-sizing: border-box;
	}
	
	.copy-all-btn {
		border-color: #EF4444;
		color: #EF4444;
		background: #FEF2F2;
	}

	.addr-detail-box {
		padding: 0 28rpx 28rpx 28rpx;
	}

	.addr-top-line {
		display: flex;
		align-items: baseline;
		margin-bottom: 12rpx;
	}

	.receiver-name {
		font-size: 32rpx;
		font-weight: bold;
		color: #2C3E50;
		margin-right: 20rpx;
	}

	.receiver-phone {
		font-size: 30rpx;
		color: #0A66C2;
		font-weight: bold;
	}

	.addr-bottom-line {
		display: flex;
		align-items: flex-start;
		background: #F8FAFC;
		padding: 16rpx;
		border-radius: 8rpx;
	}

	.addr-text {
		font-size: 26rpx;
		color: #2C3E50;
		line-height: 1.4;
		white-space: normal;
		word-break: break-all;
	}

	.addr-empty-box {
		padding: 40rpx 28rpx;
		text-align: center;
		background: #F8FAFC;
		margin: 0 24rpx 24rpx 24rpx;
		border-radius: 12rpx;
		border: 2rpx dashed #CBD5E1;
	}

	.empty-txt {
		font-size: 28rpx;
		color: #0A66C2;
		font-weight: 500;
	}

	.goods-stats-badge-group {
		display: flex;
		align-items: center;
		background: #F3F4F6;
		padding: 6rpx 18rpx;
		border-radius: 20rpx;
		border: 1rpx solid #E2E8F0;
	}
	.stat-tag {
		font-size: 24rpx;
		color: #2C3E50;
		font-weight: 500;
	}
	.stat-divider {
		font-size: 24rpx;
		color: #94A3B8;
		margin: 0 8rpx;
	}

	.goods-list-container {
		display: flex;
		flex-direction: column;
		gap: 28rpx; 
		padding-bottom: 12rpx;
	}

	/* 修改或替换这一段卡片样式 */
	.goods-item-card {
	    /* 科技感微光渐变：从极浅的温和乳黄过渡到带有通透感的浅金光泽，最后收尾于细腻的米白 */
	    background: linear-gradient(135deg, #FFFDEB 0%, #FFF9C4 50%, #FFFBEA 100%);
	    
	    /* 边框改成带有质感的浅金微边框，提升精致度 */
	    border: 1rpx solid rgba(253, 224, 71, 0.6);
	    
	    /* 增加一层微微透光的内发光或柔和阴影，让它看起来像悬浮的微光科技面板 */
	    box-shadow: 0 8rpx 24rpx rgba(234, 179, 8, 0.08), inset 0 1rpx 0 rgba(255, 255, 255, 0.8);
	    
	    border-radius: 20rpx;
	    padding: 15rpx;
	    overflow: hidden;
	    margin-bottom: 24rpx;
	}
	
	.goods-item-header {
	    padding: 4rpx 8rpx 16rpx 8rpx;
	    display: flex;
	    justify-content: space-between;
	    align-items: center;
	}
	
	.goods-seq-txt {
	    font-size: 32rpx;
	    font-weight: bold;
	    color: #1E293B;
	    letter-spacing: 0.5px;
	}
	
	.goods-item-inner-box {
	    background: #FFFFFF;
	    border-radius: 16rpx;
	    border: 1rpx solid #E2E8F0;
	    overflow: hidden;
	    box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
	}

	.cart-style-form {
		background: #FFFFFF;
		border-bottom: 1rpx solid #E2E8F0;
		overflow: hidden;
	}
	.cart-style-form:last-child {
		border-bottom: none;
	}

	.cs-row {
		display: flex;
		border-bottom: 1rpx solid #E2E8F0;
	}
	.cs-row:last-child { border-bottom: none; }

	.cs-cell {
		display: flex;
		min-width: 0;
		box-sizing: border-box;
		min-height: 64rpx;
	}

	.cs-cell.half-cell {
		flex: 1;
		border-right: 1rpx solid #E2E8F0;
	}
	.cs-cell.half-cell:last-child { border-right: none; }

	.cs-cell.full-width-cell {
		flex: 1;
		border-right: none;
	}

	.cs-label {
		width: 130rpx;
		background: #F8FAFC;
		color: #2C3E50;
		font-size: 26rpx;
		font-weight: normal;
		display: flex;
		align-items: center;
		padding: 0 14rpx;
		border-right: 1rpx solid #E2E8F0;
		flex-shrink: 0;
		box-sizing: border-box;
		white-space: nowrap; 
	}

	.cs-value-box {
		flex: 1;
		padding: 10rpx 14rpx;
		display: flex;
		align-items: center;
		background: #FFFFFF;
		box-sizing: border-box;
		overflow: hidden;
		min-width: 0;
	}

	.name-txt {
		font-size: 26rpx;
		font-weight: normal;
		color: #2C3E50;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		width: 100%;
		display: block;
	}

	.ellipsis-single {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		width: 100%;
		display: block;
	}

	.val-txt {
		font-size: 26rpx;
		font-weight: bold;
	}
	.val-txt.blue { color: #0A66C2; }
	.val-txt.red-num { color: #EF4444; }

	.cs-bottom-row {
		background: #F8FAFC;
	}

	.plain-red-text {
		color: #EF4444;
		font-size: 26rpx;
		font-weight: bold;
	}

	.plain-blue-text {
		color: #0A66C2;
		font-size: 26rpx;
		font-weight: bold;
	}

	.total-price-txt {
		color: #EF4444;
		font-size: 26rpx;
		font-weight: bold;
	}

	.goods-info-row {
		display: flex;
		justify-content: space-between;
		font-size: 26rpx;
		color: #2C3E50;
		padding: 8rpx 4rpx;
	}

	.sub-label { color: #2C3E50; }
	.red-num { color: #EF4444; font-weight: bold; }

	.sub-batch-item {
		background: #FFFFFF;
		padding: 14rpx 16rpx;
		border-radius: 8rpx;
		margin-top: 10rpx;
		border: 1rpx solid #E2E8F0;
	}
	.batch-name { font-size: 26rpx; color: #0A66C2; font-weight: 500; margin-bottom: 6rpx; }

	.form-list { padding: 0 28rpx; }

	.form-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		min-height: 96rpx;
		border-top: 1rpx solid #E2E8F0;
		font-size: 28rpx;
	}
	.form-list .form-row:first-child { border-top: none; }

	.form-row.arrow {
		position: relative;
		padding-right: 32rpx;
	}
	.form-row.arrow::after {
		content: "";
		position: absolute;
		right: 4rpx;
		top: 50%;
		transform: translateY(-50%) rotate(45deg);
		width: 14rpx;
		height: 14rpx;
		border-top: 3rpx solid #CBD5E1;
		border-right: 3rpx solid #CBD5E1;
	}

	.form-row-col {
		padding: 20rpx 0;
		border-top: 1rpx solid #E2E8F0;
	}
	.form-list .form-row-col:first-child { border-top: none; }

	.f-label { 
		color: #2C3E50; 
		font-size: 28rpx; 
		font-weight: 500; 
		width: 260rpx;
		flex-shrink: 0;
	}
	.f-value { color: #2C3E50; font-size: 28rpx; text-align: right; }
	.f-value.highlight { color: #0A66C2; font-weight: 500; }
	
	.red-text { color: #EF4444; font-weight: bold; }
	
	.main-price {
		font-size: 38rpx;
		color: #EF4444;
		font-weight: bold;
	}

	.f-value-with-icon {
		display: flex;
		align-items: center;
		gap: 12rpx;
	}

	.modal-face-icon-box {
		width: 44rpx;
		height: 44rpx;
		background: #F8FAFC;
		border: 1rpx solid #CBD5E1;
		color: #2C3E50;
		border-radius: 10rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		box-sizing: border-box;
	}

	.app-icon-img {
		width: 28rpx;
		height: 28rpx;
		display: block;
	}

	.app-icon-img-lg {
		width: 40rpx;
		height: 40rpx;
		display: block;
	}

	.official-pay-icon-box {
		width: 52rpx;
		height: 52rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		box-sizing: border-box;
	}

	.custom-textarea {
		width: 100%;
		background: #F8FAFC;
		border: 1rpx solid #CBD5E1;
		border-radius: 10rpx;
		padding: 20rpx;
		font-size: 26rpx;
		box-sizing: border-box;
		margin-top: 12rpx;
		height: 130rpx;
		color: #2C3E50;
	}

	.invoice-module-card {
		background: #FFFFFF;
		border-radius: 16rpx;
		margin-bottom: 24rpx;
		box-shadow: 0 12rpx 36rpx rgba(0, 0, 0, 0.12);
		overflow: hidden;
		border: 1rpx solid #CBD5E1;
	}

	.inv-module-header {
		background-color: #E2E8F0;
		padding: 20rpx 24rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1rpx solid #CBD5E1;
	}

	.inv-header-left {
		display: flex;
		align-items: center;
		gap: 12rpx;
	}

	.inv-theme-title {
		color: #0A66C2;
		font-size: 30rpx;
		font-weight: bold;
	}

	.inv-select-btn {
		background-color: #0A66C2;
		color: #FFFFFF;
		font-size: 24rpx;
		padding: 10rpx 20rpx;
		border-radius: 30rpx;
		font-weight: 500;
	}

	.inv-module-body {
		padding: 16rpx 24rpx;
		background: #FFFFFF;
	}

	.inv-info-row {
		display: flex;
		align-items: stretch;
		margin: 12rpx 0;
		font-size: 28rpx;
		min-height: 56rpx;
	}

	.inv-info-label {
		width: 170rpx;
		background-color: #F1F5F9;
		color: #000000;
		font-weight: normal;
		display: flex;
		align-items: center;
		padding: 0 12rpx;
		border-radius: 6rpx;
		white-space: nowrap;
		flex-shrink: 0;
		box-sizing: border-box;
	}

	.inv-info-val {
		flex: 1;
		padding: 0 16rpx;
		color: #000000;
		font-weight: bold;
		display: flex;
		align-items: center;
		word-break: break-all;
	}

	.inv-warning-text {
		color: #EF4444 !important;
	}

	.bank-transfer-card {
		background: #FFFFFF;
		border: 1rpx solid #E2E8F0;
		border-radius: 16rpx;
		overflow: hidden;
		box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.06);
	}

	.bank-card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 24rpx 28rpx 16rpx 28rpx;
		border-bottom: 1rpx solid #F1F5F9;
	}

	.single-bank-item-block {
		background: #FFFFFF;
		border: 1rpx solid #E2E8F0;
		border-radius: 12rpx;
		overflow: hidden;
		padding: 16rpx 20rpx;
		box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.02);
	}

	.bank-item-title-bar {
		display: flex;
		align-items: center;
		margin-bottom: 12rpx;
		border-bottom: 1rpx solid #F1F5F9;
		padding-bottom: 10rpx;
	}

	.bank-logo-long-box {
		display: flex;
		align-items: center;
		gap: 12rpx;
		background: #F1F5F9;
		padding: 6rpx 16rpx;
		border-radius: 8rpx;
		width: 100%;
		box-sizing: border-box;
	}

	.bank-brand-text {
		font-size: 28rpx;
		font-weight: bold;
		color: #1E293B;
		letter-spacing: 0.5px;
	}

	.bank-pill-icon {
		width: 36rpx;
		height: 36rpx;
		background: #0A66C2;
		color: #FFFFFF;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 22rpx;
		font-weight: bold;
		flex-shrink: 0;
	}

	.b-detail-panel-inline {
		display: flex;
		flex-direction: column;
		gap: 6rpx;
	}

	.b-info-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		min-height: 56rpx;
		border-bottom: 1rpx solid #F8FAFC;
		font-size: 26rpx;

		&.border-none {
			border-bottom: none;
		}
	}

	.b-label {
		color: #64748B;
		font-size: 26rpx;
		flex-shrink: 0;
		width: 80rpx;
	}

	.b-val {
		color: #1E293B;
		font-size: 26rpx;
		text-align: right;
		flex: 1;

		&.highlight-name {
			font-weight: bold;
			color: #0F172A;
		}

		&.red-num {
			color: #EF4444;
			font-weight: bold;
			font-size: 28rpx;
			letter-spacing: 0.5px;
		}
	}

	.footer-bar {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		height: 150rpx;
		background: #FFEDD5;
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		padding: 20rpx 24rpx env(safe-area-inset-bottom);
		box-shadow: 0 -4rpx 16rpx rgba(0, 0, 0, 0.05);
		z-index: 99;
	}

	.footer-left {
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 4rpx;
	}

	.footer-price-row {
		display: flex;
		align-items: baseline;
	}

	.footer-price {
		font-size: 34rpx;
		font-weight: bold;
		color: #EF4444;
		margin-left: 0rpx;
	}

	.footer-tag-row {
		display: flex;
		align-items: center;
		gap: 10rpx;
	}

	.footer-ticket-tag {
		color: #FFFFFF;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2rpx 12rpx;
		height: 32rpx;
		font-size: 20rpx;
		border-radius: 6rpx;
		box-sizing: border-box;
	}

	.tag-freight {
		background: #64748B;
		border: 1rpx solid #475569;
	}

	.tag-red {
		background: #EF4444 !important;
		border: 1rpx solid #DC2626 !important;
		color: #FFFFFF !important;
	}

	.tag-blue {
		background: #0284C7 !important;
		border: 1rpx solid #0369A1 !important;
		color: #FFFFFF !important;
	}

	.footer-btn {
		width: 220rpx;
		height: 72rpx;
		background: linear-gradient(135deg, #1E88E5, #0165FC);
		border-radius: 36rpx;
		color: #FFFFFF;
		font-size: 32rpx;
		font-weight: bold;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 4rpx 12rpx rgba(1, 101, 252, 0.35);
	}

	.floating-modal-card {
		background: #FFFFFF;
		border-radius: 28rpx;
		overflow: hidden;
		padding: 24rpx 28rpx 36rpx 28rpx;
		width: 86vw;
		max-width: 640rpx;
		box-sizing: border-box;
		box-shadow: 0 20rpx 50rpx rgba(0, 0, 0, 0.15);
		margin: 0 auto;
	}

	.popup-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 80rpx;
		border-bottom: 1rpx solid #E2E8F0;
		margin-bottom: 16rpx;
	}

	.popup-title { font-size: 32rpx; font-weight: bold; color: #2C3E50; }
	
	.popup-action-btn {
		display: flex;
		align-items: center;
		background: #EFF6FF;
		border: 1rpx solid #0A66C2;
		padding: 6rpx 18rpx;
		border-radius: 30rpx;
		color: #0A66C2;
		font-size: 26rpx;
		font-weight: 500;
		min-height: 48rpx;
		box-sizing: border-box;
	}
	.plus-icon {
		font-size: 30rpx;
		font-weight: bold;
		margin-right: 4rpx;
		line-height: 1;
	}

	.popup-addr-card {
		background: #F8FAFC;
		border: 1rpx solid #E2E8F0;
		border-radius: 16rpx;
		padding: 24rpx;
		margin-bottom: 20rpx;
	}
	.popup-addr-card.active-addr-card {
		background: #EFF6FF;
		border: 2rpx solid #0A66C2;
		box-shadow: 0 4rpx 12rpx rgba(10, 102, 194, 0.1);
	}
	.p-card-top {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		margin-bottom: 8rpx;
	}
	.p-name { font-size: 30rpx; font-weight: bold; color: #2C3E50; }
	.p-phone { font-size: 28rpx; color: #0A66C2; font-weight: bold; margin-left: 12rpx; }
	.current-badge {
		background: #0A66C2;
		color: #FFFFFF;
		font-size: 20rpx;
		padding: 2rpx 12rpx;
		border-radius: 6rpx;
		font-weight: 500;
	}
	.p-addr { 
		font-size: 26rpx; 
		color: #2C3E50; 
		line-height: 1.4; 
		display: block; 
		white-space: normal;
		word-break: break-all;
	}

	.popup-pay-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 100rpx;
		border-bottom: 1rpx solid #E2E8F0;
		padding: 0 10rpx;
	}
	.pay-item-left {
		display: flex;
		align-items: center;
		gap: 16rpx;
	}
	.pay-item-name {
		font-size: 30rpx;
		color: #2C3E50;
		font-weight: 500;
	}
	.pay-item-check {
		font-size: 32rpx;
		color: #0A66C2;
		font-weight: bold;
	}

	.popup-desc-cell {
		padding: 20rpx 10rpx;
		border-bottom: 1rpx solid #E2E8F0;
	}
	.mode-row-top {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 6rpx;
	}
	.mode-left-part {
		display: flex;
		align-items: center;
		gap: 16rpx;
	}
	.pd-title { 
		font-size: 30rpx; 
		font-weight: bold; 
		color: #2C3E50; 
	}
	.mode-check {
		font-size: 24rpx;
		color: #0A66C2;
		font-weight: bold;
		background: #EFF6FF;
		padding: 2rpx 12rpx;
		border-radius: 6rpx;
	}
	.pd-desc { 
		font-size: 24rpx; 
		color: #94A3B8; 
		display: block; 
		line-height: 1.4;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		padding-left: 60rpx; 
	}

	.bank-success-content {
		padding: 10rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.success-desc-box {
		background: #F8FAFC;
		border: 1rpx solid #E2E8F0;
		border-radius: 12rpx;
		padding: 24rpx;
		width: 100%;
		box-sizing: border-box;
		margin-bottom: 28rpx;
	}
	.desc-line {
		font-size: 28rpx;
		color: #2C3E50;
		line-height: 1.6;
		display: block;
		text-align: left;
	}
	.hl-tag {
		font-weight: bold;
		padding: 2rpx 8rpx;
		border-radius: 6rpx;
		display: inline-block;
	}
	.hl-tag.blue-hl {
		color: #0A66C2;
		background: #EFF6FF;
		border: 1rpx solid #BFDBFE;
	}
	.hl-tag.red-hl {
		color: #EF4444;
		background: #FEF2F2;
		border: 1rpx solid #FECACA;
	}
	.success-confirm-btn {
		width: 100%;
		height: 84rpx;
		background: #0A66C2;
		border-radius: 42rpx;
		color: #FFFFFF;
		font-size: 30rpx;
		font-weight: bold;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 6rpx 16rpx rgba(10, 102, 194, 0.35);
	}

	.custom-service-box {
		padding: 20rpx 10rpx 10rpx 10rpx;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.cs-icon-circle {
		width: 90rpx;
		height: 90rpx;
		background: #EFF6FF;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 40rpx;
		margin-bottom: 16rpx;
		border: 2rpx solid #0A66C2;
	}
	.cs-main-tip {
		font-size: 26rpx;
		color: #2C3E50;
		margin-bottom: 8rpx;
	}
	.cs-phone-number {
		font-size: 44rpx;
		font-weight: bold;
		color: #0A66C2;
		letter-spacing: 1px;
		margin-bottom: 12rpx;
	}
	.cs-desc-time {
		font-size: 24rpx;
		color: #94A3B8;
		margin-bottom: 30rpx;
	}
	.cs-call-action-btn {
		width: 100%;
		height: 84rpx;
		background: #0A66C2;
		border-radius: 42rpx;
		color: #FFFFFF;
		font-size: 30rpx;
		font-weight: bold;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 6rpx 16rpx rgba(10, 102, 194, 0.35);
	}

	.app-icon-img,
	.official-pay-icon-box {
		width: 44rpx !important;
		height: 44rpx !important;      
		background: transparent !important; 
		border: none !important;           
		border-radius: 0 !important;       
		object-fit: contain;               
		mix-blend-mode: multiply; 
		filter: contrast(1.2);
	}

	.icon-box {
		width: 40rpx !important;
		height: 40rpx !important;
		display: flex !important;
		align-items: center !important;
		justify-content: center !important;
		margin-right: 12rpx !important;
		flex-shrink: 0 !important;
		background: transparent !important;
		border: none !important;
	}

	.icon-box .app-icon-img {
		width: 100% !important;
		height: 100% !important;
		aspect-ratio: 1 / 1 !important;
		object-fit: contain !important;
		background: transparent !important;
		border: none !important;
		border-radius: 0 !important;
		mix-blend-mode: multiply; 
		filter: contrast(1.3);
	}

	.modal-face-icon-box,
	[class*="modal-face-icon"],
	[class*="pay-icon-box"] {
		width: 40rpx !important;
		height: 40rpx !important;
		display: flex !important;
		align-items: center !important;
		justify-content: center !important;
		background: transparent !important;
		border: none !important;
		border-radius: 0 !important;
		margin-right: 12rpx !important;
		overflow: hidden !important;
	}
</style>