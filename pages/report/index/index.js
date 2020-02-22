// pages/report/index.js
const {
  Anim,
  Event,
  resetTab,
  config,
  dayjs,
  request,
  systemInfo
} = getApp()
const {
  chooseLocation
} = require('../../../utils/util')
const reportService = require('../../../services/report')
const regionService = require('../../../services/region')

const PROVINCE_LISTS = [{
    name: '北京',
    ename: 'beijing'
  },
  {
    name: '天津',
    ename: 'tianjin'
  },
  {
    name: '上海',
    ename: 'shanghai'
  },
  {
    name: '重庆',
    ename: 'chongqing'
  },
  {
    name: '中国香港',
    ename: 'xianggang'
  },
  {
    name: '中国澳门',
    ename: 'aomen'
  },
  {
    name: '河北',
    ename: 'hebei'
  },
  {
    name: '山西',
    ename: 'shanxi'
  },
  {
    name: '内蒙古',
    ename: 'neimenggu'
  },
  {
    name: '辽宁',
    ename: 'liaoning'
  },
  {
    name: '吉林',
    ename: 'jilin'
  },
  {
    name: '黑龙江',
    ename: 'heilongjiang'
  },
  {
    name: '江苏',
    ename: 'jiangsu'
  },
  {
    name: '浙江',
    ename: 'zhejiang'
  },
  {
    name: '安徽',
    ename: 'anhui'
  },
  {
    name: '福建',
    ename: 'fujian'
  },
  {
    name: '江西',
    ename: 'jiangxi'
  },
  {
    name: '山东',
    ename: 'shandong'
  },
  {
    name: '河南',
    ename: 'henan'
  },
  {
    name: '湖北',
    ename: 'hubei'
  },
  {
    name: '湖南',
    ename: 'hunan'
  },
  {
    name: '广东',
    ename: 'guangdong'
  },
  {
    name: '广西',
    ename: 'guangxi'
  },
  {
    name: '海南',
    ename: 'hainan'
  },
  {
    name: '四川',
    ename: 'sichuan'
  },
  {
    name: '贵州',
    ename: 'guizhou'
  },
  {
    name: '云南',
    ename: 'yunnan'
  },
  {
    name: '西藏',
    ename: 'xizang'
  },
  {
    name: '陕西',
    ename: 'shanxi1'
  },
  {
    name: '甘肃',
    ename: 'gansu'
  },
  {
    name: '青海',
    ename: 'qinghai'
  },
  {
    name: '宁夏',
    ename: 'ningxia'
  },
  {
    name: '新疆',
    ename: 'xinjiang'
  },
  {
    name: '中国台湾',
    ename: 'taiwan'
  },
]
const recentRegion_LISTS = [{
    name: '北京',
    ename: 'beijing'
  },
  {
    name: '天津',
    ename: 'tianjin'
  },
  {
    name: '上海',
    ename: 'shanghai'
  },
  {
    name: '重庆',
    ename: 'chongqing'
  },
  {
    name: '河北',
    ename: 'hebei'
  },
  {
    name: '山西',
    ename: 'shanxi'
  },
  {
    name: '内蒙古',
    ename: 'neimenggu'
  },
  {
    name: '辽宁',
    ename: 'liaoning'
  },
  {
    name: '吉林',
    ename: 'jilin'
  },
  {
    name: '黑龙江',
    ename: 'heilongjiang'
  },
  {
    name: '江苏',
    ename: 'jiangsu'
  },
  {
    name: '浙江',
    ename: 'zhejiang'
  },
  {
    name: '安徽',
    ename: 'anhui'
  },
  {
    name: '福建',
    ename: 'fujian'
  },
  {
    name: '江西',
    ename: 'jiangxi'
  },
  {
    name: '山东',
    ename: 'shandong'
  },
  {
    name: '河南',
    ename: 'henan'
  },
  {
    name: '湖北',
    ename: 'hubei'
  },
  {
    name: '湖南',
    ename: 'hunan'
  },
  {
    name: '广东',
    ename: 'guangdong'
  },
  {
    name: '广西',
    ename: 'guangxi'
  },
  {
    name: '海南',
    ename: 'hainan'
  },
  {
    name: '四川',
    ename: 'sichuan'
  },
  {
    name: '贵州',
    ename: 'guizhou'
  },
  {
    name: '云南',
    ename: 'yunnan'
  },
  {
    name: '西藏',
    ename: 'xizang'
  },
  {
    name: '陕西',
    ename: 'shanxi1'
  },
  {
    name: '甘肃',
    ename: 'gansu'
  },
  {
    name: '青海',
    ename: 'qinghai'
  },
  {
    name: '宁夏',
    ename: 'ningxia'
  },
  {
    name: '新疆',
    ename: 'xinjiang'
  },
  {
    name: '中国香港',
    ename: 'xianggang'
  },
  {
    name: '中国澳门',
    ename: 'aomen'
  },
  {
    name: '中国台湾',
    ename: 'taiwan'
  },
  {
    name: '国外',
    ename: 'guowai'
  }
]

