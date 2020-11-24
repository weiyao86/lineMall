import { mapState } from "vuex";
export default {
  name: "CardAdd",
  data() {
    return {
      cardNo: "",
      cardPwd:""
    };
  },

  computed: {
    ...mapState(["userInfo"])
  },
  methods: {

    //添加兑换卡
    onSubmit() {
      let me = this,
        data = {
          uid: me.userInfo.uid,
          number: me.cardNo,
          password:me.cardPwd
        };

      me.$http
        .post("/user/addCard", {
          data
        })
        .then(res =>
          me.$toast({
            type: "success",
            message: res.msg,
            onClose() {
              me.$router.back();
            }
          })
        );
    }
  }
};
