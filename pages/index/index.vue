<template>
	<view>
		<view class="u-page">
			<home v-show="pathName=='home'"></home>
			<cart v-if="pathName=='cart'"></cart>
			<my v-if="pathName=='my'"></my>
			<pack v-if="pathName=='pack'"></pack>

			<report v-show="pathName=='report'"></report>
			<trans v-if="pathName=='trans'"></trans>
		</view>
		<!-- 与包裹页面所有内容的元素u-page同级，且在它的下方 -->
		<u-tabbar @change="change" height="60px" v-model="current" active-color="#2196f3" :list="list" :hide-tab-bar="false" :mid-button="false"></u-tabbar>
	</view>
</template>


<script>
	import uTabbar from '../../components/u-tabbar/u-tabbar.vue'
	import home from '../home/home.vue'
	import cart from '../cart/cart.vue'
	import my from '../my/my.vue'
	import pack from '../pack/pack.vue'
	import report from '../report/report.vue'
	import trans from '../trans/trans.vue'
	import transNvue from '../trans/trans_nvue.nvue'
	var wv; //计划创建的webview
	export default {
		components: {
			uTabbar,
			home,
			cart,
			my,
			pack,
			report,
			trans,
			transNvue
		},
		data() {
			return {
				title: 'Hello',
				list: [],
				current: 0,
				pathName: 'home',
			}
		},
		onBackPress(options) {
			// 显示确认对话框
			uni.showModal({
				title: '退出应用',
				content: '确定要退出应用吗？',
				success: function(res) {
					if (res.confirm) {
						// 用户点击了确定按钮，退出应用
						plus.runtime.quit();
					} else if (res.cancel) {
						// 用户点击了取消按钮，不执行任何操作
						console.log('用户点击取消');
					}
				}
			});
			return true; // 阻止默认的返回行为，直到用户做出选择
		},
		async onLoad(option) {
			let res = await this.$api.getBarList({new:1})
			res.data.forEach(item => {
				item.iconPath = "/static/images/tabBar/icon_tab_" + item.label + ".png"
				item.selectedIconPath = "/static/images/tabBar/icon_tab_" + item.label + "_pre.png"
				item.text = item.title
				item.customIcon = false
			})
			this.list = res.data
			this.list.push({
				"iconPath": "/static/images/tabBar/icon_tab_my.png",
				"selectedIconPath": "/static/images/tabBar/icon_tab_my_pre.png",
				"text": "我的",
				customIcon: false,
			})
			this.pathName = option.type ? option.type : 'home'
			this.current = this.list.findIndex(item => item.label == this.pathName)


			uni.getSystemInfo({
				success: (res) => {
					this.windowHeight = res.windowHeight
					console.log(res.windowHeight); // 使用 windowHeight 属性获取屏幕高度
				}
			});


		},
		methods: {
			change(e, item) {
				console.log(this.list.length);
				console.log(e);
				if (e == this.list.length - 1) {
					this.pathName = 'my'
				} else {
					this.pathName = item.label
				}
				// if (this.pathName == "trans") {
				// 	console.log(1111)
				// 	// #ifdef APP-PLUS
				// 	wv = plus.webview.create("", "custom-webview", {
				// 		plusrequire: "none", //禁止远程网页使用plus的API，有些使用mui制作的网页可能会监听plus.key，造成关闭页面混乱，可以通过这种方式禁止
				// 		'uni-app': 'none', //不加载uni-app渲染层框架，避免样式冲突
				// 		top: uni.getSystemInfoSync().statusBarHeight + 44 //放置在titleNView下方。如果还想在webview上方加个地址栏的什么的，可以继续降低TOP值
				// 	})
				// 	wv.loadURL("https://www.baidu.com")
				// 	var currentWebview = this.$scope.$getAppWebview(); //此对象相当于html5plus里的plus.webview.currentWebview()。在uni-app里vue页面直接使用plus.webview.currentWebview()无效
				// 	currentWebview.append(wv); //一定要append到当前的页面里！！！才能跟随当前页面一起做动画，一起关闭
				// 	wv.setStyle({
				// 		top: 0,
				// 		height: this.windowHeight - 100
				// 	})
				// 	// #endif
				// } else {
				// 	// #ifdef APP-PLUS
				// 	if (wv) {
				// 		wv.close('none'); // 'none' 立即关闭 webview，不显示动画
				// 		wv = null;
				// 	}
				// 	// #endif
				// }
			}
		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
</style>