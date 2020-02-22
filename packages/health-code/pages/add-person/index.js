// packages/health-code/pages/add-person/index.js
const reportHealth = require('../../services/health-code.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    delBtnWidth: 180,
    startX: '',
    userId: '',
    manageId: '',
    showTips: true,
    list: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('options', options)

    this.data.userId = options.uid;
    this.initEleWidth()
    this.getAdmanageId();

  },
  getAdmanageId() {
    wx.showLoading({
      title: '请稍后',
    })

    reportHealth.getAdmanageId(this.data.userId).then(res => {
      if (res && res.id) {
        this.data.manageId = res.id;
        console.log('manageId', this.data.manageId)
        this.init();
      } else {
        wx.hideLoading()
        wx.showModal({
          title:'管理员信息不存在',
   
          showCancel:false,
          success:()=>{
              wx.navigateBack({
                data:1
              })
          }
        })
      
      }
    }, error => {
      wx.hideLoading()
      wx.showToast({
        title: '操作失败:' + error.errmsg,
        icon: 'none'
      });
    })
  },
  init() {

    reportHealth.getManageOperators(this.data.manageId).then((result) => {
      wx.hideLoading()
      this.data.list = result
      if (result && result.length > 0) {
        this.data.showTips = false
      } else {
        this.data.showTips = true
      }
      this.setData({
        'showTips': this.data.showTips,
        'list': this.data.list
      })
      console.log('e', result)
    }, (error) => {
      wx.hideLoading()
      wx.showToast({
        title: '操作失败:' + error.errmsg,
        icon: 'none'
      });
    })
  },
  goScan() {
     let that = this;
    wx.scanCode({
      onlyFromCamera: false,
      scanType: ['qrCode'],
      success: (res) => {
        var codId = JSON.parse(res.result).codeId;
        // console.log('qrCode', codId);
        if (codId) {
          that.loadUserInfo(codId);
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
  loadUserInfo(codeId) {
    wx.showLoading({
      title: '请稍后',
    })
    reportHealth.infoByCodeId(codeId).then((result) => {
      //  wx.hideLoading()

      console.log('id', result)
      this.addGridPerson(result.uid, this.data.manageId)

    }, error => {
      wx.hideLoading()

    })

  },
  addGridPerson(id, manageId) { //this.data.userId
    reportHealth.saveManagePerson({
      'userId': id,
      "manageId": manageId
    }).then((result) => {
      wx.hideLoading()
      wx.showToast({
        title: '添加成功',
      })

      setTimeout(() => {
        this.init();
      }, 600)
      console.log('addGridPerson', result)
    }, (error) => {

      wx.hideLoading()
      wx.showToast({
        title: '添加失败:' + error.errmsg,
        icon: 'none'
      });


      if (error.errcode == 3401) {
        wx.navigateTo({
          url: "/packages/health-code/pages/empty/index?title=网络员授权管理&text=无权限添加&t2=该用户同为管理员",
          success: function (res) { },
          fail: function (res) { },
          complete: function (res) { },
        })
      }
    })
  },
  //点击删除按钮事件
  delItem(e) {
    const index = e.currentTarget.dataset.index;
    const {
      list
    } = this.data;
    const operatorId = list[index].id;
    const txtStyle = 'left:0'
    list[index].txtStyle = txtStyle;

    wx.showModal({
      title: '确定删除',
      content: '将删除该采集员',
      success: (res) => {
        if (res.confirm) {
          reportHealth.deleteManagePerson({
            'manageId': this.data.manageId,
            'operatorId': operatorId
          }).then((data) => {
            this.init();
            wx.showToast({
              title: '删除成功',
              icon: 'success',
              duration: 2000
            });
          }, erro => {
            wx.hideLoading();
          })
        } else if (res.cancel) {
          this.setData({
            list: list
          });
        }
      }
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

  },

  touchS: function (e) {
    if (e.touches.length === 1) {
      this.setData({
        startX: e.touches[0].clientX
      })
    }
  },

  touchM: function (e) {
    if (e.touches.length == 1) {
      //手指移动时水平方向位置
      let moveX = e.touches[0].clientX
      //手指起始点位置与移动期间的差值
      let disX = this.data.startX - moveX
      let delBtnWidth = this.data.delBtnWidth
      let txtStyle = ''
      if (disX == 0 || disX < 0) {
        //如果移动距离小于等于0，说明向右滑动，文本层位置不变
        txtStyle = 'left:0'
      } else if (disX > 20) {
        //移动距离大于0，文本层left值等于手指移动距离
        txtStyle = 'left:-' + (disX - 20) + 'px'
        if (disX >= delBtnWidth) {
          //控制手指移动距离最大值为删除按钮的宽度
          txtStyle = 'left:-' + delBtnWidth + 'px'
        }
      }
      //获取手指触摸的是哪一项
      let index = e.currentTarget.dataset.index
      let list = this.data.list
      list[index].txtStyle = txtStyle
      //更新列表的状态
      this.setData({
        list: list
      })
    }
  },
  //获取元素自适应后的实际宽度
  getEleWidth: function (w) {
    var real = 0;
    try {
      var res = wx.getSystemInfoSync().windowWidth;
      var scale = 750 / 2 / (w / 2); // 以宽度750px设计稿做宽度的自适应
      real = Math.floor(res / scale);
      return real;
    } catch (e) {
      return false;
      // Do something when catch error
    }
  },

  touchE: function (e) {
    if (e.changedTouches.length === 1) {
      const endX = e.changedTouches[0].clientX;
      const disX = this.data.startX - endX;
      const delBtnWidth = this.data.delBtnWidth;
      const txtStyle = disX > delBtnWidth / 2 ? 'left:-' + delBtnWidth + 'px' : 'left:0'
      const index = e.currentTarget.dataset.index;
      const list = this.data.list;
      list[index].txtStyle = txtStyle;
      this.setData({
        list: list
      });
    }
  },

  initEleWidth: function () {
    const delBtnWidth = this.getEleWidth(this.data.delBtnWidth)
    this.setData({
      delBtnWidth: delBtnWidth
    })
  },

})