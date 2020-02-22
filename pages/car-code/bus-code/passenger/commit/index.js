// pages/car-code/bus-code/passenger/commit/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checkPointRegisterId:"",
    identityNo:"",
    qrcId:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id=options.id;
    let identityNo=options.identityNo;
    let qrcId=options.qrcId;
    console.info(id)
    this.setData({checkPointRegisterId:id});
    this.setData({identityNo:identityNo});
    this.setData({qrcId:qrcId});
  },

    /**
   * 查看通行码
   */
  handlePrimaryTap(){
    wx.navigateTo({
      url: '../detail/index?id='+this.data.checkPointRegisterId+"&identityNo="+this.data.identityNo+"&qrcId="+this.data.qrcId,
    })
  },

    /**
   * 返回登记记录
   */
  handleSecondTap(){
    wx.navigateTo({
      url: '/pages/car-code/code-manage/index?activeKey=2&typeCode='+2,
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