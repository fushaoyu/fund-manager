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
    <fd-form-select-v2
      v-model="formData.fund_value"
      label="选择基金"
      label-width="90px"
      prop="fund_value"
      placeholder="请选择基金名称"
      filterable
      :options="options"
      @change="handleChange"
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
import FdFormNumber from '@/components/fd-form-number/index.vue';
import FdFormSelect from '@/components/fd-form-select/index.vue';
import FdFormSelectV2 from '@/components/fd-form-select-v2/index.vue';
import AllFund from '@/utils/allFund';

const fundStore = useFundStore();

const isShow = ref(false);

const options = AllFund.map((item: any) => ({
  label: `${item.fundName}-${item.fundCode}`,
  value: `${item.fundName}-${item.fundCode}`,
}));

const formData = ref<IFundStore.IAddUserFundParam>({
  fund_value: '',
  fund_name: '',
  fund_code: '',
  position_amount: null!,
  quantity: null!,
  position: null!,
  account: 1,
});

const show = () => {
  formData.value = {
    fund_value: '',
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

// 基金名称选择后，基金代码会自动带出
const handleChange = (val: any) => {
  const [fund_name, fund_code] = val.split('-');
  formData.value.fund_name = fund_name;
  formData.value.fund_code = fund_code;
};
defineExpose({
  show,
});
</script>
<style lang="scss" scoped></style>
