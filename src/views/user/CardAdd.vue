 <template>
  <div class="add-wrap">
    <nav-bar :fixed="false"></nav-bar>
    <div class="wrap">
      <van-form @submit="onSubmit" ref="form" validate-first>
        <van-field class="cell-custom-item" placeholder="请输入兑换卡号码" v-model="cardNo" :rules="[{ required: true }]" clearable> </van-field>
        <van-field class="cell-custom-item" placeholder="请输入激活码" v-model="cardPwd" :rules="[{ required: true }]" clearable> </van-field>
        <van-button type="primary" size="large" class="submit-btn">添加</van-button>
      </van-form>
    </div>
  </div>
</template>

<script src="@assets/js/user/cardAdd.js"></script>
<style lang="scss" src="@assets/styles/user/cardAdd.scss" scoped />