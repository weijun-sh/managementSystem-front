import React from 'react';
import JsonOut from "../../../../mlib/mc/text/JsonOut";
import {Collapse} from 'antd';
import './process.less'
import PropTypes from "prop-types";
import {
    EmptyProcess,
    isProcessStatusError,
    LogProcessErrorView,
    renderProcessHeader,
} from "../utils";

const {Panel} = Collapse;

function Process(props) {

    const {swaptx, visible} = props;
    if (!visible) {
        return null;
    }
    if (!swaptx) {
        return <EmptyProcess/>
    }

    //1 success only, other place 1 is fail
    if (isProcessStatusError(swaptx.status)) {
        return (
            <LogProcessErrorView
                title={`swap 交易信息`}
                data={swaptx}
            />
        )
    }


    return (
        <Collapse
            className={"process-container"}
            defaultActiveKey={[]}
        >
            <Panel key={"1"}
                   header={renderProcessHeader(swaptx)}
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
