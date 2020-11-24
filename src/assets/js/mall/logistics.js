import { mapState } from "vuex";
export default {
  name: "DefaultLogistic",
  data() {
    return {
      queryParams: {},
      logistics: {} //列表
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
      me.getLogistics();
    },
    //商城
    getLogistics() {
      let me = this,
        params = {
          order_id: me.queryParams.order_id
        };

      me.$http.get("/order/orderLogistics", { params }).then(res => {
        me.logistics = res.data.map(item =>
          item.map(inner => {
            inner["expand"] = false;
            return inner;
          })
        );
      });
    },

    //点击事件
    onView(item) {
      let me = this;
      return (item["expand"] = !item["expand"]);
    },

    //按钮文字
    showLogisText(item) {
      return item["expand"] ? "收起物流" : "展开物流";
    }
  }
};
