import React, {useEffect, useState} from 'react';
import JsonOut from "../../../../mlib/mc/text/JsonOut";
import {Collapse} from 'antd';
import './process.less'
import {renderChainID} from "../../tradeUtils";
import CopyButton from "../../../../mlib/mc/button/CopyButton";
const {Panel} = Collapse;

function Process(props) {

    const {swaptx, visible} = props;
    if (!visible) {
        return null;
    }
    if (!swaptx) {
        return null;
    }

    function renderStatus(status){
        if(status === '0'){
            return <span className={"fail"}>失败</span>
        }
        if(status === '1'){
            return <span className={"success"}>成功</span>
        }
        return '-'
    }
    const {fromChainID, status, transaction, txid} = swaptx;
    return (
        <Collapse
            className={"process-container"}
            defaultActiveKey={[]}
        >
            <Panel key={"1"}
                header={(
                    <div className={"header"}>
                        <div className={"line"}>
                            <span className={"key"}>来源链</span>
                            <span className={"value"}>
                                <strong>{renderChainID(fromChainID)}</strong>
                            </span>
                        </div>
                        <div className={"line"}>
                            <span className={"key"}>状态</span>
                            <span>{renderStatus(status)}</span>
                        </div>
                        <div className={"line"}>
                            <span className={"key"}>txid</span>
                            <span className={"value"}>
                                <CopyButton>{txid}</CopyButton>
                            </span>
                        </div>
                    </div>
                )}
            >
                <div className={"content"}>
                    <JsonOut
                        obj={transaction}
                    />
                </div>
            </Panel>

        </Collapse>
    )
}

export default Process;
