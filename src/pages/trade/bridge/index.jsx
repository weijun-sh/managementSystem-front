import React, {useRef, useEffect, useState} from 'react';
import http from "@/utils/http";
import {Card, Col, Form, Input, Row, Select, Button, Table, Spin} from "antd";

const api = 'http://112.74.110.203:20522/check/'

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
      const {hash, bridge} = values;
      http.http({
        url: `${api}/${bridge}/${hash}`
      }).then((response) => {
        setList(response.data);
        //setList([{name: 'danny', age: 11}, {name: 'danny1', age: 12}])
        console.log('response ==>', response)
      }).catch((error) => {
        console.log('error ==>', error)
      }).finally(() => {
        setLoading(false)
      })
    }).catch(() => {
      setLoading(false)
    })

  }

  function jsonOutput(obj, tab) {
    if(!obj) return ''
    return JSON.stringify(obj, null, 4)
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
            name="hash"
          >
            <Input
              allowClear={true}
              placeholder={"请输入交易哈希"}
              style={{width: 560,  marginTop: 4}}
            />
          </Form.Item>
          <Form.Item
            label="请选择桥"
            name="bridge"
            rules={[
              {
                required: true,
              }
            ]}
          >
            <Select
              style={{width: 160, marginTop: 4}}
              allowClear={true}
              placeholder="请选择桥"
            >
              <Select.Option value={'ETH2BSC'}>ETH2BSC</Select.Option>
              <Select.Option value={'MATIC2Fantom'}>MATIC2Fantom</Select.Option>
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
      <Card title="查询结果" style={{marginTop: 10, position: "relative", minHeight: 200}}>
        <div
          style={{position: "absolute", width: '100%', height: '100%', display: "flex", justifyContent: 'center', background: 'rgba(255,255,255,0.4)'}}
          hidden={!loading}
        >
          <Spin
            size={"large"}
            style={{marginLeft: 'auto', marginRight: 'auto'}}
          />
        </div>

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
