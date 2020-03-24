import request from '@/utils/request'
import qs from 'qs'
import axios from 'axios'
import {
  Message,
  Loading
} from 'element-ui'
function requestApi(url, method = 'GET', data = {}) {
  return new Promise((resolve, reject) => {
    request({
      url,
      method,
      params: method.toUpperCase() === 'GET' ? data : '',
      data: method.toUpperCase() !== 'GET' ? data : ''
    }).then((res) => {
      if (res.code === 200) {
        resolve(res)
      // } else if (res.data.ErrCode === 40004) {
      //   window.location.href = res.data.url
      // } else {
      } else if (res.code === 403) {
        // axios('http://comradesadmin.heywoodsminiprogram.com/auth/login', 'get').then(result => {
        //   window.location.href = result.data
        // })
        resolve(res)
      } else {
        Message({
          message: res.msg,
          type: 'error',
          duration: 5 * 1000
        })
        Loading.service().close()
        reject(res)
      }
    }, (error) => {
      reject(error)
    })
  })
}

function requestApi2(url, method = 'GET', data = {}) {
  return new Promise((resolve, reject) => {
    axios({
      url: process.env.BASE_API3 + url,
      method: method,
      params: method.toUpperCase() === 'GET' ? data : '',
      data: method.toUpperCase() !== 'GET' ? qs.stringify(data) : '',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then((res) => {
      if (res.data.errCode === 0) {
        resolve(res.data)
      } else if (res.data.errCode === 40004) {
        window.location.href = res.data.url
      } else {
        Message({
          message: res.data.errMsg,
          type: 'error',
          duration: 5 * 1000
        })
        Loading.service().close()
        reject(res)
      }
    }, (error) => {
      reject(error)
    })
  })
}
export {
  requestApi,
  requestApi2
}
