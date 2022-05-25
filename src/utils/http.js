import request from 'umi-request';
import {message} from 'antd'

function transformRes(res){
  return {
    code: res.code || res.Code,
    msg: res.msg || res.Msg,
    data: res.data || res.Data,
  }
}

function http(options){
  const {method, params, url, toastError = true, timeout = 5000} = options;
  return new Promise((resolve, reject) => {
    request(url, {
      method,
      params,
      timeout
    }).then((res) => {
      res = transformRes(res);
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
