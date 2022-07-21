import {Button, Progress, Select} from "antd";
import React from "react";
import {CheckOutlined, LoadingOutlined} from "@ant-design/icons";
import PropTypes from "prop-types";
import {InitTimeLimited} from "../../tradeUtils";

export const UN_Loading_Status = "loading";
export const UN_Success_Status = "success";
export const UN_Error_Status = "error";
export let outList = [];
export let inList = [];
export let routerList = [];

export let tableRef = null;
export let progress = 0;
export let routerCancels = null;
export let inCancels = null;
export let outCancels = null;
export let limitedDate = '1';
const defaultLimited = '1'

export function setLimitedDate(date){
    limitedDate = date
}

export function setTableRef(ref){
    if (tableRef) {
        return
    }
    tableRef = ref;
}

export function tableSetLoading(loading){
    tableRef && tableRef.setLoading(loading)
}

export function tableSetList(list){
    tableRef && tableRef.setList(list)
}

export function setRouterCancel(c){
    routerCancels = c
}

export function setInCancel(c){
    inCancels = c;
}
export function setOutCancel(c){
    outCancels = c;
}
export function setOutList(list) {
    outList = list
}

export function setRouterList(list) {
    routerList = list
}

export function setInList(list) {
    inList = list
}

export function setProgress(pro){
    progress = pro
}

export function unLeftPage(){
    tableRef = null
    routerCancels && routerCancels();
    inCancels && inCancels()
    outCancels && outCancels()
}

export function unEnterPage(){
    setProgress(0);
    setOutList([]);
    setInList([]);
    setRouterList([]);
    tableSetList([])
}

export function UnSelectDate(props) {
    const {onSelect, disabled} = props;
    return (
        <span>
            时间 :&emsp;
            <Select
                disabled={false/*disabled*/}
                style={{width: 80}}
                size={"small"}
                defaultValue={defaultLimited}
                onSelect={(value, option) => {
                    onSelect(value, option)
                }}
            >
            <Select.Option value={null}>全部</Select.Option>
            <Select.Option value={"1"}>1 天</Select.Option>
            <Select.Option value={"2"}>2 天</Select.Option>
            <Select.Option value={"3"}>3 天</Select.Option>
            <Select.Option value={"4"}>4 天</Select.Option>
            <Select.Option value={"5"}>5 天</Select.Option>
            <Select.Option value={"6"}>6 天</Select.Option>
            <Select.Option value={"7"}>7 天</Select.Option>
        </Select>
            &emsp;
        </span>

    )
}

export function UnErrorTab(props) {
    const {title} = props;
    return (
        <span className={"error-status"}>
            <span className={"type"}>{title}</span>
            <span className={"msg"}>{'加载失败'}</span>
        </span>
    )
}

export function SelectIcon(props) {
    let className = "select-type";
    if (props.selected) {
        className = "select-type select-type-selected"
    }
    return (
        <span className={className}>
                <CheckOutlined className={"icon"}/>
            </span>
    )
}

export function UnLoadedView(props){
    const {selected, onClick, title, length } = props;
    return (
        <span
            className={"success-status"}
            onClick={onClick}
            color={selected}
        >
            <SelectIcon selected={selected}/>
            <span className={"type"}>{title}</span>
            <span className={"msg"}>{`${length} 条`}</span>
        </span>
    )
}

UnLoadedView.propTypes = {
    selected: PropTypes.any,
    onClick: PropTypes.any,
    title: PropTypes.any,
    length: PropTypes.any,
}

export function UnLoadingStatus(props) {
    const {title} = props;
    return (
        <span className={"loading-status"}>
            <span className="type">{`${title}`}</span>
            &nbsp;&nbsp;
            <LoadingOutlined/>
        </span>
    )
}

export function UnTableExtra(props){
    const {onClick,onSelect, btnDisabled, selectDisabled } = props;
    return (
        <div>
            <UnSelectDate
                disabled={selectDisabled}
                onSelect={(value) => {

                    onSelect(value)
                }}
            />

            <Button
                type={"primary"}
                onClick={onClick}
                size={"middle"}
                disabled={btnDisabled}
            >
                查询
            </Button>


        </div>
    )
}

export function filterRangeList(list){
    if(limitedDate){
        list = list.filter((item) => {
            let days = `${parseInt(limitedDate)}`;
            let range = 60 * 60 * 24 * days;
            const {red, time} = InitTimeLimited(item.inittime, range);
            return !red;
        })
    }
    return list
}

//contact list in order router, bridge in bridge out
export function unCombList(showRoute, showIn, showOut ) {
    let list = []
    if (showRoute) {
        list = [...list, ...routerList];
    }
    if (showIn) {
        list = [...list, ...inList];
    }
    if (showOut) {
        list = [...list, ...outList];
    }

    list = filterRangeList(list);
    return list;

}

export function unUpdateProgress(){
    if (progress === 0) {
        setProgress(33);
    } else if (progress === 33) {
        setProgress(66);
    } else if (progress === 66) {
        setProgress(100);
    }
}

export function UnProgressView(){
    return (
        <>
            查询结果&nbsp;&nbsp;
            <Progress
                width={34}
                size={"small"}
                type="circle"
                percent={progress}
            />
        </>
    )
}
