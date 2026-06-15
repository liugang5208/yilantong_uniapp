<template>
	<view>
		<div class="search_input">
			<input type="text" placeholder="输入您需要的商品名称" v-model="keys" />
			<image mode="widthFix" src="/static/icon/ic_search.png" class="sh" @click="searchkey()" />
		</div>
		<u-empty text="暂无商品" mode="list" v-if="list.length==0"></u-empty>
		<div class="list_pad">
			<div class="list" v-for="(item,i) in list" :key="i" @click="changeInfo(item)">
				<div class="list_item">
					<image mode="widthFix" :src="item.imgurl" style="width: 100%;height: 100%;" />
				</div>
				<div class="list_cont">
					<p>名称：{{ item.name }}</p>
					<p class="model">型号内容：{{ item.typr }}</p>
					<p>
						类别：{{ item.types == '1' ? '多属性商品' : '' }}{{ item.types == '2' ? '列表商品' : '' }}{{ item.types == '3' ? '店铺' : '' }}</p>
				</div>
			</div>

		</div>
		<div class="search_val">
			<p>搜索功能·温馨提示</p>
			<p>因大部分线缆规格重叠相同，请不要直接搜索线缆的规格，可能搜索不到所需信息 使用搜索时;请以搜索线缆名称或线缆型号或线缆用途进行搜索，结果更直观有效</p>
		</div>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// uid: number = 0;
				// keys: string = "";
				// search: number = 0;
				// list: any;
				// listLength: number = 0;
				uid: 0,
				keys: "",
				search: 0,
				list: [],

			}
		},
		
		async created() {
			let userInfo = uni.getStorageSync('loginTicket');
			if(userInfo){
				console.log(userInfo);
				this.uid = userInfo.id
			}
	    },
		methods: {

			searchkey() {
				let that = this;
				if (that.keys == null || that.keys == "") {
					uni.showToast({
						icon: 'none',
						title: "请输入搜索关键词"
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
					that.list = ret.data;
					that.listLength = ret.data.length;
					uni.hideLoading()
				}).catch(err => {
					uni.hideLoading()

				});
			},
			changeInfo(info) {
				console.log(info);
				let that = this;
				////
				if (info.price_type == "3") {

				}
				if (info.types == "2") {
					uni.navigateTo({
						url: '/pages/shops/shop_lists?ids=' + info.source_id + "&type=" + info.types
					})
				}
				if (info.price_type == "1") {

				}
			}
		}
	}
</script>

<style scoped lang="scss">
	.search_input {
		padding: 24rpx;
		position: relative;
	}

	.search_input input {
		border: 1px solid #f8f8f8;
		background: #f8f8f8;
		height: 64rpx;
		line-height: 64rpx;
		padding: 0rem 16rpx;
		width: 100%;
	}

	.search_input .sh {
		right: 42rpx;
		position: absolute;
		top: 36rpx;
		width: 40rpx;
	}

	.search_key {
		margin-bottom: 60rpx;
		padding: 0rem 24rpx;
	}

	.search_key2 {
		text-align: center;
	}

	.search_key_title {
		font-size: 36rpx;
		font-weight: bold;
		margin-bottom: 40rpx;
		position: relative;
	}

	.search_key_title image {
		margin-top: -6rpx;
		margin-left: 16rpx;
		vertical-align: middle;
		width: 30rpx;
	}

	.search_key_title i {
		color: #999999;
		margin-top: -10rpx;
		position: absolute;
		right: 0rem;
		top: 50%;
	}

	.search_key span {
		background: #f9f9f9;
		color: #666666;
		display: inline-block;
		font-size: 30rpx;
		height: 70rpx;
		line-height: 70rpx;
		margin-right: 24rpx;
		text-align: center;
		width: 150rpx;
	}

	/**************************************************************/
	.list_pad {
		padding-bottom: 240rpx;
	}

	.list {
		box-shadow: 0rem 0rem 10rpx #eeeeee;
		border-bottom: 30rpx solid #eeeeee;
		display: flex;
		padding: 24rpx;
	}

	.list_item {
		flex: 1;
		height: 190rpx;
		overflow: hidden;
	}

	.list_cont {
		flex: 3;
		padding-left: 24rpx;
	}

	.list_cont p {
		font-size: 24rpx;
		margin: 0rem;
	}

	.list_cont p.model {
		color: #1407e0;
	}

	.list_cont p:first-child {
		margin: 1rem 0rem;
	}

	.search_val {
		background: rgb(22, 4, 195);
		box-sizing: border-box;
		bottom: 0;
		color: white;
		font-size: 24rpx;
		padding: 10rpx;
		text-align: center;
		width: 100%;
		position: fixed;
	}
</style>