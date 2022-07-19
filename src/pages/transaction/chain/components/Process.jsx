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

    return (
        <Collapse
            className={"process-container"}
            defaultActiveKey={[]}
        >
            <Panel
                key={"1"}
                header={renderProcessHeader(res)}
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
    res: PropTypes.any,
    visible: PropTypes.any,
}

export default Process;
