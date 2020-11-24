<template>
  <div class="sale-after-list-wrap">
    <nav-bar></nav-bar>
    <mescroll-vue class="content-wrap list" :down="mescrollDown" :up="mescrollUp" ref="mescroll" @init="mescrollInit">
      <ul id="empty_list">
        <li class="categroy-item" v-for="(item, idx) in orderList" :key="idx">
          <p class="c-title">
            <span class="title-l">{{ item.store_name }}</span
            ><span class="title-r">{{ item.status_name }}</span>
          </p>
          <div class="inner-wrap">
            <div class="inner-item">
              <div class="img-wrap">
                <img v-lazy="innerItem.goods_image" class="ad-img" v-for="innerItem in item.orderGoods" :key="innerItem.order_goods_id" @click.stop="onToDetail(innerItem)" />
              </div>
              <div class="text-wrap">
                <p class="title"><span class="symbol">￥</span>{{ item.goods_price }}</p>
                <p class="spec-wrap">数量:{{ item.total_goods_num }}</p>
              </div>
            </div>
          </div>
          <div class="footer-total">
            <span class="label-desc">单号:</span>
            <span class="sn-text van-ellipsis">{{ item.service_sn }}</span>
            <div class="btns-wrap">
              <van-button class="btn-item" plain v-if="isShowBtn(item, '1')" @click="onClickForFeature(item, 'revoke')">撤销售后</van-button>
              <van-button class="btn-item" plain v-if="isShowBtn(item, '2')" @click="onClickForFeature(item, 'return')">退货</van-button>
              <van-button class="btn-item" plain v-if="isShowBtn(item, '3')" @click="onClickForFeature(item, 'restart')">重新发起</van-button>
            </div>
          </div>
        </li>
      </ul>
    </mescroll-vue>
  </div>
</template>
        
<script src="@assets/js/mall/saleAfterList.js"></script>
<style lang="scss" src="@assets/styles/mall/saleAfterList.scss" scoped />