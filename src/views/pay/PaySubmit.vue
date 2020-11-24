<template>
  <div class="pay-submit-wrap">
    <nav-bar></nav-bar>
    <div class="content-wrap list">
      <div class="money-wrap">
        <div class="money-text">
          <span class="symbol">￥</span>
          <span class="money">{{ detail.total_amount }}</span>
        </div>
        <div class="money-status">待支付</div>
      </div>
      <template v-if="cardList.length">
        <div class="card-list">
          <p class="c-title">选择使用的兑换卡</p>
          <van-radio-group v-model="radio">
            <ul class="detail">
              <template>
                <li class="d-item" :key="idx" v-for="(item, idx) in cardList" @click="onRowClick(item)">
                  <div class="left">
                    <div class="top-wrap">
                      <span class="card-name">{{ item.product }}</span>
                      <span class="price"><span class="symbol">￥</span>{{ item.balance }}</span>
                    </div>
                    <div class="bottom-wrap">
                      <span class="card-label-date"
                        >有效期<span class="card-date">{{ item.validstart | dateFormat }} ~ {{ item.validend | dateFormat }}</span></span
                      >
                      <span class="surplus">余额</span>
                    </div>
                  </div>
                  <div class="right">
                    <van-radio :name="item.id"></van-radio>
                  </div>
                </li>
              </template>
            </ul>
          </van-radio-group>
        </div>
      </template>

      <van-empty v-else class="custom-image no-card-list" :image="$emptyImg" description="无兑换卡可用">
        <van-button class="bottom-button" plain hairline size="small" to="/user/card">去绑卡</van-button>
      </van-empty>
    </div>
    <div class="footer-btns-wrap van-hairline--top" v-safe-area-inset-bottom>
      <van-button class="confirm-pay" :disabled="!radio" @click="onConfirmPay">确认支付</van-button>
    </div>
  </div>
</template>
<script src="@assets/js/pay/paySubmit.js"></script>
<style lang="scss" src="@assets/styles/pay/paySubmit.scss" scoped />
