import { mapState } from "vuex";
import Specification from "@components/Specification";
export default {
  name: "ShopCart",
  data() {
    return {
      showPopup: false,
      specData: {}, //传递给组件规格对象
      curClickItem: {}, //当前点击对象
      cartList: [], //列表
      globalCkd: false,
      totalPrice: 0 //总价格
    };
  },

  computed: {
    ...mapState(["userInfo"])
  },

  components: { Specification },

  created() {
    let me = this;
    me.init();
  },
  methods: {
    init() {
      let me = this;
      me.getCartList();
    },

    //pull list
    getCartList() {
      let me = this,
        params = {
          uid: me.userInfo.uid
        };

      me.$http.get("/cart/index", { params }).then(res => {
        me.cartList = res.data || [];
      });
    },

    //规格
    onOpenLayer(item) {
      let me = this,
        params = {
          goods_id: item.goods_id
        };
      me.curClickItem = item;
      me.$http.get("cart/cartSpecs", { params }).then(res => {
        me.specData = {
          id: item.goods_specs_id,
          name: item.specs_name,
          price: item.specs_price,
          img: item.image,
          inventory: item.inventory,
          goodsName: item.goods_name,
          specs: res.data.specs || [],
          hasNum: false //是否显示数量操作
        };
        me.showPopup = true;
      });
    },

    //关闭规格层，修改规格
    onCloseLayer(specData) {
      let me = this,
        {
          id: goods_specs_id,
          name: specs_name,
          price: specs_price,
          inventory,
          img
        } = specData,
        data = {
          uid: me.userInfo.uid,
          cart_id: me.curClickItem.cart_id,
          goods_specs_id: goods_specs_id
        };

      me.$http.post("/cart/cartUpdate", { data }).then(res => {
        me.curClickItem = Object.assign(me.curClickItem, {
          goods_specs_id,
          specs_name,
          specs_price,
          inventory
        });

        me.curClickItem["goods_num"] = 1;
        me.curClickItem["checked"] = true;
        me.curClickItem["image"] = img;
        me.validAllCk();
      });

      me.showPopup = false;
    },

    chooseSpec() {},

    //获取总价
    calcAllPrice() {
      let me = this,
        data = {
          uid: me.userInfo.uid,
          goods_nums: {}
        },
        arr = me.getSelectItems();

      if (!arr.length) return (me.totalPrice = 0);

      arr.forEach((item, idx) => {
        data.goods_nums[item.goods_specs_id] = item.goods_num;
      });

      me.$http
        .post("/cart/countPrcie", { data })
        .then(res => {
          me.totalPrice = res.data.total_amount * 100;
        })
        .catch(error => {
          me.totalPrice = 0;
          me.globalCkd = false;
          me.onSelectAll();
        });
    },

    //delete cart
    onDelete(item) {
      let me = this,
        data = {
          uid: me.userInfo.uid,
          cart_id: item.cart_id
        };

      me.$dialog
        .confirm({
          title: "提示",
          message: "确认执行删除操作吗"
        })
        .then(() => {
          me.$http.post("/cart/deleteCart", { data }).then(res => {
            me.$toast({
              type: "success",
              message: res.msg,
              onClose() {
                me.getCartList();
              }
            });
          });
        });
    },

    onSubmit() {
      let me = this,
        arr = me.getSelectItems(),
        params = {
          uid: me.userInfo.uid,
          goods_nums: {}
        };

      if (!arr.length) return me.$toast("请选择商品");

      arr.forEach((item, idx) => {
        params.goods_nums[item.goods_specs_id] = item.goods_num; //转换使用
      });

      me.$router.push({
        path: "/mall/confirmOrder",
        query: {
          p: JSON.stringify(params)
        }
      });
    },

    toDetail(item) {
      let me = this;
      me.$router.push({
        path: "/mall/detail",
        query: {
          id: item.goods_id
        }
      });
    },

    getSelectItems() {
      let me = this,
        arr = [];

      me.cartList.forEach((item, idx) => {
        let child = item.children.filter(item => {
          return item["checked"];
        });
        arr.push(...child);
      });
      return arr;
    },

    //增减数量
    onChangeNum(item, val, e) {
      let me = this,
        data = {
          cart_id: item.cart_id,
          goods_num: item["goods_num"],
          goods_specs_id: item.goods_specs_id,
          uid: item.user_id
        };

      data.goods_num =
        val == "+"
          ? +data.goods_num + 1
          : val == "blur"
          ? e.target.value
          : +data.goods_num - 1;

      item["checked"] = true;

      me.$http
        .post("/cart/addGoodsNum", { data })
        .then(res => {
          me.validAllCk();
        })
        .catch(err => {
          setTimeout(() => {
            item["goods_num"] = item["inventory"] || 1;
            me.validAllCk();
          }, 2000);
        });
    },

    //全选
    onSelectAll() {
      let me = this;
      me.onCategroyChange(-1, me.globalCkd);
    },

    //选中店铺
    onCategroyChange(index, outVal = undefined) {
      let me = this;

      me.cartList.forEach((item, idx) => {
        //全局全选
        if (outVal == undefined) {
          if (index == idx) {
            //局部全选
            item.children &&
              item.children.forEach(res => (res["checked"] = item["checked"]));
          }
        } else {
          //局部全选
          item.children &&
            item.children.forEach(res => (res["checked"] = outVal));
        }
      });
      me.validAllCk();
    },

    validAllCk() {
      let me = this,
        globalCkdArr = [],
        ckd = false;

      me.cartList.forEach((item, idx) => {
        let allCkd = me.validChildCk(item);
        globalCkdArr.push(allCkd);
      });

      globalCkdArr = [...new Set(globalCkdArr)];
      if (globalCkdArr.length > 1) {
        ckd = false;
      } else {
        ckd = !!globalCkdArr[0];
      }
      me.globalCkd = ckd;

      //选中checkbox 即获取总价格
      me.calcAllPrice();
    },

    //查询当前item所有子级
    validChildCk(item) {
      let me = this,
        children = item.children,
        len = children.length;

      if (children && len) {
        let allChildCkd = children.every(res => res["checked"]);
        item["checked"] = allChildCkd;
        return allChildCkd;
      }
      return false;
    }
  }
};
