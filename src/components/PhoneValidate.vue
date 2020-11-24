 <template>
  <div class="auth-wrap">
    <nav-bar :fixed="false" v-if="pageType != 1"></nav-bar>
    <div class="wrap" :class="{ 'dis-valid': pageType == 2, 'edit-dis-valid': pageType == 3 }">
      <p class="to-msg-text" v-html="validText" v-if="pageType != 3"></p>
      <van-form @submit="onSubmit" ref="form" validate-first>
        <van-field class="cell-custom-item" v-if="pageType != 2" @input="onInputPhone" placeholder="请输入手机号" v-model="tel" type="tel" name="tel" :rules="[{ required: true, pattern: /1[3-9]\d{9}$/, message: '请正确输入手机号' }]" clearable></van-field>
        <van-field class="cell-custom-item" placeholder="请输入验证码" v-model="coupon" type="digit" clearable :rules="[{ required: true}]">
          <template #button>
            <van-button size="small" type="primary" class="send-coupon" :class="{ disabled: sendBtnStatus }" @click.prevent.stop="onSendCoupon">{{ sendText }}</van-button>
          </template>
        </van-field>
        <!-- <p class="not-coupon">
          <span @click="onNoGetCoupon">收不到验证码?</span>
        </p> -->
        <van-button type="primary" size="large" :disabled="canSubmit" class="submit-btn">{{ submitBtnText }}</van-button>
      </van-form>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
