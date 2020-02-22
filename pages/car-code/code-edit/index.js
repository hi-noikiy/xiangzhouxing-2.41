const editApi = require('../../../services/car-code/code-edit.js');
const detial = require('../../../services/car-code/code-detail.js');
const mainApi = require('../../../services/car-code/main-page.js');
const passengerService = require('../../../services/car-code/passenger.js');
const healthApi = require('../../../services/health-code.js')
const { Anim, userStore, config } = getApp();

// let checkboxRecordMap = new Map();
Anim.Page({
  store: (store) => ({
    userInfo: store.user.userInfo
  }),
  /**
   * 页面的初始数据
   */
  computed: {
    cityValue() {
      return this.data.curFocusPicker === 'leaveProvinceName' ? this.data.srcCityValue : this.data.distCityValue
    }
  },
  data: {
    srcCityValue: [],
    distCityValue: [],
    vehicleTypeCode: '0',
    formData: {
      vehicleTypeCode: "",
      numberTypeCode: '1',
      carNumber: "",
      leaveProvinceCode: "",
      leaveProvinceName: "",
      leaveCityCode: "",
      leaveCityName: "",
      arriveProvinceCode: "",
      arriveProvinceName: "",
      arriveCityCode: "",
      arriveCityName: "",
      qrcs: []
      // qrcs: ['1000000120']
    },
    rules: {
      carvehicleTypeCodeType: [
        { type: 'required', message: '请选择号牌种类' }
      ],
      carNumber: [
        { type: 'required', message: '请输入车牌号' }
      ],
      leaveProvinceName: [
        { type: 'required', message: '请输入出发城市' }
      ],
      arriveProvinceName: [
        { type: 'required', message: '请输入到达城市' }
      ]

    },
    curFocusPicker: "",
    showVehicleKeyboard: false,
    visible: false,
    value: '',
    regionValue: [],
    regionType: '',
    includes: [],
    excludes: [],
    myself: {},
    // 乘车人信息数据
    passengerList: [],
    //临时存储扫码人员
    scanList: [],
    // 切换收缩值
    toggleIcon: "arrow-up",
    // 添加乘车人弹层
    passengerVisible: false,

    // 近七天上报人员
    checkRecordItems: [
      // {
      //   mark: "", uid: '', name: "林家的人", isSave: false, value: 1000000009, phone: '', roleState: '2',
      //   identityTypeCode: '', identityNo: '', qrcId: 1000000009, reportPneumoniaId: '',
      // },
      // {
      //   mark: "", uid: '', name: "林家的人1", isSave: true, value: 1000000010, phone: '', roleState: '2',
      //   identityTypeCode: '', identityNo: '', qrcId: 1000000010, reportPneumoniaId: '',
      // }
    ],
    // 近七天上报人员勾选值
    checkboxRecordValue: [],
    //近七天上报人员勾选数组
    checkboxRecordList: [],
    //近七天上报人员map
    // checkboxRecordMap: MapTemp,
    // 近七天上报人员勾选值暂存
    checkboxRecordValueTemp: ['zhangdabao'],
    //近七天上报人员勾选数组暂存
    checkboxRecordListTemp: [],

    // 扫描的二维码
    scanCode: "",
    //是否请求过近几天数据
    isCheckRecordItems: false,
    carTypes: [{
      name: '小型汽车',
      value: '1',
      displayName: '小型汽车'
    },
    {
      name: '大型汽车',
      value: '2',
      displayName: '大型汽车'
    },
    {
      name: '小型能源汽车',
      value: '3',
      displayName: '小型能源汽车'
    },
    {
      name: '大型能源汽车',
      value: '4',
      displayName: '大型能源汽车'
    },
    {
      name: '香港出入境车',
      value: '5',
      displayName: '香港出入境车'
    },
    {
      name: '澳门出入境车',
      value: '6',
      displayName: '澳门出入境车'
    },
    {
      name: '使馆汽车',
      value: '7',
      displayName: '使馆汽车'
    },
    {
      name: '领馆汽车',
      value: '8',
      displayName: '领馆汽车'
    },
    {
      name: '挂车',
      value: '9',
      displayName: '挂车'
    },
    {
      name: '教练汽车',
      value: '10',
      displayName: '教练汽车'
    },
    {
      name: '警用汽车',
      value: '11',
      displayName: '警用汽车'
    }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取私家车和货车以及其他
    this.data.vehicleTypeCode = options.vehicleTypeCode;
    let id = options.id;
    // this.data.id = options.id;
    let uid = this.data.userInfo.uid;
    // mainApi.getQrCode(this.data.userInfo).then((res) => {
    //   this.setData({
    //     ['formData.qrcsId']: res.codeId
    //   })
    // })
    if (!uid) {
      // 提示信息
      wx.showModal({
        title: '提示',
        content: '请先登录！',
        showCancel: false,
        confirmText: '知道了',
        success(res) {
          if (res.confirm) { // 去上报
            wx.navigateTo({
              url: '/pages/report/index/index', // TO-DO 改为上报地址
            })
          }
        }
      });
      return;
    }
    //重新编辑
    if (id) {
      this.getDetail(id);
      this.getPointPassengerList(id)
    }
    //获取自己的信息
    passengerService.getUserHealthInfo(uid).then((res) => {
      if (res && res.reportData) {
        console.log(res)
        let temp = JSON.parse(res.reportData)
        let userData = [{ mark: "本人", uid: res.uid, name: temp.username, phone: temp.phone, roleState: '2', identityTypeCode: temp.identityType, identityNo: temp.identity, qrcId: res.id, reportPneumoniaId: temp.id }];
        this.setData({
          passengerList: userData, myself: userData
        })
      } else {
        // 提示信息
        wx.showModal({
          title: '提示',
          content: '请先上报个人健康自查！',
          showCancel: false,
          confirmText: '去上报',
          success(res) {
            if (res.confirm) { // 去上报
              wx.navigateTo({
                url: '/pages/report/index/index', // TO-DO 改为上报地址
              })
            }
          }
        });
      }
    }, (err) => {
      // 提示信息
      wx.showModal({
        title: '提示',
        content: '请先上报个人健康自查！',
        showCancel: false,
        confirmText: '去上报',
        success(res) {
          if (res.confirm) { // 去上报
            wx.navigateTo({
              url: '/pages/report/index/index', // TO-DO 改为上报地址
            })
          }
        }
      });
    })
  },

  // 提交
  handleSubmit(e) {
    // 验证通过
    if (!e.detail.validStatus) {
      return;
    }
    wx.showLoading({
      title: '请稍候',
    })
    let obj = {};
    if (this.data.vehicleTypeCode=='undefined') {
      obj = {
        roleState: "2",
        lat: "121",
        lng: "132"
      }
    } else {
      obj = {
        vehicleTypeCode: this.data.vehicleTypeCode,
        clueType: this.data.vehicleTypeCode,
        roleState: "2",
        lat: "121",
        lng: "132"
      }
    }
    // if(!(this.data.formData.qrcs instanceof Array)){
    //   this.data.formData.qrcs = this.data.formData.qrcs.split(',')
    // }
    if (!Boolean(this.data.formData.qrcs)) {
      this.setData({ 'formData.qrcs': [] })
    }
    this.data.passengerList.forEach(item => {
      this.data.formData.qrcs.push(item.qrcId ? item.qrcId : item.value)
    })
    this.data.formData.qrcs = this.data.formData.qrcs.toString();
    // 获取用户位置信息
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        obj.lat = res.latitude;
        obj.lng = res.longitude;
      }
    })

    let params = {
      ...this.data.formData,
      ...obj
    }
    editApi.saveOrUpdate(params).then(res => {
      wx.hideLoading()
      wx.navigateTo({
        url: '/pages/car-code/bus-code/car-success/index?id=' + res.checkPointRegisterId + "&identityNo=" + this.data.userInfo.uid,
      })

    })
  },

  // 车牌号键盘
  handlePlateChange(e) {
    this.setData({
      'formData.carNumber': e.detail.value
    })
  },

  /**
   * 输入框值改变事件
   */
  handleChange(e) {
    this.setData({
      [`formData.${e.target.id}`]: e.detail.value
    })
  },

  /**
   * 点击城市选择框时，弹出选择的浮层
   */
  handleCity(e) {
    this.setData({
      curFocusPicker: e.target.dataset.id,
      visible: true,
      regionType: 'city',
      includes: [],
      excludes: []
    })
  },

  // 切换收缩折叠
  handleToggleShrink() {
    let toggleIcon = (this.data.toggleIcon === "arrow-down") ? "arrow-up" : "arrow-down";
    this.setData({
      toggleIcon: toggleIcon
    });
  },

  // 删除乘车人
  handleDeletePassenger(e) {
    let idx = e.currentTarget.dataset['index'];
    console.log(idx)
    let self = this;
    // 提示信息
    wx.showModal({
      title: '提示',
      content: '该乘车人是否删除',
      cancelText: '取消',
      confirmText: '确定',
      success(res) {
        if (res.confirm) {
          // 删除同乘人
          let passengerList = self.data.passengerList.filter((item, index) => idx !== item.value);
          let scanList = self.data.scanList.filter((item, index) => idx !== item.value);
          let checkIds = self.data.checkboxRecordValue.filter(item => Number(item) !== idx);
          self.setData({
            scanList: scanList,
            passengerList: passengerList,
            checkboxRecordValue: checkIds
          });
        } else if (res.cancel) {
          return;
        }
      }
    });
  },

  // 添加乘车人员
  handleAddPassenger() {
    this.setData({
      passengerVisible: true
    });
    if (!this.data.isCheckRecordItems) {
      healthApi.canSaveUserList().then((res) => {
        if (res) {
          let result = res;
          let dataRes = [];
          result.forEach((item) => {
            let user = {
              mark: "", uid: '', name: item.username, isSave: item.isSave, value: item.codeId, phone: '', roleState: '2',
              identityTypeCode: '', identityNo: '', qrcId: String(item.codeId), reportPneumoniaId: '',
            }
            dataRes.push(user);
          })
          this.setData({ checkRecordItems: dataRes })
        }
        this.setData({ isCheckRecordItems: true });
        this.setData({ passengerVisible: true });
      }, (err) => {
        this.setData({ passengerVisible: true });
      })
    } else {
      this.setData({ passengerVisible: true });
    }
  },

  // 勾选人员
  handleRecordChange(data) {
    // let temp = this.data.checkboxRecordValue;
    console.log(data.detail)
    console.log("select people", data.detail.value);
    let tempIndex;
    data.detail.value.forEach(item=>{
      this.data.checkRecordItems.forEach((itemOne,indexOne)=>{
          if(item==itemOne.qrcId){
              tempIndex = indexOne;
          }
      })
    })
    if(typeof(tempIndex) !== "undefined"){
      if(this.data.checkRecordItems[tempIndex].isSave){
        this.setData({
          checkboxRecordValue: data.detail.value
        });
      }else{
        let valueList = data.detail.value;
        valueList.splice(valueList.length-1,1)
        this.setData({
          checkboxRecordValue: valueList
        });
        wx.showModal({
          title: '提醒',
          content: '该健康上报已经过期，请提示他人重新上报',
          showCancel: false,
          confirmText: '知道了'
        });
        return;
      }
    }
  },

  // 调用扫一扫功能
  getScanCode() {
    var _this = this;
    wx.scanCode({
      success: (res) => {
        var result = res.result;
        _this.setData({
          scanCode: result
        })
        let id = JSON.parse(result).codeId;
        if (!id) {
          wx.showToast({
            title: '请扫有效的健康码',
            icon: 'none',
            duration: 3000
          });
          return;
        }
        healthApi.infoByCodeId(JSON.parse(result).codeId).then(res => {
          if (res && res.reportData) {
            let temp = JSON.parse(res.reportData)
            let currentTime = new Date().getTime();
            //判断健康码是否过期
            let isExpire = (currentTime - 86400 * 7 * 1000 >= res.reportTime) ? true : false;
            if (isExpire) {
              wx.showModal({
                title: '提醒',
                content: '该健康自查上报信息已过期，请提示他人重新上报！',
                showCancel: false,
                confirmText: '知道了'
              });
              return;
            }
            let userData = [{
              mark: "", uid: String(res.uid), name: temp.username, phone: temp.phone,
              roleState: '2', identityTypeCode: temp.identityType, identityNo: temp.identity, qrcId: res.id,
              reportPneumoniaId: temp.id, value: res.id
            }];
            // console.log(userData)

            if (this.data.scanList.some(item => { return item.qrcId == res.id })) {
              wx.showToast({
                title: `您已经加过该同乘人${temp.username}了！`,
                icon: 'none',
                duration: 3000
              });
            } else {
              // let list = this.data.passengerList.concat(userData[0])
              let list = this.data.scanList.concat(userData)
              this.setData({ scanList: list })
            }
            // this.setData({
            //   passengerList: list,
            //   passengerVisible: false
            // });
          }
        }, (err) => {
          wx.showModal({
            title: '提醒',
            content: '请检查该健康码是否有效！',
            showCancel: false,
            confirmText: '知道了'
          });
        })
      }
    });
  },

  // 关闭添加乘车人员弹层
  handleClosePassengerLayer() {
    console.log("close passenger pop");
    this.setData({
      passengerVisible: false
    });
  },

  // 提交添加乘车人员
  handleSubmitPassenger() {
    // let newAttr = this.data.passengerList;
    // let list = this.data.scanList.concat(userData[0])
    let tempList = this.data.passengerList;
    let newAttr = tempList.concat(this.data.scanList);
    if (this.data.checkboxRecordValue) {
      for (let i = 0; i < this.data.checkboxRecordValue.length; i++) {
        const element1 = this.data.checkboxRecordValue[i];
        for (let j = 0; j < this.data.checkRecordItems.length; j++) {
          const element2 = this.data.checkRecordItems[j];
          if (element1 == element2.value) {
            newAttr.push(element2);
            break;
          }
        }
      }
      // //进行去重
      var hash = {};
      newAttr = newAttr.reduce(function (item, next) {
        hash[next.qrcId] ? '' : hash[next.qrcId] = true && item.push(next);
        return item
      }, [])

      this.setData({
        passengerList: newAttr,
        passengerVisible: false
      })
    }

    // wx.showToast({
    //   title: '已成功添加同乘人',
    //   icon: 'none',
    //   duration: 3000,
    //   success: function () {

    //   },
    //   fail: function () {

    //   },
    //   complete: function () {

    //   }
    // });

    // // 提示信息
    // wx.showModal({
    //   title: '提示',
    //   content: '该健康自查上报信息已过期，请提示他人重新上报！',
    //   showCancel: false,
    //   confirmText: '知道了',
    //   success() {
    //     console.log("上报失败");
    //   }
    // });
    // console.log("submit passenger pop");
  },

  // handleChange(e) {
  //   const value = e.detail.value
  //   debugger;
  //   this.setData({
  //     regionValue: value,
  //     value: value.map(item => item.name).join('')
  //   })
  // },
  handleSrcCityChange(e) {
    const value = e.detail.value
    this.setData({
      ['formData.srcCity']: value.map(item => item.name).join('')
    })
  },
  /**
   * 城市选择框值改变事件
   */
  handleCityChange(e) {
    // const value = e.detail.value
    // this.setData({
    //   // regionValue: value,
    //   [`formData.${this.data.curFocusPicker}`]: value.map(item => item.name).join('')
    // })
    const value = e.detail.value
    console.log(value)
    if (value.length > 0) {
      if (this.data.curFocusPicker == 'leaveProvinceName') {
        this.setData({
          srcCityValue: value,
          [`formData.leaveProvinceName`]: value[0].name,
          [`formData.leaveProvinceCode`]: value[0].code,
          [`formData.leaveCityName`]: value[1].name,
          [`formData.leaveCityCode`]: value[1].code,
        })
      } else if (this.data.curFocusPicker == 'arriveProvinceName') {
        this.setData({
          distCityValue: value,
          [`formData.arriveProvinceName`]: value[0].name,
          [`formData.arriveProvinceCode`]: value[0].code,
          [`formData.arriveCityName`]: value[1].name,
          [`formData.arriveCityCode`]: value[1].code,
        })
      }
    }
  },

  /**
   * 城市选择框关闭事件
   */
  handleClose() {
    this.setData({
      visible: false
    })
  },

  /**
   * 独自驾驶
   */
  handleOneTap() {
    wx.navigateTo({
      url: '../submit-success/index',
    })
  },

  /**
   * 多人陪同
   */
  handleMoreTap() {
    wx.navigateTo({
      url: '../passenger-manage/index',
    })
  },

  /**
   * 打开车牌键盘
   */
  handleOpenVehicleKeyboard() {
    this.setData({
      showVehicleKeyboard: true
    })
  },

  // 获取私家车卡口详情
  getDetail(id) {
    // let map = this.data.mapcarTypes;
    detial.getTrafficgateInfo({
      registerId: id
    }).then((result) => {
      result.numberTypeCode = String(result.numberTypeCode);
      delete result.createTime
      this.setData({
        formData: result
      })
    })
  },
  //根据行程id获取同乘人
  getPointPassengerList(id) {
    //根据行程id获取同行人信息
    detial.getPointPassengerList({
      registerId: id
    }).then((res) => {
      console.info("同行人信息=====================================")
      if (res && res.length > 0) {
        let userAllInfo = [];
        let personList = res.filter(item => {
          let isMe = item.identityNo == this.data.identityNo;
          item.phone = item.phone || '';
          item.mark = isMe ? "本人" : "";
          if (isMe) {
            userAllInfo.push(item);
          }
          return !isMe;
        })
        personList = userAllInfo.concat(personList);
        this.setData({
          passengerList: personList
        })
      }
    })
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
  onUnload: function (options) {

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