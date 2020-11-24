<template>
    <catgory-common type="self" ref="categoryCmp" class="category">
      <template #nav>
        <!-- <nav-bar :leftArrow="false"></nav-bar> -->
        <van-search class="van-hairline--bottom" show-action placeholder="请输入搜索关键词" readonly @click="onSearch">
          <template #action>
            <div class="btn-search" @click="onSearch">搜索</div>
          </template>
        </van-search>
      </template>
    </catgory-common>
</template>

<script src="@assets/js/mall/catgory.js"></script>
<style lang="scss" src="@assets/styles/mall/catgory.scss" scoped />