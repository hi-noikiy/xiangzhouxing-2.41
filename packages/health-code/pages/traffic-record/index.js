// packages/health-code/pages/traffic-record/index.js
const { Anim, config, dayjs } = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    value: dayjs().format('YYYY-MM-DD'),
    start: '2020-01-21'
  },

  dateOptions: [
    {
      date: dayjs().add(1, 'day').format('YYYY-MM-DD'),
      disabled: true
    }
  ],
 
  handleChange(e) {
    this.setData({
      value: e.detail.value
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

  },

  
})