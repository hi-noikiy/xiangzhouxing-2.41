// packages/health-code/pages/workbench/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    gridMenu:[
      { title: '采集监控点管理', id: 0, url: '/packages/health-code/pages/collection-point/index' },
      // { title: '普查登记', id: 1, url: '/packages/health-code/pages/collection-point/index' },
      // { title: '惠康码验证', id: 2, url: '/packages/health-code/pages/collection-point/index' },
      // { title: '功能123', id: 3, url: '/packages/health-code/pages/collection-point/index' },
      // { title: '功能123', id: 4, url: '/packages/health-code/pages/collection-point/index' },
      // { title: '功能123', id: 5, url: '/packages/health-code/pages/collection-point/index' },
      // { title: '功能123', id: 6, url: '/packages/health-code/pages/collection-point/index' },
      // { title: '功能123', id: 7, url: '/packages/health-code/pages/collection-point/index' },
      // { title: '功能123', id: 8, url: '/packages/health-code/pages/collection-point/index' } 
    ]
  },

  onJunp: function(e) {
    const { url } = e.currentTarget.dataset;
    wx.navigateTo({ url });
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
  // 跳到普查登记页面
  goPCDJ: function (e) {
    console.log("eeee");
  },
  // 跳到快速验证页面
  goKSYZ: function (e) {
    wx.navigateTo({
      url: "/packages/health-code/pages/verification/index"
    })
  }
})