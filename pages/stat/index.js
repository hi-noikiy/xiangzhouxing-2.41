//index.js
//获取应用实例
const {
  Anim,
  request,
  dayjs,
  wxp,
  config,
  userStore,
  configStore,
  Event
} = getApp()
const regionService = require('../../services/region')
const reportHealth = require('../../services/health-code.js')
const regionIndex = config.regionLevel.length
const reportService = require('../../services/report')



let isLoadingAffairStat = false

// 修正区划为12位
function prefixInteger(num, length) {
  return (num + Array(length).join('0')).slice(0, length);
}


const defaultRegion = {
  title: config.regionLevel[0].title,
  data: [{
      name: config.cityName,
      regionCode: prefixInteger(config.regionCode, 12)
    }

  ]
}
Anim.Page({
  store: (store) => ({
    isLeader: store.user.userInfo.isLeader,
    isAuth: store.user.userInfo.isAuth,
    userInfo: store.user.userInfo,
    wllConfig: store.config.wllConfig
  }),
  computed: {
    // computedName () {
    //   return this.data.userInfo.name + '--computed'
    // }
  },
  data: {
 
    cityName: config.cityName,
    isShowBg: true,
    visible: false,
    value: config.cityName,
    regionCode: prefixInteger(config.regionCode, 12),
    regionRange: [defaultRegion],
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
  },
  handleRegionChange(e) {
    const value = e.detail.value
    console.log("region+++++++++", value)
    if (value && value.length > 0) {
      const {
        regionCode
      } = value[value.length - 1]
      this.setData({
        regionValue: value,
        value: value[value.length - 1].regionName || value[value.length - 1].name,
        regionCode
      })
      this.getAffairStat(prefixInteger(regionCode, 12))
    }
  },

  handleRegionColumnChange(e) {
    const {
      item,
      index
    } = e.detail

    if (index === regionIndex - 1) {
      this.handleRegionClose()
    } else {
      this.getRegionData(item, index + 1)
    }
  },
  handleOpenRegion() {
    this.setData({
      visible: true,
      regionRange: this.data.regionRange.slice(0, 1)
    })
  },
  handleRegionClose(e) {
    this.setData({
      visible: false
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {},
  // getRegionData
  getChildrenRegionData(region = {}, index = 0) {
    wx.showLoading()
    regionService.getRegionData(region.regionCode, region.regionList).then(regionList => {
      const regionRange = this.data.regionRange.slice(0, index)
      regionRange[index] = {
        title: config.regionLevel[index].title,
        data: regionList.map(item => ({
          name: item.regionName,
          value: {
            regionName: item.regionName,
            regionCode: item.regionCode
          },
          regionList: item.regionList
        }))
      }

      this.setData({
        regionRange
      }, () => wx.hideLoading())
    }).catch(e => wx.hideLoading())
  },
  getAffairStat(regionCode) {
    wx.showLoading()
    const that = this;
    if (isLoadingAffairStat) {
      return
    }

    isLoadingAffairStat = true
    request({
      url: '/usercenter/affairStat/detail',
      method: 'GET',
      data: {
        regionCode,
      }
    }).then(data => {
      wx.hideLoading()
      isLoadingAffairStat = false
      const {
        itemList
      } = data
      const confirmList = itemList && itemList.map(item => item.confirmCaseNum)
      const timeList = itemList && itemList.map(item => dayjs(item.statTime).format('YYYY/MM/DD'))
      const endTime = data.statTime ? dayjs(data.statTime).format('YYYY/MM/DD') : dayjs(new Date().getTime()).format('YYYY/MM/DD')
      that.setData({
        residentCount: data.peopleNum || 0,
        communistCount: data.partyNum || 0,
        floatingCount: data.flowNum || 0,
        endTime,
        todayCount: data.newCaseNum || 0,
        confirm: data.confirmCaseNum || 0,
        suspect: data.suspectedCaseNum || 0,
        cure: data.cureCaseNum || 0,
        dead: data.outCaseNum || 0,
        lineVisible: itemList && itemList.length,
        ['singleLine.xAxis.data']: timeList || [],
        [`singleLine.series[${0}].data`]: confirmList || [],
      })
    });
  },
  watch: {
    isLeader(newValue) {
      if (newValue && !this.data.lineVisible) {
        this.getAffairStat(this.data.regionCode)
      }
    }
  },
  onLoad(options) {
    if (Object.keys(this.data.wllConfig).length > 0) {
      this.openTipsModal(this.data.wllConfig);
    } else {
      configStore.fetchWllConfig()
        .then((wllConfig) => {
          if (wllConfig && wllConfig.home_notice &&
            wllConfig.home_notice.is_open) {
            this.openTipsModal(wllConfig);
          }
        });
    }
  },
  onPageScroll(e) {
    let isShowBg = parseInt(e.scrollTop) < 80
    this.setData({
      isShowBg
    });
  },
  openTipsModal(wllConfig) {
    const homeNotice = wllConfig.home_notice || this.data.wllConfig.home_notice

    wx.showModal({
      showCancel: false,
      confirmText: '知道了',
      title: homeNotice.title || '重要通知',
      content: homeNotice.text
    })
  },
  onTapAccess(e) {
    if (userStore.checkAuth()) {
      if (e.currentTarget.dataset.real) {
        reportHealth.realnameUser(this.data.userInfo.uid).then((data) => {
          // 未实名
          if (data.isAut == 0) {
            wx.showModal({
              title: '未实名',
              content: '是否需要实名认证？',
              confirmColor: '#1890ff',
              success: function(res) {
                if (!res.cancel) {
                  //点击取消,默认隐藏弹框
                  wx.navigateTo({
                    url: "/packages/health-code/pages/realname-submit/index?path=" + e.currentTarget.dataset.url
                  })
                }
              }
            })
          } else {
            wx.navigateTo({
              url: e.currentTarget.dataset.url
            })
          }
        })
      } else {
        wx.navigateTo({
          url: e.currentTarget.dataset.url
        })
      }

      // wx.navigateTo({
      //   url: e.currentTarget.dataset.url
      // })

    }
  }
})