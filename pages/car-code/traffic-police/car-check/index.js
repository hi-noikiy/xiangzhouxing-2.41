//车牌查验
//获取应用实例
const { Anim, request, dayjs, wxp, config, userStore, configStore } = getApp()
const policeService = require('../../../../services/car-code/traffic-police')
const passService = require('../../../../services/car-code/passenger')

const CONST = {
  domicilePlace: {
    0: '未知',
    1: '珠海市',
    2: '广东其它地市',
    3: '湖北省',
    4: '其它省份'
  },
  chinese: {
    0: '未知',
    1: '中国大陆',
    2: '中国港澳台地区',
    3: '外国'
  },
  touch: {
    0: '未知',
    1: '近期密切接触过有湖北旅居者',
    2: '自我感觉14日内和患者接触过'
  },
  healthState: {
    0: '未知',
    1: '无不适',
    2: '居家健康服务',
    3: '集中健康服务',
    4: '集中医学观察'
  },
  resident: {
    0: '未知',
    1: `是，在珠海居住了已有半年以上`,
    2: `否，我是临时来珠海的`
  },
  recent: {
    0: '未知',
    1: '一直在珠海3个月或以上',
    2: '来或返回珠海超过14日',
    3: '来或返回珠海不超过14日（含14日）',
    4: '目前仍在外地'
  },
  sojourningHistory: {
    0: '未知',
    1: '武汉',
    2: '湖北（不含武汉）',
    3: '中国港澳台地区',
    4: '中国大陆其他省(自治区)市',
    5: '国外'
  },
  healthState: {
    0: '未知',
    1: '无不适',
    2: '居家健康服务',
    3: '集中健康服务',
    4: '集中医学观察',
  },
  symptomsCode: {
    1: '自觉正常',
    11: '发热37.5 ℃以下',
    12: '发热37.5 ℃（含）以上',
    13: '干咳',
    14: '乏力',
    15: '其他症状',
  },
  identityType: {
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
}

Anim.Page({
  store: (store) => ({
    isLeader: store.user.userInfo.isLeader,
    isAuth: store.user.userInfo.isAuth,
    userInfo: store.user.userInfo,
    wllConfig: store.config.wllConfig
  }),

  computed: {
    passList() { // 进行编码转义
      const vm = this;
      let replace = ['domicilePlace', 'sojourningHistory', 'healthState' ]

      if (vm.data.carInfo.pass instanceof Array) {
        let list = vm.data.carInfo.pass;

        return list.map(item => {
          let newData = { ...item };

          // 折叠状态
          newData.isShrink = false;

          Object.keys(newData).forEach(key => {
            if (newData[key] == null) {
              newData[key] = '';
            }
          })

          // 症状
          newData.symptomsName = ''
          if (newData.healthState != 1) {
            let str = '';

            if (typeof newData.symptomsCode == 'string') {
              let list = newData.symptomsCode.split(',').filter(code => code);

              list.forEach(code => {
                if (code == '11' || code == '12') {
                  str += newData.temperature ? ` ${newData.temperature}` : ' 发热';
                } else if (code === '1'){
                  str += ` 无症状`;
                } else if (CONST['symptomsCode'][code]) {
                  str += ` ${CONST['symptomsCode'][code]}`;
                }
              });
            }
            newData.symptomsName = str.trim() || '无症状';
          }

          // 接触史
          if (newData.touch) {
            let list = newData.touch.split(',');
            let str = '';

            if (list.includes('1')) {
              str += CONST.touch[1];
              if (newData.touchTime) {
                let time = dayjs(newData.touchTime);
                time.$y && (str += `(${time.format(this.data.shortFormat)})`);
              }
            }
            if (list.includes('2')) {
              str += str ? ',' : '';
              str += `${CONST.touch[2]}`;
              if (newData.touchTimeLike) {
                let time = dayjs(newData.touchTimeLike);
                time.$y && (str += `(${time.format(this.data.shortFormat)})`);
              }
            }

            newData.touch = str;
          }

          // 其他需要转义的
          replace.forEach(key => {
            newData[key] = CONST[key][newData[key]] || '';
          });

          // 时间
          if (newData.updateTime) {
            let time = this.data.dayjs(newData.updateTime);
            time.$y && (newData.updateTime = time.format(this.data.timeFormat))
          }

          return newData;
        });
      } else {
        return [];
      }
    },
    passenger() { // 进行乘客编码转义
      const vm = this;

      if (vm.data.carInfo.isDriver === 0) {
        let data = this.data.carInfo.pass || {};
        let newData = {};

        Object.keys(data).forEach(key => {
          newData[key] = data[key] === null ? '' : data[key];
        });

        let exclude = ['symptomsCode', 'touch']
        Object.keys(CONST).forEach(key => {
          if (!exclude.includes(key)) {
            newData[`${key}ZH`] = CONST[key][newData[key]] || '';
          }
        });

        // 近期接触史
        newData.touchZH = '';
        if (newData.touch) {
          let list = newData.touch.split(',');
          let str = '';

          if (list.includes('1')) {
            str += CONST.touch[1];

            if (!newData.touchTime) {
              newData.touchTime = '-';
            }
          } else {
            newData.touchTime = '-';
          }

          if (list.includes('2')) {
            str += str ? ',' : '';
            str += `${CONST.touch[2]}`;
            
            newData.touchTime += newData.touchTime ? ',' : '';
            newData.touchTime += newData.touchTimeLike || '-';
          }

          newData.touchZH = str;
        }

        // 症状
        newData.symptomsName = ''
        if (typeof newData.symptomsCode === 'string') {
          let list = newData.symptomsCode.split(',').filter(code => code);
          list.sort();

          newData.symptomsName = list.map(code => CONST['symptomsCode'][code]).join(' ');
        }

        if (newData.symptomsName.trim() == '') {
          newData.symptomsName = '无症状';
        }

        return newData;

      } else {
        return {};
      }
    },
    carType() {
      let type = this.data.carInfo.vehicleTypeCode;
      if (type == 1 || type == 2) {
        return '大巴'
      } else {
        return ''
      }
    },
    carBatchNo() {
      let carNo = this.data.carInfo.carBatchNo || '';
      return `${carNo}`.trim();
    },
    loaded() {
      return Object.keys(this.data.carInfo).length > 0;
    },
    reportTime() {
      let createTime = this.data.carInfo.createTime;
      if (createTime) {
        let time = this.data.dayjs(createTime);

        if (time.$y) {
          return time.format(this.data.timeFormat);
        }
      }

      return '-'
    }
  },

  data: {
    registerId: '',
    uid: '',
    gridPointId: '',
    carInfo: {},
    // 申报内容是否收缩
    arrowStatus: "arrow-up",
    dayjs,
    timeFormat: 'YYYY/MM/DD HH:mm:ss',
    shortFormat: 'YYYY/MM/DD',
  },

  watch: {
  
  },

  // 点击切换申报内容收缩
  handleToggleContent() {
    let toggleArrow = this.data.arrowStatus === "arrow-down" ? "arrow-up" : "arrow-down";
    this.setData({
      arrowStatus: toggleArrow
    })
  },

  // 点击收缩卡片内容
  handleToggleCard(e) {
    let index = e.currentTarget.dataset.index;
    let status = !this.data.passList[index].isShrink;
    let name = "passList["+ index +"].isShrink";
    this.setData({
      [name]: status
    })
  },

  /**
   * 检查行程码是否为id否则查后台获取id
   */
  checkRegisterId() {
    const vm = this;
    let { registerId, uid } = vm.data;
    
    if (registerId == null) {
      vm.goErrPage('未查到有效行程');
    } else if (/^\d+$/.test(registerId)) {
      vm.loadInspection();
    } else { // 查行程id

      let valid = false;
      wx.showLoading();
      passService.getTravelswitchState({
        carNumber: registerId,
        Uid: uid
      }).then((resp = {} ) => {
        if (resp.state == 1 && resp.checkPointId && resp.checkPointId !== 0) {
          vm.setData({
            registerId: resp.checkPointId
          });
          valid = true;
        } else {
          vm.goErrPage(resp.infos || '未查到有效行程');
        }
      }).catch( e => {
        e && wx.showModal({
          title: '温馨提示',
          content: '服务器拥挤，请稍后再试',
          showCancel: false
        })
      }).then(res => {
        wx.hideLoading();
        valid && vm.loadInspection();
      })
    }
  },
  /**
   * 加载查验信息
   * @id 行程码
   */
  loadInspection() {
    const vm = this;
    let { registerId, uid } = vm.data;

    wx.showLoading();
    vm.setData({
      carInfo: {}
    })
    policeService.getInspection(registerId, uid).then((res) =>{
      vm.setData({
        carInfo: res || {}
      })
    }).catch((e) => {
      if (e && (e.errcode === 500 || typeof e === 'string')){
        wx.showModal({
          title: '温馨提示',
          content: '服务器拥挤，请稍后再试',
          showCancel: false
        })
      } else {
        e && vm.goErrPage(e.errmsg);
      }
    }).then(() => {
      wx.hideLoading();
    });
  },

  /**
   * 核查登记
   */
  handleCheck(e) {
    const vm = this;
    let data = e.currentTarget.dataset.value || {};
    
    vm.goToDetail(data.qrcId);
  },

  /**
   * 跳转详情页
   */
  goToDetail(qrcId) {
    const vm = this;
    vm.$router.navigateTo({
      path: `../passenger-infor1/index`,
      query: {
        qrcId,
        gridPointId: vm.data.gridPointId,
        registerId: vm.data.registerId
      }
    })
  },

  /**
   * 乘客个人核查信息
   */
  handleCheckOne(e) {
    const vm = this;

    vm.$router.navigateTo({
      path: '../passenger-infor2/index',
      query: {
        passenger: vm.data.carInfo.pass || {},
        gridPointId: vm.data.gridPointId,
        registerId: vm.data.registerId
      }
    });
  },
  
  /**
   *  判断是否在7天内
   */
  qrCodeInTime(time) {
    time = parseInt(time);
    let diff = new Date().getTime() - time;
    return diff > 0 && diff < 86400000 * 7;
  },

  /**
   * 扫码
   */
  handleScan(e) {
    const vm = this;

    wx.scanCode({
      success(res) {
        let result = {};
        try {
          result = JSON.parse(res.result) || {};
        } catch (e) { }

        if (!result.codeId && result.codeId !== 0) { // 是否获取到数据
          wx.showModal({
            title: '温馨提示',
            content: '该二维码无法识别',
            showCancel: false
          })
        } else if (!vm.qrCodeInTime(result.lastReportTime)) { // 校验过期
          wx.showModal({
            title: '温馨提示',
            content: '该健康自查上报已过期',
            showCancel: false
          })
        } else {
          vm.goToDetail(result.codeId);
          /* if (vm.data.passList.find(item => `${item.qrcId}` === `${result.codeId}`)) {
            
          } else {
            wx.showModal({
              title: '温馨提示',
              content: '乘客列表查无此乘客',
              showCancel: false
            })
            //vm.goErrPage('乘客列表查无此乘客', false);
          }
          */
        }
      },
      fail(res) {
        if (res.errMsg.indexOf('cancel') === -1) {
          wx.showModal({
            title: '温馨提示',
            content: '未识别到二维码',
            showCancel: false
          })
        }
      },
      complete() {
        
      }
    });
  },

  /**
   * 跳错误信息
   */
  goErrPage(msg = '', isRedirect = true) {
    const vm = this;
    if (isRedirect) {
      vm.$router.redirectTo({
        path: `../code-page/index?msg=${msg || ''}`
      })
    } else {
      vm.$router.navigateTo({
        path: `../code-page/index?msg=${msg || ''}`
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
  },

  onLoad({ registerId, uid, gridPointId = '' }) {
    this.setData({
      registerId,
      uid,
      gridPointId
    });
    
    this.checkRegisterId()
  },
  onShow() {
  
  },
  onPageScroll(e) {

  }
})
