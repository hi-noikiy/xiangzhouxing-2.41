// packages/health-code/pages/collection-point/index.js
const reportHealth = require('../../services/health-code.js');
const {
  chooseLocation
} = require('../../../../utils/util')

Page({
  /**
   * 页面的初始数据collection
   */
  data: {
    delBtnWidth: 180,
    isGly: false, //是否管理员
    showAdd: false, //是否显示添加
    isDelta: false, //是否滑动删除
    startX: '',
    currentId: '', // 存放传入选中ID
    current: '', // 存放当前选中ID
    list: []
  },

  radioChange: function(e) {
    this.setData({
      current: e.detail.value
    })
  },

  touchS: function(e) {
    if (!this.data.isDelta) return
    if (e.touches.length === 1) {
      this.setData({
        startX: e.touches[0].clientX
      })
    }
  },

  touchM: function(e) {
    if (!this.data.isDelta) return
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

  touchE: function(e) {
    if (!this.data.isDelta) return
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

  initEleWidth: function() {
    const delBtnWidth = this.getEleWidth(this.data.delBtnWidth)
    this.setData({
      delBtnWidth: delBtnWidth
    })
  },

  //点击删除按钮事件
  delItem: function(e) {
    const _this = this;
    const {
      index,
      id
    } = e.currentTarget.dataset;
    const list = this.data.list;
    reportHealth.removeGridPoint(id).then(res => {
      list.splice(index, 1);
      if (id == this.data.currentId || this.data.currentId === '' || this.data.currentId == null) {
        wx.setStorageSync('gridPointId', '');
        wx.setStorageSync('address', '')
      }
      _this.setData({
        list: list
      });
    });
  },

  onOk: function(e) {
    debugger;
    const {
      current,
      list,
      userId
    } = this.data;

    let address = '';
    list.some(item => {
      if (item.id == current) {
        address = item.name; // 返回上一级
        return true;
      }
    });
    this.setData({
      currentId: current
    });

    // wx.setStorageSync('gridPointId', current);
    // wx.setStorageSync('address', address)
    //wx.navigateBack();
    if (this.data.isGly) {
      //管理员
      this.chooseGLy()
    } else {
      //采集员
      this.chooseCjy()
    }

  },
  chooseGLy() {
    const {  current, list,  userId  } = this.data;
    let address = '';
    list.some(item => {
      if (item.id == current) {
        address = item.name; // 返回上一级
      }
    });
    wx.showLoading({
      title: '请稍候',
    })
    reportHealth.getAdmanageId(userId).then(res => {
      debugger
      wx.hideLoading()

      if (!res) {

        wx.setStorageSync('gridPointId', current);
        wx.setStorageSync('address', address)
        wx.navigateBack();
        // wx.showModal({
        //   title: '您不是管理人员',
        //   content: '无法继操作',
        //   showCancel: false,
        //   success() {
        //     wx.setStorageSync('gridPointId', '');
        //     wx.setStorageSync('address', '');
        //     wx.navigateBack();
        //   }
        // })

        return;
      }
      reportHealth.gridManageChoose({
        manageId: res.id,
        pointId: current  }).then(res2 => {
        console.log(res)
        wx.setStorageSync('gridPointId', current);
        wx.setStorageSync('address', address)
        wx.navigateBack();
      }, error => {
        wx.hideLoading()
        wx.showTopTips({
          title:error.errmsg,
          icon:'none'
        })
        console.log('error',error)
        wx.setStorageSync('gridPointId', current);
        wx.setStorageSync('address', address)
        wx.navigateBack();
      })
    }, error => {
      wx.hideLoading()
      console.log(error)
      wx.showTopTips({
        title:error.errmsg,
        icon:'none'
      })
    })

  },


  //采集员选择
  chooseCjy() {
    const {
      current,
      list,
      userId
    } = this.data;
    let address = '';
    list.some(item => {
      if (item.id == current) {
        address = item.name; // 返回上一级

      }
    });
    wx.showLoading({
      title: '请稍候',
    })
    reportHealth.getOperatorID(userId).then(res => {
      debugger
      wx.hideLoading()

      if (!res) {
        wx.setStorageSync('gridPointId', current);
        wx.setStorageSync('address', address)
        wx.navigateBack();
        // wx.showModal({
        //   title: '您不是采集人员',
        //   content: '无法继操作',
        //   showCancel: false,
        //   success() {
        //     wx.setStorageSync('gridPointId', '');
        //     wx.setStorageSync('address', '');
        //     wx.navigateBack();
        //   }
        // })

        return;
      }
      reportHealth.tabGrid({
        operatorId: userId,
        pointId: current
      }).then(res2 => {
        wx.setStorageSync('gridPointId', current);
        wx.setStorageSync('address', address)
        wx.navigateBack();
      }, error => {
        wx.setStorageSync('gridPointId', current);
        wx.setStorageSync('address', address)
        wx.navigateBack();
      })
    }, error => {
      wx.hideLoading()
      wx.showTopTips({
        title:error.errmsg,
        icon:'none'
      })
    })
  },

  onAdd: function(e) {
    // console.log('onAdd');
    // wx.navigateTo({
    //   url: "/packages/health-code/pages/add-grid/index",
    // })
    chooseLocation().then(res => {
      reportHealth.addGridPoint(res)
        .then(() => {
          this.initData(true);
        })
    })
  },

  initData(status) {
    return reportHealth.getGridPoint({}).then(res => {
      this.setData({
        list: res
      });
      if (status) {
        wx.showToast({
          title: '添加成功！',
          icon: 'success',
          duration: 2000
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    debugger
    this.data.isGly = (options.isGly + '') == 'true' //是否管理员
    if (options.isGl) {
      this.data.showAdd = true;
      this.data.isDelta = true;
      this.setData({
        showAdd: this.data.showAdd ,
        isDelta: this.data.isDelta 
      })
    }
    this.setData({
      currentId: options.gridPointId,
      current: options.gridPointId,
      userId: options.uid
    })
    this.initEleWidth();
    this.initData();
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
  onShareAppMessage: function() {}
})