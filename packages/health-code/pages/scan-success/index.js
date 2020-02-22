// packages/health-code/pages/scan-success/index.js
// const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    activeKey: "1",
    curSelectedBtn: "1",
    expandItems: {

    },
    formData: {
      healStatu: "",
      transStatu: "",
      remark: "",
      temperature: ""
    },
    temperatureNums: {
      num1: "",
      num2: "",
      num3: ""
    },
    userSymptoms: [{
      name: "发热"
    }, {
      name: "咳嗽"
    }, {
      name: "乏力"
    }],
    lastModifyTime: "2012-12-21 12:12:12",
    temperatureRanges: [{
      name: '正常37.3°C（不含）以下',
      value: '1'
    }, {
      name: '低热37.3°C-37.9°C（含）',
      value: '2'
    }, {
      name: '低热38°C-38.9°C（含）',
      value: '3'
    }, {
      name: '高热39°C以上',
      value: '4'
    }],
    checkItems: [{
        name: '打喷嚏',
        value: 'dpt'
      },
      {
        name: '干咳',
        value: 'gk'
      },
      {
        name: '乏力',
        value: 'fl'
      }
    ],
    transStatus: [{
        name: '外出',
        value: 'wc'
      },
      {
        name: '入内',
        value: 'rn'
      },
      {
        name: '途经',
        value: 'tj'
      }
    ],
    userInfo: {},
    hasUserInfo: false,
    historyRecords: [{
        id: "1",
        dateTime: "2020-02-03 10:30",
        temperature: "36.5°C",
        addr: "富力千禧小区",
        statu: "外出",
        userSymptoms: "干咳,乏力,其他症状111",
        otherSymptom: "一直咳嗽,打喷嚏",
        remark: "这个人很烦"
      },
      {
        id: "2",
        dateTime: "2020-02-04 10:30",
        temperature: "36.5°C",
        addr: "富力千禧小区",
        statu: "外出",
        userSymptoms: "干咳,乏力",
        remark: "这个人很烦"
      },
      {
        id: "3",
        dateTime: "2020-02-05 10:30",
        temperature: "37.5°C",
        addr: "富力千禧小区",
        statu: "外出",
        userSymptoms: "干咳,乏力,其他症状333",
        otherSymptom: "一直咳嗽,打喷嚏",
        remark: "这个人很烦"
      }
    ]
  },

  handleTabChange(e) {
    this.setData({
      activeKey: e.detail.value.key
    })
  },

  handleChange(e) {
    this.setData({
      [`formData.${e.target.id}`]: e.detail.value
    })
  },

  handleBtnTap(e) {
    this.setData({
      curSelectedBtn: e.target.dataset.value
    })
  },

  handleTemperChange(e) {
    this.setData({
      [`temperatureNums.${e.target.id}`]: e.detail.value
    })
    let temperatureNums = this.data.temperatureNums
    let {
      num1,
      num2,
      num3
    } = temperatureNums
    num1 = parseInt(num1);
    num2 = parseInt(num2);
    num3 = parseInt(num3);
    if (!isNaN(num1) && !isNaN(num2) && !isNaN(num3)) {
      num1 = num1 * 10;
      num2 = num2;
      num3 = num3 * 0.1;
      this.setData({
        [`formData.temperature`]: num1 + num2 + num3
      })
    }
  },

  handleToggleTap(e) {
    this.setData({
      [`expandItems.${e.currentTarget.dataset.item.id}`]: !this.data.expandItems[e.currentTarget.dataset.item.id]
    })
  },

  handleSubmitClick() {
    if (this.data.curSelectedBtn != "1" && !this.data.formData.temperature) {
      wx.showModal({
        title: '温馨提示',
        content: '当体温不正常时，请填写体温',
        showCancel: false,
        confirmText: '去填写',
        success() {
          // wx.navigateTo({
          //   url: '/pages/mine/login/index',
          // })
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})