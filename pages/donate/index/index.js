// pages/donate/index.js
Page({
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  handlePrimaryTap() {
    wx.navigateTo({
      url: '/pages/donate/contact/index',
    })
  }
})