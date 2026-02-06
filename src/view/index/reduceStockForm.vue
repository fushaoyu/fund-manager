<template>
  <fd-dialogForm
    v-model="isShow"
    title="减仓持有"
    width="550px"
    label-width="90px"
    label-position="right"
    button-align="right"
    :formData="formData"
    @submit="handleSubmit"
  >
    <fd-form-number
      label="转出金额"
      label-width="90px"
      prop="position_amount"
      v-model="formData.position_amount"
    />
    <fd-form-number
      label="转出数量"
      label-width="90px"
      prop="quantity"
      v-model="formData.quantity"
    />
  </fd-dialogForm>
</template>
<script lang="ts" setup>
import { useFundStore } from '@/store/fundStore';
import FdDialogForm from '@/components/fd-dialog-form/index.vue';
import FdFormNumber from '@/components/fd-form-number/index.vue';

const fundStore = useFundStore();

const isShow = ref(false);

const formData = ref<IFundStore.IReduceUserFundParam>({
  id: '',
  position_amount: null!,
  quantity: null!,
});

const show = (fundId: string = '') => {
  formData.value = {
    id: fundId,
    position_amount: null!,
    quantity: null!,
  };
  isShow.value = true;
};

const handleSubmit = async () => {
  await fundStore.reduceUserFunds(formData.value);
  isShow.value = false;
};
defineExpose({
  show,
});
</script>
<style lang="scss" scoped></style>
