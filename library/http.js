import * as util from './utils.js'
import $publicConfig from 'config/publicConfig.js'

class Http {
	constructor(base_url = '') {
		this._baseUrl = base_url;
	}
	request(url, option = {}) {
		const app = getApp()
		let that = this;
		return new Promise((resolve, reject) => {
			let data = option.data
			let header ={} ;
				header["content-type"]="application/json",
			uni.request({
				url: that._baseUrl + url,
				method: option.method,
				data: option.data,
				header:header,		
				success: (res) => {
					if(res.data.data==4044){
						uni.setStorageSync("loginTicket", null);
						// 默认关闭全局失效弹窗，防止意外弹出黑框
						// util.toast("登录状态已经失效")
						reject()
					}
					if(res.data.status!=1){
						// 核心修改：默认不再这里强行弹黑框！
						// 只有当你在调用接口时显式传了 showToast: true，它才会弹提示。
						if (option.showToast) {
							util.toast(res.data.msg);
						}
						reject(res.data)
					} else {
						resolve(res.data)
					}
					
				},
				fail: (err) => {
					reject(err)
				},
				complete: () => {
					
				}
				
			})

		})
	}

	get(url, data = {}, showToast = false) {
		return this.request(url, {
			method: "GET",
			data,
			showToast
		});
	}
	post(url, data = {}, showToast = false) {
		return this.request(url, {
			method: "POST",
			data,
			showToast
		});
	}
}

export default new Http($publicConfig.server);