// pages/report/index.js
const { Anim, Event, config, dayjs } = getApp()
const { chooseLocation } = require('../../../utils/util')
const reportService = require('../../../services/report')
const regionService = require('../../../services/region')

const INIT_FORM = {
  username: '',
  reportName: '',
  phone: '',
  report: '',
  pic: [],
  pictrues: [],
  street: '',
  addr: '',
  orgName: '',
  identify: ''
}
const INIT_FORM_RULES = {
  reportName: [
    { type: 'required', message: '请输入报事名称' },
    { type: 'titleLength', message: '输入内容小于 20 个字' },
  ],
  username: [
    { type: 'required', message: '请输入报事人' },
  ],
  // gender: [
  //   { type: 'required', message: '请选择性别' },
  // ],
  report: [
    { type: 'required', message: '请输入报事内容' },
    { type: 'contentLength', message: '输入内容需大于 10 个字' },
  ],
  // phone: [
  //   { type: 'required', message: '请输入联系方式' },
  //   { type: 'mobile', message: '请输入正确的手机号码' },
  // ],
  // street: [
  //   { type: 'required', message: '请选择居住地址' },
  // ],
  // addr: [
  //   { type: 'required', message: '请填写详细住址' },
  // ],
  // orgName: [
  //   { type: 'required', message: '请选择呈报单位' },
  // ],
  // identify: [
  //   { type: 'id', message: '请输入正确的身份证号码' },
  // ]
}

function getRequestHeader () {
  return {
    openid: wx.getStorageSync('wx-openid'),
    sessionid: wx.getStorageSync('wx-sessionid'),
  }
}

function formatDate(value){
    if (value) {
      return dayjs(value).format('YYYY-MM-DD')
    }

    return value;
}

