// pages/donate/form/index.js
const {
  Anim,
  dayjs,config
} = getApp();
const buyService = require('../../services/buy')
const feedbackService = require('../../../../services/feedback')
const { getBuyFlowInfo } = require('../../utils/util')
const pharmacy = require('./pharmacy')
const addressMixin =require('../mixins/addressMixin')

Anim.Page({
  mixins:[addressMixin],
  store(state) {
    return {
      userInfo: state.user.userInfo,
      wllConfig: state.config.wllConfig
    }
  },
  data: {
    pdfUrl: 'https://imgcache.gzonline.gov.cn/doc/Mask_Appointment.pdf',
    imgSrc: "/images/report/caozuozhiyin.png",
    // 区划数据
    regionData: [],
    // 药店数据
    shopRange: [],
    // 默认百分之20的概率，会读取cdn配置
    probability: 20,
    unit: '',
    limit: '',
    min_order_number: '',// 最小购买数量
    price: '', // 价格
    number: '', //数量
    // 是否提示过订阅消息
    isSelSubscribeMessage: false,
    // 剩余秒数
    remainTime: 0,
    // 倒计时
    countdown: 0,
    countdownInterval: null,
    // 是否结束
    isFinish: false,
    formData: {
      name: "", //姓名
      shop_id: "", //药店ID
      category: "",
      zone: '', // 区域
      commodity_id: "", //药品ID
      number: '', //数量
      changeable: 'yes', //可调配: yes | no
      access: '', //购买方式 0-快递 1到店自取
      time_code: '', //到店时间代码:上午为0，下午为1,
      wxmsg: 2, // 是否订阅消息 1：是 2：否
      identity: '',
      identityType: '身份证',
      mail_address: '',
    },
    categoryRange: [], // 口罩类型
    typeRange: [], // 口罩型号
    accessItems: [],
    timeRange: [{
        name: '上午09:00-13:00',
        value: '0',
        displayName: '上午09:00-13:00'
      },
      {
        name: '下午13:00-17:00',
        value: '1',
        displayName: '下午13:00-17:00'
      }
    ],
    acceptItems: [{
        name: '接受',
        value: 'yes'
      },
      {
        name: '不接受',
        value: 'no'
      }
    ],
    cardTypeRange: [
      { name: '身份证', value: '身份证' },
      { name: '回乡证', value: '回乡证' },
      { name: '护照', value: '护照' },
      { name: '军官证', value: '军官证' },
      { name: '台胞证', value: '台胞证' },
      { name: '港澳居民居住证', value: '港澳居民居住证' },
      { name: '台湾居民居住证', value: '台湾居民居住证' },
    ],
    identityInputType: 'idcard',
    addrIconSrc: "https://imgcache.gzonline.gov.cn/cos/address_8b6a738f.svg",
    shopAddr: "", // 药店地址文本
    copyButtonDisabled:false,
    copyButtonText:'一键粘贴',
    ifShowCopyButton:false,
    copyButtonIconSrc:'https://imgcache.gzonline.gov.cn/cos/copy_dd1194a0.png'
    // copyButtonIconSrc:'/images/home/copy.png',
  },
  computed: {
    // 提交按钮文案
    primaryText() {
      if (this.data.isFinish) {
        return '已结束，请明天再来';
      } else if (this.data.remainTime > 0) {
        let buy_flow_info = getBuyFlowInfo(this.data.wllConfig);
        let text = '预约登记稍后开始';
        if (buy_flow_info.start_time) {
          text = `每天${buy_flow_info.start_time}点开始预约登记`;
        }
        return text;
      } else if (this.data.countdown > 0) {
        return `请(${this.data.countdown})秒后重试`;
      } else {
        return `提交`;
      }
    },
    showGtips() {
      return this.data.remainTime > 0;
    },
    buyType () {
      return this.data.wllConfig.buy_type;
    },
    submitBtnDisabled() {
      return (
        this.data.isFinish ||
        this.data.remainTime > 0 ||
        this.data.countdown > 0
      );
    },
    rules() {
      const {
        formData
      } = this.data;
      const rules = {
        name: [
          {
            type: 'required',
            message: '请输入姓名'
          }
        ],
        identityType: [{ type: 'required', message: '请选择证件类型' },],
        identity: [{ type: 'required', message: '请输入证件号码' },],
        zone: [
          {
            type: 'required',
            message: '请选择所在区域'
          }
        ],
        shop_id: [
          {
            type: 'required',
            message: '请选择药店'
          }
        ],
        category: [
          {
            type: 'required',
            message: '请选择口罩类型'
          }
        ],
        commodity_id: [{
          type: 'required',
          message: '请选择口罩型号'
        }],
        number: [{
          type: 'required',
          message: '请输入购买数量'
        }]
      };
      return rules;
    }
  },

  watch: {
    'formData.identityType': function (val) {
      this.setData({
        identityInputType: val === '身份证' ? 'idcard' : 'text',
      });
    },
    'formData.access': function (val) {
      const rules = this.data.rules || []
      delete rules.time_code
      delete rules.mail_address
      // 身份证 添加校验
      switch (parseInt(val)) {
        case 0:
          if(this.data.buyType === 'lot'){
            rules.mail_address = [{
              type: 'required',
              message: '请选择邮寄地址'
            }]
          }
          break;
        case 1:
          rules.time_code = [{
            type: 'required',
            message: '请选择到店时段'
          }]
          break;
        default:

      }
      this.setData({
        rules
      })
      this.restRegionData(val)
    },
    'formData.zone': function (regionName) {
      if (!regionName) return
      this.resetShopInfo(regionName)
    },
    'formData.shop_id': function (shopId) {
      if (!shopId) return

      const shop = this.shopList.find(item => item.ext_shop_id === shopId)
      this.shop = shop

      this.setData({
        shopAddr: shop.address,
        categoryRange: shop.class_list.map(item => {
          item.value = item.name
          return item
        }),
        'formData.category': '',
        'formData.commodity_id': '',
        'limit': '',
        typeRange: [],
      })
    },
    // 如果选项都只有一个的话，就直接帮用户填写这个值
    'regionData': function (newRegionData) {
      if (!newRegionData) return

      if (newRegionData.length == 1) {
        this.setData({
          'formData.zone': newRegionData[0].value
        })
      }
    },
    'shopRange':function(newshopRange){
      if(!newshopRange) return

      if(newshopRange.length == 1){
        this.setData({
          'formData.shop_id':newshopRange[0].value
        })
      }
    },
    'categoryRange':function(newCategoryRange){
      if(!newCategoryRange) return
      if(newCategoryRange.length == 1){
        this.setData({
          'formData.category':newCategoryRange[0].value,
          typeRange: newCategoryRange[0].commodity_list.map(item => {
            return { ...item, value: item.id }
          }),
        })
      }
    },
    'typeRange':function(newTypeRange){
      if(!newTypeRange) return
      if(newTypeRange.length == 1){
        this.setData({
          'formData.commodity_id': newTypeRange[0].value,
          'unit': newTypeRange[0].unit,
          'limit': newTypeRange[0].pre_order_number,
          'formData.number': newTypeRange[0].pre_order_number,
          'min_order_number': newTypeRange[0].min_order_number,
          'price': newTypeRange[0].price,
          'price_text': newTypeRange[0].price_text,
          'number': newTypeRange[0].number,
        })
      }
    }
  },

  onLoad() {
    this.getRemainTime();
    this.getPharmacyData();
    this.showCopyButton()
  },

  //根据健康申报缓存是否存在决定是否展示一件复制信息的按钮
  showCopyButton(){
    let cacheSelfFormData = wx.getStorageSync('selfForm__data');
    if (cacheSelfFormData) {
      this.setData({
        ifShowCopyButton: true
      })
    }
  },

  // 获取药店数据
  getPharmacyData() {
    wx.showLoading()
    buyService.getPharmacyData()
      .then(resp => {
        wx.hideLoading()
        // resp.data = pharmacy;
        let pharmacyList = resp.data.list;
        const access = resp.data.access
        const accessItems = [{
            name: `快递到家`,
            value: '0',
            desc: this.data.wllConfig.lot_flow_info.express_text
          },
          {
            name: `到店购买`,
            value: '1'
          }
        ]
        if (access != 2) {
          this.setData({
            'formData.access': access,
            accessItems: accessItems.filter(item => item.value === access),
            pharmacyList
          })
        } else {
          this.setData({
            'formData.access': '0',
            accessItems,
            pharmacyList
          })
        }
        this.restRegionData('0')

      })
      .catch(e => wx.hideLoading())
  },
  restRegionData(access) {
    const pharmacyList = this.data.pharmacyList
    const shopData = this.shopData = (pharmacyList || []).filter((item) => {
      return item.shop_list && item.shop_list.filter(shop => shop.access === access || shop.access === '2').length > 0
    })
    this.setData({
      'formData.zone': '',
      'formData.shop_id': '',
      'formData.category': '',
      'formData.commodity_id': '',
      'limit': '',
      categoryRange: [],
      typeRange: [],
      regionData: shopData.map(item => ({
        name: item.name,
        value: item.name
      })),
    })
  },
  //重置药店、口罩类型和口罩型号
  resetShopInfo(regionName,access){

    regionName = regionName|| this.data.formData.zone
    access = access || this.data.formData.access
    const shop = this.shopData.find(item => item.name === regionName)
    const shopList = (shop && shop.shop_list) || []
    this.shopList = shopList

    this.setData({
      shopRange: shopList.filter(item => item.access === access  || item.access === '2')
      .map(item => ({
        name: item.name,
        value: item.ext_shop_id
      })),
      'formData.shop_id': '',
      'formData.category': '',
      'formData.commodity_id': '',
      'limit': '',
      categoryRange: [],
      typeRange: [],
    })
  },
  // 获取预约状态
  getPreorderStatus() {
    wx.showLoading({
      title: '努力加载中...',
      mask: true
    });
    let self = this;
    buyService.getPreorderStatus()
      .then(res => {
        wx.hideLoading();
        let {
          status
        } = res;
        // preorder|finish|wait
        if (status === 'finish') {
          this.setData({
            isFinish: true,
          });
          wx.navigateTo({
            url: '/packages/buy/pages/over/index'
          })
        } else if (status === 'wait') {
          this.sysBusy("口罩还在准备中，请您耐心等待");
        }
        else {
          self.submitData();
        }
      })
      .catch(e => {
        wx.hideLoading();
        this.sysBusy(e && e.detailErrMsg);
      });
  },

  getRemainTime () {
    this.setTimeStatus();
    setInterval(() => {
      this.setTimeStatus();
    }, 1000);
  },

  getHourAndMinute (time) {
    let result = { hour: 0, minute: 0 };
    let temstartTime = String(time).split(':');
    result.hour = Number(temstartTime[0]);
    if (temstartTime.length > 1) {
      result.minute = Number(temstartTime[1]);
    }
    return result;
  },

  // 设置时间状态
  setTimeStatus () {
    let buy_flow_info = getBuyFlowInfo(this.data.wllConfig);
    let temStartTime =this.getHourAndMinute(buy_flow_info.start_time);
    let remainTime = (dayjs()
        .set('hour', temStartTime.hour)
        .set('minute', temStartTime.minute)
        .set('second', 0)
        .set('millisecond', 0)
        .valueOf() -
      dayjs().valueOf()) /
      1000;
    let temEndTime =this.getHourAndMinute(buy_flow_info.end_time);
    this.setData({
      remainTime: Math.floor(remainTime - 1),
      isFinish: dayjs()
          .set('hour', temEndTime.hour)
          .set('minute', temEndTime.minute)
          .set('second', 0)
          .set('millisecond', 0)
          .valueOf() -
        dayjs().valueOf() <=
        0,
    });
  },

  // 设置倒计时
  setCountdown() {
    this.data.countdownInterval && clearInterval(this.data.countdownInterval);
    this.setData({
      countdown: 5
    });
    let countdownInterval = setInterval(() => {
      let countdown = this.data.countdown - 1;
      if (countdown <= 0) {
        countdown = 0;
        this.data.countdownInterval &&
          clearInterval(this.data.countdownInterval);
      }
      this.setData({
        countdown: countdown
      });
    }, 1000);
    this.setData({
      countdownInterval: countdownInterval
    });
  },

  isLucky() {
    let buy_flow_info = getBuyFlowInfo(this.data.wllConfig);
    let probability = buy_flow_info.probability || this.data.probability;
    let lucky = probability >= Math.floor(Math.random() * 100);
    if (!lucky) {
      this.setCountdown();
    }
    return lucky;
  },

  submitData() {
    wx.showLoading({
      title: '努力加载中...',
      mask: true
    });
    const formData = this.data.formData
    if (this.data.chooseAddrFail) {
      formData.mail_address = `${formData.userName},${formData.telNumber},${formData.street},${formData.addr}`;
    }
    let params = Object.assign({ mobile: this.data.userInfo.phone },
      this.data.formData);
    params.idcard = this.data.formData.identityType + ',' + this.data.formData.identity;
    buyService.preorderAdd(params)
      .then(res => {
        wx.hideLoading();
        wx.setStorageSync(
          this.data.userInfo.phone + 'receive_' + dayjs().format('YYYY_MM_DD'),
          true);
        // 提交成功了，重定向到成功页
        wx.redirectTo({
          url: "/packages/buy/pages/result-ok/index"
        });
      })
      .catch(e => {
        wx.hideLoading();
        this.sysBusy(e && e.detailErrMsg);
      });
  },

  sysBusy(text) {
    wx.showToast({
      title: text || '预约现场有点拥挤，请您耐心稍候！',
      icon: 'none',
    });
    this.setCountdown();
  },
  /**
   * 提交表单
   */
  handleSubmit(e) {
    if (e.detail.validStatus) {
      // 验证通过
      if (
        this.data.isFinish ||
        this.data.remainTime > 0 ||
        this.data.countdown > 0
      ) {
        return;
      }
      if (!this.isLucky()) {
        wx.showToast({
          title: '预约现场有点拥挤，请您耐心稍候！',
          icon: 'none'
        });
        return;
      }
      if (e.detail.validStatus) {
        //this.submitData();
        const that = this
        let buy_flow_info = getBuyFlowInfo(this.data.wllConfig);
        if (buy_flow_info.is_need_subscribe_message) {
          wx.getSetting({
            withSubscriptions: true,
            success(res) {
              const subscriptionsSetting = res.subscriptionsSetting || {};
              const settingSubState = subscriptionsSetting[buy_flow_info.tmplIds[0]];
              if (settingSubState === 'reject' || !subscriptionsSetting.mainSwitch) {
                wx.showModal({
                  showCancel: false,
                  confirmText: '前往设置',
                  title: '温馨提示',
                  content: '您已禁收当前小程序通知，为确保您能及时收到预约结果消息，请前往“通知设置”设置接收消息。',
                  success(res) {
                    wx.openSetting({
                      success(res) { },
                      fail(err) {
                        wx.showToast({
                          title: '系统异常，请稍后再试',
                          icon: 'none'
                        });
                      }
                    })
                  }
                })
              } else if (!settingSubState || settingSubState === 'accept') {
                wx.requestSubscribeMessage({
                  tmplIds: buy_flow_info.tmplIds,
                  success(res) {
                    const optState = res[buy_flow_info.tmplIds[0]];
                    if (optState === 'reject') {
                      wx.showToast({
                        title: '提交失败，请允许发送消息通知',
                        icon: 'none'
                      });
                    }
                    else if (optState === 'accept') {
                      that.setData({
                        'formData.wxmsg': 1,
                        'isSelSubscribeMessage': true
                      });
                      that.getPreorderStatus();
                    }
                  },
                  fail(err) {
                    wx.showToast({
                      title: '系统异常，请稍后再试',
                      icon: 'none',
                    });
                  }
                });
              }
            },
            fail(res) {
              wx.showToast({
                title: '系统异常，请稍后再试',
                icon: 'none',
              });
            }
          })
        } else {
          that.getPreorderStatus();
        }
      }
    }
  },
  /**
   * 表单值改变时触发
   */
  handleFormChange(e) {
    console.log('表单改变：', e)
    const {
      detail: {
        value,
        index
      },
      currentTarget: {
        id
      }
    } = e
    if (id === 'category')
      this.handleCategoryChange(index)
    if (id === 'commodity_id')
      this.handleTypeChange(index)
    this.setData({
      [`formData.${id}`]: value
    });
  },
  /**
   * 口罩类型改变触发，重置口罩型号列表和已选口罩型号的值
   */
  handleCategoryChange(index) {
    const {
      categoryRange
    } = this.data
    const category = categoryRange[index]
    this.setData({
      'formData.commodity_id': '',
      typeRange: category.commodity_list.map(item => {
        return {
          ...item,
          value: item.id
        }
      }),
      'limit': '',
    })
  },
  handleTypeChange(index) {
    const mask = this.data.typeRange[index]
    // pre_order_number 为可预约上限数
    const {
      pre_order_number, number,
      unit,
      min_order_number,
      price,
      price_text,
    } = mask
    this.setData({
      limit: pre_order_number,
      unit: unit,
      'formData.number': pre_order_number,
      min_order_number: min_order_number,
      price: price, number, price_text
    });
  },
  /**
   * 打开地图
   */
  openShopLocation() {
    const [longitude, latitude] = (this.shop.longi_latitude || '').split(',')

    wx.openLocation({
      type: 'gcj02',
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      name: this.shop.name,
      address: this.shop.address,
      fail: e => {
        console.error(e)
        wx.showToast({
          title: '无法打开地图',
          icon: 'none'
        })
      }
    });
  },

  // 帮助反馈
  onTapFeedback() {
    // type=1是口罩 type=0穗康
    feedbackService.goFeedback(1, this.data.userInfo.uid);
  }
});
