import React, {useLayoutEffect, useState} from 'react';
import {useNavigate, useSearchParams} from 'react-router-dom';
import SearchTable from 'mc/table/SearchTable';
import Tabset, {TabsetPane} from 'mc/tabs/Tabset';
import Services from '../../../services/api';
import {
    mapSummaryStatus,
    mapSummarySuccessStatus,
    getRouterSummaryList,
    renderRouterColumn,
    db0First
} from '../tradeUtils'
import './index.less'

const RouterKey = 'router';
const BridgeKey = 'bridge';

export default function Summary() {
    const [routerRef, setRouterRef] = useState(null);
    const [bridgeRef, setBridgeRef] = useState(null);
    const [params] = useSearchParams();
    let tab = params.get("tab");
    tab ||= RouterKey;
    const nav = useNavigate();

    function renderSummaryNum(number, record, status, type) {

        if (!number) {
            return <div style={{textAlign: 'center'}}>-</div>
        }
        let href = `/transition/history?bridge=${record.bridge}&status=${status}&type=${type}`;
        href = href.replace(/_#/, '_db');
        let className = 'summary-number-yellow';

        function toHis(){
            nav(href)
        }

        if (status === '10') {
            return (
                <div style={{textAlign: 'center',}}>
                    {number}
                </div>
            )
        }

        if (status === '14') {

                className = 'summary-number-red'
                return (
                    <div onClick={toHis} className={className} style={{textAlign: 'center',}}>
                        {number}
                    </div>
                )

        }

        if (number > 30) {
            className = 'summary-number-red'
            return (
                <div onClick={toHis} className={className} style={{textAlign: 'center',}}>
                    {number}
                </div>
            )
        }

        return (
            <div
                className={className}
                onClick={toHis}
            >
                {number}
            </div>
        )
    }

    function routerColumns() {
        let statusList = [...mapSummaryStatus(), ...mapSummarySuccessStatus()];
        let columnsList = statusList.map(item => {
            const {key, value} = item;
            return {
                title: <span className='in-title'>{value}</span>,
                dataIndex: key,
                key: key,
                align: 'center',
                render: (data, record, index, list) => {
                    return renderSummaryNum(data, record, key, 'router')
                }
            }
        });
        return [
            {
                title: <span className='in-title'>Router</span>,
                dataIndex: 'bridge',
                key: 'bridge',
                render: renderRouterColumn

            },
            ...columnsList,
        ];
    }

    function bridgeColumns() {
        let colList = [...mapSummaryStatus(), ...mapSummarySuccessStatus()];
        let inList = colList.map(item => {
            const {key, value} = item;
            return {
                title: <span className='in-title'>{value}</span>,
                dataIndex: `swapin - ${key}`,
                key: `swapin - ${key}`,
                align: 'center',
                render: (data, record) => {
                    if (record['swapin']) {
                        return renderSummaryNum(record['swapin'][key], record, key, 'in')
                    }
                    return renderSummaryNum(0, record, key, 'in')
                }
            }
        });

        let outList = colList.map(item => {
            const {key, value} = item;
            return {
                title: <span className='out-title'>{value}</span>,
                dataIndex: `swapout - ${key}`,
                key: `swapout - ${key}`,
                align: 'center',
                render: (data, record) => {
                    if (record['swapout']) {
                        return renderSummaryNum(record['swapout'][key], record, key, 'out')
                    }
                    return renderSummaryNum(0, record, key, 'out')

                }
            }
        });

        return [
            {
                title: 'bridge',
                dataIndex: 'bridge',
                key: 'bridge',
                render: renderRouterColumn
            }, {
                title: <div className={"cate"}>
                    <div className={"cate-text"}>充值</div>
                </div>,
                dataIndex: 'swapin',
                key: 'swapin',
                children: inList
            }, {
                title: <div className={"cate"}>
                    <div className={"cate-text"}>提现</div>
                </div>,
                dataIndex: 'swapout',
                key: 'swapoutt',
                children: outList
            }
        ]
    }

    function formatKey(data){
        let list = [];
        for (let key in data) {
            let value = data[key];
            list.push({
                bridge: key,
                ...value
            })
        }
        return list;
    }

    function getRouterList() {
        return new Promise((resolve, reject) => {
            Services.getRouterStatusInfo({
                params: {
                    bridge: 'all',
                    status: [],
                }
            }).then((response) => {
                const data = response.result.data;

                let list = formatKey(data);

                list = db0First(list);

                resolve(list);
            }).catch((error) => {
                reject(error)
            })
        })
    }

    function getBridgeList() {
        return new Promise((resolve, reject) => {
            Services.getBridgeStatusInfo({
                params: {
                    bridge: 'all',
                    status: [],
                }
            }).then((response) => {
                const data = response.result.data;

                let list = formatKey(data);
                list = db0First(list);
                resolve(list);
            }).catch((error) => {
                reject(error)
            })
        })
    }

    function changeTab(key) {
        if (key === RouterKey) {
            routerRef && routerRef.fetchData();
            return;
        }
        bridgeRef && bridgeRef.fetchData();
    }

    return (
        <div className='summary-container'>
            <Tabset
                defaultActiveKey={tab}
                onChange={changeTab}
            >
                <TabsetPane tab={<div className='tab-title'>Router</div>} key={RouterKey}>
                    <SearchTable
                        scroll={{x: 660}}
                        getRef={(node) => {
                            if (routerRef) {
                                return
                            }
                            setRouterRef(node);
                            node.fetchData();
                        }}
                        columns={routerColumns()}
                        getList={getRouterList}
                        pagination={{pageSize: 150}}
                    />
                </TabsetPane>
                <TabsetPane tab={<div className='tab-title'>Bridge</div>} key={BridgeKey}>
                    <SearchTable
                        scroll={{x: 1220, y: `calc(100vh - 486px)`}}
                        getRef={(node) => {
                            if (bridgeRef) {
                                return
                            }
                            setBridgeRef(node);
                            node.fetchData();
                        }}
                        columns={bridgeColumns()}
                        getList={getBridgeList}
                        pagination={{pageSize: 150}}
                    />
                </TabsetPane>
            </Tabset>

        </div>
    )
};
