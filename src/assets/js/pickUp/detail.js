import { mapState } from "vuex";
export default {
  name: "PickUpDetail",

  data() {
    return {
      queryParams: {},
      details: {}
    };
  },

  computed: {
    ...mapState(["pickUpUserInfo"])
  },

  created() {
    let me = this;

    me.queryParams = me.$route.query;
    me.init();
  },

  methods: {
    init() {
      let me = this;
      me.getDetail();
    },

    getDetail() {
      let me = this,
        params = {
          goods_id: me.queryParams.id
        };

      me.$http.get("/pickupCard/goodsDetail", { params }).then(res => {
        me.details = res.data || {};
      });
    },

    //我的提货单
    onCart() {
      let me = this;

      if (me.validUser()) {
        me.$router.push({
          path: "/pickUp/CardList",
          query: {
            uid: me.pickUpUserInfo.uid
          }
        });
      }
    },

    //提货回家
    onTakeHome() {
      let me = this;
      if (me.validUser()) {
        me.$router.push({
          path: "/pickUp/Card",
          query: {
            uid: me.pickUpUserInfo.uid,
            goods_id: me.queryParams.id
          }
        });
      }
    },

    validUser() {
      let me = this,
        flag = true;
      if (!me.pickUpUserInfo.uid) {
        me.$toast.fail("当前用户不存在");
        flag = false;
      }
      return flag;
    }
  }
};
