<template>
  <div class="sale-after-wrap">
    <nav-bar></nav-bar>
    <section class="content-wrap list">
      <ul>
        <li class="categroy-item">
          <div class="inner-wrap">
            <van-swipe-cell v-for="(innerItem, idx) in goodsList" :key="innerItem.goods_id">
              <div class="inner-item" :class="{ 'van-hairline--bottom': idx != goodsList.length - 1 }">
                <div @click.stop class="ck-wrap"><van-checkbox v-model="innerItem.checked" @click="validAllCk()" class="check"></van-checkbox></div>
                <div class="img-wrap">
                  <img v-lazy="innerItem.goods_image" class="ad-img" />
                </div>
                <div class="text-wrap">
                  <p class="title van-multi-ellipsis--l2">{{ innerItem.goods_name }}</p>
                  <p class="spec-wrap">{{ innerItem.goods_specs_name }}</p>
                  <div class="bottom-wrap" @click.stop>
                    <div class="price"><span class="symbol">￥</span>{{ innerItem.goods_price }}</div>
                    <div class="calc-num">
                      <span>x</span><span class="num">{{ innerItem.goods_num }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </van-swipe-cell>
          </div>
        </li>
      </ul>
      <div class="upload-wrap">
        <p class="u-title">退款说明</p>
        <div class="u-text-content van-hairline--surround">
          <van-field v-model="remark" rows="4" autosize type="textarea" maxlength="250" placeholder="请输入退款说明" show-word-limit />
        </div>
        <div class="u-img_wrap">
          <van-uploader v-model="fileList" :after-read="afterRead" @delete="onDeleteImg" multiple :max-count="5" @oversize="onOversize" :max-size="20 * 1024 * 1024"/>
        </div>
      </div>
    </section>

    <van-submit-bar :price="totalPrice" button-text="申请退款" @submit="onSubmit" class="submit-btn" safe-area-inset-bottom>
      <van-checkbox v-model="globalCkd" @click="onSelectAll">全选</van-checkbox>
    </van-submit-bar>
  </div>
</template>
        
<script src="@assets/js/mall/saleAfter.js"></script>
<style lang="scss" src="@assets/styles/mall/saleAfter.scss" scoped />