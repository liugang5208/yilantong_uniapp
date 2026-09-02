<template>
	<view class="policy-page">
		<!-- 滚动主体区域：直接从内容开始，绝不重复生成多余的导航条 -->
		<scroll-view scroll-y="true" class="policy-scroll">
			<view class="container">
				
				<!-- 顶部高端品牌封面卡片 -->
				<view class="header-card">
					<view class="badge">OFFICIAL STATEMENT</view>
					<text class="main-title">易缆通服务与隐私保护协议</text>
					<view class="meta-row">
						<text class="meta-company">运营主体：四川亚建线缆有限公司</text>
						<text class="meta-date">2026.06 更新</text>
					</view>
				</view>

				<!-- 微卡片化列表正文区域 -->
				<view class="cards-list">
					
					<!-- 模块卡片 1 -->
					<view class="policy-card">
						<view class="card-header-box">
							<text class="num">01</text>
							<text class="card-title">导言与运营主体</text>
						</view>
						<text class="card-desc">
							欢迎使用“易缆通”！本应用由四川亚建线缆有限公司（统一社会信用代码：9151010839922997M）开发与运营。我们深知个人信息对您的重要性，将严格遵守法律法规，全方位保障您的隐私与数据安全。
						</text>
					</view>

					<!-- 模块卡片 2 -->
					<view class="policy-card">
						<view class="card-header-box">
							<text class="num">02</text>
							<text class="card-title">信息收集与使用范围</text>
						</view>
						<text class="card-desc">遵循合法、正当、必要原则，我们仅收集实现商城核心交易及基础服务所必需的信息：</text>
						<view class="sub-list">
							<text class="sub-item">· 账号注册：您主动提供的手机号码及登录凭证。</text>
							<text class="sub-item">· 安全保障：为识别设备异常、保障账号安全所收集的IP地址、设备型号及网络日志。</text>
						</view>
					</view>

					<!-- 模块卡片 3 -->
					<view class="policy-card">
						<view class="card-header-box">
							<text class="num">03</text>
							<text class="card-title">系统权限与设备访问说明</text>
						</view>
						<text class="card-desc">为提供完整服务，我们在您明确授权后方会调用系统硬件权限，绝不私自滥用：</text>
						<view class="sub-list">
							<text class="sub-item">· 相机权限：用于扫码登录、扫码识别商品或上传相关资质凭证。</text>
							<text class="sub-item">· 相册权限：用于选取本地图片更新头像或提交资料。</text>
							<text class="sub-item">· 定位权限：用于智能匹配周边仓储与物流配送服务。</text>
						</view>
					</view>

					<!-- 模块卡片 4 -->
					<view class="policy-card">
						<view class="card-header-box">
							<text class="num">04</text>
							<text class="card-title">信息安全与第三方服务</text>
						</view>
						<text class="card-desc">
							我们采用业界领先的加密技术妥善存储您的数据。为保障业务顺畅（如支付与消息推送），应用内可能包含经严格合规评估的第三方 SDK。我们绝不会向无关第三方出售或非法共享您的个人隐私。
						</text>
					</view>

					<!-- 模块卡片 5 -->
					<view class="policy-card">
						<view class="card-header-box">
							<text class="num">05</text>
							<text class="card-title">您的权利与账号注销</text>
						</view>
						<text class="card-desc">
							您依法享有查阅、更正、删除个人信息及撤回授权的权利。若您决定不再使用本服务，可随时通过 App 内【设置 - 账号安全 - 注销账号】自主发起注销，注销后我们将依法彻底清除或匿名化处理您的相关数据。
						</text>
					</view>

					<!-- 模块卡片 6 -->
					<view class="policy-card">
						<view class="card-header-box">
							<text class="num">06</text>
							<text class="card-title">官方联系与企业信息</text>
						</view>
						<text class="card-desc">如对本政策有任何疑问或合规建议，您可通过以下官方渠道与我们取得联系：</text>
						
						<!-- 内部名片面板 -->
						<view class="info-card-box">
							<view class="info-line"><text class="k">公司全称：</text><text class="v">四川亚建线缆有限公司</text></view>
							<view class="info-line"><text class="k">官方网站：</text><text class="v">https://www.elccc.cn</text></view>
							<view class="info-line"><text class="k">客服邮箱：</text><text class="v">391774002@qq.com</text></view>
							<view class="info-line"><text class="k">公司地址：</text><text class="v">四川省成都市天府新区万安街道</text></view>
							<view class="info-line"><text class="k">联系电话：</text><text class="v">+86 1888 3333 289</text></view>
						</view>
					</view>

				</view>

				<!-- 底部微标版权 -->
				<view class="footer-info">
					<text>© 2026 四川亚建线缆有限公司 版权所有</text>
				</view>

			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {}
		},
		methods: {
			goBack() {
				uni.navigateBack({
					delta: 1
				});
			}
		}
	}
