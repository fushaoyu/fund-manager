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

onMounted(() => {
  const instance = echarts.init(echartsRef.value);
  props.option && instance.setOption(props.option);
});
</script>
<style lang="scss" scoped></style>
