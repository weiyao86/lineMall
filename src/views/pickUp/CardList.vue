<template>
  <div class="card-list-wrap">
    <nav-bar></nav-bar>
    <mescroll-vue class="content-wrap list" :down="mescrollDown" :up="mescrollUp" ref="mescroll" @init="mescrollInit">
      <ul id="empty_list" class="goods-list">
        <li class="goods-item" v-for="item in cardList" :key="item.id">
          <p class="title van-hairline--bottom">
            <span class="label">提货卡</span><span class="card-no">{{ item.number }}</span
            ><span class="status">{{item.status | getTextByStatus}}</span>
          </p>
          <div class="goods-content">
            <div class="img-wrap">
              <img v-lazy="item.logo" alt="" class="ad-img" />
            </div>
            <div class="text-wrap">{{ item.title }}</div>
          </div>
          <div class="footer-total">
            <span class="label-desc">提货时间:</span>
            <span class="sn-text van-ellipsis">{{ (item.createtime * 1000) | dateFormat("yyyy-MM-dd hh:mm:ss") }}</span>
            <div class="btns-wrap">
              <van-button class="btn-item" plain v-if="isShowBtn(item.status)" @click="onSearchLogistics(item, 'search')">查询物流</van-button>
            </div>
          </div>
        </li>
      </ul>
    </mescroll-vue>
  </div>
</template>
        
<script src="@assets/js/pickUp/cardList.js"></script>
<style lang="scss" src="@assets/styles/pickUp/cardList.scss" scoped />