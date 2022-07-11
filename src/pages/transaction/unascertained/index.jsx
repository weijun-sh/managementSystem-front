import React, {useEffect, useState} from 'react';
import SearchTable from 'mc/table/SearchTable';
import Services from '../../../services/api';
import TradeUtils, {db0First} from '../tradeUtils'
import './index.less'
import {Button, message, Progress} from "antd";
import {SWAPIN_TYPE, SWAPOUT_TYPE} from "../constants/constant";

let tableRef = null;
let progress = 0;
let routerCancels = null;
let inCancels = null;
let outCancels = null;

function UnAscertained(props) {
    const [status, setStatus] = useState(0)
    let cols = TradeUtils.getUnascertainedColumns();
    const columns = [...cols];

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

    function loadMore() {
        message.success("正在加载中", 0.3)
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
        }).catch(() => {
            tableRef && tableRef.setLoading(false);

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
        }).catch(() => {
            tableRef && tableRef.setLoading(false);
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
        }).catch(() => {
            tableRef && tableRef.setLoading(false)
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
        let list = TradeUtils.deepMapList(orgList, type);
        list = db0First(list);
        message.success(`加载 ${bridge} ${list.length} 条 记录`, 0.5)
        list = tableRef.state.list.concat(list);
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
                <span style={{fontSize: 12, color: '#999'}}>
                    {
                        progress !== 100 ?
                            "loading..." :
                            "finish"
                    }
                </span>

            </div>
        )
    }

    return (
        <div className='uncertained-container'>
            <SearchTable
                scroll={{x: 1240, y: `calc(100vh - 400px)`}}
                combineField={"bridge"}
                pagination={{pageSize: 150}}
                card2Extra={(
                    <Button
                        type={"primary"}
                        onClick={loadMore}
                        size={"middle"}
                        disabled={progress !== 100}
                    >
                        刷新
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
