import React, { useMemo, useState } from 'react';
import TradeUtils from '../tradeUtils'
import Services from '../services/index';
import SearchTable from '@/multiComponents/table/SearchTable';

export default () => {
  const [tableRef, setTableRef] = useState(null);

  let columns = useMemo(() => {
    let columns = _.cloneDeep(TradeUtils.getUnascertainedColumns());
    columns.push({
      title: '交易哈希',
      dataIndex: 'txhash',
      key: 'txhash',
      hidden: true,
      search: {
        label: "交易哈希",
        name: "txid",
        type: 'input',
        className: 'xxx',
        style:{width: 600},
        rules: [
          {
            required: true,
          }
        ],
        componentProps: {
          allowClear: true
        }
      }
    });
    columns.push({
      title: '链',
      dataIndex: 'chainid',
      key: 'chainid',
      hidden: true,
      search: {
        className: 'xxx',
        style:{minWidth: 200},
        label: "请选择链",
        name: "chainid",
        type: 'select',
        options: [{
          value: '1',
          label: `1 (${TradeUtils.renderChainID(1)})`
        }, {
          value: '56',
          label: `56 (${TradeUtils.renderChainID(56)})`
        }],
        rules: [
          {
            required: true,
          }
        ],
        componentProps: {
          allowClear: true
        }
      },
  
      render: (data, record) => {
        return (
          <div >{data}</div>
        )
      }
    });
  
    return columns;
  }, [])


  function getList(info){
    return new Promise((resolve, reject) => {
      const { chainid, txid } = info.params;
      Services.getSwap({
        chainid,
        txid,
      }).then((response) => {
        let list = [response.result.data];
        resolve(list);
      }).catch((error) => {
        reject(error)
      })
    })
  }

  return (
    <div className='chain-container'>
      <SearchTable
        scroll={{x: 720}}
        getRef={(node) => {
          if (tableRef) {
            return
          }
          setTableRef(node);
        }}
        columns={columns}
        getList={getList}
      />
    </div>
  )
};
