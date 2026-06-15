import App from './App'

import uView from "uview-ui";
Vue.use(uView);


import config from './config/publicConfig.js';
Vue.prototype.$publicConfig = config;

import * as util from 'library/utils.js'
import api from './library/api.js'


Vue.prototype.$util=util
Vue.prototype.$api = api;

import { createRequestPermissionListener } from '@/uni_modules/x-perm-apply-instr-v2/js_sdk/index.js'
createRequestPermissionListener()

// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif