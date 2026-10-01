<template>
    <view :command="command" :change:command="captchaView.onCommand" class="captcha-bridge"></view>
</template>

<script>
// Promise 和回调保留在逻辑层，只将可序列化的命令/结果跨层传递。
const pending = new WeakMap();
export default {
    data() {
        return { command: null, sequence: 0 };
    },
    beforeDestroy() { this.cancel(); },
    methods: {
        verify() {
            if (pending.has(this)) {
                const error = new Error('请先完成当前验证');
                error.cancelled = true;
                return Promise.reject(error);
            }
            return new Promise((resolve, reject) => {
                const id = ++this.sequence;
                const timer = setTimeout(() => {
                    this.onCaptchaResult({ id, error: '验证超时，请重试' });
                    this.command = { id: ++this.sequence, action: 'cancel' };
                }, 125000);
                pending.set(this, { id, resolve, reject, timer });
                this.command = { id, action: 'verify' };
            });
        },
        onCaptchaResult(result) {
            const request = pending.get(this);
            if (!request || request.id !== result.id) return;
            pending.delete(this);
            clearTimeout(request.timer);
            if (result.error || !result.param) {
                const error = new Error(result.error || '未获取到验证码参数，请重试');
                error.cancelled = !!result.cancelled;
                request.reject(error);
            } else {
                request.resolve(result.param);
            }
        },
        cancel() {
            const request = pending.get(this);
            if (!request) return;
            this.onCaptchaResult({ id: request.id, error: '验证码验证已取消', cancelled: true });
            this.command = { id: ++this.sequence, action: 'cancel' };
        }
    }
};
</script>

<script module="captchaView" lang="renderjs">
import { initCaptcha, requestCaptchaVerify, cancelRequest } from '@/library/captcha-runtime.js';
export default {
    mounted() {
        initCaptcha().catch(error => console.error('验证码预加载失败', error));
    },
    methods: {
        onCommand(command) {
            if (!command) return;
            if (command.action === 'cancel') {
                cancelRequest(this);
                return;
            }
            if (command.action !== 'verify') return;
            requestCaptchaVerify(this).then(param => {
                this.$ownerInstance.callMethod('onCaptchaResult', { id: command.id, param });
            }).catch(error => {
                this.$ownerInstance.callMethod('onCaptchaResult', {
                    id: command.id,
                    error: error.message || '验证码加载失败，请重试',
                    cancelled: !!error.cancelled
                });
            });
        }
    }
};
</script>

<style scoped>
.captcha-bridge { width: 0; height: 0; }
</style>
