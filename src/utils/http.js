import request from 'umi-request';
import {message} from 'antd'

function http(options){
  const {method, params, url, toastError = true, timeout = 5000, data} = options;
  return new Promise((resolve, reject) => {
    request(url, {
      method,
      params,
      timeout,
      data
    }).then((res) => {
      if(res.code !== 0){
        if(toastError){
          message.error(res.msg, 1, ).then(() => {})
        }
        reject(res)
        return;
      }
      resolve(res, res.data)
    }).catch((err) => {
      message.error("请求失败",1).then(() => {});
      console.log("请求失败 ==>", url, params)
      reject(err)
    })
  })
}

export default {
  http,
}
