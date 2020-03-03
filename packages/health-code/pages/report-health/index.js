// packages/health-code/pages/report-health/index.js

const reportHealth = require('../../services/health-code.js');
const { Anim, userStore, config } = getApp()
// import drawQrcode from '../../../utils/weapp.qrcode.min.js'
import drawQrcode from 'weapp-qrcode'

Anim.Page({

  store: (store) => ({
    userInfo: store.user.userInfo
  }),

  /**
   * 页面的初始数据
   */

  data: {
    // 当前是否是返回页面
    isBack: true,
    // 指定显示
    codeId:'',
    // 当前账户uid
    uid: '',
    //  近10天通行记录列表
    logList:[],
    // 用户以及关联用户健康码列表
    relationUserList:null,
    // 当前健康码用户信息
    currentCodeUserList:{},
    // 轮播图参数配置
    indicatorDots: true,
    interval: 2000,
    duration: 500,
    current:0,
    // 是否是本人
    isMine: true,
    // 本人信息
    selfInfo:{},
    // 导航栏颜色
    navSelfColor: '#4293F4', //(本人)
    navOtherColor: '#2AB492', //(非本人)
    // 症状描述
    symptomList:[{
       des:'发烧',
       key: 'fs',
       icon:{
         nol: 'icon-heat@2x',
         sel: 'icon-heat-hot@2x',
         other: 'icon-heat-hot-other@2x'
       }
     }, {
        des: '咳嗽',
        key:13,
        icon: {
          nol: 'icon-cough@2x',
          sel: 'icon-cough-hot@2x',
          other: 'icon-cough-hot-other@2x'
        }
      },{
        des: '乏力',
        key:14,
        icon: {
          nol: 'icon-fatigue@2x',
          sel: 'icon-fatigue-hot@2x',
          other: 'icon-fatigue-hot-other@2x'
        }
      },{
        des:'无症状',
        key: 1,
        icon: {
          nol: 'icon-normal@2x',
          sel: 'icon-normal-hot@2x',
          other: 'icon-normal-hot-other@2x'
        }
      }]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      isBack:false,
      uid: options.uid ? options.uid : this.data.userInfo.uid,
      codeId: options.codeId
      // uid: options.uid ? options.uid : '10022544855'
    })
    wx.showLoading({
      title: '加载中',
    })

    this.init();
    
  },

  /**
  * 生命周期函数--监听页面初次渲染完成
  */
  onShow: function () {
    if (wx.getStorageSync("isBack")){
      this.setData({
        current:0
      })
      wx.showLoading({
        title: '加载中',
      })
      this.init();
    }
   
  },

  onUnload: function () {
    wx.setStorageSync("isBack", false)
  },

  onHide(){
    //  this.setData({
    //    isBack: true
    //  })
  },

  // 初始化
  init(){
    console.log(this.data.userInfo)
 

    // 获取用户以及关联用户健康码
    reportHealth.getRelationStateByUser({
      // uid: this.data.userInfo.uid
      uid: this.data.uid,
      verCodes: wx.getStorageSync('verCodes')
    }).then((res) => {
      console.log(res)
      wx.hideLoading()

      let userList = []
      res.map((item, index) => {
        if(item.state == 1 || item.state == 2){
          let url = {
            codeId: item.codeId,
            lastReportTime: item.lastReportTime
          }
          let foreground = '#000000';//二维码前景色，默认值黑色
          // if(item.symptom.indexOf(11) !== -1 || item.symptom.indexOf(12) !== -1){
          //     //发烧改红色
          //     foreground = '#FF0000';
          // }else if(item.symptom.indexOf(13) !== -1){
          //     //咳嗽改橙色
          //     foreground = '#FFA500';
          // }else if(item.symptom.indexOf(14) !== -1 ){
          //     //乏力改橙色
          //     foreground = '#FFA500';
          // }else{
          //     //无症状改绿色
          //     foreground = '#008000';
          // }

          //  症状(11、12发烧 13咳嗽 14乏力 15其他症状 1无症状)
          drawQrcode({
            width: 160,
            height: 160,
            canvasId: 'myQrcode' + index,
            foreground: foreground,
            text: JSON.stringify(url)
          })

          item.day = this.getEndDay(item.lastReportTime);
          // 用户信息保存
          if (item.isMe) {
            this.setData({
              selfInfo: item
            })
          }

          if (item.codeId == this.data.codeId) {
            this.setData({
              current: index
            })
          }
          userList.push(item)
        }
        return item;
      })

      let str = userList.map(it => it.verCode).join(',');
      console.log(str)
      wx.setStorageSync("verCodes", str)

      this.setData({
        relationUserList : userList,
        currentCodeUserList: userList[this.data.current]
      })
      if(this.data.relationUserList.length > 0){
        this.handleSwiperChange({ detail: { current: this.data.current } })
      }
     
    })
  },

  // 验证码查看
  showTips(e){
    console.log(e)
    wx.showModal({
      title: '动态验证码',
      content: e.currentTarget.dataset.vercode,
      showCancel: false,
      confirmColor:'#1890ff',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    
  },

  // 有效期限天数(时间戳相减)
  getEndDay(reportTime){
    console.log(new Date(reportTime))
    let currentTime = new Date().valueOf();
    let rt = new Date(this.getTime(reportTime)).valueOf();
    let ct = new Date(this.getTime(currentTime)).valueOf();
    let day = Math.round((ct - rt) / (1000 * 60 * 60 * 24));
    return (7-day) < 0 ? 0 : 7-day;
  },

  // 获取年月日
   getTime(time) {
     let date = new Date(time);
     let year = date.getFullYear();
     let mon = date.getMonth() + 1;
     let day = date.getDate();
     return year + '-' + (mon < 10 ? ('0' + mon) : mon) + '-' + (day < 10 ? ('0'+day): day);
  },

  // 轮播切换
  handleSwiperChange(e){
    let inx = this.data.current;
    if(e.detail){
      inx = e.detail.current;
    }
    // let inx = e.detail.current || this.data.current;
   //  症状(11、12发烧 13咳嗽 14乏力 15其他症状 1无症状)
    let symList = this.data.symptomList.map(it => {
      it.checked = false;
      if(this.data.relationUserList[inx].symptom){
        if(it.key == 'fs'){
          let flag1 = this.data.relationUserList[inx].symptom.indexOf(11);
          let flag2 = this.data.relationUserList[inx].symptom.indexOf(12);
          if (flag1 !== -1 || flag2 !== -1){
             it.checked = true;
           }
        } else if (this.data.relationUserList[inx].symptom.find(e => e == it.key)) {
          it.checked = true;
        } 
      
      } 
      return it;
    }) 


    this.setData({
      isMine: this.data.relationUserList[inx].isMe?true:false,
      current: inx,
      currentCodeUserList: this.data.relationUserList[inx],
      symptomList:symList
    })
    wx.setNavigationBarColor({
      backgroundColor: this.data.isMine ? this.data.navSelfColor : this.data.navOtherColor,
      frontColor: '#ffffff', // 必写项
    })

    // 获取通行记录
    reportHealth.getPassRegisterList({
      qrcId: this.data.relationUserList[this.data.current].codeId
    }).then((res) => {
      this.setData({
        logList: res
      })
    })

    console.log(inx)

  },

//  左右按钮切换
  handleArrowChange(e){
    if (e.currentTarget.dataset.arrow == 'next' && this.data.current < this.data.relationUserList.length-1){
       this.setData({
         current: this.data.current + 1
       })
    }
   
    if (e.currentTarget.dataset.arrow == 'up' && this.data.current > 0) {
      this.setData({
        current: this.data.current - 1
      })
    }
   
  },

  // 时间格式转换
  dateFormat(date){
    date = new Date(date);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hour = date.getHours() < 10 ? ("0" + date.getHours()) : date.getHours();
    let minute = date.getMinutes() < 10 ? ('0' + date.getMinutes()): date.getMinutes();
    return {
      dateFormat: year+'/'+month+'/'+day,
      timeFormat: hour+':'+minute
    };
  },

  // 页面跳转
  handleNavigateTo: function(e){
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    })
  }

})