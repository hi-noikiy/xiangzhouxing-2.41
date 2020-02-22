// packages/health-code/pages/new-workbench/new-workbench.js

const reportHealth = require('../../services/health-code.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userName: '',
    address: '',
    gridPointId: '',
    userInfo: null,
    roleName: '管理员',
    isCjy: false,
    isGly: false,

  },

  onJump(e) {
    const {
      url
    } = e.currentTarget.dataset;
    console.log(url)
    wx.navigateTo({
      url
    });
  },

  scanCode() {
    console.log('scanCode', this.data.gridPointId)
    if (this.data.gridPointId == '') {
      wx.showToast({
        title: '请先设置采集点',
        icon: 'none'
      })
      return
    }
    wx.scanCode({
      onlyFromCamera: false,
      scanType: ['qrCode'],
      success: (res) => {
        var codId = JSON.parse(res.result).codeId;
        console.log('qrCode', codId);
        if (codId) {
          this.goKSYZ(codId);
        } else {
          wx.showToast({
            title: '二维码无效',
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },

  scanCode2() {
    console.log('scanCode', this.data.gridPointId)
    if (this.data.gridPointId == '') {
      wx.showToast({
        title: '请先设置采集点',
        icon: 'none'
      })
      return
    }
    wx.scanCode({
      onlyFromCamera: false,
      scanType: ['qrCode'],
      success: (res) => {
        var codId = JSON.parse(res.result).codeId;
        console.log('qrCode', codId);
        if (codId) {
          this.gotoCard2(codId);
        } else {
          wx.showToast({
            title: '二维码无效',
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },
  gotoCard2() { // gridPointId这个参数一定要传
    wx.navigateTo({
      url: `/pages/car-code/traffic-police/start/index?gridPointId=${this.data.gridPointId}`
    })
  },
  // 跳到快速验证页面
  goKSYZ(id) {
    if (!this.data.gridPointId) {
      //请选者采集点后再添加 否则会影响通行记录地点
      wx.showToast({
        title: '请稍候',
        icon: 'none'
      })
      this.getUserInfo()
      return
    }
    wx.navigateTo({
      url: "/packages/health-code/pages/verification/index?codId=" + id + "&gridPointId=" + this.data.gridPointId
    })
  },

  gotoCard() {
    wx.navigateTo({
      url: "/pages/car-code/code-manage/index"
    })
  },

  goMyPostion() {
    wx.navigateTo({
      url: "/packages/health-code/pages/collection-point/index?gridPointId=" + this.data.gridPointId +
        '&uid=' + this.data.userInfo.uid + '&isGly=' + this.data.isGly
    })
  },
  go2jWZGL() {

    wx.navigateTo({
      url: "/packages/health-code/pages/add-person/index?uid=" + this.data.userInfo.uid
    })
  },
  go2CJGl() {
    wx.navigateTo({
      url: "/packages/health-code/pages/add-person/index?uid=" + this.data.userInfo.uid
    })
  },
  go2wljkgl() {
    if (this.data.isGly) {
      //管理员
      wx.navigateTo({
        url: "/packages/health-code/pages/admin-grid/index?uid=" + this.data.userInfo.uid
      })

    } else {
      //采集员
      wx.navigateTo({
        url: "/packages/health-code/pages/collection-point-manage/index?gridPointId=" + this.data.gridPointId +
          '&uid=' + this.data.userInfo.uid
      })
    }

  },
  go2jKGL() {
    wx.navigateTo({
      url: "/packages/health-code/pages/collection-point/index?gridPointId" + this.data.gridPointId +
        '&uid=' + this.data.userInfo.uid
    })
  },
  go2Input() {
    wx.navigateTo({
      url: "/packages/health-code/pages/inputcode/index?gridPointId=" + this.data.gridPointId +
        '&uid=' + this.data.userInfo.uid
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  getUserInfo() {
    console.log('getUserInfo')
    if (this.data.userInfo) {
      // if (this.data.isGly) {
      //   //获取管理员信息
      //   this.getAdmanageId()
      // } else {
      //   //获取采集员信息
      //   this.getOperatorId()
      // }
      return
    }
    wx.showLoading({
      title: '请稍候',
    })
    reportHealth.getloginuserinfo().then((result) => {
      wx.hideLoading();
      this.data.userInfo = result;
      console.log('用户角色', result.role)
      // this.data.address = result.address;
      if (result.role && result.role.length > 0) {
        for (let i = 0; i < result.role.length; i++) {
          let js = result.role[i]
          console.log('role', js)
          if (js == 'GRID_USER') {
            //采集员
            this.data.isCjy = true

          } else if (js == 'GRID_MANAGER') {
            //采集管理员
            this.data.isGly = true
            this.data.isCjy = false
          }
        }
        // if (this.data.isGly) {
        //   //获取管理员信息
        //   this.getAdmanageId()
        // } else {
        //   //获取采集员信息
        //   this.getOperatorId()
        // }
        this.setData({
          isGly: this.data.isGly,
          isCjy: this.data.isCjy,
          roleName: this.data.isGly ? '管理员' : '采集员'
        })
      } else {
        wx.showToast({
          title: '您没有权限',
          icon: 'none'
        });
      }

      console.log('address', this.data.address)
      console.log('gridPointId', this.data.gridPointId)
      this.setData({
        address: this.data.address,
        gridPointId: this.data.gridPointId
      })
    }, error => {
      wx.hideLoading();
      wx.showToast({
        title: '获取用户信息失败',
        icon: 'none'
      })
    })
  },


  getAdmanageId() {
    if (this.data.gridPointId) return
    reportHealth.getAdmanageId(this.data.userInfo.uid).then(res => {
      this.data.gridPointId = res.pointId
      this.getGridMonitor();
    })
  },
  getOperatorId() {
    if (this.data.gridPointId) return
    reportHealth.getOperatorId(this.data.userInfo.uid).then(res => {
      this.data.gridPointId = res.pointId
      this.getGridMonitor();
    })
  },

  getGridMonitor() {
    if (!this.data.gridPointId) return
    reportHealth.getGridMonitor(this.data.gridPointId).then(res => {
      this.data.address = res.name
      console.log(res)
      this.setData({
        'address': this.data.address
      })
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    console.log('onShow', this.data.gridPointId)
    this.getUserInfo();
    let gridPointId = wx.getStorageSync('gridPointId')
    let address = wx.getStorageSync('address')
    console.log('address', address)
    console.log('gridPointId', gridPointId)
    this.data.address = address;
    this.data.gridPointId = gridPointId;
    this.setData({
      address: this.data.address,
      gridPointId: this.data.gridPointId
    })
    this.getGridMonitor()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})