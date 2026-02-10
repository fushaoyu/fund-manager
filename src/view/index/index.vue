<template>
  <div class="index-page">
    <announcement
      :accountAsset="accountAsset"
      :changeAmount="changeAmount"
      :updateDate="updateDate"
    />
    <div class="flex gap-2">
      <fd-button name="新增持有" color="#8B5CF6" @on-click="handleAdd" />
      <fd-button name="刷新收益" color="#1A0F36" @on-click="refreshFundData" />
      <fd-button name="导出持仓" color="#1A0F36" @on-click="handleExport" />
      <fd-upload-button
        name="导入模版"
        color="#1A0F36"
        @on-change="handleImport"
      />
      <fd-button
        name="下载模版"
        color="#1A0F36"
        @on-click="handleDownloadTemplate"
      />
    </div>
    <div class="flex flex-wrap gap-2">
      <div class="fd-card-box" v-for="(item, index) in tableData" :key="index">
        <div class="fd-card-box_title">
          <div class="flex gap-2">
            <el-text class="w-[200px]" type="primary" truncated>
              {{ item.fund_name }}
            </el-text>
            <span v-number-color>{{ item.holding_return_rate }}%</span>
          </div>
          <el-popover
            effect="dark"
            trigger="click"
            width="400"
            placement="bottom-start"
            popper-style="background-color: #1A0F36;  box-shadow: inset 0 0 15px 2px rgba(139, 92, 246, 0.5);"
          >
            <template #reference>
              <el-icon class="cursor-pointer" size="12"
                ><WarningFilled
              /></el-icon>
            </template>
            <LineEchart :x-axis="item.x_axis" :y-axis="item.y_axis" />
          </el-popover>
        </div>
        <div class="flex items-center justify-between text-[#A5A3B0]">
          <span>{{ item.fund_code }}</span>
          <span>{{ item.accountText }}</span>
          <span>{{ item.new_valuation_ime }}</span>
        </div>
        <div class="flex items-center justify-between">
          <div class="flex flex-col gap-2">
            <div>
              最新净值: <span>{{ item.new_net_value }}</span>
            </div>
            <div>
              最新收益: <span v-number-color>{{ item.new_return }}元</span>
            </div>
            <div>
              最新收益率: <span v-number-color>{{ item.new_increase }}%</span>
            </div>
          </div>
          <div class="flex flex-col gap-2">
            <div>
              昨日净值: <span>{{ item.net_value }}</span>
            </div>
            <div>
              持有净值: <span>{{ item.initial_net_value }}</span>
            </div>
            <div>
              持有收益:
              <span v-number-color>{{ item.holding_return }}元</span>
            </div>
          </div>
        </div>
        <!-- 按钮区域 -->
        <div class="buttons">
          <div class="buttons_add" @click="handleReplenish(item)">补仓</div>
          <div class="buttons_reduce" @click="handleReduceStock(item)">
            减仓
          </div>
          <div class="buttons_del" @click="handleRemove(item)">删除</div>
        </div>
      </div>
    </div>
  </div>
  <!-- 新增持仓表单 -->
  <formData ref="formDataRef" />
  <!-- 补仓表单 -->
  <replenishForm ref="replenishFormRef" />
  <!-- 减仓表单 -->
  <reduceStockForm ref="reduceStockFormRef" />
</template>

<script lang="ts" setup>
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
    const isAfterOrEqual15 = dayjs().isAfter(
      dayjs().hour(15).minute(0).second(0).millisecond(0),
    );
    if (isAfterOrEqual15) {
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
  .fd-card-box:hover {
    .buttons {
      opacity: 1;
    }
  }
  .buttons {
    opacity: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
    position: absolute;
    top: 0px;
    right: 0px;
    border-radius: 8px;
    background-color: rgba(0, 0, 0, 0.4);
    font-size: 14px;
    color: #fff;
    transition: all 0.3s ease-in-out;
    div {
      cursor: pointer;
      &:hover {
        text-shadow: 0px 0px 10px #fff;
      }
    }
    &_add {
      color: #7a43f8;
    }
    &_reduce {
      color: #f84343;
    }
    &_del {
      color: #fff;
    }
  }
}
</style>
