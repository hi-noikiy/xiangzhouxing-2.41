const wxp = require('./wx-promise')
const { domain, appid } = require('../config/index')
const { getSessionId } = require('./session')

let showGlobalModal = false
function request(options, retryTime = 2) {
  if (retryTime === 0) {
    return Promise.reject(null)
  }
  return new Promise((resolve, reject) => {
    getSessionId()
      .then(sessionid => {
        console.log('发起请求:')
        console.log(fixedDomain(options.url))
        console.log('发起请求的配置参数:')
        console.log({...options})
        return wxp.request({
          ...options,
          url: fixedDomain(options.url),
          header: {
            ...options.header,
            sessionid,
            appid
          },
          timeout: options.timeout || 15000
          // timeout: 1000000000
        })
      })
      .then(({ statusCode, data }) => {
        const { errcode }  = data
        console.log('data', data)
        if ([110001005, 110001004, -1].includes(errcode)) {
          wx.removeStorageSync('wx-sessionid')
          return request(options, retryTime - 1).then(resolve)
        }
        if (errcode === 0) {
          return resolve(data.data)
        }
        return reject(data)
      })
      .catch(() => {
        if(!showGlobalModal) {
          showGlobalModal = true
          wx.showModal({
            title: '温馨提示',
            content: '当前人数较多，请稍后再试',
            showCancel: false,
            success: () => {
              showGlobalModal = false
            }
          })
        }
        return reject(null)
      })
  })
}

function fixedDomain(url) {
  if (url.indexOf('http') === 0) {
    return url
  }

  return `${domain}${url}`
}

module.exports = {
  request,
}
