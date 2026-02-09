export const columns = [
  {
    title: '基金名称',
    key: 'fund_name',
    options: {
      fixed: true,
      width: 300,
      formatter: (row: IFundStore.IUserFundsItem) => {
        return h('div', [
          h('div', `${row.fund_name}`),
          h('div', `${row.fund_code}`),
          h('div', `${row.accountText}`),
        ]);
      },
    },
  },
  {
    title: '最新信息',
    key: 'new_info',
    slotName: 'new_info',
    options: {
      width: 250,
    },
  },
  {
    title: '持有信息',
    key: 'holding_info',
    slotName: 'holding_info',
    options: {
      width: 250,
    },
  },
  {
    title: '当前收益',
    key: 'holding_return',
    options: {
      minWidth: 150,
      formatter: (row: IFundStore.IUserFundsItem) => {
        const value = row.position_amount + row.holding_return;
        return h(
          'div',
          {
            class: value > row.position_amount ? 'text-[red]' : 'text-[green]',
          },
          value.toFixed(2),
        );
      },
    },
  },
  {
    title: '今日盈亏',
    key: 'today_profit_loss',
    slotName: 'today_profit_loss',
    options: {
      width: 250,
    },
  },
  {
    title: '持有数量',
    key: 'quantity',
    options: {
      minWidth: 150,
      formatter: (row: IFundStore.IUserFundsItem) => {
        return h(
          'div',
          { style: 'font-weight: 700;' },
          row.quantity.toFixed(2),
        );
      },
    },
  },
  {
    title: '持有成本',
    key: 'position_amount',
    options: {
      minWidth: 150,
      formatter: (row: IFundStore.IUserFundsItem) => {
        return h('div', { style: 'font-weight: 700;' }, row.position_amount);
      },
    },
  },
  {
    title: '添加时间',
    key: 'initial_buy_time',
    options: {
      width: 200,
    },
  },
  {
    title: '操作',
    key: 'operate',
    slotName: 'operate',
    options: {
      minWidth: 200,
      align: 'center',
      fixed: 'right',
    },
  },
];
