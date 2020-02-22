// pages/enterprise/list/index.js
Page({
  data: {
    webUrl: ''
  },

  onLoad(options) {
    const openid = wx.getStorageSync('wx-openid')
    const timestamp = new Date().getTime()
    // this.setData({
    //   webUrl: `https://qyfg.tgovcloud.com/qysp/vp/module/form.html?agentCode=form&corp_id=wwf9995c4c4f6e0a0e#/open/mine?definitionVersionsId=form19b9532200bc49acb6c593bb74517d3b&openId=${openid}&timestamp=${timestamp}`
    // })
    this.setData({
        webUrl: `https://qykg.zcloud.ac.cn/m`
    })

  }
})