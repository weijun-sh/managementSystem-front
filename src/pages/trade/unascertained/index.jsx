import React, { useRef, useEffect, useState } from 'react';
import http from "@/utils/http";
import { Card, Col, Form, Input, Row, Select, Button, Table, Tooltip } from "antd";
import './index.less'
import CONS from '../constant'
const api = 'http://112.74.110.203:20522/rpc'
// 0x8b97eaa1ceee9d7cb7d67e5f7da15f460233e1b13f3894d28a51e72ab840dbac

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
          <div>Sent: {toThousands(record.value)}</div>
          <div>Received: {toThousands(record.swapvalue)}</div>
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
          <div>{ellipsisCenter(record.from)}</div>
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
          <div>{ellipsisCenter(record.bind)}</div>
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
      // if (pass > current) {
      //   console.log("current ==========>", current);
      //   console.log("pass =============>", pass);
      //   console.log("gap ==============>", gap);
      //   console.log("current ===>", jsDateFormatter(current));
      //   console.log("pass ======>", jsDateFormatter(pass));
      // }

      return (
        <div style={{minWidth: 120}}>
          {transferSecond(gap)}
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
        <div style={{ width: 80 }}>{CONS.renderStatus(data)}</div>
      )
    }
  },
  // {
  //   title: '交易哈希',
  //   dataIndex: 'txid',
  //   key: 'txid',
  //   render: (data) => {
  //     return (
  //       <Tooltip title={data}>
  //         <div className='ellipsis'>{data}</div>
  //       </Tooltip>
  //     ) 
  //   }
  // },
  // {
  //   title: 'router地址',
  //   dataIndex: 'txto',
  //   key: 'txto',
  //   render: (data) => {
  //     return (
  //       <Tooltip title={data}>
  //         <div className='ellipsis'>{data}</div>
  //       </Tooltip>
  //     ) 
  //   }
  // },
  // {
  //   title: '源链块高',
  //   dataIndex: 'txheight',
  //   key: 'txheight',
  // },
  // {
  //   title: '发送者',
  //   dataIndex: 'from',
  //   key: 'from',
  //   render: (data) => {
  //     return (
  //       <Tooltip title={data}>
  //         <div className='ellipsis'>{data}</div>
  //       </Tooltip>
  //     ) 
  //   }
  // },
  // {
  //   title: 'mpc地址',
  //   dataIndex: 'to',
  //   key: 'to',
  //   render: (data) => {
  //     return (
  //       <Tooltip title={data}>
  //         <div className='ellipsis'>{data}</div>
  //       </Tooltip>
  //     ) 
  //   }
  // },
  // {
  //   title: "bind",
  //   dataIndex: "绑定地址",
  //   key: "绑定地址"
  // },
  // {
  //   title: "发送数量",
  //   dataIndex: "value",
  //   key: "value",
  //   render: () => {
  //     return <div style={{width: 200}}></div>
  //   }
  // },
  // {
  //   title: "日志索引",
  //   dataIndex: "logIndex",
  //   key: "logIndex",
  //   render: () => {
  //     return <div style={{width: 200}}></div>
  //   }
  // },
  // {
  //   title: "源链chainid",
  //   dataIndex: "fromChainID",
  //   key: "fromChainID"
  // },
  // {
  //   title: "目标链chainid",
  //   dataIndex: "toChainID",
  //   key: "toChainID"
  // },
  // {
  //   title: "交换信息",
  //   dataIndex: "swapinfo",
  //   key: "swapinfo",
  //   render: (data) => {
  //     return (
  //       <div>{JSON.stringify(data.routerSwapInfo)}</div>
  //     )
  //   }
  // },
  // {
  //   title: "目标链交易",
  //   dataIndex: "swaptx",
  //   key: "swaptx",
  //   render: (data) => {
  //     return (
  //       <Tooltip title={data}>
  //         <div className='ellipsis'>{data}</div>
  //       </Tooltip>
  //     ) 
  //   }
  // },
  // {
  //   title: "目标链高度",
  //   dataIndex: "swapheight",
  //   key: "swapheight",
  //   width: 200
  // },
  // {
  //   title: "swap数量",
  //   dataIndex: "swapvalue",
  //   key: "swapvalue",
  //   render: (data) => {
  //     return (
  //       <div>{toThousands(data)}</div>
  //     )
  //   }
  // },
  // {
  //   title: "swapnonce",
  //   dataIndex: "swapnonce",
  //   key: "swapnonce"
  // },
  // {
  //   title: "状态值",
  //   dataIndex: "status",
  //   key: "status",
  //   render: (data) => {
  //     return (
  //       <div style={{width: 80}}>{(data)}</div>
  //     )
  //   }
  // },
  // {
  //   title: "可读状态",
  //   dataIndex: "statusmsg",
  //   key: "statusmsg"
  // },
  // {
  //   title: "交易发出时间",
  //   dataIndex: "inittime",
  //   key: "inittime",
  //   render: (data) => {
  //     return (
  //       <div style={{width: 160}}>{jsDateFormatter(data)}</div>
  //     ) 
  //   }
  // },
  // {
  //   title: "交易存储时间",
  //   dataIndex: "timestamp",
  //   key: "timestamp",
  //   render: (data) => {
  //     return (
  //       <div style={{width: 160}}>{jsDateFormatter(data)}</div>
  //     ) 
  //   }
  // },
  // {
  //   title: "swaptx确定数",
  //   dataIndex: "confirmations",
  //   key: "confirmations"
  // },

];

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
      const { txid, chainid } = values;
      http.http({
        method: 'post',
        url: 'http://112.74.110.203:20522/rpc',
        data: {
          "jsonrpc": "2.0",
          "method": "swap.GetSwapNotStable",
          //"params":[],
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
        //setList(error)
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
