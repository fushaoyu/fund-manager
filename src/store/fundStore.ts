import { defineStore } from 'pinia';
import { generateUUID, ACCOUNT } from '@/utils';
import { dayjs } from 'element-plus';
import { useElMessageBox } from '@/hooks';

const { errorToast } = useElMessageBox();

export const useFundStore = defineStore(
  'fund',
  () => {
    // const user_funds = ref<IFundStore.IUserFundsItem[]>([
    //   {
    //     id: 'fb3fb989-fd67-4dd4-abff-82a7c06ffe86',
    //     fund_name: '富国中证细分化工产业主题ETF联接C',
    //     fund_code: '020274',
    //     account: 1,
    //     accountText: '支付宝',
    //     new_net_value: 1.5274,
    //     new_return: 739.5256600000029,
    //     new_increase: 2.48,
    //     new_valuation_ime: '2026-02-06 15:00',
    //     net_value: 1.4904,
    //     net_value_time: '2026-02-05',
    //     initial_net_value: 1.5512,
    //     holding_return: -475.6948839999964,
    //     holding_return_rate: -1.5342962078253382,
    //     quantity: 19987.18,
    //     position_amount: 31004.11,
    //     initial_buy_time: '2026-02-06 17:36:20',
    //     x_axis: [],
    //     y_axis: [],
    //   },
    //   {
    //     id: 'a7d32f29-c05e-4277-91cc-037a78f43940',
    //     fund_name: '中银稳健增利债券A',
    //     fund_code: '163806',
    //     account: 1,
    //     accountText: '支付宝',
    //     new_net_value: 1.2328,
    //     new_return: 86.18870399999051,
    //     new_increase: 0.12,
    //     new_valuation_ime: '2026-02-06 15:00',
    //     net_value: 1.2314,
    //     net_value_time: '2026-02-05',
    //     initial_net_value: 1.2221,
    //     holding_return: 658.7279519999958,
    //     holding_return_rate: 0.8812083988827117,
    //     quantity: 61563.36,
    //     position_amount: 74752.8,
    //     initial_buy_time: '2026-02-06 17:48:55',
    //     x_axis: [],
    //     y_axis: [],
    //   },
    //   {
    //     id: 'c64d9d82-628d-49cb-8927-e828c1760fa4',
    //     fund_name: '浦银双月鑫60天滚动持有短债C',
    //     fund_code: '013746',
    //     account: 1,
    //     accountText: '支付宝',
    //     new_net_value: 1.1114,
    //     new_return: 9.131585999998995,
    //     new_increase: 0.02,
    //     new_valuation_ime: '2026-02-06 15:00',
    //     net_value: 1.1112,
    //     net_value_time: '2026-02-05',
    //     initial_net_value: 1.0951,
    //     holding_return: 744.2242589999992,
    //     holding_return_rate: 1.4884485179999982,
    //     quantity: 45657.93,
    //     position_amount: 50000,
    //     initial_buy_time: '2026-02-06 17:51:01',
    //     x_axis: [],
    //     y_axis: [],
    //   },
    //   {
    //     id: '3a342912-6db8-4803-a603-0591a2d8ae94',
    //     fund_name: '招商量化精选股票A',
    //     fund_code: '001917',
    //     account: 1,
    //     accountText: '支付宝',
    //     new_net_value: 3.735,
    //     new_return: 9.082534999999787,
    //     new_increase: 0.21,
    //     new_valuation_ime: '2026-02-06 15:00',
    //     net_value: 3.7273,
    //     net_value_time: '2026-02-05',
    //     initial_net_value: 3.8922,
    //     holding_return: -185.42526000000004,
    //     holding_return_rate: -4.038877284083459,
    //     quantity: 1179.5500000000002,
    //     position_amount: 4591.01,
    //     initial_buy_time: '2026-02-06 17:37:30',
    //     x_axis: [],
    //     y_axis: [],
    //   },
    //   {
    //     id: 'fda8f725-5681-40a4-9d71-512bb696a82a',
    //     fund_name: '上银慧元利90天持有期债券A',
    //     fund_code: '021282',
    //     account: 1,
    //     accountText: '支付宝',
    //     new_net_value: 1.0614,
    //     new_return: 0.9865219999998913,
    //     new_increase: 0.01,
    //     new_valuation_ime: '2026-02-06 15:00',
    //     net_value: 1.0613,
    //     net_value_time: '2026-02-05',
    //     initial_net_value: 1.0582,
    //     holding_return: 31.56870399999871,
    //     holding_return_rate: 0.3024001808536399,
    //     quantity: 9865.22,
    //     position_amount: 10439.38,
    //     initial_buy_time: '2026-02-06 17:48:07',
    //     x_axis: [],
    //     y_axis: [],
    //   },
    //   {
    //     id: '9bc78d25-5881-44a8-93bf-d129b7616b82',
    //     fund_name: '创金合信资源主题精选股票A',
    //     fund_code: '003624',
    //     account: 1,
    //     accountText: '支付宝',
    //     new_net_value: 4.6814,
    //     new_return: -3.7741899999998236,
    //     new_increase: -0.08,
    //     new_valuation_ime: '2026-02-06 15:00',
    //     net_value: 4.6849,
    //     net_value_time: '2026-02-05',
    //     initial_net_value: 4.6298,
    //     holding_return: 55.64234399999962,
    //     holding_return_rate: 1.2511151184282037,
    //     quantity: 1078.34,
    //     position_amount: 4447.42,
    //     initial_buy_time: '2026-02-06 17:44:36',
    //     x_axis: [],
    //     y_axis: [],
    //   },
    //   {
    //     id: '11ba6cc6-88c7-45c5-aa23-5d60603de4d1',
    //     fund_name: '天弘中证科创创业50ETF联接C',
    //     fund_code: '012895',
    //     account: 1,
    //     accountText: '支付宝',
    //     new_net_value: 0.9896,
    //     new_return: -11.368690999999918,
    //     new_increase: -0.97,
    //     new_valuation_ime: '2026-02-06 15:00',
    //     net_value: 0.9993,
    //     net_value_time: '2026-02-05',
    //     initial_net_value: 1.0493,
    //     holding_return: -69.97019099999984,
    //     holding_return_rate: -5.6895122823850715,
    //     quantity: 1172.03,
    //     position_amount: 1229.81,
    //     initial_buy_time: '2026-02-06 17:39:12',
    //     x_axis: [],
    //     y_axis: [],
    //   },
    //   {
    //     id: '34e8a30c-18f3-4176-9097-d30e91d14465',
    //     fund_name: '招商中证白酒指数C',
    //     fund_code: '012414',
    //     account: 1,
    //     accountText: '支付宝',
    //     new_net_value: 0.7237,
    //     new_return: -11.804960000000026,
    //     new_increase: -2.4,
    //     new_valuation_ime: '2026-02-06 15:00',
    //     net_value: 0.7415,
    //     net_value_time: '2026-02-05',
    //     initial_net_value: 1,
    //     holding_return: -183.24216,
    //     holding_return_rate: -36.51988201530612,
    //     quantity: 663.2,
    //     position_amount: 501.76,
    //     initial_buy_time: '2026-02-06 17:42:21',
    //     x_axis: [],
    //     y_axis: [],
    //   },
    //   {
    //     id: '33ab0a03-bee6-4b58-8c00-b7bd78bda923',
    //     fund_name: '华夏中证沪深港黄金产业股票ETF联接C',
    //     fund_code: '021075',
    //     account: 1,
    //     accountText: '支付宝',
    //     new_net_value: 1.7978,
    //     new_return: -57.49848299999964,
    //     new_increase: -0.59,
    //     new_valuation_ime: '2026-02-06 15:00',
    //     net_value: 1.8085,
    //     net_value_time: '2026-02-05',
    //     initial_net_value: 2.047,
    //     holding_return: -1339.1235480000007,
    //     holding_return_rate: -12.173850436363642,
    //     quantity: 5373.6900000000005,
    //     position_amount: 11000,
    //     initial_buy_time: '2026-02-06 17:16:42',
    //     x_axis: [],
    //     y_axis: [],
    //   },
    //   {
    //     id: 'c0d6c816-8227-46cf-be07-40bc16efabd6',
    //     fund_name: '嘉实上证科创板芯片ETF发起联接C',
    //     fund_code: '017470',
    //     account: 2,
    //     accountText: '腾讯理财通',
    //     new_net_value: 2.0808,
    //     new_return: -100.42609499999955,
    //     new_increase: -1.1,
    //     new_valuation_ime: '2026-02-06 15:00',
    //     net_value: 2.1039,
    //     net_value_time: '2026-02-05',
    //     initial_net_value: 2.3002,
    //     holding_return: -953.8305299999992,
    //     holding_return_rate: -9.53830529999999,
    //     quantity: 4347.45,
    //     position_amount: 10000,
    //     initial_buy_time: '2026-02-06 17:53:47',
    //     x_axis: [],
    //     y_axis: [],
    //   },
    //   {
    //     id: '1025cba3-d699-49bd-ab09-3028e2e2aba3',
    //     fund_name: '永赢先锋半导体智选混合C',
    //     fund_code: '025209',
    //     account: 1,
    //     accountText: '支付宝',
    //     new_net_value: 1.6028,
    //     new_return: -138.16278399999962,
    //     new_increase: -1.52,
    //     new_valuation_ime: '2026-02-06 15:00',
    //     net_value: 1.6276,
    //     net_value_time: '2026-02-05',
    //     initial_net_value: 1.6016,
    //     holding_return: 6.685296000000501,
    //     holding_return_rate: 0.07492349400358968,
    //     quantity: 5571.08,
    //     position_amount: 8922.83,
    //     initial_buy_time: '2026-02-06 17:45:28',
    //     x_axis: [],
    //     y_axis: [],
    //   },
    // ]);
    const user_funds = ref<IFundStore.IUserFundsItem[]>([]);

    /**
     * 获取基金实时估值数据（适配新接口）
     * @param fundCode 6位基金代码
     * @returns 标准化的基金实时数据（与原结构一致）
     */
    const getFundInfo = async (item: IFundStore.IUserFundsItem) => {
      // 修复：使用新浪财经实时估值 API（通过代理）
      const res = await fetch(
        `/api/js/${item.fund_code}.js?timestamp=${Date.now()}`,
        {
          method: 'GET',
        },
      );
      const text = await res.text();
      // 解析回调函数格式的数据
      const dataStr = text.replace(/^jsonpgz\(|\);?$/g, '');
      const fundData = JSON.parse(dataStr);
      // console.log(dayjs().isSame(fundData.gztime, 'year'), '是否相同');
      // 截取时间部分 hh:mm:ss
      if (!dayjs().isSame(fundData.gztime, 'year')) {
        item.x_axis = [];
        item.y_axis = [];
      } else if (item.x_axis.some((x) => x.indexOf(fundData.gztime) === -1)) {
        const date = fundData.gztime.substr(11);
        item.x_axis.push(date);
        item.y_axis.push(Number(fundData.gsz));
      }
      // 计算对比昨日收益 = (最新净值 - 单位净值) * 持有的份额
      const new_return =
        (Number(fundData.gsz) - Number(fundData.dwjz)) * item.quantity;
      // 计算持有收益 = (最新净值 - 初始净值) * 持有的份额
      const holding_return =
        (Number(fundData.gsz) - Number(item?.initial_net_value ?? 0)) *
        item.quantity;
      // 计算收益率 = (持有收益 / 持有成本) * 100
      const holding_return_rate = (holding_return / item.position_amount) * 100;
      return {
        ...item,
        net_value: Number(fundData.dwjz), // 净值
        net_value_time: fundData.jzrq, // 净值时间
        new_net_value: Number(fundData.gsz), // 最新净值
        new_return: new_return, //需要计算
        new_increase: Number(fundData.gszzl), // 最新涨幅（%）
        new_valuation_ime: fundData.gztime, // 最新估值时间
        holding_return: holding_return, // 持有收益
        holding_return_rate: holding_return_rate, // 持有收益率
      };
    };
    // 刷新基金实时数据
    const refreshFundData = async () => {
      const result = await Promise.allSettled(
        user_funds.value.map((item) => getFundInfo(item)),
      );
      // 过滤成功结果
      const successfulFunds = result
        .filter((item) => item.status === 'fulfilled')
        .map((item) => item.value);
      // 更新基金数据
      user_funds.value = successfulFunds;
    };
    // 新增持有基金
    const addUserFunds = async (fund: IFundStore.IAddUserFundParam) => {
      const _id = generateUUID();
      const accountText =
        ACCOUNT.find((item) => item.value === fund.account)?.label || '';
      const data: IFundStore.IUserFundsItem = {
        id: _id,
        fund_name: fund.fund_name,
        fund_code: fund.fund_code,
        account: fund.account,
        accountText,
        new_net_value: 0,
        new_return: 0,
        new_increase: 0,
        new_valuation_ime: '',
        net_value: 0,
        net_value_time: '',
        initial_net_value: fund?.position ?? null!,
        holding_return: 0,
        holding_return_rate: 0,
        quantity: fund.quantity,
        position_amount: fund.position_amount,
        initial_buy_time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        x_axis: [],
        y_axis: [],
      };
      const fundData = await getFundInfo(data);
      user_funds.value.push(fundData);
    };
    // 补仓持有基金
    const replenishUserFunds = async (
      fund: IFundStore.IReplenishUserFundParam,
    ) => {
      const data = user_funds.value.find((item) => item.id === fund.id);
      if (!data) return errorToast('基金不存在');
      // 成本 = 补充成本 + 初始成本
      const replenishPositionAmount =
        data.position_amount + fund.position_amount;
      // 数量 = 初始数量 + 补充数量
      const replenishQuantity = Number(data.quantity) + Number(fund.quantity);
      // 净值 = 总成本 / 总数量
      const replenishNetValue = (
        replenishPositionAmount / replenishQuantity
      ).toFixed(4);
      // 更新基金数据
      if (data) {
        data.position_amount = replenishPositionAmount;
        data.quantity = replenishQuantity;
        data.initial_net_value = Number(replenishNetValue);
      }
      refreshFundData();
    };
    // 减仓持有基金
    const reduceUserFunds = async (fund: IFundStore.IReduceUserFundParam) => {
      const data = user_funds.value.find((item) => item.id === fund.id);
      if (!data) return errorToast('基金不存在');
      // 成本 = 初始成本 - 转出成本
      const reducePositionAmount = data.position_amount - fund.position_amount;
      // 数量 = 初始数量 - 转出数量
      const reduceQuantity = Number(data.quantity) - Number(fund.quantity);
      // 更新基金数据
      if (data) {
        data.position_amount = reducePositionAmount;
        data.quantity = reduceQuantity;
      }
      refreshFundData();
    };
    // 删除持有基金
    const removeUserFunds = (id: string) => {
      user_funds.value = user_funds.value.filter((item) => item.id !== id);
    };
    return {
      user_funds,
      getFundInfo,
      refreshFundData,
      addUserFunds,
      replenishUserFunds,
      reduceUserFunds,
      removeUserFunds,
    };
  },
  {
    persist: true,
  },
);
