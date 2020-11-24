import { mapState } from "vuex";
export default {
  name: "CardDetail",
  data() {
    return {
      queryParams: {},
      detailList: []
    };
  },

  computed: {
    ...mapState(["userInfo"])
  },

  created() {
    let me = this;
    me.queryParams = me.$route.query;
  },

  methods: {
    init() {},

    mescrollInit(mescroll) {
      let me = this;
      me.mescroll = mescroll;
    },

    upCallback(page, mescroll) {
      let me = this;
      me.pageNum = page.num;
      let params = {
        card_id: me.queryParams.cardId,
        limit: me.limit,
        page: me.pageNum
      };

      me.$http
        .get("/user/cardDetail", { params: params })
        .then(rst => {
          let curData = rst.data && rst.data.items || [];
          
          if (me.pageNum == 1) {
            me.detailList = [];
          }

          me.detailList = [...me.detailList, ...curData];
          me.$nextTick(() => {
            me.mescroll.endByPage(curData.length,rst.data && rst.data.total_pages || 0);
          });
          
        })
        .catch(error => me.mescroll.endErr());
    }
  }
};
