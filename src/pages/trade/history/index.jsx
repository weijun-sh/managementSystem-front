import React, { useEffect, useState } from 'react';
import { message } from "antd";
import './index.less'
import TradeUtils from '../tradeUtils';
import Services from '../services/index'
import { history } from 'umi';
import SearchTable from '@/multiComponents/table/SearchTable';
import _ from 'lodash'
function getColumns() {
  let columns = _.cloneDeep(TradeUtils.getUnascertainedColumns());
  return columns;
};
const columns = getColumns();
export default (props) => {
  const [tableRef, setTableRef] = useState(null);

  useEffect(() => {
    let bridge = props.location.query.bridge;
    if (!bridge) {
      message.error("请选择要查看的桥/路由, 即将跳转到总览", 2, () => {
        history.push('/trade/summary')
      })
      return;
    }
  }, []);

  function getList(info) {
    return new Promise((resolve, reject) => {
      //status '' 为所有， bridge 从路由中获取
      Services.getSwapHistory({
        "bridge": props.location.query.bridge,
        "status": ""
      }).then((response) => {
        let list = [];
        for (let outKey in response.result.data) {
          response.result.data[outKey].map((item, index) => {
            for (let key in item) {
              list = list.concat(item[key])
            }
            return item;
          })
        }
        resolve(list);
      }).catch((error) => {
        reject(error)
      })
    })
  }

  return (
    <div className='history-container'>

      <SearchTable
        getRef={(node) => {
          if (tableRef) {
            return
          }
          setTableRef(node);
          node.fetchData();
        }}
        columns={columns}
        getList={getList}
      />
    </div>
  )
};
