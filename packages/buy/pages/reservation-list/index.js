const { Anim, dayjs, storage, request, config, configStore } = getApp();
const listCacheTtl = 5;  // seconds
const listCacheKey = 'mask-preorder-list'
const buyService = require('../../services/buy')
const regionService = require('../../../../services/region')
const feedbackService = require('../../../../services/feedback');
const { getBuyFlowInfo, barcode } = require('../../utils/util');
const addressMixin =require('../mixins/addressMixin')
const resultNoticeMixin = require('../mixins/resultNoticeMixin');

Anim.Page({
    mixins: [addressMixin, resultNoticeMixin],
    store(state) {
        return {
            userInfo: state.user.userInfo,
            wllConfig: state.config.wllConfig
        }
    },
    data: {
        isLoadingData: false,
        showPage: false,
        reservations: [
        ],
        myLotInfo:{
          // // 中签时间
          //   lotDate: null,
          //   // 中签状态
          //   lotStatus: 0,
          //   // 预约时间
          //   submitDate: "",
          //   // 摇号时间
          //   validDate: "",
        },
        formData: {
            mail_address: ''
        },
        rules: {
            mail_address: [
                {
                    type: 'required',
                    message: '请选择邮寄地址'
                }
            ]
        },
        buyType: '',
        queryBuyType: '', // 通过参数传入的抢购还是摇号模式，lot(摇号)、preorder(抢购)
        isShowBth: false
    },
    computed: {
        //
        startTimeText() {
            let buy_flow_info = getBuyFlowInfo(this.data.wllConfig);
            let text = '-';
            if (buy_flow_info.start_time) {
                text = `每天${buy_flow_info.start_time}`;
            }
            return text;
        },
        isAfterLotTime () {
          let temstartTime = String(this.data.wllConfig.lot_flow_info.lot_time)
            .split(':');
          let lotTimeConfig = dayjs()
            .set('hour', temstartTime[0])
            .set('minute', temstartTime[1])
            .set('second', 0)
            .set('millisecond', 0);
          return !dayjs().isBefore(lotTimeConfig);
        },
    },
    onLoad (options) {
      this.setData({
        'queryBuyType': options.buy_type,
      });
      let buy_flow_info = getBuyFlowInfo(this.data.wllConfig);
      if (!buy_flow_info.start_time) {
        configStore.fetchWllConfig();
      }
    },
    handleSwitchTap () {
      wx.navigateTo({
        url: '/packages/buy/pages/reservation-list/index?buy_type=preorder',
      });
    },
    handlePayTap(e) {
        wx.showLoading({
            title: '努力加载中...',
            mask: true
        });
        const { target: { dataset } } = e;
        console.log(openid);
        console.log(dataset);
        const { ordernumber, desc } = dataset;
        const openid = wx.getStorageSync('wx-openid');
      const basePath = this.data.buyType === 'lot' ? this.data.buyType + '/' : '';
        request({
            url: `${config[config.env].buyDomain}/preorder/${basePath}payOrder`,
            method: 'POST',
            data: {
                order_number: ordernumber,
                open_id: openid,
                desc: desc || '一次性口罩',
                trade_type: 0,
            }
        }).then(res => {
            wx.hideLoading();
            console.log(res);
            this.requestPayment(res);
        }).catch(err => {
            err = err || {};
            wx.hideLoading();
            wx.showModal({
                title: '温馨提示',
                content: err.detailErrMsg || err.data || '服务器拥挤，请稍后再试',
                showCancel: false
            });
            console.log('err', err)
        })
    },
    requestPayment(data = {}) {
        if (!data) {
            data.timeStamp = '';
            data.nonceStr = '';
            data.package = '';
            data.signType = 'MD5';
            data.paySign = '';
        } else {
            data.package = `prepay_id=${data.prepay_id}`;
        }
        console.log(data);
        wx.requestPayment({
            timeStamp: data.timeStamp,
            nonceStr: data.nonceStr,
            package: data.package,
            signType: data.signType,
            paySign: data.paySign,
            success: function (res) {
                console.log(res);
            },
            fail: function (res) {
                console.log(res);
            },
            complete: function (res) {
                // wx.navigateTo({
                //     url: '/packages/buy/pages/reservation-list/index',
                // });
                wx.redirectTo({
                    url: '/packages/buy/pages/reservation-list/index',
                });
                console.log(res);
                // this.updateList(true);
            }
        });

        return false;
    },
    handleFormSubmit(e) {
        console.log('e', e)
        if (e.detail.validStatus) {
            const formData = { ...e.detail.value };
            const { code } = e.target.dataset.item;
            const that = this
            wx.showLoading({
                title: '努力加载中...',
                mask: true
            });
            let mail_address = formData.mail_address;
            if (this.data.chooseAddrFail) {
              mail_address = `${formData.userName},${formData.telNumber},${formData.street},${formData.addr}`;
            }
            request({
                url: config[config.env].buyDomain + '/preorder/updateMailAddress',
                method: 'POST',
                data: {
                    id: code,
                    mail_address: mail_address
                }
            })
                .then(res => {
                    wx.hideLoading();
                    wx.showModal({
                        title: '温馨提示',
                        content: '补填邮寄地址成功',
                        showCancel: false,
                        success() {
                            that.updateList(true)
                        }
                    });
                    console.log('res', res)
                })
                .catch(err => {
                    wx.showModal({
                        title: '温馨提示',
                        content: '服务器拥挤，请稍后再试',
                        showCancel: false
                    });
                    wx.hideLoading();
                    console.log('err', err)
                })
        }
    },
    handleShopNav: function (evt) {
        const reservation = evt.currentTarget.dataset.item;
        const lngLat = reservation.shopLocation.split(',');
        const opts = {
            longitude: parseFloat(lngLat[1]),
            latitude: parseFloat(lngLat[0]),
            name: reservation.shopName,
            address: reservation.shopAddr
        };
        wx.openLocation(opts);
    },
    onShow: function () {
        this.setData({
          isLoadingData: false,
          'buyType': this.data.queryBuyType || this.data.wllConfig.buy_type,
        });
        this.isLogin();

        // barcode('barcode', 'BY0001-0-0001', 560, 160);
    },
    onPullDownRefresh: function () {
        this.isLogin();
    },
    isLogin() {
        let self = this;
        if (!self.data.userInfo || !self.data.userInfo.phone) {
          setTimeout(function () {
            self.isLogin();
          }, 1000);
        }
        else {
          self.getMyLotInfo();
          self.updateList();
          this.openTipsModal();
        }
    },
    formatPrice(price) {
        return `¥${(parseFloat(price)).toFixed(2)}`;
    },
    updateList(isUpdate) {
        if (this.data.isLoadingData) {
            return;
        }
        wx.showLoading({
            title: '努力加载中...',
            mask: true
        });
        let self = this;
        const cached = storage.getStorageSync(this.data.buyType + '_' + listCacheKey);
        if (!isUpdate && cached) {
            console.log('>>>using cache', cached);
            wx.hideLoading();
            this.setData({ reservations: cached, showPage: true }, function () {
              setTimeout(function () {
                self.handlerBarcode();
              }, 200);
            });
            return
        }
        self.setData({ isLoadingData: true });
        buyService.getPreorderViewList({ mobile: this.data.userInfo.phone },this.data.buyType).then((data) => {
            console.log('>> reservtion list', data);
            wx.hideLoading();
            this.setData({ showPage: true });
            if (!data || data.length < 1) {
                return;
            }
            if (!Array.isArray(data)) {
                data = [ data ]
            }
            const timeFrames = {
                0: '上午09:00-13:00',
                1: '下午13:00-17:00'
            };
            if (this.data.buyType === 'lot') {
              //当后台中签结果已产生，前端根据配置时间决定是否展示摇号结果与预约成功记录
              data = data.filter((raw) => {
                if (raw.status === '0' && dayjs(raw.lot_time).format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD')) {
                  return this.data.isAfterLotTime;
                }
                return true;
              })
            }
            const resvList = data.map(raw => {
                let hasExpired = false;
                let countdownText = '';

                // raw.status = '1';
                // if (raw.status === '1' && raw.create_time) {
                //     hasExpired = dayjs(raw.create_time).add(24, 'hour').isBefore(dayjs());
                //     if (hasExpired === false) {
                //         const diffMinutes = 24 * 60 - dayjs().diff(dayjs(raw.create_time), 'minute');
                //         const hours = Math.floor(diffMinutes / 60);
                //         countdownText = `等待付款，剩${hours}小时${diffMinutes - hours * 60}分自动取消预约。`;
                //     }
                // }
                return {
                    productName: raw.class_name || '一次性口罩',
                    code: raw.shop_spo_code || raw.id,
                    orderNumber: raw.order_number || raw.register_number,
                    productType: raw.commodity_name,
                    count: raw.commodity_number || '*',
                    unit: raw.unit,
                    totalFee: self.formatPrice(raw.commodity_total_fee),
                    shopName: raw.shop_name,
                    shopAddr: raw.shop_address,
                    shopLocation: raw.longi_latitude,
                    price: self.formatPrice(raw.price),
                    shopPhone: raw.shop_mobile,
                    identity: '有效身份证件',
                    mail_address: raw.mail_address,
                    mail_fee: self.formatPrice(raw.mail_fee),
                    order_total_fee: self.formatPrice(raw.total_fee),
                    total_fee: raw.total_fee,
                    // reservationTime: raw.commodity_id,
                    status: this.data.buyType === 'lot'?raw.status:normalizeStatus(raw.status),
                    validTime: (raw.date || '2020-2-1') + ' ' + (timeFrames[raw.timecode] || ''),
                    timecode: timeFrames[raw.timecode] || '',
                    create_time: raw.create_time || '',
                    countdownText,
                    // 交易状态0：失败，1：成功，2：支付中，3:未支付，4：转入退款，5：已关闭
                    pay_status: raw.pay_status,
                    payTime: raw.pay_time,
                    hasExpired,
                    // valid_time: raw.valid_time,// 有效时间
                    valid_time: dayjs(raw.lot_time).add(1, 'day').format('YYYY-MM-DD'),// 帮后端背锅兜底，取摇号时间+1天
                    access: raw.access || 0, // 默认是邮寄
                }
            });
            console.log(resvList, data);
            this.setData({ reservations: resvList, isLoadingData: false }, function () {
              setTimeout(function () {
                self.handlerBarcode();
              }, 200);
            });
            storage.setStorageSync(this.data.buyType + '_' + listCacheKey,
              resvList, listCacheTtl);
        }, err => {
            console.error('req error', err);
            wx.hideLoading();
            wx.showModal({
                title: '预约列表获取失败',
                content: '请稍后再试',
                showCancel: false
            });
            this.setData({ isLoadingData: false, showPage: true });
        });
    },

    // 处理条形码
    handlerBarcode() {
      this.data.reservations.map((item => {
        if (item.code && item.access === 1 && item.status !== '2') {
          barcode('barcode-' + item.code, item.code, 560, 160);
        }
      }));
    },

    getMyLotInfo(){
      if (this.data.buyType !== 'preorder'){
        buyService.getMyLotInfo().then(data=>{
        //当后台中签结果已产生，前端根据配置时间决定是否展示摇号结果与预约成功记录
        if(data && data.lotStatus === 1){
          data.lotDate = dayjs(data.lotDate).format('YYYY-MM-DD')
          if (data.lotDate === dayjs().format('YYYY-MM-DD') && !this.data.isAfterLotTime){
              data.lotStatus = 2;
            }
        }
        this.setData({
        myLotInfo: data
        })
      })
      }
    },
    /**
     * 打开地图
     */
    openShopLocation(e) {
      const { target: { dataset } } = e;
      const { location, shopaddr, shopname } = dataset;
      const [longitude, latitude] = (location || '').split(',')
      wx.openLocation({
        type: 'gcj02',
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        name: shopaddr,
        address: shopname,
        fail: e => {
          console.error(e)
          wx.showToast({
            title: '无法打开地图',
            icon: 'none'
          })
        }
      });
    },
    orderMask () {
      wx.navigateTo({
        url: '/packages/buy/pages/notice/index',
      })
    },

    // 帮助反馈
    onTapFeedback() {
      // type=1是口罩 type=0穗康
      feedbackService.goFeedback(1, this.data.userInfo.uid);
    }
})

// 兼容后端状态
function normalizeStatus(status) {
    if (status === '2') {
        return 'complete';
    }
    if (status === '1') {
        return 'success';
    }
    if (status === '0') {
        return 'failure';
    }
    return status;
}
