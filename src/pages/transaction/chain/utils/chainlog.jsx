import JsonOut from "../../../../mlib/mc/text/JsonOut";
import _ from "lodash";
import React from "react";
import {
    EmptyContent,
    isErrorCode, OuterHeader,
} from "./common";
import './chainlog.less'
import {Collapse, Pagination, Tooltip} from "antd";
import TradeUtils, {formatTimes} from "../../tradeUtils";
const {Panel} = Collapse;
const ShowTypeText = {
    all: '所有',
    error: '错误',
    warn: '警告',
}
export const TYPE_LOG_ALL = 'all';
export const TYPE_LOG_ERROR = 'error';
export const TYPE_LOG_WARN = 'warn';

/*from backend data change to useful
* */
export function formatLogList(logs) {
    if (!logs) {
        return []
    }
    let result = {};
    logs.map((item) => {
        const {time, ...other} = item;
        let jr = JSON.stringify(other);
        if (!result[jr]) {
            result[jr] = []
        }
        result[jr].push(time)
    });

    let list = [];
    for (let key in result) {
        let other = JSON.parse(key);
        let times = result[key];

        let timeSort = times.sort((a, b) => {
            return new Date(b.time).getTime() - new Date(a.time).getTime();
        })

        list.push({
            ...other,
            times: timeSort,
            time: timeSort[timeSort.length - 1],
            firstTime: timeSort[0]
        })
    }

    list = list.sort((a, b) => {
        return new Date(b.time).getTime() - new Date(a.time).getTime();
    });

    return list
}


export function renderLogPanel(res, currentList, pageList, showType) {

    if(isErrorCode(res.code)){
        return (
            <JsonOut key={JSON.stringify(res)} obj={res}/>
        )
    }

    if (!currentList.length) {
        return <EmptyContent msg={`没有${ShowTypeText[showType]}日志`}/>
    }

    return pageList.map((item) => {

        let obj = _.cloneDeep(item)
        delete obj.times;
        return (
            <Panel
                key={JSON.stringify(obj)}
                header={logListHeader(item)}
            >
                <JsonOut key={JSON.stringify(obj)} obj={obj}/>
            </Panel>
        )
    })
}

export function renderLogLevel(level) {
    let styles = {
        background: 'gray',
        color: 'white',
        borderRadius: 2,
        padding: '0px 2px',
        textAlign: 'center',
        width: 40
    }
    if (LogIsErrorLevel(level)) {
        return (
            <div
                className={"item-header"}
                style={{
                    ...styles,
                    background: '#b55353'
                }}
            >
                error
            </div>
        )
    }
    if (LogIsWarnLevel(level)) {
        return (
            <div
                style={{
                    ...styles,
                    background: '#d48806'
                }}
                className={"item-header"}
            >
                warn
            </div>
        )
    }

    if (level === 'info') {
        return (
            <div
                style={{
                    ...styles,
                    background: '#aaa',
                }}
                className={"item-header"}
            >
                info
            </div>
        )
    }
    return level
}


export function LogIsWarnLevel(status) {
    return status === 'warn' || status === 'warning'
}

//print out origin data, json
export function printLogJson(obj) {
    let list = [];
    for (let key in obj) {
        if (key === 'times') {
            continue
        }
        list.push(
            <div key={key} className={"item"}>
                <span
                    className={"key"}
                >
                    {key}:
                </span>
                <span
                    className={"value"}
                >
                    {obj[key]}
                </span>
            </div>
        )
    }
    return (
        <div className={"print-obj"}>
            {list}
        </div>
    );
}

export function LogIsErrorLevel(status) {
    return status === 'error' || status === 'fatal'
}


/*
* current page to show
* */
export function formatLogCurrentList(logs, showType, currentPage, pageSize) {
    let pageList = [];
    let currentList = [];

    const errorList = logs.filter(item => LogIsErrorLevel(item.level))
    const warnList = logs.filter(item => LogIsWarnLevel(item.level))

    if (showType === TYPE_LOG_ALL) {
        pageList = logs.slice((currentPage - 1) * pageSize, currentPage * pageSize);
        currentList = logs;
    } else if (showType === TYPE_LOG_WARN) {
        pageList = warnList.slice((currentPage - 1) * pageSize, currentPage * pageSize);
        currentList = warnList
    } else if (showType === TYPE_LOG_ERROR) {
        pageList = errorList.slice((currentPage - 1) * pageSize, currentPage * pageSize);
        currentList = errorList;
    }

    return {
        pageList,
        errorList,
        currentList,
        warnList,
        allList: logs
    }
}

