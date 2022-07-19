import {allBridgeChainInfo} from "./constants/staticApi";
import {message} from "antd";


export function sourceHash(hash, chainid) {

    let chainInfo = allBridgeChainInfo[chainid];
    if(!chainInfo) { message.error("链为空"); return;}
    let explorer = chainInfo.explorer;
    let addr = explorer.tx;
    let href = `${addr}${hash}`;
    window.open(href, '_blank')
}



export default {
    sourceHash
}
