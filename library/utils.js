// 验证手机号


import api from './api.js';
import $publicConfig from 'config/publicConfig.js'



export function checkTel(tel) {
	// console.log(this);
	let reg = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/
	if (!reg.test(tel)) {
		this.toast({
			title: '手机号码有误，请重填',
			icon: "none"
		})
		return false
	} else {
		// 验证通过
		return true
	}
}
/**
 * 构造树型结构数据
 * @param {*} data 数据源
 * @param {*} id id字段 默认 'id'
 * @param {*} parentId 父节点字段 默认 'parentId'
 * @param {*} children 孩子节点字段 默认 'children'
 */
export function handleTree(data, id, parentId, children) {
	let config = {
		id: id || 'id',
		parentId: parentId || 'parentId',
		childrenList: children || 'children'
	};

	var childrenListMap = {};
	var nodeIds = {};
	var tree = [];

	for (let d of data) {
		let parentId = d[config.parentId];
		if (childrenListMap[parentId] == null) {
			childrenListMap[parentId] = [];
		}
		nodeIds[d[config.id]] = d;
		childrenListMap[parentId].push(d);
	}

	for (let d of data) {
		let parentId = d[config.parentId];
		if (nodeIds[parentId] == null) {
			tree.push(d);
		}
	}

	for (let t of tree) {
		adaptToChildrenList(t);
	}

	function adaptToChildrenList(o) {
		if (childrenListMap[o[config.id]] !== null) {
			o[config.childrenList] = childrenListMap[o[config.id]];
		}
		if (o[config.childrenList]) {
			for (let c of o[config.childrenList]) {
				adaptToChildrenList(c);
			}
		}
	}
	console.log(tree);
	return tree;
}

export function permission(permissionID) {
	let _permissionID = 'android.permission.' + permissionID;
	return new Promise((resolve, reject) => {
		plus.android.checkPermission(_permissionID,
			granted => {
				if (granted.checkResult == -1) {
					//还未授权当前查询的权限，打开权限申请目的自定义弹框
					resolve(false)
				} else {
					resolve(true)
				}
			},
			error => {
				resolve(false)
			}
		);
	})
}

export function requestPermissions(permissionID) {
	let _permissionID = 'android.permission.' + permissionID;
	return new Promise((resolve, reject) => {
		plus.android.requestPermissions([_permissionID],
			(e) => {
				if (e.granted.length > 0) {
					//当前查询权限已授权，此时可以通知页面执行接下来的操作
					resolve(true)
				}
				if (e.deniedAlways.length > 0) {
					//当前查询权限已被永久禁用，此时需要引导用户跳转手机系统设置去开启
					resolve(false)
				}
			})
	})
}



export function goSetting() {
	var UIApplication = plus.ios.import("UIApplication");
	var application2 = UIApplication.sharedApplication();
	var NSURL2 = plus.ios.import("NSURL");
	var setting2 = NSURL2.URLWithString("app-settings:");
	application2.openURL(setting2);
	plus.ios.deleteObject(setting2);
	plus.ios.deleteObject(NSURL2);
	plus.ios.deleteObject(application2);
}





export function toast(title, icon, image, mask) {
	return new Promise((resolve, reject) => {
		uni.showToast({
			title,
			icon: icon || 'none',
			image: image || '',
			mask: mask ? mask : false,
			success: (res) => {
				res.errMsg === 'showToast:ok' ? resolve(true) : resolve(false)

			}
		})
	})
}

//图片压缩
export function compressImage(path) {
	return new Promise((resolve, reject) => {
		uni.compressImage({
			src: path,
			quality: 80,
			success: res => {
				resolve(res.tempFilePath)
			}
		})
	})
}

//  页面跳转
export function linkTo(name, params) {
	let url = `../${name}/${name}`;
	if (typeof params == 'object') {
		let str = '?';
		let paramsArr = [];
		for (let k in params) {
			let temp = `${k}=${params[k]}`;
			paramsArr.push(temp)
		};

		str = str + paramsArr.join('&');
		url = url + str;
	}
	uni.reLaunch({
		url: url
	})
}

