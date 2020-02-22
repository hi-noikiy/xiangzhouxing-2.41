const {Anim, request, utils, dayjs, config, wxp} = getApp()

Anim.Page({
  store: (store) => ({
    userInfo: store.user.userInfo
  }),
  data: {
    list: [
    ],
    bannerPath: config.cdnDomain + '/cloudsa3/wenzhen/images/banner.png',
  },
  onLoad() {
    this.fetchData()
  },
  fetchData() {
    wx.showLoading({
      title: '努力加载中...',
      mask: true
    })
    wxp.request({
      url: config.cdnDomain + config[config.env].wenzhenPath + '?t=' +
        Date.now(),
    })
      .then(res => {
        wx.hideLoading();
        const list = res.data.data;
        if (list && list.length) {
          this.setData({
            list,
          });
        }
      })
      .catch(err => {
        wx.hideLoading()
        wx.showToast({
          title: '当前人数较多，请稍后再试',
          icon: 'none',
        });
        console.error(err)
      })
  },
  onTapAccess(e) {
    console.log('onTapAccess', e)
    const that = this
    const { appId, path, label } = e.target.dataset.item
    if (appId) {
      wx.navigateToMiniProgram({
        appId,
        path,
        extraData: {
          fromTitle: '健康',
          fromAppId: 'wx2ac2313767a99df9'
        },
        envVersion: 'release',
        success(res) {
          wx.reportAnalytics('diagnosis_navigate', {
            title: label,
            appid: appId,
            path,
            phone: that.data.userInfo.phone || '',
            openid: wx.getStorageSync('wx-openid') || ''
          })
          console.log('打开小程序成功', res)
        }
      })
      return
    }

    wx.navigateTo({
      url: utils.urlJoinParams('/pages/web-view/index', {
        webUrl: encodeURIComponent(path),
        title: label
      })
    })
  }
})
