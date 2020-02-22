// pages/report/msg/index.js
const reportHealth = require('../../../services/health-code.js');
const { Anim, userStore, config } = getApp()

Anim.Page({

  store: (store) => ({
    userInfo: store.user.userInfo
  }),


  data:{
      info:null,
      source:null
  },

  onLoad(options){
    if (options.info){
        this.setData({
          info: JSON.parse(options.info)
        })
     }
     if(options.source){
       this.setData({
         source: options.source
       })
     }
     if (options.isFromBuy) {
       this.setData({
         isFromBuy: options.isFromBuy,
       })
     }
  },
  handlePrimaryTap(e) {
    if (parseInt(this.data.isFromBuy) === 1) {
      wx.navigateTo({
        url: '/packages/buy/pages/notice/index',
      })
    } else {
      // 这里是“立即生成健康码”操作，需要先判断是否实名了
      reportHealth.realnameUser(this.data.userInfo.uid).then(data => {
        // 未实名
        if (data.isAut == 0) {
          wx.showModal({
            title: '未实名',
            content: '是否需要实名认证？',
            confirmColor: '#1890ff',
            success: function(res) {
              if (!res.cancel) {
                // 点击取消,默认隐藏弹框
                wx.navigateTo({
                  url: "/packages/health-code/pages/realname-submit/index?path=/pages/report/msg/index"
                })
              }
            }
          })
        } else {
          // 已经实名，直接请求接口生成健康码
          const { 
            clueType,
            identity,
            identityType,
          } = this.data.info;
      
          reportHealth.getUserCodeId(
            {
              clueType,
              identity,
              identityType,
              uid: this.data.userInfo.uid
            }
          ).then((res)=>{
             wx.navigateTo({
              url: '/packages/health-code/pages/report-health/index?codeId='+res.codeId,
            })
          }).catch((res)=>{
            console.log(res)
            wx.showToast({
              title: res.errmsg,
              icon: 'none',
              duration: 2000
            });
          })
        }
      }).catch(err => {
        console.log(err)
        wx.showToast({
          title: err.errmsg || '服务器错误',
          icon: 'none',
          duration: 2000
        })
      })
      
    }
  },

  handleSecondTap(e) {
    wx.reLaunch({
      url: '/pages/index/index',
    })
  }
})
