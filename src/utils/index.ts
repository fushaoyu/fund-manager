export * from './dict';
export * from './exportExcel';
export * from './excelParser';
/**
 * 数字转换为金额格式
 * @param num
 * @returns
 */
export function numberToMoney(num: number) {
  return num.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

/**
 * 生成uuid唯一值
 * @returns  uuid字符串
 */
export function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// 下载方法
export function downloadFile(url: string, fileName: string) {
  try {
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName || 'download';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } catch (error) {
    console.warn('超链接下载失败:', error);
  }
}

// 导出和导入时的字段映射
export const FUND_FIELD_MAPPING = {
  id: '基金id（本地持仓的唯一ID）',
  fund_name: '基金名称',
  fund_code: '基金代码',
  account: '平台代码',
  accountText: '平台文本',
  new_net_value: '最新净值',
  new_return: '最新收益',
  new_increase: '最新收益率',
  new_valuation_ime: '最新估值时间',
  net_value: '净值',
  net_value_time: '净值时间',
  initial_net_value: '初始净值',
  holding_return: '持有收益',
  holding_return_rate: '持有收益率',
  quantity: '持有数量份额',
  position_amount: '持仓成本（买入时的总金额）',
  initial_buy_time: '初次添加时间',
  x_axis: '今日走势时间',
  y_axis: '今日走势净值',
};
/**
 * 映射Excel表头到IUserFundsItem字段（需根据你的Excel表头调整）
 * @example Excel表头：["基金名称", "基金代码", "购买平台", ...] → 映射到接口字段
 */
export const getHeaderToFieldMap = (
  headerRow: string[],
): Record<string, keyof IFundStore.IUserFundsItem> => {
  const headerMap: Record<string, keyof IFundStore.IUserFundsItem> = {};
  headerRow.forEach((header, index) => {
    const trimmedHeader = header.trim();
    for (const element in FUND_FIELD_MAPPING) {
      if (trimmedHeader === (FUND_FIELD_MAPPING as any)[element]) {
        headerMap[index] = element as keyof IFundStore.IUserFundsItem;
      }
    }
  });
  // 校验必填字段是否存在
  const requiredFields: (keyof IFundStore.IUserFundsItem)[] = [
    'fund_name', // 基金名称
    'fund_code', // 基金代码
    'accountText', // 购买平台
    'new_net_value', // 最新净值
    'quantity', // 持有数量 份额
    'position_amount', // 持仓成本（买入时的总金额）
    'initial_buy_time', // 初次添加时间
  ];
  const missingFields = requiredFields.filter(
    (field) => !Object.values(headerMap).includes(field),
  );
  if (missingFields.length > 0)
    throw new Error(`Excel表头缺少必填字段：${missingFields.join('、')}`);
  return headerMap;
};
/**
 * 将Excel行数据转换为IUserFundsItem
 */
export const convertRowToFundItem = (
  row: string[],
  headerMap: Record<string, keyof IFundStore.IUserFundsItem>,
) => {
  const ACCOUNT_MAPPING: any = {
    支付宝: { account: 1, accountText: '支付宝' },
    腾讯理财通: { account: 2, accountText: '腾讯理财通' }, // 兼容别名
    京东金融: { account: 3, accountText: '京东金融' }, // 兼容别名
    微信: { account: 2, accountText: '微信' },
    京东: { account: 3, accountText: '京东' },
  };
  // 1. 提取行数据并映射到接口字段
  const rawData: Partial<IFundStore.IUserFundsItem> = {};
  Object.entries(headerMap).forEach(([colIndex, field]) => {
    const cellValue = row[Number(colIndex)]?.trim() ?? '';
    if (cellValue !== '') (rawData as any)[field] = cellValue;
  });
  // 2. 平台文本转account数字（如“支付宝”→1）
  const accountInfo = ACCOUNT_MAPPING[rawData.accountText as string];
  if (!accountInfo) throw new Error(`不支持的平台：${rawData.accountText}`);
  return {
    // 生成唯一ID（基金代码+平台+时间戳，避免重复）
    id: generateUUID(),
    fund_name: rawData.fund_name as string,
    fund_code: rawData.fund_code as string,
    account: accountInfo.account,
    accountText: accountInfo.accountText,
    // 数值类型转换（处理空值、百分比字符串）
    new_net_value: rawData?.new_net_value ?? 0,
    new_return: rawData?.new_return ?? 0,
    new_increase: rawData?.new_increase ?? 0,
    new_valuation_ime: rawData.new_valuation_ime || new Date().toLocaleString(), // 默认当前时间
    net_value: rawData?.net_value ?? rawData.new_net_value, // 默认用最新净值
    net_value_time:
      rawData.net_value_time || (rawData.initial_buy_time as string), // 默认用买入时间
    initial_net_value: rawData?.initial_net_value ?? 0,
    holding_return: rawData?.holding_return ?? 0,
    holding_return_rate: rawData?.holding_return_rate ?? 0,
    quantity: rawData?.quantity ?? 0,
    position_amount: rawData?.position_amount ?? 0,
    initial_buy_time: rawData?.initial_buy_time ?? '',
    x_axis: rawData?.x_axis ?? [],
    y_axis: rawData?.y_axis ?? [],
  };
};
