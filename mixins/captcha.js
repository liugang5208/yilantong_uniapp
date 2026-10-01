// DOM SDK 在 H5 逻辑层或 App 的 renderjs 视图层运行。
// #ifdef H5
import { initCaptcha, requestCaptchaVerify, cancelRequest } from '@/library/captcha-runtime.js';
// #endif
// #ifdef APP-PLUS
import AliyunCaptcha from '@/components/aliyun-captcha/aliyun-captcha.vue';
// #endif

export default {
    // #ifdef APP-PLUS
    components: { AliyunCaptcha },
    // #endif
    onReady() {
        // #ifdef H5
        initCaptcha().catch(error => console.error('验证码预加载失败', error));
        // #endif
    },
    onHide() { this.cancelCaptchaVerify(); },
    onUnload() { this.cancelCaptchaVerify(); },
    methods: {
        requestCaptchaVerify() {
            // #ifdef APP-PLUS
            const bridge = this.$refs.aliyunCaptcha;
            return bridge ? bridge.verify() : Promise.reject(new Error('验证码尚未就绪，请重试'));
            // #endif
            // #ifdef H5
            return requestCaptchaVerify(this);
            // #endif
            // #ifndef APP-PLUS
            // #ifndef H5
            return Promise.reject(new Error('当前平台暂不支持验证码'));
            // #endif
            // #endif
        },
        cancelCaptchaVerify() {
            // #ifdef APP-PLUS
            if (this.$refs.aliyunCaptcha) this.$refs.aliyunCaptcha.cancel();
            // #endif
            // #ifdef H5
            cancelRequest(this);
            // #endif
        }
    }
};
