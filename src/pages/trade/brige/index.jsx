import React, { useRef, useEffect } from 'react';
import ProTable, { TableDropdown } from '@ant-design/pro-table';
import http  from "@/utils/http";
const api = 'http://112.74.110.203:20522/check/'
const columns = [
  {
    dataIndex: 'index',
    valueType: 'indexBorder',
    width: 48,
  },
  {
    title: 'hash',
    dataIndex: 'hash',
    copyable: true,
    ellipsis: true,
    tip: '输入哈希值',
    formItemProps: {
      rules: [
        {
          required: true,
          message: '输入哈希值',
        },
      ],
    },
  },
  {
    disable: true,
    title: '选择桥',
    dataIndex: 'bridge',
    filters: true,
    onFilter: true,
    valueType: 'select',
    valueEnum: {
      ETH2BSC: { text: 'ETH2BSC' },
      MATIC2Fantom: { text: 'MATIC2Fantom', },
    },
    formItemProps: {
      rules: [
        {
          required: true,
          message: '请选择桥',
        },
      ]
    }
  },
  {
    title: '等级',
    dataIndex: 'level',
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
  const formRef = useRef();

  useEffect(() => {
    formRef.current.setFieldsValue({
      hash: '0x8b97eaa1ceee9d7cb7d67e5f7da15f460233e1b13f3894d28a51e72ab840dbac',
      bridge: 'ETH2BSC'
    })
  })
  return (
    <ProTable
      columns={columns}
      actionRef={actionRef}
      cardBordered
      formRef={formRef}
      request={async (params = {}, sort, filter) => {
        console.log("params ==>", params);
        const {bridge, hash} = params;
        http.http({
         url: `${api}/${bridge}/${hash}`
        }).then((response) => {
          console.log("res ==>", response)
        }).catch((error) => {
          console.log("error ==>", error)
        })
        return Promise.resolve({
          data: [{hash: 'hash1', bridge: 'bridge1'},{hash: 'hash2', bridge: 'bridge2'},{hash: 'hash3', brige: 'brige3'},],
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
      rowKey="hash"
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
