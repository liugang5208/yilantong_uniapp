<template>
	<view class="wrap custom-class">
		<!-- 顶部独立固定功能区块（吸顶） -->
		<view class="top-header-fixed-wrap">
			<view class="top-header-section">
				<view class="search custom-search-bar">
					<!-- 搜索框舒展释放：将点击事件直接绑在最外层容器，并加最高层级护盾 -->
					<view class="search_input" @click.stop="gotoSearch()">
						<view class="search-inner-box">
							<image src="/static/icon/ic_search.png" class="sh-icon" mode="widthFix" />
							<text class="sh-placeholder">搜索商品</text>
						</view>
						<view class="search-click-shield"></view>
					</view>
					
					<!-- 顶部右侧：极致精简，仅保留一个高级、轻量的AI智能报价胶囊 -->
					<view class="top-right-group">
						<view class="ai-smart-badge d_a_j" @click="gotoAiAssistant()">
							<view class="ai-icon-wrap d_a_j">
								<!-- 将原来的文字替换为你的新图标 -->
								<image class="ai-logo-img" src="/static/ai-logo.png" mode="aspectFill" />
							</view>
							<view class="ai-text-box">
								<text class="ai-title">易缆通Ai助手</text>
							</view>
							<view class="ai-pulse-dot"></view>
						</view>
					</view>
				</view>
			</view>

			<!-- 导航栏标签区块 -->
			<view class="modern-tabs-section">
				<view class="tabs-scroll-wrapper">
					<scroll-view 
						scroll-x="true" 
						class="custom-cat-scroll" 
						:scroll-with-animation="true"
						:scroll-into-view="scrollIntoId">
						<view class="cat-pill-list">
							<view 
								class="cat-pill-item" 
								:class="{ active: current === index }" 
								v-for="(x, index) in cats" 
								:key="x.id || index"
								:id="'cat_item_' + index"
								@click="tabsChange(index)">
								<text class="pill-text">{{ x.name }}</text>
							</view>
						</view>
					</scroll-view>
				</view>
				<view class="quick-drawer-floating-island d_a_j" @click="slideNav()">
					<view class="island-trigger-content d_a_j">
						<image class="tech-matrix-svg-img" src="data:image/svg+xml;utf8,<svg viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg'><path d='M343.04 97.28H230.4c-73.216 0-133.12 59.904-133.12 133.12v112.64c0 73.216 59.904 133.12 133.12 133.12h215.04c16.896 0 30.72-13.824 30.72-30.72V230.4c0-73.216-59.904-133.12-133.12-133.12zM793.6 97.28h-112.64c-73.216 0-133.12 59.904-133.12 133.12v215.04c0 16.896 13.824 30.72 30.72 30.72h215.04c73.216 0 133.12-59.904 133.12-133.12V230.4c0-73.216-59.904-133.12-133.12-133.12zM445.44 547.84H230.4c-73.216 0-133.12 59.904-133.12 133.12v112.64c0 73.216 59.904 133.12 133.12 133.12h112.64c73.216 0 133.12-59.904 133.12-133.12v-215.04c0-16.896-13.824-30.72-30.72-30.72zM793.6 547.84h-215.04c-16.896 0-30.72 13.824-30.72 30.72v215.04c0 73.216 59.904 133.12 133.12 133.12h112.64c73.216 0 133.12-59.904 133.12-133.12v-112.64c0-73.216-59.904-133.12-133.12-133.12z' fill='%230052d9'></path></svg>" mode="widthFix" />
						<text class="island-label">更多</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 轮播与主体内容区域 -->
		<view class="main-swiper-container">
			<swiper circular class="swiper-box" @change="swiperChange" :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish">
				<swiper-item class="swiper-item" v-for="(item, index) in swiperList" :key="item.id">
					<scroll-view 
						v-if="isShow" 
						scroll-y="true" 
						class="page-scroll-view content-fade-in" 
						@scrolltolower="onreachBottom" 
						:show-scrollbar="false" 
						:enhanced="true" 
						:bounces="true"
						:upper-threshold="10"
						:lower-threshold="10">
						<view class="scroll-content-inner">
							<view class="banner-floating-card">
								<u-swiper img-mode="widthFix" :height="350" name="source_url" :list="banner"></u-swiper>
							</view>
							
							<view v-for="(m,index) in list" :key="m.id">
								<view class="ads">
									<image class="ads_image" :src="m.source_url" mode="widthFix" />
								</view>
								<view class="product-grid-section">
									<view :class="m.class || 'product-grid'">
										<!-- 圈出来的商品图标/卡片点击位置 -->
										<view :class="['product-item', s.class]" v-for="(s,index) in m.child" :key='s.id' @click="changeInfo(s)">
											<image class="product-img" :src="s.source_url" mode="widthFix" />
										</view>
									</view>
								</view>
							</view>
							
							<!-- 底部安全距离完美适配 -->
							<view class="bottom-safe-spacer"></view>
						</view>
					</scroll-view>
					
					<view style="height: 100%;width: 100%;" v-if="!isShow">
						<view class="loading_box">
							<view class="loading">
								<span></span>
								<span></span>
								<span></span>
								<span></span>
								<span></span>
							</view>
							<text class="transition-tip">切换精彩内容...</text>
						</view>
					</view>
				</swiper-item>
			</swiper>
		</view>

		<!-- 右侧滑出抽屉 -->
		<view class="modern-drawer-mask" @click="closeNav()" v-if="navi_slide>0"></view>
		<view class="modern-drawer-body" v-if="navi_slide>0">
			<view class="drawer-header">
				<view class="drawer-title-box">
					<view class="drawer-icon-dot"></view>
					<text class="drawer-main-title">快速定位系列</text>
				</view>
				<view class="drawer-close-btn d_a_j" @click="closeNav()">
					<image src="../../static/imgs/cha.png" mode="widthFix" class="close-img"></image>
				</view>
			</view>
			<scroll-view scroll-y="true" class="drawer-scroll-container">
				<view class="drawer-list-wrapper">
					<view 
						class="drawer-item-cell" 
						:class="{ active: x.id == navi }" 
						v-for="(x, i) in cats" 
						:key="x.id || i"
						@click="clickNav(i)">
						<text class="cell-text">{{ x.name }}</text>
						<text class="cell-arrow" v-if="x.id == navi">✦</text>
					</view>
				</view>
			</scroll-view>
		</view>

		<!-- 商务洽谈弹窗 -->
		<view>
			<view class="menu_mask" @click="closeContactModal()" v-if="showContactModal"></view>
			<view class="contact-modal-box" v-if="showContactModal">
				<view class="modal-header">
					<text class="modal-title">商务洽谈与联系</text>
					<image src="../../static/imgs/cha.png" class="modal-close" @click="closeContactModal()" mode="widthFix"></image>
				</view>
				<view class="modal-body">
					<view class="contact-item" @click="makePhoneCall('18883333289')">
						<text class="label">联系电话：</text>
						<text class="value highlight">1888 3333 289</text>
					</view>
					<view class="contact-item">
						<text class="label">微信账号：</text>
						<text class="value">CABLES1988</text>
					</view>
					<view class="contact-item">
						<text class="label">官方网址：</text>
						<text class="value">WWW.ELCCC.CN</text>
					</view>
					<view class="qrcode-section">
						<view class="qrcode-box">
							<image src="/static/imgs/ic_more.png" mode="widthFix" class="qrcode-img" />
							<text class="qrcode-tip">微信扫一扫加好友</text>
						</view>
						<view class="qrcode-box">
							<image src="/static/imgs/ic_more.png" mode="widthFix" class="qrcode-img" />
							<text class="qrcode-tip">扫一扫下载易通线缆APP</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import $publicConfig from 'config/publicConfig.js'
	import uTabs from '../../components/u-tabs/u-tabs.vue'
	import AMap from '../../common/amapWx.js'
	import appUpdate from '@/uni_modules/leruge-app-update/js_sdk/leruge-app-update.js'
	export default {
		components: {
			uTabs,
		},
		data() {
			return {
				lastIndex: 0,
				title: 'Hello',
				list: [],
				label: '成都', 
				navi: '',
				banner: [],
				nav_index: 0,
				navi_slide: 0,
				showContactModal: false, 
				cats: [],
				swiperList: [{
					id: '22'
				}, {
					id: 333
				}, {
					id: 4444
				}],
				current: 0,
				swiperCurrent: 0,
				isTabs: false,
				isShow: true,
				keyword: '',
				latitude: '',
				longitude: '',
				scrollIntoId: '', 
				userInfo: uni.getStorageSync('loginTicket'),
				switchTimer: null
			}
		},
		async created() {
			this.checkArea();
			this.doIninit();
			this.update();
		},
		methods: {
			checkArea(){
				this.$api.checkArea({new:1}).then(res=>{
					if(uni.getStorageSync('loginTicket').id && res.data){
						this.$api.regionAdd({
							uid: uni.getStorageSync('loginTicket').id,
							prov: res.data.prov,
							city: res.data.city,
							label: res.data.label ? res.data.label : ''
						})
						this.label = res.data.label ? res.data.label : res.data.city;
					}
				})
			},
			closeNav() {
				this.navi_slide = 0;
			},
			clickNav(index) {
				this.navi_slide = 0;
				this.tabsChange(index);
				this.scrollIntoId = '';
				this.$nextTick(() => {
					let targetIndex = index > 1 ? index - 1 : 0;
					this.scrollIntoId = 'cat_item_' + targetIndex;
				});
			},
			transData(navData, index) {
				let that = this;
				this.navi = navData.id;
				this.nav_index = index;
				this.navi_slide = 0;
				
				const storageKey = `cache_cat_v2_${navData.id}`;
				
				this.$api.Cats({
					catid: navData.id,
					new: 1,
				}).then(res => {
					if (res && res.data && res.data.cats) {
						let targetCat = res.data.cats.find(item => item.id == navData.id) || res.data.cats[0];
						if (targetCat && targetCat.child) {
							const serverChild = targetCat.child;
							that.banner = serverChild.banner || [];
							that.list = serverChild.list || [];
							that.isShow = true;
							
							uni.setStorageSync(storageKey, {
								child: serverChild,
								updateTime: new Date().getTime()
							});
						} else {
							that.banner = [];
							that.list = [];
							that.isShow = true;
						}
					}
				}).catch(err => {
					console.error('获取分类数据失败', err);
					try {
						const localData = uni.getStorageSync(storageKey);
						if (localData && localData.child) {
							that.banner = localData.child.banner || [];
							that.list = localData.child.list || [];
							that.isShow = true;
						}
					} catch(e) {}
				});
			},
			async doIninit() {
				let ret = await this.$api.Cats({
					catid: this.navi,
					new: 1,
				});
				this.cats = ret.data.cats;
				if(this.cats && this.cats.length > 0) {
					this.transData(this.cats[0], 0);
					this.current = 0;
				}
			},
			tabsChange(index) {
				const mappedIndexList = index % 3;
				this.current = index;
				if (mappedIndexList == this.swiperCurrent) {
					if (mappedIndexList == 0 || mappedIndexList == 1) {
						this.swiperCurrent = mappedIndexList + 1;
					} else if (mappedIndexList == 2) {
						this.swiperCurrent = 0;
					}
				} else {
					this.swiperCurrent = mappedIndexList;
				}
				this.lastIndex = this.swiperCurrent;
				this.isTabs = true;
				this.list = [];
				this.banner = [];
				this.isShow = false;
			},
			transition(e) {},
			animationfinish(e) {
				let current = e.detail.current;
				this.swiperCurrent = current;
				this.isTabs = false;
				setTimeout(() => {
					this.isShow = true;
				}, 150);
			},
			swiperChange(e) {
				if (!this.isTabs) {
					const currentIndex = e.detail.current;
					const itemCount = 3;
					let direction = '';
					if (currentIndex === 0 && this.lastIndex === itemCount - 1) {
						direction = '向左滑动';
					} else if (currentIndex === itemCount - 1 && this.lastIndex === 0) {
						direction = '向右滑动';
					} else if (currentIndex > this.lastIndex) {
						direction = '向左滑动';
					} else {
						direction = '向右滑动';
					}
					this.list = [];
					this.banner = [];
					this.isShow = false;
					this.lastIndex = currentIndex;
					if (direction == '向左滑动') {
						if (this.current < this.cats.length - 1) {
							this.current++;
						} else {
							uni.showToast({
								title: '没有更多分类了，更多需求随时咨询客服',
								icon: 'none',
								duration: 1500
							});
						}
					}
					if (direction == '向右滑动') {
						if (this.current > 0) {
							this.current--;
						}
					}
				}
				
				this.current = this.current;
				this.navi = this.current;
				this.scrollIntoId = 'cat_item_' + this.current;
				this.isShow = false;
				
				if (this.switchTimer) {
					clearTimeout(this.switchTimer);
				}
				
				this.switchTimer = setTimeout(() => {
					if (this.cats && this.cats[this.current]) {
						this.transData(this.cats[this.current], this.current);
					}
				}, 80);
			},
			onreachBottom() {},
			gotoSearch() {
				uni.navigateTo({
					url: '/pages/home/search'
				});
			},
			gotoAiAssistant() {
				uni.navigateTo({
					url: '/pages/ai/ai_assistant',
					success: () => {
						console.log("成功跳转至 AI 智能报价管家页面");
					},
					fail: (err) => {
						console.error("跳转失败", err);
						uni.showToast({
							title: 'AI 智能管家正在初始化...',
							icon: 'none'
						});
					}
				});
			},
			openContactModal() {
				this.showContactModal = true;
			},
			closeContactModal() {
				this.showContactModal = false;
			},
			makePhoneCall(phoneNumber) {
				uni.makePhoneCall({
					phoneNumber: phoneNumber
				});
			},
			// 👇 修改这里：加入手机振动反馈，同时延长延时让大幅度缩放的动效完整展现
			changeInfo(info) {
				if (!info.id) return;
				
				// 1. 触发手机短震动（真机/App 环境下有效）
				uni.vibrateShort({
					success: function () {
						// 振动成功
					}
				});
				
				// 2. 稍微增加一点延时（320毫秒），让用户能清晰感受到大幅度缩放松开后的视觉反馈再跳转
				setTimeout(() => {
					uni.navigateTo({
						url: '/pages/shops/shop_lists?ids=' + info.id + "&type=" + (info.price_type || '')
					});
				}, 320);
			},
			slideNav() {
				this.navi_slide = 1;
			},
			async update() {
				let code = $publicConfig.version;
				let system = '';
				// #ifdef APP-IOS
				system = 2;
				// #endif
				// #ifdef APP-ANDROID
				system = 1;
				// #endif
				
				this.$api.update_version({
					version: code,
					system: system,
					new: 1,
				}).then(res=>{
					if(res.data){
						let updateInfo = {
							platform: system == 1 ? 'android' : 'ios',
							updateContent: res.data.prompt,
							downUrl: res.data.url,
							version: res.data.version,
							force: res.data.is_mandatory == 1 ? false : true,
							mainColor: 'FF5B78',
						};
						appUpdate(updateInfo);
					}
				});
			},
		}
	}
