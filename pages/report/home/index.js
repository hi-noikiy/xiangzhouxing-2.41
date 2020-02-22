// pages/report/index.js
const { Anim, userStore } = getApp()
const reportService = require('../../../services/report')



Anim.Page({
  store: (store) => ({
    userInfo: store.user.userInfo
  }),

  data: {
    visible: true,
    toUrl: '',
    isReported: wx.getStorageSync('selfForm__submit'),
    imgUrls: ["https://imgcache.gzonline.gov.cn/cos/shangbao_dbc3d59b.png"]
  },

  watch: {

  },

  onLoad (options) {

  },
  checkSelfReport(url = ''){
    var self = this;

    if(url.indexOf("type=1") > -1){
        wx.navigateTo({
          url: url
        })

        return;
    }

    reportService.hasReported().then((isReported) => {
      if(isReported){
          wx.navigateTo({
            url: url
          })
      }else{
        wx.showModal({
          title: '温馨提示',
          content: '为他人上报健康情况前，请先为自己上报健康情况',
          confirmText: '知道了',
          showCancel: false
        })
      }
    }).catch(() => {
        wx.hideLoading()
        wx.showToast({
          title: '服务器拥挤，请稍后再试',
          icon: 'none'
        })
    })
    // if(wx.getStorageSync('selfForm__submit') || url.indexOf("type=1") > -1){
    //   wx.navigateTo({
    //     url: url
    //   })
    //   return;
    // }


  },
  onTapAccess (e) {
    if (userStore.checkAuth()) {
      this.checkSelfReport(e.currentTarget.dataset.url);
    }
  }
})
