<template>
  <div class="address-add-list-wrap">
    <nav-bar></nav-bar>
    <van-form @submit="onSubmit" class="content-wrap" ref="form" validate-first>
      <van-field class="cell-custom-item" label="收货人" placeholder="请填写收货人姓名" v-model="name" :rules="[{ required: true }]" center clearable> </van-field>
      <van-field class="cell-custom-item" label="手机号" placeholder="请填写收货人手机号" v-model="tel" type="tel" name="tel" :rules="[{ required: true, pattern: /1[3-9]\d{9}$/, message: '请正确输入手机号' }]" center clearable> </van-field>
      <van-field class="cell-custom-item" label="所在地区" placeholder="省市区县、乡镇等" v-model="address" readonly is-link center @click="onShowPopup"> </van-field>
      <van-field class="cell-custom-item" label="详细地址" placeholder="街道、楼牌号等" v-model="desc" :rules="[{ required: true }]" center clearable> </van-field>
      <van-cell class="cell-custom-item" center title="设为默认地址">
        <template #right-icon>
          <van-switch v-model="checked" size="24" />
        </template>
      </van-cell>
      <div class="btns-wrap">
        <van-button type="primary" size="large" class="submit-btn">保存</van-button>

        <van-button v-if="pageType" type="primary" size="large" class="del-btn" @click.prevent="onDelInfo">删除地址</van-button>
      </div>
    </van-form>
    <van-popup  v-model="showPopup" @opened="opendAfter" lock-scroll safe-area-inset-bottom round position="bottom" close-icon-position="top-right" :style="{height:'70%'}" closeable>
        <choose-address ref="addressCmp" :selectArea="addressList" @chooseAddressAfter="chooseAddressAfter"></choose-address>
    </van-popup>
    
  </div>
</template>
<script src="@assets/js/address/addressEdit.js"></script>
<style lang="scss" src="@assets/styles/address/addressEdit.scss" scoped />
