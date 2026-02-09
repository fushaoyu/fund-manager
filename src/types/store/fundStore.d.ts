declare global {
  namespace IFundStore {
    // 新增基金参数
    interface IAddUserFundParam {
      // 基金值
      fund_value: string;
      // 基金名称
      fund_name: string;
      // 基金代码
      fund_code: string;
      // 持仓成本
      position_amount: number;
      // 持有数量
      quantity: strinnumberg;
      // 净值
      position: number;
      // 平台 1:支付宝 2:微信 3:京东
      account: 1 | 2 | 3;
    }
    // 补仓基金参数
    interface IReplenishUserFundParam {
      // 基金id（本地持仓的唯一ID）
      id: string;
      // 持仓成本
      position_amount: number;
      // 持有数量
      quantity: strinnumberg;
      // 净值
      position: number;
    }
    // 减仓基金参数
    interface IReduceUserFundParam {
      // 基金id（本地持仓的唯一ID）
      id: string;
      // 持仓成本
      position_amount: number;
      // 持有数量
      quantity: strinnumberg;
    }
    // 持有基金项
    interface IUserFundsItem {
      id: string; // 基金id（本地持仓的唯一ID）
      fund_name: string; // 基金名称
      fund_code: string; // 基金代码
      account: 1 | 2 | 3; // 平台 1:支付宝 2:微信 3:京东
      accountText: string; // 平台文本
      new_net_value: number; // 最新净值
      new_return: number; // 最新收益
      new_increase: number; // 最新收益率
      new_valuation_ime: string; // 最新估值时间
      net_value: number; // 净值
      net_value_time: string; // 净值时间
      initial_net_value: number; // 初始净值
      holding_return: number; // 持有收益
      holding_return_rate: number; // 持有收益率
      quantity: number; // 持有数量 份额
      position_amount: number; // 持仓成本（买入时的总金额）
      initial_buy_time: string; // 初次添加时间
      x_axis: string[]; // x轴时间数据
      y_axis: number[]; // y轴净值数据
    }
  }
}

export {};
