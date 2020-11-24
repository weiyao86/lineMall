<template>
  <div class="detail-wrap">
    <nav-bar></nav-bar>
    <section class="content-wrap list">
      <div class="header-wrap">
        <van-swipe @change="onChange" :autoplay="3000" :stop-propagation="false" v-if="details.goods_img.length">
          <van-swipe-item @click="onPreview()" v-for="(image, idx) in details.goods_img" :key="idx">
            <img v-lazy="image" class="ad-img" />
          </van-swipe-item>
          <template #indicator>
            <div class="custom-indicator">{{ current + 1 }}/{{ (details.goods_img && details.goods_img.length) || 0 }}</div>
          </template>
        </van-swipe>
        <div class="no-photo" v-else>
          <van-empty class="custom-image" :image="$emptyImg" description />
        </div>

        <div class="text-wrap">
          <p class="price-wrap">￥{{ details.goods.goods_price }}</p>
          <p class="title">{{details.goods.name }}</p>
          <p class="desc van-ellipsis">运费说明：{{ details.goods.explain }}</p>
        </div>
      </div>

      <van-cell title="已选" center class="cell-custom-item" @click="onShowLayer" is-link>
        <span>{{ curSpec.name }}</span>
        <span class="num">数量:{{ curSpec.buyNum }}</span>
      </van-cell>
      <van-cell title="送至" :border="false" center class="cell-custom-item-o" @click="onShowLayerAddress" is-link>
        <span>{{ fullAddress }} </span>
        <span class="goods-status">{{ inventoryStatus }}</span>
      </van-cell>

      <van-divider class="divider">商品详情</van-divider>
      <ul class="detail-imgs">
        <li class="item" v-html="details.goods.detail"></li>
      </ul>
    </section>
    <div class="footer-btns-wrap van-hairline--top" v-safe-area-inset-bottom>
      <van-button class="add-shopcart" @click="onAddShopCart" :disabled="isEnabledStatus">加入购物车</van-button>
      <van-button class="buy-now" @click="onBuyNow" :disabled="isEnabledStatus">立即下单</van-button>
    </div>

    <!-- 预览图 -->
    <van-image-preview v-model="showPreview" :images="details.goods_img" :start-position="preViewIdx" @close="onPreviewClose" closeable />

    <!-- 规格底部弹框 -->
    <van-popup v-model="showPopup" round closeable position="bottom" @close="onAutoClose" lock-scroll class="popup-outer-wrap">
      <specification :refData="specData" :isEnabledStatus="isEnabledStatus" @onCloseLayer="onCloseLayer"></specification>
    </van-popup>

    <!-- 地址弹框 -->
    <van-popup v-model="showPopupAddress" round closeable position="bottom" @close="onAutoCloseForAddress" lock-scroll :style="{ height: '70%' }">
      <delivery-address :chooseItem="curAddressInfo" @onChooseAddress="onChooseAddress"></delivery-address>
    </van-popup>
  </div>
</template>

<script src="@assets/js/mall/detail.js"></script>
<style lang="scss" src="@assets/styles/mall/detail.scss" scoped />