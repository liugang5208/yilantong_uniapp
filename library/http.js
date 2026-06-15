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
						util.toast("登录状态已经失效")
						reject()
					}
					if(res.data.status!=1){
						util.toast(res.data.msg)
						reject()
					}
					resolve(res.data)
					
				},
				fail: (err) => {
					reject(err)
				},
				complete: () => {
					
				}
				
			})

		})
	}

	get(url, data = {}) {
		return this.request(url, {
			method: "GET",
			data
		});
	}
	post(url, data = {}) {
		return this.request(url, {
			method: "POST",
			data
		});
	}
}

export default new Http($publicConfig.server);