</script>

<style scoped lang="scss">
	.wrap {
		display: flex;
		flex-direction: column;
		height: 100vh;
		width: 100vw;
		background-color: #fcfcfc;
		overflow: hidden;
		position: fixed;
		top: 0;
		left: 0;
		box-sizing: border-box;
		pointer-events: auto !important; 
	}

	.top-header-fixed-wrap {
	    position: absolute;
	    top: var(--status-bar-height);
	    left: 0;
	    width: 100%;
	    z-index: 99999; 
	    background-color: #ffffff;
	    pointer-events: auto !important; 
	    touch-action: manipulation;
	}

	.main-swiper-container {
		position: absolute;
		top: calc(var(--status-bar-height) + 86rpx + 92rpx);
		left: 0;
		width: 100vw;
		bottom: 0;
		overflow: hidden;
		background-color: #fcfcfc;
	}

	.swiper-box {
		height: 100%;
		width: 100%;
	}

	.swiper-item {
		height: 100%;
		width: 100%;
		overflow: hidden;
	}

	.page-scroll-view {
		height: 100%;
		width: 100%;
		box-sizing: border-box;
		-webkit-overflow-scrolling: touch;
	}

	@keyframes contentFadeIn {
		from {
			opacity: 0;
			transform: scale(0.98);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}

	.content-fade-in {
		animation: contentFadeIn 0.28s cubic-bezier(0.16, 1, 0.3, 1) forwards;
	}

	.scroll-content-inner {
		padding-top: 16rpx; 
		padding-bottom: 110rpx; 
	}

	.loading_box {
		padding: 180rpx 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		
		.transition-tip {
			margin-top: 24rpx;
			font-size: 24rpx;
			color: #9aa1a9;
			letter-spacing: 1rpx;
		}
	}

	.loading {
		width: 750rpx;
		height: 20rpx;
		margin: 0 auto;
		text-align: center;
	}

	.loading span {
		display: inline-block;
		width: 20rpx;
		height: 20rpx;
		margin-right: 10rpx;
		background: #0052d9;
		border-radius: 50%;
		-webkit-animation: load 1.04s ease infinite;
	}

	.loading span:last-child {
		margin-right: 0px;
	}

	@-webkit-keyframes load {
		0% { opacity: 1; transform: scale(1); }
		50% { opacity: 0.3; transform: scale(0.8); }
		100% { opacity: 1; transform: scale(1); }
	}

	.loading span:nth-child(1) { -webkit-animation-delay: 0.13s; }
	.loading span:nth-child(2) { -webkit-animation-delay: 0.26s; }
	.loading span:nth-child(3) { -webkit-animation-delay: 0.39s; }
	.loading span:nth-child(4) { -webkit-animation-delay: 0.52s; }
	.loading span:nth-child(5) { -webkit-animation-delay: 0.65s; }

	.top-header-section {
		background: #ffffff;
		padding: 10rpx 16rpx 8rpx 16rpx; 
		box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.03);

		.search {
			background: #ffffff;
			box-sizing: border-box;
			display: flex;
			align-items: center;
			justify-content: space-between; 
			width: 100%;
			gap: 150rpx;
				
			.search_input {
				position: relative;
				cursor: pointer;
				background-color: #f7f8fa;
				border-radius: 34rpx;
				padding: 0 20rpx;
				height: 66rpx;
				flex: 1;
				display: flex;
				align-items: center;
				pointer-events: auto !important;
				z-index: 99999;
				transform: translateZ(0);
				touch-action: manipulation;

				&:active {
					opacity: 0.8;
					transform: scale(0.98);
				}

				.search-inner-box {
					display: flex;
					align-items: center;
					width: 100%;
					pointer-events: none !important;

					.sh-icon {
						width: 28rpx;
						height: 28rpx;
						margin-right: 10rpx;
						opacity: 0.5;
					}

					.sh-placeholder {
						font-size: 25rpx;
						color: #9aa1a9;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
					}
				}

				.search-click-shield {
					position: absolute;
					top: 0;
					left: 0;
					width: 100%;
					height: 100%;
					z-index: 99999;
					background: transparent;
					pointer-events: auto !important;
					transform: translateZ(0);
					touch-action: manipulation;
				}
			}

			.top-right-group {
					display: flex;
					align-items: center;
					flex-shrink: 0;

				.ai-smart-badge {
						position: relative;
						left: -70rpx;        
						height: 66rpx;
						padding: 0 22rpx 0 8rpx;
					border-radius: 33rpx;
					background: linear-gradient(135deg, #f0f4ff 0%, #e6efff 100%);
					border: 1rpx solid rgba(0, 82, 217, 0.2);
					box-shadow: 0 2rpx 8rpx rgba(0, 82, 217, 0.08);
					display: flex;
					align-items: center;
					gap: 10rpx;
					transition: all 0.2s ease;

					&:active {
						transform: scale(0.96);
						background: linear-gradient(135deg, #e2eafc, #d5e3fc);
					}

					.ai-icon-wrap {
											width: 48rpx;
											height: 48rpx;
											border-radius: 50%;
											overflow: hidden; /* 确保图片超出圆形部分被裁剪 */
											box-shadow: 0 2rpx 6rpx rgba(0, 82, 217, 0.3);
											flex-shrink: 0;
											display: flex;
											align-items: center;
											justify-content: center;
					
											.ai-logo-img {
												width: 100%;
												height: 100%;
												display: block;
											}
										}

					.ai-text-box {
						display: flex;
						flex-direction: column;
						justify-content: center;
						white-space: nowrap;

						.ai-title {
							font-size: 25rpx;
							font-weight: 600;
							color: #0040a5;
							letter-spacing: 0.5rpx;
							line-height: 1.2;
						}
					}

					.ai-pulse-dot {
						width: 8rpx;
						height: 8rpx;
						background: #10b981;
						border-radius: 50%;
						box-shadow: 0 0 6rpx #10b981;
						margin-left: 2rpx;
					}
				}
			}
		}
	}

	.modern-tabs-section {
		background: #ffffff;
		display: flex;
		align-items: center;
		height: 92rpx;
		border-bottom: 1rpx solid #f1f3f5;
		position: relative;
		padding: 0 10rpx 0 16rpx;
		box-shadow: 0 6rpx 16rpx rgba(0, 0, 0, 0.03);

		.tabs-scroll-wrapper {
			flex: 1;
			overflow: hidden;
			height: 100%;

			.custom-cat-scroll {
				width: 100%;
				height: 100%;
				white-space: nowrap;

				.cat-pill-list {
					display: inline-flex;
					align-items: center;
					height: 100%;
					gap: 16rpx;
					padding-right: 20rpx;

					.cat-pill-item {
						padding: 0 28rpx;
						height: 60rpx;
						background: #f7f8fa;
						border-radius: 30rpx;
						display: inline-flex;
						align-items: center;
						justify-content: center;
						transition: all 0.25s ease;

						.pill-text {
							font-size: 27rpx;
							color: #4a5568;
							font-weight: 500;
							white-space: nowrap;
						}

						&.active {
							background: linear-gradient(135deg, #0052d9, #0077ff);
							box-shadow: 0 4rpx 12rpx rgba(0, 119, 255, 0.3);

							.pill-text {
								color: #ffffff;
								font-weight: bold;
							}
						}
					}
				}
			}
		}

		.quick-drawer-floating-island {
			width: 96rpx;
			height: 100%;
			flex-shrink: 0;
			background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.85) 25%, #ffffff 100%);
			z-index: 10;
			cursor: pointer;

			.island-trigger-content {
				display: flex;
				align-items: center;
				gap: 6rpx;
				transition: opacity 0.2s;

				&:active {
					opacity: 0.6;
				}

				.tech-matrix-svg {
					width: 32rpx;
					height: 32rpx;
					flex-shrink: 0;
					display: block;
				}

				.island-label {
					font-size: 24rpx;
					color: #4a5568;
					font-weight: 500;
					white-space: nowrap;
				}
			}
		}
	}

	.banner-floating-card {
		margin: 12rpx 16rpx 16rpx 16rpx;
		border-radius: 16rpx;
		overflow: hidden;
		background-color: #ffffff;
		height: 350rpx;
		flex-shrink: 0;
		box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.08), 0 2rpx 6rpx rgba(0, 0, 0, 0.04);

		::v-deep .u-swiper-wrap {
			border-radius: 16rpx;
			overflow: hidden;
			height: 100% !important;
		}
		
		::v-deep image {
			border-radius: 16rpx;
		}
	}

	.product-grid-section {
		padding: 10rpx;
		background-color: #fcfcfc; 
	}

	.product-grid {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
	}

	.product-item {
		background-color: #ffffff; 
		border-radius: 12rpx;
		overflow: hidden; 
		border: none;
		box-shadow: none;
		position: relative;
		flex-shrink: 0;
		min-height: 200rpx;
		/* 动画过渡：使用具有弹性的贝塞尔曲线，时长稍微拉开到 0.3s */
		transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.3s ease;

		.product-img {
			width: 100%;
			height: auto;
			display: block; 
			flex-shrink: 0;
		}

		/* 👇 修改这里：把原本的 scale(0.96) 改为大幅度缩小的 scale(0.85)，点击时整块商品缩得很明显，松手再弹回 */
		&:active {
			transform: scale(0.85);
			opacity: 0.7;
		}
	}

	.modern-drawer-mask {
		background: rgba(0, 0, 0, 0.45);
		backdrop-filter: blur(2px);
		bottom: 0;
		opacity: 1;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		width: 100%;
		z-index: 200;
		transition: all 0.3s ease;
	}

	.modern-drawer-body {
		background: #ffffff;
		border-top-left-radius: 20rpx;
		border-bottom-left-radius: 20rpx;
		top: calc(var(--status-bar-height) + 86rpx + 92rpx);
		bottom: 0;
		position: fixed;
		right: 0;
		width: 50vw;
		z-index: 9999;
		display: flex;
		flex-direction: column;
		box-shadow: -10rpx 0 30rpx rgba(0, 0, 0, 0.12);
		animation: drawerSlideIn 0.28s cubic-bezier(0.16, 1, 0.3, 1);

		.drawer-header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 24rpx 20rpx 18rpx 24rpx;
			border-bottom: 1rpx solid #f1f3f5;

			.drawer-title-box {
				display: flex;
				align-items: center;
				gap: 10rpx;

				.drawer-icon-dot {
					width: 10rpx;
					height: 10rpx;
					background: #0052d9;
					border-radius: 50%;
					box-shadow: 0 0 8rpx rgba(0, 82, 217, 0.5);
					flex-shrink: 0;
				}

				.drawer-main-title {
					font-size: 26rpx;
					font-weight: bold;
					color: #1a202c;
					letter-spacing: 0.5rpx;
					white-space: nowrap;
				}
			}

			.drawer-close-btn {
				width: 40rpx;
				height: 40rpx;
				background: #f1f3f5;
				border-radius: 50%;
				flex-shrink: 0;

				.close-img {
					width: 20rpx;
					height: 20rpx;
					opacity: 0.6;
				}
			}
		}

		.drawer-scroll-container {
			flex: 1;
			height: 0;

			.drawer-list-wrapper {
				padding: 16rpx;
				display: flex;
				flex-direction: column;
				gap: 12rpx;

				.drawer-item-cell {
					display: flex;
					align-items: center;
					justify-content: space-between;
					padding: 0 20rpx;
					height: 76rpx;
					background: #f8fafc;
					border-radius: 12rpx;
					transition: all 0.2s ease;

					.cell-text {
						font-size: 26rpx;
						color: #4a5568;
						font-weight: 500;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}

					.cell-arrow {
						font-size: 22rpx;
						color: #0052d9;
						flex-shrink: 0;
					}

					&.active {
						background: linear-gradient(135deg, rgba(0,82,217,0.08), rgba(0,119,255,0.12));
						border: 1rpx solid rgba(0, 82, 217, 0.3);

						.cell-text {
							color: #0052d9;
							font-weight: bold;
						}
					}

					&:active {
						transform: scale(0.98);
					}
				}
			}
		}
	}

	@keyframes drawerSlideIn {
		from {
			transform: translateX(100%);
		}
		to {
			transform: translateX(0);
		}
	}

	.contact-modal-box {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 85%;
		max-width: 620rpx;
		background: #ffffff;
		border-radius: 24rpx;
		z-index: 205;
		overflow: hidden;
		box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.15);

		.modal-header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 24rpx 32rpx;
			border-bottom: 1rpx solid #edf2f7;
			background: #f8fafc;

			.modal-title {
				font-size: 32rpx;
				font-weight: bold;
				color: #1a202c;
			}

			.modal-close {
				width: 36rpx;
				height: 36rpx;
				opacity: 0.6;
			}
		}

		.modal-body {
			padding: 32rpx;

			.contact-item {
				transition: all 0.2s ease;
				display: flex;
				align-items: center;
				margin-bottom: 24rpx;
				font-size: 28rpx;

				.label {
					color: #718096;
					width: 170rpx;
				}

				.value {
					color: #2d3748;
					font-weight: 500;

					&.highlight {
						color: #e53e3e;
						font-weight: bold;
					}
				}
			}

			.qrcode-section {
				display: flex;
				justify-content: space-between;
				margin-top: 32rpx;
				border-top: 1rpx dashed #e2e8f0;
				padding-top: 24rpx;

				.qrcode-box {
					display: flex;
					flex-direction: column;
					align-items: center;
					flex: 1;

					.qrcode-img {
						width: 180rpx;
						height: 180rpx;
						border-radius: 12rpx;
						border: 1rpx solid #e2e8f0;
						padding: 8rpx;
						background: #fff;
					}

					.qrcode-tip {
						display: block;
						margin-top: 12rpx;
						font-size: 22rpx;
						color: #718096;
						text-align: center;
					}
				}
			}
		}
	}

	.ads {
		width: 100%;
		overflow: hidden; 
		background-color: #f7f8fa; 
		flex-shrink: 0;
		min-height: 100rpx;
	}

	.ads_image {
		width: 100%;
		height: auto;
		display: block; 
		flex-shrink: 0;
	}

	.tech-matrix-svg-img {
		width: 32rpx;
		height: 32rpx;
		flex-shrink: 0;
		display: block;
	}
</style>