Anim.Page({
  store: (store) => ({
    userInfo: store.user.userInfo
  }),

  data: {
    pdfUrl: 'https://imgcache.gzonline.gov.cn/doc/Report_Clues.pdf',
    imgSrc: "/images/report/caozuozhiyin.png",
    tipsEvent: 'form__tips',
    cityName: config.cityName,
    headers: {},
    activeTab: 'self',
    showVehicleKeyboard: false,
    showHBCityPicker: false,
    showRegionPicker: false,
    uploadUrl: `${config.domain}/report/uploadfile`,
    today: dayjs().format('YYYY-MM-DD'),
    startDay: dayjs().subtract(130, 'year').format('YYYY-MM-DD'),
    halfMonthAgo: dayjs().subtract(15, 'day').format('YYYY-MM-DD'),

    identityInputType: 'text',

    regionRange: [],
    sexRange: [
      { name: '男', value: '男' },
      { name: '女', value: '女' },
      { name: '未知', value: '未知' },
    ],
    cardTypeRange: [
      { name: '身份证', value: 1 },
      { name: '回乡证', value: 2 },
      { name: '护照', value: 3 },
      { name: '军官证', value: 4 },
      { name: '台胞证', value: 5 },
      { name: '港澳居民居住证', value: 6 },
      { name: '台湾居民居住证', value: 7 },
    ],
    personTypeItems: [
      { name: `未返穗本地常住居民`, value: 1, desc: `在2020-1-1之后一直没返穗的本地常住居民。` },
      { name: `持续在穗人员`, value: 2, desc: `于2020-1-1之前到目前一直在穗人员。` },
      { name: `一月初返穗居民`, value: 3, desc: `在2020-1-1至2020-1-15间返穗本地常住居民。` },
      { name: `一月初来穗人员`, value: 4, desc: `在2020-1-1至2020-1-15间来穗外地临时人员。` },
      { name: `一月中返穗居民`, value: 5, desc: `于2020-1-15后返穗本地常住居民。` },
      { name: `一月中来穗人员`, value: 6, desc: `于2020-1-15后来穗外地临时人员。` },
      { name: `居家医学观察人员 `, value: 11 },
      { name: `集中医学观察人员 `, value: 12 },
    ],
    symptomItems: [
      { name: '自觉正常', value: 1 },
      { name: '发热', value: 2 },
      { name: '干咳', value: 3 },
      { name: '乏力', value: 4 },
      { name: '腹泻', value: 5 },
      { name: '感冒', value: 6 },
      { name: '头疼头晕', value: 7 },
    ],

    agree: false,

    selfForm: {
      regionData: [],
      username: '',
      gender: '',
      identity: '',
      identityType: '',
      hubeiLivingCity: '',
      hubeiLivingCityCode: '',
      personType: '',
      recentInHubei: false,
      phone: '',
      clueVehicle: '',
      birthday: '',
      symptomDscr: '',
      symptoms: [],
      addr: '',
      street: '',
      clueSupplier: '',
      clueSupplierPhone: '',
      clueVehicle: '',
      socialContact: '',
      socialContact1: '',
      socialContact2: '',
      socialContact3: '',
      socialContact4: '',
      returnDate: '',
      contactDateRecent: '',
      quasiReturnDate: ''
    },
    selfFormRules: {
      clueSupplier: [
        { type: 'required', message: '请输入您的姓名' },
        { type: 'usernameLength', message: '姓名不能超过50个字符' },
      ],
      // clueSupplierPhone: [
      //   { type: 'required', message: '请输入手机号码' },
      //   { type: 'mobile', message: '请输入正确的手机号码' }
      // ],
      username: [
        // { type: 'required', message: '请输入涉事人的姓名' }
        { type: 'usernameLength', message: '姓名不能超过50个字符' },
      ],
      gender: [{ type: 'required', message: '请选择性别' }],
      phone: [
        // { type: 'required', message: '请输入联系方式' },
        { type: 'mobile', message: '请输入正确的手机号码' },
      ],
      // addr: [
      //   { type: 'required', message: '请输入详细住址' },
      // ],
      // street: [
      //   // { type: 'required', message: '请选择居住地址' },
      // ],
      // identity: [{ type: 'required', message: '请输入证件号码' },],
      clueVehicle: [
        { type: 'clueVehicleLength', message: '车牌号码长度必须少于 8' },
        { type: 'checkAnyOne', message: '联系电话，关联车牌，居住地址，三者至少填一个' },
        { type: 'carId', message: '请输入正确的车牌号' }
      ],
      // personType: [{ type: 'required', message: '请选择人员类型' }],
      symptomDscr: [
        { type: 'required', message: '请详细描述涉事人相关信息' },
        { type: 'descLength', message: '描述信息长度不少于5' }
      ],
    },

    companyForm: { ...INIT_FORM },
    companyFormRules: { ...INIT_FORM_RULES },

    validateType: {
      clueVehicleLength (value) {
        console.log('clueVehicleLength', value)
        return !value || (value && value.length <= 8);
      },
      usernameLength(value){
        return !value || value.length < 50
      },
      contentLength (value) {
        return value.length > 10
      },
      titleLength (value) {
        return value.length <= 20
      },
      descLength(value){
        return value.length >= 5;
      },
      checkAnyOne(value, formData){
        if(formData.phone || formData.street || formData.clueVehicle){
          return true;
        }
        return false;
      }
    }
  },

  watch: {
    'selfForm.identityType': function (value) {
      const rules = this.data.selfFormRules || []
      let identityInputType = 'text'
      // 身份证 添加校验
      switch (parseInt(value)) {
        case 1:
          rules.identity[1] = { type: 'id', message: '请输入正确的身份证号码' }
          identityInputType = 'idcard'
          break;
        case 5:
          rules.identity[1] = { type: 'twCome', message: '请输入正确的证件号码' }
          break;
        case 6:
          rules.identity[1] = { type: 'hmHid', message: '请输入正确的证件号码' }
          break;
        case 7:
          rules.identity[1] = { type: 'hmHid', message: '请输入正确的证件号码' }
          break;
        default:
          rules.identity = rules.identity.slice(0, 1)
      }

      this.setData({
        selfFormRules: rules,
        identityInputType
      })
    },
    'selfForm.recentInHubei': function (value) {
      const rules = this.data.selfFormRules || []
      if (!!value) {
        console.log('动态规则', rules)
        rules.hubeiLivingCity = [
          { type: 'required', message: '请选择湖北的城市' }
        ]
      }
      else {
        delete rules.hubeiLivingCity
      }

      this.setData({
        selfFormRules: rules
      })
    },
    showVehicleKeyboard:function(value){
      console.log("键盘事件", value)
    }
  },

  onLoad (options) {
    var self = this;
    if (options.target) {
      this.setData({
        activeTab: options.target
      })
    }

    wx.showModal({
      title: '温馨提示',
      content: '感谢您提供疫情线索，请如实填报，尽量提供全面详细信息，以便工作人员核实情况',
      confirmText: '立即上报',
      success (res) {
        if (res.confirm) {
          console.log("立即上报");
          self.getRegionData()
        } else if (res.cancel) {
          console.log("取消");
          wx.navigateBack()
        }
      }
    })

    this.setData({
      headers: getRequestHeader()
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  handleTabChange (e) {
    this.setData({
      activeTab: e.detail.value.key
    })
  },

  handleOpenVehicleKeyboard(e) {
    // this.setData({
    //   showVehicleKeyboard: true
    // })
  },

  handleFormChange (e) {
    const { dataset, id } = e.target

    this.setData({
      [`${dataset.form}.${id}`]: e.detail.value
    })
  },
  //设置地图获取的位置信息
  bindSelectData(data) {
    this.setData({
      'selfForm.addr': data.detail.address
    })
  },
  // 车牌号键盘
  handlePlateChange(e) {
    console.log(e)
    this.setData({ 'selfForm.clueVehicle': e.detail.value })
  },
  //监听车牌关闭
  handlePlateClose(e){
    console.log("解决texteare内容穿透问题", e)
    this.setData({
      showVehicleKeyboard: e.detail
    })
  },
  // 获取当前街道
  handleGetLocation (e) {
    chooseLocation().then((resp) => {
      console.log(resp)
      const { dataset, id } = e.target

      this.setData({
        [`${dataset.form}.${id}`]: resp.address,
        [`${dataset.form}.lng`]: resp.longitude,
        [`${dataset.form}.lat`]: resp.latitude
      })
    })
  },
  handleHBPickerChange (e) {
    console.log(e)
    this.setData({
      'selfForm.hubeiLivingCity': e.detail.value[1].name,
      'selfForm.hubeiLivingCityCode': e.detail.value[1].code
    })
  },
  handleHBPickerOpen () {
    this.setData({
      showHBCityPicker: true
    })
  },
  handleHBPickerClose () {
    this.setData({
      showHBCityPicker: false
    })
  },

  // getRegionData
  getRegionData (region = {}, index = 0) {
    wx.showLoading()
    regionService.getRegionData(region.regionCode, region.regionList).then(regionList => {
      const regionRange = this.data.regionRange.slice(0, index)
      regionRange[index] = {
        title: index === 0 ? '区' : index === 1 ? '街道' : '社区',
        data: regionList.map(item => ({
          name: item.regionName,
          value: { regionName: item.regionName, regionCode: item.regionCode },
          regionList: item.regionList
        }))
      }

      this.setData({ regionRange }, () => wx.hideLoading())
    }).catch(e => wx.hideLoading())
  },

  // RegionChange
  handleOpenRegion (e) {
    // 暂存 picker form
    this.regionPickerForm = e.target.dataset.form
    this.setData({
      showRegionPicker: true,
      regionRange: this.data.regionRange.slice(0, 1)
    })
  },
  handleRegionChange (e) {
    const regionData = e.detail.value
    if (regionData.length === 3) {
      this.setData({
        [`${this.regionPickerForm}.regionData`]: regionData,
        [`${this.regionPickerForm}.street`]: regionData.map(item => item.regionName).join('')
      })
    }
  },

  handleRegionColumnChange (e) {
    const { item, index } = e.detail

    if (index === 2) {
      this.handleRegionClose()
    } else {
      this.getRegionData(item, index + 1)
    }
  },

  handleRegionClose () {
    this.setData({ showRegionPicker: false })
  },

  handleAgreeChange(){
    this.setData({ agree: !this.data.agree })
  },

  handleSocialContact1Change(e){
    this.setData({
      'selfForm.socialContact1': e.detail.value ? '11' : ''
    })
  },
  handleSocialContact2Change(e){
    this.setData({
      'selfForm.socialContact2': e.detail.value ? '12' : ''
    })
  },
  handleSocialContact3Change(e){
    this.setData({
      'selfForm.socialContact3': e.detail.value ? '13' : ''
    })
  },
  handleSocialContact4Change(e){
    this.setData({
      'selfForm.socialContact4': e.detail.value ? '14' : ''
    })
  },

  // 自主申报
  handleSelfSubmit (e) {
    if (e.detail.validStatus) {
      const formData = { ...e.detail.value }
      if(!(formData.socialContact1 || formData.socialContact2 || formData.socialContact3 || formData.socialContact4)) {
        return Event.dispatch(this.data.tipsEvent, '请选择涉事人类型')
      }

      formData.recentInHubei = formData.recentInHubei ? 1 : 0

      formData.clueSupplierPhone = this.data.userInfo.phone;
      // 整合街道数据
      const regionData = formData.regionData
      if(regionData){
        formData.city = config.cityName
        formData.cityCode = config.cityCode
        if(regionData.length > 0){
          formData.area = regionData[0].regionName
          formData.areaCode = regionData[0].regionCode
        }
        if(regionData.length > 1){
          formData.street = regionData[1].regionName
          formData.streetCode = regionData[1].regionCode
        }
        if(regionData.length > 2){
          formData.community = regionData[2].regionName
          formData.communityCode = regionData[2].regionCode
        }
      }
      
      // 类型，是上报  0，还是线索  1  clueType
      formData.clueType = 1
      
      formData.birthday = formatDate(formData.birthday);
      formData.returnDate = formatDate(formData.returnDate);
      formData.contactDateRecent = formatDate(formData.contactDateRecent);
      formData.quasiReturnDate = formatDate(formData.quasiReturnDate);

      if(formData.socialContact1 || formData.socialContact2 || formData.socialContact3 || formData.socialContact4){
        let arr = [];
        [formData.socialContact1, formData.socialContact2, formData.socialContact3, formData.socialContact4].map(v => {
          v && arr.push(v);
        })

        formData.socialContact = arr.join(",");
        
        delete formData.socialContact1;
        delete formData.socialContact2;
        delete formData.socialContact3;
        delete formData.socialContact4;
      }
      delete formData.regionData

      wx.showLoading()
      reportService.nCovSave(formData).then((resp) => {
        wx.hideLoading()
        wx.navigateTo({
          url: '../msg/index?source=report',
        })
      }).catch(() => wx.hideLoading())
    }
  },
})
