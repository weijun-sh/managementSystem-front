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
import {Modal} from "antd";
import JsonOut from "../../mlib/mc/text/JsonOut";

/**
 * table column , deal time gap between timestamp and inittime
 * */
export function timeStampGap( timestamp, inittime){
    let diff = timestamp - inittime;
    if(diff   < 0){
        return '-'
    }
    diff = transferSecond(diff)
    return diff;
}

export function InitTimeLimited(inittime, range ){
    let current = new Date().getTime();
    let pass = inittime ;
    let gap = ((current - pass) / 1000).toFixed(0);

    let time = Utils.Time.transferSecond(gap);

    let red = gap > range;

    return {
        red,
        time,
    }
}

/**
 * process status 10 is success,
 * */
export function renderTradeStatus(status) {
    if(status === null){
        return '-'
    }
    if(status == 10){
        return <span style={{color: '#2ca52c'}}>success</span>
    }

    return CONST.SwapStatus[status] || '-'
}

/**
 * map chainid to chain
 * */
export function renderChainID(id) {
    if (id == null) {
        return id;
    }
    return CONST.ChainID[id]
}

/**
 * change number status such as 1, 10, 14 ... to text error confirm ...
 * */
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

/**
 *
 * format send or receive value to smaller
 * */
export function minifyValue(num, id) {
    return fromWei(num, getDecimals(id))
}

/**
 * click search icon to search page
 * */
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


/**
 * format backend data to table data
 * */
export function deepMapList(data) {
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

/**
 * router column , _0# show as corner
 * */
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
            <span className={"router-column-name"}>
                {data.replace(/_#0/, '')}
            </span>
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

/**
 * table columns
 * */
export const HistoryColumns = function (config = {}) {
    const { hideSwapInOut = true } = config;
    const { hideJson = true } = config;
    return [
        {
            title: '????????????',
            dataIndex: 'bridge',
            key: 'bridge',
            render: renderRouterColumn
        },
        {
            title: '??????',
            dataIndex: 'swapinfo',
            key: 'swapinfo',
            width: 80,
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
            title: "??????",
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
            title: "??????",
            dataIndex: 'txid',
            key: 'txid',
            width: 120,
            render: (data, record) => {
                let text = record.txid;
                let show = Utils.Layout.ellipsisCenter(text);

                return (
                    <div style={{minWidth: 132}}>
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
            width: 58,
            hidden: hideSwapInOut,
            render: (data, record, index) => {
                return renderBridgeType(record)
            }
        },
        {
            title: "??????",
            dataIndex: 'txid',
            key: 'txid',
            width: 164,
            render: (data, record) => {
                let text = record.swaptx;
                let show = Utils.Layout.ellipsisCenter(text);
                let toChainID = renderChainID(record.toChainID);
                return (
                    <div style={{minWidth: 128}}>
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
            title: '????????????',
            dataIndex: 'yyy',
            key: 'yyy',
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
        //timestamp -- ??????????????????
        //inittime -- ????????????????????????
        //?????? -- ??????????????????????????????
        //???????????? -- ???????????????????????????
        {
            title: "??????",
            dataIndex: 'xxx',
            key: 'xxx',
            defaultSortOrder: 'descend',
            sorter: (a, b) =>  b.inittime - a.inittime,
            render: (data, record) => {
                //now - inittime
                //out of one hour, color is red
                let range = 60 * 60 * 1;
                let { red, time} = InitTimeLimited(record.inittime, range);
                if(record.status == 10){
                    red = false
                }
                return (
                    <div className={"trade-time-column"} >
                        <span className={red? "red-time":"time"}>
                            {time}
                        </span>
                        <span className={"ago"}>
                            {record.inittime > 0 && ' ago'}
                        </span>
                    </div>
                )
            }
        },
        {
            title: "??????",
            dataIndex: "status",
            key: 'status',
            sorter: (a, b) => b.status - a.status,
            render: (data) => {
                return (
                    <div style={{ fontSize: 12}}>
                        <div>status: {data}</div>
                        {renderTradeStatus(data)}
                    </div>
                )
            }
        },
        {
            title: "??????",
            dataIndex: "status",
            key: 'status',
            hidden: hideJson,
            width: 60,
            render: (data, record) => {
                return (
                    <a
                        onClick={() => {
                            Modal.confirm({
                                title: '??????',
                                bodyStyle: {padding: 20},
                                okText: '??????',
                                cancelText:"??????",
                                width: 860,
                                icon: false,
                                closable: true,
                                cancelButtonProps: {hidden: true},
                                content:(
                                    <JsonOut
                                        obj={record}
                                        style={{border: '1px solid #eee'}}
                                    />
                                )
                            })
                        }}
                    >
                        ??????
                    </a>
                )
            }
        },
    ]
}

export function getUnascertainedColumns(config = {}) {
    config.hideSwapInOut = false;
    config.hideJson = false;
    return HistoryColumns(config);
}

export function getHistoryColumns(config = {}) {
    config.hideSwapInOut = false;
    config.hideJson = false;
    return HistoryColumns(config);
}

export function getReviewColumns(config = {}) {
    config.hideSwapInOut = false;
    config.hideJson = false;
    return HistoryColumns(config);
}

export function getChainColumns(config = {}) {
    config.hideSwapInOut = false;
    config.hideJson = false;
    return HistoryColumns(config);
}

/**
 * show _0# in first
 * */
export function db0First(list){
    list = list.sort((a, b) => {
        let ai =  a.bridge.indexOf('#0') !== -1 ? 1: 0;
        let bi =  b.bridge.indexOf('#0') !== -1 ? 1: 0;
        return bi - ai
    })
    return list;
}

export function formatTimes(time) {
    if (time) {
        time = time.replace('T', ' ');
        time = time.replace(/\.\d+$/, '');
        return time
    }
    return ''
}

const TradeUtils = {
    renderTradeStatus,
    getUnascertainedColumns,
    renderChainIDOptions,
    renderSummaryStatus,
    deepMapList,
    getHistoryColumns,
    getChainColumns,
    getReviewColumns
}


export default TradeUtils;

