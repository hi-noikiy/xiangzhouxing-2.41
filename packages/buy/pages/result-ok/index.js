// pages/donate/msg/index.js
const {
  Anim,config
} = getApp();
const { getBuyFlowInfo } = require('../../utils/util');

Anim.Page({
  store(state) {
    return {
      wllConfig: state.config.wllConfig
    }
  },
  computed: {
    buyType () {
      return this.data.wllConfig.buy_type;
    },
    buyFlowInfo () {
      return getBuyFlowInfo(this.data.wllConfig);
    },
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
  handleNav(e) {
    wx.redirectTo({
      url: '/packages/buy/pages/notice/index'
    })
  }
})
