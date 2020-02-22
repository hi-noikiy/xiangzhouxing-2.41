
const editApi = require('../../../../../services/car-code/bus-code-driver.js');
const mainApi = require('../../../../../services/car-code/main-page.js');

const { Anim, userStore, config } = getApp()

Anim.Page({

  store: (store) => ({
    userInfo: store.user.userInfo
  }),

  /**
   * 页面的初始数据
   */
  data: {
    formData: {
      vehicleTypeCode: "",
      carNumber: "",
      carBatchNo: "",
      leaveProvinceCode: "",
      leaveProvinceName: "",
      leaveCityCode: "",
      leaveCityName: "",
      arriveProvinceCode: "",
      arriveProvinceName: "",
      arriveCityCode: "",
      arriveCityName: "",
      qrcsId: ""
    },
    rules: {
      carNumber: [
        { type: 'required', message: '请输入车牌号' }
      ],
      carBatchNo: [
        { type: 'required', message: '请输入班次行程号' }
      ],
      leaveProvinceName: [
        { type: 'required', message: '请输入出发城市' }
      ],
      arriveProvinceName: [
        { type: 'required', message: '请输入到达城市' }
      ]

    },
    validateType: {

    },
    curFocusPicker: "",
    visible: false,
    value: '',
    regionValue: [],
    regionType: '',
    includes: [],
    excludes: [],
    showVehicleKeyboard: false

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.id) {
      // 编辑，数据回填
      this.getDetail(options.id);

    } else {
      // 获取健康码
       this.getQrCode();

    }
  },

  // 获取健康码
  getQrCode(){
    mainApi.getQrCode(this.data.userInfo).then((result) => {
      this.setData({
        ['formData.qrcsId']: result.codeId
      })

    })

  },
  // 获取详情
  getDetail(id) {
    editApi.getTrafficgateInfo({ checkPointId: id }).then((result) => {
      console.log('卡口详情', result);
      this.setData({
        formData: result
      })
      this.getQrCode();

    })

  },
  /**
   * 提交数据
   */
  handleSubmit(e) {
    // 验证通过
    if (!e.detail.validStatus) {
      return;
    }

    if (!this.data.formData.id && !this.data.formData.qrcsId) {
      wx.showToast({
        title: '未上报个人健康自查',
        duration: 2000
      });
      return;
    }

   

    if (!this.data.formData.id) {
      let obj = {
        vehicleTypeCode: "1",
        clueType: "1",
        roleState: "1",
        lat: "121",
        lng: "132"
      }

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
      this.saveData(params);

    } else {
      this.saveData({...this.data.formData, roleState: "1"});
    }

  },

  // 保存数据
  saveData(data) {
    wx.showLoading({
      title: '请稍候',
    })
    editApi.saveCheckPointRegister(data).then((result) => {
      if (result) {
        console.log("新增daba司机端数据", result);
        let url = "";
        // if (result.indexOf('修改成功') > -1) {
        if (this.data.formData.id) {
          url = `../../../submit-success/index?driverType=daba&id=${this.data.formData.id}&uid=${this.data.formData.uid}`;
        }else{
          url = `../../../submit-success/index?driverType=daba&id=${result.checkPointRegisterId}&uid=${result.uid}`;
        }
        wx.hideLoading();
        wx.navigateTo({
          url: url
        })
      }

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

  /**
   * 城市选择框值改变事件
   */
  handleChange(e) {
    const value = e.detail.value
    if (value.length > 0) {
      if (this.data.curFocusPicker == 'leaveProvinceName') {
        this.setData({
          [`formData.leaveProvinceName`]: value[0].name,
          [`formData.leaveProvinceCode`]: value[0].code,
          [`formData.leaveCityName`]: value[1].name,
          [`formData.leaveCityCode`]: value[1].code,
        })
      } else if (this.data.curFocusPicker == 'arriveProvinceName') {
        this.setData({
          [`formData.arriveProvinceName`]: value[0].name,
          [`formData.arriveProvinceCode`]: value[0].code,
          [`formData.arriveCityName`]: value[1].name,
          [`formData.arriveCityCode`]: value[1].code,
        })

      }
    }

  },
  /**
  * 班次号改变
  */
  handleFormChange(e) {
    this.setData({
      [`formData.${e.target.id}`]: e.detail.value
    });
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
  * 打开车牌键盘
  */
  handleOpenVehicleKeyboard() {
    this.setData({
      showVehicleKeyboard: true
    })
  },
  // 车牌号键盘
  handlePlateChange(e) {
    this.setData({
      'formData.carNumber': e.detail.value
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

  }


})