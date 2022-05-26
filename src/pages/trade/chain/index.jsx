import React, {useRef, useEffect, useState} from 'react';
import http from "@/utils/http";
import {Card, Col, Form, Input, Row, Select, Button, Table} from "antd";

const api = 'http://112.74.110.203:20522/rpc'
// 0x8b97eaa1ceee9d7cb7d67e5f7da15f460233e1b13f3894d28a51e72ab840dbac

const columns = [
  {
    title: 'bind',
    dataIndex: 'bind',
    key: 'bind',
  },
  {
    title: 'isSwapin',
    dataIndex: 'isSwapin',
    key: 'isSwapin',
  },
  {
    title: 'level',
    dataIndex: 'level',
    key: 'level',
  },
  {
    title: '等级',
    dataIndex: 'level',
  },
  {
    title: 'msg',
    dataIndex: 'msg',
  },
  {
    title: 'pairID',
    dataIndex: 'pairID',
  },
  {
    title: 'status',
    dataIndex: 'status',
  },
  {
    title: 'time',
    dataIndex: 'time',
  },
  {
    title: 'txid',
    dataIndex: 'txid',
  },
];

export default () => {
  const [list, setList] = useState([]);
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
          "method": "swap.CheckTxhash",
          "params": [
            {
              "chainid": chainid,
              "txid": txid
            }
          ],
          "id": 1
        }
      }).then((response) => {
        setList(response.data);
        console.log('response ==>', response)
      }).catch((error) => {
        setList(error)
        console.log('error ==>', error)
      }).finally(() => {
        setLoading(false)
      })
    }).catch(() => {
      setLoading(false)
    })

  }

  function jsonOutput(obj, tab) {

    return JSON.stringify(obj, null, 4)
/*    let blank =<>&nbsp;&nbsp;&nbsp;&nbsp;</>
    let result = [];
    for(let key in obj){
      let value = obj[key];
      let item = null;
      if(Object.prototype.toString.call(value) === '[object Object]'){
        console.log("out ==>", value)
        value = (
          <>{'{'}
            {tab}{jsonOutput(value, blank)}
            {tab}{'}'}
          </>
        )
        item = <div>{tab}{key}: {value}</div>;
      }else {
        console.log('value ==>', value)
        item = <div>{blank}{key}: {value},</div>;
      }

      result.push(item)
    }
    return (
      <div>
        {result}
      </div>
    )*/
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
              <Select.Option value={'1'}>(1 eth)</Select.Option>
              <Select.Option value={'56'}>(56 bsc)</Select.Option>
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
        {
          jsonOutput(list)
        }
        {/*        <Table
          bordered={true}
          rowKey={"txid"}
          dataSource={list}
          columns={columns}
          loading={loading}
        />*/}

      </Card>
    </div>
  )
};
