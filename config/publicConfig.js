module.exports = {
	 //server:'https://app.elccc.cn/Inter/',
	 server:'https://app2.elccc.cn/Inter/',
	 //server:'http://127.0.0.1:8088/Inter/',
	 // 跟 manifest.json 的 versionCode 对齐到 5.0.0 基线；这个字段本身目前没有任何地方
	 // 实际读取（App 版本检测统一改成读真实的 plus.runtime.version 了），保留只是避免留一个
	 // 跟别处版本号完全对不上的旧数字在这里造成误导
	 version:50000,
	}
