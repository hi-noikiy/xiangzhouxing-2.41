// 司乘信息编辑页.js
const { Anim, request, dayjs, wxp, config, userStore, configStore } = getApp()
const policeService = require('../../../../services/car-code/traffic-police')

const recentRegion_LISTS = [
  { name: '北京', ename: 'beijing' },
  { name: '天津', ename: 'tianjin' },
  { name: '上海', ename: 'shanghai' },
  { name: '重庆', ename: 'chongqing' },
  { name: '河北', ename: 'hebei' },
  { name: '山西', ename: 'shanxi' },
  { name: '内蒙古', ename: 'neimenggu' },
  { name: '辽宁', ename: 'liaoning' },
  { name: '吉林', ename: 'jilin' },
  { name: '黑龙江', ename: 'heilongjiang' },
  { name: '江苏', ename: 'jiangsu' },
  { name: '浙江', ename: 'zhejiang' },
  { name: '安徽', ename: 'anhui' },
  { name: '福建', ename: 'fujian' },
  { name: '江西', ename: 'jiangxi' },
  { name: '山东', ename: 'shandong' },
  { name: '河南', ename: 'henan' },
  { name: '湖北', ename: 'hubei' },
  { name: '湖南', ename: 'hunan' },
  { name: '广东', ename: 'guangdong' },
  { name: '广西', ename: 'guangxi' },
  { name: '海南', ename: 'hainan' },
  { name: '四川', ename: 'sichuan' },
  { name: '贵州', ename: 'guizhou' },
  { name: '云南', ename: 'yunnan' },
  { name: '西藏', ename: 'xizang' },
  { name: '陕西', ename: 'shanxi1' },
  { name: '甘肃', ename: 'gansu' },
  { name: '青海', ename: 'qinghai' },
  { name: '宁夏', ename: 'ningxia' },
  { name: '新疆', ename: 'xinjiang' },
  { name: '中国香港', ename: 'xianggang' },
  { name: '中国澳门', ename: 'aomen' },
  { name: '中国台湾', ename: 'taiwan' },
  { name: '国外', ename: 'guowai' }
]

function getRecentRegionLists() {
  let arr = [];
  recentRegion_LISTS.map(item => {
    arr.push({ name: item.name, value: item.name })
  })

  return arr;
}

const CONST = {
  identityType: {
    0: '未知',
    1: '身份证',
    2: '回乡证',
    3: '护照',
    4: '军官证',
    5: '台胞证',
    6: '港澳居民居住证',
    7: '台湾居民居住证',
    8: '港澳居民来往内地通行证',
    9: '台湾居民来往内地通行证',
    11: '出入境通行证',
  },
  chinese: {
    0: '未知',
    1: '中国大陆',
    2: '中国港澳台地区',
    3: '外国'
  },
}

