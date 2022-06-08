import React, { useRef, useEffect, useState } from 'react';
import http from "@/utils/http";
import { Card, Col, Form, Input, Row, Select, Button, Table, Tooltip, message } from "antd";
import './index.less'
import TradeUtils from '../tradeUtils'
import { history } from 'umi';

export default (props) => {
  const [list, setList] = useState(null);
  const [formRef, setFormRef] = useState(null);
  const [loading, setLoading] = useState(false);
  const [bridgeParams, setBridgeParams] = useState(null);

  function getList() {
    if (!formRef || !bridgeParams) {
      return;
    }
    setLoading(true)
    formRef.validateFields().then((values) => {
      let { status, bridge } = values;
      status ||= [];

      //status '' 为所有， bridge 从路由中获取
      http.http({
        method: 'post',
        url: 'http://112.74.110.203:20522/rpc',
        data: {
          "jsonrpc": "2.0",
          "method": "swap.GetSwapHistory",
          "params": [{
            "bridge": bridgeParams,
            "status": ""
          }],
          "id": 1
        }
      }).then((response) => {

        let list = [];
        for(let outKey in response.result.data){
          response.result.data[outKey].map((item, index) => {
            for (let key in item) {
              list = list.concat(item[key])
            }
            return item;
          })
        }
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

  useEffect(() => {
    let bridge = props.location.query.bridge;
    if(!bridge){
      message.error("请选择要查看的桥/路由, 即将跳转到总览", 3, () => {
        history.push('/trade/summary')
      })
      return;
    }
    
    setBridgeParams(bridge);
  }, [])

  return (
    <div>
      <Card hidden={true}>
        <Form
          ref={(node) => {
            setFormRef(node);
          }}
          layout="inline"
        >
          <Form.Item initialValue={"all"} name="bridge" label="桥/路由">
            <Input allowClear={true} placeholder='请输入，all 表示所有' />
          </Form.Item>
          <Form.Item name="status" label="状态">
            <Select
              mode="multiple"
              allowClear={true}
              placeholder="请选择状态"
              style={{ minWidth: 160 }}
            >
              <Select.Option value="0">0</Select.Option>
              <Select.Option value="8">8</Select.Option>
              <Select.Option value="9">9</Select.Option>
              <Select.Option value="12">12</Select.Option>
              <Select.Option value="14">14</Select.Option>
              <Select.Option value="17">17</Select.Option>
            </Select>
          </Form.Item>
          <Button
            onClick={getList}
            type={"primary"}
            style={{ float: 'right', marginLeft: 10, marginTop: 4 }}
          >
            查询
          </Button>

        </Form>
      </Card>
      <Card
        title={`桥交易信息: ${bridgeParams}`}
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
          columns={TradeUtils.getHistoryColumns()}
          loading={loading}
          size={"middle"}
          scroll={{ x: 740 }}
        />
      </Card>
    </div>
  )
};
