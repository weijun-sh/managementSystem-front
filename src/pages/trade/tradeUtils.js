import Utils from '@/utils/index'
import { toThousands } from '@/utils/math';
import CONST from './constant'

export function renderStatus(status) {
  if (!status) {
    return status;
  }
  return CONST.SwapStatus[status]
}

export function renderChainID(id) {
  if (!id) {
    return id;
  }
  return CONST.ChainID[id]
}

function minifySent(num) {
  if (!num) {
    return num
  }
  let base = Math.pow(10, 18);
  if (num < base) {
    return toThousands(num)
  }
  return (num / base).toFixed(0);

}



export const IndexColumn = {
  title: '#',
  dataIndex: 'index',
  key: 'index',
  render: (data, record, index) => {
    return index + 1
  }
};

export const HistoryColumns = [
  IndexColumn,
  {
    title: '币种',
    dataIndex: 'swapinfo',
    key: 'swapinfo',
    render: (data, record) => {
      return (
        <div >{record.swapinfo.routerSwapInfo.tokenID}</div>
      )
    }
  },
  {
    title: "数量",
    dataIndex: "value",
    key: "value",
    render: (data, record,) => {
      return (
        <div>
          <div>Sent: {minifySent(record.value)}</div>
          <div>Received: {minifySent(record.swapvalue)}</div>
        </div>
      )
    }
  },
  {
    title: "发送",
    dataIndex: 'txid',
    key: 'txid',
    render: (data, record) => {
      return (
        <div>
          <div style={{ color: '#6262ca' }}>{renderChainID(record.fromChainID)}</div>
          <div>{Utils.Layout.ellipsisCenter(record.from)}</div>
        </div>
      )
    }
  },
  ,
  {
    title: "接收",
    dataIndex: 'txid',
    key: 'txid',
    render: (data, record) => {
      return (
        <div>
          <div style={{ color: '#6262ca' }}>{renderChainID(record.toChainID)}</div>
          <div>{Utils.Layout.ellipsisCenter(record.bind)}</div>
        </div>
      )
    }
  },
  {
    title: "耗时",
    dataIndex: 'timestamp',
    key: 'timestamp',
    sorter: (a, b) => b.timestamp - a.timestamp ,
    render: (data, record) => {
      let current = new Date().getTime();
      let pass = record.timestamp * 1000;
      let gap = ((current - pass) / 1000).toFixed(0);

      return (
        <div>
          {Utils.Time.transferSecond(gap)}
        </div>
      )
    }
  },
  {
    title: "状态",
    dataIndex: "status",
    key: 'status',
    render: (data) => {
      return (
        <div style={{ width: 80 }}>{renderStatus(data)}</div>
      )
    }
  },
];

export function getUnascertainedColumns() {
  return HistoryColumns;
}
export function getHistoryColumns() {
  return HistoryColumns;
}


export default {
  renderChainID,
  renderStatus,
  getUnascertainedColumns,
  getHistoryColumns,
  IndexColumn,
}

