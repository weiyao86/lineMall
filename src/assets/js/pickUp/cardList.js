export default {
  name: "CardList",
  data() {
    return {
      queryParams: {},
      cardList: []
    };
  },

  filters:{
    getTextByStatus(status){
     
      return status == 0 ? '未发货' : status==1 ? '已发货' : '已收货';
    }
  },
  created() {
    let me = this;
    me.init();
  },

  methods: {
    init() {
      let me = this;
      me.queryParams = me.$route.query;
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
        uid: me.queryParams.uid,
        limit: me.limit,
        page: me.pageNum
      };

      me.$http
        .get("/pickupCard/orderList", { params })
        .then(rst => {
          let curData = (rst.data && rst.data.items) || [];

          if (me.pageNum == 1) {
            me.cardList = [];
          }
          // me.cardList =[];
          me.cardList = [...me.cardList, ...curData];
          
          me.$nextTick(() => {
            me.mescroll.endByPage(curData.length, rst.data && rst.data.total_pages || 0);
          });
        })
        .catch(error => me.mescroll.endErr());
    },

    isShowBtn(status){
      return status == 1 || status == 2;
    },

    //查看物流
    onSearchLogistics(item) {
      let me = this;
      me.$router.push({
        path: "/pickUp/logistics",
        query: {
          type: "pickup",
          deliver_no: item.deliver_no,
          express_no: item.express_no,
          express_name:item.express_name
        }
      });
    }
  }
};
