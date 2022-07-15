import React, {useEffect, useState} from 'react';
import JsonOut from "../../../../mlib/mc/text/JsonOut";
import {Collapse, Empty} from 'antd';
import './process.less'
import {formatTimes, renderChainID} from "../../tradeUtils";
import CopyButton from "../../../../mlib/mc/button/CopyButton";
import OuterLink from "../../components/outerLink";
import PropTypes from "prop-types";
import {dateFormatter} from "../../../../mlib/mu/time";

const {Panel} = Collapse;

function Process(props) {

    const {swaptx, visible} = props;
    if (!visible) {
        return null;
    }
    if (!swaptx) {
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

    function renderStatus(status) {
        if (status === '0') {
            return <span className={"fail"}>失败</span>
        }
        if (status === '1') {
            return <span className={"success"}>成功</span>
        }
        return '-'
    }

    function renderHeader() {
        const {fromChainID, status, txid, timestamp} = swaptx;
        return (
            <div className={"header"}>
                <div className={"line"}>
                    <strong>swap 交易信息</strong>
                </div>
                <div className={"line"}>
                    <span className={"key"}>状态</span>
                    <span>{renderStatus(status)}</span>
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
                            {renderChainID(fromChainID)}
                        </span>
                    </span>
                </div>
                <div className={"line"}>
                    <span className={"key"}>txid</span>
                    <span className={"value"}>
                        <OuterLink
                            ellipsis={true}
                            hash={txid}
                            chainid={fromChainID}
                        />
                    </span>
                </div>
            </div>
        )
    }

    return (
        <Collapse
            className={"process-container"}
            defaultActiveKey={[]}
        >
            <Panel key={"1"}
                   header={renderHeader()}
            >
                <div className={"content"}>
                    <JsonOut
                        obj={swaptx.transaction}
                    />
                </div>
            </Panel>

        </Collapse>
    )
}

Process.propTypes = {
    swaptx: PropTypes.any
}

export default Process;
