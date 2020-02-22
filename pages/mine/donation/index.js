// pages/mine/donation/index.js
const { Anim, request } = getApp()
Anim.Page({
  /**
   * 页面的初始数据
   */
  data: {
    emptyIcon: 'https://imgcache.gzonline.gov.cn/cos/empty_0283358d.svg',
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading()
    const data = {
      pageSize: 100000 // 用一个特别大的数来获取全部数据
    }
    request({
      url: '/donation/mylist',
      data
    }).then(res => {
      wx.hideLoading()
      console.log(res)
      const handling = []
      const finished = []
      let { list } = res
      list = list.map(item => {
        // 状态：0 - 登记，1 - 对接中，2 - 已完成
        const { name, status, create_time } = item
        // const date = new Date(create_time.replace(/-/g, '/').replace('T', ' ').replace('.000+0000', ''))
        // console.log('date:', date)
        // const month = date.getMonth() < 9 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
        // const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
        // const hour = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
        // const minute = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
        // const second = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds()
        return {
          materials: JSON.parse(name),
          create_time,
          status
        }
      })
      this.setData({
        list
      })
      
    }).catch(err => {
      wx.hideLoading()
      wx.showToast({
        title: err.errmsg || '服务器错误',
        icon: 'none'
      })
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
