

import React, {useState} from 'react';
import PageContainer from "../../../mlib/mc/container/PageContainer";
import SearchTable from "../../../mlib/mc/table/SearchTable";
import {getReview} from "../../../services/api";
import TradeUtils from "../tradeUtils";
const columns = TradeUtils.getReviewColumns();

function Review(){

    const [ref, setRef] = useState(null);
    function getList(){
        return new Promise((resolve, reject) => {

            getReview({
                params:{
                    bridge: 'all'
                }
            }).then((res) => {
                let list = TradeUtils.deepMapList(res.result.data);
                resolve(list)
            }).catch((err) => {
                reject(err)
            })

        })
    }
    return (
        <PageContainer>
            <SearchTable
                getRef={(node) => {
                    if(ref){
                        return;
                    }
                    setRef(node);
                    node.fetchData()
                }}
                getList={getList}
                columns={columns}
            />
        </PageContainer>
    )
}

export default Review
