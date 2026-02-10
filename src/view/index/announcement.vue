<template>
  <div
    class="w-full flex items-center gap-8 rounded-xl box-border p-[20px] text-[16px] bg-[#1A0F36] shadow-[0px_0px_10px_0px_rgba(0,0,0,0.1)]"
  >
    <div class="flex items-center gap-2">
      <div class="cursor-pointer" @click="openDapan">大盘云图</div>
      <el-icon class="cursor-pointer" size="12" @click="isCheck = !isCheck">
        <component :is="isCheck ? 'Hide' : 'View'" />
      </el-icon>
    </div>
    <div>账户资产：{{ !isCheck ? '****' : numberToMoney(accountAsset) }}</div>
    <div>
      今日收益：
      <span :class="changeAmount <= 0 ? 'text-[#00c853]' : 'text-[#ff4444]'">
        {{
          !isCheck
            ? '****'
            : `${changeAmount > 0 ? '+' : ''}${numberToMoney(changeAmount)}`
        }}
      </span>
    </div>
    <div>
      最后更新时间：<span>{{ updateDate }}</span>
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
  updateDate: {
    type: String,
    default: '',
  },
});

const isCheck = ref<boolean>(true);
const openDapan = () => {
  window.open('https://dapanyuntu.com/');
};
</script>
<style lang="scss" scoped></style>
