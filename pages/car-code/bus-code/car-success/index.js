// pages/car-code/bus-code/passenger/commit/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checkPointRegisterId:"",
    identityNo:"",
    //接收判断是否是其他类型显示不同的东西
    vehicleTypeCode:'',
    isRail:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let vehicleTypeCode = options.vehicleTypeCode;
    let isRail = options.isRail;
    let id=options.id;
    let identityNo=options.identityNo;
    console.info(id)
    this.setData({vehicleTypeCode:vehicleTypeCode});
    this.setData({checkPointRegisterId:id});
    this.setData({isRail:isRail});
    this.setData({identityNo:identityNo});
  },

    /**
   * 查看通行码
   */
  handlePrimaryTap(){
    wx.navigateTo({
      url: '/pages/car-code/code-detail/index?id='+this.data.checkPointRegisterId+"&identityNo="+this.data.identityNo+'&vehicleTypeCode='+ this.data.vehicleTypeCode+'&isRail='+this.data.isRail,
    })
  },

    /**
   * 返回登记记录
   */
  handleSecondTap(){
    wx.navigateTo({
      url: '/pages/car-code/code-manage/index?activeKey=2',
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