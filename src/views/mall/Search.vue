<template>
  <div class="search-wrap">
    <nav-bar></nav-bar>
    <section class="content-wrap">
      <form action="/">
        <van-search v-model="key" show-action placeholder="请输入搜索关键词" @search="onSearch()">
          <template #action>
            <div @click="onSearch()">搜索</div>
          </template>
        </van-search>
      </form>
      <div class="inner">
        <p class="title">热门搜索</p>
        <ul class="hot-words">
          <li class="item" @click="onSearch(item)" v-for="item in hotWords" :key="item">{{item}}</li>
        </ul>
      </div>
    </section>
  </div>
</template>

<script src="@assets/js/mall/search.js"></script>
<style lang="scss" src="@assets/styles/mall/search.scss" scoped />