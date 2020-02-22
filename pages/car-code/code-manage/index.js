// pages/car-code/code-manage/index.js
const api = require('../../../services/car-code/main-page.js');
const dabaApi = require('../../../services/car-code/bus-code-driver.js');
const passengerService = require('../../../services/car-code/passenger.js');
const {
  Anim,
  userStore,
  request,
  config,
  dayjs,
  Event
} = getApp();
Anim.Page({

  store: (store) => ({
    userInfo: store.user.userInfo
  }),
  /**
   * 页面的初始数据
   */
  data: {
    visible: false,
    activeKey: "1",
    carTypes: [{
      name: "私家车",
      value: "../code-edit/index?vehicleTypeCode=0",
      picture: "https://imgcache.gzonline.gov.cn/cos/car-code/icon_car@2x.png"
    },
    {
      name: "大巴/中巴",
      value: "1",
      picture: "https://imgcache.gzonline.gov.cn/cos/car-code/icon_bus@2x.png"
    },
    {
      name: "高铁/动车/火车/飞机/轮渡",
      value: "../pub-tran-code/index?isRail=true",
      picture: "https://imgcache.gzonline.gov.cn/cos/car-code/icon_air@2x.png"
    },
    {
      name: "货车",
      value: "../code-edit/index?vehicleTypeCode=4",
      // value: "../goods-train-code/index",
      picture: "https://imgcache.gzonline.gov.cn/cos/car-code/icon_tract@2x.png"
    },
    {
      name: "其他",
      value: "../code-edit/index?vehicleTypeCode=5",
      picture: "https://imgcache.gzonline.gov.cn/cos/car-code/icon_other@2x.png"
    }
    ],
    codes: [],
    // 数据刷新状态
    refresherTriggered: false,
    pageConfig: {
      page: 1,
      pageCount: 10,
      typeCode: ""
    },
    loading: false,
    showSelectType: false,
    busTypeList: ['私家车', '大巴/中巴', '高铁/动车/火车/飞机/轮渡', '货车', '其他'],
    //行程和角色对应关系
    roleStateMap: new Map(),
    //健康码
    qrcId: "",
    selectTypeLabel: "全部" // 默认筛选全部
  },

  /**
   * tab被点击的事件
   */
  handleTabChange(e) {
    let key = e.detail.value.key;
    if (key == "2") {
      this.getTrafficgateList();
    }
    this.setData({
      activeKey: key
    })
  },
  // bindrefresherpulling(e) {
  //   console.log("自定义下拉刷新控件被下拉1111", e);

  //   this.setData({
  //     ['pageConfig.page']: 1,
  //     loading: true,
  //     // refresherEnabled: false,
  //     refresherTriggered: true
  //   })

  //   this.getTrafficgateList();
  // },

  bindrefresherrefresh(e) {
    console.log("自定义下拉刷新被触发", e);
    this.setData({
      ['pageConfig.page']: 1,
      loading: true,
      refresherTriggered: true
    })
    this.getTrafficgateList();
  },

  /** 
   * 滚动到底部
   *  
   */
  bindscrolltolower(e) {
    console.log("滚动到底部", e);

    // 获取数据接口
    this.setData({
      ['pageConfig.page']: this.data.pageConfig.page + 1,
      loading: true
    })
    this.getTrafficgateList();
  },

  /** 
   * 滚动到滚动到顶部
   *  
   */
  bindscrolltoupper(e) {
    console.log("滚动到顶部 bindscrolltoupper", e);
    // 关闭刷新状态
    // setTimeout(() => {
    //   this.setData({
    //     refresherTriggered: true
    //   });
    // }, 1000);
    // this.setData({
    //   ['pageConfig.page']: 1
    // })
    // this.getTrafficgateList();
  },


  // 获取卡口通行码列表
  getTrafficgateList() {
    // wx.showLoading({
    //   title: '请稍后',
    // })
    let params = {
      userId: this.data.userInfo.uid ? this.data.userInfo.uid : 10008875744,
      page: this.data.pageConfig.page,
      pageCount: this.data.pageConfig.pageCount
      // typeCode: this.data.pageConfig.typeCode
    }
    if (this.data.pageConfig.typeCode || this.data.pageConfig.typeCode === 0) {
      params["typeCode"] = this.data.pageConfig.typeCode
    } else {
      delete params["typeCode"];
    }
    dabaApi.getTrafficgateList(params).then((result) => {
      if (result) {
        for (let i = 0; i < result.length; i++) {
          let element = result[i];

          if (element) {
            console.log(element.vehicleTypeCode, result[i].vehicleTypeCode);
            // create element.startTime = dayjs(element.createTime).format('YYYY/MM/DD HH:mm');
            element.verticalCodeStr = this.transferVertivalCode(element.vehicleTypeCode);
          }
        }

        let newAttr = [];
        // 下拉刷新
        if (this.data.refresherTriggered) {
          newAttr = result.concat(this.data.codes);

        } else {
          // 上拉加载或者初始化
          newAttr = this.data.codes.concat(result)
        }

        this.setData({
          codes: this.filterArr(newAttr, 'id'),
          refresherTriggered: false,
          loading: false
        }, () => {
          Event.dispatch('g-tabs__resetStyle')
        });

      }

      console.log("获取卡口通行码列表", this.data.codes);
    })

  },

  // 数组去重
  filterArr(arr, name) {
    let hash = {};
    return arr.reduce((ss, item) => { // reduce累计器, ss是具体满足条件后返回的数据, item是数组依次循环的每一项
      hash[item[name]] ? '' : hash[item[name]] = true && ss.push(item);
      // 1、判断对象的键值是否存在
      return ss;
    }, []);
  },

  // 选择查询车辆类型
  selectCarType() {
    let _this = this;
    let allTypes = ['私家车', '大巴/中巴', '高铁/动车/火车/飞机/轮渡', '货车', '其他', '全部'];
    let typeMap = {
      "私家车": 0,
      "大巴/中巴": 1,
      "高铁/动车/火车/飞机/轮渡": 3,
      "货车": 4,
      "其他": 5,
      "全部": ""
    }
    wx.showActionSheet({
      itemList: _this.data.busTypeList,
      success(res) {
        let selectText = _this.data.busTypeList[res.tapIndex]
        let filterTypes = allTypes.filter(item => { return item != selectText })
        let typeccccc = typeMap[selectText]
        // debugger;
        // console.log(res);
        // console.log("tapIndex" + res.tapIndex)
        let typeCode = typeMap[selectText];
        // if (res.tapIndex == 5) {
        //   typeCode = "";
        // }
        // if (res.tapIndex > 1 && res.tapIndex < 5) {
        //   typeCode = res.tapIndex + 1
        // }
        _this.setData({
          ['pageConfig.page']: 1,
          ['pageConfig.typeCode']: typeCode,
          busTypeList: filterTypes,
          // selectTypeLabel: _this.data.busTypeList[res.tapIndex],
          selectTypeLabel: selectText,
          codes: []
        })
        _this.getTrafficgateList();
      },
      fail(res) {
        console.log(res.errMsg)
      }
    })
    // this.setData({
    //   showSelectType: true
    // })

  },

  searchData(e) {
    this.setData({
      ['pageConfig.page']: 1,
      ['pageConfig.typeCode']: e.currentTarget.dataset.type.code,
      selectTypeLabel: e.currentTarget.dataset.type.value,
      showSelectType: false,
      codes: []
    }, () => Event.dispatch('g-tabs__resetStyle'))
    this.getTrafficgateList();

  },

  /**
   * 交通工具类型被点击的事件
   */
  handleTypeTap(e) {
    const value = e.currentTarget.dataset.value;
    if (value === "1") {
      this.setData({
        visible: true
      })
    } else {
      wx.navigateTo({
        url: value,
      })
    }
  },

  /**
   * 通行码被点击事件
   */
  handleCodeTap() {
    wx.navigateTo({
      url: "../code-detail/index",
    })
  },

  /**
   * 关闭通行码类型弹层
   */
  handleCloseCodeTypeLayer() {
    this.setData({
      showSelectType: false
    })

  },

  /**
   * 处理编辑通行码
   */
  handleTapEditCode(e) {
    let data = e.target.dataset.value;
    let map = this.data.roleStateMap;
    let roleState = map.has(data.id) ? map.get(data.id) : 2;
    if ((roleState == 2) && (data.vehicleTypeCode == 1)) {
      // 跳转到大巴乘客端

      wx.navigateTo({
        url: `/pages/car-code/bus-code/passenger/detail/index?id=${data.id}&identityNo=${this.data.userInfo.uid}&qrcId=${this.data.qrcId}`
      })
    } else if ((roleState == '1') && (data.vehicleTypeCode == 1)) {
      // 跳转到大巴司机端
      wx.navigateTo({
        url: `../bus-code/driver/daba-code-detail/index?id=${data.id}&tripState=${data.tripState}&uid=${data.createUserId}`
      })
    } else if ((roleState == '2') && (data.vehicleTypeCode == 3 || data.vehicleTypeCode == 4 || data.vehicleTypeCode == 5) || data.vehicleTypeCode == 6 || data.vehicleTypeCode == 7) {
      wx.navigateTo({
        url: "../code-detail/index?id=" + data.id + '&isRail=true',
      })
    } else {
      wx.navigateTo({
        url: "../code-detail/index?id=" + data.id + '&vehicleTypeCode=' + data.vehicleTypeCode,
      })
    }
    // TO-DO 跳转到编辑页
  },

  /**
   * 处理删除通行码
   */
  handleTapDelCode(e) {
    let _this = this;
    wx.showModal({
      title: '温馨提示',
      content: '删除将不可恢复，是否确定删除？',
      cancelText: '取消',
      confirmText: '确定',
      success(res) {
        if (res.confirm) { // 删除
          dabaApi.deletCheckPointRegister(e.currentTarget.dataset.value.id).then((result) => {
            console.log("删除通行码", result);
            wx.showToast({
              title: result,
              icon: 'none',
              duration: 2000
            })
            _this.getTrafficgateList();
          })
        }
      }
    })
  },

  showTipModal(content) {
    wx.showModal({
      title: '温馨提示',
      content,
      showCancel: false,
      confirmText: '去上报',
      success(res) {
        if (res.confirm) { // 去上报
          wx.navigateTo({
            url: '/pages/report/index/index', // TO-DO 改为上报地址
          })
        }
      }
    })
  },
  /**
   * 检查健康自查状态
   */
  checkHealthState() {
    this.data.userInfo.uid
    let _this = this;
    api.getQrCode({
      uid: this.data.userInfo.uid
    }).then(result => {
      result;
      //健康码id
      if (result.codeId) {
        this.setData({
          qrcId: result.codeId
        })
      }
      let state = result.state;
      // let state = 0;
      let content = "请先上报个人健康自查"
      if (state == 2) {
        console.log("个人健康码正常")
        return;
      } else if (state == 1) {
        content = '您的健康码已过期，请重新上报';
      } else if (state == 0) {
        content = '请先上报个人健康自查';
      }
      _this.showTipModal(content)
    }).catch(res => {
      _this.showTipModal("请先上报个人健康自查")
    })
    // let state = 2; // TO-DO 调用接口获取状态

    // if (state !== 0) { // 不合法

    //   // 未上报提示语
    //   let content = '请先上报个人健康自查';
    //   let showCancel = false;

    //   if (state === 1) { // 过期
    //     content = '您的健康码已过期，请重新上报';
    //     showCancel = true;
    //   }

    // wx.showModal({
    //   title: '温馨提示',
    //   content,
    //   showCancel,
    //   cancelText: '知道了',
    //   confirmText: '去上报',
    //   success(res) {
    //     if (res.confirm) { // 去上报
    //       wx.navigateTo({
    //         url: '/pages/mine/login/index',  // TO-DO 改为上报地址
    //       })
    //     } 
    //   }
    // })
    // }

  },

  /**
   * 刷新卡口通行码
   */
  refleshCodes() {
    const vm = this;

    vm.setData({
      codePageInfo: {
        loading: false,
        cardNum: 0,
        error: false
      }
    });

    // TO-DO 加载卡口数据
  },

  loadNextPage() {
    const vm = this;

    let pager = vm.data.codePageInfo;

    if (!pager.loading) {
      vm.setData({
        'codePageInfo.error': false,
        'codePageInfo.loading': true
      });

      // TO-DO 加载下一页数据
      setTimeout(_ => {
        vm.setData({
          'codePageInfo.loading': false,
          codes: [...vm.data.codes, ...vm.data.codes]
        }, () => {
          // 通知重新计算样式
          Event.dispatch('g-tabs__resetStyle')
        });
      }, 1000);
    }
  },
  closePoplayer() {
    this.setData({
      visible: false
    })
  },
  openPoplayer(e) {
    this.setData({
      visible: true
    })
  },


  // 转码
  transferVertivalCode(code) {
    let label = "";
    switch (code) {
      case 0:
        label = '私家车';
        break;
      case 1:
        label = '大巴/中巴';
        break;
      case 2:
        label = '大巴/中巴';
        break;
      case 3:
        label = '高铁/动车/火车/飞机/轮渡';
        break;
      case 4:
        label = '货车';
        break;
      case 5:
        label = '其他';
        break;
    }

    return label;

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.checkHealthState()
    this.getPointPassengerState()
    if (options.activeKey) {
      this.setData({
        activeKey: options.activeKey,
      })
      this.getTrafficgateList();
    } else {

    }


  },
  //获取用户的行程和角色关系
  getPointPassengerState() {
    passengerService.getPointPassengerState().then((res) => {
      let map = new Map();
      for (let key in res) {
        map.set(String(key), res[key])
      }
      // let map=new Map();
      //   res.forEach((item)=>{
      //     if(item.checkPointRegisterId){
      //       map.set(item.checkPointRegisterId,item.roleState)
      //     }
      //   })
      console.info(map)
      this.setData({
        roleStateMap: map
      })
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
    this.checkHealthState()
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

    console.log('onPullDownRefresh')
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () { },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})