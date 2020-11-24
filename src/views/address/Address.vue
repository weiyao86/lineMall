<template>
  <div class="address-list-wrap">
    <nav-bar></nav-bar>
    <ul class="content-wrap list" v-if="addressList.length">
      <template v-for="item in addressList">
        <li class="item van-hairline--bottom" :key="item.id" @click="onChooseAddress(item)">
          <div class="checked-wrap" v-if="hasChoose && queryParams.id == item.id">
             <van-checkbox :value="true" class="checked-address"></van-checkbox>
          </div>
          <div class="left">
            <div class="user">
              <span class="name">{{ item.realname }}</span>
              <span class="tel">{{ item.telephone }}</span>
              <van-tag type="danger" class="tag-icon" v-if="item.is_default==1">默认</van-tag>
            </div>
            <div class="address">{{ item.address }}</div>
          </div>
          <div class="right"  @click.stop="toDetail(item)">
            <van-icon name="edit" />
          </div>
        </li>
      </template>
    </ul>
    <div class="item-add-wrap" :class="needFixed" v-safe-area-inset-bottom @click="onAddAddress"><van-icon name="add-o" class="icon-add" /><span class="text">添加收货地址</span></div>
  </div>
</template>
<script src="@assets/js/address/address.js"></script>
<style lang="scss" src="@assets/styles/address/address.scss" scoped />
