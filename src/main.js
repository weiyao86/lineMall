import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueWechatTitle from 'vue-wechat-title'
import Utils from './script/utils'
//适配REM转换
import './script/adjust'
import "@assets/styles/reset.scss";
// import 'vant/lib/index.css'; Vue.use(vant);  全局使用>当前使用按需引用 
import 'animate.css';
import './assets/styles/global.scss';

Vue.config.productionTip = false;

let FastClick = require('fastclick');
//无需对IOS11及以上做处理
const ua = navigator.userAgent.toLowerCase();
const device  = ua.match(/cpu iphone os (.*?) like mac os/);
if (!device || parseInt(device[1]) < 11) {
  FastClick.attach(document.body);
}

//use common ui cmp
Vue.use(VueWechatTitle);

//custom plug
Vue.use(Utils);

window.__GlobalVue = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
