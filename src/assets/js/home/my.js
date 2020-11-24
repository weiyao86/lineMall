import VConsole from "vconsole";
import { mapState } from "vuex";
export default {
  name: "My",
  data() {
    return {
      avatarImg: "",
      userName: "",
      count: 1 //调出调试模式
    };
  },

  computed: {
    ...mapState(["userInfo"])
  },
  created() {
    let me = this,
      user = me.userInfo;

    [me.avatarImg, me.userName] = [user.headimgurl, user.nickname];
  
  },

  mounted() {},

  methods: {
    init() {},

    onAvatar() {
      let me = this;
      if (me.count++ >= 10) {
        me.vcon = new VConsole();
      }
    },

    //退出登录成功跳转登录页
    logout() {
      let me = this,
        data = {
          uid: me.userInfo.uid
        };

      me.$dialog
        .confirm({
          title: "系统提示",
          message: "确认退出当前帐号?"
        })
        .then(() =>
          me.$http.post("/login/loginOut", { data }).then(res => {
            me.$router.push("/user/auth");
          })
        );
    }
  }
};
