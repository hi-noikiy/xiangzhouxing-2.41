const initUserStore = require('./store/user')
const initMineStore = require('./store/mine')
const initConfigStore = require('./store/config')
const Anim = require('./components/gsd-lib/anim/anim.min')
const Event = require('./components/gsd-lib/event/index')
const config = require('./config/index')
const wxp = require('./utils/wx-promise')
const Map = require('./components/gsd-lib/map/index');
// const CryptoJS = require('./components/gsd-lib/crypto/index');
const dayjs = require('./components/gsd-lib/dayjs/index');
const utils = require('./components/gsd-lib/utils/index');
const Storage = require('./components/gsd-lib/storage/index');
const { request } = require('./utils/request')

App({
  onLaunch() {
    this.systemInfo = wx.getSystemInfoSync()
    this.utils = utils
    this.request = request
    this.config = config
    this.dayjs = dayjs
    this.storage = Storage
    // wxp 挂载
    this.wxp = wxp
    // Anim 挂载
    this.Anim = Anim
    // Event
    this.Event = Event
    this.Map = Map
    // store 挂载
    // 挂载重置 tab 的事件
    this.resetTab = () => Event.dispatch('g-tabs__resetStyle')
    this.userStore = initUserStore(this)
    this.configStore = initConfigStore(this)
    this.configStore.fetchWllConfig();
    this.userStore.fetchUserInfo()
      .then(() => {
        const options = wx.getLaunchOptionsSync()
        console.log('options', options)
        if (['pages/index/index', 'pages/stat/index', 'pages/buy/notice/index', 'pages/mine/index/index'].includes(options.path)) {
          return
        }
        this.userStore.checkAuth()
      })
    this.mineStore = initMineStore(this)

    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(function (res) {
      console.log('updateManager.onCheckForUpdate 请求完新版本信息', res)
    })
    updateManager.onUpdateReady(function () {
      console.log('updateManager.onUpdateReady 新版本已准备好')
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，请重启应用',
        showCancel: false,
        success: function () {
          // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
          updateManager.applyUpdate()
        }
      })
    })

    // 清掉数据缓存
    wx.removeStorageSync('selfForm__data')
  },
  onShow(options){
   console.log(options)
  },
})
