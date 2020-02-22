// pages/car-code/bus-code/passenger/detail/index.js
const passengerService = require('../.././../../../services/car-code/passenger.js');
const {
    config
} = getApp();
const {
    Poster
} = require('../../../../../miniprogram_dist/poster/poster');

// 生成虚线
function genDotLine() {

  // 生成虚线
  let x = 80;
  let list = [];

  for (let i = 0; i < 30; i++) {
    list.push({ // 虚线
      width: 12,
      height: 3,
      x,
      y: 588,
      backgroundColor: '#f5f5f5',
      zIndex: 2,
    });
    x += 20;
  }

  return list;
}

const colLeft = 80;
const col2Left = 670;
const posterConfig = {
    width: 750,
    height: 1176,
    backgroundColor: '#f5f5f5',
    debug: false,
    pixelRatio: 1,
    blocks: [
      { // 内容区
        width: 670,
        height: 1104,
        x: 40,
        y: 36,
        backgroundColor: '#fff',
        zIndex: 1,
      }, { // 二维码下面左侧半圆
        width: 40,
        height: 40,
        x: 20,
        y: 569,
        borderRadius: 40,
        backgroundColor: '#f5f5f5',
        zIndex: 2,
      }, { // 右侧半圆
        width: 40,
        height: 40,
        x: 690,
        y: 569,
        borderRadius: 40,
        backgroundColor: '#f5f5f5',
        zIndex: 2,
      }, ...genDotLine(), // 二维码底部虚线
      { // 底部空白
        width: 670,
        height: 60,
        x: 40,
        y: 1274,
        backgroundColor: '#f5f5f5',
        zIndex: 2,
      }
    ],
    texts: [
      {
        x: colLeft,
        y: 690,
        fontSize: 48,
        baseLine: 'middle',
        text: '交通卡口登记信息',
        fontWeight: 'bold',
        lineNum: 1,
        color: '#000',
        zIndex: 200,
      }, { // 车牌号
          x: colLeft,
          y: 807,
          fontSize: 44,
          baseLine: 'middle',
          fontWeight: 'bold',
          text: '',
          lineNum: 1,
          color: '#000',
          zIndex: 200,
      }, {
          x: col2Left,
          y: 807,
          textAlign: 'right',
          fontSize: 32,
          baseLine: 'middle',
          text: '',
          lineNum: 2,
          width: 378,
          color: '#666',
          zIndex: 200,
      }, { // 班次号
          x: colLeft,
          y: 895,
          fontSize: 32,
          baseLine: 'middle',
          text: '班次号',
          width: 420,
          lineNum: 1,
          color: '#666',
          zIndex: 200,
      },
        {
          x: col2Left,
          textAlign: 'right',
          y: 895,
          fontSize: 32,
          textAlign: 'right',
          baseLine: 'middle',
          text: '',
          lineNum: 1,
          color: '#666',
          zIndex: 200,
      },
        { // 乘车人
          x: colLeft,
          y: 979,
          fontSize: 32,
          baseLine: 'middle',
          text: '乘车人',
          lineNum: 1,
          color: '#666',
          zIndex: 200,
      },
        {
          x: col2Left,
          y: 979,
          fontSize: 32,
          baseLine: 'middle',
          textAlign: 'right',
          text: '3人',
          lineNum: 1,
          color: '#666',
          zIndex: 200,
      },
        {
          x: 375,
          y: 1218,
          fontSize: 26,
          baseLine: 'middle',
          text: '珠海市香洲区主办',
          textAlign: 'center',
          lineNum: 1,
          color: '#ccc',
          zIndex: 200,
      },
        {
          x: 375,
          y: 1256,
          fontSize: 26,
          baseLine: 'middle',
          textAlign: 'center',
          text: '腾讯公司/腾讯云提供技术支持',
          lineNum: 1,
          color: '#ccc',
          zIndex: 200,
        }
    ],
    images: [
      {
        width: 480,
        height: 480,
        x: 135,
        y: 86,
        borderRadius: 0,
        url: '',
        zIndex: 200
      }, {
        width: 110,
        height: 110,
        x: 324,
        y: 268,
        borderRadius: 0,
        url: '/images/logo@2x.png',
        zIndex: 202
      }
    ]
};

