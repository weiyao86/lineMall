<template>
  <div class="pay-result-wrap">
    <nav-bar></nav-bar>
    <div class="content-wrap list">
      <div class="wrap">
        <div class="icon-wrap">
          <van-icon name="checked" class="success" v-if="isSuccess" key="checked"/>
          <van-icon name="clear" class="error" v-else key="clear"/>
        </div>
        <div class="pay-status">{{getRstTextByStatus}}</div>
        <div class="reson">{{errorMsg}}</div>
        <div class="footer-btns-wrap" v-safe-area-inset-bottom>
          <van-button class="confirm-pay" @click="onClickByStatus">{{ getBtnTextByStatus }}</van-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script src="@assets/js/pay/payResult.js"></script>
<style lang="scss" src="@assets/styles/pay/payResult.scss" scoped />
