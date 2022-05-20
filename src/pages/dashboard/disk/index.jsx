import React from 'react';
import './index.less';
import data from './data';
import PieCharts from './components/pie.jsx';
import { Collapse, Select } from 'antd';
const { Panel } = Collapse;
import { Card } from 'antd';
import { RedoOutlined } from '@ant-design/icons';
function callback(key) {
  console.log(key);
}

function formatData(data) {
  const { blocks, used, available, percent } = data;
  return [
    {
      type: '已使用',
      value: used,
    },
    {
      type: '剩余    ',
      value: available,
    },
  ];
}
export default function Page() {

  return (
    <div className="disk-container">
      <div className="header-wrap">
        <span className='title'>服务器磁盘监控</span>

        <div style={{ float: 'right', overflow: 'hidden' }}>
          <RedoOutlined style={{ fontSize: 18, cursor: 'pointer' }} />
          &nbsp;&nbsp;&nbsp;&nbsp;
          <Select defaultValue={0} style={{ width: 90 }}>
            <Select.Option value={0}>Off</Select.Option>
            <Select.Option value={10}>10S</Select.Option>
            <Select.Option value={20}>20S</Select.Option>
            <Select.Option value={30}>30S</Select.Option>
          </Select>
        </div>
      </div>

      <Collapse defaultActiveKey={['1']}>
        <Panel
          style={{ background: '#eee', overflow: 'hidden' }}
          key={1}
          header={`服务器概览: 节点数量${data.list.length}`}
        >
          {data.list.map((item) => {
            return (
              <div
                style={{
                  margin: '2px 8px',
                  display: 'inline-block',
                  overflow: 'hidden',
                  boxShadow: '3px 3px 3px 2px #eee',
                  padding: 4
                }}
              >
                <strong>{item.node}</strong>&nbsp;
                {item.fs.map((ifs, index) => {
                  return (
                    <span
                      key={index}
                      style={{
                        fontSize: 14,
                        background:
                          ifs.percent > 80
                            ? '#ff0000'
                            : 'green',
                            marginRight: 10,
                            color: '#fff',
                            borderRadius: 4
                      }}
                    >
                      &nbsp;{ifs.path} &nbsp;&nbsp;
                      {ifs.percent > 80 ? '异常' : '正常'}&nbsp;
                    </span>
                  );
                })}
              </div>
            );
          })}
        </Panel>
      </Collapse>
      {data.list.map((item, index) => {
        const header = (
          <span style={{ fontSize: 16 }}>
            服务器节点 &nbsp;&nbsp;
            <strong>{item.node}</strong>
          </span>
        );
        return (
          <Collapse
            defaultActiveKey={['1', '2']}
            key={index}
            onChange={callback}
          >
            <Panel header={header} key="1" style={{ background: '#eee' }}>
              {item.fs &&
                item.fs.map((litem, lindex) => {
                  const width = (1 / item.fs.length) * 90 + '%';
                  return (
                    <Card
                      key={lindex}
                      style={{
                        display: 'inline-block',
                        overflow: 'hidden',
                        width,
                        textAlign: 'center',
                        marginRight: 10,
                        boxShadow: '2px 3px 3px 3px #ddd',
                        minWidth: 440,
                        maxWidth: 600,
                      }}
                    >
                      <h3 style={{ display: 'block', overflow: 'hidden' }}>
                        <span>
                          路径： <strong style={{}}>{litem.path}</strong>
                        </span>
                        &nbsp;&nbsp;
                        <span>
                          挂载点: <strong style={{}}>{litem.mountedOn}</strong>
                        </span>
                        &nbsp;&nbsp;
                        <span
                          style={{
                            color: litem.percent > 80 ? '#F33' : '#333',
                          }}
                        >
                          已使用： <strong>{litem.percent}%</strong>
                        </span>
                      </h3>

                      <PieCharts data={formatData(litem)} />
                    </Card>
                  );
                })}
            </Panel>
          </Collapse>
        );
      })}
    </div>
  );
}
