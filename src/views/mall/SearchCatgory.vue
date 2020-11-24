<template>
  <div class="search-catgroy-wrap">
    <nav-bar></nav-bar>
    <form action="/" class="form-wrap">
      <van-search v-model="key" show-action placeholder="请输入搜索关键词" @search="onSearch">
        <template #action>
          <div>
            <div class="btn-search" @click="onSearch">搜索</div>
            <div class="btn-filter" @click="onFilter">筛选</div>
          </div>
        </template>
      </van-search>
      <div class="filter-wrap">
        <van-tag closeable class="tag" v-for="(item, idx) in tags" :key="idx" size="medium" @close="onCloseTag(item)"> {{ item.name }} </van-tag>
      </div>
    </form>
     
    <mescroll-vue class="content-wrap list"  :up="mescrollUp" ref="mescroll" @init="mescrollInit">
      <ul class="detail" id="empty_list">
        <li class="item van-hairline--bottom" @click="toDetail(item)" v-for="(item,idx) in descList" :key="idx">
          <div class="img-wrap">
            <img :alt="item.name" v-lazy="$utils.httpImage(item.image)"/>
          </div>
          <div class="context-wrap">
            <p class="title van-multi-ellipsis--l2">{{ item.name }}</p>
            <p class="price van-ellipsis">￥{{ item.goods_price }}</p>
            <p class="desc van-ellipsis">{{ item.store_name }}</p>
          </div>
        </li>
      </ul>
    </mescroll-vue>
    <van-popup v-model="showPopup" round position="right" lock-scroll :style="{ height: '100%', width: '80%' }">
      <div class="popup-filter">
        <p class="title">价格区间</p>
        <div class="price-wrap"><input class="min" type="text" v-model="lowPrice" placeholder="最低价" /><span class="divider">—</span><input type="text" v-model="highPrice" class="max" placeholder="最高价" /></div>
        <p class="title">供应商</p>
        <ul class="supplier-list">
          <li class="item" :class="{ active: item.checked }" @click="item.checked = !item.checked" v-for="item in supplier" :key="item.id">{{ item.store_name }}</li>
        </ul>
      </div>
      <div class="popup-bottom van-hairline--top" v-safe-area-inset-bottom><button class="reset" @click="onFilterReset">重置</button><button class="confirm" @click="onFilterConfirm">确定</button></div>
    </van-popup>
  </div>
</template>

<script src="@assets/js/mall/searchCatgory.js"></script>
<style lang="scss" src="@assets/styles/mall/searchCatgory.scss" scoped />