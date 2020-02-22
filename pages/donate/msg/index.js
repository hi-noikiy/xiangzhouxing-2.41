// pages/donate/msg/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msgTitle: '',
    msgStatus: '',
    msgDesc: ''
  },
  onLoad(opt) {
    // tag 为提交状态标识，1代表成功，2代表失败
    const { tag } = opt
    if (tag === undefined || tag === '1') {
      this.setData({
        msgTitle: '提交成功',
        msgStatus: 'success',
        msgDesc: '请等待通知'
      })
    } else if (tag === '2') {
      this.setData({
        msgTitle: '提交失败',
        msgStatus: 'warn',
        msgDesc: '请稍后再次尝试'
      })
    }
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
      url: '/pages/donate/form/index'
    })
  },
  handleNav(e) {
    console.log(e)
    const { index } = e.currentTarget.dataset
    if (index === '1') {
      // 跳转到捐赠要求
      wx.navigateBack({
        delta: 2
      })
    } else if (index === '2') {
      // 跳转到捐赠渠道
      wx.navigateBack({
        delta: 1
      })
    }
  }
})