Page({
    /**
     * 页面的初始数据
     */
    data: {
        //行程id
        checkPointRegisterId: "",
        url: '',
        formData: {
            id: '',
            carNum: "",
            routerNo: ""
        },
        posterConfig,
        passengerList: [],
        //当前uid
        identityNo: "",
        //健康码
        qrcId: ""
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
     * 刷新页面
     */
    handleRefleshPage() {
      this.getTravelInfo();
      this.getPointPassengerList();
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let id = options.id;
        let identityNo = options.identityNo;
        let qrcId = options.qrcId;
        if (!id) {
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
        if (!qrcId) {
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
            return;
        }
       
        console.info(id)
        this.setData({ qrcId: qrcId })
        this.setData({
            checkPointRegisterId: id
        });
        this.setData({
            identityNo: identityNo
        });
        let string = config[config.env].carCodePath + "/busDriver/v1/getCheckPointRegister?key=" + options.id + "&Uid=" + identityNo + "&typeCode=2";
        this.setData({
            url: string
        })
        this.handleRefleshPage();
        console.log("二维码获取地址", this.data.url)
    },

    /**
     * 跳转会卡口编辑页面
     */
    toEditPage() {
        wx.navigateTo({
            url: '/pages/car-code/bus-code/passenger/edit/index?id=' + this.data.checkPointRegisterId
        });
    },
    //获取行程信息
    getTravelInfo() {
        //根据id获取行程信息
        wx.showLoading()
        passengerService.getTravelInfoById({
            checkPointId: this.data.checkPointRegisterId
        }).then((res) => {
            // console.info("行程信息=====================================")
            // console.info(res)
          let cityKeys = ['leaveProvinceName', 'leaveCityName', 'arriveProvinceName', 'arriveCityName'];
          let str = '';
          cityKeys.forEach((key, i) => {
            str += `${res[key] || ''}`.replace(/[省|市]$/ig, '');
            if (i === 1) {
              str += '-';
            }
          })

            var data = {
                id: res.id,
                carNum: res.carNumber,
                routerNo: res.carBatchNo,
                address: str
            }
            console.info(data)
            this.setData({
                formData: data
            })
        }).catch(e => {

        }).then(res => {
          wx.hideLoading()
        })
    },
    //根据行程id获取同乘人
    getPointPassengerList() {
        //根据行程id获取同行人信息
        passengerService.getPointPassengerList({
            checkPointRegisterId: this.data.checkPointRegisterId,
            roleState: "2",
            createUserId: this.data.identityNo
        }).then((res) => {
            console.info("同行人信息=====================================")
            console.info(res)
            if (res && res.length > 0) {
                let userAllInfo = [];
                let personList = res.filter(item => {
                    let isMe = String(item.qrcId) == String(this.data.qrcId);
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
    // 异步生成
    onCreatePoster() {
        const {
            posterConfig,
            url,
            formData,
            passengerList
        } = this.data;
        posterConfig.images[0].url = url;
        posterConfig.texts[1].text = formData.carNum;
        posterConfig.texts[2].text = formData.address;
        posterConfig.texts[4].text = formData.routerNo;
        posterConfig.texts[6].text = passengerList.length + '人';
        this.setData({
            posterConfig
        }, () => {
            Poster.create(true); // 入参：true为抹掉重新生成
        });
    },
    onPosterSuccess(e) {
        console.log(e)
        const {
            detail
        } = e;
        // wx.previewImage({
        //     current: detail,
        //     urls: [detail]
        // })
        console.info(detail);
        this.saveImgInner(detail);
    },

    onPosterFail(err) {
        console.error(err);
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