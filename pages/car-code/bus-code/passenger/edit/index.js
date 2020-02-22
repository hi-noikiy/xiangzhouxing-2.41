// pages/car-code/bus-code/passenger/edit/index.js
const { Anim } = getApp()
const validator = require("../../../../../components/gsd-ui/utils/validator");
const passengerService = require('../.././../../../services/car-code/passenger.js');
const healthApi = require('../.././../../../services/health-code.js')

//近七天的人员数据
let checkboxRecordMap = new Map();
Anim.Page({
  store: (store) => ({
    userInfo: store.user.userInfo
  }),
  data: {
    //用于判断是否显示编辑页
    hasId: false,
    formData: {
      id: '',
      carNum: "",
      routerNo: ""
    },
    rules: {
      carNum: [{ type: 'required', message: '请输入车牌号' }],
      routerNo: [
        { type: 'required', message: '请输入班次行程号' },
        { type: 'checkRouterNo', message: '班次行程号必须在10个字符以内' }]
    },
    validateType: {
      checkRouterNo(value) {
        return value.length > 0 && value.length <= 10
      }
    },
    // 乘车人信息数据
    passengerList: [],
    //乘车人uid，唯一标识符
    passengerValue: [],
    // 切换收缩值
    toggleIcon: "arrow-down",
    // 添加乘车人弹层
    passengerVisible: false,
    // 近七天上报人员
    checkRecordItems: [],
    // 近七天上报人员勾选值
    checkboxRecordValue: [],
    //近七天上报人员勾选数组
    checkboxRecordList: [],
    // 近七天上报人员勾选值暂存
    checkboxRecordValueTemp: ['zhangdabao'],
    //近七天上报人员勾选数组暂存
    checkboxRecordListTemp: [],
    // 扫描的二维码
    scanCode: "",
     //扫码的人员数据
    scanPassengerList:[],
    //存储用户信息
    userAllInfo: [],
    //行程是否开启
    tripState: true,
    //是否请求过近几天数据
    isCheckRecordItems: false
  }
  ,
  // 车牌号键盘
  handlePlateChange(e) {
    this.setData({
      'formData.carNum': e.detail.value
    })
    //this.getTrafficgateInfoByInput()
  },
  /**
   * 输入框值改变事件
   */
  handleChange(e) {
    this.setData({
      [`formData.${e.target.id}`]: e.detail.value
    })
    // this.getTrafficgateInfoByInput()
  },

  // 切换收缩折叠
  handleToggleShrink() {
    let toggleIcon = (this.data.toggleIcon === "arrow-down") ? "arrow-up" : "arrow-down";
    if (toggleIcon == "arrow-up" && this.data.formData.id == "" && this.data.passengerList.length < 2) {
      this.getTrafficgateInfoByInput();
    }
    this.setData({
      toggleIcon: toggleIcon
    });
  },

  // 删除乘车人
  handleDeletePassenger(e) {
    let idx = e.currentTarget.dataset['index'];
    let checkboxRecordValue = this.data.checkboxRecordValue.filter((item, index) => idx !== item);
    let list = this.data.passengerList.filter((item, index) => idx !== item.qrcId);
    let passengerValue = this.data.passengerValue.filter((item, index) => idx !== item);
    let scanPassengerList=this.data.scanPassengerList.filter((item, index) => idx !== item.qrcId);
    //更新扫码人员数据
    this.setData({scanPassengerList:scanPassengerList});
    //更新所有乘客健康码索引
    this.setData({ passengerValue: passengerValue })
    //更新同乘人数据
    this.setData({
      passengerList: list
    });
    //更新勾选值
    this.setData({
      checkboxRecordValue: checkboxRecordValue
    });
  },

  // 添加乘车人员
  handleAddPassenger() {
    console.log("add passenger clicked");
    if (!this.data.isCheckRecordItems) {
      passengerService.getqrcCodefromLastWeek().then((res) => {
        if (res && res.relations && res.relations.length > 0) {
          let result = res.relations;
          let dataRes = [];
          result.forEach((item) => {
            let item1 = item.qrcChild;
            if (item1.reportData == "") {
              return;
            }
            let temp = JSON.parse(item1.reportData)
            let user = { mark: "", uid: String(item1.uid), name: temp.username, phone: temp.phone, roleState: '2', identityTypeCode: temp.identityType, identityNo: temp.identity, qrcId: String(item1.id), reportPneumoniaId: temp.id, value: String(item1.id) }
            dataRes.push(user);
            checkboxRecordMap.set(String(item1.id), user);
            console.info(this.data.checkRecordItems)
          })
          //生成多选框
          this.setData({ checkRecordItems: dataRes })
        }
        this.setData({ isCheckRecordItems: true });
        this.setData({
          passengerVisible: true
        });
      }, (err) => {
        this.setData({
          passengerVisible: true
        });
      })
    } else {
      this.setData({
        passengerVisible: true
      });
    }
  },

  // 勾选人员
  handleRecordChange(data) {
    console.log("select people", data.detail.value);
    this.setData({
      checkboxRecordValue: data.detail.value
    });
  },

  // 调用扫一扫功能
  getScanCode() {
    var _this = this;
    console.log("getScanCode");

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
            let currentTime=new Date().getTime();
            //判断健康码是否过期
            let isExpire=(currentTime-86400 * 7 * 1000 >= res.reportTime)?true:false;
            if(isExpire){
              wx.showModal({
                title: '提醒',
                content: '该健康自查上报信息已过期，请提示他人重新上报！',
                showCancel: false,
                confirmText: '知道了'
              });
              return;
            }
            let userData = [{ mark: "", uid: String(res.uid), name: temp.username, phone: temp.phone, roleState: '2', identityTypeCode: temp.identityType, identityNo: temp.identity, qrcId: String(res.id), reportPneumoniaId: temp.id, value: String(res.id) }];
            // checkboxRecordMap.set(String(res.uid), userData[0]);
            // console.info(userData);
            // console.info(this.data.checkRecordItems)
            let passengerValue = this.data.passengerValue;
            if(passengerValue.indexOf(String(res.id))<0){
              let scanPassengerList=this.data.scanPassengerList.concat(userData);
              let list = _this.data.passengerList.concat(userData);
              console.info(list)
              passengerValue.push(String(res.id));
              this.setData({ passengerValue: passengerValue })
              _this.setData({scanPassengerList:scanPassengerList});
              _this.setData({ passengerList: list })
                wx.showToast({
                  title: `已经成功添加该同乘人${temp.username}！`,
                  icon: 'none',
                  duration: 3000
                });   
            }else{
              wx.showToast({
                title: `您已经加过该同乘人${temp.username}了！`,
                icon: 'none',
                duration: 3000
              });
            }
            _this.setData({
              passengerVisible: false
            });
          }
        },(err)=>{
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
    let checkboxRecordValue = this.data.checkboxRecordValue;
    let list = this.data.passengerList;
    let passengerValue = this.data.passengerValue;
    checkboxRecordValue.forEach((item) => {
      if (this.data.passengerValue.indexOf(item) < 0) {
        list.push(checkboxRecordMap.get(item))
        passengerValue.push(item)
      }
    })
    this.setData({ passengerValue: passengerValue })
    //更新同乘人数据
    this.setData({
      passengerList: list
    });
    wx.showToast({
      title: '已成功添加同乘人',
      icon: 'none',
      duration: 3000
    });
    this.setData({
      passengerVisible: false
    });
  },
  // 提交添加乘车人员
  handleFormSubmit(e) {
    console.info(e)
    if (e.detail.validStatus) {
      const formData = { ...e.detail.value }
      let id = formData.id;
      let tripState = this.data.tripState;
      if (!tripState) {
        wx.showModal({
          title: '提示',
          content: '该通行码无进行中行程，请联系司机或工作人员',
          showCancel: false,
          confirmText: '确定'
        });
        return;
      }
      if (!!id) {
        this.addPassenger(id);
      } else {
        wx.showModal({
          title: '提示',
          content: '请输入正确的车牌号和行程班次！',
          showCancel: false,
          confirmText: '知道了'
        });
      }
    }

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
    // this.setData({
    //   passengerVisible: false
    // });
  },
  //添加同乘人
  addPassenger(id) {
    let personList = this.data.passengerList;
    console.info(personList)
    let personList1 = personList.map((item) => {
      item.checkPointRegisterId = id;
      return item;
    })
    //添加同成人信息
    passengerService.SavePointPassenger(personList1).then((res) => {
      console.info(res)
      if (res == "操作成功") {
        // 提示信息
        // wx.showModal({
        //   title: '提示',
        //   content: '已成功添加同乘人',
        //   showCancel: false,
        //   confirmText: '确定',
        //   success() {
        //     console.log("上报成功");
        //   }
        // });
        wx.navigateTo({
          url: '../commit/index?id=' + id + "&identityNo=" + this.data.userAllInfo[0].uid + "&qrcId=" + this.data.userAllInfo[0].qrcId,
        })
      } else {
        // 提示信息
        wx.showModal({
          title: '提示',
          content: '添加同乘人失败',
          showCancel: false,
          confirmText: '确定',
          success() {
            console.log("上报成功");
          }
        });
      }
    })
  },

  // /**
  //  * 多人陪同
  //  */
  // handleMoreTap() {
  //   wx.navigateTo({
  //     url: '../passenger-manage/index',
  //   })
  // },

  /**
   * 打开车牌键盘
   */
  handleOpenVehicleKeyboard() {
    this.setData({
      showVehicleKeyboard: true
    })
  },
  //通过输入的班次和车牌号获取行程信息及同乘人
  getTrafficgateInfoByInput() {
    let formData = this.data.formData;
    let that = this;
    // clearTimeout(timer);
    // timer = setTimeout(() => {
    validator(that.data.formData, that.data.rules || {}, that.data.validateType || {})
      .then((errorArr) => {
        console.info(errorArr)
        if (errorArr.length === 0) {
          //跳转至同乘人
          //根据车牌号和班次查询对应的行程信息
          passengerService.getCheckPointRegisterByCarnumber({ "carNumber": formData.carNum, "carBatchNo": formData.routerNo }).then((res) => {
            if (!res || res.length < 1) {
              wx.showModal({
                title: '提示',
                content: '请输入正确的车牌号和行程班次！',
                showCancel: false,
                confirmText: '知道了'
              });
              return;
            } else {
              //用于判断行程是否开启
              let tripState = res[0].tripState && res[0].tripState == 1 ? true : false;
              this.setData({ tripState: tripState })
              var data = {
                id: res[0].id,
                carNum: res[0].carNumber,
                routerNo: res[0].carBatchNo
              }
              this.setData({formData:data})
              //获取同乘人
              that.getPointPassengerList(res[0].id);
            }
          })
        } else {
          // wx.showModal({
          //   title: '提示',
          //   content: errorArr[0].message,
          //   showCancel: false,
          //   confirmText: '知道了'
          // })
        }

      })
    // }, 2500);

    // })
  },
  //根据行程id获取行程信息及同乘人
  getTrafficgateInfo(id) {
    let userAllInfo = this.data.userAllInfo;
    if (!!id) {
      //根据id获取行程信息
      passengerService.getTravelInfoById({ checkPointId: id }).then((res) => {
        // console.info("行程信息=====================================")
        // console.info(res)
        var data = {
          id: res.id,
          carNum: res.carNumber,
          routerNo: res.carBatchNo
        }
        console.info(data)
        this.setData({
          formData: data
        })
      })
      // //获取同乘人
      this.getPointPassengerList(id);
    } else {
      this.setData({
        passengerList: userAllInfo
      })
    }
    console.log('用户信息', this.data.userInfo)
  },
  //根据行程id获取同乘人
  getPointPassengerList(id) {
    let userAllInfo = this.data.userAllInfo;
    //根据行程id获取同行人信息
    passengerService.getPointPassengerList({ checkPointRegisterId: id, roleState: "2", createUserId: userAllInfo[0].uid }).then((res) => {
      console.info("同行人信息=====================================")
      console.info(res)
      let identNos = [];
      if (res && res.length > 0) {
        let personList = res.filter(item => {
          let isMe = String(item.qrcId) == String(userAllInfo[0].qrcId);
          identNos.push(String(item.qrcId))
          item.phone = item.phone || '';
          item.mark = isMe ? "本人" : "";
          item.uid = item.createUserId
          return !isMe;
        })
        personList = userAllInfo.concat(personList);
        this.setData({ passengerValue: identNos })
        this.setData({
          passengerList: personList
        })
      }
      else {
        this.setData({
          passengerList: userAllInfo
        })
      }
    })
  },
  onLoad: function (option) {
    console.log(option.id)
    let id = option.id;
    let uid = this.data.userInfo.uid;
    let hasId = (!!id) ? true : false
    this.setData({ hasId: hasId })
    //let uid="10022545069"
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
    //获取自己的信息
    passengerService.getUserHealthInfo(uid).then((res) => {
      if (res && res.reportData) {
        // if (!res.id) {
        //   // 提示信息
        //   wx.showModal({
        //     title: '提示',
        //     content: '请先上报！',
        //     showCancel: false,
        //     confirmText: '知道了'
        //   });
        //   return;
        // }
        let temp = JSON.parse(res.reportData)
        let userData = [{ mark: "本人", uid: String(res.uid), name: temp.username, phone: temp.phone, roleState: '2', identityTypeCode: temp.identityType, identityNo: temp.identity, qrcId: String(res.id), reportPneumoniaId: String(temp.id) }];
        this.setData({
          userAllInfo: userData
        })
        this.getTrafficgateInfo(id);
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
  }
})