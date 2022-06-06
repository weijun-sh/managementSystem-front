import React, {useRef, useEffect, useState} from 'react';
import http from "@/utils/http";
import {Card, Col, Form, Input, Row, Select, Button, Table} from "antd";

const api = 'http://112.74.110.203:20522/rpc'
// 0x8b97eaa1ceee9d7cb7d67e5f7da15f460233e1b13f3894d28a51e72ab840dbac

const columns = [
  {
    title: '交易哈希',
    dataIndex: 'txhash',
    key: 'bind',
  },
  {
    title: '链',
    dataIndex: 'chainid',
    key: 'chainid',
  },
  {
    title: '异常分类',
    dataIndex: 'exception',
    key: 'exception',
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'exception',
  },
  {
    title: '分析',
    dataIndex: 'analyze',
    key: 'analyze',
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
        //setList(error)
        setList([{
          txhash: '0x8b97eaa1ceee9d7cb7d67e5f7da15f460233e1b13f3894d28a51e72ab840dbac',
          chainid: '1(eth)',
          exception: '失败',
          status: '失败',
          analyze: '测试数据',
        }, {
          txhash: '0x8b97eaa1ceee9d7cb7d67e5f7da15f460233e1b13f3894d28a51e72ab840dbac',
          chainid: '56(eth)',
          exception: '',
          status: '成功',
          analyze: '测试数据',
        }])
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
          <Form.Item
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
          scroll={{x: 800}}
        />

      </Card>
    </div>
  )
};
