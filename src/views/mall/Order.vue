<template>
  <div class="order-wrap">
    <nav-bar></nav-bar>
    <mescroll-vue class="content-wrap list" :down="mescrollDown" :up="mescrollUp" ref="mescroll" @init="mescrollInit">
      <ul id="empty_list">
        <li class="categroy-item" v-for="(item, idx) in orderList" :key="idx">
          <p class="c-title">
            <span class="title-l">{{ item.store_name }}</span
            ><span class="title-r">{{ item.order_status_name }}</span>
          </p>
          <div class="inner-wrap">
            <div class="inner-item">
              <div class="img-wrap">
                <img v-lazy="innerItem.goods_image" class="ad-img" v-for="innerItem in item.orderGoods" :key="innerItem.order_goods_id" @click.stop="onToDetail(innerItem)" />
              </div>
              <div class="text-wrap">
                <p class="title"><span class="symbol">￥</span>{{ item.total_amount }}</p>
                <p class="spec-wrap">数量:{{ item.goods_num }}</p>
              </div>
            </div>
          </div>
          <div class="footer-total">
            <span class="label-desc">单号:</span>
            <span class="sn-text van-ellipsis">{{ item.order_sn }}</span>
            <div class="btns-wrap">
              <van-button class="btn-item" plain v-if="isShowBtn(item, '1')" @click="onClickForFeature(item, 'now')">立即兑换</van-button>
              <van-button class="btn-item" plain v-if="isShowBtn(item, '1')" @click="onClickForFeature(item, 'cancel')">取消订单</van-button>
              <van-button class="btn-item" plain v-if="isShowBtn(item, '2')" @click="onClickForFeature(item, 'refound')">申请退款</van-button>
              <van-button class="btn-item" plain v-if="isShowBtn(item, '3')" @click="onClickForFeature(item, 'saleafter')">申请售后</van-button>
              <van-button class="btn-item" plain v-if="isShowBtn(item, '3')" @click="onClickForFeature(item, 'search')">查询物流</van-button>
              <van-button class="btn-item" plain v-if="isShowBtn(item, '3')" @click="onClickForFeature(item, 'confirm')">确认收货</van-button>
              <van-button class="btn-item" plain v-if="isShowBtn(item, '4')" @click="onClickForFeature(item, 'del')">删除订单</van-button>
            </div>
          </div>
        </li>
      </ul>
    </mescroll-vue>
  </div>
</template>
        
<script src="@assets/js/mall/order.js"></script>
<style lang="scss" src="@assets/styles/mall/order.scss" scoped />