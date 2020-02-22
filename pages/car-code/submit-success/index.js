// pages/car-code/submit-success/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    driverType: "",
    urlParams: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      urlParams: options ? options : {}
    })
    if (options.driverType) {
      if (options.driverType == 'daba') {
        this.setData({
          driverType: 'daba'
        })
      }

    }
  },

  /**
 * 查看通行码
 */
  handlePrimaryTap() {
    if (this.data.driverType == 'daba') {
      wx.navigateTo({
        url: `../bus-code/driver/daba-code-detail/index?id=${this.data.urlParams.id}&uid=${this.data.urlParams.uid}`,
      })
    } else {
      wx.navigateTo({
        url: '../code-detail/index',
      })
    }
  },

  /**
   *  跳转页面
   */
  handleSecondTap(e) {
    wx.navigateTo({
      url: '../code-manage/index?activeKey=2'
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
