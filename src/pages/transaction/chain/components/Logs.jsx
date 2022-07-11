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

function ChainLogs(props) {
    const {logs, visible} = props;
    const [currentPage, setCurrentPage] = useState(1);
    const [activeKeys, setActiveKeys] = useState([]);
    const [showType, setShowType] = useState('all');
    const pageSize = 10;

    useEffect(() => {
        setCurrentPage(1)
    }, [logs, visible])

    if (!visible) {
        return null;
    }

    if (logs.length === 0) {
        return (
            <div className={"empty"}>
                <h3 className={"header"}>
                    <strong>交易日志</strong>
                </h3>
                <Empty description={"没有日志"}/>
            </div>
        )
    }

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


        const errorList = list.filter(item => isError(item.level))
        const warnList = list.filter(item => isWarn(item.level))

        const pageList = list.slice((currentPage - 1) * pageSize, currentPage * pageSize);

        return {
            total: list.length,
            pageList: pageList,
            totalList: list,
            errorList: errorList,
            warnList: warnList,
        };
    }

    const {pageList, total, errorList, warnList} = formatLogs();

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

    function printJson(obj) {
        let list = [];
        for (let key in obj) {
            if (key === 'times') {
                continue
            }
            list.push(
                <div className={"item"}>
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
        if(dom && dom.length){
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

        let list = [];
        if(type === 'error'){
            list = errorList;
        }else if(type === 'warn'){
            list = warnList;
        }
        Modal.warn({
            title: <h3>{`${type} 日志`}</h3>,
            type: type,
            className: 'errors-summary-modal',
            bodyStyle: { padding: 20},
            content: (
                <Carousel style={{}}>
                    {
                        list.map((item, index) => {
                            return (
                                <div key={index}>
                                    {printJson(item)}
                                </div>
                            )
                        })
                    }
                </Carousel>

            )
        })
    }

    function LogPagination() {
        return (
            <div className={"page-wrap"}>
                <span
                    hidden={!logs.length}
                    className={"type-all"}
                >
                    所有日志:
                    <strong> {logs.length}</strong> 条
                </span>
                <span
                    hidden={!errorList.length}
                    className={"type-error"}
                    onClick={() => {
                        changeType('error')
                    }}
                >
                    错误日志:
                    <strong> {errorList.length}</strong> 条
                </span>
                <span
                    hidden={!warnList.length}
                    className="type-warn"
                    onClick={() => {
                        changeType('warn')
                    }}
                >
                    警告日志:
                    <strong> {warnList.length}</strong> 条
                </span>
                &emsp;&emsp;
                <Pagination
                    className={"page"}
                    size={"small"}
                    total={total}
                    showTotal={(total, range) => {
                        return `共 ${total} 条日志记录`
                    }}
                    current={currentPage}
                    pageSize={pageSize}
                    showSizeChanger={true}
                    pageSizeOptions={[10, 50, 100, 150]}
                    onChange={(page) => {
                        setActiveKeys([])
                        setCurrentPage(page);
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
            <LogPagination/>

            <BackTop style={{bottom: 20}}/>
        </PageContainer>
    )
}

export default ChainLogs;
