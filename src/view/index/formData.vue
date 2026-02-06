<template>
  <fd-dialogForm
    v-model="isShow"
    title="新增持有"
    width="550px"
    label-width="90px"
    label-position="right"
    button-align="right"
    :formData="formData"
    @submit="handleSubmit"
  >
    <fd-form-text
      label="基金名称"
      label-width="90px"
      prop="fund_name"
      v-model="formData.fund_name"
    />
    <fd-form-text
      label="基金代码"
      label-width="90px"
      prop="fund_code"
      v-model="formData.fund_code"
    />
    <fd-form-number
      label="持仓成本"
      label-width="90px"
      prop="position_amount"
      v-model="formData.position_amount"
    />
    <fd-form-number
      label="持有数量"
      label-width="90px"
      prop="quantity"
      v-model="formData.quantity"
    />
    <fd-form-number
      label="确定净值"
      label-width="90px"
      prop="position"
      v-model="formData.position"
    />
    <fd-form-select
      label="平台"
      label-width="90px"
      prop="account"
      :options="ACCOUNT"
      v-model="formData.account"
    />
  </fd-dialogForm>
</template>
<script lang="ts" setup>
import { ACCOUNT } from '@/utils/dict';
import { useFundStore } from '@/store/fundStore';
import FdDialogForm from '@/components/fd-dialog-form/index.vue';
import FdFormText from '@/components/fd-form-text/index.vue';
import FdFormNumber from '@/components/fd-form-number/index.vue';
import FdFormSelect from '@/components/fd-form-select/index.vue';

const fundStore = useFundStore();

const isShow = ref(false);

const formData = ref<IFundStore.IAddUserFundParam>({
  fund_name: '',
  fund_code: '',
  position_amount: null!,
  quantity: null!,
  position: null!,
  account: 1,
});

const show = () => {
  formData.value = {
    fund_name: '',
    fund_code: '',
    position_amount: null!,
    quantity: null!,
    position: null!,
    account: 1,
  };
  isShow.value = true;
};

const handleSubmit = () => {
  fundStore.addUserFunds(formData.value);
  isShow.value = false;
};
defineExpose({
  show,
});
</script>
<style lang="scss" scoped></style>
