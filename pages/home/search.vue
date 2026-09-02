<template>
	<view class="search-page">
		<!-- 1. 顶部一体化吸顶导航 -->
		<view class="custom-header">
			<view class="header-main">
				<!-- 返回键 -->
				<view class="back-btn" @click="goBack">
					<text class="back-arrow">&lt;</text>
				</view>
				
				<!-- 核心区域：一分为二（左侧电压下拉、右侧大搜索框） -->
				<div class="header-split-wrap">
					<!-- 左侧：电压等级点击弹出下拉长条 -->
					<view class="voltage-dropdown-box" @click="toggleDropdown">
						<text class="picker-text">{{ selectedVoltage || '选择电压' }}</text>
						<text class="picker-arrow" :class="{ 'rotate': showDropdown }">▼</text>
						
						<!-- 展开的下拉长条列表 -->
						<view class="dropdown-list" v-if="showDropdown">
							<view 
								class="dropdown-item" 
								v-for="(item, index) in voltageOptions" 
								:key="index"
								@click.stop="selectVoltage(item)"
							>
								{{ item }}
							</view>
						</view>
					</view>

					<!-- 右侧：放大的搜索输入框 -->
					<view class="search-box-wrap">
						<input 
							type="text" 
							placeholder="输入电缆名称、型号搜索" 
							placeholder-style="color: #94a3b8;" 
							v-model="keys" 
							confirm-type="search"
							@confirm="searchkey"
						/>
						<image mode="widthFix" src="/static/icon/ic_search.png" class="sh" @click="searchkey()" />
					</view>
				</div>
			</view>
		</view>
		
		<!-- 动态占位元素：同步向下扩充，确保列表内容绝不会被遮挡 -->
		<view class="header-placeholder"></view>
		
		<!-- 居中美化后的空状态组件：无商品时在页面正中央显示 -->
		<view class="empty-container" v-if="filteredList.length==0">
			<u-empty text="暂无商品" mode="list"></u-empty>
		</view>
		
		<!-- 2. 四阶段精准分层列表 -->
		<div class="list_pad" v-if="filteredList.length>0">
			<div class="list" v-for="(item,i) in filteredList" :key="i" @click="changeInfo(item)">
				<div class="list_item">
					<image mode="aspectFill" :src="item.imgurl" style="width: 100%;height: 100%;" />
				</div>
				<div class="list_cont">
					
					<!-- 阶段一：电压等级（醒目红色） -->
					<div class="data-row">
						<span class="field-label">电压等级：</span>
						<span class="field-value highlight-red">{{ item.voltage || extractVoltage(item.typr) }}</span>
					</div>

					<!-- 阶段二：产品型号（特别显眼的深蓝色） -->
					<div class="data-row">
						<span class="field-label">产品型号：</span>
						<span class="field-value highlight-deep-blue">{{ item.model || item.typr }}</span>
					</div>

					<!-- 阶段三：产品名称 -->
					<div class="data-row">
						<span class="field-label">产品名称：</span>
						<span class="field-value text-name">{{ item.name }}</span>
					</div>

					<!-- 阶段四：列表商品 / 类别属性 -->
					<div class="data-row">
						<span class="field-label">列表商品：</span>
						<span class="field-value">
							<span class="type-badge" v-if="item.types">
								{{ item.types == '1' ? '多属性商品' : (item.types == '2' ? '列表商品' : (item.types == '3' ? '店铺商品' : '普通商品')) }}
							</span>
						</span>
					</div>

				</div>
			</div>
		</div>

		<!-- 3. 搜索避坑指南提示卡片 -->
		<div class="search_val">
			<div class="tip-title">💡 搜索避坑指南</div>
			<div class="tip-desc">
				因线缆规格重叠，<b>请勿带燃烧前缀（如 <b>ZC-</b> 等）或系统代码</b>。建议直接搜<b>核心主型号</b>（例如：搜<b>“CC-YJV”</b>或<b>“YJV”</b>，不输<b>“ZC-YJV”</b>），或以<b>线缆名称, 用途</b>进行搜索，结果更精准有效！搜索后的页面<b>选择电压等级来筛选</b>，可更快找到<b>对应型号</b>
			</div>
		</div>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				uid: 0,
				keys: "",
				showDropdown: false, // 控制下拉长条的展开与收起
				selectedVoltage: "", // 当前选中的电压等级
				voltageOptions: ['全部', '300V', '500V', '750V', '0.66kV', '1.14kV', '1kV', '3kV', '6kV', '10kV', '15kV', '20kV', '30kV', '35kV'], 
				list: [],
			}
		},
		
		computed: {
			filteredList() {
				return this.list.filter(item => {
					let vStr = item.voltage || this.extractVoltage(item.typr);
					let matchVoltage = !this.selectedVoltage || this.selectedVoltage === '全部' || vStr.includes(this.selectedVoltage);
					return matchVoltage;
				});
			}
		},
		
		async onLoad(options) {
			if (options.keys) {
				this.keys = options.keys;
				this.searchkey();
			}
			// #ifdef APP-PLUS || H5
			uni.hideNavigationBarLoading();
			// #endif
		},
		
		async created() {
			let userInfo = uni.getStorageSync('loginTicket');
			if(userInfo){
				this.uid = userInfo.id;
			}
	    },
		methods: {
			// 返回上一页
			goBack() {
				uni.navigateBack({
					delta: 1
				});
			},
			// 切换下拉菜单显示状态
			toggleDropdown() {
				this.showDropdown = !this.showDropdown;
			},
			// 点击选择某一项电压
			selectVoltage(item) {
				this.selectedVoltage = item === '全部' ? '' : item;
				this.showDropdown = false;
			},
			// 智能提取电压等级
			extractVoltage(str) {
				if (!str) return '常规';
				let parts = str.split('-');
				if (str.includes('kV') || str.includes('V')) {
					return parts[0]; 
				}
				return '常规';
			},
			searchkey() {
				let that = this;
				that.showDropdown = false;
				if ((that.keys == null || that.keys == "") && (!that.selectedVoltage || that.selectedVoltage === '全部')) {
					uni.showToast({
						icon: 'none',
						title: "请输入搜索关键词或选择电压"
					})
					return false;
				}
				let param = {
					keys: that.keys,
					uid: that.uid
				};
				uni.showLoading({
					title: '加载中'
				})
				that.$api.search(param).then(ret => {
					that.list = ret.data || [];
					uni.hideLoading();
				}).catch(err => {
					uni.hideLoading();
				});
			},
			changeInfo(info) {
				let that = this;
				if (info.types == "2") {
					uni.navigateTo({
						url: '/pages/shops/shop_lists?ids=' + info.source_id + "&type=" + info.types
					})
				}
			}
		}
	}
