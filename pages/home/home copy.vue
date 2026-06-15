<template>
	<view class="wrap custom-class">
		<view class="search d_a_sb">
			<view class="d_a" style="flex: 1;margin-right: 20rpx;">
				<view class="search_loc">
					<image class="search_loc_image" src="/static/icon/ic_loc.png" mode="widthFix" />
					<span>{{label}}</span>
				</view>
				<view class="search_input d_a_sb" @click="gotoSearch()">
					<view style="height: 80rpx;flex: 1;" class="d_a">
						<text>输入产品型号或商品名称</text>
					</view>
					<image src="/static/icon/ic_search.png" class="sh" mode="widthFix" />
				</view>
			</view>
			<view class="search_msg d_a">
				<image src="/static/icon/ic_msg.png" mode="widthFix" @click="gotoMsg()" />
			</view>
		</view>
		<view class="tabs" style="position: relative;">
			<u-tabs ref="uTabs" :list="cats" :current="current" @change="tabsChange" :is-scroll="true" swiperWidth="750"></u-tabs>
			<view class="d_a_j" style="width: 40rpx;height:40rpx;position: absolute;right: -15rpx;top: 20rpx;background-color: #ffffff;z-index: 10;">
				<image @click="slideNav()" style="width: 90%;height: 90%;" src="/static/imgs/ic_more.png" />
			</view>

		</view>
		<swiper circular class="swiper-box" @change="swiperChange" :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish">
			<swiper-item class="swiper-item" v-for="(item, index) in swiperList" :key="item.id">
				<scroll-view v-if="isShow" scroll-y style="height: 100%;width: 100%;" @scrolltolower="onreachBottom">
					<view  style="padding: 20rpx;" >
						<u-swiper img-mode="widthFix" :height="350" name="source_url" :list="banner"></u-swiper>
					</view>
					<view v-for="(m,index) in list" :key="m.id">
						<view class="ads">
							<image class="ads_image" :src="m.source_url" mode="widthFix" />
							<!-- <u-lazy-load height="100"  mode="widthFix"  :image="m.source_url"  ></u-lazy-load> -->
						</view>
						<view class="list_line">
							<view :class="s.class" v-for="(s,index) in  m.child" :key='s.id' @click="changeInfo(s)">
								<image :src="s.source_url" mode="widthFix" />
								<!-- <u-lazy-load height="200" :image="s.source_url"  ></u-lazy-load> -->
							</view>

						</view>
					</view>
				</scroll-view>
				<view style="height: 100%;width: 100%;" v-if="!isShow">
					<view class="loading_box ">
						<view class="loading">
							<span></span>
							<span></span>
							<span></span>
							<span></span>
							<span></span>
						</view>
					</view>
				</view>
			</swiper-item>
		</swiper>


		<!--MASK SLIDE-->
		<view class="menu_mask" @click="closeNav()" v-if="navi_slide>0"></view>
		<view class="menu_body" v-if="navi_slide>0">
			<view class="menu_body_title d_a_j" @click="closeNav()">
				<image src="../../static/imgs/cha.png" style="width: 40rpx;height: 40rpx;" mode=""></image>
				<text style="margin-left: 10rpx;">全部分类</text>
			</view>
			<view :class="x.id==navi?'active':''" class="menu_body_list" v-for="(x,i) in cats" @click="clickNav(i)">{{x.name}}</view>
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

				lastIndex: 0, // 上一次显示的 swiper-item 的索引

				title: 'Hello',
				list: [],
				label: '成都',
				navi: '',
				banner: [],
				nav_index: 0,
				navi_slide: 0,
				cats: [],
				swiperList: [{
					id: '22'
				}, {
					id: 333
				}, {
					id: 4444
				}],
				// 因为内部的滑动机制限制，请将tabs组件和swiper组件的current用不同变量赋值
				current: 0, // tabs组件的current值，表示当前活动的tab选项
				swiperCurrent: 0, // swiper组件的current值，表示当前那个swiper-item是活动的
				isTabs: false,
				isShow: true,
				keyword: '',
				latitude: '',
				longitude: '',
				
				userInfo: uni.getStorageSync('loginTicket'),


			}
		},
		async created() {
			const systemInfo = uni.getSystemInfoSync();
			const statusBarHeight = systemInfo.statusBarHeight;
			console.log('状态栏的高度:', statusBarHeight);
			// this.getLocation()  //华为审核
			this.checkArea()



			this.doIninit()
			
			this.update();
			
		},
		methods: {
			checkArea(){
				this.$api.checkArea({new:1}).then(res=>{
					if(uni.getStorageSync('loginTicket').id){
						this.$api.regionAdd({
							uid:uni.getStorageSync('loginTicket').id,
							prov:res.data.prov,
							city:res.data.city,
							label:res.data.label?res.data.label:''
						})
						this.label=res.data.label?res.data.label:res.data.city
					}
				})
			},
			closeNav() {
				//console.log(event);
				//console.log(this.navi);
				this.navi_slide = 0;
			},
			clickNav(index) {
				console.log(index);
				console.log(index)
				this.navi_slide = 0;
				this.tabsChange(index)


			},
			/**
			 * 执行数据
			 */
			transData(navData, index) {
				let that = this;
				this.navi = navData.id;
				this.nav_index = index;
				this.navi_slide = 0;
				////
				this.banner = navData.child.banner;
				this.list = navData.child.list;
				if (navData.child.banner.length < 1 && navData.child.list.length < 1) {
					return;
				}

			},
			async doIninit() {
				let ret = await this.$api.Cats({
					catid: this.navi,
					new:1,
				})
				this.cats = ret.data.cats;
				this.navi = ret.data.cats[0].id;
				////
				let child = ret.data.cats[0]["child"];
				this.banner = child.banner;
				this.list = child.list;
				this.nav_index = 0;
				this.current = 0
			},
			// tabs通知swiper切换
			tabsChange(index) {
				const mappedIndexList = index % 3;

				this.current = index
				// 为了触发change 
				if (mappedIndexList == this.swiperCurrent) {
					if (mappedIndexList == 0) {
						this.swiperCurrent = mappedIndexList + 1
					} else if (mappedIndexList == 1) {
						this.swiperCurrent = mappedIndexList + 1
					} else if (mappedIndexList == 2) {
						this.swiperCurrent = 0
					}
				} else {
					this.swiperCurrent = mappedIndexList;
				}
				this.lastIndex = this.swiperCurrent;
				this.isTabs = true
				this.list = []
				this.banner = []
				this.isShow = false
				console.log(mappedIndexList + 'tabsChange');
			},
			// swiper-item左右移动，通知tabs的滑块跟随移动
			transition(e) {
				// let dx = e.detail.dx;
				// this.$refs.uTabs.setDx(dx);
			},
			// 由于swiper的内部机制问题，快速切换swiper不会触发dx的连续变化，需要在结束时重置状态
			// swiper滑动结束，分别设置tabs和swiper的状态
			animationfinish(e) {
				let current = e.detail.current;
				// this.$refs.uTabs.setFinishCurrent(current);
				this.swiperCurrent = current;
				this.isTabs = false
				setTimeout(() => {
					this.isShow = true
				}, 100)

				// this.current = current;
			},
			swiperChange(e) {
				if (!this.isTabs) {
					const currentIndex = e.detail.current;
					const itemCount = 3; // swiper-item 的总数
					let direction = '';
					// 判断滑动方向
					if (currentIndex === 0 && this.lastIndex === itemCount - 1) {
						// 特殊情况：从最后一个滑到第一个（循环 swiper）
						direction = '向左滑动';
					} else if (currentIndex === itemCount - 1 && this.lastIndex === 0) {
						// 特殊情况：从第一个滑到最后一个（循环 swiper）
						direction = '向右滑动';
					} else if (currentIndex > this.lastIndex) {
						// 通常情况：索引递增
						direction = '向左滑动';
					} else {
						// 通常情况：索引递减
						direction = '向右滑动';
					}
					console.log(direction); // 输出滑动方向
					this.list = []
					this.banner = []
					this.isShow = false
					// 更新上一个索引
					this.lastIndex = currentIndex;
					if (direction == '向左滑动') {
						if (this.current == this.cats.length - 1) {
							this.current = 0
							this.transData(this.cats[this.current], this.current);

							console.log(this.current);
							return
						}
						if (this.current < this.cats.length - 1) {
							this.current++
						}
					}
					if (direction == '向右滑动') {
						if (this.current == 0) {
							this.current = this.cats.length - 1
							this.transData(this.cats[this.current], this.current);
							return
						}
						if (this.current > 0) {
							this.current--
						}
					}
					console.log(this.current);
				} else {

				}

				this.transData(this.cats[this.current], this.current);




			},
			// scroll-view到底部加载更多
			onreachBottom() {

			},
			getLocation() {
				console.log(111);
				let that =this
				uni.getLocation({
					type: 'wgs84',
					success:  (res)=> {
						console.log('当前位置的经度：' + res.longitude);
						console.log('当前位置的纬度：' + res.latitude);
						const latitude = res.latitude;
						const longitude = res.longitude;
						const amapKey = 'fa3fef17cc0470481e01b9b0eea509a1';
						// 构建请求URL
						const url = `https://restapi.amap.com/v3/geocode/regeo?key=${amapKey}&location=${longitude},${latitude}`;
						// 使用uni.request进行请求
						uni.request({
						    url: url, // 请求的地址
						    method: 'GET', // 请求方法
						    success: (res) => {
						        if (res.statusCode === 200 && res.data && res.data.regeocode) {
									console.log(res.data)
									console.log(11111111);
						            const address = res.data.regeocode.addressComponent.district;
									this.label=address
									if(that.userInfo.id){
										that.$api.regionAdd({
											new:1,
											uid:that.userInfo.id,
											prov:res.data.regeocode.addressComponent.province,
											city:res.data.regeocode.addressComponent.city,
											label:res.data.regeocode.addressComponent.district
										})
									}
									
						        } else {
						            console.error('解析失败:', res.data);
						        }
						    },
						    fail: (err) => {
						        console.error('请求失败:', err);
						    },complete() {
						    	console.log(1123123123);
						    }
						});
					},fail(err) {
						if(that.userInfo.id){
							that.$api.regionAdd({
								uid:that.userInfo.id,
								prov:'四川省',
								city:'成都市',
								label:''
							})
						}
					}
				});
				
			},
			
			gotoMsg() {
				uni.navigateTo({
					url: '/pages/home/msg'
				})
			},
			gotoSearch() {
				uni.navigateTo({
					url: '/pages/home/search'
				})
			},
			changeInfo(info) {
				let that = this;
				////
				if (info.price_type == "3") {

				}
				if (info.price_type == "2") {
					uni.navigateTo({
						url: '/pages/shops/shop_lists?ids=' + info.id + "&type=" + info.price_type
					})
				}
				if (info.price_type == "1") {

				}
			},
			slideNav() {
				let that = this;
				////
				that.navi_slide = 1;
			},
			async update() {
				// let code  = plus.runtime.version;
				let code = $publicConfig.version;
				console.log(111);
				console.log(code);
				let system =''
				// #ifdef APP-IOS
				  system=2
				// #endif
				// #ifdef APP-ANDROID
				 system=1
				// #endif
				
				
				
				 this.$api.update_version({
					version: code,
					system:system,
					new:1,
				}).then(res=>{
					console.log(res);	
					if(res.data){
						let updateInfo = {
							platform:system==1?'android':'ios',
							updateContent: res.data.prompt,
							downUrl: res.data.url,
							version: res.data.version,
							force: res.data.is_mandatory==1?false:true,
							mainColor: 'FF5B78',
						}
						appUpdate(updateInfo)
					}
					
					
				})
				
			},
		}
	}
