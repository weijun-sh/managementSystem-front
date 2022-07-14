import React from 'react';
import {message, Modal} from 'antd';
import PageContainer, {} from 'mc/container/PageContainer';
import CopyButton from "mc/button/CopyButton";
import {minifyValue, renderChainID, renderStatus} from '../tradeUtils';
import './index.less'
import {allBridgeChainInfo} from '../constants/staticApi';
import Utils from "mu";
import ToChainLink from "../components/toChainLink";
import {sourceHash} from "../openOuter";

function detail(record) {
    let {status, value, swapvalue, bind, txid, fromChainID, toChainID, from, timestamp, swaptx} = record;
    if (!record) {
        message.error("记录为空")
        return;
    }


    let coin = record.pairid;
    if (record.swapinfo && record.swapinfo.routerSwapInfo) {
        coin = record.swapinfo.routerSwapInfo.tokenID
    }
    timestamp = Utils.Time.dateFormatter(timestamp);
    status = renderStatus(status);
    value = minifyValue(value, record.fromChainID);
    // swaptx should be a long text
    swapvalue = !!swaptx && swaptx !== '' ? minifyValue(swapvalue, record.toChainID) : '';
    let fromChainIDName = renderChainID(fromChainID);
    let toChainIDName = renderChainID(toChainID);

    function targetHash(id) {
        let chainInfo = allBridgeChainInfo[toChainID];
        if(!chainInfo) { message.error("链为空"); return;}
        let explorer = chainInfo.explorer;
        let addr = explorer.tx;
        let href = `${addr}${id}`;
        window.open(href, '_blank')
    }

    function sent(id) {
        let chainInfo = allBridgeChainInfo[fromChainID];
        if(!chainInfo) { message.error("链为空"); return;}
        let explorer = chainInfo.explorer;
        let addr = explorer.address;
        let href = `${addr}${id}`;
        window.open(href, '_blank')
    }


    function recieved(id) {
        let chainInfo = allBridgeChainInfo[toChainID];
        if(!chainInfo) { message.error("链为空"); return;}
        let explorer = chainInfo.explorer;
        let addr = explorer.address;
        let href = `${addr}${id}`;
        window.open(href, '_blank')
    }

    function renderContent(){
        return  (
            <div>
                <PageContainer className='trade-detail-container'>
                    <div className='line'>
                        <label>来源链哈希:</label>
                        <label>
                            <CopyButton
                                onTextClick={() => {
                                    sourceHash(txid, fromChainID)
                                }}
                                className="pointer"
                            >
                                {txid}
                            </CopyButton>
                            <ToChainLink
                                hash={txid}
                                chainid={fromChainID}
                            />
                        </label>
                    </div>
                    <div className='line'>
                        <label>目标链哈希:</label>
                        <label>
                            <CopyButton
                                onTextClick={() => {
                                    targetHash(swaptx, 'outer')
                                }}
                                className="pointer"
                            >
                                {swaptx}
                            </CopyButton>
                            <ToChainLink
                                hash={swaptx}
                                chainid={toChainID}
                            />
                        </label>
                    </div>

                    <div className='line'>
                        <label>来源链:</label>
                        <label>
                            {fromChainIDName}
                        </label>
                    </div>

                    <div className='line'>
                        <label>目标链:</label>
                        <label>
                            {toChainIDName}
                        </label>
                    </div>

                    <div className='line'>
                        <label>发送:</label>
                        <label>
                            <CopyButton
                                onTextClick={() => {
                                    sent(from)
                                }}
                                className="pointer"
                            >
                                {from}
                            </CopyButton>
                        </label>
                    </div>
                    <div className='line'>
                        <label>接收:</label>
                        <label>
                            <CopyButton
                                onTextClick={() => {
                                    recieved(bind)
                                }}
                                className="pointer"
                            >
                                {bind}
                            </CopyButton>
                        </label>
                    </div>
                    <div className='line'>
                        <label>日期:</label>
                        <label>
                            {timestamp}
                        </label>
                    </div>
                    <div className='line'>
                        <label>币种:</label>
                        <label>
                            {coin}
                        </label>
                    </div>
                    <div className='line'>
                        <label>发送数量:</label>
                        <label>
                            {value}
                        </label>
                    </div>
                    <div className='line'>
                        <label>接收数量:</label>
                        <label>
                            {swapvalue}
                        </label>
                    </div>
                    <div className='line'>
                        <label>状态:</label>
                        <label>
                            {status}
                        </label>
                    </div>
                </PageContainer>
            </div>
        )
    }

    Modal.confirm({
        title: '详细信息',
        width: 800,
        okText: "确定",
        icon: false,
        cancelButtonProps: {hidden: true},
        closable: true,
        maskClosable: true,
        content: renderContent()
    })
}

export default detail;
