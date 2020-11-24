import Vue from "vue";
import VueRouter from "vue-router";
import Cache from "../script/localStorage";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

Vue.use(VueRouter);

//加载/router/文件夹下所有路由文件
let routeList = [];
let importAll = require.context("@/router", false, /\.js$/);
importAll.keys().map(path => {
  // 需要排除
  if (!path.includes("index.js")) {
    //兼容处理：.default 获取 ES6 规范暴露的内容; 后者获取 commonJS 规范暴露的内容
    let router = importAll(path).default || importAll(path);
    routeList = [...routeList, ...router];
  }
});

//获取原型对象上的push函数
const originalPush = VueRouter.prototype.push;
//修改原型对象中的push方法
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
};

const router = new VueRouter({
  mode: "history",
  base: "/wx/", //配置服务器子目录
  routes: routeList
});

//
let lastPathList = ["/user/auth", "/open.weixin.qq.com"];
let lastPathListForPickUp = ["/pickUp/auth", "/open.weixin.qq.com"];
//1验证登录.2设置进度条.3中断上个页面未加载完成请求.4记录当前页地址
router.beforeEach((to, from, next) => {
  NProgress.start();
  /*离开keepAlive组件可单独处理 */
  if (window.__GlobalVue) {
    window.__GlobalVue.$store.commit("removeCancelToken");
  }

  //TODO:开发中不限制
  // return next();

  let matched = to.matched,
    path = "/pickUp";

  let mts = matched.filter(route => {
    let str = route.path || route.parent.path;
    return str == path;
  });

  //提货卡系统无需登录，仅微信授权
  if (mts.length) {
    //存放于页面缓存中
    if (Cache.getStorage("wechatAuth")) {
      next();
    } else {
      if (to.path == lastPathListForPickUp[0]) {
        next();
      } else {
        let lastPath = to.fullPath;

        let hasPath =
          lastPath == lastPathListForPickUp[0] ||
          lastPath.indexOf(lastPathListForPickUp[1]) > -1;
        //如果是登录或wechat则不记录
        if (!hasPath) {
          Cache.setStorage("lastPathListForPickUp", lastPath);
        }

        next({ path: lastPathListForPickUp[0] });
        NProgress.done();
      }
    }
  } else {
    //是否登录
    if (Cache.getStorage("userToken")) {
      next();
    } else {
      if (to.path == "/user/auth") {
        next();
      } else {
        let lastPath = to.fullPath;
        let hasPath = lastPathList.some(item => lastPath.indexOf(item) > -1);
        //如果是登录或wechat或没有导航页过来统一跳转至首页
        if (hasPath || to.meta.isNavBar == undefined) {
          lastPath = "/";
        }
        Cache.setStorage("lastFullPath", lastPath);

        next({ path: "/user/auth", replace: true });
        NProgress.done();
      }
    }
  }
});

router.afterEach(() => {
  NProgress.done();
});

export default router;
