import React, {useEffect, useState} from 'react';
import {useNavigate, useSearchParams} from 'react-router-dom';
import {message} from "antd";
import Services from '../../../services/api';
import SearchTable from 'mc/table/SearchTable';
import TradeUtils, {db0First} from '../tradeUtils';
import './index.less'
import {LeftOutlined} from "@ant-design/icons";

const columns = TradeUtils.getHistoryColumns();
export default function History(props) {
    const [tableRef, setTableRef] = useState(null);
    const navigate = useNavigate();
    const [params] = useSearchParams();
    let status = params.get('status');
    let bridge = params.get('bridge');
    let type = params.get('type');
    if(bridge){
        bridge = bridge.replace(/_db/, '_#');
    }
    useEffect(() => {
        if (!bridge || !status) {
            message.error("请选择要查看的桥, 状态, 即将跳转到总览", 2, () => {
                navigate('/transition/summary')
            })
        }
    }, []);

    /*
    * router list, or swap in/out list
    * */
    function getList(info) {
        return new Promise((resolve, reject) => {
            let service = Services.getSwapHistory
            if (type === 'in') {
                service = Services.getSwapinHistory
            }
            if (type === 'out') {
                service = Services.getSwapoutHistory
            }
            service({
                params: {
                    "bridge": bridge,
                    "status": status
                }
            }).then((response) => {
                let list = TradeUtils.deepMapList(response.result.data);
                list = db0First(list);
                resolve(list);
            }).catch((error) => {
                reject(error)
            })
        })
    }

    function getTitle() {
        return (
            <div>
                <LeftOutlined
                    onClick={() => {
                        if (type === 'in' || type === 'out') {
                            navigate('/transition/summary?tab=bridge')
                            return;
                        }
                        navigate('/transition/summary?tab=router')
                    }}
                />
                &nbsp;&nbsp;
                <span>
                    历史记录 &nbsp;&nbsp;
                </span>
                <strong>{bridge}</strong> &nbsp;&nbsp;
                <span style={{color: 'orange'}}>
                    {TradeUtils.renderSummaryStatus(status)}
                </span>
            </div>
        )
    }

    return (
        <div className='history-container'>
            <SearchTable
                scroll={{x: 1160, y: `calc(100vh - 280px)`}}
                pagination={{pageSize: 100}}
                card2Title={getTitle()}
                columnIndex={false}
                getRef={(node) => {
                    if(tableRef){return}
                    setTableRef(node);
                    node.fetchData();
                }}
                columns={columns}
                getList={getList}
            />
        </div>
    )
};
