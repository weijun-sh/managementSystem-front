import {Collapse, Empty, Pagination, Tooltip} from "antd";
import React from "react";
import TradeUtils, {formatTimes, renderChainID} from "../../tradeUtils";
import _ from "lodash";
import JsonOut from "../../../../mlib/mc/text/JsonOut";
import {dateFormatter} from "../../../../mlib/mu/time";
import OuterLink from "../../components/outerLink";
import './index.less'

const {Panel} = Collapse;

export function EmptyContent(props) {
    return (
        <div className={"empty-content"}>
            <h3 className={"header"}>
                <strong>{props.title}</strong>
            </h3>
            <Empty description={props.msg}/>
        </div>
    )
}

/** Log Components and methods */

export const TYPE_LOG_ALL = 'all';
export const TYPE_LOG_ERROR = 'error';
export const TYPE_LOG_WARN = 'warn';

const TypeText = {
    all: '所有',
    error: '错误',
    warn: '警告',
}

export function LogEmpty() {
    return (
        <Collapse
            className="trade-logs-container"
        >
            <Panel
                key={1}
                header={(
                    <div className={"title-panel"}>
                        <strong>swap 处理过程</strong>
                    </div>
                )}
            >
                <EmptyContent
                    msg={"没有日志 (只保存14天内的日志)"}
                />

            </Panel>

        </Collapse>
    )
}

export function LogProcessErrorView(props) {
    const {msg,} = props.data;
    const {title} = props;
    return (
        <Collapse
            className="trade-logs-container"
        >
            <Panel
                key={1}
                header={(
                    <div className={"title-panel"}>
                        <strong>{title}</strong> &emsp;&emsp;
                        <span style={{color: '#e53c66'}}>{msg}</span>
                    </div>
                )}
            >
                <JsonOut
                    key={JSON.stringify(props.data)}
                    obj={props.data}
                />
            </Panel>
        </Collapse>
    )
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

export function isLogErrorStatus(status) {
    return status === '1'
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

export function renderLogHeader(allList,) {

    if (!allList || !allList.length) {
        return (
            <div className={"title-panel"}>
                <strong>swap 处理过程</strong>
            </div>
        )
    }
    let first = allList[0];
    const {err, level, msg, status} = first;
    return (
        <div className={"title-panel"}>
            <strong>swap 处理过程</strong>
            <span className={"header-summary"}>
                <div className={"line"}>
                    <span className={"key"}>
                        状态
                    </span>
                    <span className={"value"}>
                        {status || '-'}
                    </span>
                </div>
                <div className={"line"}>
                    <span className={"key"}>
                        时间
                    </span>
                    <span className={"value"}>
                        {formatTimes(first.time)}
                    </span>
                </div>
                <div hidden={!LogIsErrorLevel(level)} className={"line"}>
                    <span className={"key"}>
                        错误
                    </span>
                    <span style={{color: '#b55353'}} className={"value"}>
                        {err}
                    </span>
                </div>
                <div className={"line"}>
                    <span className={"key"}>
                        消息
                    </span>
                    <span className={"value"}>
                        {msg}
                    </span>
                </div>
            </span>
        </div>
    )
}

export function LogCate(props) {
    const {changeType, errorList, warnList, allList} = props;
    return (
        <>
            <span
                className={"type-all"}
                onClick={() => {
                    changeType('all')
                }}
            >
                全部:
                <strong> {allList.length}</strong>
                </span>
            <span
                className={"type-error"}
                onClick={() => {
                    changeType('error')
                }}
            >
                错误:
                <strong> {errorList.length}</strong>
                </span>
            <span
                className="type-warn"
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
    const {changeType, pageSize, currentList, currentPage, onPageChange, errorList, warnList, allList} = props;
    return (
        <div className={"page-wrap"}>
            <LogCate
                changeType={changeType}
                errorList={errorList}
                warnList={warnList}
                allList={allList}
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

export function renderLogPanelHeader(item) {
    let {level, msg, time, status, times, err} = item;
    return (
        <div style={{width: 790}}>
            <div className={`header`}>
                <span className='header-item'>
                    <span>{renderLogLevel(level)}</span>
                </span>

                <div className='header-item'>
                    <label>状态</label>
                    <label>{TradeUtils.renderStatus(status)}</label>
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

export function LogIsWarnLevel(status) {
    return status === 'warn' || status === 'warning'
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

export function renderLogPanel(currentList, pageList, showType) {

    if (!currentList.length) {
        return <EmptyContent msg={`没有${TypeText[showType]}日志`}/>
    }

    return pageList.map((item, index) => {

        let obj = _.cloneDeep(item)
        delete obj.times;
        return (
            <Panel
                key={`${index}`}
                header={renderLogPanelHeader(item)}
            >
                <JsonOut key={JSON.stringify(obj)} obj={obj}/>
            </Panel>
        )
    })
}

/*from backend data change to useful
* */
export function formatLogList(logs) {
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

/** Process Components and methods */

export function isProcessStatusError(status) {
    return status === '0'
}

export function EmptyProcess() {
    return (
        <Collapse
            className={"process-container"}
            defaultActiveKey={[]}
        >
            <Panel key={"1"}
                   header={(
                       <div className={"header"}>
                           <div className={"line"}>
                               <strong>swap 交易信息</strong>
                           </div>
                       </div>
                   )}
            >
                <Empty description={"无交易信息"}/>
            </Panel>
        </Collapse>
    );
}


export function renderProcessStatus(status) {
    if (status === '0') {
        return <span className={"fail"}>失败</span>
    }
    if (status === '1') {
        return <span className={"success"}>成功</span>
    }
    return '-'
}

export function renderProcessHeader(data) {
    const {toChainID, status, timestamp, swaptx} = data;
    return (
        <div className={"header"}>
            <div className={"line"}>
                <strong>swap 交易信息</strong>
            </div>
            <div className={"line"}>
                <span className={"key"}>状态</span>
                <span>{renderProcessStatus(status)}</span>
            </div>
            <div className={"line"}>
                <span className={"key"}>
                    时间
                </span>
                <span className={"value"}>
                    {dateFormatter(timestamp)}
                </span>
            </div>
            <div className={"line"}>
                <span className={"key"}>链</span>
                <span className={"value"}>
                    <span>
                        {renderChainID(toChainID)}
                    </span>
                </span>
            </div>
            <div className={"line"}>
                <span className={"key"}>swaptx</span>
                <span className={"value"}>
                    <OuterLink
                        ellipsis={true}
                        hash={swaptx}
                        chainid={toChainID}
                    />
                </span>
            </div>
        </div>
    )
}
