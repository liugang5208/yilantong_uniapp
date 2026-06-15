<template>
	<view class="wrap">
		<u-navbar :is-back="false" title="">
			<view class="d_a_sb " style="width: 750rpx;">
				 <view style="width: 200rpx; visibility: hidden;">占位</view>
				    <view style="font-size: 30rpx; color: #000; font-weight: bold; text-align: center; flex-grow: 1;">报价单</view>
				    <view  style="width: 200rpx;;visibility: hidden;">清空购物车</view>
			</view>
		</u-navbar>
		
		 <view class="d_a_sa" style="flex-wrap: wrap;margin-top: 100rpx;flex-direction: column">
		
		    <view class="d_a btn" @click="baojidan()" style="background-color: #488aff">
		      <image src="/static/imgs/baojiadan.png" style="width: 50rpx;height: 40rpx" />
		      <span style="margin-left: 20rpx;">查看报价单</span>
		    </view>
		
		    <view class="d_a btn" @click="gotoReportLis()" style="background-color: #e13838">
		      <image src="/static/imgs/lsbaojiadan.png" style="width: 50rpx;height: 40rpx" />
		      <span style="margin-left: 20rpx;">历史报价单</span>
		    </view>
		
		    <view class="d_a btn" @click="goManageTableLogo()" style="background-color: #488aff">
		      <image src="/static/imgs/btLogo.png" style="width: 50rpx;height: 40rpx"/>
		      <span style="margin-left: 20rpx;">管理表头logo图标</span>
		    </view>
		
		    <view class="d_a btn" @click="goNoteInformation()" style="background-color: #e13838">
		      <image src="/static/imgs/bzxx.png" style="width: 50rpx;height: 40rpx" />
		      <span style="margin-left: 20rpx;">备注信息模板录入</span>
		    </view>
		
		
		  </view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: 'Hello',
				

			}
		},
		async onLoad() {
			
		},
		methods: {
          baojidan(){
			  uni.navigateTo({
			  	url:"/pages/report/repinfos"
			  })
		  },
		  gotoReportLis(){
			  uni.navigateTo({
			  	url:'/pages/report/repindex'
			  })
		  },
		  goManageTableLogo(){
			  uni.navigateTo({
			  	url:'/pages/report/manageTableLogo'
			  })
		  },
		  goNoteInformation(){
			  uni.navigateTo({
			  	url:'/pages/report/noteInformation'
			  })
		  }
		}
	}
</script>

<style scoped lang="scss">
	
	.btn{
	    border-radius: 60rpx;
	    background-color: red;
	    height: 10vw;
	    width: 80%;
	    padding: 2vw;
	    font-weight: 700;
	    color: #ffffff;
	    margin-bottom: 4vw;
	  }
	.wrap {
		display: flex;
		flex-direction: column;
		width: 100%;
	}
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