</script>

<style scoped lang="scss">
	.policy-page {
		min-height: 100vh;
		background-color: #f4f6f9;
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
	}

	.policy-scroll {
		flex: 1;
		height: 100vh;
	}

	.container {
		padding: 24rpx 24rpx 60rpx;
		box-sizing: border-box;
	}

	/* 顶部封面卡片 */
	.header-card {
		background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
		border-radius: 28rpx;
		padding: 44rpx 36rpx;
		margin-bottom: 24rpx;
		box-shadow: 0 12rpx 32rpx rgba(15, 23, 42, 0.1);
		color: #ffffff;
		
		.badge {
			display: inline-block;
			font-size: 20rpx;
			font-weight: 700;
			color: #94a3b8;
			background-color: rgba(255, 255, 255, 0.08);
			padding: 4rpx 14rpx;
			border-radius: 6rpx;
			letter-spacing: 2rpx;
			margin-bottom: 16rpx;
		}
		
		.main-title {
			display: block;
			font-size: 38rpx;
			font-weight: bold;
			line-height: 1.4;
			margin-bottom: 20rpx;
			letter-spacing: 0.5rpx;
		}
		
		.meta-row {
			display: flex;
			justify-content: space-between;
			align-items: center;
			font-size: 24rpx;
			color: #94a3b8;
			border-top: 1rpx solid rgba(255, 255, 255, 0.08);
			padding-top: 20rpx;
			
			.meta-company {
				font-weight: 500;
				color: #cbd5e1;
			}
		}
	}

	.cards-list {
		display: flex;
		flex-direction: column;
		gap: 20rpx;
	}

	/* 模块卡片主体 */
	.policy-card {
		background: #ffffff;
		border-radius: 24rpx;
		padding: 36rpx 32rpx;
		box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.02);
		border: 1rpx solid #eef2f6;
		
		.card-header-box {
			display: flex;
			align-items: center;
			background-color: #f8fafc;
			padding: 14rpx 20rpx;
			border-radius: 12rpx;
			margin-bottom: 20rpx;
			border-left: 6rpx solid #2563eb;
			
			.num {
				font-size: 26rpx;
				font-weight: 700;
				color: #2563eb;
				margin-right: 14rpx;
				letter-spacing: 1rpx;
			}
			
			.card-title {
				font-size: 30rpx;
				font-weight: 700;
				color: #1e293b;
				letter-spacing: 0.5rpx;
			}
		}
		
		.card-desc {
			display: block;
			font-size: 28rpx;
			color: #475569;
			line-height: 1.85;
			text-align: left;
		}
		
		.sub-list {
			margin-top: 14rpx;
			
			.sub-item {
				display: block;
				font-size: 28rpx;
				color: #64748b;
				line-height: 1.8;
				margin-top: 8rpx;
				text-align: left;
			}
		}
	}

	/* 内部名片样式面板 */
	.info-card-box {
		margin-top: 20rpx;
		background: #f8fafc;
		border-radius: 16rpx;
		padding: 24rpx;
		border: 1rpx solid #e2e8f0;
		
		.info-line {
			display: flex;
			font-size: 26rpx;
			line-height: 1.8;
			
			.k {
				color: #64748b;
				width: 160rpx;
				flex-shrink: 0;
			}
			
			.v {
				color: #1e293b;
				font-weight: 500;
				word-break: break-all;
			}
		}
	}

	.footer-info {
		text-align: center;
		padding: 48rpx 0 20rpx;
		
		text {
			font-size: 24rpx;
			color: #94a3b8;
			letter-spacing: 1rpx;
		}
	}
</style>