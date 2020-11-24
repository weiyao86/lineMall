import { mapState } from "vuex";
export default {
  name: "PersonInfo",
  data() {
    return {
      queryParams: {},
      company: "company",
      phone: "phone",
      nickName: "nickName",
      person: {}
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
      let me = this,
        params = { uid: me.userInfo.uid };
      me.$http
        .get("/user/index", { params })
        .then(res => {
          me.person = res.data;
        });
    },

    onSave() {
      let me = this,
        data = {
          uid: me.userInfo.uid,
          unit: me.person.unit,
          username: me.person.username
        };

      me.$http
        .post("/user/saveUserInfo", { data })
        .then(res => me.$toast.success("保功成功!"));
    }
  }
};
