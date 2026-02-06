<template>
  <div
    class="w-full h-[100px] flex items-center justify-between bg-[#ffffff] border border-[#e5e5e5] rounded-xl box-border p-[20px]"
  >
    <div class="flex flex-col items-center gap-8">
      <div class="text-[#999]">账户资产</div>
      <div class="text-[#000] font-bold text-[24px]">
        {{ numberToMoney(props.accountAsset) }}
      </div>
    </div>
    <div class="flex flex-col items-center gap-8">
      <div class="text-[#999]">涨跌金额</div>
      <div
        :class="props.changeAmount <= 0 ? 'text-[#00c853]' : 'text-[#ff4444]'"
        class="font-bold text-[24px]"
      >
        {{ props.changeAmount > 0 ? '+' : '' }}{{ numberToMoney(props.changeAmount) }}
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { numberToMoney } from '@/utils/index';
const props = defineProps({
  accountAsset: {
    type: Number,
    default: 0,
  },
  changeAmount: {
    type: Number,
    default: 0,
  },
});
const emit = defineEmits([]);
// 组件挂载完成后执行
onMounted(() => {});
</script>
<style lang="scss" scoped></style>
