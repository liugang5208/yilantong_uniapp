// 验证码 DOM 运行时：H5 直接调用，App 仅在 renderjs 视图层调用。
// 页面取得参数后，仍由 getSmsCode 接口完成服务端校验。
let sdkLoadPromise = null;
let initPromise = null;
let captchaButton = null;
let activeRequest = null;

function loadAliyunCaptchaSdk() {
	if (typeof window === 'undefined' || typeof document === 'undefined') {
		return Promise.reject(new Error('当前环境不支持 Web 验证码，请使用 H5 页面'));
	}
	window.AliyunCaptchaConfig = { region: 'cn', prefix: 'nh4pu2' };
	if (typeof window.initAliyunCaptcha === 'function') return Promise.resolve();
	if (sdkLoadPromise) return sdkLoadPromise;

	sdkLoadPromise = new Promise((resolve, reject) => {
		const script = document.createElement('script');
		const timer = setTimeout(() => finish(new Error('验证码 SDK 加载超时')), 15000);
		function finish(error) {
			clearTimeout(timer);
			script.onload = script.onerror = null;
			if (error) {
				if (script.parentNode) script.parentNode.removeChild(script);
				reject(error);
			} else {
				resolve();
			}
		}
		script.src = 'https://o.alicdn.com/captcha-frontend/aliyunCaptcha/AliyunCaptcha.js';
		script.onload = () => finish(typeof window.initAliyunCaptcha === 'function'
			? null : new Error('验证码 SDK 未正确加载'));
		script.onerror = () => finish(new Error('验证码 SDK 加载失败'));
		document.head.appendChild(script);
	}).catch(error => {
		sdkLoadPromise = null;
		throw error;
	});
	return sdkLoadPromise;
}

function settleRequest(error, param) {
	if (!activeRequest) return;
	const request = activeRequest;
	activeRequest = null;
	clearTimeout(request.timer);
	if (error) request.reject(error);
	else request.resolve(param);
}

export function initCaptcha() {
	if (initPromise) return initPromise;
	initPromise = loadAliyunCaptchaSdk().then(() => new Promise((resolve, reject) => {
		// 同一 H5 文档只初始化一次，避免多页面重复绑定、Vue 保留属性名和 ID 冲突。
		const suffix = Math.random().toString(36).slice(2);
		const button = document.createElement('button');
		button.id = 'aliyunCaptchaBtn_' + suffix;
		button.type = 'button';
		button.style.display = 'none';
		const element = document.createElement('div');
		element.id = 'aliyunCaptchaEl_' + suffix;
		document.body.appendChild(button);
		document.body.appendChild(element);
		let ready = false;
		let failed = false;
		let readyTimer;
		const timer = setTimeout(() => fail(new Error('验证码初始化超时')), 20000);
		function fail(error) {
			if (failed) return;
			console.error('验证码初始化失败', error);
			settleRequest(error);
			if (ready) return;
			failed = true;
			clearTimeout(timer);
			clearTimeout(readyTimer);
			button.remove();
			element.remove();
			reject(error);
		}
		try {
			window.initAliyunCaptcha({
				SceneId: '1vbsr7hh',
				mode: 'popup',
				element: '#' + element.id,
				button: '#' + button.id,
				getInstance: () => {
					if (failed) return;
					// 按 SDK 接入要求预留资源加载与环境采集时间。
					readyTimer = setTimeout(() => {
						clearTimeout(timer);
						ready = true;
						captchaButton = button;
						resolve();
					}, 2100);
				},
				captchaVerifyCallback: param => {
					const hasRequest = !!activeRequest;
					if (hasRequest) settleRequest(null, param);
					// 保留现有参数透传流程；短信接口才决定是否真正验证通过。
					return Promise.resolve({ captchaResult: hasRequest });
				},
				onBizResultCallback: () => {},
				onError: error => fail(new Error('验证码服务初始化失败：' +
					(error && (error.code || error.message) || '请重试'))),
				slideStyle: { width: 320, height: 40 },
				language: 'cn'
			});
		} catch (error) {
			fail(error);
		}
	})).catch(error => {
		initPromise = null;
		throw error;
	});
	return initPromise;
}

export function cancelRequest(owner) {
	if (activeRequest && activeRequest.owner === owner) {
		const error = new Error('验证码验证已取消');
		error.cancelled = true;
		settleRequest(error);
	}
}

export function requestCaptchaVerify(owner) {
	// 防止连点让多个调用同时拿到参数、重复发短信。
	if (activeRequest) {
		const error = new Error('请先完成当前验证');
		error.cancelled = true;
		return Promise.reject(error);
	}
	return new Promise((resolve, reject) => {
		const request = { owner: owner, resolve, reject };
		activeRequest = request;
		request.timer = setTimeout(() => {
			if (activeRequest === request) settleRequest(new Error('验证超时，请重试'));
		}, 120000);
		initCaptcha().then(() => {
			if (activeRequest === request) captchaButton.click();
		}).catch(error => {
			if (activeRequest === request) settleRequest(error);
		});
	});
}
