<template>
  <div class="catgroy-wrap">
    <slot name="nav">
      <nav-bar></nav-bar>
    </slot>
    <div class="content-wrap list">
      <van-sidebar ref="sidebar" class="sidebar" v-model="activeKey" v-ios-fix-scroll>
        <van-sidebar-item :title="item.name" v-for="item in cataGoryList" :key="item.id" @click="onSidebarClick($event, item)" />

        <van-sidebar-item v-if="categoryType != 'klt'">
          <template #title>
            <div @click.stop="toKltCategory($event)">优选商城</div>
          </template>
        </van-sidebar-item>
      </van-sidebar>

      <div class="r-content">
        <!-- 导航 -->

        <template v-if="navContent.length">
          <ul class="category-nav-div">
            <template v-for="item in navContent">
              <li class="nav-item" :key="item.id" @click="onClickNav(item)">
                <span class="nav-text">{{ item.name }}</span>
                <van-icon name="arrow"></van-icon>
              </li>
            </template>
          </ul>
        </template>

        <div class="r-content-inner" ref="content" v-ios-fix-scroll>
          <template v-for="content in contentList">
            <div class="category-div" :key="content.id">
              <p class="c-title">{{ content.name }}</p>
              <van-grid class="c-grid" :column-num="3" :border="false">
                <van-grid-item class="grid-item" v-for="item in content.list" :key="item.id" @click="intoNext(item)">
                  <img class="img" v-lazy="item.logimage" alt="" />
                  <span class="text van-multi-ellipsis--l2">{{ item.name }}</span>
                </van-grid-item>
              </van-grid>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ScrollView from "@components/Scroll";
export default {
  name: "CatgoryCommon",
  props: {
    type: {
      type: String,
      default: "self"
    }
  },
  data() {
    return {
      queryParams: {},
      activeKey: 0,
      cataGoryList: [],
      contentList: [], //内容
      navContent: [], //导航数据
      types: ["self", "klt"] //self-自营  klt-快联通
    };
  },
  components: {
    ScrollView
  },
  created() {
    let me = this;
    me.init();
  },

  computed: {
    categoryType() {
      return this.type;
    }
  },

  activated() {
    let me = this;

    //导航滚动项
    if (me.lastSideBarItem) {
      
      me.lastSideBarItem.scrollIntoViewIfNeeded();
    }
    //内容滚动位置
    if (me.lastContentScroll) {
      me.$refs.content.scrollTop = me.lastContentScroll;
    }
  },
  methods: {
    init() {
      let me = this;

      me.queryParams = me.$route.query;

      me.loadCategory();
    },

    //分类导航栏
    loadCategory() {
      let me = this,
        params = {
          type: me.types[0] //自营
        };

      //1 优选商城
      if (me.categoryType == "klt") {
        params = {
          type: me.types[1]
        };
      }

      me.$http.get("/goodscategory/getCategoryList", { params }).then((res) => {
        me.cataGoryList = res.data || [];

        me.loadContent(res.data[me.activeKey]);

        me.$nextTick(() => (me.lastSideBarItem = me.$refs.sidebar.children[0].$el));
      });
    },

    //分类内容
    loadContent(item) {
      let me = this,
        params = {
          id: item.id
        },
        url = "/goodscategory/selfLowerLevelCategory";

      //1 优选商城
      if (me.categoryType == "klt") {
        params = {
          id: item.kltid
        };
        url = "/goodscategory/kltLowerLevelCategory";
      }

      me.$http.get(url, { params }).then((res) => {
        //存储原始数据供筛选使用
        let data = res.data || [];

        me.rawContentList = data;

        me.contentList = data;

        me.$nextTick(() => {
          me.$refs.content.scrollTop = 0;
        });
      });
    },

    //下一层级
    intoNext(item) {
      let me = this;

      if (!!item["leaf"]) {
        me.$router.push({
          path: "/mall/searchCatgory",
          query: {
            keyWord: "",
            id: item.id
          }
        });
      } else {
        //累加导航
        let parentNodes = [];
        me.bubble(item, parentNodes, me.rawContentList);
        me.navContent = [...parentNodes, item];

        //更改内容数据
        let cascadeList = me.cascadeBy(me.rawContentList, item.id);
        me.contentList = cascadeList;
      }
    },

    cascadeBy(arr = [], id) {
      let me = this,
        rstArr = [];

      for (let i = 0, item; (item = arr[i]); i++) {
        if (item["id"] == id) {
          rstArr.push.apply(rstArr, item["list"] || []);
          break;
        }
        if (item["list"] && item["list"].length) {
          rstArr.push.apply(rstArr, me.cascadeBy(item["list"], id) || []);
        }
      }

      return rstArr;
    },

    bubble(node, parentNodes = [], arr) {
      let me = this;

      if (!node || node.pid == 1) return;
      me.findParent(node, parentNodes, arr);
      let parentNode = parentNodes[0];
      me.bubble(parentNode, parentNodes, arr);
      return parentNodes;
    },

    findParent(node, parentNodes, arr) {
      let me = this;
      for (let i = 0, item; (item = arr[i]); i++) {
        if (item.id == node.pid) {
          parentNodes.unshift(item);
          break;
        }

        if (item.list && item.list.length) {
          me.findParent(node, parentNodes, item.list);
        }
      }
    },

    //导航操作
    onClickNav(item) {
      let me = this;

      let idx = me.navContent.findIndex((nav, idx) => {
        return nav == item;
      });

      if (idx % 2) {
        return console.log("子级导航无需操作");
      }

      //更改内容数据
      if (item.pid == 1) {
        me.contentList = [...me.rawContentList];
        me.navContent = [];
      } else {
        let navIdx = Math.floor(idx / 2);

        let navItem = me.navContent[navIdx];

        let cascadeList = me.cascadeBy(me.rawContentList, navItem.id);
        me.contentList = cascadeList;
        me.navContent.splice(idx);
      }
      me.$nextTick(() => (me.$refs.content.scrollTop = 0));
    },

    onSidebarClick(index, item) {
      let me = this,
        $sidebarItem = me.$refs.sidebar.children[index].$el;

      me.navContent = [];
      me.loadContent(item);

      $sidebarItem.scrollIntoViewIfNeeded();

      me.lastSideBarItem = $sidebarItem;
      me.$nextTick(() => (me.$refs.content.scrollTop = 0));
    },

    //快联通分类
    toKltCategory(evt) {
      let me = this;

      me.$router.push({ path: "/mall/catgoryKlt" });
    },

    // 离开路由时,记录列表状态
    beforeRouteLeave(to, from, next) {
      let me = this;

      me.$refs.content && (me.lastContentScroll = me.$refs.content.scrollTop);
    }
  }
};
</script>

