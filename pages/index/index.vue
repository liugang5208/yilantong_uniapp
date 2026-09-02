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
		<!-- 底部导航栏组件 -->
		<u-tabbar @change="change" height="66px" v-model="current" active-color="#2C75FF" :list="list" :hide-tab-bar="false" :mid-button="false"></u-tabbar>
		
		<!-- 自定义美观的退出提示弹窗（替代原生丑陋弹窗） -->
		<u-modal v-model="showExitModal" title="提示" :content="exitContent" :show-cancel-button="true" confirm-text="确定" cancel-text="取消" @confirm="confirmExit" @cancel="cancelExit"></u-modal>
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
				showExitModal: false, // 控制自定义退出弹窗的显示
				exitContent: '确定要退出应用吗？'
			}
		},
		onBackPress(options) {
			// 1. 如果当前不是首页（比如在购物车、我的等页面），侧滑或按返回时：直接拦截，安安静静留在当页，绝不退出、绝不乱跳
			if (this.pathName !== 'home') {
				return true; 
			}
			
			// 2. 只有当处于首页时，才弹出自定义的美观退出提示框
			if (!this.showExitModal) {
				this.showExitModal = true;
				return true; // 拦截默认的直接返回/退出行为
			}
			
			return true;
		},
		methods: {
			// 点击退出弹窗的“确定”
			confirmExit() {
				plus.runtime.quit();
			},
			// 点击退出弹窗的“取消”
			cancelExit() {
				this.showExitModal = false;
			},
			change(e, item) {
				if (e == this.list.length - 1) {
					this.pathName = 'my';
				} else {
					this.pathName = item.label;
				}
			}
		},
		async onLoad(option) {
			let res = await this.$api.getBarList({new:1})
			
			// Base64 转换函数
			const toBase64 = (svgStr) => {
				return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgStr)));
			};

			// 1. 线缆图标
			const svgCable = (color, scale = 0.85, transXY = 90) => `<svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="800" height="800"><g transform="scale(${scale}) translate(${transXY}, ${transXY})"><path d="M512 0c282.784 0 512 229.216 512 512s-229.216 512-512 512-512-229.216-512-512 229.248-512 512-512z m0 155.136c-197.088 0-356.832 159.776-356.832 356.864s159.744 356.864 356.832 356.864 356.864-159.776 356.864-356.864-159.776-356.864-356.864-356.864 z m-7.808 516.896a80 80 0 1 1 0 160 80 80 0 0 1 0-160 z m160-64a80 80 0 1 1 0 160 80 80 0 1 1 0-160 z m-320 0a80 80 0 1 1 0 160 80 80 0 1 1 0-160 z m160-192a112 112 0 1 1 0 224 112 112 0 0 1 0-224 z m224 32a80 80 0 1 1 0 160 80 80 0 1 1 0-160 z m-448 0a80 80 0 1 1 0 160 80 80 0 1 1 0-160 z m384-160a80 80 0 1 1 0 160 80 80 0 0 1 0-160 z m-320 0a80 80 0 1 1 0 160 80 80 0 1 1 0-160 z m160-64a80 80 0 1 1 0 160 80 80 0 0 1 0-160 z" fill="${color}"></path></g></svg>`;
			
			// 2. 配套图标
			const svgPack = (color, scale = 0.92, transXY = 40) => `<svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="800" height="800"><g transform="scale(${scale}) translate(${transXY}, ${transXY})"><path d="M512 960a448 448 0 1 1 448-448 448 448 0 0 1-448 448z m26.347826-263.373913a52.695652 52.695652 0 0 0 52.695652 52.695652h105.391305a52.695652 52.695652 0 0 0 52.695652-52.695652V593.391304a52.695652 52.695652 0 0 0-52.695652-52.695652H591.043478a52.695652 52.695652 0 0 0-52.695652 52.695652z m-52.695652-368.869565a52.695652 52.695652 0 0 0-52.695652-52.695652H330.434783a52.695652 52.695652 0 0 0-52.695653 52.695652v105.391305a52.695652 52.695652 0 0 0 52.695653 52.695652h105.391304a52.695652 52.695652 0 0 0 52.695652-52.695652z m0 263.373913a52.695652 52.695652 0 0 0-52.695652-52.695652H330.434783a52.695652 52.695652 0 0 0-52.695653 52.695653v105.391304a52.695652 52.695652 0 0 0 52.695653 52.695652h105.391304a52.695652 52.695652 0 0 0 52.695652-52.695652z m273.46087-249.73913l-77.182609-77.182609a54.565217 54.565217 0 0 0-77.182608 0L473.113043 322.782609a54.565217 54.565217 0 0 0 0 77.182608l77.182609 77.182609a54.565217 54.565217 0 0 0 77.182608 0l77.182609-77.182609a54.565217 54.565217 0 0 0 0-77.217392z" fill="${color}"></path></g></svg>`;

			// 3. 物流图标
			const svgTrans = (color, scale = 1.0, transXY = 0) => `<svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="800" height="800"><g transform="scale(${scale}) translate(${transXY}, ${transXY})"><path d="M516.096 306.176h-10.24c-34.816 1.536-64.512 22.016-79.872 53.76-15.872 33.28-12.8 71.168 8.704 100.864l76.288 104.96L587.264 460.8c21.504-29.696 25.088-67.584 8.704-100.864-15.36-31.744-45.056-51.712-79.872-53.76z" fill="${color}"></path><path d="M510.976 103.936c-226.304 0-409.6 183.296-409.6 409.6s183.296 409.6 409.6 409.6 409.6-183.296 409.6-409.6-183.296-409.6-409.6-409.6zM660.48 681.472c-24.576 61.44-83.456 100.864-149.504 100.864-63.488 0-121.344-37.888-147.456-95.744-6.656-15.36 0-33.792 15.36-40.448 15.36-6.656 33.792 0 40.448 15.36 16.384 36.864 51.2 59.392 91.136 59.392 40.96 0 77.312-24.576 92.672-62.464 6.144-15.872 24.064-23.552 39.936-16.896 15.872 6.144 23.552 24.064 17.408 39.936z m-23.552-184.32l-101.376 139.264c-5.632 8.192-14.848 12.8-25.088 12.8s-18.944-4.608-25.088-12.8L385.024 497.152c-34.816-47.616-40.448-110.08-14.848-163.84 25.088-52.736 74.752-86.016 132.608-88.576 5.632-0.512 11.264-0.512 16.384 0 57.856 3.072 107.008 35.84 132.608 88.576 25.6 53.76 19.968 116.224-14.848 163.84z" fill="${color}"></path></g></svg>`;

			// 4. 购物车图标
			const svgCart = (color, scale = 0.92, transXY = 40) => `<svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="800" height="800"><g transform="scale(${scale}) translate(${transXY}, ${transXY})"><path d="M529.78217 48.576307c-246.72 0-446.726246 200.000102-446.726246 446.709965 0 246.709965 200.006246 446.708941 446.726246 446.708941 246.721024 0 446.72727-199.999078 446.72727-446.708941C976.50944 248.577434 776.503296 48.576307 529.78217 48.576307zM408.385536 724.046438c-18.950349 0-34.317005-15.361843-34.317005-34.314547 0-18.95465 15.366554-34.317619 34.317005-34.317619 18.954445 0 34.317005 15.362867 34.317005 34.317619C442.703462 708.684595 427.339981 724.046438 408.385536 724.046438zM618.101248 733.695181c-26.059571 0-47.186534-21.126144-47.186534-47.185715 0-26.058445 21.12809-47.180595 47.186534-47.180595 26.060595 0 47.18551 21.123072 47.18551 47.180595C665.286758 712.569037 644.160819 733.695181 618.101248 733.695181zM827.649126 316.21591c0 13.335757-11.555635 24.146944-25.809818 24.146944l-81.197557 0-92.148429 261.262336c-3.498803 10.746778-13.894042 17.305088-24.741478 16.469094-0.674406 0.052224-1.354957 0.101274-2.046669 0.101274L354.153156 618.195558c-13.877658 0-25.126298-10.814259-25.126298-24.148992l0-7.469112c0-13.334733 11.24864-24.150016 25.126298-24.150016l229.050895 0 12.21673-34.625638L312.42409 527.8018c-13.336269 0-24.148992-10.810163-24.148992-24.147968l0-7.467065c0-13.337805 10.812723-24.148992 24.148992-24.148992l302.330807 0c0.109466 0 0.216986 0.016384 0.324403 0.017408l11.920998-33.794662L286.686884 438.26052c-13.338317 0-24.148992-10.811187-24.148992-24.147968l0-7.469112c0-13.335757 10.810675-24.147968 24.148992-24.147968l359.982147 0 28.983296-82.167398c3.146752-9.680486 11.899494-15.965594 21.52919-16.505958 1.252557-0.17705 2.522522-0.296755 3.827302-0.296755l100.829468 0c14.254182 0 25.809818 10.810163 25.809818 24.147968L827.648106 316.215942z" fill="${color}"></path></g></svg>`;

			// 5. 报表/报价单图标
			const svgReport = (color, scale = 0.85, transXY = 90) => `<svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="800" height="800"><g transform="scale(${scale}) translate(${transXY}, ${transXY})"><path d="M512 512m-512 0a512 512 0 1 0 1024 0 512 512 0 1 0-1024 0Z" fill="${color}"></path><path d="M671.507692 196.923077a94.523077 94.523077 0 0 1 94.523077 94.523077v267.657846a185.422769 185.422769 0 0 0-41.338092-20.763569L724.676923 301.292308a63.015385 63.015385 0 0 0-63.015385-63.015385H332.8a63.015385 63.015385 0 0 0-62.936615 59.864615l-0.07877 3.15077V712.861538a63.015385 63.015385 0 0 0 59.864616 62.936616l3.150769 0.078769h154.340431c5.198769 14.729846 12.224985 28.608985 20.763569 41.3696l-184.950154-0.015754a94.523077 94.523077 0 0 1-94.523077-94.523077V291.446154a94.523077 94.523077 0 0 1 94.523077-94.523077h348.553846zM466.219323 589.792492a20.6848 20.6848 0 0 1 0 41.338093H362.811077a20.6848 20.6848 0 0 1 0-41.338093h103.392492z m103.376739-124.077292a20.6848 20.6848 0 0 1 0 41.353846H362.826831a20.6848 20.6848 0 0 1 0-41.338092h206.769231z m62.038646-124.061538a20.6848 20.6848 0 0 1 0 41.353846H362.811077a20.6848 20.6848 0 0 1 0-41.353846h268.807877z" fill="#FFFFFF"></path><path d="M662.654031 569.107692a144.746338 144.746338 0 1 1 0 289.476923 144.746338 144.746338 0 0 1 0-289.476923z m0 41.353846a103.376738 103.376738 0 1 0 0 206.769231 103.376738 103.376738 0 0 0 0-206.769231z m-22.228677 43.811447l20.621784 36.265353c1.213046 2.237046 2.426092 4.804923 3.623385 7.719385 1.2288 2.914462 2.363077 6.065231 3.465846 9.452308 0.960985-3.339815 2.032246-6.411815 3.182277-9.231754a62.542769 62.542769 0 0 1 3.906954-7.939939l20.795077-36.265353h29.995323l-23.804062 38.171569h20.984124v15.265477h-30.72l-8.900924 14.446277h39.620924v15.265477h-42.06277v48.789661h-25.899323V737.437538h-43.165538v-15.28123h40.613415l-8.979692-14.430523h-31.633723v-15.281231h22.165661l-23.977354-38.155816h30.168616z" fill="#FFFFFF"></path></g></svg>`;

			// 6. “我的”图标
			const svgMy = (color, scale = 0.85, transXY = 90) => `<svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="800" height="800"><g transform="scale(${scale}) translate(${transXY}, ${transXY})"><path d="M512 0c282.784 0 512 229.216 512 512s-229.216 512-512 512-512-229.216-512-512 229.248-512 512-512z" fill="${color}"></path><path d="M512 291.446c-67.435 0-122.154 54.719-122.154 122.154s54.719 122.154 122.154 122.154 122.154-54.719 122.154-122.154-54.719-122.154-122.154-122.154zM512 607.754c-101.465 0-305.385 50.88-305.385 152.64v35.631h610.769v-35.631c0-101.76-203.92-152.64-305.384-152.64z" fill="#FFFFFF"></path></g></svg>`;

			res.data.forEach((item) => {
				let label = item.label || '';
				let svgFunc = svgCable;
				let normalScale = 0.85, normalTrans = 90, selScale = 0.95, selTrans = 25;

				if (label === 'pack') {
					svgFunc = svgPack;
					normalScale = 0.92; normalTrans = 40; selScale = 1.02; selTrans = 0;
				} else if (label === 'trans') {
					svgFunc = svgTrans;
					normalScale = 1.0; normalTrans = 0; selScale = 1.12; selTrans = -50;
				} else if (label === 'cart') {
					svgFunc = svgCart;
					normalScale = 0.92; normalTrans = 40; selScale = 1.02; selTrans = 0;
				} else if (label === 'report') {
					svgFunc = svgReport;
					normalScale = 0.85; normalTrans = 90; selScale = 0.95; selTrans = 25;
				} else {
					svgFunc = svgCable;
					normalScale = 0.85; normalTrans = 90; selScale = 0.95; selTrans = 25;
				}

				item.iconPath = toBase64(svgFunc('#8A9099', normalScale, normalTrans));
				item.selectedIconPath = toBase64(svgFunc('#2C75FF', selScale, selTrans));
				item.text = item.title || item.name || '';
				item.customIcon = false;
			})
			this.list = res.data;
			
			// 追加“我的”图标
			this.list.push({
				"label": "my",
				"iconPath": toBase64(svgMy('#8A9099', 0.85, 90)),
				"selectedIconPath": toBase64(svgMy('#2C75FF', 0.95, 25)),
				"text": "我的",
				"customIcon": false,
			})
			
			this.pathName = option.type ? option.type : 'home';
			this.current = this.list.findIndex(item => item.label == this.pathName);
			if (this.current === -1) this.current = 0;

			uni.getSystemInfo({
				success: (res) => {
					this.windowHeight = res.windowHeight;
				}
			});
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