import { mapState, mapMutations } from "vuex";
export default {
  name: "PaySubmit",
  data() {
    return {
      queryParams: {},
      radio: "",
      detail: {},
      cardList: []
    };
  },

  created() {
    let me = this;
    me.queryParams = me.$route.query;
    me.init();
  },

  methods: {
    init() {
      let me = this;
      me.getPayCard();
    },

    //获取详情
    getPayCard() {
      let me = this,
        params = {
          uid: me.queryParams.uid,
          order_id: me.queryParams.order_id
        };

      me.$http.get("/pay/cardList", { params, isLoading: false }).then(res => {
        me.cardList = res.data.cardlist.map(arr => {
          arr["validstart"] = arr["validstart"] * 1000;
          arr["validend"] = arr["validend"] * 1000;
          return arr;
        });
        me.detail = res.data;
      });
    },

    //选中行
    onRowClick(item) {
      let me = this;
      me.radio = item.id;
    },

    //确认支付
    onConfirmPay() {
      let me = this,
        data = {
          uid: me.queryParams.uid,
          order_id: me.queryParams.order_id,
          card_id: me.radio
        },
        linkObj = {
          path: "/mall/payResult",
          query: {
            status: "success",
            ...data
          }
        };

      me.$dialog
        .confirm({
          title: "系统提示",
          message: "是否立即支付"
        })
        .then(() => {
          me.$http
            .post("/pay/pay", { data, loadingName: "订单支付中..." })
            .then(res => {})
            .catch(err => {
              linkObj.query["status"] = "error";
              linkObj.query["errorMsg"] = err.msg;
            })
            .finally(() => me.$router.replace(linkObj));
        });
    }
  }
};
