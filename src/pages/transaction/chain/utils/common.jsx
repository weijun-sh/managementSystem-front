import React from "react";
import './index.less'
import {Empty} from "antd";

export function isErrorCode(code) {
    return code !== '0'
}
export function EmptyContent(props) {
    return (
        <div className={"empty-content"}>
            <h3 className={"header"}>
                <strong>{props.title}</strong>
            </h3>
            <Empty description={props.msg}/>
        </div>
    )
}

export function OuterHeader(props){
    const {title, list} = props;
    return (
        <div className={"log-process-outer-header"}>
            <strong>{title}</strong>
            <span className={"header-summary"}>
                {list.map((item, index) => {
                    let valueClass = 'value';
                    if(item.hidden){
                        return null;
                    }
                    if(item.error){
                        valueClass = 'value error-value'
                    }
                    return (
                        <div key={index} className={"line"}>
                            <span className={"key"}>
                                {item.label}
                            </span>
                            <span className={`${valueClass}`}>
                                {item.value}
                            </span>
                        </div>
                    )
                })}
            </span>
        </div>
    )
}
