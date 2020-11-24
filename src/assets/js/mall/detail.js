import { mapState, mapActions } from "vuex";
import Specification from "@components/Specification";
import DeliveryAddress from "@components/DeliveryAddress";

export default {
  name: "Detail",

  data() {
    return {
      queryParams: {},
      showPreview: false, //预览商品图
      preViewIdx: 1,
      details: { goods: {}, goods_img: [], specs: [] }, //详情数据
      current: 0, //轮播索引
      totalImgs: 0, //轮播总记录数
      curSpec: {
        id: "",
        name: "",
        price: "",
        img: "",
        inventory: 0
      }, //当前规格
      showPopup: false, //规格弹框
      curAddressInfo: {
        province_id: "",
        city_id: "",
        district_id: "",
        street_id: "",
        address: "",
        area_name: ""
      }, //当前送至地址
      showPopupAddress: false, //地址列表弹框
      buyNum: 1, //购买数量
      specData: {},
      enabledStatus: false, //按钮是否可用
      isClickAddCardBtn: false, //是否点击加入购物车
      isClickBuyNowBtn: false //是否点击立即下单
    };
  },

  computed: {
    ...mapState(["userInfo"]),

    //按钮状态  库存小于1或商品下架  禁用
    isEnabledStatus() {
      return this.curSpec.inventory < 1 || this.enabledStatus;
    },

    inventoryStatus() {
      return this.curSpec.inventory > 0 ? "有货" : "无货";
    },

    fullAddress() {
      let fullName =
        this.curAddressInfo.area_name + this.curAddressInfo.address;
      return fullName;
    }
  },

  components: {
    Specification,
    DeliveryAddress
  },

  created() {
    let me = this;

    me.queryParams = me.$route.query;
  },

  mounted() {
    let me = this;
    me.init();
  },

  methods: {
    ...mapActions(["getShopCartNum"]),

    init() {
      let me = this;
      me.getDetail();
    },

    getDetail() {
      let me = this,
        params = {
          goods_id: me.queryParams.id,
          uid: me.userInfo.uid
        };

      me.$http
        .get("/shop/goodsDetail", { params })
        .then(res => {
          me.enabledStatus = false;
          me.details = res.data || {};

          me.setCurSpec(me.details.goods);

          me.validSetAddress(me.details.user_address);
        })
        .catch(err => {
          me.enabledStatus = true;
          me.$set(me.details.goods, "name",  err.msg);
        });
    },

    //验证地址，前去添加
    validSetAddress(address = {}) {
      let me = this;
      if (!Object.keys(address).length) {
        me.$dialog
          .alert({
            title: "提示",
            message: "您还没有收货地址，现在就去添加"
          })
          .then(() => {
            me.$router.push({
              path: "/user/AddressAdd"
            });
          });
      } else {
        me.curAddressInfo = { ...address };
      }
    },

    setCurSpec(goods) {
      let me = this;

      me.details.specs = [...me.details.specs].map(res => {
        let checked = false;

        if (goods.specs_id == res.specs_id) {
          checked = true;
          let {
            specs_id: id,
            specs_name: name,
            specs_price: price,
            specs_img: img,
            inventory: inventory,
            buyNum = me.buyNum
          } = res;

          me.curSpec = { id, name, price, img, inventory, buyNum };
        }
        res["checked"] = checked;
        return res;
      });
    },

    //立即下单－跳转确认订单
    onBuyNow() {
      let me = this;
      me.isClickBuyNowBtn = true;
      me.onShowLayer();
    },

    //跳转
    invokeBuy() {
      let me = this,
        params = {
          uid: me.userInfo.uid,
          goods_nums: {
            [me.curSpec.id]: me.curSpec.buyNum
          }
        };

      me.$router.push({
        path: "/mall/confirmOrder",
        query: {
          p: JSON.stringify(params)
        }
      });
    },

    //加入购物车
    onAddShopCart() {
      let me = this;

      me.isClickAddCardBtn = true;
      me.onShowLayer();
    },

    //加入购物车
    invokeAddCard() {
      let me = this,
        data = {
          uid: me.userInfo.uid,
          goods_id: me.details.goods.id,
          specs_id: me.curSpec.id,
          goods_num: me.curSpec.buyNum
        };

      me.$http.post("/cart/addCart", { data }).then(res => {
        me.getShopCartNum();
        me.$toast.success("加入购物车成功");
      });
    },

    //调用 组件
    onShowLayer() {
      let me = this;

      me.specData = {
        ...me.curSpec,
        goodsName: me.details.goods.name,
        specs: me.details.specs,
        hasNum: true //是否显示数量操作
      };
      me.showPopup = true;
    },

    //关闭组件
    onCloseLayer(specData) {
      let me = this,
        { id, name, price, img, inventory, specs, buyNum } = specData;
      me.curSpec = { id, name, price, img, inventory, buyNum };
      me.details.specs = specs;

      me.details.goods["goods_price"] = price;

      //加入购物车、下单前查询库存
      me.getInventoryByStoreId(status => {
        if (status == "success") {
          //判断当前点击是 加入购物车 或 立即下单  按钮
          if (me.isClickAddCardBtn) {
            me.isClickAddCardBtn = false;
            me.invokeAddCard();
          } else if (me.isClickBuyNowBtn) {
            me.isClickBuyNowBtn = false;
            me.invokeBuy();
          }
        } else {
          //无库存
        }
        me.showPopup = false;
      });
    },

    //规格关闭
    onAutoClose() {
      let me = this;
      me.isClickAddCardBtn = false;
      me.isClickBuyNowBtn = false;
    },

    //打开送至弹出栏
    onShowLayerAddress() {
      let me = this;
      me.showPopupAddress = true;
    },

    //送至选择后，验证库存状态
    onChooseAddress(item) {
      let me = this;
      me.curAddressInfo = item;
      me.onAutoCloseForAddress();
      me.getInventoryByStoreId();
    },

    //根据自营/快联通  获取库存
    getInventoryByStoreId(cb = null) {
      let me = this,
        storeId = me.details.goods.store_id;

      let {
          province_id,
          city_id,
          district_id,
          street_id,
          specs_id = me.curSpec.id
        } = me.curAddressInfo,
        params = { province_id, city_id, district_id, street_id, specs_id },
        callBackFn = msg => {
          if (typeof cb == "function") cb.call(me, msg);
        };

      //自营
      if (me.$STORE_LIST.SELF == storeId) {
        callBackFn("success");
      } else if (me.$STORE_LIST.KLT == storeId) {
        //快联通
        me.$http
          .get("/shop/kltAreaStock", { params })
          .then(res => {
            me.curSpec.inventory = res.data && res.data.klt_RemainNum;
            callBackFn("success");
          })
          .catch(err => {
            me.curSpec.inventory = 0;
            callBackFn("error");
          });
      }
    },

    //地址列表关闭
    onAutoCloseForAddress() {
      let me = this;
      me.showPopupAddress = false;
    },

    //预览
    onPreview() {
      let me = this;
      me.showPreview = true;
      me.preViewIdx = me.current;
    },

    //预览图关闭
    onPreviewClose() {
      let me = this;
      me.showPreview = false;
    },

    //轮播索引
    onChange(idx) {
      let me = this;
      me.current = idx;
    }
  }
};
