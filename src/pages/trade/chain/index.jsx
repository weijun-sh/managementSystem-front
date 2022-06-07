import React, {useRef, useEffect, useState} from 'react';
import http from "@/utils/http";
import {Card, Col, Form, Input, Row, Select, Button, Table, Tooltip} from "antd";
import TradeUtils from '../tradeUtils'
import Utils from '@/utils/index'
const api = 'http://112.74.110.203:20522/rpc'

// 0x8b97eaa1ceee9d7cb7d67e5f7da15f460233e1b13f3894d28a51e72ab840dbac

const columns = [
  {
    title: '交易哈希',
    dataIndex: 'txid',
    key: 'txid',
    render: (data) => {
      return (
        <Tooltip title={data}>
          <div className='ellipsis'>{Utils.Layout.ellipsisCenter(data) }</div>
        </Tooltip>
      ) 
    }
  },
  {
    title: 'router地址',
    dataIndex: 'txto',
    key: 'txto',
    render: (data) => {
      return (
        <Tooltip title={data}>
          <div className='ellipsis'>{Utils.Layout.ellipsisCenter(data)}</div>
        </Tooltip>
      ) 
    }
  },
  {
    title: '源链块高',
    dataIndex: 'txheight',
    key: 'txheight',
  },
  {
    title: '发送者',
    dataIndex: 'from',
    key: 'from',
    render: (data) => {
      return (
        <Tooltip title={data}>
          <div className='ellipsis'>{Utils.Layout.ellipsisCenter(data) }</div>
        </Tooltip>
      ) 
    }
  },
  {
    title: 'mpc地址',
    dataIndex: 'to',
    key: 'to',
    render: (data) => {
      return (
        <Tooltip title={data}>
          <div className='ellipsis'>{Utils.Layout.ellipsisCenter(data)}</div>
        </Tooltip>
      ) 
    }
  },
  {
    title: "bind",
    dataIndex: "绑定地址",
    key: "绑定地址"
  },
  {
    title: "发送数量",
    dataIndex: "value",
    key: "value",
    render: () => {
      return <div style={{width: 200}}></div>
    }
  },
  {
    title: "日志索引",
    dataIndex: "logIndex",
    key: "logIndex",
    render: () => {
      return <div style={{width: 200}}></div>
    }
  },
  {
    title: "源链chainid",
    dataIndex: "fromChainID",
    key: "fromChainID"
  },
  {
    title: "目标链chainid",
    dataIndex: "toChainID",
    key: "toChainID"
  },
  {
    title: "交换信息",
    dataIndex: "swapinfo",
    key: "swapinfo",
    render: (data) => {
      return (
        <div>{JSON.stringify(data.routerSwapInfo)}</div>
      )
    }
  },
  {
    title: "目标链交易",
    dataIndex: "swaptx",
    key: "swaptx",
    render: (data) => {
      return (
        <Tooltip title={data}>
          <div className='ellipsis'>{Utils.Layout.ellipsisCenter(data)}</div>
        </Tooltip>
      ) 
    }
  },
  {
    title: "目标链高度",
    dataIndex: "swapheight",
    key: "swapheight",
    width: 200
  },
  {
    title: "swap数量",
    dataIndex: "swapvalue",
    key: "swapvalue",
    render: (data) => {
      return (
        <div>{Utils.Math.toThousands(data)}</div>
      )
    }
  },
  {
    title: "swapnonce",
    dataIndex: "swapnonce",
    key: "swapnonce"
  },
  {
    title: "状态值",
    dataIndex: "status",
    key: "status",
    render: (data) => {
      return (
        <div style={{width: 80}}>{TradeUtils.renderStatus(data)}</div>
      )
    }
  },
  {
    title: "可读状态",
    dataIndex: "statusmsg",
    key: "statusmsg"
  },
  {
    title: "交易发出时间",
    dataIndex: "inittime",
    key: "inittime",
    render: (data) => {
      return (
        <div style={{width: 160}}>{Utils.Time.dateFormatter(data)}</div>
      ) 
    }
  },
  {
    title: "交易存储时间",
    dataIndex: "timestamp",
    key: "timestamp",
    render: (data) => {
      return (
        <div style={{width: 160}}>{Utils.Time.dateFormatter(data)}</div>
      ) 
    }
  },
  {
    title: "swaptx确定数",
    dataIndex: "confirmations",
    key: "confirmations"
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
      console.log("values ==>", values);
      const {txid, chainid} = values;
      http.http({
        url: `${api}`,
        method: 'post',
        data: {
          "jsonrpc": "2.0",
          "method": "swap.GetSwap",
          "params": [
            {
              "chainid": chainid,
              "txid": txid
            }
          ],
          "id": 1
        }
      }).then((response) => {
        let list = [response.result.data]
        setList(list);
        console.log('list ==>', list)
      }).catch((error) => {
        console.log('error ==>', error)
      }).finally(() => {
        setLoading(false)
      })
    }).catch(() => {
      setLoading(false)
    })

  }
  return (
    <div>
      <Card>
        <Form
          ref={(node) => {
            setFormRef(node)
          }}
          layout="inline"
        >
          <Form.Item
            rules={[
              {
                required: true,
              },
              {
                len: 66,
                message: '请输入66位的 交易哈希'
              }
            ]}
            label="交易哈希"
            name="txid"
          >
            <Input
              allowClear={true}
              placeholder={"请输入hash"}
              style={{width: 560,  marginTop: 4}}
            />
          </Form.Item>
          <Form.Item
            label="请选择链"
            name="chainid"
            rules={[
              {
                required: true,
              }
            ]}
          >
            <Select
              style={{width: 160, marginTop: 4}}
              allowClear={true}
              placeholder="请选择链"
            >
              <Select.Option value={'1'}>1 (eth)</Select.Option>
              <Select.Option value={'56'}>56 (bsc)</Select.Option>
            </Select>
          </Form.Item>
          <Button
            onClick={getList}
            type={"primary"}
            style={{float: 'right', marginLeft: 10, marginTop: 4}}
          >
            查询
          </Button>

        </Form>
      </Card>
      <Card title="查询结果" style={{marginTop: 10}}>
        <Table
          bordered={true}
          rowKey={"txid"}
          dataSource={list}
          columns={columns}
          loading={loading}
          size={"middle"}
          scroll={{x: 1100}}
        />

      </Card>
    </div>
  )
};
