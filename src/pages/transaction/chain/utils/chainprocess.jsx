import {dateFormatter} from "../../../../mlib/mu/time";
import {renderChainID} from "../../tradeUtils";
import OuterLink from "../../components/outerLink";
import React from "react";
import {isErrorCode, OuterHeader} from "./common";

export function renderProcessStatus(status) {
    if (status === '0') {
        return <span className={"fail"}>failed</span>
    }
    if (status === '1') {
        return <span className={"success"}>success</span>
    }
    return '-'
}

export function renderProcessHeader(res) {
    const {toChainID, timestamp, swaptx} = res.data;
    if(isErrorCode(res.code)){
        return (
            <OuterHeader
                title={"swap 交易信息"}
                list={[{
                    label: '状态',
                    value: renderProcessStatus('0')
                },{
                    label: '错误',
                    value: res.msg,
                    error: true
                }, ]}
            />
        )
    }
    return (
        <OuterHeader
            title={"swap 交易信息"}
            list={[{
                label: '状态',
                value: renderProcessStatus('1')
            },{
                label: '主链',
                value: renderChainID(toChainID),
            }, {
                label: 'swaptx',
                value: (
                    <OuterLink
                        ellipsis={true}
                        hash={swaptx}
                        chainid={toChainID}
                    />
                )
            }, {
                label: "时间",
                value: dateFormatter(timestamp)
            }]}
        />
    )
}


