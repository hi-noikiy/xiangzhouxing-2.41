// packages/health-code/pages/manage-code/index.js
const reportHealth = require('../../services/health-code.js');
Page({
    /**
     * 页面的初始数据
     */
    data: {
        delBtnWidth: 180,
        startX: '',
        radioA: 'cn',
        // 已添加健康码用户列表
        list: [],
        canSaveUserList: [],
        visible: false,
        // 当前选中id
        currentCodeId:null,
    },
    // 初始化
    init() {

        // 获取已添加健康码用户列表
        reportHealth.getCodeUserList().then((data) => {
          console.log(data)

          this.setData({
            list: data
          })
        })

    },

  // 七天内帮忙上传过的账户
    getCanSaveUserList() {
        reportHealth.canSaveUserList({}).then((data) => {
            this.setData({
              canSaveUserList: data
            })
        })
    },


    //点击删除按钮事件
    delItem: function (e) {
        const index = e.currentTarget.dataset.index;
        const { list } = this.data;
        const id = list[index].id;
        const txtStyle = 'left:0'
        list[index].txtStyle = txtStyle;
        wx.showModal({
            title: '确定解绑',
            content: '将解除绑定关系？',
            success: (res) => {
                if (res.confirm) {
                  reportHealth.removeCodeUser(id).then((data) => {
                     this.init();
                     wx.showToast({
                      title: '解绑成功',
                      icon: 'success',
                      duration: 2000
                    });
                  })
                } else if (res.cancel) {
                    this.setData({
                        list: list
                    });
                }
            }
        })

    },


    // 添加健康码--选择浮层
    handlePoplayer(e) {
        if (e.currentTarget.dataset.visible)
            this.getCanSaveUserList();
        this.setData({
            visible: e.currentTarget.dataset.visible
        })
    },
    //保存健康码关系
    saveCodeUser(e) {
      if (!e.currentTarget.dataset.item.isSave){
        let data = e.currentTarget.dataset.item
        this.addCode([data.codeId]);
      }

     
    },

    // 添加健康码
  addCode(data){
  
    reportHealth.saveCodeUser(data).then((data) => {
      wx.showToast({
        title: '添加成功',
        icon: 'success',
        duration: 2000
      });
      //  关闭浮层
      this.setData({
        visible: false
      })
      this.init();
    }).catch((res) => {
      console.log(res)
      wx.showToast({
        title: '添加失败,查看是否过期！',
        icon:'none',
        duration: 2000
      });
    })
    },

    // 扫码
    handleScanCode() {
        // 允许从相机和相册扫码
        let that = this;
        wx.scanCode({
            success(res) {
              let rult = JSON.parse(res.result);
           
              that.addCode([rult.codeId])
            },

        })
    },
  // 有效期限天数(时间戳相减)
  getEndDay(reportTime) {
    console.log(new Date(reportTime))
    let currentTime = new Date().valueOf();
    let rt = new Date(this.getTime(reportTime)).valueOf();
    let ct = new Date(this.getTime(currentTime)).valueOf();
    let day = Math.round((ct - rt) / (1000 * 60 * 60 * 24));
    return (7 - day) < 0 ? 0 : 7 - day;
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

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.initEleWidth()
  

        this.setData({
          currentCodeId: options.codeId,
          currentUserName:options.username
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
       this.init();
      wx.setStorageSync("isBack", false)
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
      console.log(123)
      this.setData({
        visible: false
      })
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
      wx.setStorageSync("isBack", true)
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
  // 页面跳转
  handleNavigateTo: function (e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    })
  }
})