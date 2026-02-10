<template>
  <fd-echarts :option="option" />
</template>
<script lang="ts" setup>
import FdEcharts from '@/components/fd-echarts/index.vue';
import echarts from '@/utils/echartsCtx';
const props = defineProps({
  xAxis: {
    type: Array,
    default: () => [],
  },
  yAxis: {
    type: Array,
    default: () => [],
  },
});
const option = computed(() => ({
  tooltip: {
    trigger: 'axis',
  },
  grid: {
    left: '0',
    top: '0',
    right: '0',
    bottom: '0',
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: props.xAxis,
  },
  yAxis: {
    type: 'value',
    min: 'newMin',
    max: 'newMax',
    splitLine: {
      show: true, // 显示分割线
    },
    splitArea: {
      show: true, // 显示网格区域
    },
  },
  series: [
    {
      data: props.yAxis,
      type: 'line',
      smooth: true,
      itemStyle: {
        color: props.yAxis.every((item: any) => item < 0)
          ? 'rgb(128, 255, 165)'
          : 'rgb(255, 68, 68)',
      },
      lineStyle: {
        width: 0,
      },
      showSymbol: false,
      areaStyle: {
        opacity: 0.8,
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: props.yAxis.every((item: any) => item < 0)
              ? 'rgb(128, 255, 165)'
              : 'rgb(255, 68, 68)',
          },
          {
            offset: 1,
            color: props.yAxis.every((item: any) => item < 0)
              ? 'rgb(1, 191, 236)'
              : 'rgb(255, 68, 68,0.1)',
          },
        ]),
      },
    },
  ],
}));
</script>
<style lang="scss" scoped></style>
