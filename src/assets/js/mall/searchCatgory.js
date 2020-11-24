export default {
  name: "searchCatgory",

  data() {
    return {
      queryParams: {},
      key: "",
      descList: [], //列表
      hotWords: {
        keyword: "",
        filterArr: [],
        price: {
          lowPrice: "",
          highPrice: ""
        }
      },
      supplier: [], //筛选商家
      lowPrice: "", //筛选价格
      highPrice: "",
      //查询条件
      tags: [], //tags
      showPopup: false,
      numReg: /((^[1-9]\d*)|^0)(\.\d{0,2}){0,1}$/ //价格验证，含小数
    };
  },

  created() {
    let me = this;
    me.init();
  },

  watch: {
    lowPrice(nval, oval) {
      nval != 0 && !this.numReg.test(nval) && (this.lowPrice = oval);
    },
    highPrice(nval, oval) {
      let me = this;
      nval != 0 && !this.numReg.test(nval) && (this.highPrice = oval);
    }
  },

  activated() {
    let me = this;

    if (!me.$route.meta["isBack"]) {
      //重新加载页面
      me.init();
      me.onFilterReset();
    }
    me.$route.meta["isBack"] = false;
  },

  methods: {
    //初始化，设置初始查询条件，加载筛选数据
    init() {
      let me = this;
      me.queryParams = me.$route.query;
      me.setSearchText();
      me.getSupplier();
      me.filterOptsions();
    },

    mescrollInit(mescroll) {
      let me = this;
      me.mescroll = mescroll;
    },

    //筛选商家列表
    getSupplier() {
      let me = this;
      me.$http.get("/shop/storeList").then(
        res =>
          (me.supplier =
            res.data &&
            res.data.map(d => {
              d["checked"] = false;
              return d;
            }))
      );
    },

    //重置筛选
    onFilterReset() {
      let me = this;
      me.lowPrice = "";
      me.highPrice = "";
      me.supplier.forEach(res => (res.checked = false));
      me.onSearch();
    },

    //确认筛选条件,设置tags组数据
    filterOptsions() {
      let me = this;

      //低价大于高价时互换
      if (me.lowPrice && me.highPrice && +me.lowPrice > +me.highPrice) {
        let swap = me.lowPrice;
        me.lowPrice = me.highPrice;
        me.highPrice = swap;
      }

      let arr = [...me.supplier.filter(res => res.checked)];
      me.hotWords = {
        keyword: me.key,
        filterArr: arr || [],
        price: {
          lowPrice: me.lowPrice,
          highPrice: me.highPrice
        }
      };

      //设置标签
      me.setTags();
    },

    //设置初始值
    setSearchText() {
      let me = this;
      me.key = me.queryParams.keyWord;
    },

    //查询
    onSearch() {
      let me = this;
      me.filterOptsions();
      me.mescroll.resetUpScroll(true);
      setTimeout(() => me.mescroll.scrollTo(0, 0), 16);
    },

    onFilterConfirm() {
      let me = this;

      //关闭弹层
      me.showPopup = false;
      me.onSearch();
    },

    //上拉加载
    upCallback(page, mescroll) {
      let me = this;
      me.pageNum = page.num;

      let storeids = (me.hotWords.filterArr.map(res => res.id) || []).join(",");

      let params = {
        keyswords: me.hotWords.keyword,
        lowPrice: me.hotWords.price.lowPrice,
        highPrice: me.hotWords.price.highPrice,
        storeid: storeids,
        categoryId: me.queryParams.id || "",
        limit: me.limit,
        page: me.pageNum
      };

      me.$http
        .get("/shop/shopList", { params, isLoading: false })
        .then(rst => {
          let curData = (rst.data && rst.data.items) || [];

          if (me.pageNum == 1) {
            me.descList = [];
          }

          me.descList = [...me.descList, ...curData];
          me.$nextTick(() => {
            me.mescroll.endByPage(
              curData.length,
              (rst.data && rst.data.total_pages) || 0
            );
          });
        })
        .catch(error => me.mescroll.endErr())
        .finally(_ => {
          //首次进入页面按传入ID查询，后续无需要
          me.queryParams.id = "";
        });
    },

    onFilter() {
      let me = this;
      me.showPopup = !me.showPopup;
    },

    //根据移除项组装查询条件
    removeTagData(item) {
      let me = this;

      switch (item.id) {
        case "key":
          me.key = me.hotWords["keyword"] = "";
          break;
        case "price":
          me.lowPrice = me.highPrice = me.hotWords["price"][
            "lowPrice"
          ] = me.hotWords["price"]["highPrice"] = "";
          break;
        default:
          me.supplier = [...me.supplier].map(res => {
            item.id == res.id && (res["checked"] = false);
            return res;
          });
          break;
      }
    },

    //标签数据
    setTags() {
      let me = this,
        params = me.hotWords;

      me.tags.length = 0;

      if (params.keyword) {
        me.tags.push({
          id: "key",
          name: params.keyword
        });
      }
      if (params.price.lowPrice || params.price.highPrice) {
        me.tags.push({
          id: "price",
          name: `${(params.price.lowPrice != "" &&
            params.price.lowPrice + "元") ||
            "空"}—${(params.price.highPrice != "" &&
            params.price.highPrice + "元") ||
            "空"}`
        });
      }

      if (params.filterArr) {
        me.tags = [
          ...me.tags,
          ...params.filterArr.map(res => {
            res["name"] = res["store_name"];
            return res;
          })
        ];
      }
    },

    //移除当前标签，重新查询
    onCloseTag(item) {
      let me = this;

      me.removeTagData(item);
      me.onSearch();
    },

    toDetail(item) {
      let me = this;
      me.$router.push({
        path: "/mall/detail",
        query: {
          id: item.id
        }
      });
    }
  }
};
