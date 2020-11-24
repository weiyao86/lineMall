 <template>
  <div class="auth-wrap">
    <nav-bar></nav-bar>
    <div class="wrap">
     
      <van-form @submit="onSubmit" ref="form" validate-first>
        <van-field class="cell-custom-item" maxlength="16" v-model="cardNo" placeholder="请输入提货卡券码" :rules="[{ required: true}]" clearable> </van-field>
       
        <van-button type="primary" size="large" :disabled="canSubmit" class="submit-btn">提交提货卡</van-button>
      </van-form>
    </div>
  </div>
</template>

<script src="@assets/js/pickUp/card.js"></script>
<style lang="scss" src="@assets/styles/pickUp/card.scss" scoped />