Anim.Page({
  store: (store) => ({
    isLeader: store.user.userInfo.isLeader,
    isAuth: store.user.userInfo.isAuth,
    userInfo: store.user.userInfo,
    wllConfig: store.config.wllConfig
  }),

  computed: {
    baseInfo() {
      let info = {... this.data.passenger};

      Object.keys(info).forEach(key => {
        if (info[key] == null) {
          info[key] = '';
        }
      });
      
      // 转义
      Object.keys(CONST).forEach(key => {
        info[`${key}ZH`] = CONST[key][info[key]] || '';
      });

      return info;
    },

    otherSymptomItems() {
      return this.data.symptomItems.slice(3)
    }
  },

  /**
   * 页面的初始数据
   */
  data: {
    residentFlagItems: [
      { name: `是，在珠海居住了已有半年以上`, value: 1 },
      { name: `否，我是临时来珠海的`, value: 2 },
    ],
    residentConditionItems: [
      { name: `一直在珠海3个月或以上`, value: 1 },
      { name: `来或返回珠海超过14日`, value: 2 },
      { name: `来或返回珠海不超过14日（含14日）`, value: 3 },
      { name: `目前仍在外地`, value: 4 },
    ],
    residentPlaceItems: getRecentRegionLists(),
    travelRegionClassItems: [
      { name: `武汉`, value: 1 },
      { name: `湖北（不含武汉）`, value: 2 },
      { name: `中国大陆其他省(自治区)市`, value: 4 },
      { name: `中国港澳台地区`, value: 3 },
      { name: `国外`, value: 5 },
    ],
    socialContactItems: [
      { name: '14日内密切接触近期有湖北旅居史者', value: 1, desc: '近期有湖北旅居史者指：14日内来自湖北和去过湖北的人员' },
      { name: '自我感觉14日内曾与患者接触过者', value: 2, desc: '近期与确诊患者有接触，如乘搭同一交通工具等情况' },
    ],
    healthStateItems: [
      { name: '无不适', value: 1, desc: '自觉正常无不适症状' },
      { name: '居家健康服务', value: 2, desc: '珠海有固定住处，在家自我健康观察' },
      { name: '集中健康服务', value: 3, desc: '珠海无固定住处，如住酒店等实施集中健康观察' },
      { name: '集中医学观察', value: 4, desc: '在医疗机构医学观察' },
    ],
    symptomItems: [
      { name: '自觉正常', value: 1 },
      { name: '发热37.5 ℃以下', value: 11 },
      { name: '发热37.5 ℃（含）以上', value: 12 },
      { name: '干咳', value: 13 },
      { name: '乏力', value: 14 },
      { name: '其他症状', value: 15 },
    ],


    today: dayjs().format('YYYY-MM-DD'),
    startDay: dayjs().subtract(130, 'year').format('YYYY-MM-DD'),
    halfMonthAgo: dayjs().subtract(15, 'day').format('YYYY-MM-DD'),
    agree: false,

    formRules: {
      resident: [{ type: 'required', message: '请选择是否常住珠海' }],
      recent: [{ type: 'required', message: '请选择近期是否在珠海' }],
      healthState: [{ type: 'required', message: '请选择个人健康现状' }],
      symptomsContext: [{ type: 'remarkLength', message: '症状描述不超过10个汉字' }],
      remark: [{ type: 'remarkLength', message: '备注说明不超过100个汉字' }],
      d1: [],
      d2: [],
      d3: []
    },
    validateType: {
      tenLength(value) {
        return !value || value.length <= 10
      },
      remarkLength(value) {
        return !value || value.length <= 100
      },
      temperature(value, form) {
        if (form.healthState == 1) { // 无不适
          return true;
        }

        let code = form.symptomsCode.join(',');
        let down = code.includes('11');
        let up = code.includes('12');

        if (!down && !up) { // 没发烧
          return true;
        }

        let { d1 = '', d2 = '', d3 = '' } = form;
        let d = `${form.d1}${form.d2}.${form.d3}`;

        if (d === '.'){ // 体温没填
          return true;
        }

        if (d.length < 4) {
          return false
        }

        let dNum = Number.parseFloat(d);

        if ((down && dNum >= 37.5) || (up && dNum < 37.5)) {
          return false;
        } 
        
        return true;
      }
    },

    form: {
      resident: '',
      recent: '',
      currentLocation: '',
      proposedArriveTime: '',
      returnTime: '',
      sojourningHistory: '',
      touchRecent: '',
      touchTime: '',
      touchLike: '',
      touchTimeLike: '',
      healthState: '',
      symptomsCode: [],
      symptomsContext: '',
      remark: '',

      // 温度
      d1: '',
      d2: '',
      d3: ''
    },

    // 焦点信息
    focus: false,
    focus2: false,

    passenger: {},
    baseShow: false
  },

  watch: {
    'form.healthState': function (healthState) {
      let symptomsRules = [];

      if (parseInt(healthState) !== 1) {
        symptomsRules = [{ type: 'required', message: '请选择症状' }]
      }

      this.setData({
        'formRules.symptomsCode': symptomsRules
      })
    },
    'form.symptomsCode'() {
      this.initDisableContext();
      this.initFeverStatus();
    }
  },

  initForm(data) {
    Object.keys(this.data.form).forEach(key => {
      
      // 普通字段
      if (key !== 'symptomsCode' && data[key] != null) {
        let value = data[key];
        if (typeof value === 'string') {
          value = value.trim();
        }
        this.setData({
          [`form.${key}`]: value
        })
      }

      // touch
      if (typeof data['touch'] === 'string') {
        let list = data['touch'].split(',');
        if (list.indexOf('1') > -1) {
          this.setData({
            [`form.touchRecent`]: '1'
          })
        }
        if (list.indexOf('2') > -1) {
          this.setData({
            [`form.touchLike`]: '2'
          })
        }
      }
      
      // symptomsCode
      if (typeof data['symptomsCode'] === 'string') {
        this.setData({
          'form.symptomsCode': data['symptomsCode'].split(',')
        })
      }

      // 温度
      if (typeof data['temperature'] === 'string' && data['temperature'].trim()) {
        let list = data['temperature'].trim().split('.');
        if (list.length > 1 && list[0].length > 1) {
          this.setData({
            [`form.d1`]: list[0][list[0].length - 2],
            [`form.d2`]: list[0][list[0].length - 1],
            [`form.d3`]: list[1][0],
          })
        }
      }
    });

    this.initDisableContext();
    this.initFeverStatus();
  },

  /**
   * 初始化其他症状描述状态
   */
  initDisableContext() {
    wx.nextTick(() => {
      let codeList = this.data.form.symptomsCode || [];
      this.setData({
        disableContext: !codeList.includes('15'),
        'form.symptomsContext': ''
      });
    })
  },

  /**
   * 初始化发热状态
   */
  initFeverStatus() {
    wx.nextTick(() => {
      let rules = [];
      let value = this.data.form.symptomsCode || [];
      let status = 'none';
      if (value.includes('11')) {
        status = 'down'
        rules = [{ type: 'temperature', message: '体温超过37.4 ℃' }];
      } else if (value.includes('12')) {
        status = 'up';
        rules = [{ type: 'temperature', message: '体温低于37.5 ℃' }];
      }
      this.setData({
        feverStatus: status,
        'formRules.d1': rules,
        'formRules.d2': rules,
        'formRules.d3': rules
      });
    })
  },

  handleFormChange(e) {
    const { dataset, id } = e.target;
    const vm = this;
    let value = e.detail.value || '';

    if (id !== 'symptomsCode') { // 普通表单
      this.setData({
        [`${dataset.form}.${id}`]: value
      });

    } else { // 处理症状 特殊表单 同时也执行了互斥问题
      let oldData = this.data[dataset.form][id];
      let newData = [];
      let type = dataset.type;

      if (type === '0') { //正常
        this.setData({
          [`${dataset.form}.${id}`]: value
        });
      } else if (type === '1' || type === '2') { // 37.5以下
        newData = oldData.filter(item => item !== '1' && item !== '12' && item !== '11');
        if (value && value.length > 0) {
          vm.setData({
            'form.d1': '',
            'form.d2': '',
            'form.d3': '',
          });
        }
      } else if (type === '3') { // 其他
        let other = this.data.otherSymptomItems.map(item => `${item.value}`);
        newData = oldData.filter(item => item !== '1' && !other.includes(item));
      }

      this.setData({
        [`${dataset.form}.${id}`]: [...(value || []), ...newData]
      });
    }
  },

  // 温度控件 改变值
  handleTemperChange(e) {
    /*const { dataset, id } = e.target
    // 改变对应数据
    this.setData({
      [`${dataset.form}.${id}`]: e.detail.value
    });*/
  },
  // 温度控件 改变输入框焦点
  bindinput(e) {
    let value = e.detail.value || '';
    let [focus, focus2] = [false, false];
    value = value.replace(/[^0-9]/ig, '');
  
    let id = e.currentTarget.id;
    if ("d1" == id) {
      value = value.replace(/[^3|4]/ig, ''); // 只能填3 或者 4
      if (value != "") {
        focus2 = true
        focus = false
      }
      this.setData({
        focus,
        focus2,
        'form.d1': value
      });
    } else if ("d2" == id) {
      if (value != "") {
        focus = true
        focus2 = false
      } else {
        focus2 = true
        focus = false
      }
      this.setData({
        focus,
        focus2,
        'form.d2': value
      })
    } else {
      this.setData({
        focus: value === "",
        'form.d3': value
      })
    }
  },

  handleTouchRecentChange(e) {
    this.setData({
      'form.touchRecent': e.detail.value ? '1' : ''
    })
  },
  handleTouchLikeChange(e) {
    this.setData({
      'form.touchLike': e.detail.value ? '2' : ''
    })
  },
  handleAgreeChange() {
    this.setData({ agree: !this.data.agree })
  },

  /**
   * 切换基础信息的展示
   */
  handleToggleBase() {
    this.setData({
      baseShow: !this.data.baseShow
    })
  },

  /**
   * 提交表单
   */
  handleSubmit(e) {
    const  vm = this;
    if (e.detail.validStatus) {

      let gridPointId = vm.$route.query.gridPointId;

      if (!gridPointId && gridPointId !== 0) {
        wx.showModal({
          title: '温馨提示',
          content: '请先设置采集点',
          showCancel: false
        })
        
        return false;
      }

      // 获取经纬度
      wx.showLoading();
      wx.getLocation({
        type: 'wgs84',
        success(res) {
          
          let formData = vm.getFormData();

          // 添加gridPointId
          formData.gridPointId = vm.$route.query.gridPointId;

          // 添加行程id
          let registerId = vm.$route.query.registerId;
          if (registerId != null) {
            formData.registerId = vm.$route.query.registerId;
          }
          
          // 添加经纬度
          formData.lat = res.latitude;
          formData.lng = res.longitude;

          wx.showLoading();
          policeService.policeCheck(formData).then((resp) => {
            let backDelta = vm.$route.query.backDelta || 1;

            // 更新车辆查验信息
            let allPage = getCurrentPages();
            let parentVm = allPage[allPage.length - 1 - backDelta];
            parentVm.checkRegisterId();

            vm.$router.navigateBack(backDelta);
          }).catch((e) => {
            e && wx.showModal({
              title: '温馨提示',
              content: '服务器拥挤，请稍后再试',
              showCancel: false
            })
          }).then(() => {
            wx.hideLoading();
          });
        },
        complete() {
          wx.hideLoading();
        }
      });
    }
  },

  getFormData() {
    const vm = this;

    const formData = { ...vm.data.form };
    formData.reportPneumoniaId = vm.data.passenger.reportPneumoniaId;

    // 近期旅居史
    if (formData.recent == 1) {
      delete formData.sojourningHistory;
    }

    if (formData.recent != 4) {
      delete formData.currentLocation;
      delete formData.proposedArriveTime;
    }

    // 来或返回日期
    if (formData.recent != 3) {
      delete formData.returnTime;
    }

    // 近期接触史
    formData.touch = formData.touchRecent || "";
    if (formData.touchLike) {
      if (formData.touch) {
        formData.touch += ',';
      }
      formData.touch += formData.touchLike;
    } else {
      delete formData.touchTimeLike;
    }
    if (!formData.touchRecent) {
      delete formData.touchTime;
    }
    delete formData.touchRecent;
    delete formData.touchLike;

    // 个人健康状态
    if (formData.healthState == '1') {
      formData.symptomsCode = [];
    }

    // 症状
    formData.symptomsCode = formData.symptomsCode.join(',');
    
    if (!formData.symptomsCode.includes('15')) {
      delete formData.symptomsContext;
    }
    // 温度
    if (formData.symptomsCode.includes('11') || formData.symptomsCode.includes('12')) {
      let { d1, d2, d3 } = formData;
      if (d1 && d2 && d2 !== 0) {
        formData.temperature = `${d1}${d2}.${d3 || 0}℃`;
      }
    }
    delete formData.d1;
    delete formData.d2;
    delete formData.d3;

    return formData;
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const vm = this;

    vm.setData({
      passenger: vm.$route.query.passenger || {}
    });

    vm.initForm(vm.$route.query.passenger || {});
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