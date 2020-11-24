import CatgoryCommon from "@components/CatgoryCommon";
export default {
  name: "CatgoryKlt",
  components:{
    CatgoryCommon
  },

  // 离开路由时,记录列表状态
  beforeRouteLeave(to, from, next) {
    let me = this;

    me.$refs.categoryCmp && me.$refs.categoryCmp.beforeRouteLeave();
    next();
  }
};
