import {allBridgeChainInfo} from "./constants/staticApi";
import {message} from "antd";


export function sourceHash(hash, chainid) {

    let chainInfo = allBridgeChainInfo[chainid];
    window.success("allBridgeChainInfo", Object.keys(allBridgeChainInfo))
    window.success("chainid", chainid)
    window.success("chainInfo", allBridgeChainInfo[chainid])
    if(!chainInfo) { message.error("链为空"); return;}
    let explorer = chainInfo.explorer;
    let addr = explorer.tx;
    let href = `${addr}${hash}`;
    window.open(href, '_blank')
}



export default {
    sourceHash
}
