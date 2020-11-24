<template>
  <div class="main-wrap">
    <van-search class="van-hairline--bottom" show-action placeholder="请输入搜索关键词" readonly @click="onSearch">
      <template #action>
        <div class="btn-search" @click="onSearch">搜索</div>
      </template>
    </van-search>
    <scroll-view :data="list" ref="bscroll" class="content-wrap m-content">
      <vue-waterfall-easy ref="waterfall" :imgsArr="list" :isRouterLink="true" :mobileGap="10" :maxCols="2" :loadingDotCount="3" :loadingDotStyle="{'background':'#fe5502'}" @preloaded="onPreloaded">
        
     </vue-waterfall-easy>
    </scroll-view>
    <!-- <div class="content-wrap m-content">
      <vue-waterfall-easy ref="waterfall" :imgsArr="list" :isRouterLink="true" :mobileGap="10" :maxCols="2" :loadingDotCount="3" :loadingDotStyle="{ background: '#fe5502' }" @preloaded="onPreloaded"> </vue-waterfall-easy>
    </div> -->
  </div>
</template>

<script src="@assets/js/home/mainPage.js"></script>
<style lang="scss" src="@assets/styles/home/mainPage.scss" scoped />
