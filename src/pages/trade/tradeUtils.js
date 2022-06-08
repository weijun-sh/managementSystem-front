import Utils from '@/utils/index'
import { toThousands } from '@/utils/math';
import { Link } from 'umi';
const SwapStatus = {
  0: 'TxNotStable',
  1: 'TxVerifyFailed',
  3: 'TxWithWrongValue',
  5: 'TxNotSwapped',
  7: 'TxProcessed',
  8: 'MatchTxEmpty',
  9: 'MatchTxNotStable',
  10: 'MatchTxStable',
  12: 'TxWithBigValue',
  14: 'MatchTxFailed',
  15: 'SwapInBlacklist',
  16: 'ManualMakeFail',
  19: 'TxWithWrongPath',
  20: 'MissTokenConfig',
  21: 'NoUnderlyingToken',
  255: 'KeepStatus',
  256: 'Reswapping',
}

const ChainID = {
  1: "ETH Mainnet",
  5: "GOERLI Mainnet",
  10: "OPTIMISTIC Mainnet",
  25: "CRONOS Mainnet",
  40: "TLOS Mainnet",
  56: "BSC Mainnet",
  57: "SYSCOIN Mainnet",
  66: "OKT Mainnet",
  86: "gatechain Mainnet",
  100: "XDAI Mainnet",
  106: "VELAS Mainnet",
  122: "FUSE Mainnet",
  128: "HECO Mainnet",
  137: "MATIC Mainnet",
  199: "BTT Mainnet",
  250: "FTM Mainnet",
  321: "KCS Mainnet",
  336: "SHI Mainnet",
  592: "ASTAR Mainnet",
  1024: "clover Mainnet",
  1030: "conflux Mainnet",
  1088: "METIS Mainnet",
  1284: "MOONBEAM Mainnet",
  1285: "MOONRIVER Mainnet",
  4689: "IOTEX Mainnet",
  42161: "ARB Mainnet",
  42220: "CELO Mainnet",
  42262: "OASIS Mainnet",
  43114: "AVAX Mainnet",
  32659: "FSN Mainnet",
  1313161554: "AURORA Mainnet",
  1666600000: "HARMONY Mainnet",
}

export function renderStatus(status) {
  return SwapStatus[status]
}

export function renderChainID(id) {
  if (!id) {
    return id;
  }
  return ChainID[id]
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


export function renderSummaryNum(number, record, onClick) {
  if (!number) {
    return number
  }
  if (number > 10) {
    return (
      <Link className="summary-number-red" to={`/trade/history?bridge=${record.bridge}`}>
        <strong>{number}</strong>
      </Link>
    )
  }
  if (number > 0) {
    return (
      <Link className="summary-number-yellow" to={`/trade/history?bridge=${record.bridge}`}>
        <strong>{number}</strong>
      </Link>
    )
  }
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
  renderSummaryNum,
  getUnascertainedColumns,
  getHistoryColumns,
  IndexColumn,
}

