import React, { useEffect, useState } from 'react';
import { Card, Col, Form, Input, Row, Select, Button, Table, Tooltip } from "antd";
import './index.less'
import Services from '../services/index'
import '../index.less';
import { Link } from 'umi';

function renderSummaryNum(number, record, onClick) {
  if (!number) {
    return number
  }
  if (number > 10) {
    return (
      <Link className="summary-number-red" to={`/trade/history?bridge=${record.bridge}`}>
        <strong>{number}</strong>
      </Link>
    )
  }
  if (number > 0) {
    return (
      <Link className="summary-number-yellow" to={`/trade/history?bridge=${record.bridge}`}>
        <strong>{number}</strong>
      </Link>
    )
  }
}


const columns = [
  {
    title: '#',
    dataIndex: 'index',
    key: 'index',
    render: (data, record, index) => {
      return data
    }
  },
  {
    title: 'Bridge',
    dataIndex: 'bridge',
    key: 'bridge',
  },
  {
    title: "Confirm(0)",
    dataIndex: "0",
    key: "0",
    render: (data, record) => {
      return renderSummaryNum(data, record, () => {

      })
    }
  },
  {
    title: "Sign(8)",
    dataIndex: '8',
    key: '8',
    render: (data, record) => {
      return renderSummaryNum(data, record, () => {

      })
    }
  },
  ,
  {
    title: "Routing(9)",
    dataIndex: '9',
    key: '9',
    render: (data, record) => {
      return renderSummaryNum(data, record, () => {

      })
    }
  },
  {
    title: "Success(10)",
    dataIndex: '10',
    key: '10',
    render: (data, record) => {
      return renderSummaryNum(data, record, () => {

      })
    }
  },
  {
    title: "Big Amount(12)",
    dataIndex: "12",
    key: '12',
    render: (data, record) => {
      return renderSummaryNum(data, record, () => {

      })
    }
  },
  {
    title: "Error(14)",
    dataIndex: "14",
    key: '14',
    render: (data, record) => {
      return renderSummaryNum(data, record, () => {

      })
    }
  },

  {
    title: "ToContract(17)",
    dataIndex: "17",
    key: '17',
    render: (data, record) => {
      return renderSummaryNum(data, record, () => {

      })
    }
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
      let { bridge, status } = values;
      status ||= []

      Services.getStatusInfo({
        bridge,
        status,
      }).then((response) => {
        let list = [];
        const data = response.result.data;
        let index = 1;
        for (let key in data) {

          let item = { 0: 0, 8: 0, 9: 0, 10: 0, 12: 0, 14: 0, 17: 0 };
          item = { ...item, ...data[key] };
          item.bridge = key;
          item.index = index++

          list.push(item);
        }
        console.log("list ==>", list);
        setList(list);
      }).catch((error) => {
        console.log("summary error ==>", error)
      }).finally(() => {
        setLoading(false)
      })
    }).catch((err) => {
      console.log("err ==>", err)
      setLoading(false)
    })

  }

  useEffect(() => {
    getList();
  }, [formRef]);
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
          rowKey={"index"}
          dataSource={list}
          columns={columns}
          loading={loading}
          size={"middle"}
          scroll={{ x: 720 }}
        />

      </Card>
    </div>
  )
};
