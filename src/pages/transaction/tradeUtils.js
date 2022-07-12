import Utils from 'mu/index'
import {toThousands} from 'mu/math';
import CONST from './constants/constant'
import detail from './detail';
import staticApi from './constants/staticApi';
import './tradeUtils.less'
import ToChainLink from "./components/toChainLink";
import CopyButton from "../../mlib/mc/button/CopyButton";
import {transferSecond} from "../../mlib/mu/time";
import React from "react";

export function timeStampGap( timestamp, inittime){


    let diff = timestamp - inittime;

    if(diff   < 0){
        return '-'
    }

    diff = transferSecond(diff)
    return diff;
}

export function getRouterSummaryList() {
    return CONST.SummaryRouterList;
}

export function renderStatus(status) {
    if (status == null) {
        return status;
    }
    return CONST.SwapStatus[status]
}

export function renderChainID(id) {
    if (id == null) {
        return id;
    }
    return CONST.ChainID[id]
}

export function renderSummaryStatus(status) {
    if (status == null) {
        return status;
    }
    return CONST.SummaryAllStatus[status]
}

export function mapSummaryStatus() {
    let list = [];

    for (let key in CONST.SummaryStatus) {
        let item = CONST.SummaryStatus[key];
        list.push({
            key: key,
            value: item
        })
    }
    return list;
}

export function mapSummarySuccessStatus() {
    let list = [];

    for (let key in CONST.SummarySuccessStatus) {
        let item = CONST.SummarySuccessStatus[key];
        list.push({
            key: key,
            value: item
        })
    }
    return list;
}

export function renderChainIDOptions() {
    let list = [];
    for (let key in CONST.ChainID) {
        const item = CONST.ChainID[key]
        list.push({
            value: key,
            label: `${item}`
        })
    }

    list = list.sort((a, b) => {
        return a.label.localeCompare(b.label)
    })
    return list;
}

export function minifyValue(num, id) {
    return fromWei(num, getDecimals(id))
}

function toBrowser(record) {
    detail(record)
}

function getDecimals(obj) {
    return 18;
    if (typeof obj === 'string' || typeof obj === 'number') {
        return staticApi.DECIMALS[obj]
    }
    throw new Error("decimal record.chainId is null")
}



export function deepMapList(data) {
    window.success("data", data)
    let list = [];
    let bridgeAndRouter = {};
    if(data.bridge){
        bridgeAndRouter.bridge = data.bridge
    }
    if(data.router){
        bridgeAndRouter.router = data.router
    }
    for(let bridgeOrRouterKey in bridgeAndRouter){
        let bridgeOrRouter = data[bridgeOrRouterKey];
        bridgeOrRouter.map((bridges) => {
            for(let bridgeName in bridges){
                let bridgeList = bridges[bridgeName];

                if(!Array.isArray(bridgeList)){
                    bridgeList = [bridgeList]
                }
                bridgeList.map((item) => {
                    item.bridgeOrRouter = bridgeOrRouterKey;
                    item.bridge = bridgeName;
                    list = list.concat(item)
                })
            }


        })
    }
    return list;
}


export function fromWei(amount, baseDecimals) {
    return toThousands(amount)
}

