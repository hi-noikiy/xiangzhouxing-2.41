// pages/car-code/bus-code/passenger/scan/index.js
const passengerService = require('../.././../../../services/car-code/passenger.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  },
  scanCode() {

    let self = this;
    // // 调用订阅权限
    // wx.requestSubscribeMessage({
    //   tmplIds: ["gnoRfxpGf3ifd7JT34VjTpFEl5nEyQvTvsaE2Rc3OyM"],
    //   success(res) {
    //     // 乘车消息推送(test) carNumber 车牌号 shiftId 班次号
    //     let carNumber = "123";
    //     let shiftId = "123232";
    //     self.passengerPush(carNumber, shiftId);
    //   }
    // });
    wx.scanCode({
      success(res) {
        try {
          if (typeof JSON.parse(res.result) == 'object') {
            let result = res && res.result ? JSON.parse(res.result) : {};
            if (result && result.key && result.Uid) {
              let key = result.key;
              let Uid = result.Uid;
              // let key = "闽C34567";
              // let Uid = "10022641284";
              //验证该行程是否是开启或者关闭
              passengerService.getTravelswitchState({ carNumber: key, Uid: Uid }).then((res) => {
                // wx.showModal({
                //   title: '提示',
                //   content: JSON.stringify(res)+"================"+ (res.state === 1),
                //   showCancel: false,
                //   confirmText: '确定'
                // });
                //state 1:开启 2：未开启 0：关闭
                if (res && res.state == 1) {
                  let checkPointId = res.checkPointId;
                  // 获取班次的详细信息
                  passengerService.getTravelInfoById({ checkPointId: checkPointId }).then((msg) => {
                    if (msg) {
                      let carBatchNo = msg.carBatchNo;

                      // // 提示信息
                      // wx.showModal({
                      //   title: '提示',
                      //   content: "行程消息将要推送到服务通知",
                      //   showCancel: false,
                      //   confirmText: '确定',
                      //   success() {

                      //   }
                      // });
                      // 调用订阅权限
                      wx.requestSubscribeMessage({
                        tmplIds: ["gnoRfxpGf3ifd7JT34VjTpFEl5nEyQvTvsaE2Rc3OyM"],
                        success() {
                          // 乘车消息推送 key 车牌号 carBatchNo 班次号
                          self.passengerPush(key, carBatchNo);
                        },
                        complete() {
                          // 页面跳转
                          wx.navigateTo({
                            url: '/pages/car-code/bus-code/passenger/edit/index?id=' + checkPointId
                          });
                        }
                      });
                    } else {
                      // 提示信息
                      wx.showModal({
                        title: '提示',
                        content: '尚无该班次的信息',
                        showCancel: false,
                        confirmText: '确定'
                      });
                    }
                  });
                } else {
                  // 提示信息
                  wx.showModal({
                    title: '提示',
                    content: '该通行码无进行中行程，请联系司机或工作人员',
                    showCancel: false,
                    confirmText: '确定'
                  });
                }
              })

            } else {
              // 提示信息
              wx.showModal({
                title: '提示',
                content: '该通行码无进行中行程，请联系司机或工作人员',
                showCancel: false,
                confirmText: '确定'
              });
            }

          }
        } catch (e) {
          // 提示信息
          wx.showModal({
            title: '提示',
            content: '请检查该二维码是否有效！',
            showCancel: false,
            confirmText: '确定'
          });
        }
      }, fail(res) {
        // 提示信息
        wx.showModal({
          title: '提示',
          content: '请检查该二维码是否有效！',
          showCancel: false,
          confirmText: '确定'
        });
      }
    })
  },
  //乘车消息推送
  passengerPush(carNumber, xcId) {
    // 固定连接
    let page = "/pages/stat/index";

    // 接口数据
    passengerService.passengerPushNew({ carNumber: carNumber, xcId: xcId, page: page }).then((res) => {
      console.log(res);
    });
  },
  openEdit() {
    //  let id='676842449674436608'
    //   wx.navigateTo({
    //     url: '/pages/car-code/bus-code/passenger/edit/index?id='+id
    //   })
    wx.navigateTo({
      url: '/pages/car-code/bus-code/passenger/edit/index'
    })
  }
})