function getRequestHeader() {
  return {
    openid: wx.getStorageSync('wx-openid'),
    sessionid: wx.getStorageSync('wx-sessionid'),
  }
}

function getPlaceValue(e) {
  let value = "";
  e.detail.value.map(item => {
    value += item.name;
  });

  return value;
}

function ifIdentity(value) {
  var id = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;

  return id.test(value);
}

function getProvinceLists() {
  let arr = [];
  PROVINCE_LISTS.map(item => {
    arr.push({
      name: item.name,
      value: item.name
    })
  })

  return arr;
}

function getRecentRegionLists() {
  let arr = [];
  recentRegion_LISTS.map(item => {
    arr.push({
      name: item.name,
      value: item.name
    })
  })

  return arr;
}

function formatDate(value) {
  if (value) {
    return dayjs(value).format('YYYY-MM-DD')
  }

  return value;
}

function getBirthdayFromIdcard(value = "") {
  const len = value.length;
  let birthday = "";
  if (len === 15) {
    birthday = "19".concat(value.substr(6, 6));
  } else if (len === 18) {
    birthday = value.substr(6, 8);
  }

  return birthday;
}

function getSexFromIdcard(value = "") {
  const len = value.length;
  let sex = "";
  if (len == 15) {
    if (parseInt(value.substr(14, 1)) % 2 == 1) {
      sex = "男"
    } else {
      sex = "女"
    }
  } else if (len >= 17) {
    if (parseInt(value.substr(16, 1)) % 2 == 1) {
      sex = "男"
    } else {
      sex = "女"
    }
  }

  return sex;
}

