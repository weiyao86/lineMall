<template>
  <div class="logistic-wrap">
    <nav-bar></nav-bar>
    <section class="content-wrap list">
      <div class="header">
        <p class="item-wrap">
          <span class="c-item">快递公司:</span><span class="c-item">{{ logistics.shipping_name }}</span>
        </p>
        <p class="item-wrap">
          <span class="c-item">快递单号:</span><span class="c-item">{{ logistics.shipping_number }}</span>
        </p>
      </div>
      <div class="detail">
        <van-steps direction="vertical" :active="0">
          <van-step v-for="(item, idx) in logistics.list" :key="idx">
            <h3>{{ item.context }}</h3>
            <p>{{ item.ftime }}</p>
            <template #inactive-icon>
              <van-icon name="checked" class="step-icon" />
            </template>
          </van-step>
        </van-steps>
      </div> 
    </section>
  </div>
</template>
        
<script>
import { mapState } from "vuex";
export default {
  name: "Logistics",
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
      //提货卡
      if (me.queryParams.type && me.queryParams.type == "pickup") {
        me.getPickUpLogistics();
      } else {
        //default 商城
        me.getLogistics();
      }
    },
    //商城
    getLogistics() {
      let me = this,
        params = {
          order_id: me.queryParams.order_id
        };

      me.$http.get("/order/orderLogistics", { params }).then((res) => {
        me.logistics = res.data;
      });
    },

    //提货卡
    getPickUpLogistics() {
      let me = this,
        params = {
          company: me.queryParams.express_no,
          num:me.queryParams.deliver_no
        };

      me.$http.get("/express/queryExpress", { params }).then((res) => {
        let data = res.data.data || [];
        if (!data.length) {
          return me.$toast.fail(res.data.message);
        }
        let { shipping_name, shipping_number, data: list } = Object.assign({}, res.data, {shipping_name:me.queryParams.express_name, shipping_number: me.queryParams.deliver_no });
        me.logistics = { shipping_name, shipping_number,  list };
      });
    }
  }
};
</script>

<style lang="scss" scoped >
.logistic-wrap {
  min-height: 100%;
  background: $theme-gray-bg;

  .list {
    .header {
      position: sticky;
      top: 0;
      height: 130px;
      padding: 0 30px;
      background: #fff;
      display: flex;
      flex-flow: column;
      justify-content: center;
      font-size: 30px;
      font-weight: bold;
      z-index: 10;
      .item-wrap {
        line-height: 50px;
      }

      .c-item {
        font-weight: bold;
        padding-right: 20px;
      }
    }

    .detail {
      background: #fff;
      margin-top: 30px;
      padding: 0 30px;

      /deep/ {
        .van-step__icon--active {
          font-size: 32px;
          color: $font-active-cls;
        }

        .van-step__title {
          font-size: 26px;
          word-break: break-all;
          &--active {
            font-size: 26px;
            color: $text-color;
            font-weight: bold;
          }
        }

        .step-icon {
          color: #e5e5e5;
          font-size: 32px;
        }
      }
    }
  }
}
</style>