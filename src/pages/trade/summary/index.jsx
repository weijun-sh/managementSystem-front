import React, { useState } from 'react';
import './index.less'
import Services from '../services/index'
import '../index.less';
import { Link } from 'umi';
import SearchTable from '@/multiComponents/table/SearchTable';
import _ from 'lodash'
function renderSummaryNum(number, record, onClick) {
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


const columns = [
  {
    title: 'Bridge',
    dataIndex: 'bridge',
    key: 'bridge',
  },
  {
    title: "Confirm(0)",
    dataIndex: "0",
    key: "0",
    render: (data, record) => {
      return renderSummaryNum(data, record)
    }
  },
  {
    title: "Sign(8)",
    dataIndex: '8',
    key: '8',
    render: (data, record) => {
      return renderSummaryNum(data, record,)
    }
  },
  ,
  {
    title: "Routing(9)",
    dataIndex: '9',
    key: '9',
    render: (data, record) => {
      return renderSummaryNum(data, record,)
    }
  },
  {
    title: "Success(10)",
    dataIndex: '10',
    key: '10',
    render: (data, record) => {
      return renderSummaryNum(data, record,)
    }
  },
  {
    title: "Big Amount(12)",
    dataIndex: "12",
    key: '12',
    render: (data, record) => {
      return <div style={{ width: 110 }}>
        {renderSummaryNum(data, record)}
      </div>
    }
  },
  {
    title: "Error(14)",
    dataIndex: "14",
    key: '14',
    render: (data, record) => {
      return renderSummaryNum(data, record, () => {

      })
    }
  },

  {
    title: "ToContract(17)",
    dataIndex: "17",
    key: '17',
    render: (data, record) => {
      return renderSummaryNum(data, record, () => {

      })
    }
  },
];

export default () => {
  const [tableRef, setTableRef] = useState(null);

  function getList() {
    return new Promise((resolve, reject) => {
      Services.getStatusInfo({
        bridge: 'all',
        status: [],
      }).then((response) => {
        let list = [];
        const data = response.result.data;
        let index = 1;
        for (let key in data) {

          let item = { 0: 0, 8: 0, 9: 0, 10: 0, 12: 0, 14: 0, 17: 0 };
          item = { ...item, ...data[key] };
          item.bridge = key;
          item.index = index++

          list.push(item);
        }
        resolve(list);
      }).catch((error) => {
        reject(error)
      })
    })
  }

  return (
    <div className='summary-container'>
      <SearchTable
        scroll={{ x: 1100 }}
        getRef={(node) => {
          if (tableRef) {
            return
          }
          setTableRef(node);
          node.fetchData();
        }}
        columns={_.cloneDeep(columns)}
        getList={getList}
      />
    </div>
  )
};