export function renderRouterColumn(data) {
    let reg = /_#0/.exec(data);
    let cor = null;
    if (reg) {
        cor = (
            <span className={"router-cor"}>
                {reg[0].replace(/_#0/, '#0')}
            </span>
        )
    }
    return (
        <div className={"router-column"}>
            {data.replace(/_#0/, '')}
            {cor}
        </div>
    )
}

function renderBridgeType(item){
    const {swaptype, bridgeOrRouter} = item;
    if(bridgeOrRouter === 'router'){
        return (
            <div className={`trade-column-Router-type`}>
                Router
            </div>
        )
    }
    if(bridgeOrRouter === 'bridge'){
        let type = {
            1: 'IN',
            2: 'OUT',
        }
        let show = type[swaptype];
        return (
            <div className={`trade-column-${show}-type`}>
                {show}
            </div>
        )
    }
}

export const HistoryColumns = function (config = {}) {
    const { hideSwapInOut = true } = config;
    return [
        {
            title: '桥或路由',
            dataIndex: 'bridge',
            key: 'bridge',
            render: renderRouterColumn
        },
        {
            title: '币种',
            dataIndex: 'swapinfo',
            key: 'swapinfo',
            render: (data, record, index, list) => {

                if (record.swapinfo && record.swapinfo.routerSwapInfo) {
                    return (
                        <div>{record.swapinfo.routerSwapInfo.tokenID}</div>
                    )
                }
                return record.pairid
            }
        },
        {
            title: "数量",
            dataIndex: "value",
            key: "value",
            render: (data, record,) => {
                const {swaptx} = record;
                let sent =  minifyValue(record.value, record.fromChainID);
                let received = !!swaptx && swaptx !== '' ? minifyValue(record.swapvalue, record.toChainID) : '';

                return (
                    <div style={{minWidth: 100}}>
                        <div className={"one-line"}>Sent: {sent}</div>
                        <div className={"one-line"} style={{color: 'gray'}}>
                            Received: {received}
                        </div>
                    </div>
                )
            }
        },
        {
            title: "发送",
            dataIndex: 'txid',
            key: 'txid',
            render: (data, record) => {
                let text = record.txid;
                let show = Utils.Layout.ellipsisCenter(text);

                return (
                    <div style={{width: 128}}>
                        <div>{renderChainID(record.fromChainID)}</div>
                        <CopyButton
                            text={show}
                            copyText={text}
                            onTextClick={() => {
                                toBrowser(record)
                            }}
                        />

                        <ToChainLink
                            hash={text}
                            chainid={record.fromChainID}
                        />
                    </div>
                )
            }
        },
        {
            title: '',
            dataIndex: 'swaptype',
            key: 'swaptype',
            hidden: hideSwapInOut,
            render: (data, record, index) => {
                return renderBridgeType(record)
            }
        },
        {
            title: "接收",
            dataIndex: 'txid',
            key: 'txid',
            render: (data, record) => {
                let text = record.swaptx;
                let show = Utils.Layout.ellipsisCenter(text);
                let toChainID = renderChainID(record.toChainID);
                return (
                    <div style={{minWidth: 60}}>
                        <div>{toChainID}</div>
                        <CopyButton
                            copyText={text}
                            text={show}
                            onTextClick={() => {
                                toBrowser(record)
                            }}
                        />
                    </div>
                )
            }
        },
        {
            title: '处理时间',
            dataIndex: 'inittime',
            key: 'inittime',
            width: 120,
            sorter: (a, b) => {
              let diffA = parseInt(a.timestamp) - parseInt(a.inittime/ 1000);
              let diffB = parseInt(b.timestamp) - parseInt(b.inittime/ 1000);
              return diffA - diffB
            },
            render: (data, record, index) => {
                let {timestamp, inittime} = record;
                timestamp = parseInt(timestamp)
                inittime = parseInt(inittime / 1000);
                return (
                    <div>{timeStampGap(  timestamp , inittime)}</div>
                )
            }
        },
        {
            title: "时间",
            dataIndex: 'timestamp',
            key: 'timestamp',
            sorter: (a, b) => b.timestamp - a.timestamp,
            render: (data, record) => {
                let current = new Date().getTime();
                let pass = record.timestamp * 1000;
                let gap = ((current - pass) / 1000).toFixed(0);

                let time = Utils.Time.transferSecond(gap);
                let red = false;
                let daysReg = /(\d+)days/.exec(time)
                if(Array.isArray(daysReg)){
                    let days = parseInt(daysReg[1]);
                    if(days > 1){
                        red = true
                    }
                }
                return (
                    <div className={"trade-time-column"} >
                        <span className={red? "red-time":"time"}>
                            {time}
                        </span>
                        <span className={"ago"}>
                            {pass > 0 ? ' ago' : ''}
                        </span>
                    </div>
                )
            }
        },
        {
            title: "状态",
            dataIndex: "status",
            key: 'status',
            sorter: (a, b) => b.status - a.status,
            render: (data) => {
                return (
                    <div style={{ fontSize: 12}}>
                        <div>status: {data}</div>
                        {renderStatus(data)}
                    </div>
                )
            }
        },
    ]
}

export function getUnascertainedColumns(config = {}) {
    config.hideSwapInOut = false;
    return HistoryColumns(config);
}

export function getHistoryColumns(config = {}) {
    config.hideSwapInOut = false;
    return HistoryColumns(config);
}

export function getChainColumns(config = {}) {
    config.hideSwapInOut = false;
    return HistoryColumns(config);
}


export function db0First(list){
    list = list.sort((a, b) => {
        let ai =  a.bridge.indexOf('#0') !== -1 ? 1: 0;
        let bi =  b.bridge.indexOf('#0') !== -1 ? 1: 0;
        return bi - ai
    })
    return list;
}

const TradeUtils = {
    renderStatus,
    getUnascertainedColumns,
    renderChainIDOptions,
    renderSummaryStatus,
    deepMapList,
    getHistoryColumns,
    getChainColumns
}


export default TradeUtils;

