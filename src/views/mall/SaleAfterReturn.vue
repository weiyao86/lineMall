<template>
  <div class="sale-after-return-wrap">
    <nav-bar></nav-bar>
    <div class="content-wrap list">
      <div class="s-address">
        <p class="r-title">请将退货商品邮寄到以下地址</p>
        <div class="r-content">
          <div class="contact-wrap">
            <span class="r-name">{{ storeAddress.realname }}</span>
            <span class="r-phone">{{ storeAddress.telephone }}</span>
          </div>
          <div class="r-address van-multi-ellipsis--l2">
            {{ storeAddress.address }}
          </div>
        </div>
      </div>
      <div class="express-wrap">
        <p class="e-title">填写退货快递信息</p>
        <van-field class="cell-custom-item" placeholder="选择快递公司" v-model="expressCompany.name" readonly is-link center @click="onShowPopup"> </van-field>
        <van-field class="cell-custom-item" placeholder="填写快递单号" v-model="sn" center> </van-field>
        <div class="btns-wrap">
          <van-button size="large" class="submit-btn" @click="submitReturn">保存</van-button>
        </div>
      </div>
    </div>
    <van-popup v-model="showPopup" lock-scroll safe-area-inset-bottom round position="bottom" close-icon-position="top-right" :style="{ height: '70%' }" closeable>
      <div class="choose-company-wrap">
        <p class="title">选择快递公司</p>
        <div class="inner-content" ref="areaWrap">
          <van-cell :title="item.company" :border="false" :class="{ 'choose-cell': item.checked }" @click="choose($event, item)" center v-for="item in expressInfo" :key="item.id" :data-id="item.id">
            <template #right-icon v-if="item.checked">
              <van-icon name="success" class="active-icon" />
            </template>
          </van-cell>
        </div>
      </div>
    </van-popup>
  </div>
</template>
        
<script src="@assets/js/mall/saleAfterReturn.js"></script>
<style lang="scss" src="@assets/styles/mall/saleAfterReturn.scss" scoped />