export default {
  name: "PhoneValidate",
  props: {
    pageType: {
      type: Number,
      default: 1 //1-登录  2-验证身份 3-修改手机号
    }
  },
  data() {
    return {
      tel: "",
      coupon: "",
      sendText: "发送验证码",
      sendBtnStatus: true, //发送验证码是否可用
      wxInfo: null,
      countDownTime: 36 * 1000, //倒计时时间设置
      clearTime: null
    };
  },

  computed: {
    ...mapState(["userInfo"]),

    submitBtnText() {
      let type = this.pageType;
      return type == 1 ? "登录" : type == 2 ? "下一步" : "提交";
    },

    validText() {
      let me = this,
        text = "验证码登录";
      if (me.pageType == 2) {
        text = `向<span class="tel">${me.wxInfo.tel}</span>发送验证码`;
      }
      return text;
    },

    canSubmit() {
      let me = this;
      return !me.tel || !me.coupon;
    }
  },

  created() {
    let me = this;

    me.wxInfo = me.$route.query;
    switch (me.pageType) {
      case 1:
        me.wechatLogin();
        break;
      case 2:
        me.sendBtnStatus = false;
        me.tel = me.wxInfo.tel;
        break;
      default:
        break;
    }
  },

  methods: {
    ...mapMutations(["setUserInfo"]),
    //微信登录
    wechatLogin() {
      let me = this,
        href = window.location.href.replace("#", "%23"),
        sec = Math.random().toString(16).substr(2); //8-16 数字+字母

      if (!me.wxInfo.openid) {
        let fullUrl = `${me.$http.baseUrl}wechat/getUserInfo?type=1&redirect_url=${href}`;

        window.location.replace(fullUrl);
      } else {
        //清除本地用户相关缓存
        me.$rmStorage(["userToken", "userInfo"]);

        me.systemLogin();
      }
    },

    async systemLogin() {
      let me = this,
        userInfo = {
          openid: me.wxInfo.openid,
          nickname: me.wxInfo.nickname,
          sex: me.wxInfo.sex,
          province: me.wxInfo.province,
          city: me.wxInfo.city,
          headimgurl: me.wxInfo.headimgurl,
          unionid: me.wxInfo.unionid
        };
      let [err, res] = await me.$utils.getErrorAndSuccess(me.$http.post("/login/login", { data: userInfo }));

      // -1  未绑定
      if (res && res.status != -1) {
        me.toOtherPage(res);
      } else {
        console.log("仅通过openid登录失败,验证手机号,走提交流程!");
      }
    },

    onInputPhone(value) {
      let me = this;
      me.$refs.form
        .validate("tel")
        .then(() => {
          if (me.clearTime) return;
          me.sendBtnStatus = false;
        })
        .catch(() => {
          me.sendBtnStatus = true;
        });
    },

    //发送验证码
    onSendCoupon() {
      let me = this;

      if (!me.sendBtnStatus) {
        if (me.pageType == 2) {
          me.setCountDownFun();
        } else {
          me.$refs.form
            .validate("tel")
            .then(() => me.setCountDownFun())
            .catch((error) => {});
        }
      }
    },

    //发送验证码
    async invokeSendMsg() {
      let me = this,
        data = {
          mobile: me.tel
        };

      let [error, res] = await me.$utils.getErrorAndSuccess(me.$http.post("login/sendMsg", { data }));
      if (res) {
        me.$toast.success("短信验证码发送成功,请查看您的手机短信!");
      } else {
        console.log(error);
      }
    },

    setCountDownFun() {
      let me = this;
      let begin = +new Date(),
        end = begin + me.countDownTime;

      me.invokeSendMsg();
      me.$utils.getCountdown({
        begin: begin,
        end: end,
        callback: (res) => {
          if (res.isDone) {
            me.sendText = me.$options.data().sendText;
            me.sendBtnStatus = !me.sendBtnStatus;
          } else {
            me.sendText = Math.floor(res.dateTime / 1000) + "s";
          }
          me.clearTime = res.timer;
        }
      });

      me.$once("hook:beforeDestroy", () => {
        me.clearSmsTime();
      });

      me.sendBtnStatus = !me.sendBtnStatus;
    },

    clearSmsTime() {
      let me = this;
      me.clearTime && clearTimeout(me.clearTime);
    },

    //收不到验证码?
    onNoGetCoupon() {
      let me = this;

      me.$dialog.alert({
        title: "语音验证码",
        message: "我们将以电话的方式告知您验证码,\n请注意接听电话!",
        confirmButtonText: "知道了"
      });
    },

    //提交
    onSubmit() {
      let me = this,
        url = "",
        data = {
          mobile: me.tel,
          code: me.coupon
        };

      //登录 验证身份  修改手机号
      switch (me.pageType) {
        case 1:
          url = "/login/login";
          data["openid"] = me.wxInfo.openid;
          break;
        case 2:
          url = "/user/auditUser";
          data["uid"] = me.userInfo.uid;
          break;
        case 3:
          url = "/user/changeMob";
          data["uid"] = me.userInfo.uid;
          break;
        default:
          break;
      }

      me.$http
        .post(url, {
          data
        })
        .then((res) => {
          me.redirectByPageType(res);
        });
    },

    redirectByPageType(res) {
      let me = this;

      switch (me.pageType) {
        case 1:
          me.toOtherPage(res);
          break;
        case 2:
          me.toEditPhonePage();
          break;
        default:
          me.toPersonInfo();
          break;
      }
    },

    //登录成功,写入缓存并跳转
    toOtherPage(res) {
      let me = this,
        lastFullPath = me.$getStorage("lastFullPath") || "/main/index",
        data = res.data,
        userInfo = {
          uid: data.id,
          city: data.city,
          headimgurl: data.headimgurl,
          mobile: data.mobile,
          nickname: data.nickname,
          openid: data.openid,
          province: data.province,
          sex: data.sex,
          status: data.status,
          unionid: data.uniocnid
        };

      me.$setStorage("userToken", res.token);
      me.$setStorage("userInfo", userInfo);
      //用户信息另存份为store中,为后期调用准备
      me.setUserInfo(userInfo);
      me.$router.replace(lastFullPath);
    },

    //修改手机号
    toEditPhonePage() {
      let me = this;

      me.$router.replace({ path: "/user/editPhone" });
    },

    //个人资料
    toPersonInfo() {
      let me = this;
      me.$router.back();
    }
  }
};
</script>
<style lang="scss" scoped>
.auth-wrap {
  .wrap {
    padding: 80px 50px;
    /deep/ .van-cell {
      padding: 20px 0;
      &::after {
        left: 0;
        right: 0;
      }
    }
    .send-coupon {
      width: 180px;
      height: 56px;
      font-size: 30px;
      border-color: $send-msg-bg;
      background: transparent;
      color: $send-msg-bg;
      padding: 0;
      &.disabled {
        color: $disabled-bg;
        border-color: $disabled-bg;
      }
    }
    .not-coupon {
      font-size: 24px;
      color: #666;
      margin-top: 30px;
    }
    .submit-btn {
      margin-top: 90px;
      height: 90px;
      border-radius: 10px;
      background: $edit-buttons-bg;
      border-color: $edit-buttons-bg;
    }
    /deep/ .van-button--disabled {
      background: $disabled-bg;
      border-color: $disabled-bg;
      cursor: not-allowed;
      opacity: 0.5;
    }
    .to-msg-text {
      font-size: 36px;
      font-weight: 500;
      color: $text-color;
      padding-bottom: 24px;
      /deep/ .tel {
        font-weight: bold;
        padding: 0 10px;
      }
    }
    .cell-custom-item {
      height: 140px;
      align-items: flex-end;
    }
  }
  .dis-valid {
    padding: 50px 50px;
  }
  .edit-dis-valid {
    padding: 40px 50px;
  }
}
</style>