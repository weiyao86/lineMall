<template>
  <div class="logistic-wrap">
    <nav-bar></nav-bar>
    <section class="content-wrap list">
      <template v-for="item in logistics">
        <div class="list-inner" v-for="(innerItem, innerIdx) in item" :key="innerIdx">
          <div class="inner-wrap">
            <template v-for="good in innerItem.InfoJsonList">
              <router-link :key="good.ProductId" class="inner-item" :class="{ 'van-hairline--bottom': innerIdx != good.length - 1 }" :to="{path:'/mall/detail',query:{id:good.GoodsId}}">
                <div class="img-wrap">
                  <img v-lazy="good.ProductThumb" class="ad-img" />
                </div>
                <div class="text-wrap">
                  <p class="title van-multi-ellipsis--l2">{{ good.ProductName }}</p>
                  <div class="bottom-wrap">
                    <span class="num">数量:{{ good.Quantity }}</span>
                  </div>
                </div>
              </router-link>
            </template>
          </div>
          <div class="header">
            <p class="item-wrap">
              <span class="c-item">快递公司:</span><span class="c-item">{{ innerItem.ShippingName }}</span>
            </p>
            <p class="item-wrap">
              <span class="c-item">快递单号:</span><span class="c-item">{{ innerItem.ShippingNumbers }}</span>
            </p>
          </div>
          <div class="detail" :class="{ expand: innerItem.expand }">
            <van-steps direction="vertical" :active="0">
              <van-step v-for="(item, idx) in innerItem.LogisticsList" :key="idx">
                <h3>{{ item.Info }}</h3>
                <p>{{ item.CreateDate }}</p>
                <template #inactive-icon>
                  <van-icon name="checked" class="step-icon" />
                </template>
              </van-step>
            </van-steps>
          </div>
          <div class="btns-wrap">
            <van-button color="#7232dd" size="small" plain @click="onView(innerItem)">{{ showLogisText(innerItem) }}</van-button>
          </div>
        </div>
      </template>
      <div class="no-photo" v-if="!logistics.length">
        <van-empty class="custom-image" :image="$emptyImg" description="暂无物流数据" />
      </div>
    </section>
  </div>
</template>

<script src="@assets/js/mall/logistics.js"></script>
<style lang="scss" src="@assets/styles/mall/logistics.scss" scoped />