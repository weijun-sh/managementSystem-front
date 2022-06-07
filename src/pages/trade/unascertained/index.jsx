import React, {useRef, useEffect, useState} from 'react';
import http from "@/utils/http";
import {Card, Col, Form, Input, Row, Select, Button, Table, Tooltip} from "antd";
import './index.less'
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
          <div className='ellipsis'>{data}</div>
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
          <div className='ellipsis'>{data}</div>
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
          <div className='ellipsis'>{data}</div>
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
          <div className='ellipsis'>{data}</div>
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
          <div className='ellipsis'>{data}</div>
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
        <div style={{width: 80}}>{data}</div>
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

let jsDateFormatter = function (timestamp) {
  if(!timestamp){
    return '-'
  }
  if((timestamp + "").length === 10){
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
  var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate + " " + date.getHours() + seperator2 + date.getMinutes()+ seperator2 + date.getSeconds();    
  return currentdate;
}

// 正则表达式
const toThousands = (num = 0) => {
  return num.toString().replace(/\d+/, function(n) {
     return n.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
  });
};


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
          "method": "swap.GetSwapNotStable",
          "id": 1
        }
      }).then((response) => {
        
        console.log('response ==>', response.result.data.Router);
        let list = [];
        response.result.data.Router.map((item, index) => {
          for(let key in item){
            list = list.concat(item[key])
          }
          return item;
        })
        console.log("list ==>", list);
        setList(list);
      }).catch((error) => {
        //setList(error)
        console.log('error ==>', error)
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
      <Card>
        <Form
          ref={(node) => {
            

            setFormRef(node);

          }}
          layout="inline"
        >
          <Button
            onClick={getList}
            type={"primary"}
            style={{float: 'right', marginLeft: 10, marginTop: 4}}
          >
            刷新
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
          scroll={{x: 1200}}
        />

      </Card>
    </div>
  )
};
