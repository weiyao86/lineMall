export default {
  name: "PayResult",
  data() {
    return {
      queryParams: {},
      isSuccess: false,
      errorMsg: ""
    };
  },

  computed: {
    getRstTextByStatus() {
      return this.isSuccess ? "订单支付成功" : "订单支付失败";
    },
    getBtnTextByStatus() {
      return this.isSuccess ? "查看订单" : "重试一下";
    }
  },

  created() {
    let me = this;
    me.queryParams = me.$route.query;
    me.init();
  },

  methods: {
    init() {
      let me = this;

      me.isSuccess = me.queryParams.status == "success";
      me.errorMsg = me.queryParams.errorMsg;
    },

    onClickByStatus() {
      let me = this,
        data = {
          uid: me.queryParams.uid,
          order_id: me.queryParams.order_id,
          card_id: me.queryParams.card_id
        };

      if (me.isSuccess) {
        me.$router.replace({
          path: "/mall/order"
        });
      } else {
        //重新发起支付
        let linkObj = {
          path: "/mall/payResult",
          query: {
            status: "success",
            ...data
          }
        };

        me.$http
          .post("/pay/pay", { data, loadingName: "订单支付中..." })
          .then(res => {})
          .catch(err => {
            linkObj.query["status"] = "error";
            linkObj.query["errorMsg"] = err.msg;
          })
          .finally(() => {
            me.$router.replace(linkObj);
          });
      }
    }
  }
};
