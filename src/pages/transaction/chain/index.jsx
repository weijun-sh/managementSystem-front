import React, {useEffect, useMemo, useState} from 'react';

import SearchTable from 'mc/table/SearchTable';
import PageContainer from "mc/container/PageContainer";

import Services from '../../../services/api';
import TradeUtils from '../tradeUtils'
import './index.less'
import Logs from "./components/Logs";
import {useSearchParams} from "react-router-dom";

const options = TradeUtils.renderChainIDOptions();
let completes = [];


export default function Chain() {
    const [tableRef, setTableRef] = useState(null);
    const [logs, setLogs] = useState(null);
    const [logsVisible, setLogsVisible] = useState(false);
    let [params] = useSearchParams();
    let chainId = params.get('chainid');
    let hash = params.get('hash');
    let columns = function () {
        let columns = TradeUtils.getChainColumns().map((item => {
            item.sorter = null;
            return item;
        }));

        const hashInput = {
            title: '交易hash',
            dataIndex: 'txhash',
            key: 'txhash',
            hidden: true,
            search: {
                label: "交易hash",
                name: "txid",
                type: 'input',
                className: 'xxx',
                style: {minWidth: 650, fontSize: 14},
                initialValue: hash,
                rules: [
                    {
                        required: true,
                        message: '请选择交易哈希'
                    }, {
                        len: 66,
                        message: "交易哈希为66位长度字符"
                    }
                ],
                componentProps: {
                    allowClear: true,
                    completes: completes
                }
            }
        }

        const chainInput = {
            title: '链',
            dataIndex: 'chainid',
            key: 'chainid',
            hidden: true,
            search: {
                className: 'xxx',
                style: {minWidth: 230, textAlign: 'left'},
                label: "链",
                name: "chainid",
                type: 'select',
                options: options,
                initialValue: chainId,
                rules: [
                    {
                        required: true,
                        message: '请选择链'
                    }
                ],
                componentProps: {
                    allowClear: true
                }
            },

            render: (data, record) => {
                return (
                    <div>{data}</div>
                )
            }
        }

        return [hashInput, chainInput, ...columns];
    }

    function getList(info) {
        return new Promise((resolve, reject) => {
            const {chainid, txid} = info.params;

            completes = ([...new Set([...completes, txid])])

            setLogs(null)
            Services.getSwap({
                params: {
                    chainid,
                    txid,
                }
            }).then((response) => {

                let list = [];
                let data = response.result.data;
                let bridge = data.bridge;
                let logs = data.log || [];

                setLogs(logs);
                for (let key in bridge) {
                    let item = bridge[key];
                    item.bridge = key;
                    list.push(item);
                }
                resolve(list);
            }).catch((error) => {
                reject(error);
                setLogs(null)
            }).finally(() => {
                setTimeout(() => {
                    setLogsVisible(!logsVisible)
                }, 200);
            })
        })
    }

    function isLogVisible() {
        if (!tableRef) {
            return false;
        }
        if (!tableRef.state.list) {
            return false
        }
        if (tableRef.state.list.length === 0) {
            return false
        }
        if (logs == null) {
            return false
        }
        return true
    }

    return (
        <PageContainer className='chain-container'>
            <SearchTable
                scroll={{x: 1060}}
                getRef={(node) => {
                    if(tableRef){return}
                    setTableRef(node);
                    if (chainId && hash) {
                        node.fetchData()
                    }
                }}
                columns={columns()}
                getList={getList}
                pagination={false}
            />

            <Logs
                logs={logs}
                visible={isLogVisible()}
            />

        </PageContainer>
    )
};
