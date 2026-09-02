<template>
	<view v-if="show" class="u-tabbar">
		<!-- 悬浮高级感导航栏主体 -->
		<view class="u-tabbar__content safe-area-inset-bottom" :style="{
			height: $u.addUnit(height),
			backgroundColor: bgColor,
		}" :class="{
			'u-border-top': borderTop
		}">
			<view class="u-tabbar__content__item" v-for="(item, index) in list" :key="index" :class="{
				'u-tabbar__content__circle': midButton && item.midButton,
				'is-active': (item.pagePath && (item.pagePath == pageUrl || item.pagePath == '/' + pageUrl)) || (!item.pagePath && index == value)
			}" @tap.stop="clickHandler(index, item)" :style="{
				backgroundColor: bgColor
			}">
				<!-- 图标容器：采用动态尺寸计算，确保选中时图标本身变大，但不挤压上下间距 -->
				<view class="icon-box">
					<u-icon
						:size="((item.pagePath && (item.pagePath == pageUrl || item.pagePath == '/' + pageUrl)) || (!item.pagePath && index == value)) ? (midButton && item.midButton ? midButtonSize : Number(iconSize) + 8) : (midButton && item.midButton ? midButtonSize : iconSize)"
						:name="elIconPath(index)"
						img-mode="scaleToFill"
						:color="elColor(index)"
						:custom-prefix="item.customIcon ? 'custom-icon' : 'uicon'"
					></u-icon>
					<u-badge :count="item.count" :is-dot="item.isDot"
						v-if="item.count || item.isDot"
						:offset="[-4, -10]"
					></u-badge>
				</view>
				<!-- 文字容器：与上方图标保持固定的、充裕的上下安全距离 -->
				<view class="u-tabbar__content__item__text" :style="{
					color: elColor(index)
				}">
					<text class="u-line-1" :class="{ 'active-text': (item.pagePath && (item.pagePath == pageUrl || item.pagePath == '/' + pageUrl)) || (!item.pagePath && index == value) }">{{item.text}}</text>
				</view>
			</view>
			<view v-if="midButton" class="u-tabbar__content__circle__border" :class="{
				'u-border': borderTop,
			}" :style="{
				backgroundColor: bgColor,
				left: midButtonLeft
			}">
			</view>
		</view>
		<!-- 底部防塌陷高度占位符 -->
		<view class="u-fixed-placeholder safe-area-inset-bottom" :style="{
				height: `calc(${$u.addUnit(height)} + ${midButton ? 48 : 0}rpx)`,
			}"></view>
	</view>
</template>

