import React, { useRef, useEffect, useState } from 'react';
import { Card, Col, Form, Input, Row, Select, Button, Table, Tooltip } from "antd";
import './index.less'
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
      Services.getSwapNotStable({
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
          rowKey={"timestamp"}
          dataSource={list}
          columns={TradeUtils.getUnascertainedColumns()}
          loading={loading}
          size={"middle"}
          scroll={{ x: 740 }}
        />
      </Card>
    </div>
  )
};
