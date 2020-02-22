// pages/index2/guanli.js
const {
  Anim, utils
} = getApp()
const {
  chooseLocation
} = require('../../../../utils/util')
const reportHealth = require('../../services/health-code.js')

Anim.Page({
  store(state) {
    return {
      userInfo: state.user.userInfo
    }
  },

  /**
   * 页面的初始数据
   */
  data: {
    manageId: '', // 管理员ID
    operator: {},
    currentAddress: '',
    currentPointId: '',
    showPopup: false,
    isEdit: false,
    isScroll: true,
    windowHeight: 0,
    list: [],
    delBtnWidth: 500,
    startX: '',
    current: {
      name: '',
      operatorId: '',
      province: '',
      city: '',
      area: '',
      longitude: '',
      latitude: ''
    }
  },
  close() {
    this.data.showPopup = false;
    this.setData({
      showPopup: false
    })
  },
  onShowPopup() {
    const {
      manageId
    } = this.data
    this.setData({
      showPopup: true,
      isEdit: false,
      current: {
        name: '',
        id: '',
        longitude: '',
        latitude: '',
        operatorId: manageId
      }
    })
  },

  // 快速获取
  getInfo() {
    // 如果已经填入 name 就直接使用
    const {
      name
    } = this.data.current;
    console.log('name', name)
    const _this = this;
    // if (name != null && name != '') {
    //   wx.getLocation({
    //     type: 'gcj02', // 返回可以用于wx.openLocation的经纬度
    //     success: res => {
    //       // 纬度
    //       const latitude = res.latitude
    //       // 经度
    //       const longitude = res.longitude
    //       // 保存数据
    //       this.data.current = Object.assign({}, this.data.current, { latitude, longitude });
    //     },
    //     fail: err => {
    //       if (err.errMsg.includes('fail auth deny')) {
    //         wx.showModal({
    //           title: '无法获取定位',
    //           content: '请先授权获取当前定位信息',
    //           success(res) {
    //             if (res.confirm) {
    //               wx.openSetting()
    //             }
    //           }
    //         })
    //       }
    //     }
    //   })
    //   return;
    // } 
    wx.showToast({
      title: '正在定位中请稍候',
      icon: 'none'
    })
    chooseLocation().then(res => {
      const {
        errMsg,
        ...other = {}
      } = res;
      const current = Object.assign(this.data.current, other)
      this.setData({
        current
      })
      console.log(this.data.current)
    })
  },

  touchS: function(e) {
    if (e.touches.length === 1) {
      this.setData({
        startX: e.touches[0].clientX
      })
    }
  },


  touchM: function(e) {
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
      } else if (disX > 0) {
        //移动距离大于0，文本层left值等于手指移动距离
        txtStyle = 'left:-' + disX + 'px'
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
  getEleWidth: function(w) {
    var real = 0
    try {
      var res = wx.getSystemInfoSync().windowWidth
      var scale = 750 / 2 / (w / 2) // 以宽度750px设计稿做宽度的自适应
      real = Math.floor(res / scale)
      return real
    } catch (e) {
      return false
      // Do something when catch error
    }
  },

  touchE: function(e) {
    if (e.changedTouches.length === 1) {
      const endX = e.changedTouches[0].clientX
      const disX = this.data.startX - endX
      const delBtnWidth = this.data.delBtnWidth
      const txtStyle =
        disX > delBtnWidth / 2 ? 'left:-' + delBtnWidth + 'px' : 'left:0'
      const index = e.currentTarget.dataset.index
      const list = this.data.list
      list[index].txtStyle = txtStyle
      this.setData({
        list: list
      })
    }
  },

  initEleWidth: function() {
    const delBtnWidth = this.getEleWidth(this.data.delBtnWidth)
    this.setData({
      delBtnWidth: delBtnWidth
    })
  },

  delItem: function(e) {
    const {
      item,
      index
    } = e.currentTarget.dataset
    if (item.id == this.data.currentPointId) {
      wx.showToast({
        title: '当前节点无法进行删除',
        icon: 'none'
      })
      return
    }
    const {
      manageId,
      list
    } = this.data
    wx.showLoading({
      title: '请稍候',
    })
    reportHealth.delGridMonitors({manageId, pointId: item.id })
      .then(res => {
        wx.hideLoading()
        list.splice(index, 1)
        this.setData({list})
      },error=>{
        wx.hideLoading()
        wx.showToast({
          title: '删除失败' + error.errmsg ? error.errmsg : '服务器繁忙',
          icon: 'none'
        })
      })
  },

  editorItem: function(e) {
    const {
      item,
      index
    } = e.currentTarget.dataset
    this.setData({
      isEdit: true
    })
    wx.showLoading({
      title: '请稍候',
    })
    reportHealth.getGridMonitor(item.id).then(res => {
      wx.hideLoading()
      this.setData({
        showPopup: true,
        current: res
      })
    }, error => {
      wx.hideLoading()
      wx.showToast({
        title: '编辑失败' + error.errmsg ? error.errmsg : '服务器繁忙',
        icon: 'none'
      })
    })
  },

  init(params) {
    const uid = params.uid
    // 用户id换取管理员信息
    reportHealth.getAdmanageId(uid).then(res => {
      // 将数据存入 id => 管理员ID, manageid
      this.data.operator = Object.assign({
        uid
      }, res)

      // 调用详情
      reportHealth.getGridMonitor(res.pointId).then((res3 = {}) => {
        this.data.currentPointId = res3.id
        this.setData({
          currentAddress: res3.name || '',
          currentAddressOpt: res3
        })
      })

      // 调用列表
      reportHealth.getGridMonitorPoints(res.id).then(res2 => {
        this.setData({
          list: res2 || [],
          manageId: res.id
        })
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.initEleWidth()
    this.init(options)
    this.handleSubmit = utils.debounce(this.handleSubmit, 300)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {},

  bindKeyInput: function(e) {
    this.data.current.name = e.detail.value
  },

  handleSubmit(e) {
    const {
      isEdit
    } = this.data
    const name = this.data.current.name

    if (name == null || name === '') {
      wx.showToast({
        title: '采集点名称不能为空',
        icon: 'none'
      });
      return
    }

    if (isEdit) {
      this.saveSubmit()
      return
    }

    // 保存用户信息
    const {
      current,
      manageId
    } = this.data

    // 只填写名字没有点击快捷获取的的情况
    if (!current.latitude) {
      this.changeLocation();
      return
    }
    wx.showLoading({
      title: '请稍候',

    })
    // 快捷获取点击情况直线写名字保存的情况
    reportHealth
      .saveGridMonitor({ ...current,
        manageId
      })
      .then(res => {
        wx.hideLoading()
        // 重新拉取列表
        reportHealth.getGridMonitorPoints(manageId).then(res2 => {
          this.setData({
            list: res2,
            showPopup: false
          })
        })
      }, error => {
        wx.hideLoading()
        wx.showToast({
          title: '添加失败' + error.errmsg ? error.errmsg : '服务器繁忙',
          icon: 'none'
        })
      })
  },

  changeLocation() {
    const {
      current,
      manageId
    } = this.data
    wx.getLocation({
      type: 'gcj02', // 返回可以用于wx.openLocation的经纬度
      success: res => {
        // 纬度
        const latitude = res.latitude
        // 经度
        const longitude = res.longitude
        // 保存数据
        reportHealth
          .saveGridMonitor({ ...current,
            manageId,
            latitude,
            longitude
          })
          .then(res => {
            // 重新拉取列表
            reportHealth.getGridMonitorPoints(manageId).then(res2 => {
              this.setData({
                list: res2
              })
              this.setData({
                showPopup: false
              })
            })
          })
      },
      fail: err => {
        if (err.errMsg.includes('fail auth deny')) {
          wx.showModal({
            title: '无法获取定位',
            content: '请先授权获取当前定位信息',
            success(res) {
              if (res.confirm) {
                wx.openSetting()
              }
            }
          })
        }
      }
    })
  },

  saveSubmit() {
    const {
      current
    } = this.data
    wx.showLoading({
      title: '请稍候',

    })
    reportHealth.updateGridMonitor(current).then(res => {

      // 重新拉取列表
      const {
        manageId
      } = this.data
      reportHealth.getGridMonitorPoints(manageId).then(res2 => {
        wx.hideLoading()
        this.setData({
          list: res2
        })
        this.setData({
          showPopup: false
        })
      }, error => {
        wx.hideLoading()
        wx.showToast({
          title: '添加失败' + error.errmsg ? error.errmsg : '服务器繁忙',
          icon: 'none'
        })

      })
    }, err => {
      wx.hideLoading()
      wx.showToast({
        title: '添加失败' + err.errmsg ? err.errmsg : '服务器繁忙',
        icon: 'none'
      })
    })
  }
})