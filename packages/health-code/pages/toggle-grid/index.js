// packages/health-code/pages/toggle-grid/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    items: [
      { value: 'USA', name: '美国' },
      { value: 'CHN', name: '中国', checked: 'true' },
      { value: 'BRA', name: '巴西' },
      { value: 'JPN', name: '日本' },
      { value: 'ENG', name: '英国' },
      { value: 'FRA', name: '法国' },
      { value: 'USA1', name: '美国1' },
      { value: 'CHN1', name: '中国1' },
      { value: 'BRA1', name: '巴西1' },
      { value: 'JPN1', name: '日本1' },
      { value: 'ENG1', name: '英国1' },
      { value: 'FRA1', name: '法国1' },
      { value: 'USA2', name: '美国2' },
      { value: 'CHN2', name: '中国2' },
      { value: 'BRA2', name: '巴西2' },
      { value: 'JPN2', name: '日本2' },
      { value: 'ENG2', name: '英国2' },
      { value: 'FRA2', name: '法国2' },
     
    ]
  },

  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
  },
  
  onSrollBottom: function() {
    const { page, items } = this.data;
    wx.nextTick(()=>{
      this.setData({
        page: page + 1,
        items: items.concat({ name: 'value' + 1, value: 'value' + 1 })
      })

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
  onReachBottom: function() {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})