</script>

<style scoped lang="scss">
	.search-page {
		background-color: #f8fafc;
		min-height: 100vh;
		box-sizing: border-box;
		position: relative;
	}

	/* 顶部吸顶导航：加大整体下移距离，并优化阴影和圆润感 */
	.custom-header {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 99999;
		background-color: #ffffff;
		box-shadow: 0 6rpx 24rpx rgba(0, 0, 0, 0.08);
		box-sizing: border-box;
		padding-top: calc(var(--status-bar-height) + 16rpx);
		padding-bottom: 16rpx;
		border-bottom-left-radius: 20rpx;
		border-bottom-right-radius: 20rpx;
	}

	.header-main {
		display: flex;
		align-items: center;
		padding: 0 24rpx;
		height: 100rpx;
		box-sizing: border-box;
	}

	/* 返回按钮美化 */
	.back-btn {
		width: 68rpx;
		height: 68rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 18rpx;
		border-radius: 50%;
		background-color: #f1f5f9;
		flex-shrink: 0;
		box-shadow: inset 0 2rpx 4rpx rgba(0,0,0,0.02);
		
		.back-arrow {
			font-size: 32rpx;
			color: #334155;
			font-weight: bold;
			line-height: 1;
		}
	}

	/* 左右平均分容器 */
	.header-split-wrap {
		display: flex;
		align-items: center;
		flex: 1;
		gap: 16rpx; 
		position: relative;
	}

	/* 左侧电压选择长条框 */
	.voltage-dropdown-box {
		position: relative;
		width: 38%; 
		height: 78rpx;
		background: #f8fafc;
		border: 1.5px solid #e2e8f0;
		border-radius: 16rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 22rpx;
		box-sizing: border-box;
		font-size: 26rpx;
		color: #334155;
		cursor: pointer;
		transition: all 0.2s;

		&:active {
			background-color: #f1f5f9;
		}

		.picker-text {
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			font-weight: 500;
		}

		.picker-arrow {
			font-size: 20rpx;
			color: #64748b;
			transition: transform 0.3s;

			&.rotate {
				transform: rotate(180deg);
			}
		}

		/* 往下展开的长条菜单浮窗 */
		.dropdown-list {
			position: absolute;
			top: 92rpx;
			left: 0;
			right: 0;
			background: #ffffff;
			border: 1px solid #cbd5e1;
			border-radius: 16rpx;
			box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.12);
			z-index: 9999;
			overflow: hidden;

			.dropdown-item {
				padding: 24rpx;
				font-size: 26rpx;
				color: #334155;
				border-bottom: 1px solid #f1f5f9;
				text-align: center;

				&:active {
					background-color: #f1f5f9;
					color: #2563eb;
				}

				&:last-child {
					border-bottom: none;
				}
			}
		}
	}

	/* 右侧：放大的搜索输入框 */
	.search-box-wrap {
		position: relative;
		display: flex;
		align-items: center;
		flex: 1;
	}

	.search-box-wrap input {
		border: 1.5px solid #e2e8f0;
		background: #f8fafc;
		height: 78rpx;
		line-height: 78rpx;
		border-radius: 16rpx;
		padding: 0 70rpx 0 26rpx;
		width: 100%;
		font-size: 26rpx;
		color: #1e293b;
		box-sizing: border-box;
		transition: all 0.3s;
		
		&:focus {
			background: #ffffff;
			border-color: #3b82f6;
			box-shadow: 0 0 0 4rpx rgba(59, 130, 246, 0.15);
		}
	}

	.search-box-wrap .sh {
		right: 22rpx;
		position: absolute;
		width: 36rpx;
		height: 36rpx;
		opacity: 0.6;
		cursor: pointer;
	}

	/* 顶部占位块高度 */
	.header-placeholder {
		height: calc(100rpx + var(--status-bar-height) + 32rpx);
	}

	/* 核心修改：空状态容器（完美绝对居中并深度美化） */
	.empty-container {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -60%);
		width: 100%;
		padding: 0 40rpx;
		box-sizing: border-box;
		display: flex;
		justify-content: center;
		align-items: center;
		pointer-events: auto;
		
		::v-deep .u-empty {
			background: #ffffff;
			padding: 48rpx 64rpx;
			border-radius: 24rpx;
			box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.04);
			border: 1px solid #f1f5f9;
			
			.u-empty__text {
				font-size: 28rpx !important;
				color: #64748b !important;
				margin-top: 20rpx !important;
				font-weight: 500;
			}
		}
	}

	/* 列表卡片样式 */
	.list_pad {
		padding: 24rpx;
		padding-bottom: 220rpx;
	}

	.list {
		background: #ffffff;
		border-radius: 16rpx;
		box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
		display: flex;
		padding: 20rpx;
		margin-bottom: 24rpx;
		align-items: center;
		border-bottom: none; 
	}

	.list_item {
		width: 160rpx;
		height: 160rpx;
		border-radius: 12rpx;
		overflow: hidden;
		flex-shrink: 0;
		background: #f1f5f9;
	}

	.list_cont {
		flex: 1;
		padding-left: 24rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.data-row {
		display: flex;
		align-items: center;
		margin-bottom: 6rpx;
		font-size: 24rpx;
		
		.field-label {
			color: #64748b;
			flex-shrink: 0;
		}
		
		.field-value {
			color: #1e293b;
			word-break: break-all;
		}
		
		.highlight-red {
			font-weight: bold;
			color: #dc2626; 
			font-size: 26rpx;
		}
		
		.highlight-deep-blue {
			font-weight: bold;
			color: #1d4ed8; 
			font-size: 26rpx;
		}
		
		.text-name {
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 1;
			overflow: hidden;
			color: #475569;
		}
	}

	.type-badge {
		background-color: #f0fdf4;
		color: #166534;
		font-size: 20rpx;
		padding: 2rpx 10rpx;
		border-radius: 4rpx;
		display: inline-block;
	}

	.search_val {
		background: #eff6ff;
		border: 1px solid #bfdbfe;
		box-sizing: border-box;
		bottom: 24rpx;
		left: 24rpx;
		right: 24rpx;
		color: #1e40af;
		font-size: 24rpx;
		padding: 16rpx 24rpx;
		border-radius: 12rpx;
		position: fixed;
		box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
		
		.tip-title {
			font-weight: bold;
			font-size: 26rpx;
			margin-bottom: 4rpx;
		}
		
		.tip-desc {
			font-size: 22rpx;
			line-height: 1.4;
			opacity: 0.9;
		}
	}

	.tip-desc {
		b, strong {
			color: #475569 !important; 
			font-weight: bold !important;
		}
	}
</style>
```[cite: 1]