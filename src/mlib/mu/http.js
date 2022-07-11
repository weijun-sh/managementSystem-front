import axios from 'axios';
import {message} from 'antd'

const CancelToken = axios.CancelToken;

function http(options) {
    const {method, params, url, toastError = true, timeout = 120, data, sendOption = {},} = options;
    return new Promise((resolve, reject) => {
        const {getCancel} = sendOption;
        let cancelToken = new CancelToken(function executor(c) {
            getCancel && getCancel(c);
        });

        axios(url, {
            method,
            params,
            timeout: timeout * 1000,
            data,
            cancelToken,
        }).then((response) => {
            if (response.status === 200) {
                return response.data
            }
            throw new Error({
                statusText: response.statusText,
                message: '请求状态非 statusText 200',
                response: response
            })
        }).then((res) => {
            if (res.code === 0 || (res.result && res.result.code === 0)) {
                resolve(res, res.data)
                return;
            }

            if (toastError) {
                let msg = res.msg || res.error.message
                message.error(msg, 1,).then(() => {
                })
            }
            reject && reject(res)

            window.groupError("request res", "res", res, "data", data,"params", data.params)

        }).catch((err) => {
            if(typeof err.message === 'string'){
                if (err.message.indexOf('canceled') !== -1) {
                    window.groupWarm("取消请求", "data",  data, 'params', data.params);

                }if (err.message.indexOf('cross') !== -1) {
                    window.groupWarm("跨域失败", "data",  data, 'params', data.params);
                    message.error("跨域失败", 1).then(() => {});
                }else if (err.message.indexOf('timeout') !== -1) {
                    window.groupWarm("60秒 请求超时",'err', err, "data",  data, 'params', data.params);
                    message.error("请求超时", 1).then(() => {});
                }else if (err.message.indexOf('statusText') !== -1) {
                    window.groupWarm("网络错误",'err', err, "data",  data, 'params', data.params);
                    message.error("网络错误", 1).then(() => {});
                }else {
                    window.groupError('请求失败', 'err', err, "data",  data,'params', data.params)
                    message.error(err.message).then(() => {})
                }
            }

            reject && reject(err)
        })
    })
}

export default {
    http,
}
