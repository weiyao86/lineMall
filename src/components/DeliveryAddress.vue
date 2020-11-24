<template>
  <div class="delivery-list-wrap">
    <nav-bar :fixed="false" :leftArrow="showArrow" :overrideBack="true" @onClickBack="onBack" title="配送至"></nav-bar>
    <div class="address-wrap" v-if="!showArrow">
      <ul class="list" v-if="addressList.length">
        <template v-for="item in addressList">
          <!-- van-hairline--bottom -->
          <li class="item " :key="item.id" @click="onChooseAddress(item)">
            <div class="list-wrap">
              <van-icon name="success" class="v-icon active-icon" v-if="chooseItem.id == item.id" />
              <van-icon name="location-o" class="v-icon" v-else />

              <span class="address">{{ item.address }}</span>
            </div>
          </li>
        </template>
      </ul>
      <div class="btns-wrap" v-safe-area-inset-bottom>
        <van-button type="primary" size="large" class="submit-btn" @click="onCurrentHide">选择其它地址</van-button>
      </div>
    </div>
    <div class="other-address" v-else>
      <choose-address ref="addressCmp" :selectArea="selectArea" @chooseAddressAfter="chooseAddressAfter"></choose-address>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import ChooseAddress from "@components/ChooseAddress";
export default {
  name: "DeliveryAddress",
  props: {
    chooseItem: {
      type: Object,
      default: {}
    }
  },
  components: {
    ChooseAddress
  },
  data() {
    return {
      addressList: [],
      selectArea: [],
      pageIndex: 1 //1-列表页  2-地址页
    };
  },
  computed: {
    ...mapState(["userInfo"]),
    showArrow() {
      return this.pageIndex != 1;
    }
  },
  created() {
    let me = this;
    me.getList();
  },
  mounted() {
    let me = this;
  },
  methods: {
    getList() {
      let me = this;
      //拉取地址列表
      me.$http
        .get("/user/userAddressList", {
          params: {
            uid: me.userInfo.uid
          }
        })
        .then((res) => {
          let data = res.data || [];
          me.addressList = data;
        });
    },

    //隐藏列表
    onCurrentHide() {
      let me = this;
      me.pageIndex = 2;
      me.loadAddress();
    },

    //切换page
    onBack() {
      let me = this;

      me.pageIndex = 1;
    },

    //加载自选地址
    loadAddress() {
      let me = this;
      me.$nextTick(() => {
        me.$refs.addressCmp.init();
      });
    },

    //自选地址
    chooseAddressAfter(navList) {
      let me = this;
      let addressList = [...navList],
        item = {
          province_id: (addressList[0] && addressList[0].id) || "0",
          city_id: (addressList[1] && addressList[1].id) || "0",
          district_id: (addressList[2] && addressList[2].id) || "0",
          street_id: (addressList[3] && addressList[3].id) || "0",
          address: ""
        };

      addressList.forEach((innerItem) => (item.address += " " + innerItem.name));

      me.onChooseAddress(item);
    },

    //选中地址
    onChooseAddress(item) {
      let me = this;
      // me.pageIndex = 1;

      item["area_name"] || (item["area_name"] = "");
      item["address"] || (item["address"] = "");
      me.$emit("onChooseAddress", item);
    }
  }
};
</script>
<style lang="scss" scoped>
.delivery-list-wrap {
  min-height: 100%;
  .address-wrap {
    position: absolute;
    top: $nav-height;
    bottom: 0;
    width: 100%;
    display: flex;
    flex-flow: column;
    .list {
      flex: 1;
      overflow: auto;
      padding-bottom: 50px;
      .item {
        padding: 0 30px;
        overflow: hidden;
        display: flex;

        .list-wrap {
          flex: 1;
          display: flex;
          align-items: center;
          margin: 10px 0;
          .v-icon {
            font-size: 32px;
            padding-right: 20px;
          }
          .active-icon {
            color: $font-active-cls;
          }

          .address {
            font-size: 26px;
            line-height: 46px;
          }
        }
      }
    }

    .btns-wrap {
      margin: 10px 50px;
      .submit-btn {
        background-color: $edit-buttons-bg;
        border-color: $edit-buttons-bg;
        font-size: 30px;
        height: 90px;
        vertical-align: middle;
        border-radius: 20px;
      }
    }
  }
  .other-address {
    position: absolute;
    top: $nav-height;
    bottom: 0;
    width: 100%;
    display: flex;
    flex-flow: column;
  }
}
</style>