<script>
	export default {
		props: {
			show: {
				type: Boolean,
				default: true
			},
			value: {
				type: [String, Number],
				default: 0
			},
			bgColor: {
				type: String,
				default: '#ffffff'
			},
			height: {
				type: [String, Number],
				default: '72px' // 整体高度充裕
			},
			iconSize: {
				type: [String, Number],
				default: 40 // 基础图标大小
			},
			midButtonSize: {
				type: [String, Number],
				default: 90
			},
			activeColor: {
				type: String,
				default: '#0052d9' // 选中高亮色
			},
			inactiveColor: {
				type: String,
				default: '#8c939d' // 未选中颜色
			},
			midButton: {
				type: Boolean,
				default: false
			},
			list: {
				type: Array,
				default () {
					return []
				}
			},
			beforeSwitch: {
				type: Function,
				default: null
			},
			borderTop: {
				type: Boolean,
				default: false
			},
			hideTabBar: {
				type: Boolean,
				default: true
			},
		},
		data() {
			return {
				midButtonLeft: '50%',
				pageUrl: '',
			}
		},
		created() {
			if(this.hideTabBar) uni.hideTabBar();
			let pages = getCurrentPages();
			this.pageUrl = pages[pages.length - 1].route;
		},
		computed: {
			elIconPath() {
				return (index) => {
					let pagePath = this.list[index].pagePath;
					if(pagePath) {
						if(pagePath == this.pageUrl || pagePath == '/' + this.pageUrl) {
							return this.list[index].selectedIconPath;
						} else {
							return this.list[index].iconPath;
						}
					} else {
						return index == this.value ? this.list[index].selectedIconPath : this.list[index].iconPath
					}
				}
			},
			elColor() {
				return (index) => {
					let pagePath = this.list[index].pagePath;
					if(pagePath) {
						if(pagePath == this.pageUrl || pagePath == '/' + this.pageUrl) return this.activeColor;
						else return this.inactiveColor;
					} else {
						return index == this.value ? this.activeColor : this.inactiveColor;
					}
				}
			}
		},
		mounted() {
			this.midButton && this.getMidButtonLeft();
		},
		methods: {
			async clickHandler(index, item) {
				if(this.beforeSwitch && typeof(this.beforeSwitch) === 'function') {
					let beforeSwitch = this.beforeSwitch.bind(this.$u.$parent.call(this))(index);
					if (!!beforeSwitch && typeof beforeSwitch.then === 'function') {
						await beforeSwitch.then(res => {
							this.switchTab(index, item);
						}).catch(err => {})
					} else if(beforeSwitch === true) {
						this.switchTab(index, item);
					}
				} else {
					this.switchTab(index, item);
				}
			},
			switchTab(index, item) {
				this.$emit('change', index, item);
				if(this.list[index].pagePath) {
					uni.switchTab({
						url: this.list[index].pagePath
					})
				} else {
					this.$emit('input', index);
				}
			},
			getOffsetRight(count, isDot) {
				if(isDot) {
					return -20;
				} else if(count > 9) {
					return -40;
				} else {
					return -30;
				}
			},
			getMidButtonLeft() {
				let windowWidth = this.$u.sys().windowWidth;
				this.midButtonLeft = (windowWidth / 2) + 'px';
			}
		}
	}
</script>

<style scoped lang="scss">
	@import "./style.components.scss";
	.u-fixed-placeholder {
		/* #ifndef APP-NVUE */
		box-sizing: content-box;
		/* #endif */
	}

	.u-tabbar {
		position: relative;
		z-index: 998;

		&__content {
			@include vue-flex;
			align-items: center;
			position: fixed;
			bottom: 0;
			left: 0;
			width: 100%;
			z-index: 998;
			/* #ifndef APP-NVUE */
			box-sizing: content-box;
			/* #endif */
			
			/* 悬浮高级感：顶部圆角 + 厚重悬浮阴影 */
			border-top-left-radius: 32rpx;
			border-top-right-radius: 32rpx;
			box-shadow: 0 -16rpx 45rpx rgba(0, 0, 0, 0.13), 0 -4rpx 12rpx rgba(0, 0, 0, 0.05);
			background-color: #ffffff;

			&__circle__border {
				border-radius: 100%;
				width: 110rpx;
				height: 110rpx;
				top: -48rpx;
				position: absolute;
				z-index: 4;
				background-color: #ffffff;
				left: 50%;
				transform: translateX(-50%);

				&:after {
					border-radius: 100px;
				}
			}

			&__item {
				flex: 1;
				height: 100%;
				@include vue-flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				position: relative;
				gap: 12rpx; /* 强制拉开固定间距，无论选中还是未选中，上下都有舒展的空气感 */

				.icon-box {
					position: relative;
					display: flex;
					align-items: center;
					justify-content: center;
					height: 48rpx; /* 给图标容器锁死固定高度，防止放大时向下侵占文字空间 */
				}

				&__text {
					color: $u-content-color;
					font-size: 22rpx;
					line-height: 1.2;
					text-align: center;
					width: 100%;

					.active-text {
						font-weight: bold; /* 选中时文字加粗 */
					}
				}
			}

			&__circle {
				position: relative;
				@include vue-flex;
				flex-direction: column;
				justify-content: space-between;
				z-index: 10;
				/* #ifndef APP-NVUE */
				height: calc(100% - 1px);
				/* #endif */

				&__button {
					width: 90rpx;
					height: 90rpx;
					border-radius: 100%;
					@include vue-flex;
					justify-content: center;
					align-items: center;
					position: absolute;
					background-color: #ffffff;
					top: -40rpx;
					left: 50%;
					z-index: 6;
					transform: translateX(-50%);
				}
			}
		}
	}
</style>