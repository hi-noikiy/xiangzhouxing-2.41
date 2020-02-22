// packages/health-code/pages/verification/index.js
const {
  Event
} = getApp()
const reportHealth = require('../../services/health-code.js');
Page({
  /**
   * 页面的初始数据
   * 
   * 
   */
  data: {
    codeId: '',
    address: '',
    cxState: -1,
    remark: '',
    gridPointId: '',
    username: '',
    lastTime: '',
    lastStatus: 0,
    activeKey: "1",
    wxAvatar: '/images/addperson/userHead.png',
    tiwenInde: -1,
    checkItems: [{
      name: '正常37.3°C(不含)以下',
      value: 0
    }, {
      name: '低热37.3°C-37.9°C(含)',
      value: 1
    }, {
      name: '中热38°C-38.9°C(含)',
      value: 2
    }, {
      name: '高烧39°C以上',
      value: 3
    }],
    focus: false,
    formData: {
      // 温度状态
      temperature: '',
      // 出行状态
      state: ''
    },
    // 具体温度
    temperatureNums: {
      num1: '',
      num2: '',
      num3: ''
    },
    status: [{
      icon: 'icon-heat@2x.png',
      active: 'icon-heat-hot@2x.png',
      text: '发热'
    },
    {
      icon: 'icon-cough@2x.png',
      active: 'icon-cough-hot@2x.png',
      text: '咳嗽'
    },
    {
      icon: 'icon-fatigue@2x.png',
      active: 'icon-fatigue-hot@2x.png',
      text: '乏力'
    },
    {
      icon: 'icon-normal@2x.png',
      active: 'icon-normal-hot@2x.png',
      text: '无症状'
    }
    ],
    // 外出状态
    trip: [{
      name: '外出',
      value: 1
    }, {
      name: '入内',
      value: 2
    }, {
      name: '途经',
      value: 3
    }],
    tripSelect: 0,
    state: [{
      name: '发热',
      active: false,
      value: 1
    }, {
      name: '干咳',
      value: 2
    }, {
      name: '乏力',
      value: 3
    }, {
      name: '呼吸不畅',
      value: 4
    }, {
      name: '腹泻',
      value: 5
    }, {
      name: '流鼻涕',
      value: 6
    }],
    list: []
  },

  // tab切换
  tabChange(e) {
    this.setData({
      activeKey: e.detail.value.key
    })
    if (this.data.activeKey == 2) {
      this.passRegisterList()
    }
  },
  getLastUserStatus() {
    wx.showLoading({
      title: '请稍候',
    })
    let number = 0;
    reportHealth.infoByCodeId(this.data.codeId).then((result) => {
      wx.hideLoading();
      this.data.lastTime = result.reportTime;

      let symptom = result.reportSymptom.split(',')
      // console.log('m', symptom);
      if (symptom && symptom.length > 0) {
        for (let i = 0; i < symptom.length; i++) {
          switch (symptom[i] + "") {
            case "2":
            case "11":
            case "12":
              number++;
              this.data.status[0].icon = this.data.status[0].active
              break
            case "3":
            case "13":
              number++;
              this.data.status[1].icon = this.data.status[1].active
              break
            case "4":
            case "14":
              number++;
              this.data.status[2].icon = this.data.status[2].active
              break
          }
        }

      }
      //无症状
      if (number == 0) {
        this.data.status[3].icon = this.data.status[3].active
      }

      if (result.clueType == 0) {
        //本人获取头像
        reportHealth.getUserInfo(result.uid).then((result2) => {
          console.log('wxAvatar', result2.wxAvatar)
          if (!result2.wxAvatar) {
            result2.wxAvatar = '/images/addperson/userHead.png'
          }
          this.setData({
            wxAvatar: result2.wxAvatar
          })

        })


      }
      if (result.username) {
        if (result.username.length > 2) {
          result.username = result.username[0] + "*" + result.username[result.username.length - 1]
        } else if (result.username.length > 1) {
          result.username = result.username[0] + "*"
        }
      }
      this.data.username = result.username

      this.setData({
        status: this.data.status,
        username: this.data.username
      })
      this.setData({
        lastTime: this.js_date_time(this.data.lastTime)
      })

    }, error => {
      wx.hideLoading();
      wx.showToast({
        title: '用户最新上报信息获取失败' + error.errmsg,
        icon: 'none'
      })

    })
  },

  js_date_time(time) {
    let dateTime = new Date(time)
    let year = dateTime.getFullYear();
    let month = dateTime.getMonth() + 1;
    let day = dateTime.getDate();
    let hour = dateTime.getHours();
    let minute = dateTime.getMinutes();
    let second = dateTime.getSeconds();
    let now = new Date();
    let now_new = Date.parse(now.toDateString()); //typescript转换写法
    let milliseconds = now_new - dateTime;
    let timeSpanStr = year + '/' + month + '/' + day + ' ' + hour + ':' + minute + ':' + second;
    return timeSpanStr;
  },
  changRemark(e) {
    this.data.remark = e.detail.value;
  },
  handleFormSubmit(e) {
    let data = {
      "gridPointId": "",
      "otherSymptom": "",

      "qrcId": '',
      "remark": this.data.remark,
      "state": 0,
      "symptom": "",
      "temperature": ""
    }
    data.gridPointId = this.data.gridPointId
    data.qrcId = this.data.codeId
    console.log('D', this.data)
    for (let i = 0; i < this.data.state.length; i++) {
      let item = this.data.state[i];
      if (item.active) {
        if (data.symptom) {
          data.symptom = data.symptom + "," + item.name;

        } else {
          data.symptom = item.name;
        }

      }
    }

    data.state = this.data.cxState;

    data.temperature = this.data.temperatureNums.num1 + "" + this.data.temperatureNums.num2 + "." + this.data.temperatureNums.num3


    // data.registedName = ''
    //  data.address = this.data.address
    if (this.data.tiwenInde != 0) {
      if (!this.data.temperatureNums.num1 || !this.data.temperatureNums.num2 || !this.data.temperatureNums.num3) {
        wx.showToast({
          title: '请输入体温',
          icon: 'none'
        })
        return
      }

    } else {
      if (data.temperature == '.')
        data.temperature = '36.3'
    }
    console.log('saveCodeUser', data)
    if (data.state == -1) {
      wx.showToast({
        title: '请输入状态 ',
        icon: 'none'
      })
      return
    }

    wx.showLoading({
      title: '提交中',
    })

    reportHealth.passRegisterSave(data).then((result) => {
      wx.hideLoading()
      wx.showModal({
        title: '提交成功',
        showCancel: false,
        success(res) {
          if (res.confirm) {
            wx.navigateBack({
              delta: 1
            })
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })

    }, (error) => {
      wx.hideLoading()
      wx.showModal({
        title: '提交失败',
        content: error.errmsg,
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    })

  },
  handleTemperChange(e) {

    this.data.temperatureNums[e.currentTarget.id] = e.detail.value
  },
  bindconfirm(e) {
    let number = this.data.temperatureNums.num1 + "" + this.data.temperatureNums.num2 + "." + this.data.temperatureNums.num3
    try {
      number = Number(number);
      if (number < 37.3) {
        this.data.checkItems[0].checked = true
        this.data.checkItems[1].checked = false
        this.data.checkItems[2].checked = false
        this.data.checkItems[3].checked = false
      } else if (number >= 37.3 && number <= 37.9) {
        this.data.checkItems[0].checked = false
        this.data.checkItems[1].checked = true
        this.data.checkItems[2].checked = false
        this.data.checkItems[3].checked = false
      } else if (number >= 38 && number <= 38.9) {
        this.data.checkItems[0].checked = false
        this.data.checkItems[1].checked = false
        this.data.checkItems[2].checked = true
        this.data.checkItems[3].checked = false
      } else {
        this.data.checkItems[0].checked = false
        this.data.checkItems[1].checked = false
        this.data.checkItems[2].checked = false
        this.data.checkItems[3].checked = true
      }
      this.setData({
        checkItems: this.data.checkItems
      })
    } catch (e) { }
    console.log("number", number)

  },
  bindinput(e) {

    console.log("bindinput", e)
    let id = e.currentTarget.id;
    if ("num1" == id) {
      if (e.detail.value != "") {
        this.data.focus2 = true
        this.data.focus = false
      } else {
        this.data.focus2 = false
        this.data.focus = false
      }
      this.setData({
        focus: this.data.focus,
        focus2: this.data.focus2,

      })
    } else if ("num2" == id) {
      if (e.detail.value != "") {
        this.data.focus = true
        this.data.focus2 = false
      } else {
        this.data.focus2 = true
        this.data.focus = false
      }
      this.setData({
        focus: this.data.focus,
        focus2: this.data.focus2,

      })
    } else {


    }

    //this.data.focus2 = false
    //this.data.focus = false
    console.log("focus", this.data.temperatureNums)
  },
  handleChange2(e) {


    this.data.cxState = e.detail.value;
    console.log('state', this.data.cxState)
  },
  handleChange(e) {

    const {
      value
    } = e.detail;
    console.log(value)
    this.data.tiwenInde = value;
    this.data.tripSelect = value;
    if (!value) {
      return;
    }
    let num2;
    if (value == 0) {
      this.setData({
        temperatureNums: {
          num1: '',
          num2: '',
          num3: ''
        },
        focus: false,
        focus2: false,
      });
      return;
    } else if (value == 1) {
      num2 = 7
    } else if (value == 2) {
      num2 = 8
    } else {
      num2 = 9
    }
    this.setData({
      temperatureNums: {
        num1: 3,
        num2,
        num3: ''
      },
      focus: true
    })
  },
  passRegisterList() {

    reportHealth.passRegisterList(this.data.codeId).then((data) => {

      this.data.list = data;
      this.setData({
        list: this.data.list
      }, () => {
        // 通知重新计算样式
        Event.dispatch('g-tabs__resetStyle')
      })

    }, error => {

      wx.showToast({
        title: '错误:' + error.errmsg,
      })
    })

  },
  temperatureColor(t) {
    console.log('ssssss:', t);
    if (!t) {
      return 'status-1';
    } else if (t >= 37.3 && t <= 37.9) {
      return 'status-2';
    } else if (t >= 38 && t <= 38.9) {
      return 'status-2';
    } else if (t > 38.9) {
      return 'status-3';
    } else {
      return 'status-1'
    }
  },

  statusClick(e) {
    const {
      value
    } = e.currentTarget.dataset;
    const {
      state
    } = this.data;
    state.map(
      function (item) {
        if (item.value === value) {
          item.active = !item.active;
        }
      });
    this.setData({
      state
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // options = {codId: "1000000001", gridPointId: "162" };
    console.log('options', options)
    this.data.codeId = options.codId
    this.data.gridPointId = options.gridPointId

    setTimeout(() => {
      this.getLastUserStatus()
      this.passRegisterList()

    }, 300)
  },
  clickItem(e) {
    const {
      index
    } = e.currentTarget.dataset;
    const {
      list
    } = this.data;
    list[index].open = !list[index].open;
    this.setData({
      list
    }, () => {
      // 通知重新计算样式
      Event.dispatch('g-tabs__resetStyle')
    });
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