import http from "@/utils/http";

const rpc = 'http://112.74.110.203:20522/rpc';

export const getSwap = function (params) {
    return http.http({
        url: rpc,
        method: 'post',
        data: {
            "jsonrpc": "2.0",
            "method": "swap.GetSwap",
            "params": [
                {
                    "chainid": null,
                    "txid": null,
                    ...params
                }
            ],
            "id": 1
        }
    })
};


export const getSwapHistory = function (params) {
    return http.http({
        method: 'post',
        url: 'http://112.74.110.203:20522/rpc',
        data: {
            "jsonrpc": "2.0",
            "method": "swap.GetSwapHistory",
            "params": [{
                "bridge": null,
                "status": null,
                ...params
            }],
            "id": 1
        }
    })
}

export const getSwapNotStable = function (params = null) {
    //没有参数
    return http.http({
        method: 'post',
        url: 'http://112.74.110.203:20522/rpc',
        data: {
            "jsonrpc": "2.0",
            "method": "swap.GetSwapNotStable",
            params: [{
                ...params
            }],
            "id": 1
        }
    })
}

export const getStatusInfo = function (params) {
    const { bridge, status } = params;
    return http.http({
        method: 'post',
        url: 'http://112.74.110.203:20522/rpc',
        data: {
            "jsonrpc": "2.0",
            "method": "swap.GetStatusInfo",
            "params": [{
                "bridge": bridge,
                "status": status.join(",")
            }],
            "id": 1
        }
    })
}


export default {
    getSwap,
    getSwapHistory,
    getSwapNotStable,
    getSwapNotStable,
    getStatusInfo
}



