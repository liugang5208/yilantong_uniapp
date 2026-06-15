# APP版本更新、IOS更新（跳转IOS store）
> 特别说明，安卓需要添加俩个权限 `android.permission.INSTALL_PACKAGES` 和 `android.permission.REQUEST_INSTALL_PACKAGES`

## 提供方法
1. `appUpdate` app更新，自行判断是否需要更新，需要更新就调用，建议在App.vue中调用，其它地方看自己是否需要

## 参数
|参数名|释义|必填|示例值|
|---|---|---|---|
|platform|ios还是android|Y|android|
|updateContent|更新的内容，`\n`用于换行|Y|修复BUG|
|downUrl|下载地址|Y|安卓是apk地址，ios是appstore地址|
|version|新版本号|N|1.0.1|
|force|强制更新|N|true|
|mainColor|主颜色|N|FF5B78|

## 代码示例
```
<script>
	import appUpdate from '@/uni_modules/leruge-app-update/js_sdk/leruge-app-update.js'
	export default {
		methods: {},
		onLaunch: function() {},
		onShow: function() {
			let updateInfo = {
				platform: 'android',
				updateContent: '更新提示，很不错，很不错，很不错，很不错，很不错，很不错，很不错，很不错，很不错，很不错，很不错，很不错，很不错，很不错，很不错，很不错，很不错，很不错，很不错，很不错，很不错，很不错，很不错，很不错',
				downUrl: 'http://xxxx/hkv.apk',
				version: '1.0.1',
				force: false,
				mainColor: 'FF5B78',
			}
			appUpdate(updateInfo)
		},
		onHide: function() {}
	}
</script>

<style>
	/*每个页面公共css */
</style>
```