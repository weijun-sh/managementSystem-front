import React, { useRef, useEffect, useState } from 'react';
import http from "@/utils/http";
import { Card, Col, Form, Input, Row, Select, Button, Table, Tooltip } from "antd";
import './index.less'
import TradeUtils from '../tradeUtils'
import Utils from '@/utils/index'

const api = 'http://112.74.110.203:20522/rpc'

console.log("Utils ==>", Utils.Math)
const columns = [
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
        <div style={{ width: 290 }}>
          <div>Sent: {Utils.Math.toThousands(record.value)}</div>
          <div>Received: {Utils.Math.toThousands(record.swapvalue)}</div>
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
        <div style={{ width: 90 }}>
          <div style={{ color: '#6262ca' }}>{record.fromChainID}</div>
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
        <div style={{ width: 90 }}>
          <div style={{ color: '#6262ca' }}>{record.toChainID}</div>
          <div>{Utils.Layout.ellipsisCenter(record.bind)}</div>
        </div>
      )
    }
  },
  {
    title: "耗时",
    dataIndex: 'timestamp',
    key: 'timestamp',
    render: (data, record) => {
      let current = new Date().getTime();
      let pass = record.timestamp * 1000;
      let gap = ((current - pass) / 1000).toFixed(0);

      return (
        <div style={{minWidth: 120}}>
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
        <div style={{ width: 80 }}>{TradeUtils.renderStatus(data)}</div>
      )
    }
  },
];

export default () => {
  const [list, setList] = useState(null);
  const [formRef, setFormRef] = useState(null);
  const [loading, setLoading] = useState(false);


  function getList() {
    if (!formRef) {
      return;
    }
    setLoading(true)
    formRef.validateFields().then((values) => {
      const { txid, chainid } = values;
      http.http({
        method: 'post',
        url: 'http://112.74.110.203:20522/rpc',
        data: {
          "jsonrpc": "2.0",
          "method": "swap.GetSwapNotStable",
          "id": 1
        }
      }).then((response) => {

        let list = [];
        response.result.data.Router.map((item, index) => {
          for (let key in item) {
            list = list.concat(item[key])
          }
          return item;
        })
        setList(list);
      }).catch((error) => {
      }).finally(() => {
        setLoading(false)
      })
    }).catch(() => {
      setLoading(false)
    })

  }

  useEffect(() => {
    getList();
  }, [formRef]);
  return (
    <div>
      <Card hidden>
        <Form
          ref={(node) => {
            setFormRef(node);
          }}
          layout="inline"
        >
          <Button
            onClick={getList}
            type={"primary"}
            style={{ float: 'right', marginLeft: 10, marginTop: 4 }}
          >
            刷新
          </Button>

        </Form>
      </Card>
      <Card
        title="查询结果"
        style={{ marginTop: 10 }}
        extra={(
          <Button
            onClick={getList}
            type={"primary"}
            style={{ float: 'right', marginLeft: 10, marginTop: 4 }}
          >
            刷新
          </Button>
        )}
      >
        <Table
          bordered={true}
          rowKey={"txid"}
          dataSource={list}
          columns={columns}
          loading={loading}
          size={"middle"}
          scroll={{ x: 740 }}
        />

      </Card>
    </div>
  )
};
