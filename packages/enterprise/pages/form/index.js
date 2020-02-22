// pages/enterprise/form/index.js
Page({
  data: {
    webUrl: ''
  },

  onLoad(options) {
    const openid = wx.getStorageSync('wx-openid')
    const timestamp = new Date().getTime()
    // this.setData({
    //   webUrl: `https://qyfg.tgovcloud.com/qysp/vp/module/form.html?agentCode=form&corp_id=wwf9995c4c4f6e0a0e#/open/add?id=form19b9532200bc49acb6c593bb74517d3b&openId=${openid}&h5Page=true&timestamp=${timestamp}`
    // })
    this.setData({
        webUrl: `https://qykg.zcloud.ac.cn/m`
    })
  }
})
