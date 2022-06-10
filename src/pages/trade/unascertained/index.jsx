import React, { useState } from 'react';
import './index.less'
import TradeUtils from '../tradeUtils'
import Services from '../services/index'
import SearchTable from '@/multiComponents/table/SearchTable';
const columns = TradeUtils.getUnascertainedColumns()
import _ from 'lodash'
export default () => {
  const [tableRef, setTableRef] = useState(null);

  function getList() {
    return new Promise((resolve, reject) => {
      Services.getSwapNotStable({
      }).then((response) => {
        let list = [];
        response.result.data.Router.map((item, index) => {
          for (let key in item) {
            list = list.concat(item[key])
          }
          return item;
        })
        resolve(list);
      }).catch((error) => {
        reject(error)
      })
    })
  }
  console.log("uncertained length ==>", columns.length)
  return (
    <div className='uncertained-container'>
      <SearchTable
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
