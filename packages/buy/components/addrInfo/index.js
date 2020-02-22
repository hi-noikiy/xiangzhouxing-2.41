// pages/buy/components/addrInfo/index.js
const {
  config
} = getApp();
const regionService = require("../../../../services/region");
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    addrInfo: {
      telNumber: "",
      userName: "",
      provinceName: "", // 城市
      cityName: "", // 城市
      countyName: "", // 地区
      detailInfo: ""
    },
    addrOptText: "选择收货地址",
    addrOptIcon: "../../images/add_addr.png",
    addrOptType: "opt add",
    regionRange: [],
    chooseAddrFail: false,
    formData: {
      address: ''
    },
    rules: {
      address: [{
        type: 'required',
        message: '请选择邮寄地址'
      }]
    },
    multiCountyRange: [
      [
        { name: config.provinceName, value: config.provinceName },
      ],
      [
        { name: config.cityName, value: config.cityName },
      ],
    ],
  },

  /**
   * 组件的方法列表
   */
  methods: {
    chooseAddress() {
      let self = this;
      wx.chooseAddress({
        success(res) {
          if (res.cityName === config.cityName) {
            const addressInfo = `${res.userName},${res.telNumber},${res.provinceName},${res.cityName},${res.countyName},${res.detailInfo}`
            self.setData({
              addrOptText: "修改收货地址",
              addrOptIcon: "../../images/update_addr.png",
              addrOptType: "opt update",
              "addrInfo.userName": res.userName,
              "addrInfo.telNumber": res.telNumber,
              "addrInfo.provinceName": res.provinceName,
              "addrInfo.cityName": res.cityName,
              "addrInfo.countyName": res.countyName,
              "addrInfo.detailInfo": res.detailInfo,
              "formData.address": addressInfo
            });
            self.triggerEvent('updateAddress', {
              addressInfo
          });
          } else {
            setTimeout(function () {
              wx.showToast({
                title: `请选择${config.cityName}范围内的地址`,
                icon: "none",
                duration: 3000
              });
            }, 1000);
          }
        },
        fail(res) {
          // 从地址选择回去没选择任何地址返回
          if (!/cancel$/.test(res.errMsg)) {
            self.getRegionData()
            setTimeout(function () {
              wx.showToast({
                title: "选择收货地址异常，请手动填写",
                icon: "none",
                duration: 3000
              });
              const rules = {
                userName: [{
                  type: "required",
                  message: "请输入收货人姓名"
                }],
                telNumber: [{
                  type: "required",
                  message: "请输入收货人手机号码"
                }],
                street: [{
                  type: "required",
                  message: "请选择邮寄地区"
                }],
                addr: [{
                  type: "required",
                  message: "请输入详细地址"
                }]
              };
              const formData= {
                userName: "",
                telNumber: "",
                street: [],
                addr: ""
              }
              self.setData({
                chooseAddrFail: true,
              });
              self.triggerEvent('chooseAddrFail', {
                rules,formData
            });
            }, 1000);
          }
        }
      });
    },
    // getRegionData
    getRegionData () {
      wx.showLoading();
      regionService.getRegionData()
        .then(regionList => {
          let tempList = [];
          regionList.map(item => {
            tempList.push({ name: item.regionName, value: item.regionName });
          });
          let multiCountyRange = this.data.multiCountyRange;
          multiCountyRange.push(tempList);
          this.setData({
            multiCountyRange,
          }, () => wx.hideLoading());
        })
        .catch(e => wx.hideLoading());
    },
    handleFormChange(e) {
      this.triggerEvent('updateAddressField', {
        id:e.target.id,value:e.detail.value
      });
    }
  }
});
