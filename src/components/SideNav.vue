<template>
  <div class="footer-nav" v-safe-area-inset-bottom :class="sideClass">
    <div class="arrow-wrap" @click="onSide">
      <van-icon name="arrow-left" class="arrow" />
    </div>
    <router-link class="item" to="/main/index">
      <van-icon name="shop-o" />
      <span class="link">商场首页</span>
    </router-link>
    <router-link class="item hair-line-left" to="/mall/category">
      <van-icon name="apps-o" />
      <span class="link">分类</span>
    </router-link>
    <router-link class="item hair-line-left" to="/mall/shopCart">
      <van-icon name="shopping-cart-o" :badge="shopCartNum" />
      <span class="link">购物车</span>
    </router-link>
    <router-link class="my" to="/main/my">
      <div class="my-icon">
        <van-icon name="contact" />
      </div>
      <span to="/main/my" class="link">我的</span>
      <div class="my-icon side-active" v-if="sideFlag" @click.prevent.stop="onSide">
        <van-icon name="contact" />
      </div>
    </router-link>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  name: "SideNav",
  data() {
    return {
      sideFlag: true
    };
  },
  components: {},
  watch: {
    $route() {
      this.sideFlag = true;
    }
  },
  computed: {
    ...mapState(["shopCartNum"]),
    sideClass() {
      return this.sideFlag ? "footer-side" : "";
    }
  },

  created() {
    let me = this;
    //获取购物车数量
    me.getShopCartNum();
  },

  methods: {
    ...mapActions(["getShopCartNum"]),
    onSide() {
      let me = this;
      me.sideFlag = !me.sideFlag;
    }
  }
};
</script>
<style lang="scss" scoped>
.footer-nav {
  display: flex;
  border-radius: 0 40px 0 0;
  background: #fff;
  box-shadow: 0 0px 20px 0px #fe5502;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  line-height: 100px;
  font-size: 32px;
  z-index: 100;
  overflow: hidden;
  transition: all 0.3s ease;

  @at-root .footer-side {
    transform: translateX(-670px);
  }

  /deep/ .van-icon {
    margin: 10px;
    top: 4px;
  }
  /deep/ .van-icon-arrow-left {
    color: #ccc;
    font-size: 28px;
  }

  .arrow-wrap {
    width: 60px;
    text-align: center;
  }
  .item {
    flex: 1;
    text-align: center;
    position: relative;
    .link {
      color: #333;
      font-size: 24px;
      flex: 1;
    }
  }

  .hair-line-left::before {
    content: "";
    width: 1px;
    background: #ccc;
    position: absolute;
    left: 0;
    top: 10%;
    bottom: 10%;
    transform: scale(0.5);
  }
  .my {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 200px;
    background: #fe5502;

    .link {
      color: #fff;
      font-size: 32px;
    }
    .my-icon {
      color: #fff;
    }
    .side-active {
      position: absolute;
      right: 0;
      background: #fe5502;
      width: 90px;
      text-align: center;
      z-index: 10;
    }
  }
}
</style>