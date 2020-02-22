// pages/donate/msg/index.js
const { Anim, userStore, request, config, dayjs, configStore } = getApp();


Anim.Page({

  /**
   * 页面的初始数据
   */
  store(state) {
    return {
      // isAuth: state.user.userInfo.isAuth,
      // userInfo: state.user.userInfo,
      // sellOutTips: state.config.wllConfig.buy_flow_info.sellOutTips || "别着急，明晚8点可再次预约。我们一直在努力筹集口罩货源，尽最大努力护您周全"
      wllConfig: state.config.wllConfig
    }
  },

  data:{
    sellOutTips:''
  },

  onShow: function () {
    configStore.fetchWllConfig()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  /**
   * 返回首页
   */
  handlePrimaryTap() {
    wx.reLaunch({
      url: '/pages/index/index'
    })
  },
  /**
   * 继续登记
   */
  handleSecondTap() {
    wx.redirectTo({
      url: '/packages/buy/pages/notice/index'
    })
  },
  handleNav(e) {
    wx.redirectTo({
      url: '/packages/buy/pages/notice/index'
    })
  }
})