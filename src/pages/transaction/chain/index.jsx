import React, { useState} from 'react';

import SearchTable from 'mc/table/SearchTable';
import PageContainer from "mc/container/PageContainer";

import Services from '../../../services/api';
import TradeUtils, {deepMapList} from '../tradeUtils'
import './index.less'
import Logs from "./components/Logs";
import Process from "./components/Process";
import {useSearchParams} from "react-router-dom";
import {Collapse} from "antd";

const options = TradeUtils.renderChainIDOptions();
let completes = [];


export default function Chain() {
    const [tableRef, setTableRef] = useState(null);
    const [logs, setLogs] = useState(null);
    const [swaptx, setSwaptx] = useState(null);
    const [visible, setVisible] = useState(false);
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
                        min: 40,
                        message: "交易哈希长度不正确"
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

            setSwaptx(null)
            setLogs(null);
            setVisible(false)
            Services.getSwap({
                params: {
                    chainid,
                    txid,
                }
            }).then((response) => {
                let data = response.result.data;

                let list = deepMapList(data);
                let logs = data.log || [];
                let swaptx = data.swaptx;


                setSwaptx(swaptx);
                setLogs(logs);
                resolve(list);
            }).catch((error) => {
                reject(error);
                setLogs(null)
            }).finally(() => {

            })
        })
    }

    return (
        <PageContainer className='chain-container'>
            <SearchTable
                rowKey={"txid"}
                columnIndex={false}
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
                loadedSuccess={(list) => {
                    setVisible(list && list.length)
                }}
                loadStart={() => {
                    setVisible(false)
                }}
            />

            <div
                className={"chain-detail-container"}
                hidden={!visible}
            >
                <h3 className={"detail-header"}>交易详情</h3>
                <Collapse>
                    <Logs
                        logs={logs}
                        visible={visible}
                    />
                    <Process
                        swaptx={swaptx}
                        visible={visible}
                    />
                </Collapse>
            </div>
        </PageContainer>
    )
};
