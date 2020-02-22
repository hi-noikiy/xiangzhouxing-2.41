const {
  Anim,
  userStore,
  config
} = getApp();
const reportHealth = require('../../services/health-code.js');
Anim.Page({
  store: (store) => ({
    userInfo: store.user.userInfo
  }),
  /**
   * 页面的初始数据
   */
  data: {
    userId: '',
    userName: '--',
    identityType: '1',
    identity: '--',
    phone: '--',
    showBtn: false,
    cardTypeRange: [{
        name: '身份证',
        value: 1
      },
      {
        name: '护照',
        value: 3
      },
      {
        name: '军官证',
        value: 4
      },
      {
        name: '港澳居民来往内地通行证',
        value: 8
      },
      {
        name: '台湾居民来往内地通行证',
        value: 9
      },
      {
        name: '外国人永久居留身份证',
        value: 10
      },
      {
        name: '港澳居民居住证',
        value: 6
      },
      {
        name: '台湾居民居住证',
        value: 7
      },
      {
        name: '出入境通行证',
        value: 11
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  //初始化方法
  init() {
    this.data.userId = this.data.userInfo.uid
    console.log('userId', this.data.userId)
    wx.showLoading({
      title: '请稍候',
    })

    reportHealth.realnameUser(this.data.userId).then((res) => {
      wx.hideLoading();
      if (res.realnameAut) {
        if (res.realnameAut.isAut == 3) {
          // wx.showModal({
          //   title: '认证信息已过期',
          //   content: '请重新进行认证',
          //   showCancel: false,
          //   success() {
          //     wx.redirectTo({
          //       url: '/packages/health-code/pages/realname-submit/index',
          //     })

          //   }
          // })
        }
        this.setData({
          userName: res.realnameAut.name,
          identityType: this.whichType(res.realnameAut.identityType),
          identity: (res.realnameAut.identity+"").replace("***********","*") ,
          phone: res.realnameAut.phone,
          showBtn: res.realnameAut.identityType == 1 ? false : res.isAut != 2
        })
      } else {
        wx.showToast({
          title: '暂时无法获取您的信息',
          icon: 'none'
        })
      }
    }, error => {
      wx.hideLoading();
      console.log('eror', eror)
      wx.showModal({
        title: '获取失败',
        content: eror.errmsg,
        showCancel: false
      })
    })
  },
  clickBtn() {
    wx.navigateTo({
      url: "/packages/health-code/pages/realname-change/index?userId=" + this.data.userId
    })

  },
  //根據不同的證件類型value值，顯示對應類型
  whichType(type) {
    this.data.cardTypeRange.map(item => {
      if (item.value == type) {
        this.setData({
          cardType: item.name
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.init();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})