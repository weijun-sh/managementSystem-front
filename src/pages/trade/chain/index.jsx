import React, { useRef, useEffect, useState } from 'react';
import { Card, Col, Form, Input, Row, Select, Button, Table, Tooltip } from "antd";
import TradeUtils from '../tradeUtils'
import Services from '../services/index'

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
      Services.getSwap({
        chainid,
        txid,
      }).then((response) => {
        let list = [response.result.data]
        setList(list);
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
              style={{ width: 560, marginTop: 4 }}
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
              style={{ width: 160, marginTop: 4 }}
              allowClear={true}
              placeholder="请选择链"
            >
              <Select.Option value={'1'}>
                1 ({TradeUtils.renderChainID(1)})
              </Select.Option>
              <Select.Option value={'56'}>
                56 ({TradeUtils.renderChainID(56)})
              </Select.Option>
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
      <Card title="查询结果" style={{ marginTop: 10 }}>
        <Table
          bordered={true}
          rowKey={"timestamp"}
          dataSource={list}
          columns={TradeUtils.getUnascertainedColumns()}
          loading={loading}
          size={"middle"}
          scroll={{ x: 1100 }}
        />
      </Card>
    </div>
  )
};
