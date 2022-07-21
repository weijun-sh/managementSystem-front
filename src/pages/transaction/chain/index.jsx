import React, {useState} from 'react';

import SearchTable from 'mc/table/SearchTable';
import PageContainer from "mc/container/PageContainer";

import Services from '../../../services/api';
import TradeUtils, {deepMapList} from '../tradeUtils'
import './index.less'
import Logs from "./components/Logs";
import Process from "./components/Process";
import {useSearchParams} from "react-router-dom";
import {Collapse, message} from "antd";

const options = TradeUtils.renderChainIDOptions();

export default function Chain() {
    const [tableRef, setTableRef] = useState(null);
    const [logs, setLogs] = useState(null);
    const [swaptx, setSwaptx] = useState(null);
    const [visible, setVisible] = useState(false);
    let [params] = useSearchParams();
    let chainId = params.get('chainid');
    let hash = params.get('hash');

    let columns = function () {
        //only one record , need not sorter
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
                    completeKey: "chainhash",

                }
            }
        }

        const chainInput = {
            title: '主链',
            dataIndex: 'chainid',
            key: 'chainid',
            hidden: true,
            search: {
                className: 'xxx',
                style: {minWidth: 230, textAlign: 'left'},
                label: "主链",
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
            const {chainid, txid, bridge} = info.params;

            window.location.hash = `#/transition/chain?hash=${txid}&chainid=${chainid}`

            setSwaptx(null)
            setLogs(null);
            setVisible(false)

            let params = {
                chainid,
                txid,
                bridge: bridge
            }
            Services.getSwap({
                params: params
            }).then((response) => {
                let data = response.result.data;

                let list = deepMapList(data);
                let logs = data.log || [];
                let swaptx = data.swaptx;

                setSwaptx(swaptx);
                setLogs(logs);
                resolve(list);
            }).catch((error) => {
                if(bridge == null && error && error.error && error.error.message === 'tx not found'){
                    setTimeout(() => {
                        message.warn("可以尝试 [全文搜索]", 3)
                    }, 1000)
                }
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
                scroll={{x: 1200}}
                getRef={(node) => {
                    if (tableRef) {
                        return
                    }
                    setTableRef(node);
                    if (chainId && hash) {
                        node.fetchData({
                            params: {
                                bridge: null
                            }
                        })
                    }
                }}
                formSubmits={[{
                    label: '查询',
                    onClick: () => {
                        tableRef.fetchData({
                            params: {
                                bridge: null
                            }
                        });

                    }
                }, {
                    label: '全文搜索',
                    onClick: () => {
                        tableRef.fetchData({
                            params: {
                                bridge: 'all'
                            }
                        })
                    },
                    style: {opacity: 0.5},
                    //type: 'dashed'
                }]}
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
                        res={logs}
                        visible={visible}
                    />
                    <Process
                        res={swaptx}
                        visible={visible}
                    />
                </Collapse>
            </div>
        </PageContainer>
    )
};
