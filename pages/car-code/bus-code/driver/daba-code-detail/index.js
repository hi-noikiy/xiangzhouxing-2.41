
const { request, config, wxp } = getApp();
const editApi = require('../../../../../services/car-code/bus-code-driver.js');
const { Poster }= require('../../../../../miniprogram_dist/poster/poster');

// 生成虚线
function genDotLine() {

  // 生成虚线
  let x = 100;
  let list = [];

  for (let i = 0; i < 33; i++) {
    list.push({ // 虚线
      width: 12,
      height: 3,
      x,
      y: 647,
      backgroundColor: '#f5f5f5',
      zIndex: 2,
    });
    x += 20;
  }

  return list;
}

const posterConfig = {
    width: 850,
    height: 1203,
    backgroundColor: '#f5f5f5',
    debug: false,
    pixelRatio: 1,
    blocks: [
        { // 内容区
            width: 737,
            height: 1123,
            x: 56,
            y: 40,
            backgroundColor: '#fff',
            zIndex: 1,
      }, { // 二维码下面左侧半圆
        width: 40,
        height: 40,
        x: 37,
        y: 627,
        borderRadius: 40,
        backgroundColor: '#f5f5f5',
        zIndex: 2,
      }, { // 右侧半圆
        width: 40,
        height: 40,
        x: 773,
        y: 627,
        borderRadius: 40,
        backgroundColor: '#f5f5f5',
        zIndex: 2,
      }, ...genDotLine(),
      { // 底部空白
        width: 670,
        height: 40,
        x: 0,
        y: 1163,
        backgroundColor: '#f5f5f5',
        zIndex: 2,
      }
    ],
    texts: [
        { // 大标题
            x: 425,
            y: 760,
            fontSize: 60,
            baseLine: 'middle',
            text: '请乘客登记申报',
            textAlign: 'center',
            lineNum: 1,
            color: '#000',
            zIndex: 2,
        },
        { // 车牌号
            x: 425,
            y: 904,
            fontSize: 80,
            fontWeight: 'bold',
            height: 112,
            baseLine: 'middle',
            text: '',
            textAlign: 'center',
            lineNum: 1,
            color: '#000',
            zIndex: 2,
        },
      {
        x: 425,
        y: 1048,
        fontSize: 26,
        height: 44,
        baseLine: 'middle',
        text: '珠海市香洲区主办',
        textAlign: 'center',
        height: 37,
        lineNum: 1,
        color: '#ccc',
        zIndex: 2
      },
      {
        x: 425,
        y: 1085,
        fontSize: 26,
        height: 37,
        baseLine: 'middle',
        textAlign: 'center',
        text: '腾讯公司/腾讯云提供技术支持',
        height: 37,
        lineNum: 1,
        color: '#ccc',
        zIndex: 2,
      }
    ],
    images: [
      {
        width: 528,
        height: 528,
        x: 161,
        y: 95,
        borderRadius: 0,
        url: '',
        zIndex: 3
      }, {
        width: 110,
        height: 110,
        x: 371,
        y: 300,
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
        posterConfig,
        step: 1,  // 1 为未开始， 2为进行中  3为已结束
        url: '',
        visible: false, // 乘客列表浮层弹框显示
        passengersTotal: 0,
        detailInfo: {}, // 卡口详情
        passengers: [],
        id: "",
        Uid: ""
    },

    onPosterSuccess(e) {
        console.log(e)
        const { detail } = e;
        wx.previewImage({
            current: detail,
            urls: [detail]
        })
    },

    // 异步生成
    onCreatePoster() {
        const { posterConfig, url, detailInfo } = this.data;
        posterConfig.images[0].url = url;
        posterConfig.texts[1].text = detailInfo.carNumber
        this.setData({ posterConfig }, () => {
        	Poster.create(true);    // 入参：true为抹掉重新生成
    	});
    },

    onPosterFail(err) {
        console.error(err);
    },

    /**
     * 刷新页面
     */
    handleRefleshPage() {
      this.getDetail(this.data.id);
      this.getTotalPassenger(this.data.id);
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            id: options.id ? options.id : '676909633771667456',
            Uid: options.uid
        })
        this.handleRefleshPage()
        // this.getQrcode(this.data.id);
       

    },

    // 获取卡口详情
    getDetail(id) {
        wx.showLoading()
        editApi.getTrafficgateInfo({ checkPointId: id }).then((result) => {
            console.log('卡口详情', result);
            let step = 1;
            if (result.tripState == 1) {
              step = 2;
            } else if (result.tripState == 0) {
              step = 3;
            } else {
              step = 1
            }
            this.setData({
                detailInfo: result,
                step: step
            })

            let string = config[config.env].carCodePath + "/busDriver/v1/getCheckPointRegister?"
            this.setData({
                url: string + `key=${result.carNumber}&Uid=${this.data.Uid}&typeCode=2`
            })
            console.log("二维码获取地址", this.data.url);


        }).catch(e => {
          
        }).then(res => {
          wx.hideLoading()
        })

    },

    // 获取同乘人数量
    getTotalPassenger(id) {
        editApi.getRegisterPassengersListCount({ checkPointId: id }).then((result) => {
            this.setData({
                passengersTotal: result
            })
            console.log('同乘人数量', result)
        })

    },

    // 获取二维码信息
    getQrcode(id) {
        editApi.getCheckPointRegister({ key: id }).then((result) => {
            console.log('二维码信息', result);
            this.setData({
                url: result
            })
        })
    },

    /**
     * 提交数据
     */
    handleSubmit() {
        wx.navigateTo({
            url: "../../../submit-success/index?driveType='daba'"
        })
    },

    /**
     * 刷新已登记乘客
     */
    refreshPassenger() {
        if (this.data.step == 3) {
            return;
        }
        wx.showLoading();
        this.getTotalPassenger(this.data.id);
        setTimeout(function () {
            wx.hideLoading()
        }, 2000)
    },

    /**
    * 跳转回编辑页面
    */
    toEditPage() {
        wx.navigateTo({
            url: "../daba-edit/index?id="+this.data.id
        })

    },

    /**
     * 打开乘客浮层
     */
    managePassenger() {
        // wx.navigateTo({
        //     url: "../../../passenger-manage/index"
        // })
        wx.showLoading();
        editApi.getPointRegisterPassengersList({ checkPointId: this.data.id }).then((result) => {
            this.setData({
                passengers: result,
                passengersTotal: result.length

            })
            console.log('同乘人列表', result)
        })
        this.setData({
            visible: true
        }),
            wx.hideLoading();

    },

    // 刷新乘客列表
    refreshPassengerList() {

    },

    /**
      * 关闭乘客浮层
      */
    closePoplayer() {
        this.setData({
            visible: false
        })
    },

    // 删除乘客
    handleDeleteTap(e) {
        let _this = this;
        console.log(`删除乘客[${e.target.dataset.id}]`);
        wx.showModal({
            title: '温馨提示',
            content: '删除将不可恢复，是否确定删除？',
            success(res) {
                if (res.confirm) {
                    editApi.deletePassengerById({ id: e.target.dataset.id, checkPointId: e.target.dataset.checkpointregisterid }).then((result) => {
                        _this.managePassenger();
                    })
                } else if (res.cancel) {

                }
            }
        })
    },

    // 改变大巴车出行状态
    changeBusState(state) {
        // wx.showLoading({
        //     title: '请稍后',
        // })

        let _this = this;

        let params = {
            checkPointId: this.data.id,
            tripState: state
        }
        editApi.updateTravelswitchState(params).then((result) => {
            console.log("大巴出行状态改变", result);
            this.setData({
                step: this.data.step + 1
            })
            wx.showToast({
                title: _this.data.step - 1 == 1 ? '行程已开始' : '行程已结束',
                icon: 'success',
                duration: 2000
            })
           
            // wx.hideLoading();

        })
    },

    /**
    * 改变大巴形式状态
    */
    handleStart() {
        let _this = this;
        if (this.data.step == 1) {
            // 开始行程
            // wx.showModal({
            //     title: '温馨提示',
            //     content: '开始行程后，乘客扫码将获取其车牌号和班次行程号',
            //     confirmText: '开始行程',
            //     success(res) {
            //         if (res.confirm) {
            //             _this.changeBusState(_this.data.step);

            //         } else if (res.cancel) {

            //         }
            //     }
            // })
            _this.changeBusState(1);

        } else {
            // 结束行程
            wx.showModal({
                title: '温馨提示',
                content: '结束的行程将不能编辑和添加乘客，确定行程已结束？',
                confirmText: '结束行程',
                success(res) {
                    if (res.confirm) {
                        _this.changeBusState(0);

                    } else if (res.cancel) {

                    }
                }
            })

        }


    },

     // 获取车贴
    handleDrawPoster(){
        wx.navigateTo({
            url: "../poster/index"
        })
       

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

    // 显示提示框
    showTips() {
        wx.showModal({
            title: '温馨提示',
            content: '长按可下载分或分享图片，打印通行码贴于车厢内部，乘客扫码将获取其车牌号和班次行程号',
            showCancel: false
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