import React, {useEffect, useState} from 'react';
import SearchTable from 'mc/table/SearchTable';
import Services from '../../../services/api';
import TradeUtils from '../tradeUtils'
import './index.less'
import {Button, message, Progress, Spin} from "antd";
import {LoadingOutlined, CheckOutlined} from "@ant-design/icons";

let tableRef = null;
let progress = 0;
let routerCancels = null;
let inCancels = null;
let outCancels = null;

const LoadingStatus = "loading";
const SuccessStatus = "success";
const ErrorStatus = "error";


//update list not at time, change to global var
let outList = [];
let inList = [];
let routerList = [];

function setOutList(list){
    outList = list
}

function setRouterList(list){
    routerList = list
}
function setInList(list){
    inList = list
}



function UnAscertained(props) {
    const [status, setStatus] = useState(0)
    let cols = TradeUtils.getUnascertainedColumns();
    const columns = [...cols];
    const [inStatus, setInStatus] = useState(LoadingStatus);
    const [outStatus, setOutStatus] = useState(LoadingStatus);
    const [routerStatus, setRouterStatus] = useState(LoadingStatus);

    const [showRoute, setShowRouter] = useState(true);
    const [showIn, setShowIn] = useState(true);
    const [showOut, setShowOut] = useState(true);
    const [showList, setShowList] = useState([]);


    useEffect(() => {
        if (tableRef) {
            tableRef.setList([])
            loadMore();
            progress = 0;
            setOutList([]);
            setInList([]);
            setRouterList([])
            setShowRouter(true)
            setShowIn(true)
            setShowOut(true)
            setRouterStatus(LoadingStatus);
            setInStatus(LoadingStatus)
            setOutStatus(LoadingStatus)
        }
        return function () {
            tableRef = null
            routerCancels && routerCancels();
            routerCancels && inCancels()
            routerCancels && outCancels()
        }
    }, []);

    function renderLoadingStatus(type) {
        return (
            <span className={"loading-status"}>
                <span className="type">{`${type}`}</span>&nbsp;&nbsp;
                {/*<Spin size={"small"}/>*/}
                <LoadingOutlined />
            </span>
        )
    }

    function initStatus() {
        setInStatus(null);
        setOutStatus(null);
        setRouterStatus(null);
    }

    function loadMore() {
        message.success("正在加载中", 0.3);
        initStatus()
        progress = 0;
        setStatus(0);
        tableRef.setList([]);
        tableRef.setLoading(true)


        Services.getSwapHistory({
            params: {
                bridge: 'all',
                status: null,
            },
            sendOption: {
                getCancel: (c) => {
                    routerCancels = c
                }
            }
        }).then((res) => {
            concatList(res, "Router");
        }).catch((error) => {
            tableRef && tableRef.setLoading(false);
            setRouterStatus(ErrorStatus)
        })
        Services.getSwapinHistory({
            params: {
                bridge: 'all',
                status: null,
            },
            sendOption: {
                getCancel: (c) => {
                    inCancels = c
                }
            }
        }).then((res) => {
            concatList(res, "IN");
        }).catch((error) => {
            tableRef && tableRef.setLoading(false);
            setInStatus(ErrorStatus)
        })
        Services.getSwapoutHistory({
            params: {
                bridge: 'all',
                status: null,
            },
            sendOption: {
                getCancel: (c) => {
                    outCancels = c
                }
            }
        }).then((res) => {
            concatList(res, "OUT");
        }).catch((error) => {
            tableRef && tableRef.setLoading(false);
            setOutStatus(ErrorStatus)
        })
    }

    function concatList(res, type) {
        if (!tableRef) {
            return;
        }
        tableRef.setLoading(false)

        if (progress === 0) {
            progress = 33;
            setStatus(33)
        } else if (progress === 33) {
            progress = 66;
            setStatus(66)
        } else if (progress === 66) {
            progress = 100;
            setStatus(100)
        }
        let orgList = res.result.data;

        let list = TradeUtils.deepMapList(orgList);
        window.success("receive list", list)
        let newList = []
        if (type === 'Router') {

            setRouterList(list);
            setRouterStatus(SuccessStatus);
            setShowRouter(true);

            newList = [...list, ...inList, ...outList];
        }
        if (type === 'IN') {
            setInList(list);
            setInStatus(SuccessStatus);
            setShowIn(true);

            newList = [...routerList, ...list, ...outList];
        }
        if (type === 'OUT') {

            setOutList(list)
            setOutStatus(SuccessStatus)
            setShowOut(true);

            newList = [...routerList, ...inList, ...list];
        }
        tableRef.setList(newList);
    }

    function renderList(showRoute, showIn, showOut) {

        window.groupSuccess("visible ==>", 'routerList', routerList, 'inList', inList, 'outList', outList)

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
        setShowList(list)
    }

    useEffect(() => {
        tableRef.setList(showList);
    }, [showList])

    function SelectIcon(props){
        let className = "select-type";
        if(props.selected){
            className = "select-type select-type-selected"
        }
        return (
            <span className={className}>
                <CheckOutlined className={"icon"}/>
            </span>
        )
    }

    function renderStatus() {
        let routerStatusView = renderLoadingStatus("router");
        let inStatusView = renderLoadingStatus("bridge(IN)");
        let outStatusView = renderLoadingStatus("bridge(OUT)");


        if (routerStatus === ErrorStatus) {
            routerStatusView = (
                <span className={"error-status"}>
                    <span className={"type"}>router</span>
                    <span className={"msg"}>{'加载失败'}</span>
                </span>
            )
        } else if (routerStatus === SuccessStatus) {
            routerStatusView = (
                <span
                    style={{opacity: showRoute ? 1 : 0.6}}
                    className={"success-status"}
                    onClick={() => {
                        setShowRouter(!showRoute);
                        renderList(!showRoute, showIn, showOut)
                    }}
                >
                    <SelectIcon selected={showRoute}/>
                    <span className={"type"}>router</span>
                    <span className={"msg"}>{`${routerList.length} 条数据`}</span>
                </span>)
        }

        if (inStatus === ErrorStatus) {
            inStatusView = (
                <span className={"error-status"}>
                    <span className={"type"}>bridge(IN)</span>
                    <span className={"msg"}>{'加载失败'}</span>
                </span>
            )
        } else if (inStatus === SuccessStatus) {
            inStatusView = (
                <span
                    style={{opacity: showIn ? 1 : 0.6}}
                    className={"success-status"}
                    onClick={() => {
                        setShowIn(!showIn);
                        renderList(showRoute, !showIn, showOut)
                    }}
                >
                    <SelectIcon selected={showIn}/>
                    <span className={"type"}>bridge(IN)</span>
                    <span className={"msg"}>{` ${inList.length} 条数据`}</span>
                </span>
            )
        }

        if (outStatus === ErrorStatus) {
            outStatusView = (
                <span className={"error-status"}>
                    <span className={"type"}>bridge(OUT)</span>
                    <span className={"msg"}>{'加载失败'}</span>
                </span>
            )
        } else if (outStatus === SuccessStatus) {
            outStatusView = (
                <span
                    style={{opacity: showOut ? 1 : 0.6}}
                    className={"success-status"}
                    onClick={() => {
                        setShowOut(!showOut);
                        renderList(showRoute, showIn, !showOut)
                    }}
                >
                    <SelectIcon selected={showOut}/>
                    <span className={"type"}>bridge(OUT)</span>
                    <span className={"msg"}>{` ${outList.length} 条数据`}</span>
                </span>
            )
        }

        return (
            <span style={{fontSize: 12, marginLeft: 10, color: 'gray'}}>
                {routerStatusView}
                {inStatusView}
                {outStatusView}
            </span>
        )
    }

    function getTitle() {
        return (
            <div>
                查询结果
                &nbsp;&nbsp;&nbsp;&nbsp;
                <Progress
                    width={34}
                    size={"small"}
                    type="circle"
                    percent={progress}
                />
                {renderStatus()}
            </div>
        )
    }

    let card2Title = getTitle();
    return (
        <div className='uncertained-container'>
            <SearchTable
                scroll={{x: 1240, y: `calc(100vh - 280px)`}}
                combineField={"bridge"}
                pagination={{pageSize: 150}}
                card2Extra={(
                    <Button
                        type={"primary"}
                        onClick={loadMore}
                        size={"middle"}
                        disabled={!(inStatus && outStatus && routerStatus)}
                    >
                        查询
                    </Button>
                )}
                card2Title={card2Title}
                getRef={(node) => {
                    if (tableRef) {
                        return
                    }
                    tableRef = node;
                }}
                columns={columns}
            />
        </div>
    )
}

export default UnAscertained;
