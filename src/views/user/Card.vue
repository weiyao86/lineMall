<template>
  <div class="card-list-wrap">
    <nav-bar></nav-bar>
    <ul class="content-wrap list" v-if="cardList.length">
      <template v-for="item in cardList">
        <li class="item" :class="{ 'invalid-wrap': item.status != 1 }" @click="toDetail(item)" :key="item.id">
          <div class="top">
            <div class="card-name">{{ item.product }}</div>
            <div class="last-num"><span class="last-text">余额 ￥</span>{{ item.balance }}</div>
          </div>
          <div class="bottom">
            <div class="valid" v-if="item.status == 1" key="valid">有效期<span class="text">{{item.validtime}}</span></div>
            <div class="invalid" v-else key="invalid">已失效</div>
            <div class="face-val">面值 ￥{{ item.price_limit }}</div>
          </div>
        </li>
      </template>
    </ul>
    <div class="item-add-wrap" :class="needFixed" v-safe-area-inset-bottom @click="onAddCard"><van-icon name="add-o" class="icon-add" /><span class="text">添加兑换卡</span></div>
  </div>
</template>
<script src="@assets/js/user/card.js"></script>
<style lang="scss" src="@assets/styles/user/card.scss" scoped />
