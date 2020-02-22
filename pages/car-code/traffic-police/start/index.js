//index.js
//获取应用实例
const { Anim, request, dayjs, wxp, config, userStore, configStore } = getApp()

Anim.Page({
  store: (store) => ({
    isLeader: store.user.userInfo.isLeader,
    isAuth: store.user.userInfo.isAuth,
    userInfo: store.user.userInfo,
    wllConfig: store.config.wllConfig
  }),
  computed: {
    
  },
  data: {
    showQR: false,
    gridPointId: ''
  },
  watch: {

  },

  /**
   * 展示程序码
   */
  handleTagShow() {
    this.setData({
      showQR: true
    })
  },

  /**
   * 展示程序码
   */
  handleHide() {
    this.setData({
      showQR: false
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
  },

  onLoad(options) {
    if (options.gridPointId != null) {
      this.setData({
        gridPointId: options.gridPointId
      })
    }
  },
  onPageScroll(e) {
  
  },
  doScanCode() {
    const vm = this;

    wx.scanCode({
      scanType:['qrCode'],
      success(res){
        let result = {};
        try {
          result = JSON.parse(res.result) || {};
        } catch(e) {}

        if (!result.key) {
          /* wx.showToast({
            title: '该二维码无法识别',
            icon: 'none',
            duration: 2000
          }) */
          vm.$router.navigateTo({
            path: `../code-page/index?msg=该二维码无法识别`
          })
        } else {
          wx.navigateTo({
            url: `/pages/car-code/traffic-police/car-check/index?registerId=${result.key}&uid=${result.Uid || ''}&gridPointId=${vm.data.gridPointId}`
          });
        }

      },
      fail(res) {
        if (res.errMsg.indexOf('cancel') === -1) {
          wx.showToast({
            title: '未识别到二维码',
            icon: 'none',
            duration: 2000
          })
        }
      },
      complete() {}
    });
  },
  onTapAccess(e) {
    let type = e.currentTarget.dataset.type;

    if (type === 'scan') {
      this.doScanCode();
    } else {
      wx.navigateTo({
        url: e.currentTarget.dataset.url
      })
    }
  }
})
