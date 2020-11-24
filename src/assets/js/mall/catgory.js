import CatgoryCommon from "@components/CatgoryCommon";
export default {
  name: "Catgory",
  components: {
    CatgoryCommon
  },

  methods: {
    //跳转搜索页
    onSearch() {
      let me = this;
      me.$router.push({
        path: "/mall/search"
      });
    }
  },

  // 离开路由时,记录列表状态
  beforeRouteLeave(to, from, next) {
    let me = this;

    me.$refs.categoryCmp && me.$refs.categoryCmp.beforeRouteLeave();
    next();
  }
};
