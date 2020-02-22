const wxp = require('./wx-promise')
const Event = require('../components/gsd-lib/event/index')
const { domain, appid } = require('../config/index')

let isFetchSessionIdLoading = false

function fetchSessionId() {
  /**
   * 防止在首次打开小程序时，请求了多个接口
   * 导致多次请求 /api/mp/login 接口拿 sessionId
   */
  if (isFetchSessionIdLoading) {
    return new Promise((resolve, reject) => {
      Event.addEventListener('fetchSessionSuccess', (eventRes) => {
        resolve(eventRes.target)
      })
      Event.addEventListener('fetchSessionFail', (eventRes) => {
        reject(eventRes.target)
      })
    })
  }

  isFetchSessionIdLoading = true

  return new Promise((resolve, reject) => {
    wxp.login()
      .then(({ code }) => {
        console.log(code)
        return wxp.request({
          url: domain + '/wll/account/login?js_code=' + code,
          header: {
            appid
          }
        })
      })
      .then(({ data }) => {
        const { errcode } = data
        if (errcode === 0) {
          isFetchSessionIdLoading = false
          const { sessionid, openid } = data.data
          wx.setStorageSync('wx-openid', openid)
          wx.setStorageSync('wx-sessionid', sessionid)
          Event.dispatch('fetchSessionSuccess', sessionid)
          Event.removeEventListener('fetchSessionSuccess')
          Event.removeEventListener('fetchSessionFail')
          resolve(sessionid)
          return
        }

        handleSessionFail(reject)
      })
      .catch(err => {
        console.error('wx.login err', err)
        handleSessionFail(reject)
      })
  })
}

function getSessionId() {
  const sessionid = wx.getStorageSync('wx-sessionid')
  if (sessionid) {
    return Promise.resolve(sessionid)
  }

  return fetchSessionId()
}

function handleSessionFail(reject) {
  isFetchSessionIdLoading = false
  wx.showModal({
    title: '温馨提示',
    content: '当前人数较多，请稍后再试',
    showCancel: false
  })
  Event.dispatch('fetchSessionFail', null)
  Event.removeEventListener('fetchSessionSuccess')
  Event.removeEventListener('fetchSessionFail')
  reject({
    errcode: -20000,
    errmsg: '请求 sessionId 失败'
  })
}

module.exports = {
  fetchSessionId,
  getSessionId,
  handleSessionFail
}
