import { mapState } from "vuex";
export default {
  name: "SaleAfterList",
  data() {
    return {
      queryParams: {},
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
  methods: {
    init() {
      let me = this;
    },

    mescrollInit(mescroll) {
      let me = this;
      me.mescroll = mescroll;
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
        .get("/orderservice/afterSaleList", { params,isLoading:false  })
        .then(rst => {
          let curData = (rst.data && rst.data.items) || [];

          if (me.pageNum == 1) {
            me.orderList = [];
          }

          me.orderList = [...me.orderList, ...curData];
          me.$nextTick(() => {
            me.mescroll.endByPage(curData.length,rst.data && rst.data.total_pages || 0);
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
          service_id: item.id,
          uid: me.userInfo.uid
        },
        url = "",
        confirmText = "";

      switch (status) {
        case "revoke":
          url = "/orderservice/revokeAfterSale";
          confirmText = "确认撤销售后操作吗";
          break;
        case "return":
          //跳转退货页面
          return me.$router.push({
            path: "/mall/saleAfterReturn",
            query: {
              service_id: data.service_id,
              store_id: item.store_id
            }
          });
        case "restart":
          url = "/orderservice/reLaunch";
          confirmText = "确认重新发起售后";
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
              me.mescroll.scrollTo(0,0);
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
        { status: saleAfterStatus } = item,
        isShow = false;
      // return true;
      switch (status) {
        case "1":
          //撤销售后
          isShow = saleAfterStatus == 0;
          break;
        case "2":
          //退货
          isShow = saleAfterStatus == 1;
          break;
        case "3":
          //重新发起

          isShow = ["2", "3", "4", "5", "6", "7"].indexOf(saleAfterStatus) > -1;
          break;
        default:
          isShow = false;
          break;
      }
      return isShow;
    }
  }
};
