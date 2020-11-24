<template>
  <div class="confirm-order-wrap">
    <nav-bar></nav-bar>
    <section class="content-wrap list">
      <div class="address-wrap">
        <div class="has-address" v-if="address"  @click="onChooseAddress">
          <div class="icon-wrap">
            <i class="icon-kd"></i>
          </div>
          <div class="a-content">
            <p class="a-title">
              <span class="a-name van-ellipsis">{{ address.realname }}</span
              ><span class="a-tel">{{ address.telephone }}</span>
            </p>
            <p class="a-desc van-multi-ellipsis--l2">{{ address.address }}</p>
          </div>
          <div class="edit-address-arrow">
            <van-icon name="arrow" />
          </div>
        </div>
        <div class="no-address" v-if="!address">
          <p class="text-wrap">暂无收货地址~<span class="go-add" @click="onChooseAddress">去添加</span></p>
          <div class="edit-address-arrow" @click="onChooseAddress">
            <van-icon name="arrow" />
          </div>
        </div>
      </div>
      <ul>
        <li class="categroy-item" v-for="(item, index) in orderList" :key="index">
          <p class="c-title">{{ item.store_name }}</p>
          <div class="inner-wrap">
            <van-swipe-cell v-for="innerItem in item.goods" :key="innerItem.cart_id">
              <div class="inner-item van-hairline--bottom">
                <div class="img-wrap">
                  <img v-lazy="innerItem.goods_image" class="ad-img" />
                </div>
                <div class="text-wrap">
                  <p class="title van-multi-ellipsis--l2">{{ innerItem.goods_name }}</p>
                  <p class="spec-wrap">{{ innerItem.specs_name }}</p>
                  <div class="bottom-wrap" @click.stop>
                    <div class="price"><span class="symbol">￥</span>{{ innerItem.price | decimalKeep}}</div>
                    <p class="calc-num">
                      X<span class="num">{{ innerItem.goods_num }}</span>
                    </p>
                  </div>
                </div>
              </div>
             
            </van-swipe-cell>
          </div>
           <div class="footer-total">
                <span class="label-desc">快递</span>
                <span class="money-text van-ellipsis">{{ item.freight > 0 ? '￥'+item.freight : item.explain }}</span>
                <span class="num-wrap">共<span class="num-text">{{item.goods_num}}</span>件</span>
                <span class="sigle-total">小计<b class="symbol">￥</b><span class="goods-money">{{item.total_amount | decimalKeep}}</span></span>
              </div>
        </li>
      </ul>
    </section>

    <van-submit-bar :price="totalAmount" button-text="立即下单" @submit="onSubmit" :disabled="!orderList.length" class="submit-btn" safe-area-inset-bottom>
        <span class="total-money">总运费:<span class="money">￥{{shippingAmount}}</span></span>
    </van-submit-bar>
  </div>
</template>
        
<script src="@assets/js/mall/confirmOrder.js"></script>
<style lang="scss" src="@assets/styles/mall/confirmOrder.scss" scoped />