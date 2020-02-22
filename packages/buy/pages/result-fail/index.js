// pages/donate/msg/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

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