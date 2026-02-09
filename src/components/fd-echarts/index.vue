<template>
  <div class="w-[200px] h-[200px]" ref="echartsRef" id="echartsContainer"></div>
</template>
<script lang="ts" setup>
import echarts from '@/utils/echartsCtx';

const props = defineProps({
  option: {
    type: Object as () => any,
    default: () => ({}),
  },
});

const echartsRef = ref<HTMLDivElement>(null!);
const echartsInstance = ref<any>(null);

onMounted(() => {
  echartsInstance.value = echarts.init(echartsRef.value);
  props.option && echartsInstance.value.setOption(props.option);
});
watch(
  () => props.option,
  (newVal) => {
    newVal &&
      echartsRef.value &&
      echartsInstance.value.setOption(newVal);
  },
);
</script>
<style lang="scss" scoped></style>
