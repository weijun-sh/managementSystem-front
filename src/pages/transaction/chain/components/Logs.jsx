import React, {useEffect, useState} from 'react';
import {Collapse} from "antd";
import './logs.less'
import {
    formatLogCurrentList,
    formatLogList,
    LogPagination,
    renderLogHeader,
    renderLogPanel,
    TYPE_LOG_ALL
} from "../utils/chainlog";
import {isErrorCode} from "../utils/common";
import PropTypes from "prop-types";

const {Panel} = Collapse;


function ChainLogs(props) {
    const {res, visible} = props;
    const [currentPage, setCurrentPage] = useState(1);
    const [activeKeys, setActiveKeys] = useState([]);
    const [showType, setShowType] = useState(TYPE_LOG_ALL);
    const [pageSize, setPageSize] = useState(10);

    window.success("res", res);


    useEffect(() => {
        setCurrentPage(1)
    }, [res, visible]);

    if(!res){
        return null;
    }

    /** error data to show */
    if (!visible) {
        return null;
    }

    const {code, data, msg} = res;
    const {logs, logFile} = data;

    /** right data to show */
    let formatedLogs = formatLogList(logs);

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
                header={renderLogHeader(res,allList)}
            >
                <Collapse
                    activeKey={activeKeys}
                    onChange={(keys) => {
                        setActiveKeys(keys)
                    }}
                    defaultActiveKey={[]}
                >
                    {renderLogPanel(res, currentList, pageList, showType)}
                </Collapse>

                <LogPagination
                    hidden={isErrorCode(code) }
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

ChainLogs.propTypes = {
    visible: PropTypes.any,
    res: PropTypes.any,
}

export default ChainLogs;
