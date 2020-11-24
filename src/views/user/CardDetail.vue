<template>
  <div class="card-detail-wrap">
    <nav-bar :title="queryParams.title"></nav-bar>
    <mescroll-vue class="content-wrap list" :down="mescrollDown" :up="mescrollUp" ref="mescroll" @init="mescrollInit">
      <ul id="empty_list">
        <template>
          <li class="item van-hairline--bottom" v-for="item in detailList" :key="item.id">
            <div class="left">
              <div class="desc van-ellipsis">
                {{ item.content }}: <span class="num van-ellipsis">{{ item.order_sn }}</span>
              </div>
              <div class="time van-ellipsis">{{ (item.createtime * 1000) | dateFormat("yyyy-MM-dd hh:mm:ss") }}</div>
            </div>
            <div class="right van-ellipsis">
              <span class="text" v-if="item.type == 1" key="money">-{{ item.amount }}</span>
              <span class="text pay-back" v-else key="money-back">+{{ item.amount }}</span>
            </div>
          </li>
        </template>
      </ul>
    </mescroll-vue>
  </div>
</template>
<script src="@assets/js/user/cardDetail.js"></script>
<style lang="scss" src="@assets/styles/user/cardDetail.scss" scoped />
