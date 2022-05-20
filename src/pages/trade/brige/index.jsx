import React, { useRef } from 'react';
import ProTable, { TableDropdown } from '@ant-design/pro-table';
import request from 'umi-request';

const columns = [
  {
    dataIndex: 'index',
    valueType: 'indexBorder',
    width: 48,
  },
  {
    title: '交易哈希hash',
    dataIndex: 'hash',
    copyable: true,
    ellipsis: true,
    tip: '输入哈希值',
    formItemProps: {
      rules: [
        {
          required: true,
          message: '此项为必填项',
        },
      ],
    },
  },
  {
    disable: true,
    title: '选择桥',
    dataIndex: 'brige',
    filters: true,
    onFilter: true,
    valueType: 'select',
    valueEnum: {
      all: { text: '全部', status: 'Default' },
    },
  },
  {
    title: '操作',
    valueType: 'option',
    key: 'option',
    width: 100,
    render: (text, record, _, action) => [
      <a href={record.url} target="_blank" rel="noopener noreferrer" key="view">
        查看
      </a>,
    ],
  },
];

export default () => {
  const actionRef = useRef();
  return (
    <ProTable
      columns={columns}
      actionRef={actionRef}
      cardBordered
      request={async (params = {}, sort, filter) => {
        return Promise.resolve({
          data: [{hash: 'hash1', brige: 'brige1'},{hash: 'hash2', brige: 'brige2'},{hash: 'hash3', brige: 'brige3'},],
          page: 1,
          success: true,
          total: 3,
        });
      }}
      columnsState={{
        persistenceKey: 'pro-table-singe-demos',
        persistenceType: 'localStorage',
        onChange(value) {
          console.log('value: ', value);
        },
      }}
      rowKey="id"
      search={{
        labelWidth: 'auto',
      }}
      form={{
        // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
        syncToUrl: (values, type) => {
          if (type === 'get') {
            return {
              ...values,
              created_at: [values.startTime, values.endTime],
            };
          }
          return values;
        },
      }}
      pagination={{
        pageSize: 5,
        onChange: (page) => console.log(page),
      }}
      dateFormatter="string"
      headerTitle="查询结果"
    />
  );
};
