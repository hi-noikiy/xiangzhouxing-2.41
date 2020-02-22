const {
  Anim,
  userStore,
  request,
  config,
  dayjs,
  configStore,
} = getApp();
const buyService = require('../../services/buy');
const reportService = require('../../../../services/report');
const feedbackService = require('../../../../services/feedback');
const { getBuyFlowInfo } = require('../../utils/util');
const resultNoticeMixin = require('../mixins/resultNoticeMixin');

Anim.Page({
  store (state) {
    return {
      isAuth: state.user.userInfo.isAuth,
      userInfo: state.user.userInfo,
      wllConfig: state.config.wllConfig,
    };
  },
  onShareAppMessage: function () {

  },
  mixins:[resultNoticeMixin],
  computed: {
    show () {
      return Object.keys(this.data.wllConfig).length > 0;
    },
    buyFlowInfo () {
      return getBuyFlowInfo(this.data.wllConfig);
    },
  },
  onShow: function () {
    configStore.fetchWllConfig();
    this.openTipsModal();
  },
  getHourAndMinute (time) {
    let result = {
      hour: 0,
      minute: 0,
    };
    let temstartTime = String(time).split(':');
    result.hour = Number(temstartTime[0]);
    if (temstartTime.length > 1) {
      result.minute = Number(temstartTime[1]);
    }
    return result;
  },
  handlePrimaryTap () {
    let buy_flow_info = this.data.buyFlowInfo;
    reportService.hasReported()
      .then((isReported) => {
        if (buy_flow_info && buy_flow_info.isNeedReport && !isReported) {
          wx.showModal({
            title: '温馨提示',
            content: buy_flow_info.needReportTips ||
              '为确保能及时了解您的健康情况，预约购买口罩前须先填写健康自查上报表，请点击“确认”  进行填写。',
            success (res) {
              if (res.confirm) {
                wx.redirectTo({
                  url: '/pages/report/index/index?target=self&isFromBuy=1',
                });
              }
              else if (res.cancel) {
                wx.navigateBack();
              }
            },
          });
          return;
        }
        if (buy_flow_info && buy_flow_info.is_open === 1) {
          let temStartTime = this.getHourAndMinute(buy_flow_info.start_time);
          let startTime = dayjs()
            .set('hour', temStartTime.hour)
            .set('minute', temStartTime.minute)
            .set('second', 0)
            .set('millisecond', 0)
            .valueOf();
          let temEndTime = this.getHourAndMinute(buy_flow_info.end_time);
          let endTime = dayjs()
            .set('hour', temEndTime.hour)
            .set('minute', temEndTime.minute)
            .set('second', 0)
            .set('millisecond', 0)
            .valueOf();
          let curTime = dayjs().valueOf();
          if (curTime < startTime || curTime >= endTime) {
            wx.showModal({
              title: '温馨提示',
              content: buy_flow_info.oveTips || '系统异常，请稍后再试',
              showCancel: false,
            });
            return;
          }
          else if (this.data.wllConfig.buy_type === 'preorder' && wx.getStorageSync(
            this.data.userInfo.phone + 'receive_' +
            dayjs().format('YYYY_MM_DD'))) {
            wx.showModal({
              title: '温馨提示',
              content: '您的预约申请我们已收到，请勿重复提交。结果可在“个人中心—我的预约”中查看',
              showCancel: false,
              success (res) {
                wx.navigateBack();
              },
            });
            return;
          }
        }
        else {
          wx.showModal({
            title: '温馨提示',
            content: buy_flow_info.closeTips || '系统异常，请稍后再试',
            showCancel: false,
          });
          return;
        }
        if (buy_flow_info.interval_day) {
          this.checkCanOrder(buy_flow_info.interval_day);
        }
        else {
          this.getPreorderStatus();
        }
      });
  },

  checkCanOrder (intervalDay) {
    wx.showLoading();
    buyService.checkCanOrder()
      .then(res => {
        wx.hideLoading();
        // wait是等待摇号 success-是中签
        if ((res.status === 'success' || res.status === 'wait') &&
          res.createTime) {
          let buy_flow_info = this.data.buyFlowInfo;
          wx.showModal({
            title: '温馨提示',
            content: buy_flow_info.unCanOrderText,
            showCancel: false,
            success (res) {
              wx.navigateBack();
            },
          });
        }
        else {
          this.getPreorderStatus();
        }
      })
      .catch(e => {
        wx.hideLoading();
        wx.showToast({
          title: '预约现场有点拥挤，请您耐心稍候！',
          icon: 'none',
        });
      });
  },

  // 获取预约状态
  getPreorderStatus () {
    wx.showLoading();
    buyService.getPreorderStatus()
      .then(res => {
        wx.hideLoading();
        let {
          status,
        } = res;
        // preorder|finish|wait
        if (status === 'finish') {
          wx.navigateTo({
            url: '/packages/buy/pages/over/index',
          });
        }
        else if (status === 'wait') {
          wx.showToast({
            title: '口罩还在准备中，请您耐心等待',
            icon: 'none',
          });
        }
        else {
          wx.navigateTo({
            url: '/packages/buy/pages/form/index',
          });
        }
      })
      .catch(e => {
        wx.hideLoading();
        wx.showToast({
          title: '预约现场有点拥挤，请您耐心稍候！',
          icon: 'none',
        });
      });
  },
  onTapLogin (e) {
    const {
      iv,
      encryptedData,
    } = e.detail;
    if (!iv || !encryptedData) {
      console.error('用户拒绝授权登录');
      return;
    }

    wx.showLoading({
      title: '努力加载中...',
    });
    return request({
      url: `/wll/account/getphone`,
      method: 'POST',
      data: {
        encryptedData,
        iv,
      },
    })
      .then(res => {
        wx.hideLoading();
        if (res && res.phone) {
          userStore.fetchUserInfo();
        }
      })
      .catch(err => {
        wx.hideLoading();
        console.error(err);
      });
  },
  onTapFeedback () {
    // type=1是口罩 type=0穗康
    feedbackService.goFeedback(1, this.data.userInfo.uid);
  },
});
