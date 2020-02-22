const { Anim, userStore, request, config, wxp } = getApp();
const { fetchSessionId } = require('../../../utils/session')

Anim.Page({
  store(state) {
    return {
      isAuth: state.user.userInfo.isAuth,
      userInfo: state.user.userInfo
    }
  },
  data: {
    needCheckSession: true,
    cityName: config.cityName,
    authTitle: '请先登录账号',
    authDesc: '',
    authBtnText: '登录'
  },
  onLoad(options) {
    this.checkWxSession()
  },
  // 判断微信的 sessionKey 是否过期，用于解密手机号
  checkWxSession() {
    wxp.checkSession()
      .then(() => {
        console.log('当前的 sessionKey 未过期')
        this.setData({ needCheckSession: false })
      })
      .catch(e => {
        console.log('当前的 sessionKey 已过期')
        this.setData({ needCheckSession: false })
        this.onTapLogout()
        fetchSessionId()
      })
  },
  onTapLogin(e) {
    const { iv, encryptedData } = e.detail
    if (!iv || !encryptedData) {
      console.error('用户拒绝授权登录')
      return
    }

    wx.showLoading({
      title: '努力加载中...'
    })
    return request({
      url: `/wll/account/getphone`,
      method: 'POST',
      data: {
        encryptedData,
        iv
      }
    })
      .then(res => {
        wx.hideLoading()
        console.log('res', res)
        if (res && res.phone) {
          userStore.fetchUserInfo()
            .then(() => {
              wx.navigateBack()
            })
        }
      })
      .catch(err => {
        wx.hideLoading()
        console.error(err)
      })
  }
})
