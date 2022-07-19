import {dateFormatter} from "../../../../mlib/mu/time";
import {renderChainID} from "../../tradeUtils";
import OuterLink from "../../components/outerLink";
import React from "react";
import {ErrorCodeHeaderView, isErrorCode} from "./common";

export function renderProcessStatus(status) {
    if (status === '0') {
        return <span className={"fail"}>失败</span>
    }
    if (status === '1') {
        return <span className={"success"}>成功</span>
    }
    return '-'
}

export function renderProcessHeader(res) {
    const {toChainID, status, timestamp, swaptx} = res.data;
    if(isErrorCode(res.code)){
        return (
            <ErrorCodeHeaderView
                title={"swap 交易信息"}
                msg={res.msg}
            />
        )
    }
    return (
        <div className={"log-process-outer-header"}>
            <strong>swap 交易信息</strong>
            <span className={"header-summary"}>
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
                    <span className={"key"}>主链</span>
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
            </span>

        </div>
    )
}


