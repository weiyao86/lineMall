<template>
  <div class="detail-wrap">
    <nav-bar :leftArrow="false"></nav-bar>
    <section class="content-wrap list" v-ios-fix-scroll>
      <div class="header-wrap">
        <van-swipe>
          <van-swipe-item>
            <img v-lazy="details.logo" class="ad-img" />
          </van-swipe-item>
        </van-swipe>
        <div class="text-wrap">
          <p class="title van-multi-ellipsis--l2">{{ details.title }}</p>
        </div>
      </div>
      <van-divider class="divider">商品详情</van-divider>
      <ul class="detail-imgs">
        <li class="item" v-html="details.desc"></li>
      </ul>
    </section>
    <div class="footer-btns-wrap van-hairline--top" v-safe-area-inset-bottom>
      <van-button class="add-shopcart" @click="onCart">我的提货单</van-button>
      <van-button class="buy-now" @click="onTakeHome">提货回家</van-button>
      </div>

  </div>
</template>

<script src="@assets/js/pickUp/detail.js"></script>
<style lang="scss" src="@assets/styles/pickUp/detail.scss" scoped />