function Tips(props) {
    const {item, children} = props
    let {time, times,} = item;

    let dom = document.getElementsByClassName("ant-collapse-item");

    let width = 0;
    if (dom && dom.length) {
        width = document.getElementsByClassName("ant-collapse-item")[0].clientWidth;
    }
    return (
        <Tooltip
            placement={width > 1130 ? "right" : 'leftBottom'}
            overlayInnerStyle={{width: 300}}
            title={(
                <div>
                    <div hidden={times.length === 1}>
                        有 <strong>{times.length}</strong> 条重复数据
                        <div>最后一条：{formatTimes(time)}</div>
                        <div>&emsp;第一条：{formatTimes(item.firstTime)}</div>
                    </div>
                    <div style={{marginTop: 10}}>
                        <div>详细信息</div>
                        <div style={{background: '#333', paddingLeft: 4}}>
                            {printLogJson(item)}
                        </div>
                    </div>
                </div>
            )}
        >
            {children}
        </Tooltip>
    )
}

export function renderLogHeader(res, allList,) {

    if (isErrorCode(res.code)) {
        return (
            <OuterHeader
                title={"swap 处理过程"}
                list={[{
                    label: '错误',
                    value: res.msg,
                    error: true
                }]}
            />
        )
    }
    let first = allList[0];
    const {err, level, msg, status} = first;

    return (
        <OuterHeader
            title={"swap 处理过程"}
            list={[{
                label: '状态',
                value: TradeUtils.renderTradeStatus(status),
            }, {
                label: '消息',
                value: msg,
            }, {
                label: '错误',
                value: err,
                error: true,
                hidden: !LogIsErrorLevel(level)
            }, {
                label: '时间',
                value: formatTimes(first.time),
            }, ]}
        />
    )
}


export function logListHeader(item) {
    let {level, msg, time, status, times, err} = item;
    return (
        <div style={{width: 790}}>
            <div className={`log-list-header`}>
                <span className='header-item'>
                    <span>{renderLogLevel(level)}</span>
                </span>

                <div className='header-item'>
                    <label>状态</label>
                    <label>{TradeUtils.renderTradeStatus(status)}</label>
                </div>

                <div className='header-item'>
                    <label>消息</label>
                    <label>{msg}</label>

                    <div hidden={!LogIsErrorLevel(level)}>
                        <label>err</label>
                        <label style={{color: '#b55353'}}>{err}</label>
                    </div>
                </div>

                <div className='header-item'>
                    <label>时间</label>
                    <label>{formatTimes(time)}</label>

                    <Tips item={item}>
                        <span
                            className={"time-number"}
                            style={{opacity: times.length === 1 ? 0.4 : 1}}
                        >
                            {times.length}
                        </span>
                    </Tips>
                </div>
            </div>
        </div>

    )
}

export function LogCate(props) {
    const {changeType, errorList, warnList, allList, showType} = props;
    return (
        <>
            <span
                className={"type-all"}
                style={{opacity: showType === 'all'? 1: 0.7}}
                onClick={() => {
                    changeType('all')
                }}
            >
                全部:
                <strong> {allList.length}</strong>
                </span>
            <span
                className={"type-error"}
                style={{opacity: showType === 'error'? 1: 0.7}}
                onClick={() => {
                    changeType('error')
                }}
            >
                错误:
                <strong> {errorList.length}</strong>
                </span>
            <span
                className="type-warn"
                style={{opacity: showType === 'warn'? 1: 0.7}}
                onClick={() => {
                    changeType('warn')
                }}
            >
                警告:
                <strong> {warnList.length}</strong>
            </span>
        </>
    )
}

export function LogPagination(props) {
    const {
        changeType,
        pageSize,
        currentList,
        currentPage,
        onPageChange,
        errorList,
        warnList,
        allList,
        hidden,
        showType
    } = props;
    if (hidden) {
        return null
    }
    return (
        <div className={"page-wrap"}>
            <LogCate
                changeType={changeType}
                errorList={errorList}
                warnList={warnList}
                allList={allList}
                showType={showType}
            />
            &emsp;&emsp;
            <Pagination
                className={"page"}
                size={"small"}
                total={currentList.length}
                current={currentPage}
                pageSize={pageSize}
                showSizeChanger={true}
                pageSizeOptions={[10, 50, 100, 150]}
                onChange={onPageChange}
            />
        </div>
    )
}
