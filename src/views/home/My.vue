<template>
  <div class="page person-center">
    <header class="header">
      <div class="wrap">
        <div class="user-wrap">
          <div class="avatar" @click="onAvatar" v-lazy:background-image="avatarImg">
            <v-icon v-if="!avatarImg" name="user-circle" class="icon"></v-icon>
          </div>
          <div class="name">{{userName}}</div>
        </div>
        <router-link class="person-info" to="/user/personInfo">
          <van-tag round type="primary" class="tag">编辑资料</van-tag>
        </router-link>
      </div>
    </header>
    <section class="content">
      <van-cell-group :border="false">
        <van-cell title="兑换卡包" :border="false" center  class="cell-custom-item" is-link to="/user/card" >
          <template #icon>
            <i class="icon-swap-card"></i>
          </template>
        </van-cell>
        <van-cell title="我的订单" :border="false" center  class="cell-custom-item" is-link to="/mall/order" >
          <template #icon>
            <i class="icon-my-order"></i>
          </template>
        </van-cell>
        <van-cell title="售后进展" :border="false" center  class="cell-custom-item" is-link to="/mall/saleAfterList" >
          <template #icon>
            <i class="icon-after-sale"></i>
          </template>
        </van-cell>
        <van-cell title="收货地址" :border="false" center  class="cell-custom-item" is-link to="/user/address">
         <template #icon>
            <i class="icon-address"></i>
          </template>
        </van-cell>
      </van-cell-group>
    </section>
    <footer class="footer">
      <div class="wrap">
        <van-button  size="large" class="sign-out" @click="logout">退出帐号</van-button>
      </div>
    </footer>
  </div>
</template>
<script src="@assets/js/home/my.js"> </script>
<style lang="scss" src="@assets/styles/home/my.scss" scoped />
