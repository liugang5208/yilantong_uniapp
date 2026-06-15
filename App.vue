<script>
	export default {
		onLaunch: function() {
		    // 获取设备信息
		    
		},
		onShow: function() {
			console.log('App Show')
			// uni.$emit("appOnShow")
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>



<style lang="scss">
	/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
	@import "uview-ui/index.scss";
	html {
	  font-size: 72.5%;
	}
</style>
