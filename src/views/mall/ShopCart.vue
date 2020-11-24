<template>
  <div class="shop-cart-wrap">
    <nav-bar></nav-bar>
    <section class="content-wrap list">
      <ul>
        <li class="categroy-item" v-for="(item, index) in cartList" :key="index">
          <van-checkbox v-model="item.checked" @click="onCategroyChange(index)" class="title">{{ item.store_name }}</van-checkbox>
          <div class="inner-wrap">
            <van-swipe-cell v-for="(innerItem, idx) in item.children" :key="innerItem.cart_id">
              <div class="inner-item" :class="{ 'van-hairline--bottom': idx != item.children.length - 1 }" @click="toDetail(innerItem)">
                <div @click.stop class="ck-wrap">
                  <van-checkbox v-model="innerItem.checked" @click="validAllCk()" class="check"></van-checkbox>
                </div>
                <div class="img-wrap">
                  <img v-lazy="innerItem.image" class="ad-img" />
                </div>
                <div class="text-wrap">
                  <p class="title van-multi-ellipsis--l2">{{ innerItem.goods_name }}</p>
                  <p class="spec-wrap" @click.stop="onOpenLayer(innerItem)">
                    <span class="spec-text van-ellipsis">{{ innerItem.specs_name }}</span>
                    <van-icon name="arrow-down" />
                  </p>
                  <div class="bottom-wrap" @click.stop>
                    <div class="price">
                      <span class="symbol">￥</span>
                      {{ innerItem.specs_price }}
                    </div>
                    <van-stepper integer disable-input default-value="1" min="1" :long-press="false" :max="innerItem.inventory" class="calc-num" v-model="innerItem.goods_num" @minus="onChangeNum(innerItem, '-')" @plus="onChangeNum(innerItem, '+')" />
                  </div>
                </div>
              </div>
              <template #right>
                <van-button square type="danger" text="删除" @click="onDelete(innerItem)" style="height: 100%" />
              </template>
            </van-swipe-cell>
          </div>
        </li>
        <li v-if="!cartList.length">
          <div>
            <van-empty class="custom-image" :image="$emptyImg" description="还没有商品哦">
              <van-button class="bottom-button" plain hairline size="small" to="/mall/search">去逛逛</van-button>
            </van-empty>
          </div>
        </li>
      </ul>
    </section>

    <!-- 底部弹框 -->
    <van-popup v-model="showPopup" round closeable position="bottom" lock-scroll class="popup-outer-wrap">
      <specification :refData="specData" @chooseSpec="chooseSpec" @onCloseLayer="onCloseLayer"></specification>
    </van-popup>

    <van-submit-bar :price="totalPrice" button-text="提交订单" :disabled="!getSelectItems().length" @submit="onSubmit" class="submit-btn" safe-area-inset-bottom>
      <van-checkbox v-model="globalCkd" @click="onSelectAll">全选</van-checkbox>
    </van-submit-bar>
  </div>
</template>
        
<script src="@assets/js/mall/shopCart.js"></script>
<style lang="scss" src="@assets/styles/mall/shopCart.scss" scoped />