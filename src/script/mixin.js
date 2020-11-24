import NavBar from "@components/NavBar";
import MescrollVue from "@components/Mescroll.vue";

let myGreatMixin = {
  data() {
    return {
      transitionName: "slide-fade", //"slide-fade-left" //"slide-left"
      //上拉下拉分页公共对象
      mescroll: null,
      mescrollDown: {},
      mescrollUp: {
        callback: this.upCallback,
        isBounce: false,
        page: {
          num: 0,
          size: 10
        },
        htmlNodata: '<p class="upwarp-nodata">-- 没有更多了 --</p>',
        loadFull: {
          use: true,
          delay: 500
        },
        empty: {
          warpId: "empty_list",
          icon: require("@assets/images/mescroll-no-result.png"),
          tip: "暂无相关数据"
        }
      },
      pageNum: 1,
      limit: 10
    };
  },

  components: {
    NavBar,
    MescrollVue
  },

  watch: {
    //TODO:页面过渡
    $route(to, from) {
      let me = this;

      // if (to.meta.keepAlive) {
      //   if (to.meta.index > from.meta.index) {
      //     me.transitionName = "slide-fade-right";
      //   } else {
      //     me.transitionName = "slide-fade-left";
      //   }
      // }
    }
  },

  //处理mescroll插件恢复到原有滚动位置
  beforeRouteEnter(to, from, next) {
    let toPath = to.path,
      fromPath = from.path,
      backPage =
        (toPath == "/mall/searchCatgory" && fromPath == "/mall/detail") ||
        (toPath == "/mall/order" &&
          ["/mall/logistics", "/mall/mall/saleAfter"].some(i => i == fromPath));

    //1.商品详情页退回逛一逛页面保持缓存
    //2.物流页/售后页退回我的订单页面保持缓存

    if (backPage) {
      to.meta["isBack"] = true;
    }

    next(vm => {
      vm.$refs.mescroll && vm.$refs.mescroll.beforeRouteEnter();
    });
  },

  // 离开路由时,记录列表状态
  beforeRouteLeave(to, from, next) {
    let me = this;

    me.$refs.mescroll && me.$refs.mescroll.beforeRouteLeave();

    next();
  }
};

export default myGreatMixin;
