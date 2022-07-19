import React from "react";
import './index.less'


export function ErrorCodeHeaderView(props){
    const {title, msg} = props;
    return (
        <div className={"log-process-outer-header"}>
            <strong>{title}</strong>
            <span className={"header-summary"}>
                    <div className={"line"}>
                        <span className={"key"}>
                            err
                        </span>
                        <span className={"error-value value"}>
                            {msg}
                        </span>
                    </div>
                </span>
        </div>
    )
}

export function isErrorCode(code) {
    return code !== '0'
}
