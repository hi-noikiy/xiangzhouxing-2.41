const editApi = require('../../../services/car-code/code-detail.js');
// const dabaApi = require('../../../services/car-code/bus-code-driver.js');
const {
  config
} = getApp();

// pages/car-code/code-detail/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    //当前类型
    vehicleTypeCode: '',
    //是否是动车
    isRail:false,
    // 通行id
    id: 677176698709475328,
    editInfo: {},
    url: "https://imgcache.gzonline.gov.cn/cos/car-code/wechat.png",
    passengerList: [],
    //当前用户身份证号
    identityNo: "",
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
    ],
    carTypesOne: [{
      name: '高铁',
      value: '3',
      displayName: '高铁'
    },
    {
      name: '动车',
      value: '4',
      displayName: '动车'
    },
    {
      name: '火车',
      value: '5',
      displayName: '火车'
    },
    {
      name: '飞机',
      value: '6',
      displayName: '飞机'
    },
    {
      name: '轮渡',
      value: '7',
      displayName: '轮渡'
    }
    ],
    mapcarTypes: {}
  },
  // 长按图片
  saveImg(e) {
    let _this = this;
    let url = e.currentTarget.dataset.url;
    wx.getSetting({
      success: (res) => {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success: () => {
              // 同意授权
              _this.saveImgInner(url);
            },
            fail: (res) => {
              console.log(res);
              wx.showModal({
                title: '保存失败',
                content: '请开启访问手机相册权限',
                success(res) {
                  wx.openSetting()
                }
              })
            }
          })
        } else {
          // 已经授权了
          _this.saveImgInner(url);
        }
      },
      fail: (res) => {
        console.log(res);
      }
    })
  },
  // 长按保存功能--保存部分
  saveImgInner(url) {
    wx.getImageInfo({
      src: url,
      success: (res) => {
        let path = res.path;
        wx.saveImageToPhotosAlbum({
          filePath: path,
          success: (res) => {
            console.log(res);
            wx.showToast({
              title: '已保存到相册',
            })
          },
          fail: (res) => {
            console.log(res);
          }
        })
      },
      fail: (res) => {
        console.log(res);
      }
    })
  },

  /**
   * 跳转会卡口编辑页面
   */
  toEditPage() {
      if(this.data.isRail =='true'||this.data.isRail ==true){
        wx.navigateTo({
          url: '../pub-tran-code/index?id=' + this.data.id
        });
      }else{
        wx.navigateTo({
          url: '../code-edit/index?id=' + this.data.id+'&vehicleTypeCode='+this.data.vehicleTypeCode
        });
      }
  
  },

  
  onLoad: function (options) {
    this.data.vehicleTypeCode = options.vehicleTypeCode;
    this.data.isRail = options.isRail;
    this.getCarTypesToMap()
    this.data.id = options.id;
    let id = options.id ? options.id : '677176698709475328';
    let identityNo = options.identityNo ? options.identityNo : '350583198702142690';
    this.setData({
      identityNo: identityNo
    });
    this.setData({
      id: id
    })
    let string = config[config.env].carCodePath + "/busDriver/v1/getCheckPointRegister?key="
    this.setData({
      url: string + options.id + "&Uid=" + identityNo
    })
    this.getDetail();
    this.getPointPassengerList();
  },
  //根据行程id获取同乘人
  getPointPassengerList() {
    //根据行程id获取同行人信息
    editApi.getPointPassengerList({
      registerId: this.data.id
      // registerId: '677544756124844032'
      // registerId: '677707969147699200'
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
  // 获取私家车卡口详情
  getDetail() {
    let map = this.data.mapcarTypes;
    editApi.getTrafficgateInfo({
      registerId: this.data.id
      // registerId:'677544756124844032'
    }).then((result) => {
      // console.log("详情", result);
      result.carTypeName = map.get(String(result.numberTypeCode ? result.numberTypeCode : result.vehicleTypeCode)) || ''
      this.setData({
        editInfo: result
      })
      // console.log("详情", this.data.editInfo);
    })
  },
  //将车辆类型转成map存储
  getCarTypesToMap() {
    let map = new Map();
    let carTypes = [];
    if (this.data.isRail=== true || this.data.isRail=== 'true') {
      carTypes = this.data.carTypesOne;
    } else {
      carTypes = this.data.carTypes;
    }
    carTypes.forEach((item) => {
      map.set(item.value, item.name)
    })
    this.setData({
      mapcarTypes: map
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