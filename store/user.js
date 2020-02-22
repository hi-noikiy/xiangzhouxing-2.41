module.exports = (app) => {
  const { Anim, request, config, Event } = app
  const {
    observe
  } = Anim.wedux
  const { domain, appid } = config

  class User {
    constructor() {
      this.initUserInfo()
    }

    initUserInfo() {
      this.userInfo = {
        isAuth: false,
        phone: '',
        role: [],
        isLeader: false,
        address: '',
        name: '',
        uid: ''
      }
    }

    fetchUserInfo() {
      wx.showLoading({
        title: '努力加载中...',
        mask: true
      })
      return request({
        url: '/wll/account/getloginuserinfo'
      })
        .then(res => {
          wx.hideLoading()
          console.log('res', res)
          this.userInfo = {
            ...res,
            isAuth: !!res.phone,
            isLeader: res.role && res.role.includes('LEADER'),
            isVolunteer: res.role && res.role.includes('ZHIYUAN'),
          }
          
          // 用户更新事件
          Event.dispatch('fetchUserInfo', this.userInfo)

          return this.userInfo
        })
        .catch(err => {
          wx.hideLoading()
          console.error(err)
        })
    }

    updateUserInfo(userInfo) {
      this.userInfo = userInfo
    }

    login() {
      console.log('login')
    }

    checkAuth() {
      if(!this.userInfo.isAuth) {
        wx.showModal({
          title: '温馨提示',
          content: '请先进行登录',
          showCancel: false,
          confirmText: '去登录',
          success() {
            wx.navigateTo({
              url: '/pages/mine/login/index',
            })
          }
        })
        return false
      }

      return true
    }
  }

  const userStore = new User()
  return observe(userStore, 'user')
}
