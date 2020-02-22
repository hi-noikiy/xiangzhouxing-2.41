// pages/car-code/bus-code/passenger/fllow/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    formData: {
      checkboxA: ['1']
    },
    checkItems: [
      { name: '张三', value: '1' },
      { name: '李四', value: '2' },
      { name: '王五', value: '3'},
    ]
  },
  handleChange(e) {
    this.setData({
      [`formData.${e.target.id}`]: e.detail.value
    })
  },
  //返回登记页
  handleFormSubmit(e){
    wx.navigateBack({
      url: '/pages/car-code/bus-code/passenger/edit/index',
    })
  },
  //扫码录入
  scanQrcode(){
    wx.scanCode({
      success (res) {
        console.log(res)
      }
    })
  },
  //为他人录入
  addOtherHealth(){
    wx.navigateTo({
      url: '/pages/report/index/index?type=2',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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