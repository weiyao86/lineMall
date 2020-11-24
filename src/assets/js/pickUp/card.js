export default {
  name: "PickUpCard",
  data() {
    return {
      queryParams: {},
      cardNo: ""
    };
  },

  computed: {
    canSubmit() {
      let me = this;
      return !me.cardNo;
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

    //提交
    onSubmit() {
      let me = this,
        data = {
          uid: me.queryParams.uid,
          number: me.cardNo
        };

      me.$http.post("/pickupCard/getCardNo", { data }).then(res => {
        me.$router.push({
          path: "/pickUp/WriteCard",
          query: {
            uid: me.queryParams.uid,
            number: me.cardNo,
            goods_id: me.queryParams.goods_id
          }
        });
      });
    }
  }
};
