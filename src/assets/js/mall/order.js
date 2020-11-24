import { mapState } from "vuex";
export default {
  name: "Order",
  data() {
    return {
      queryParams: {},
      showPopup: false,
      orderList: [] //列表
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

  activated() {
    let me = this;

    if (!me.$route.meta["isBack"]) {
      //重新加载页面
      me.onReload();
    }
    me.$route.meta["isBack"] = false;
  },

  methods: {
    init() {
      let me = this;
    },

    mescrollInit(mescroll) {
      let me = this;
      me.mescroll = mescroll;
    },

    onReload() {
      let me = this;
      me.mescroll.scrollTo(0, 0);
      me.mescroll.resetUpScroll();
    },

    //上拉加载
    upCallback(page, mescroll) {
      let me = this;
      me.pageNum = page.num;

      let params = {
        uid: me.userInfo.uid,
        limit: me.limit,
        page: me.pageNum
      };

      me.$http
        .get("/order/singleOrderList", { params, isLoading: false })
        .then(rst => {
          let curData = (rst.data && rst.data.items) || [];

          if (me.pageNum == 1) {
            me.orderList = [];
          }

          me.orderList = [...me.orderList, ...curData];
          me.$nextTick(() => {
            me.mescroll.endByPage(
              curData.length,
              (rst.data && rst.data.total_pages) || 0
            );
          });
        })
        .catch(error => me.mescroll.endErr());
    },

    //跳转商品详情
    onToDetail(item) {
      let me = this;
      item.goods_id &&
        me.$router.push({
          path: "/mall/detail",
          query: {
            id: item.goods_id
          }
        });
    },

    //按不同功能区分调用
    onClickForFeature(item, status) {
      let me = this,
        data = {
          order_id: item.order_id,
          uid: me.userInfo.uid
        },
        url = "",
        confirmText = "";

      switch (status) {
        case "now":
          //跳转支付页
          return me.$router.push({
            path: "/mall/paysubmit",
            query: data
          });
          break;
        case "cancel":
          url = "/order/cancelOrder";
          confirmText = "确认取消订单吗";
          break;
        case "refound":
          url = "/order/applyRefund";
          confirmText = "确认申请退款吗";
          break;
        case "saleafter":
          //跳转售后页
          return me.$router.push({
            path: "/mall/saleAfter",
            query: {
              order_id: data.order_id
            }
          });
          break;
        case "search":
          //跳转物流页
          return me.$router.push({
            path: "/mall/logistics",
            query: {
              order_id: data.order_id
            }
          });
          break;
        case "confirm":
          url = "/order/confirmReceipt";
          confirmText = "确认收到商品";
          break;
        case "del":
          url = "/order/deleteOrder";
          confirmText = "确认删除订单吗";
          break;
        default:
          break;
      }

      let invoke = () => {
        me.$http.post(url, { data }).then(res => {
          me.$toast({
            type: "success",
            message: res.msg,
            onClose() {
              me.mescroll.resetUpScroll();
            }
          });
        });
      };

      //是否需要提示
      if (confirmText) {
        me.$dialog
          .confirm({
            title: "提示",
            message: confirmText
          })
          .then(() => {
            invoke();
          });
      } else {
        invoke();
      }
    },

    //根据状态隐/显
    isShowBtn(item, status) {
      let me = this,
        {
          pay_status: payStatus,
          order_status: orderStatus,
          shipping_status: shippingStatus
        } = item,
        isShow = false;
      // return true;
      switch (status) {
        case "1":
          //立即兑换  and  取消订单
          isShow = payStatus == 0 && orderStatus == 1;
          break;
        case "2":
          //申请退款
          isShow = payStatus == 1 && orderStatus == 2;
          break;
        case "3":
          //查看物流  and  申请售后 and 确认收货
          isShow = payStatus == 1 && orderStatus == 3 && shippingStatus == 1;
          break;
        case "4":
          //删除订单
          isShow = orderStatus == 6;
          break;
        default:
          isShow = false;
          break;
      }
      return isShow;
    }
  }
};
