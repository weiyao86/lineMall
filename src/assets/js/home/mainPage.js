// import Waterfall from "vue-waterfall-plugin";
import vueWaterfallEasy from "vue-waterfall-easy";
import ScrollView from "@components/Scroll";
export default {
  name: "mainPage",
  data() {
    return {
      list: []
    };
  },
  components: {
    ScrollView,
    vueWaterfallEasy
  },

  mounted() {
    let me = this;
    //activated 首次加载时排除
    me.init();
    me.hasFirstLoad = true;
    me.$setStorage("hasPreloaded", false);
  },

  activated() {
    let me = this;

    me.$nextTick(() => {
      //为瀑布流作特殊处理－瀑布流被截断未渲染则再次渲染
      if (!me.hasFirstLoad && !me.$getStorage("hasPreloaded")) {
        me.getDetail();
      }
    });
  },

  deactivated() {
    let me = this;
    me.hasFirstLoad = false;
  },

  methods: {
    init() {
      let me = this;
      me.lastScrollTop = 0;
      me.getDetail();
    },

    //获取首页详情
    getDetail() {
      let me = this;
      me.$http.get("/index/home").then(res => {
        me.list =
          res.data.map(item => {
            item["src"] = item["img"];

            item["href"] = me.$utils.httpImage(item["url"]);
            return item;
          }) || [];
      });
    },

    //瀑布流预加载完成
    onPreloaded() {
      let me = this;

      me.$refs.waterfall.waterfallOver();

       setTimeout(() => {
        let waterScrollEl = me.$refs.waterfall.$el.querySelector(
          ".vue-waterfall-easy-scroll"
        );
        //瀑布流图片加载完成时已离开当前页则退出
        if (!waterScrollEl.scrollHeight) return;
        me.$refs.waterfall.$el.style.height =
          waterScrollEl.scrollHeight + 140 + "px";

        me.$refs.bscroll.refresh();
        me.$setStorage("hasPreloaded", true);
      }, 20);
    },

    //跳转搜索页
    onSearch() {
      let me = this;
      me.$router.push({
        path: "/mall/search"
      });
    },

    onClickLink(item) {
      let me = this;
    }
  }
};
