import { Loading, Message } from 'element-ui'
import { getTimeString } from '@/utils/filter'
import { requestApi2 } from '@/api/index'
import md5 from 'js-md5'

// 替换上传的url
export function replaceDomainName(url, type, city) {
  if (!url) {
    return undefined
  }
  const bucketName = 'http://xiaoheiwu-advertisement.oss-cn-shenzhen.aliyuncs.com'
  const cdn = 'adminsystemv2.heywoodsminiprogram.com'
  // if(city && city == 'shanghai'){
  //     bucketName = 'https://heywood-album.oss-cn-shanghai.aliyuncs.com'
  //     cdn = 'albumpic.heywoodsapps.com'
  // }
  return url.replace(bucketName, `http://${cdn}`)
  // if(type && type == 'img'){ //图片类型
  //     return url.replace(bucketName,`http://${cdn}`)
  // }else { //音乐，视频等其它类型
  //     return url.replace(bucketName,`https://${cdn}`)
  // }
}

export const initConfig = async() => {
  const OSS = require('ali-oss')
  return new Promise((resolve, reject) => {
    requestApi2('api/backstage/oss/upload_auth_without_sign', 'post', {
      bucket_name: 'comrade-in-arms'
    }).then(({ data: {
      access_key_id,
      access_key_secret,
      security_token,
      expiration
    }}) => {
      localStorage.setItem('advertExpiration', expiration)
      resolve(new OSS({
        accessKeyId: access_key_id,
        accessKeySecret: access_key_secret,
        stsToken: security_token,
        region: 'oss-cn-shenzhen', // oss地区
        bucket: 'comrade-in-arms'
      }))
    })
  })
}
// 参数说明
// client OSS上传对象
// file 上传的文件对象
// uploadUrl 上传目录
export const upload = async(client, file, uploadUrl) => {
  const loadingInstance = Loading.service({
    text: '上传中...'
  })
  // console.log(client, file, uploadUrl, '参数')
  try {
    const fileNameE = file.file.name
    const fileNameArr = fileNameE != '' ? fileNameE.split('.') : []
    const fileName = fileNameArr.length > 1 ? md5(fileNameArr[0]) + '.' + fileNameArr[1] : getTimeString() + '.' + file.file.type.split('/')[1]
    const storeAs = uploadUrl + new Date().getTime() + fileName
    const result = await client.put(storeAs, file.file)
    loadingInstance.close()
    // Message({
    //   type: 'success',
    //   message: '上传成功'
    // })
    return result
  } catch (e) {
    console.error(e)
    Message({
      type: 'error',
      message: '上传失败'
    })
    return undefined
  }
}

/**
 *  获取当前时间戳
 */
export function timest() {
  var tmp = Date.parse(new Date()).toString()
  tmp = tmp.substr(0, 10)
  return tmp
}

/*
 * 将秒数格式化时间
 * @param {Number} seconds: 整数类型的秒数
 * @return {String} time: 格式化之后的时间
 */ 
export const formatTime = (seconds) =>{
  let min = Math.floor(seconds / 60)
  let second = Math.round(seconds % 60)
  let hour = null
  let newMin = null
  let time = null
  if (min > 60) {
    hour = Math.floor(min / 60);
    newMin = min % 60;
  }
  if (second < 10) { 
    second = '0' + second
  }
  if (min < 10) { 
    min = '0' + min
  }
  // eslint-disable-next-line no-return-assign
  return time = hour? (hour + ':' + newMin + ':' + second) : (min + ':' + second)
}

export function formatDate (date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + ''
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str))
    }
  }
  return fmt
};

function padLeftZero (str) {
  return ('00' + str).substr(str.length)
};