Anim.Page({
  store: (store) => ({
    userInfo: store.user.userInfo
  }),
  data: {
    pdfUrl: 'https://imgcache.gzonline.gov.cn/doc/Report_Health_Condition.pdf',
    imgSrc: "/images/report/caozuozhiyin.png",
    //当前页面类型
    currentType: '',
    // 区划数据
    regionData: [],
    today: dayjs().format('YYYY-MM-DD'),
    startDay: dayjs().subtract(130, 'year').format('YYYY-MM-DD'),
    halfMonthAgo: dayjs().subtract(15, 'day').format('YYYY-MM-DD'),
    cityName: config.cityName,
    headers: {},
    activeTab: 'self',
    showHBCityPicker: false,
    showRegionPicker: false,
    uploadUrl: `${config.domain}/report/uploadfile`,

    identityInputType: 'idcard',
    disableDetail: true,

    provinceIncludes: ['中国香港', '广东省'],

    regionRange: [],
    sexRange: [{
        name: '男',
        value: '男'
      },
      {
        name: '女',
        value: '女'
      },
    ],
    nationRange: [{
        name: '中国大陆',
        value: 1
      },
      {
        name: '中国港澳台地区',
        value: 2
      },
      {
        name: '外国',
        value: 3
      }
    ],
    domicilePlaceRange: [{
        name: '珠海市',
        value: 1
      },
      {
        name: '广东其他地市',
        value: 2
      },
      {
        name: '湖北省',
        value: 3
      },
      {
        name: '其他',
        value: 4
      },
    ],
    nativePlaceRange: getProvinceLists(),
    residentPlaceItems: getRecentRegionLists(),
    cardTypeRange: [{
        name: '身份证',
        value: 1
      },
      // { name: '回乡证', value: 2 },
      {
        name: '军官证',
        value: 4
      },
      {
        name: '护照',
        value: 3
      },
      {
        name: '港澳居民来往内地通行证',
        value: 8
      },
      {
        name: '台湾居民来往内地通行证',
        value: 9
      },
      // { name: '台胞证', value: 5 },
      {
        name: '港澳居民居住证',
        value: 6
      },
      {
        name: '台湾居民居住证',
        value: 7
      },
      {
        name: '出入境通行证',
        value: 11
      },
    ],
    residentFlagItems: [{
        name: `是，在珠海居住了已有半年以上`,
        value: 1
      },
      {
        name: `否，我是临时来珠海的`,
        value: 2
      },
    ],
    residentConditionItems: [{
        name: `一直在珠海3个月或以上`,
        value: 1
      },
      {
        name: `来或返回珠海超过14日`,
        value: 2
      },
      {
        name: `来或返回珠海不超过14日（含14日）`,
        value: 3
      },
      {
        name: `目前仍在外地`,
        value: 4
      },
    ],
    // residentPlaceItems: [
    //   { name: '北京', ename: 'beijing' },
    //   { name: '天津', ename: 'tianjin' },
    //   { name: '上海', ename: 'shanghai' },
    //   { name: '重庆', ename: 'chongqing' },      
    //   { name: '河北', ename: 'hebei' },
    //   { name: '山西', ename: 'shanxi' },
    //   { name: '内蒙古', ename: 'neimenggu' },
    //   { name: '辽宁', ename: 'liaoning' },
    //   { name: '吉林', ename: 'jilin' },
    //   { name: '黑龙江', ename: 'heilongjiang' },
    //   { name: '江苏', ename: 'jiangsu' },
    //   { name: '浙江', ename: 'zhejiang' },
    //   { name: '安徽', ename: 'anhui' },
    //   { name: '福建', ename: 'fujian' },
    //   { name: '江西', ename: 'jiangxi' },
    //   { name: '山东', ename: 'shandong' },
    //   { name: '河南', ename: 'henan' },
    //   { name: '湖北', ename: 'hubei' },
    //   { name: '湖南', ename: 'hunan' },
    //   { name: '广东', ename: 'guangdong' },
    //   { name: '广西', ename: 'guangxi' },
    //   { name: '海南', ename: 'hainan' },
    //   { name: '四川', ename: 'sichuan' },
    //   { name: '贵州', ename: 'guizhou' },
    //   { name: '云南', ename: 'yunnan' },
    //   { name: '西藏', ename: 'xizang' },
    //   { name: '陕西', ename: 'shanxi1' },
    //   { name: '甘肃', ename: 'gansu' },
    //   { name: '青海', ename: 'qinghai' },
    //   { name: '宁夏', ename: 'ningxia' },
    //   { name: '新疆', ename: 'xinjiang' },
    //   { name: '中国香港', ename: 'xianggang' },
    //   { name: '中国澳门', ename: 'aomen' },
    //   { name: '中国台湾', ename: 'taiwan' },
    //   { name: '国外', ename: 'guowai' }
    // ],
    travelRegionClassItems: [{
        name: `武汉`,
        value: 1
      },
      {
        name: `湖北（不含武汉）`,
        value: 2
      },

      {
        name: `温州市`,
        value: 6
      },
      {
        name: `中国大陆其他省(自治区)市`,
        value: 4
      },
      {
        name: `中国港澳台地区`,
        value: 3
      },
      {
        name: `国外`,
        value: 5
      },
    ],
    personTypeItems: [{
        name: `未返穗本地常住居民`,
        value: 1,
        desc: `在2020-1-1之后一直没返穗的本地常住居民。`
      },
      {
        name: `持续在穗人员`,
        value: 2,
        desc: `于2020-1-1之前到目前一直在穗人员。`
      },
      {
        name: `一月初返穗居民`,
        value: 3,
        desc: `在2020-1-1至2020-1-15间返穗本地常住居民。`
      },
      {
        name: `一月初来穗人员`,
        value: 4,
        desc: `在2020-1-1至2020-1-15间来穗外地临时人员。`
      },
      {
        name: `一月中返穗居民`,
        value: 5,
        desc: `于2020-1-15后返穗本地常住居民。`
      },
      {
        name: `一月中来穗人员`,
        value: 6,
        desc: `于2020-1-15后来穗外地临时人员。`
      },
      {
        name: `居家医学观察人员 `,
        value: 11
      },
      {
        name: `集中医学观察人员 `,
        value: 12
      },
    ],
    symptomItems: [{
        name: '自觉正常',
        value: 1
      },
      // { name: '发热', value: 2 },
      // { name: '干咳', value: 3 },
      // { name: '乏力', value: 4 },
      // { name: '腹泻', value: 5 },
      // { name: '感冒', value: 6 },
      // { name: '头疼头晕', value: 7 },
      {
        name: '发热37.3 ℃以下',
        value: 11
      },
      {
        name: '发热37.3 ℃（含）以上',
        value: 12
      },
      {
        name: '干咳',
        value: 13
      },
      {
        name: '乏力',
        value: 14
      },
      {
        name: '其他症状',
        value: 15
      },
    ],
    socialContactItems: [{
        name: '14日内密切接触近期有湖北旅居史者',
        value: 1,
        desc: '近期有湖北旅居史者指：14日内来自湖北和去过湖北的人员'
      },
      {
        name: '自我感觉14日内曾与患者接触过者',
        value: 2,
        desc: '近期与确诊患者有接触，如乘搭同一交通工具等情况'
      },
    ],
    healthStateItems: [{
        name: '正常活动',
        value: 1,
        desc: '自觉正常无不适症状'
      },
      {
        name: '居家健康服务',
        value: 2,
        desc: '珠海有固定住处，在家自我健康观察'
      },
      {
        name: '集中健康服务',
        value: 3,
        desc: '珠海无固定住处，如住酒店等实施集中健康观察'
      },
      {
        name: '集中医学观察',
        value: 4,
        desc: '在医疗机构医学观察'
      },
    ],

    showNativePlacePicker: false,

    agree: false,

    selfForm: {
      username: '',
      gender: '',
      isChinese: 1,
      nativePlace: '', // 户籍
      domicilePlace: '', // 户口所在地
      phone: '',
      birthday: '',
      identity: '',
      identityType: 1,
      street: '',
      addr: '',
      residentFlag: '',
      residentCondition: '',
      returnDate: '',
      recentRegionName: '',
      travelRegionClass: '',
      socialContact: '',
      socialContact1: '',
      socialContact2: '',
      quasiReturnDate: '',
      contactDateRecent: '',
      contactDateLike: '',
      // personType: '',
      healthState: '',
      // hubeiLivingCity: '',
      // hubeiLivingCityCode: '',
      // recentInHubei: false,
      symptoms: [],
      symptomDscr: '',
      regionData: [],
      clueType: 0
    },
    selfFormRules: {
      symptomDscr: [{
        type: 'symptomDscrLength',
        message: '其他症状描述不超过10个汉字'
      }],
      username: [{
        type: 'required',
        message: '请填写姓名'
      }],
      personType: [{
        type: 'required',
        message: '请选择人员类型'
      }],
      phone: [{
          type: 'required',
          message: '请输入中国大陆手机号码'
        },
        {
          type: 'mobile',
          message: '请输入中国大陆手机号码'
        },
      ],
      identityType: [{
        type: 'required',
        message: '请选择证件类型'
      }, ],
      identity: [{
          type: 'required',
          message: '请输入证件号码'
        },
        {
          type: 'id',
          message: '请输入正确的身份证号码'
        },
      ],
      birthday: [{
          type: 'required',
          message: '请选择正确的出生日期'
        },
        {
          type: 'birthdayLength',
          message: '请选择正确的出生日期'
        },
      ],
      street: [{
        type: 'required',
        message: '请选择居住地址'
      }, ],
      addr: [{
        type: 'required',
        message: '请输入详细住址'
      }, ],
      gender: [{
        type: 'required',
        message: '请选择性别'
      }],
      residentFlag: [{
        type: 'required',
        message: '请选择是否常住珠海'
      }],
      residentCondition: [{
        type: 'required',
        message: '请选择近期是否在珠海'
      }],
      //travelRegionClass: [{ type: 'required', message: '请选择近期旅居史' }],      
      healthState: [{
        type: 'required',
        message: '请选择个人健康现状'
      }],
    },

    validateType: {
      symptomDscrLength(value) {
        return value.length <= 10
      },
      contentLength(value) {
        return value.length > 10
      },
      titleLength(value) {
        return value.length <= 20
      },
      checkBirthday(value) {
        if (!birthday)
          return false;
        let age = dayjs().diff(dayjs(value).format("YYYY-MM-DD"), "year");
        return age >= 0 && age <= 130;
      }
    }
  },
  //设置地图获取的位置信息
  bindSelectData(data) {
    this.setData({
      'selfForm.addr': data.detail.address
    })
  },

  watch: {

    'selfForm': function(data) {
      console.log('selfForm Data Change', data)
    },
    'selfForm.identityType': function(value) {
      const rules = this.data.selfFormRules || []
      let identityInputType = 'text'
      // 身份证 添加校验
      switch (parseInt(value)) {
        case 1:
          identityInputType = 'idcard'
          rules.identity[1] = { type: 'id', message: '请输入正确的身份证号码' }
          break;
        case 5:
          rules.identity[1] = { type: 'twCome', message: '请输入正确的证件号码' }
          break;
        case 6:
        case 7:
          rules.identity[1] = { type: 'hmHid', message: '请输入正确的证件号码' }
          break;
        default:
          rules.identity = rules.identity.slice(0, 1)
      }

      this.setData({
        identityInputType: identityInputType,
        selfFormRules: rules
      })
    },
    'selfForm.symptoms': function(value = []) {

      let _disableDetail = value.indexOf('15') === -1;
      let curValue = value.slice(-1)[0];
      let bChange = false;
      if (curValue != 1) {
        //没有选择自觉正常的情况
        value.forEach((ele, index) => {
          if (ele == 1) {
            value.splice(index, 1);
            bChange = true;
          }
        })
      } else {
        // 当前选择的是自觉正常
        value.forEach((ele, index) => {
          if (ele != 1) {
            value = ["1"]
            bChange = true;
          }
        })
      }
      if (curValue == 11) {
        let index = value.indexOf("12");
        if (index > -1) {
          value.splice(index, 1);
          bChange = true;
        }
      } else if (curValue == 12) {
        let index = value.indexOf("11");
        if (index > -1) {
          value.splice(index, 1);
          bChange = true;
        }
      }
      bChange && this.setData({
        'selfForm.symptoms': value
      });
      let symptomsRules = []

      if (!_disableDetail) {
        symptomsRules = [{
          type: 'required',
          message: '请输入其他症状'
        }, {
          type: 'symptomDscrLength',
          message: '其他症状描述不超过10个汉字'
        }]
      }
      this.setData({
        disableDetail: _disableDetail,
        'selfFormRules.symptomDscr': symptomsRules
      })
    },
    'selfForm.birthday': function(value) {
      // console.log(value);
      try {
        if (value && dayjs(dayjs(value).format("YYYY-MM-DD")).isValid()) {
          let _idBirthday = getBirthdayFromIdcard(value);
          if (dayjs().diff(dayjs(value).format("YYYY-MM-DD"), "year") > 130 ||
            (_idBirthday && Math.abs(dayjs(_idBirthday).format("YYYYMMDD").diff(dayjs(value).format("YYYY-MM-DD"), "year") > 1))
          ) {
            const rules = this.data.selfFormRules || [];
            rules.birthday.push({
              type: 'checkBirthday',
              message: '请输入正确的出生日期'
            });
            this.setData({
              selfFormRules: rules
            })
          }
        }
      } catch (e) {}
    },
    'selfForm.residentCondition': function(healthState) {
      let symptomsRules = []

      if (parseInt(healthState) !== 1) {
        symptomsRules = [{
          type: 'required',
          message: '请选择近一个月旅居史'
        }]
      }
      this.setData({
        'selfFormRules.travelRegionClass': symptomsRules
      })
    },

    'selfForm.healthState': function(healthState) {
      let symptomsRules = []


      symptomsRules = [{
        type: 'required',
        message: '请选择症状'
      }]


      this.setData({
        'selfFormRules.symptoms': symptomsRules
      })
    },
    'selfForm.residentCondition': function(residentCondition) {
      let symptomsRules = []

      if (parseInt(residentCondition) !== 1) {
        symptomsRules = [{
          type: 'required',
          message: '请选择近一个月旅居史'
        }]
      }

      this.setData({
        'selfFormRules.travelRegionClass': symptomsRules
      })
    },


    'selfForm.socialContact': function(value) {
      console.log('selfForm.socialContact', value);
      // value.length > 0 && value.indexOf('0') > -1
    }
  },
  computed: {
    showContactDateRecent() {
      return this.data.selfForm.socialContact.length > 0 && this.data.selfForm.socialContact.indexOf('1') > -1;
    },
    showContactDateLike() {
      return this.data.selfForm.socialContact.length > 0 && this.data.selfForm.socialContact.indexOf('2') > -1;
    }
  },

  onLoad(options) {
    console.log('onload options:', options)
    //设置当前所处的页面
    this.setData({
      currentType: options.type
    })
    if (options.type == 1 || options.type == 2) {
      const title = ["健康自查上报", "上报我的健康信息", "为他人上报健康状况"];
      console.log("title[options.type]", title[options.type]);
      wx.setNavigationBarTitle({
        title: title[options.type]
      });
      this.setData({
        'selfForm.clueType': options.type == 2 ? 2 : 0
      })
    }

    if (options.target) {
      this.setData({
        activeTab: options.target
      })
    }

    if (options.isFromBuy) {
      this.isFromBuy = parseInt(options.isFromBuy)
    }

    this.getRegionData()
    this.setData({
      headers: getRequestHeader()
    })
    // 获取用户上次提交的数据
    let currentKey = null;
    currentKey = options.type == "1" ? "fromDataKey" : "fromOtherKey"
    this.getStorage(currentKey)
      .then((value) => {
        //设置如果没有区划数据设置为1
        if (options.type == '1') {
          this.setData({
            regionData: value.regionData, //设置上一次的区划数据
            disableDetail: value.disableDetail,
            'selfForm.gender': value.formData.gender,
            'selfForm.username': value.formData.username,
            'selfForm.isChinese': value.formData.isChinese,
            'selfForm.domicilePlace': value.formData.domicilePlace,
            'selfForm.nativePlace': value.formData.nativePlace,
            'selfForm.phone': value.formData.phone,
            'selfForm.identityType': value.formData.identityType,
            'selfForm.identity': value.formData.identity,
            'selfForm.birthday': value.formData.birthday,
            'selfForm.street': value.formData.street,
            'selfForm.addr': value.formData.addr,
            'selfForm.residentFlag': value.formData.residentFlag,
            'selfForm.residentCondition': value.formData.residentCondition,
            'selfForm.returnDate': value.formData.returnDate,
            'selfForm.recentRegionName': value.formData.recentRegionName,
            'selfForm.quasiReturnDate': value.formData.quasiReturnDate,
            'selfForm.travelRegionClass': value.formData.travelRegionClass,
            'selfForm.socialContact1': value.formData.socialContact1,
            'selfForm.contactDateRecent': value.formData.contactDateRecent,
            'selfForm.socialContact2': value.formData.socialContact2,
            'selfForm.contactDateLike': value.formData.contactDateLike,
            'selfForm.healthState': value.formData.healthState,
            'selfForm.symptoms': value.formData.symptoms,
            'selfForm.symptomDscr': value.formData.symptomDscr,
          })
        } else {
          this.setData({
            regionData: value.regionData, //设置上一次的区划数据
            'selfForm.street': value.formData.street,
            'selfForm.addr': value.formData.addr,
          })

        }




      })
      .catch((err) => {
        console.log('user data error', err);
      });
  },


  /**
   * 设置本地缓存
   */
  setStorage(key, value) {
    return new Promise((resolve, reject) => {
      wx.setStorage({
        key,
        data: value,
        success(res) {
          resolve(res);
        },
        fail(res) {
          reject(res);
        }
      });
    });
  },

  /**
   * 获取本地缓存
   */
  getStorage(key) {
    return new Promise((resolve, reject) => {
      wx.getStorage({
        key,
        success(res) {
          resolve(res.data);
        },
        fail(res) {
          reject(res);
        }
      });
    });
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  handleIdentityChange(e) {
    if (ifIdentity(e.detail.value)) {
      let sex = getSexFromIdcard(e.detail.value);
      let birthday = getBirthdayFromIdcard(e.detail.value);
      if (birthday && dayjs(dayjs(birthday).format("YYYYMMDD")).isValid() && dayjs().diff(dayjs(birthday).format("YYYYMMDD"), "year") <= 130) {
        this.setData({
          'selfForm.birthday': dayjs(birthday).format("YYYY-MM-DD")
        });
      }
      this.setData({
        'selfForm.gender': sex,
        'selfForm.identity': e.detail.value
      });
    } else {
      this.setData({
        'selfForm.identity': e.detail.value
      });
    }
  },

  handleTabChange(e) {
    this.setData({
      activeTab: e.detail.value.key
    })
  },

  handleFormChange(e) {



    const {
      dataset,
      id
    } = e.target

    this.setData({

      [`${dataset.form}.${id}`]: e.detail.value
    })
  },
  handleNationChange(e) {
    this.setData({
      'selfForm.isChinese': e.detail.value ? 1 : 0
    })
  },
  handleSocialContact1Change(e) {
    this.setData({
      'selfForm.socialContact1': e.detail.value ? '1' : ''
    })
  },
  handleSocialContact2Change(e) {
    this.setData({
      'selfForm.socialContact2': e.detail.value ? '2' : ''
    })
  },

  // 获取当前街道
  handleGetLocation(e) {
    chooseLocation().then((resp) => {
      console.log(resp)
      const {
        dataset,
        id
      } = e.target

      this.setData({
        [`${dataset.form}.${id}`]: resp.address,
        [`${dataset.form}.lng`]: resp.longitude,
        [`${dataset.form}.lat`]: resp.latitude
      }, resetTab)
    })
  },
  handleHBPickerChange(e) {
    this.setData({
      'selfForm.hubeiLivingCity': e.detail.value[1].name,
      'selfForm.hubeiLivingCityCode': e.detail.value[1].code
    })
  },
  handleNativePlaceChange(e) {
    this.setData({
      'selfForm.nativePlace': e.detail.value[0].name,
    })
  },
  handleHBPickerOpen() {
    this.setData({
      showHBCityPicker: true
    })
  },
  handleHBPickerClose() {
    this.setData({
      showHBCityPicker: false
    })
  },
  handleNativePlaceClose() {
    this.setData({
      showNativePlacePicker: false
    })
  },

  // 籍贯
  handleNativePlaceOpen(e) {
    this.setData({
      showNativePlacePicker: true,
    })
  },

  // getRegionData
  getRegionData(region = {}, index = 0) {
    wx.showLoading()
    regionService.getRegionData(region.regionCode, region.regionList).then(regionList => {
      const regionRange = this.data.regionRange.slice(0, index)
      regionRange[index] = {
        title: index === 0 ? '区' : index === 1 ? '街道' : '社区',
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

  // RegionChange
  handleOpenRegion(e) {
    // 暂存 picker form
    this.regionPickerForm = e.target.dataset.form
    this.setData({
      showRegionPicker: true,
      regionRange: this.data.regionRange.slice(0, 1)
    })
  },
  handleRegionChange(e) {
    const regionData = e.detail.value
    if (regionData.length === 3) {
      this.setData({
        [`${this.regionPickerForm}.regionData`]: regionData,
        [`${this.regionPickerForm}.street`]: regionData.map(item => item.regionName).join('')
      })
    }
  },

  handleRegionColumnChange(e) {
    const {
      item,
      index
    } = e.detail

    if (index === 2) {
      this.handleRegionClose()
    } else {
      this.getRegionData(item, index + 1)
    }
  },

  handleRegionClose() {
    this.setData({
      showRegionPicker: false
    })
  },

  handleAgreeChange() {
    this.setData({
      agree: !this.data.agree
    })
  },

  // 点击获取微信绑定手机，并填入
  getPhoneNumber(e) {
    const {
      iv,
      encryptedData
    } = e.detail
    console.log(1, iv, encryptedData);
    if (!iv || !encryptedData) {
      console.error('用户拒绝授权登录')
      return
    }

    wx.showLoading({
      title: '努力加载中...'
    })
    return request({
        url: `/wll/account/getphone`,
        method: 'POST',
        data: {
          encryptedData,
          iv
        }
      })
      .then(res => {
        wx.hideLoading()
        console.log('res', res)

        if (res && res.phone) {

          this.setData({
            'selfForm.phone': res.phone
          })

        }

      })
      .catch(err => {
        wx.hideLoading()
        console.error(err)
      })


  },

  // 自主申报
  handleSelfSubmit(e) {
    if (e.detail.validStatus) {
      const formData = { ...e.detail.value
      }
      // 类型，是上报  0，还是线索  1 clueType
      // formData.clueType = 0  
      formData.systemInfo = systemInfo


      //把用户提交的数据添加到缓存种

      var regionData = formData.regionData
      if (regionData.length == 0 || regionData == undefined) {
        regionData = this.data.regionData

      }
      const fromDataKey = {}
      fromDataKey.formData = formData
      //设置其他症状是否可以选择
      fromDataKey.disableDetail = this.data.disableDetail
      fromDataKey.regionData = regionData
      if (this.data.currentType == "1") {
        this.setStorage('fromDataKey', fromDataKey)
          .catch(err => {
            console.error(err);
          });
      } else if (this.data.currentType == "2") {
        this.setStorage('fromOtherKey', fromDataKey)
          .catch(err => {
            console.error(err);
          });
      }
      formData.recentInHubei = formData.recentInHubei ? 1 : 0

      // 整合街道数据


      try {
        if (regionData.length != 0) {
          formData.areaCode = regionData[0].regionCode
          formData.street = regionData[1].regionName
          formData.streetCode = regionData[1].regionCode
          formData.community = regionData[2].regionName
          formData.communityCode = regionData[2].regionCode
          formData.area = regionData[0].regionName
        }

      } catch (e) {
        console.log(e)

      }



      formData.city = config.cityName
      formData.cityCode = config.cityCode



      formData.birthday = formatDate(formData.birthday);
      formData.returnDate = formatDate(formData.returnDate);
      formData.contactDateRecent = formatDate(formData.contactDateRecent);
      formData.quasiReturnDate = formatDate(formData.quasiReturnDate);
      formData.contactDateLike = formatDate(formData.contactDateLike);

      if (formData.socialContact1 || formData.socialContact2) {
        formData.socialContact = formData.socialContact1 || "";
        if (formData.socialContact2) {
          formData.socialContact = formData.socialContact + (formData.socialContact ? "," : "") + formData.socialContact2;
        }
        delete formData.socialContact1;
        delete formData.socialContact2;
      }

      formData.symptoms = formData.symptoms.map(value => {
        return parseInt(value);
      });

      if (formData.residentFlag) {
        formData.residentFlag = parseInt(formData.residentFlag);
      }
      if (formData.residentCondition) {
        formData.residentCondition = parseInt(formData.residentCondition);
      }
      if (formData.travelRegionClass) {
        formData.travelRegionClass = parseInt(formData.travelRegionClass);
      }
      if (formData.healthState) {
        formData.healthState = parseInt(formData.healthState);
      }


      delete formData.regionData

      wx.showLoading()
      reportService.nCovSave(formData).then((resp) => {
        formData.clueType == 0 && wx.setStorageSync('selfForm__submit', true)
        wx.hideLoading()
        if (this.isFromBuy) {
          wx.navigateTo({
            url: `../msg/index?isFromBuy=${this.isFromBuy}`
          })
        } else {
          wx.navigateTo({
            url: '../msg/index?info=' + JSON.stringify(formData)
          })
        }

      }).catch(() => {
        wx.hideLoading()
        wx.showToast({
          title: '服务器拥挤，请稍后再试',
          icon: 'none'
        })
      })
    }
  },
})