import React, {useEffect, useState} from 'react';
import SearchTable from 'mc/table/SearchTable';
import Services from '../../../services/api';
import TradeUtils, {db0First} from '../tradeUtils'
import './index.less'
import {Button, message, Progress, Spin} from "antd";
import {Router_TYPE, SWAPIN_TYPE, SWAPOUT_TYPE} from "../constants/constant";

let tableRef = null;
let progress = 0;
let routerCancels = null;
let inCancels = null;
let outCancels = null;



function UnAscertained(props) {
    const [status, setStatus] = useState(0)
    let cols = TradeUtils.getUnascertainedColumns();
    const columns = [...cols];
    const [inStatus, setInStatus] = useState(null);
    const [outStatus, setOutStatus] = useState(null);
    const [routerStatus, setRouterStatus] = useState(null);

    useEffect(() => {
        if(tableRef){
            tableRef.setList([])
            loadMore();
            progress = 0;
        }
        return function () {
            tableRef = null
            routerCancels && routerCancels();
            routerCancels && inCancels()
            routerCancels && outCancels()
        }
    }, []);

    function renderLoadingStatus(type){
        return (
            <span className={"loading-status"}>
                <span className="type">{`${type}`}</span>&nbsp;&nbsp;
                <Spin size={"small"}/>
            </span>
        )
    }
    function initStatus (){
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
            concatList(res, Router_TYPE, "Router");
            //throw new Error("this is a error")
        }).catch((error) => {
            tableRef && tableRef.setLoading(false);
            setRouterStatus(
                <span className={"error-status"}>
                    <span className={"type"}>Router</span>
                    <span className={"msg"}>{error.message || '加载失败'}</span>
                </span>
            )
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
            concatList(res, SWAPIN_TYPE, "IN");
            //throw new Error("this is a error")
        }).catch((error) => {
            tableRef && tableRef.setLoading(false);
            setInStatus(
                <span className={"error-status"}>
                    <span className={"type"}>swapin</span>
                    <span className={"msg"}>{error.message || '加载失败'}</span>
                </span>
            )
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
            concatList(res, SWAPOUT_TYPE, "OUT");
            //throw new Error("this is a error")
        }).catch((error) => {
            tableRef && tableRef.setLoading(false);
            setOutStatus(
                <span className={"error-status"}>
                    <span className={"type"}>swapout</span>
                    <span className={"msg"}>{error.message || '加载失败'}</span>
                </span>
            )
        })


    }

    function concatList(res, bridge, type) {
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
        let orgList = res.result.data
        let list = TradeUtils.deepMapList(orgList);

        if(type === 'Router') {
            setRouterStatus(
                <span className={"success-status"}>
                    <span className={"type"}>Router</span>
                    <span className={"msg"}>{`加载 ${list.length} 条数据`}</span>
                </span>)
        }
        if(type === 'IN') {
            setInStatus(
                <span className={"success-status"}>
                    <span className={"type"}>swapin</span>
                    <span className={"msg"}>{`加载 ${list.length} 条数据`}</span>
                </span>)
        }
        if(type === 'OUT') {
            setOutStatus(<span className={"success-status"}>
                <span className={"type"}>swapout</span>
                <span className={"msg"}>{`加载 ${list.length} 条数据`}</span>
            </span>)
        }

        list = tableRef.state.list.concat(list);

        list = db0First(list);

        tableRef.setList(list);

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
                &nbsp;&nbsp;&nbsp;&nbsp;
                <span style={{fontSize: 12, marginLeft: 10, color: 'gray'}}>
                    {routerStatus || renderLoadingStatus("Router")}
                    {inStatus || renderLoadingStatus("swapin")}
                    {outStatus || renderLoadingStatus("swapout")}
                </span>
            </div>
        )
    }

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
                card2Title={getTitle}
                getRef={(node) => {
                    if(tableRef){return}
                    tableRef = node;
                }}
                columns={columns}
            />
        </div>
    )
}

export default UnAscertained;
