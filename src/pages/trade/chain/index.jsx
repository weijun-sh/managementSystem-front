import React, {useRef, useEffect, useState} from 'react';
import http from "@/utils/http";
import {Card, Col, Form, Input, Row, Select, Button, Table, Tooltip} from "antd";
import CONS from '../constant'
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
          <div className='ellipsis'>{ellipsisCenter(data) }</div>
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
          <div className='ellipsis'>{ellipsisCenter(data)}</div>
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
          <div className='ellipsis'>{ellipsisCenter(data) }</div>
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
          <div className='ellipsis'>{ellipsisCenter(data)}</div>
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
          <div className='ellipsis'>{ellipsisCenter(data)}</div>
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
        <div>{toThousands(data)}</div>
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
        <div style={{width: 80}}>{renderStatus(data)}</div>
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
        <div style={{width: 160}}>{jsDateFormatter(data)}</div>
      ) 
    }
  },
  {
    title: "交易存储时间",
    dataIndex: "timestamp",
    key: "timestamp",
    render: (data) => {
      return (
        <div style={{width: 160}}>{jsDateFormatter(data)}</div>
      ) 
    }
  },
  {
    title: "swaptx确定数",
    dataIndex: "confirmations",
    key: "confirmations"
  },

];

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

function renderStatus(status){
  return SwapStatus[status]
}

function transferSecond(second_time) {

  if (!second_time) {
    return second_time
  }
  var time = parseInt(second_time) + "s";
  if (parseInt(second_time) > 60) {

    var second = parseInt(second_time) % 60;
    var min = parseInt(second_time / 60);
    time = min + "m " + second + "s";

    if (min > 60) {
      min = parseInt(second_time / 60) % 60;
      var hour = parseInt(parseInt(second_time / 60) / 60);
      time = hour + "h " + min + "m " + second + "s";

      if (hour > 24) {
        hour = parseInt(parseInt(second_time / 60) / 60) % 24;
        var day = parseInt(parseInt(parseInt(second_time / 60) / 60) / 24);
        time = day + "days " + hour + "h " + min + "m " + second + "s";
      }
    }

  }
  return time;
}
let jsDateFormatter = function (timestamp) {
  if (!timestamp) {
    return '-'
  }
  if ((timestamp + "").length === 10) {
    timestamp = timestamp * 1000
  }
  let date = new Date(timestamp)
  var seperator1 = "-";
  var seperator2 = ":";
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate + " " + date.getHours() + seperator2 + date.getMinutes() + seperator2 + date.getSeconds();
  return currentdate;
}

// 正则表达式
const toThousands = (num) => {
  if (!num) {
    return num
  }
  return num.toString().replace(/\d+/, function (n) {
    return n.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
  });
};

function ellipsisCenter(str) {
  if (!str) { return '' }
  return str.substr(0, 5) + "..." + str.substr(str.length - 4)
}


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
          {/* <Form.Item
            label="异常交易分类"
            name="exception"
          >
            <Select
              style={{width: 160, marginTop: 4}}
              allowClear={true}
              placeholder="请选择分类"
            >
              <Select.Option value={'未验证'}>未验证</Select.Option>
              <Select.Option value={'没有发送'}>没有发送</Select.Option>
              <Select.Option value={'未上链'}>未上链</Select.Option>
              <Select.Option value={'大额'}>大额</Select.Option>
              <Select.Option value={'交易错误'}>交易错误</Select.Option>
            </Select>
          </Form.Item> */}
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
