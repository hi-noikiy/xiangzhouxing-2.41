// packages/health-code/pages/inputcode/index.js
const reportHealth = require('../../services/health-code.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    code: '',
    gridPointId: '',
    uid: '',
    focus:true

  },
  bindinput(event) {
    this.data.code = event.detail.value
  },
  submuit() {
    console.log('submuit', this.data)
    if (!this.data.code) {
      wx.showToast({
        title: '请输入验证码',
        icon: 'none'
      })
      this.setData({ focus:true})
      return
    }
    wx.showLoading({
      title: '请稍候',
      icon: 'none'
    })
    reportHealth.verifyVerCode(this.data.code).then(res => {
      wx.hideLoading()
      let codeId = res.codeId
      if (codeId) {
        this.goKSYZ(codeId)
      } else {
        wx.showModal({
          title: '验证失败',
          content: res,
          showCancel: false,
          success: (res) => {
            this.setData({ focus: false })
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
            setTimeout(()=>{
              this.setData({ focus: true })
            },800)
          }
        })
      }
      console.log('res', res)
    }, error => {
      wx.hideLoading()
      wx.showToast({
        title: '请求失败' + error.errmsg,
        icon: 'none'
      })
    })
  },
  scanCode() {
    console.log('scanCode', this.data.gridPointId)
    if (this.data.gridPointId == '') {
      wx.showToast({
        title: '请先设置采集点',
        icon: 'none'
      })
      return
    }
    wx.scanCode({
      onlyFromCamera: false,
      scanType: ['qrCode'],
      success: (res) => {
        var codId = JSON.parse(res.result).codeId;
        console.log('qrCode', codId);
        if (codId) {
          this.goKSYZ(codId);
        } else {
          wx.showToast({
            title: '二维码无效',
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },
  clear() {
    this.setData({
      code: ''
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.gridPointId = options.gridPointId
    this.data.uid = options.uid
  },
  // 跳到快速验证页面
  goKSYZ(id) {
    wx.navigateTo({
      url: "/packages/health-code/pages/verification/index?codId=" + id + "&gridPointId=" + this.data.gridPointId
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