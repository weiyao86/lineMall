import Vue from "vue";
import CommonHttp from "./commonHttp";
import Methods from "./methods";
import Cache from "./localStorage";
import VantCmp from "./vantCmp";
import "./awesome";
import Icon from "vue-awesome/components/Icon";
import Directive from "./directive";
import Config from "./config";
import Mixin from "./mixin";
import KeepAlive from "./baseKeepAlive";

export default {
  install(vue, options) {

    //ui 按需加载
    vue.use(VantCmp);

    //定义全局方法/变量
    // Vue.myGlobalMethod=(){}


    //定义全局指令
    let dirt = Object.keys(Directive);
    dirt.forEach((key, val, obj) => {
      vue.directive(key, Directive[key]());
    });

    //全局组件 Awesome
    vue.component("v-icon", Icon);
    //解决多级路由嵌套缓存失效问题(暂不启用)
    // vue.component("BaseKeepAlive", KeepAlive);

    //定义全局过滤器
    vue.filter("httpImage", Methods["utils"]["httpImage"]);
    vue.filter("dateFormat", Methods["utils"]["dateFormat"]);
    vue.filter("decimalKeep", Methods["utils"]["decimalKeep"]);

    //注入组件选项
    vue.mixin(Mixin);

    //添加实例方法
    //Vue.prototype.$myMethod=()=>{}
    let props = {};
    let commonCfg = Object.assign(
      {
        emptyImg: require('@assets/images/mescroll-no-result.png')
      },
      Config,
      Methods,
      Cache,
      CommonHttp
    );
    let cfg = Object.keys(commonCfg);
    cfg.forEach((key, val, obj) => {
      props["$" + key] = {
        get() {
          return commonCfg[key];
        }
      };
    });

    Object.defineProperties(Vue.prototype, props);

  }
};
