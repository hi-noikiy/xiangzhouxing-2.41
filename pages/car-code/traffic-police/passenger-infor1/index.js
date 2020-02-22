// pages/detail/index.js
const { Anim, request, dayjs, wxp, config, userStore, configStore } = getApp()
const policeService = require('../../../../services/car-code/traffic-police')

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
    passenger() {

      let data = this.data.info || {};
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
          newData.touchTime = '';
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

      if(newData.symptomsName.trim() == '') {
        newData.symptomsName = '无症状';
      }

      return newData;
    },
  },

  data: {
    qrcId: '',
    info: {}
  },

  watch: {

  },

  /**
   * 加载查验信息
   * @id 行程码
   */
  loadPassenger(id) {
    const vm = this;

    wx.showLoading({});
    policeService.getPassenger(id, vm.$route.query.registerId).then((res) => {
      vm.setData({
        info: res || {}
      })
    }).catch(e => {
      e && wx.showModal({
        title: '温馨提示',
        content: '服务器拥挤，请稍后再试',
        showCancel: false
      })
     }).then(() => {
      wx.hideLoading();
    });
  },

  /**
   * 乘客个人核查信息
   */
  handleCheckOne(e) {
    const vm = this;

    vm.$router.navigateTo({
      path: '../passenger-infor2/index',
      query: {
        passenger: vm.data.info,
        backDelta: 2,
        gridPointId: vm.$route.query.gridPointId,
        registerId: vm.$route.query.registerId
      }
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
  },

  onLoad() {
    let qrcId = this.$route.query.qrcId;
    this.setData({
      qrcId
    });

    this.loadPassenger(qrcId);
  },
  onPageScroll(e) {

  }
})