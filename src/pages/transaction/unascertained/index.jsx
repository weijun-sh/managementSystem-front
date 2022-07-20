import React, {useEffect, useState} from 'react';
import SearchTable from 'mc/table/SearchTable';
import Services from '../../../services/api';
import TradeUtils from '../tradeUtils'
import './index.less'
import {message} from "antd";
import {
    UN_Loading_Status,
    UN_Success_Status,
    UN_Error_Status,
    UnErrorTab,
    UnLoadedView,
    UnLoadingStatus,
    setOutList,
    setInList,
    setRouterList,
    inList,
    outList,
    routerList,
    tableRef,
    progress,
    setTableRef,
    setProgress,
    setRouterCancel,
    setOutCancel,
    setInCancel,
    unEnterPage,
    unLeftPage,
    UnTableExtra,
    tableSetLoading,
    tableSetList,
    unCombList,
    unUpdateProgress,
    UnProgressView, setLimitedDate, filterRangeList
} from "./utils";

function UnAscertained(props) {
    const [status, setStatus] = useState(0)
    let cols = TradeUtils.getUnascertainedColumns();
    const columns = [...cols];
    const [inStatus, setInStatus] = useState(UN_Loading_Status);
    const [outStatus, setOutStatus] = useState(UN_Loading_Status);
    const [routerStatus, setRouterStatus] = useState(UN_Loading_Status);
    const [showRoute, setShowRouter] = useState(true);
    const [showIn, setShowIn] = useState(true);
    const [showOut, setShowOut] = useState(true);
    //const [showList, setShowList] = useState([]);

    useEffect(() => {
        if (tableRef) {
            unEnterPage();
            loadMore();
            setShowRouter(true)
            setShowIn(true)
            setShowOut(true)
            setRouterStatus(UN_Loading_Status);
            setInStatus(UN_Loading_Status)
            setOutStatus(UN_Loading_Status)
        }
        return function () {
            unLeftPage()
        }
    }, []);

    function initStatus() {
        setInStatus(null);
        setOutStatus(null);
        setRouterStatus(null);
    }

    function loadMore() {

        message.success("正在加载中", 0.3).then(() => {
        });
        initStatus()
        setProgress(0);
        setStatus(0);
        tableSetList([]);
        tableSetLoading(true)

        //request router bridge(in/out) at same time
        routerRequest();
        inRequest();
        outRequest();
    }

    function routerRequest() {
        Services.getSwapHistory({
            params: {
                bridge: 'all',
                status: null,
            },
            sendOption: {getCancel: setRouterCancel}
        }).then((res) => {
            concatList(res, "Router");
        }).catch((error) => {
            tableSetLoading(false);
            setRouterStatus(UN_Error_Status);
        })
    }

    function inRequest() {
        Services.getSwapinHistory({
            params: {
                bridge: 'all',
                status: null,
            },
            sendOption: {getCancel: setInCancel}
        }).then((res) => {
            concatList(res, "IN");
        }).catch((error) => {
            tableSetLoading(false)
            setInStatus(UN_Error_Status)
        })
    }

    function outRequest() {
        Services.getSwapoutHistory({
            params: {
                bridge: 'all',
                status: null,
            },
            sendOption: {getCancel: setOutCancel}
        }).then((res) => {
            concatList(res, "OUT");
        }).catch((error) => {
            tableSetLoading(false)
            setOutStatus(UN_Error_Status)
        })
    }

    function concatList(res, type) {
        if (!tableRef) {
            return;
        }
        tableSetLoading(false)

        unUpdateProgress();
        let orgList = res.result.data;

        let list = TradeUtils.deepMapList(orgList);
        let newList = []
        if (type === 'Router') {
            setRouterList(list);
            setRouterStatus(UN_Success_Status);
            setShowRouter(true);
            newList = [...list, ...inList, ...outList];
        }
        if (type === 'IN') {
            setInList(list);
            setInStatus(UN_Success_Status);
            setShowIn(true);
            newList = [...routerList, ...list, ...outList];
        }
        if (type === 'OUT') {
            setOutList(list)
            setOutStatus(UN_Success_Status)
            setShowOut(true);
            newList = [...routerList, ...inList, ...list];
        }
        newList = filterRangeList(newList)
        tableSetList(newList);
    }

/*    useEffect(() => {
        tableSetList(showList);
    }, [showList])*/

    function ShowStatusGroupView() {
        let routerStatusView = <UnLoadingStatus title={"router"}/>;
        let inStatusView = <UnLoadingStatus title={"bridge(IN)"}/>;
        let outStatusView = <UnLoadingStatus title={"bridge(OUT)"}/>;

        if (routerStatus === UN_Error_Status) {
            routerStatusView = <UnErrorTab title={"router"}/>;
        } else if (routerStatus === UN_Success_Status) {
            routerStatusView = (
                <UnLoadedView
                    title={"router"}
                    selected={showRoute}
                    length={routerList.length}
                    onClick={() => {
                        setShowRouter(!showRoute);
                        let list = unCombList(!showRoute, showIn, showOut);
                        tableSetList(list);
                        //setShowList(list)
                    }}
                />
            )
        }

        if (inStatus === UN_Error_Status) {
            inStatusView = <UnErrorTab title={"bridge(IN)"}/>;
        } else if (inStatus === UN_Success_Status) {
            inStatusView = (
                <UnLoadedView
                    title={"bridge(IN)"}
                    selected={showIn}
                    length={inList.length}
                    onClick={() => {
                        setShowIn(!showIn);
                        let list = unCombList(showRoute, !showIn, showOut);
                        tableSetList(list);
                        //setShowList(list)
                    }}
                />
            )
        }

        if (outStatus === UN_Error_Status) {
            outStatusView = <UnErrorTab title={"bridge(OUT)"}/>
        } else if (outStatus === UN_Success_Status) {
            outStatusView = (
                <UnLoadedView
                    title={"bridge(OUT)"}
                    selected={showOut}
                    length={outList.length}
                    onClick={() => {
                        setShowOut(!showOut);
                        let list = unCombList(showRoute, showIn, !showOut)
                        tableSetList(list);
                        //setShowList(list)
                    }}
                />
            )
        }
        return (
            <span
                className={"show-status-wrap"}
            >
                {routerStatusView}
                {inStatusView}
                {outStatusView}
            </span>
        )
    }
    //every render ,update view. loading error, success
    let card2Title = (function (){
        return (
            <div>
                <UnProgressView/>
                <ShowStatusGroupView/>
            </div>
        )
    })();
    return (
        <div className='uncertained-container'>
            <SearchTable
                scroll={{x: 1270, y: `calc(100vh - 280px)`}}
                combineField={"bridge"}
                pagination={{pageSize: 150}}
                card2Extra={(
                    <UnTableExtra
                        btnDisabled={!(inStatus && outStatus && routerStatus)}
                        selectDisabled={progress !== 100}
                        onSelect={(value) => {
                            setLimitedDate(value);
                            let list = unCombList(showRoute, showIn, showOut);
                            tableSetList(list)
                        }}
                        onClick={() => {
                            loadMore()
                        }}
                    />
                )}
                card2Title={card2Title}
                getRef={setTableRef}
                columns={columns}
            />
        </div>
    )
}

export default UnAscertained;
