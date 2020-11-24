import { mapState, mapMutations } from "vuex";
export default {
  name: "Address",
  data() {
    return {
      queryParams: { id: -1 },
      addressList: [],
      hasChoose: false
    };
  },

  computed: {
    ...mapState(["userInfo"]),

    needFixed() {
      let me = this,
        classList = [];
      if (!me.addressList.length) {
        classList.push("normal-btns");
      } else {
        classList.push("van-hairline--top");
      }
      return classList.join(" ");
    }
  },

  created() {
    let me = this;
    me.queryParams = me.$route.query;
    //是否可选择地址
    me.hasChoose = me.queryParams.hasCheckd == 1;
    me.getAddressList();
  },

  methods: {
    ...mapMutations(["setCurCheckAddress"]), //设置选中地址

    init() {},

    getAddressList() {
      let me = this;

      //清空缓存中已选地址
      me.setCurCheckAddress({
        address: null
      });

      //拉取地址列表
      me.$http
        .get("/user/userAddressList", {
          params: {
            uid: me.userInfo.uid
          }
        })
        .then(res => {
          let data = res.data || [];
          data.forEach(item => {
            if (me.hasChoose && me.queryParams.id == item.id) {
              me.setCurCheckAddress({
                address: item
              });
            }
          });

          me.addressList = data;
        });
    },

    //新增地址
    onAddAddress(item) {
      let me = this;
      me.$router.push("/user/addressAdd");
    },

    //编辑地址
    toDetail(item) {
      let me = this;

      me.$router.push({
        path: "/user/editAddress",
        query: {
          uid: item.user_id,
          addr_id: item.id
        }
      });
    },

    //若是可选择地址则存入state中
    onChooseAddress(item) {
      let me = this;
      if (me.hasChoose) {
        me.setCurCheckAddress({
          address: item
        });
        me.$router.back();
      }
    }
  }
};
