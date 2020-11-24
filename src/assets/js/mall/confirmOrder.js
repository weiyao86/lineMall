import { mapState, mapMutations } from "vuex";
import Specification from "@components/Specification";
export default {
  name: "ShopCart",
  data() {
    return {
      queryParams: {},
      showPopup: false,
      orderList: [], //列表
      address: null,
      totalAmount: 0,
      shippingAmount: 0
    };
  },

  computed: {
    ...mapState(["userInfo", "curCheckAddress"])
  },

  components: { Specification },

  created() {
    let me = this;

    let query = me.$route.query && me.$route.query.p;
    try {
      me.queryParams = JSON.parse(query);
    } catch (err) {
      me.queryParams = {};
      console.log("JSON.parse  error URL参数转换失败");
    }

    me.init();
  },
  methods: {
    ...mapMutations(["setCurCheckAddress"]), //设置选中地址

    init() {
      let me = this;
      me.getOrderList();
    },

    //pull list
    getOrderList() {
      let me = this,
        data = {
          uid: me.queryParams.uid,
          goods_nums: me.queryParams.goods_nums
        };

      me.$http.post("/order/confirmOrder", { data }).then(res => {
        let data = res.data || {};
        me.orderList = data.list || [];

        //如果选择过地址则用选择的,确认订单后销毁
        me.address = me.curCheckAddress || data.user_address;

        me.totalAmount = data.total_amount * 100 || 0;

        me.shippingAmount = data.shipping_amount;

        if (!me.orderList.length) {
          return me.$toast.fail(res.msg);
        }
      });
    },

    //选择地址
    onChooseAddress() {
      let me = this;

      me.$router.push({
        path: "/user/address",
        query: {
          hasCheckd: 1,
          id: (me.address && me.address.id) || -1
        }
      });
    },

    //确认订单
    onSubmit() {
      let me = this,
        getSubParams = me.getSubParams(),
        data = {
          uid: me.queryParams.uid,
          addr_id: me.address.id,
          sku: getSubParams.sku, //快联通专用
          remark: "暂不传",
          goods_nums: getSubParams.goodsNums,
          method: getSubParams.stores
        };

      if (!me.address.id) {
        return me.$toast.fail("请选择收货地址");
      }

      me.$http.post("/order/createOrder", { data }).then(res => {
        me.toPay(res.data);
      });
    },

    //获取规格 ,店铺(是否自提)参数,sku参数
    getSubParams() {
      let me = this,
        goodsNums = {},
        stores = {},
        sku = [];

      me.orderList.forEach(item => {
        stores[item.store_id] = 1; //1-快递(页面暂无选择)默认
        item.goods.forEach(good => {
          goodsNums[good.specs_id] = good.goods_num;
          //快联通传递sku值
          if(me.$STORE_LIST.KLT == good.store_id){
            sku.push({
              Quantity: good.goods_num,
              ProductId: good.code
            });
          }
        });
      });
      return { goodsNums, stores, sku };
    },

    clearChooseAddress() {
      let me = this;
      //清空当前页选择过的收货地址
      me.setCurCheckAddress({
        address: null
      });
    },

    toPay(data) {
      let me = this;
      me.$router.replace({
        path: "/mall/paySubmit",
        query: {
          uid: me.userInfo.uid,
          order_id: data.order_id
        }
      });
    }
  },

  beforeDestroy() {
    let me = this;
    me.clearChooseAddress();
  }
};
