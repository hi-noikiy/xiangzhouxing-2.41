//index.js
//获取应用实例
const {
  Anim,
  request,
  dayjs,
  wxp,
  config,
  userStore
} = getApp()
const indexService = require('../../services/index')
const { navigateToWebview } = require('../../utils/util')
const reportHealth = require('../../services/health-code.js')

Anim.Page({
  store: (store) => ({
    isAuth: store.user.userInfo.isAuth,
    userInfo: store.user.userInfo
  }),
  data: {
    cityName: config.cityName,
    isShowBg: true,
    visible: false,
    value: config.cityName,
    residentCount: 0,
    communistCount: 0,
    floatingCount: 0,
    endTime: '',
    todayCount: 0,
    confirm: 0,
    suspect: 0,
    cure: 0,
    dead: 0,
    lineVisible: false,
    singleLine: {
      xAxis: {
        data: [],
      },
      series: [{
        name: '确诊人数',
        data: [],
        label: {
          normal: {
            show: true,
          },
        },
      }, ],
    },
    epidemicData: {
      confirm: 0,
      suspect: 0,
      dead: 0,
      heal: 0,
      lastUpdateTime: '',
    },
    statusBarHeight: wx.getSystemInfoSync()['statusBarHeight'],
  },
  navigateToWebview(e) {
    return;
    console.log('e', e)
    const { url } = e.currentTarget.dataset
    navigateToWebview(url)
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {},
  
  onLoad(options) {
    indexService.fetchOverviewData().then(resp => {
      const data = JSON.parse(resp.data.data);
      data.lastUpdateTime = data.lastUpdateTime.replace(/-/g, '/')
      this.setData({
        epidemicData: data
      })
    }).catch(e => {
      console.log('e', e);
      wx.showToast({
        title: '疫情数据请求失败，请稍后再试',
        icon:'none'
      })   
    })
    userStore.fetchUserInfo()
  },
  onPageScroll(e) {
    console.log('e', e)
    let isShowBg = parseInt(e.scrollTop) < 80
    this.setData({
      isShowBg
    });
  },
  onTapAccess(e) {
    if (userStore.checkAuth()) {
      if (e.currentTarget.dataset.real) {
        reportHealth.realnameUser(this.data.userInfo.uid).then((data)=>{
            // 未实名
            if(data.isAut == 0){
              wx.showModal({
                title: '未实名',
                content: '是否需要实名认证？',
                confirmColor: '#1890ff',
                success: function (res) {
                  if (!res.cancel) {
                    //点击取消,默认隐藏弹框
                    wx.navigateTo({
                      url: "/packages/health-code/pages/realname-submit/index?path=" + e.currentTarget.dataset.url
                    })
                  }
                }
              })
            } else{
              wx.navigateTo({
                url: e.currentTarget.dataset.url
              })
            }
        })
      }else{
          wx.navigateTo({
           url: e.currentTarget.dataset.url
         })
      }
    }
  },
  toMiniProgramSuccess() {
    console.log('success');
  },
  toMiniProgramFail(e) {
    console.error('跳转小程序失败', e)
  }
})
