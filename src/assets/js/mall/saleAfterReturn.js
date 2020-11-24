import { mapState } from "vuex";
export default {
  name: "SaleAfterReturn",
  data() {
    return {
      queryParams: {},
      showPopup: false,
      storeAddress: {}, //商家地址
      expressInfo: [],
      expressCompany: {
        id: "",
        name: ""
      },
      sn: ""
    };
  },

  computed: {
    ...mapState(["userInfo"])
  },

  created() {
    let me = this;

    me.queryParams = me.$route.query;

    me.init();
  },
  methods: {
    init() {
      let me = this;
      me.getStoreAddress();
    },

    //加载
    getStoreAddress() {
      let me = this,
        params = {
          store_id: me.queryParams.store_id
        };

      me.$http.get("/orderservice/shopAddress", { params }).then(res => {
        me.storeAddress = res.data;

        if (!me.storeAddress) {
          me.$toast(res.msg);
        } else
          me.expressInfo = res.data.express.map(item => {
            item["checked"] = false;
            return item;
          });
      });
    },

    onShowPopup() {
      this.showPopup = true;
    },

    //选择快递公司
    choose(evt, curItem) {
      let me = this;
      me.expressInfo.forEach((item, idx) => {
        let ckd = false;
        if (curItem && item.id == curItem.id) {
          ckd = true;
          let { id, company: name } = item;
          me.expressCompany = { id, name };
        }
        item["checked"] = ckd;

        me.$set(me.expressInfo, idx, item);
      });
      me.showPopup = false;
    },

    //退货
    submitReturn(item, status) {
      let me = this,
        data = {
          uid: me.userInfo.uid,
          service_id: me.queryParams.service_id,
          express_id: me.expressCompany.id,
          shipping_number: me.sn
        };

      me.$http.post("/orderservice/returnGoods", { data }).then(res => {
        me.$toast({
          type: "success",
          message: res.msg,
          onClose() {
            me.$router.push({
                path:"/mall/saleAfterList"
            });
          }
        });
      });
    }
  }
};