<style lang="scss" scoped>
.catgroy-wrap {
  min-height: 100%;
  background: $theme-gray-bg;

  .list {
    display: flex;
    padding: 0;
    overflow: hidden;

    /deep/ .van-sidebar {
      width: 170px;
      padding-bottom: 160px;

      .van-sidebar-item--select::before {
        background-color: $border-active-cls;
      }
    }

    .r-content {
      flex: 1;
      background-color: #fff;
      overflow: hidden;
      padding: 0px 20px;
      position: relative;
      min-height: 300px;
      display: flex;
      flex-flow: column;
      .category-nav-div {
        background: #fff;
        padding: 36px 60px 30px;
        font-size: 0;
        transition: all 0.3s;

        .nav-item {
          display: inline-flex;
          padding: 10px;
          .nav-text {
            font-size: 28px;
            font-weight: bold;
          }

          /deep/ .van-icon-arrow {
            font-size: 24px;
          }

          &:last-of-type {
            .nav-text {
              color: $font-active-cls;
            }

            .van-icon-arrow {
              display: none;
            }
          }
        }
      }

      .r-content-inner{
        flex:1;
        overflow: auto;
        padding-bottom: 160px;
      }

      .category-div {
        margin: 40px 0 0;

        .c-title {
          font-size: 28px;
          font-weight: 700;
        }

        .c-grid {
          margin-top: 20px;

          .grid-item {
            font-size: 0;

            /deep/ .van-grid-item__content {
              padding: 16px 16px;
            }

            .img {
              width: 140px;
              height: 140px;
              object-fit: contain;
            }

            .text {
              font-size: 24px;
              height: 52px;
              line-height: 26px;
              margin-top: 10px;
              word-break: break-all;
            }
          }
        }
      }
    }
  }
}
</style>