export const regExpObj = {
	//匹配有没有中文
	regExpZh: (str) => {
		return RegExp(/[\u4e00-\u9fa5]+/).test(str)
	},
	//只允许中文
	onlyregExpZh: (str) => {
		return RegExp(/^[\u4e00-\u9fa5]+$/).test(str)
	},
	//只允许中文，英文字母，数字
	regExpZhEnNum: (str) => {
		return RegExp(/^[\u4e00-\u9fa5A-Za-z0-9]+$/).test(str)
	},
	//匹配身份证
	regExpIDCard: (str) => {
		return RegExp(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/).test(str);
	},
	//匹配手机号
	regExpPhone: (str) => {
		return RegExp(/^1[3456789]\d{9}$/).test(str);
	},
	//匹配邮箱格式
	regExpEmail: (str) => {
		return RegExp(/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/).test(str);
	},
	//匹配域名
	regExpRealmName: (str) => {
		return RegExp(/[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\/.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\/.?/).test(str)
	},
	//匹配InternetURL
	regExpInternetURL: (str) => {
		return RegExp(/http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/).test(str)
	},
	//匹配密码（密码(以字母开头，长度在6~18之间，只能包含字母、数字和下划线)）
	regExpPwd: (str) => {
		return RegExp(/^[a-zA-Z]\w{5,17}$/).test(str)
	},
	//日期格式  2019-01-12
	regExpDate: (str) => {
		return RegExp(/^\d{4}-\d{1,2}-\d{1,2}/).test(str)
	},
	//匹配空白行
	regExpWhiteLine: (str) => {
		return RegExp(/\n\s*\r/).test(str)
	},
	//匹配正数、负数、和小数
	regExpNumberFloat: (str) => {
		return RegExp(/^(\-|\+)?\d+(\.\d+)?$/).test(str)
	},
	//匹配零和非零开头的数字
	regExpZeroNumber: (str) => {
		return RegExp(/^(0|[1-9][0-9]*)$/).test(str)
	},
	//匹配数字
	regExpNumber: (str) => {
		return RegExp(/^[0-9]*$/).test(str)
	},
	//长度为8-20的所有字符
	regExpAllByte: (str) => {
		return RegExp(/^.{8,20}$/).test(str)
	},
	// 车牌号校验
	isVehicleNumber: (str) => {
		return RegExp(/^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/).test(
			str)
	}

}

export function navigateTo() {
	if (arguments.length == 1) { // 只有一个参数 直接跳转到自己的目录
		let url = `../${arguments[0]}/${arguments[0]}`;
		uni.navigateTo({
			url: url
		})
	} else if (arguments.length == 2 && typeof arguments[1] == 'Object') { // 两个参数 第二个参数是 Object  直接跳转到自己的目录
		let url = `../${arguments[0]}/${arguments[0]}`;
		if (typeof arguments[1] == 'object') {
			let str = '?';
			let paramsArr = [];
			for (let k in arguments[1]) {
				let temp = `${k}=${arguments[1][k]}`;
				paramsArr.push(temp)
			};

			str = str + paramsArr.join('&');
			url = url + str;
		}
		uni.navigateTo({
			url: url
		})
	} else if (arguments.length == 2 && typeof arguments[1] == 'string') { //两个参数 第二个参数是 string 跳转到 指定上一层目录
		let url = `../${arguments[0]}/${arguments[1]}`;
		uni.navigateTo({
			url: url
		})
	} else {
		let url = `../${arguments[0]}/${arguments[1]}`;
		if (typeof arguments[2] == 'object') {
			let str = '?';
			let paramsArr = [];
			for (let k in arguments[2]) {
				let temp = `${k}=${arguments[2][k]}`;
				paramsArr.push(temp)
			};

			str = str + paramsArr.join('&');
			url = url + str;
		}
		uni.navigateTo({
			url: url
		})
	}

}






//删除数组中指定的元素
export function removeByValue(arr, val) {
	for (var i = 0; i < arr.length; i++) {
		if (arr[i] == val) {
			arr.splice(i, 1);
			break;
		}
	}

}

// 图片转base 64  连个参数1.图片资源路径 2.要赋值的变量

export function urlTobase64(url, name) {
	var toBase64Url;
	uni.request({
		url: url,
		method: 'GET',
		responseType: 'arraybuffer',
		success: async res => {
			let base64 = wx.arrayBufferToBase64(res.data); //把arraybuffer转成base64
			toBase64Url = 'data:image/jpeg;base64,' + base64; //不加上这串字符，在页面无法显示
			this[name] = toBase64Url;
		}
	});
}


//吊起支付
export function pay(type, orderInfo) {
	let provider;
	if (type == 1) {
		//支付宝
		provider = "alipay"
	} else {
		//微信
		provider = "wxpay"
	}
	return new Promise((resolve, reject) => {
		uni.requestPayment({
			provider: provider,
			orderInfo: orderInfo, //微信、支付宝订单数据
			success: function(res) {
				resolve({
					result: true,
					data: res
				})
			},
			fail: function(err) {
				resolve({
					result: false,
					data: err
				})
			}
		});
	})
}


export function hideToast() {
	uni.hideToast()
}



export function hideLoading() {
	uni.hideLoading()
}

//显示加载中
export function showLoading(title = "加载中") {
	return new Promise((resolve, reject) => {
		uni.showLoading({
			title: title,
			mask: true,
			success: () => {
				resolve(true);
			},
			fail: () => {
				resolve(false);
			}
		});
	})
}
// 弹出提示
export function modal(title, content, showCancel, cancelText, confirmText, cancelColor, confirmColor) {
	return new Promise((resolve, reject) => {
		uni.showModal({
			title,
			content: content || '',
			showCancel: !showCancel ? showCancel : true,
			cancelText: cancelText || '取消',
			confirmText: confirmText || '确定',
			cancelColor: cancelColor,
			success: (res) => {
				res.confirm ? resolve(true) : resolve(false)
			},
		})
	})

}
/**
 * 图片上传，支持多图
 * @author nullfeng
 * @param Array <images> 本地路径数组
 * @param Function [complete] 回调函数()
 * @return Promise
 */
export function uploadFiles(images, type, data, complete) {
	let queue = [];
	images.forEach(image => {
		queue.push(new Promise((resolve, reject) => {
			uni.uploadFile({
				url: 'http://182.61.36.135:8083/?s=admin/api.plugs/plupload', //上传路径
				filePath: image, //上传路径
				name: 'file',
				fileType: type, //文件类型
				formData: data, //HTTP 请求中其他额外的 form data
				success: res => {
					let result = JSON.parse(res.data);
					if (result.uploaded) {
						resolve(result.url);
					} else {
						uni.showModal({
							content: result.message,
							showCancel: false
						});
					}
				},
				fail: err => {
					uni.showModal({
						content: err.errMsg,
						showCancel: false
					});
					reject();
				}
			});
		}));
	});
	if (!queue.length) queue.push(new Promise((resolve, reject) => {
		resolve("")
	}));
	return new Promise((resolve, reject) => {
		Promise.all(queue).then(res => {
			complete && complete(res.join('|'));
			resolve(res.join('|'));
		}).catch(res => {
			reject();
		});
	});
}


// 验证身份证
export function checkID(id) {
	let reg = /^\d{15}|\d{18}$/
	if (!reg.test(id)) {
		this.toast({
			title: '身份证有误，请重填',
			icon: "none"
		})
		return false
	} else {
		// 验证通过
		return true
	}
}

// 生成随机数
function getRandom(n, m) {
	n = Number(n)
	m = Number(m)
	if (n > m) {
		var temp = n
		n = m
		m = temp
	}
	return Math.floor(Math.random() * (m - n) + n)
}


// 按对象键值排序返回的函数
export function createComprisonFunction(propertyName) {
	return function(object1, object2) {
		var value1 = object1[propertyName];
		var value2 = object2[propertyName];
		if (value1 < value2) {
			return -1;
		} else if (value1 > value2) {
			return 1;
		} else {
			return 0;
		}
	}
}

//根据经纬度计算距离
//开始地址 纬度 经度   结束地址 纬度 经度
export function getDistance($lat1, $lng1, $lat2, $lng2) {
	let $earthRadius = 6367000; //地球半径 单位m
	$lat1 = ($lat1 * Math.PI) / 180;
	$lng1 = ($lng1 * Math.PI) / 180;
	$lat2 = ($lat2 * Math.PI) / 180;
	$lng2 = ($lng2 * Math.PI) / 180;
	let $calcLongitude = $lng2 - $lng1;
	let $calcLatitude = $lat2 - $lat1;
	let $stepOne = Math.pow(Math.sin($calcLatitude / 2), 2) + Math.cos($lat1) * Math.cos($lat2) * Math.pow(Math.sin(
		$calcLongitude / 2), 2);
	let $stepTwo = 2 * Math.asin(Math.min(1, Math.sqrt($stepOne)));
	let $calculatedDistance = $earthRadius * $stepTwo;
	return Math.round($calculatedDistance);
}
// 选择系统相册

export function chooseImg(count = 1) {
	return new Promise((resolve, reject) => {
		uni.chooseImage({
			count: count,
			sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
			sourceType: ['album'], //从相册选择
			success: function(res) {
				resolve(res);
			}
		});
	})
}
// 生成图形随机验证码
export function getRandomCode() {
	var codeStr =
		'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
	var randomShowCode = ""
	for (var i = 0; i < 4; i++) {
		var ran = getRandom(0, 62)
		randomShowCode += codeStr.charAt(ran)
	}
	return randomShowCode

}

/**
 * 格式化时间
 */
export function formatDate(date, fmt) {
	if (typeof(date) == "string") {
		date = new Date(date.replace('年', '/').replace('月', '/').replace('日', '').replace(/-/g, '/'));
	}
	var o = {
		"m+": date.getMonth() + 1, //月份
		"d+": date.getDate(), //日
		"h+": date.getHours(), //小时
		"i+": date.getMinutes(), //分
		"s+": date.getSeconds(), //秒
		"q+": Math.floor((date.getMonth() + 3) / 3), //季度
	};
	if (/(y+)/.test(fmt))
		fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (var k in o)
		if (new RegExp("(" + k + ")").test(fmt))
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
}



// 格式化时间  将秒格式成 00:00:00:00
export function formatTime(seconds) {
	// 小于等于0的话，结束倒计时
	if (seconds <= 0) {
		return {
			"day": 0,
			"hour": 0,
			"minute": 0,
			"second": 0
		}
	}

	let [day, hour, minute, second] = [0, 0, 0, 0];
	day = Math.floor(seconds / (60 * 60 * 24));
	// 判断是否显示“天”参数，如果不显示，将天部分的值，加入到小时中
	// hour为给后面计算秒和分等用的(基于显示天的前提下计算)
	hour = Math.floor(seconds / (60 * 60)) - day * 24;
	// showHour为需要显示的小时
	let showHour = null;
	if (this.showDays) {
		showHour = hour;
	} else {
		// 如果不显示天数，将“天”部分的时间折算到小时中去
		showHour = Math.floor(seconds / (60 * 60));
	}
	minute = Math.floor(seconds / 60) - hour * 60 - day * 24 * 60;
	second = Math.floor(seconds) - day * 24 * 60 * 60 - hour * 60 * 60 - minute * 60;
	// 如果小于10，在前面补上一个"0"

	showHour = showHour < 10 ? '0' + showHour : showHour;

	minute = minute < 10 ? '0' + minute : minute;
	second = second < 10 ? '0' + second : second;

	let obj = {
		"day": day,
		"hour": showHour,
		"minute": minute,
		"second": second
	}
	return obj
	// this.d = day;
	// this.h = showHour;
	// this.i = minute;
	// this.s = second;
}