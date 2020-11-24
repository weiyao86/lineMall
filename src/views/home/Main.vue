<template>
  <div class="main-page">
    <transition :name="transitionName" @before-enter="beforeEnter" @enter="enter" @leave="leave">
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
    </transition>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
    <!-- <tab-foot-menu v-if="$route.meta.isNavBar"></tab-foot-menu> -->
  </div>
</template>
<script>

import SideNav from '@components/SideNav';
export default {
  name: "Main",
  data() {
    return {
      obj: {}
    };
  },

  mounted() {
    let me = this;
  },

  methods: {
    enter() {},
    leave() {},
    beforeEnter() {}
  }
};
</script>
<style lang="scss" scoped>

</style>