</script>

<style scoped lang="scss">
	.custom-class {
		padding-top: var(--status-bar-height);
	}

	.loading_box {
		padding: 100rpx 0rem;
	}

	.loading {
		width: 750rpx;
		height: 20rpx;
		margin: 0rem auto;
		text-align: center;
	}

	.loading span {
		display: inline-block;
		width: 20rpx;
		height: 20rpx;
		margin-right: 10rpx;
		background: #c20f22;
		-webkit-animation: load 1.04s ease infinite;
	}

	.loading span:last-child {
		margin-right: 0px;
	}

	@-webkit-keyframes load {
		0% {
			opacity: 1;
		}

		100% {
			opacity: 0;
		}
	}

	.loading span:nth-child(1) {
		-webkit-animation-delay: 0.13s;
	}

	.loading span:nth-child(2) {
		-webkit-animation-delay: 0.26s;
	}

	.loading span:nth-child(3) {
		-webkit-animation-delay: 0.39s;
	}

	.loading span:nth-child(4) {
		-webkit-animation-delay: 0.52s;
	}

	.loading span:nth-child(5) {
		-webkit-animation-delay: 0.65s;
	}

	.wrap {
		display: flex;
		flex-direction: column;
		height: calc(100vh - 60px);
		width: 100%;
	}

	.tabs {
		width: 690rpx;
		margin: 0 auto;
		height: 100rpx;
	}

	.swiper-box {
		flex: 1;
	}

	.swiper-item {
		height: 100%;
	}

	.search {
		background: #f8f8f8;
		box-sizing: border-box;
		padding: 0rem 20rpx;
		display: flex;
		align-items: center;

	}

	.search_loc {
		display: inline-block;
		height: 50rpx;
		padding-right: 1rem;
	}

	.search_loc_image {
		margin-right: 10rpx;
		vertical-align: middle;
		width: 40rpx;
		height: 40rpx;
	}

	.search_input {
		background-color: #ffffff;
		padding-left: 20rpx;
		padding-right: 20rpx;
		flex: 1;
	}

	.search_input image.sh {
		height: 2.1rem;
		width: 2.1rem;
	}

	.search_msg {
		display: flex;
		align-items: center;
		height: 4.4rem;
		text-align: right;
		width: 9%;
	}

	.search_msg image {
		vertical-align: middle;
		width: 2.1rem;
	}

	/** Menu Slides **/
	.menu_scroll {
		height: 4rem;
		padding: 0px;
		overflow: hidden;
		position: sticky;
		top: 0rem;
	}

	.menu_scroll .toolbar-background-ios {
		background: white;
	}

	.menu_scroll ion-slides {
		width: 85%;
	}

	.menu_scroll span {
		border-bottom: 1px solid white;
		display: inline-block;
		font-size: 1.6rem;
		padding: 0.8rem 0rem;
		text-align: center;
	}

	.menu_scroll span.active {
		border-color: #c20f22;
		color: #c20f22;
		font-weight: bold;
	}

	.menu_scroll ion-scroll::-webkit-scrollbar {
		display: none !important;
	}

	.menu_right {
		height: 4.4rem;
		line-height: 4.2rem;
		position: absolute;
		top: 0rem;
		right: 1.2rem;
	}

	.menu_right image {
		vertical-align: middle;
		width: 2.2rem;
	}

	.menu_mask {
		background: black;
		bottom: 0rem;
		opacity: 0.3;
		position: fixed;
		top: 0rem;
		width: 100%;
		z-index: 200;
	}

	.menu_body {
		background: white;
		border-top-left-radius: 1rem;
		border-bottom-left-radius: 1rem;
		bottom: 10%;
		position: fixed;
		top: 10%;
		text-align: center;
		right: 0rem;
		width: 40%;
		z-index: 202;
	}

	.menu_body_title {
		border-bottom: 1px solid #999;
		color: #419afe;
		font-size: 1.5rem;
		height: 4rem;
		line-height: 4rem;
	}

	.menu_body_title .fa {
		color: #c20f22;
	}

	.menu_body_list {
		font-size: 1.3rem;
		height: 4rem;
		line-height: 4rem;
	}

	.menu_body_list.active {
		background: #e5e5e5;
		color: #c20f22;
		font-weight: bold;
	}

	/** Navigation **/
	.navigation {
		display: block;
		font-size: 1.5rem;
	}

	.navigation_item {
		font-size: 1.5rem;
		position: relative;
	}

	.navigation_item.active {
		color: #c20f22;
	}

	.navigation_item.active:after {
		background: #c20f22;
		border-radius: 0.4rem;
		bottom: 0.4rem;
		content: " ";
		display: table;
		left: 50%;
		margin-left: -0.8rem;
		height: 0.4rem;
		position: absolute;
		width: 1.6rem;
	}

	/** lists-slide **/
	.list {
		min-height: 100%;
	}

	.navi_slide {
		border-radius: 0.5rem;
		overflow: hidden;
		padding: 0.85rem 1.2rem;
	}

	.navi_slide_item {
		border-radius: 0.5rem;
		overflow: hidden;
	}

	.navi_slide_item image {
		vertical-align: middle;
		width: 100%;
	}

	.navi_slide .swiper-pagination-bullet {
		background: white;
	}

	.navi_slide .swiper-pagination-bullet-active {
		background: #c20f22;
	}

	.slide-box {
		min-height: 50rem;
	}

	.slide-zoom {
		height: 100%;
	}

	/** ads **/
	.ads {
		width: 100%;
	}

	.ads_image {
		width: 100%;
	}
</style>