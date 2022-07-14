import React, {useEffect, useState} from 'react';
import {BackTop, Collapse, Empty, Modal, Pagination, Tooltip, Carousel} from "antd";
import TradeUtils from "../../tradeUtils";
import './logs.less'
import PageContainer from "mc/container/PageContainer";
import CopyButton from "mc/button/CopyButton";

const {Panel} = Collapse;

function isError(status) {
    return status === 'error' || status === 'fatal'
}

function isWarn(status) {
    return status === 'warn' || status === 'warning'
}

const TYPE_ALL = 'all';
const TYPE_ERROR = 'error';
const TYPE_WARN = 'warn';

const TypeText = {
    all: '所有',
    error: '错误',
    warn: '警告',

}

function ChainLogs(props) {
    const {logs, visible} = props;
    const [currentPage, setCurrentPage] = useState(1);
    const [activeKeys, setActiveKeys] = useState([]);
    const [showType, setShowType] = useState(TYPE_ALL);
    const [pageSize, setPageSize] = useState(10);

    useEffect(() => {
        setCurrentPage(1)
    }, [logs, visible])

    if (!visible) {
        return null;
    }

    if (logs.length === 0) {
        return (
            <EmptyLog
                title={"交易日志"}
                msg={"没有日志 (只保存14天内的日志)"}
            />
        )
    }

    function EmptyLog(props) {
        return (
            <div className={"empty"}>
                <h3 className={"header"}>
                    <strong>{props.title}</strong>
                </h3>
                <Empty description={props.msg}/>
            </div>
        )
    }

    /*from backend data change to useful
    * */
    function formatLogs() {
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

    /*
    * current page to show
    * */
    function formatCurrentList(logs) {
        let pageList = [];
        let currentList = [];

        const errorList = logs.filter(item => isError(item.level))
        const warnList = logs.filter(item => isWarn(item.level))

        if (showType === TYPE_ALL) {
            pageList = logs.slice((currentPage - 1) * pageSize, currentPage * pageSize);
            currentList = logs;
        } else if (showType === TYPE_WARN) {
            pageList = warnList.slice((currentPage - 1) * pageSize, currentPage * pageSize);
            currentList = warnList
        } else if (showType === TYPE_ERROR) {
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

    let formatedLogs = formatLogs();
    let {pageList, currentList, errorList, warnList, allList} = formatCurrentList(formatedLogs);

    function renderLevels(level) {
        if (level == null) {
            return ''
        }
        if (isError(level)) {
            return <span className={"status-error"}>{level}</span>
        }
        if (isWarn(level)) {
            return <span className={"status-warn"}>{level}</span>
        }
        if (level === 'info') {
            return <span className={"status-info"}>{level}</span>
        }

        return <span>{level}</span>
    }

    function formatTime(time) {
        if (time) {
            time = time.replace('T', ' ');
            time = time.replace(/\.\d+$/, '');
            return time
        }
        return ''
    }

    function renderSwapInOut(isSwapin) {
        return {'true': '充值', 'false': '提现'}[`${isSwapin}`]
    }


    function renderPanelHeader(item) {
        let {bind, level, msg, pairID, time, status, txid, isSwapin, times,} = item;
        let {err, txHash} = item;
        return (
            <div className={`header`}>
                <span className='header-item'>
                    <span>{renderLevel(level)}</span>
                </span>

                <div className='header-item'>
                    <label>状态</label>
                    <label>{TradeUtils.renderStatus(status)}</label>
                </div>



                <div className='header-item'>
                    <label>消息</label>
                    <label>{msg}</label>

                    <div hidden={!isError(level)} >
                        <label>err</label>
                        <label style={{color: '#b55353'}}>{err}</label>
                    </div>
                </div>

                <div className='header-item'>
                    <label>时间</label>
                    <label>{formatTime(time)}</label>

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
        )
    }

    function renderLevel(level) {

        let styles = {
            background: 'gray',
            color: 'white',
            borderRadius: 2,
            padding: '0px 2px',
            textAlign: 'center',
            width: 40
        }
        if (isError(level)) {
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
        if (isWarn(level)) {
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

    //print out origin data, json
    function printJson(obj) {
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

    function renderToolPanelHeader(item) {
        let {bind, level, msg, pairID, time, status, txid, isSwapin, times,} = item;
        let {err, txHash} = item;

        return (
            <div style={{width: 790}}>
                {renderPanelHeader(item)}
            </div>
        )
    }

    function Tips(props) {
        const {item, children} = props
        let {bind, level, msg, pairID, time, status, txid, isSwapin, times,} = item;
        let {err, txHash} = item;

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
                            <div>最后一条：{formatTime(time)}</div>
                            <div>&emsp;第一条：{formatTime(item.firstTime)}</div>
                        </div>
                        <div style={{marginTop: 10}}>
                            <div>详细信息</div>
                            <div style={{background: '#333', paddingLeft: 4}}>
                                {printJson(item)}
                            </div>
                        </div>
                    </div>
                )}
            >
                {children}
            </Tooltip>
        )

    }

    function renderPanel() {

        if (!currentList.length) {
            return <EmptyLog msg={`没有${TypeText[showType]}日志`}/>
        }

        return pageList.map((item, index) => {
            let {bind, level, msg, pairID, time, status, txid, isSwapin, times,} = item;
            let {err, txHash} = item;

            return (
                <Panel
                    key={`${index}`}
                    header={renderToolPanelHeader(item)}>
                    <div className="log-warp" key={index}>
                        <div className={"line"}>
                            <div className='item item-short'>
                                <label>日志级别</label>
                                <label>{renderLevels(level)}</label>
                            </div>
                            <div className='item'>
                                <label>类型</label>
                                <label>{renderSwapInOut(isSwapin)}</label>
                            </div>
                            <div className='item'>
                                <label>pairID</label>
                                <label>{pairID}</label>
                            </div>
                        </div>
                        <div hidden={!err} className={"line"}>
                            <div className={"item"}>
                                <label>err</label>
                                <label>{err}</label>
                            </div>
                        </div>

                        <div hidden={!bind} className={"line"}>
                            <div className='item'>
                                <label>绑定</label>
                                <label><CopyButton>{bind}</CopyButton></label>
                            </div>
                        </div>

                        <div hidden={!txHash} className={"line"}>
                            <div className='item'>
                                <label>txHash</label>
                                <label><CopyButton>{txHash}</CopyButton></label>
                            </div>
                        </div>
                    </div>
                </Panel>
            )
        })
    }

    function changeType(type) {
        setShowType(type);
        setActiveKeys([])
        setCurrentPage(1)
    }

    function LogPagination(props) {
        const {hidden} = props;
        return (
            <div hidden={hidden} className={"page-wrap"}>
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
                &emsp;&emsp;
                <Pagination
                    className={"page"}
                    size={"small"}
                    total={currentList.length}
                    current={currentPage}
                    pageSize={pageSize}
                    showSizeChanger={true}
                    pageSizeOptions={[10, 50, 100, 150]}
                    onChange={(page, pageSize) => {
                        setActiveKeys([])
                        setCurrentPage(page);
                        setPageSize(pageSize)
                    }}
                />
            </div>
        )
    }

    return (
        <PageContainer className="trade-logs-container">
            <h3 style={{textAlign: 'left', paddingLeft: 20}}>
                <strong>交易日志</strong>
                <LogPagination/>
            </h3>
            <Collapse
                activeKey={activeKeys}
                onChange={(keys) => {
                    setActiveKeys(keys)
                }}
                defaultActiveKey={[]}
            >
                {renderPanel()}
            </Collapse>
            <LogPagination hidden={pageList.length < 10}/>

            <BackTop style={{bottom: 20}}/>
        </PageContainer>
    )
}

export default ChainLogs;
