<template>
  <div
    class="w-full flex flex-col gap-2 bg-[#ffffff] border border-[#e5e5e5] rounded-xl box-border p-[20px] text-[16px] shadow-[0px_0px_10px_0px_rgba(0,0,0,0.1)]"
  >
    <fd-button
      class="w-[50px]"
      name="大盘云图"
      type="primary"
      size="large"
      link
      @on-click="openDapan"
    />
    <div class="flex items-center gap-2">
      <div class="text-[#999]">账户资产:</div>
      <div class="font-bold text-[24px]">
        {{ numberToMoney(props.accountAsset) }}
      </div>
    </div>
    <div class="flex items-center gap-2">
      <div class="text-[#999]">今日收益:</div>
      <div
        :class="props.changeAmount <= 0 ? 'text-[#00c853]' : 'text-[#ff4444]'"
        class="font-bold text-[24px]"
      >
        {{ props.changeAmount > 0 ? "+" : ""
        }}{{ numberToMoney(props.changeAmount) }}
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { numberToMoney } from "@/utils/index";
import FdButton from "@/components/fd-button/index.vue";

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
const openDapan = () => {
  window.open("https://dapanyuntu.com/");
};
</script>
<style lang="scss" scoped></style>
