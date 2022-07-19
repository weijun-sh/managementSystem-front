import React from 'react';
import JsonOut from "../../../../mlib/mc/text/JsonOut";
import {Collapse} from 'antd';
import './process.less'
import PropTypes from "prop-types";
import {
    renderProcessHeader,
} from "../utils/chainprocess";

const {Panel} = Collapse;

function Process(props) {

    const {res, visible} = props;
    if (!visible) {
        return null;
    }
    if (!res) {
        return null
    }

    const {code, msg, data} = res;

    const {swaptx} = data;

    return (
        <Collapse
            className={"process-container"}
            defaultActiveKey={[]}
        >
            <Panel
                key={"1"}
                header={renderProcessHeader(res, swaptx)}
            >
                <div className={"content"}>
                    <JsonOut
                        obj={res}
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
