<template>
  <div class="index-page">
    <announcement :accountAsset="accountAsset" :changeAmount="changeAmount" />
    <div class="flex gap-2">
      <fd-button name="新增持有" type="primary" @on-click="handleAdd" />
      <fd-button name="刷新" type="success" @on-click="refreshFundData" />
      <fd-button name="导出持仓配置" type="default" @on-click="handleExport" />
    </div>
    <fd-table
      rowKey="id"
      :tableData="tableData"
      :columns="columns"
    >
      <template #new_info="{ row }">
        <div>
          最近净值: <span>{{ row.new_net_value }}</span>
        </div>
        <div>
          最近收益: <span v-number-color>{{ row.new_return }}元</span>
        </div>
        <div>
          最近收益率: <span v-number-color>{{ row.new_increase }}%</span>
        </div>
        <div>
          最近估值时间: <span>{{ row.new_valuation_ime }}</span>
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
import { columns } from "./config";
import { useFundStore } from "@/store/fundStore";
import { useComponentRef, useElMessageBox } from "@/hooks";
import { exportExcel } from "@/utils";
import FdTable from "@/components/fd-table/index.vue";
import Announcement from "./announcement.vue";
import FdButton from "@/components/fd-button/index.vue";
import FormData from "./formData.vue";
import ReplenishForm from "./replenishForm.vue";
import ReduceStockForm from "./reduceStockForm.vue";

const fundStore = useFundStore();
const formDataRef = useComponentRef(FormData);
const replenishFormRef = useComponentRef(ReplenishForm);
const reduceStockFormRef = useComponentRef(ReduceStockForm);

const { confirm, successToast } = useElMessageBox();

const tableData = computed<IFundStore.IUserFundsItem[]>(() =>
  fundStore.user_funds.sort((a, b) => b.new_return - a.new_return)
);
// 账户资产
const accountAsset = computed(() => {
  return fundStore.user_funds.reduce((prev, cur) => {
    return prev + cur.position_amount + cur.holding_return;
  }, 0);
});
// 当日涨跌金额
const changeAmount = computed(() => {
  return fundStore.user_funds.reduce((prev, cur) => {
    return prev + cur.new_return;
  }, 0);
});
const refreshFundData = async () => {
  await fundStore.refreshFundData();
};
// 新增持有
const handleAdd = () => {
  formDataRef.value?.show();
};
// 补仓
const handleReplenish = async (row: IFundStore.IUserFundsItem) => {
  replenishFormRef.value?.show(row.id);
};
// 减仓
const handleReduceStock = async (row: IFundStore.IUserFundsItem) => {
  reduceStockFormRef.value?.show(row.id);
};
// 删除持有
const handleRemove = async (row: IFundStore.IUserFundsItem) => {
  await confirm({
    title: "确认删除",
    message: `确认删除基金 ${row.fund_name} 吗？`,
  });
  fundStore.removeUserFunds(row.id);
};
// 导出持有
const handleExport = async () => {
  try {
    // 导出字段映射
    const exportFields = {
      id: "基金id（本地持仓的唯一ID）",
      fund_name: "基金名称",
      fund_code: "基金代码",
      account: "平台代码",
      accountText: "平台文本",
      new_net_value: "最新净值",
      new_return: "最新收益",
      new_increase: "最新收益率",
      new_valuation_ime: "最新估值时间",
      net_value: "净值",
      net_value_time: "净值时间",
      initial_net_value: "初始净值",
      holding_return: "持有收益",
      holding_return_rate: "持有收益率",
      quantity: "持有数量 份额",
      position_amount: "持仓成本（买入时的总金额）",
      initial_buy_time: "初次添加时间",
    };
    await exportExcel(tableData.value, exportFields);
    successToast("导出成功");
  } catch (error) {
    console.error("导出Excel失败:", error);
  }
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
