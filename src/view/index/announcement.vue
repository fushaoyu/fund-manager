<template>
  <div
    class="w-full flex flex-col gap-2 bg-[#ffffff] border border-[#e5e5e5] rounded-xl box-border p-[20px] text-[16px] shadow-[0px_0px_10px_0px_rgba(0,0,0,0.1)]"
  >
    <div class="w-[160px] flex items-center pl-[50px]">
      <fd-button
        name="大盘云图"
        type="primary"
        size="large"
        link
        @on-click="openDapan"
      />
      <fd-button
        type="primary"
        size="large"
        :icon-name="isCheck ? 'Hide' : 'View'"
        link
        @on-click="isCheck = !isCheck"
      />
    </div>
    <div class="flex items-center gap-2">
      <div class="w-[120px] text-right text-[#999]">账户资产:</div>
      <div class="font-bold text-[24px]">
        {{ !isCheck ? '****' : numberToMoney(accountAsset) }}
      </div>
    </div>
    <div class="flex items-center gap-2">
      <div class="w-[120px] text-right text-[#999]">今日收益:</div>
      <div
        :class="changeAmount <= 0 ? 'text-[#00c853]' : 'text-[#ff4444]'"
        class="font-bold text-[24px]"
      >
        {{
          !isCheck
            ? '****'
            : `${changeAmount > 0 ? '+' : ''}${numberToMoney(changeAmount)}`
        }}
      </div>
    </div>
    <div class="flex items-center gap-2">
      <div class="w-[120px] text-right text-[#999]">最后更新时间:</div>
      <div>{{ updateDate }}</div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { numberToMoney } from '@/utils/index';
import FdButton from '@/components/fd-button/index.vue';

const props = defineProps({
  accountAsset: {
    type: Number,
    default: 0,
  },
  changeAmount: {
    type: Number,
    default: 0,
  },
  updateDate: {
    type: String,
    default: '',
  },
});

const isCheck = ref<boolean>(false);
const openDapan = () => {
  window.open('https://dapanyuntu.com/');
};
</script>
<style lang="scss" scoped></style>
