'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')
module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '"http://localhost:3000"',
  BASE_API3: '"https://aliservice.heywoodsminiprogram.com/"',
  UPLOAD_PHOTO_URL:'"dev/"', // 上传广告图片目录
})
