import ChooseAddress from "@components/ChooseAddress";
export default {
  name: "WriteCard",
  data() {
    return {
      queryParams: {},
      cardNo: "",
      details: {},
      showPopup: false,
      addressList: [],
      name: "",
      tel: "",
      address: "",
      desc: "",
      checked: false
    };
  },

  components: { ChooseAddress },

  created() {
    let me = this;
    me.init();
  },

  methods: {
    init() {
      let me = this;
      me.queryParams = me.$route.query;
      me.cardNo = me.queryParams.number;
      me.getGoodsDetail();
    },

    //拉取商品信息
    getGoodsDetail() {
      let me = this,
        params = {
          goods_id: me.queryParams.goods_id
        };

      me.$http.get("/pickupCard/goodsDetail", { params }).then(res => {
        me.details = res.data || {};
      });
    },

    //确认提货
    onSubmit() {
      let me = this,
        addressList = me.addressList || [],
        data = {
          uid: me.queryParams.uid,
          goods_id: me.queryParams.goods_id,
          number: me.queryParams.number,
          reciever: me.name,
          mobile: me.tel,
          address: me.desc,
          province_id: (addressList[0] && addressList[0].id) || "",
          city_id: (addressList[1] && addressList[1].id) || "",
          district_id: (addressList[2] && addressList[2].id) || "",
          street_id: (addressList[3] && addressList[3].id) || ""
        };

      me.$http.post("/pickupCard/createOrder", { data }).then(res => {
        me.$toast({
          type: "success",
          message: res.msg,
          onClose() {
            //跳转我的提货单
            me.$router.replace({
              path: "/pickUp/cardList",
              query: {
                uid: me.queryParams.uid
              }
            });
          }
        });
      });
    },

    //打开地址栏
    onShowPopup() {
      let me = this;
      me.showPopup = !me.showPopup;
    },

    //地址栏加载后
    opendAfter() {
      let me = this,
        addressCmp = me.$refs.addressCmp;
      addressCmp.init();
    },

    //地址选完后
    chooseAddressAfter(navList) {
      let me = this;
      me.showPopup = !me.showPopup;
      me.addressList = [...navList];
      me.address = "";
      me.addressList.forEach(item => (me.address += " " + item.name));
    }
  }
};
