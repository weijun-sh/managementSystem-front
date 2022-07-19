import React, {useEffect, useState} from 'react';
import {Collapse} from "antd";
import './logs.less'
import {
    formatLogCurrentList,
    formatLogList, isLogErrorStatus,
    LogEmpty, LogErrorView,
    LogPagination,
    renderLogHeader,
    renderLogPanel,
    TYPE_LOG_ALL
} from "../utils";

const {Panel} = Collapse;


function ChainLogs(props) {
    const {logs, visible} = props;
    const [currentPage, setCurrentPage] = useState(1);
    const [activeKeys, setActiveKeys] = useState([]);
    const [showType, setShowType] = useState(TYPE_LOG_ALL);
    const [pageSize, setPageSize] = useState(10);

    useEffect(() => {
        setCurrentPage(1)
    }, [logs, visible])

    /** error data to show */
    if (!visible) {
        return null;
    }

    if (isLogErrorStatus(logs.status)) {
        return (
            <LogErrorView
                title={`swap 处理过程`}
                data={logs}
            />
        )
    }

    if (!logs.logs || logs.logs.length === 0) {
        return <LogEmpty/>
    }


    /** right data to show */
    let formatedLogs = formatLogList(logs.logs);

    let {
        pageList,
        currentList,
        errorList,
        warnList,
        allList
    } = formatLogCurrentList(formatedLogs, showType, currentPage, pageSize);


    function changeType(type) {
        setShowType(type);
        setActiveKeys([])
        setCurrentPage(1)
    }


    return (
        <Collapse
            className="trade-logs-container"
        >
            <Panel
                key={1}
                header={renderLogHeader(allList)}
            >
                <Collapse
                    activeKey={activeKeys}
                    onChange={(keys) => {
                        setActiveKeys(keys)
                    }}
                    defaultActiveKey={[]}
                >
                    {renderLogPanel(currentList, pageList, showType)}
                </Collapse>
                <LogPagination
                    pageSize={pageSize}
                    currentList={currentList}
                    currentPage={currentPage}
                    errorList={errorList}
                    warnList={warnList}
                    allList={allList}
                    changeType={changeType}
                    onPageChange={(page, pageSize) => {
                        setActiveKeys([])
                        setCurrentPage(page);
                        setPageSize(pageSize)
                    }}
                />
            </Panel>
        </Collapse>
    )
}

export default ChainLogs;
