<template>
  <div class="person-wrap">
    <nav-bar></nav-bar>
    <section class="content-wrap content">
      <van-form @submit="onSave" ref="form" validate-first>
        <van-cell-group>
          <van-field class="cell-custom-item" input-align="right" label="昵称" placeholder="请输入昵称" v-model="person.username" />
          <van-cell class="cell-custom-item" title="手机号" is-link :value="person.mobile" :to="{ path: '/user/validAuth', query: { tel: person.mobile } }" />
          <van-field class="cell-custom-item" input-align="right" label="工作单位" :rules="[{ required: true }]" placeholder="请输入工作单位" v-model="person.unit" center clearable />
        </van-cell-group>
        <div class="btns-wrap">
          <van-button type="danger" size="large" class="submit-btn">保存</van-button>
        </div>
      </van-form>
    </section>
  </div>
</template>

<script src="@assets/js/user/personInfo.js"></script>
<style lang="scss" src="@assets/styles/user/personInfo.scss" scoped />