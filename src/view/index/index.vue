<template>
  <div class="index-page">
    <announcement
      :accountAsset="accountAsset"
      :changeAmount="changeAmount"
      :updateDate="updateDate"
    />
    <div class="flex gap-2">
      <fd-button name="新增持有" type="primary" @on-click="handleAdd" />
      <fd-button name="刷新" type="success" @on-click="refreshFundData" />
      <fd-button name="导出持仓配置" type="default" @on-click="handleExport" />
      <fd-upload-button
        name="导入模版"
        type="default"
        @on-change="handleImport"
      />
      <fd-button
        name="下载导入模版"
        type="default"
        @on-click="handleDownloadTemplate"
      />
    </div>
    <fd-table rowKey="id" :tableData="tableData" :columns="columns">
      <template #new_info="{ row }">
        <div>
          最新净值: <span>{{ row.new_net_value }}</span>
        </div>
        <div>
          最新收益: <span v-number-color>{{ row.new_return }}元</span>
        </div>
        <div>
          最新收益率: <span v-number-color>{{ row.new_increase }}%</span>
        </div>
        <div>
          最新估值时间: <span>{{ row.new_valuation_ime }}</span>
        </div>
      </template>
      <template #holding_info="{ row }">
        <div>
          昨日净值: <span>{{ row.net_value }}</span>
        </div>
        <div>
          持有净值: <span>{{ row.initial_net_value }}</span>
        </div>
        <div>
          持有收益:
          <span v-number-color>{{ row.holding_return }}</span>
        </div>
        <div>
          持有收益率:
          <span v-number-color>{{ row.holding_return_rate }}%</span>
        </div>
      </template>
      <template #today_profit_loss="{ row }">
        <LineEchart :y-axis="row.y_axis" :x-axis="row.x_axis" />
      </template>
      <template #operate="{ row }">
        <fd-button
          name="补仓"
          type="primary"
          link
          @on-click="handleReplenish(row)"
        />
        <fd-button
          name="减仓"
          type="primary"
          link
          @on-click="handleReduceStock(row)"
        />
        <fd-button
          name="删除"
          type="danger"
          link
          @on-click="handleRemove(row)"
        />
      </template>
    </fd-table>
  </div>
  <!-- 新增持仓表单 -->
  <formData ref="formDataRef" />
  <!-- 补仓表单 -->
  <replenishForm ref="replenishFormRef" />
  <!-- 减仓表单 -->
  <reduceStockForm ref="reduceStockFormRef" />
</template>

<script lang="ts" setup>
import { columns } from './config';
import { dayjs } from 'element-plus';
import { useFundStore } from '@/store/fundStore';
import { useComponentRef, useElMessageBox } from '@/hooks';
import {
  convertRowToFundItem,
  downloadFile,
  excelParser,
  exportExcel,
  FUND_FIELD_MAPPING,
  getHeaderToFieldMap,
} from '@/utils';
import FdTable from '@/components/fd-table/index.vue';
import Announcement from './announcement.vue';
import FdButton from '@/components/fd-button/index.vue';
import FdUploadButton from '@/components/fd-upload-button/index.vue';
import FormData from './formData.vue';
import ReplenishForm from './replenishForm.vue';
import ReduceStockForm from './reduceStockForm.vue';
import LineEchart from './lineEhart.vue';

const fundStore = useFundStore();
const formDataRef = useComponentRef(FormData);
const replenishFormRef = useComponentRef(ReplenishForm);
const reduceStockFormRef = useComponentRef(ReduceStockForm);

const { confirm, successToast, errorToast } = useElMessageBox();

const timeOut = ref<any>(null!);
// 持仓数据
const tableData = computed<IFundStore.IUserFundsItem[]>(() =>
  fundStore.user_funds.sort((a, b) => b.new_return - a.new_return),
);
// 更新日期
const updateDate = computed(
  () => fundStore.user_funds[0]?.new_valuation_ime || '',
);
// 账户资产
const accountAsset = computed(() => {
  return fundStore.user_funds.reduce((prev, cur) => {
    return prev + Number(cur.position_amount) + Number(cur.holding_return);
  }, 0);
});
// 当日涨跌金额
const changeAmount = computed(() => {
  return fundStore.user_funds.reduce((prev, cur) => {
    return prev + Number(cur.new_return);
  }, 0);
});

onMounted(() => {
  refreshFundData();
  timeOut.value = setInterval(() => {
    // 判断如果已经是在今日下午三点，就不刷新了
    if (dayjs().isSame(dayjs().endOf('day').subtract(3, 'hour'), 'hour')) {
      errorToast('已到下午三点，不再刷新');
      timeOut.value && clearInterval(timeOut.value);
      timeOut.value = null;
      return;
    }
    refreshFundData();
  }, 1000 * 30);
});
onUnmounted(() => {
  timeOut.value && clearInterval(timeOut.value);
  timeOut.value = null;
});
// 刷新持仓数据
const refreshFundData = async () => await fundStore.refreshFundData();
// 新增持有
const handleAdd = () => formDataRef.value?.show();
// 补仓
const handleReplenish = async (row: IFundStore.IUserFundsItem) =>
  replenishFormRef.value?.show(row.id);
// 减仓
const handleReduceStock = async (row: IFundStore.IUserFundsItem) =>
  reduceStockFormRef.value?.show(row.id);
// 删除持有
const handleRemove = async (row: IFundStore.IUserFundsItem) => {
  await confirm({
    title: '确认删除',
    message: `确认删除基金 ${row.fund_name} 吗？`,
  });
  fundStore.removeUserFunds(row.id);
};
// 导出持有
const handleExport = async () => {
  try {
    await exportExcel(tableData.value, FUND_FIELD_MAPPING);
    successToast('导出成功');
  } catch (error) {
    console.error('导出Excel失败:', error);
  }
};
// 导入持仓配置
const handleImport = async (file: File) => {
  // 实现导入逻辑
  const { headerRow, dataRows } = await excelParser(file);
  const headerToFieldMap = getHeaderToFieldMap(headerRow);
  const result = dataRows.map((row) =>
    convertRowToFundItem(row, headerToFieldMap),
  ) as unknown as IFundStore.IUserFundsItem[];
  await fundStore.importUserFunds(result);
  successToast('导入成功');
};
// 下载导入模版
const handleDownloadTemplate = () => {
  downloadFile('/fund-template.xlsx', '导入模版.xlsx');
};
</script>

<style lang="scss" scoped>
.index-page {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>
