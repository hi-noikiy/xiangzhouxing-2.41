// packages/health-code/pages/add-grid/index.js
const map = require('../../../../services/map.js');
const reportHealth = require('../../services/health-code.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    longitude: '',
    latitude: '',
    position: {},
    activeMarkerId: undefined,
    markers: [],
    searchValue: '',
    selectorRange: [],
    oneList: []
  },

  add(e) {
    const { item } = e.currentTarget.dataset;
    wx.showModal({
      title: '提示',
      content: '确定添加到采集点吗？',
      success (res) {
        if (res.confirm) {
          // console.log('用户点击确定')
          const { province, city, district } = item.ad_info;
          const { lat, lng } = item.location;
          reportHealth.addGridPoint({
            province, city, area: district,
            name: item.title,
            longitude: lng, latitude: lat
          }).then(() => {
            console.log('jump')
            wx.navigateBack();
            // wx.navigateTo({
            //   url: "/packages/health-code/pages/new-workbench/new-workbench",
            // })
          })
        } else if (res.cancel) {
          // console.log('用户点击取消')
        }
      }
    })
  },

  // 获取区信息
  hanldDistrict({ city = '', district }) {
    const _this = this;
    map.districtCode({ keyword: city }).then(res => {
      if (res.result.length) {
        const id = res.result[0][0].id;
        map.district({ id }).then( result => {
          if (result.result.length) {
            const selectorRange = result.result[0];
            const oneList = [];
            selectorRange.map(item => {
              oneList.push(item.fullname)
              item.value = item.fullname;
              item.name = item.fullname;
              item.displayName = item.fullname
            });
            _this.setData({ selectorRange, oneList, searchValue: district })
          }
        })
      }
    })
  },

  // 根据经纬度查询本地附近的 POI
  handleGeocoder(position) {
    const _this = this;
    const { longitude, latitude }  = position || _this.data;
    map.geocoder({ longitude, latitude }).then(res => {
      const { address_component = {}, pois = [] } = res.result;
      // 转换成指定的标记点 MapItem
      pois.map(item => {
        const { lat, lng } = item.location;
        item.name = item.title;
        item.position = { longitude: lng, latitude: lat };
      });
      console.log('pois:', pois, 'district:', address_component);
      _this.setData({ list: pois,  district: address_component });
      // 如果存在，获取行政区划的子级行政区划
      if (position) {
        _this.hanldDistrict(address_component);
      }
    });
  },

  handleChange(e) {
    const value = e.detail.value;
    if (!value) {
      this.handleGeocoder();
      return;
    }
    const { longitude, latitude } = this.data
    map.search({  keyword: value, longitude, latitude }).then(res => {
      const { data } = res;
      // 转换成指定的标记点 MapItem
      data.map(item => {
        const { lat, lng } = item.location;
        item.name = item.title;
        item.position = { longitude: lng, latitude: lat };
      });
      this.setData({ list: data });
    })
  },

  handleConfirm(e) {
    console.log(e.currentTarget.dataset.item);
  },

  handleMapUpdate(e) {
    console.log('map update', e)
  },

  handleActiveMarker(e) {
    console.log('active marker', e)
    this.setData({
      activeMarkerId: e.detail.id
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const _this = this;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        console.log(res)
        const { longitude, latitude } = res;
        const position = { longitude, latitude };
        _this.setData({ longitude, latitude, position });
        _this.handleGeocoder(position);
      }
    });
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

  }
})