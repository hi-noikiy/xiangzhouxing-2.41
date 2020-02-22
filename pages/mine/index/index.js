const { Anim, userStore, request, config, configStore, wxp } = getApp();
const reportHealth = require('../../../services/health-code.js');
const session = require('../../../utils/session')
const feedbackService = require('../../../services/feedback')

Anim.Page({
  store(state) {
    return {
      isAuth: state.user.userInfo.isAuth,
      userInfo: state.user.userInfo,
      wllConfig: state.config.wllConfig
    }
  },
  computed: {
    role() {
      return (this.data.userInfo.role || []).some(item => item == 'GRID_MANAGER' || item == 'GRID_USER')
    }
  },
  data: {
    needCheckSession: false,
    cityName: config.cityName,
    authTitle: '请先登录账号',
    authDesc: '',
    authBtnText: '登录',
    isRealName: false
  },
  onLoad(options) {
    this.checkWxSession()
  },
  // 判断微信的 sessionKey 是否过期，用于解密手机号
  checkWxSession() {
    this.setData({ needCheckSession: true })
    wxp.checkSession()
      .then(() => {
        console.log('当前的 sessionKey 未过期')
        this.setData({ needCheckSession: false })
      })
      .catch(e => {
        console.log('当前的 sessionKey 已过期')
        this.setData({ needCheckSession: false })
        this.onTapLogout()
      })
  },
  onTapNavigateTo(options) {
    if (options.currentTarget.dataset.path) {
      wx.navigateTo({
        url: options.currentTarget.dataset.path
      });
    }
  },
  onShow: function () {
    configStore.fetchWllConfig();
    this.realnameUser();
  },
  // 跳转到工作台
  onJump: function (e) {
    wx.navigateTo({
      url: "/packages/health-code/pages/new-workbench/new-workbench",
    })
  },
  //跳转交警工作台
  toKKGZT:function(e){
    debugger;
    wx.navigateTo({
      url: "/pages/workbench/index",
    })
  },
  onTapBook() {
    let personal_center_info = this.data.wllConfig.personal_center_info || {};
    if (personal_center_info && personal_center_info.is_open === 1) {
      wx.navigateTo({
        url: '/packages/buy/pages/reservation-list/index',
      });
    }
    else {
      wx.showModal({
        title: '温馨提示',
        content: personal_center_info.tips || '系统异常，请稍后再试',
        showCancel: false,
      });
    }
  },
  onTapFeedback () {
    // type=1是口罩 type=0穗康
    feedbackService.goFeedback(0, this.data.userInfo.uid);
  },
  onTapLogin(e) {
    this.data.isRealName = false
    const { iv, encryptedData } = e.detail
    if (!iv || !encryptedData) {
      console.error('用户拒绝授权登录')
      wx.showToast({ title: '取消授权', icon: 'none' })
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
        }
        setTimeout(() => {
          this.realnameUser()
        }, 300)
      })
      .catch(err => {
        wx.hideLoading()
        console.error(err)
      })
  },
  onTapLogout() {
    this.data.isRealName = false;
    wx.showLoading({
      title: '努力加载中..',
      mask: true
    })
    return request({
      url: '/wll/account/logout',
      method: 'POST'
    })
      .then(() => {
        wx.hideLoading()
        wx.removeStorageSync('wx-sessionid')
        userStore.initUserInfo()
        console.log('我的退出成功了')
        session.fetchSessionId()
      })
      .catch(() => {
        wx.hideLoading()
        wx.removeStorageSync('wx-sessionid')
        userStore.initUserInfo()
        console.log('我的退出成功了')
        session.fetchSessionId()

      })
  },
  lifeCycleMethod() { },
  realnameUser() {
    //  console.log('realnameUser', this.data.isRealName)
    if (this.data.isRealName) return
    let uid = this.data.userInfo.uid;

    console.log('realnameUser', uid)
    if (!uid) return
    reportHealth.realnameUser(uid).then((res) => {

      this.data.isRealName = (res.isAut == 1 || res.isAut == 2)
      if (res.isAut == 3) {
        // wx.showModal({
        //   title: '认证信息已过期',
        //   content: '请重新进行认证',
        //   showCancel: false,
        //   success() {
        //     wx.navigateTo({
        //       url: '/packages/health-code/pages/realname-submit/index',
        //     })

        //   }
        // })
      }

      console.log('isRealName', res.isAut)
      this.setData({ 'isRealName': this.data.isRealName })
    }, error => {

    })
  },
})
