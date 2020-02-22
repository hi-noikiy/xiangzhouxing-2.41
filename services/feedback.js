const { request, config, utils } = getApp();
exports.goFeedback = function (type, uid) {
  request({
    url: config[config.env].buyDomain + '/aisee/urlData',
    method: 'GET',
    data: {
      userid: uid,
      type,
    },
  })
    .then(res => {
      wx.hideLoading();
      wx.navigateTo({
        url: utils.urlJoinParams('/pages/web-view/index', {
          webUrl: encodeURIComponent(`https://h5.aisee.qq.com/index?${res}`),
          title: '帮助与反馈',
        }),
      });
      console.log('res', res);
    })
    .catch(err => {
      wx.showModal({
        title: '温馨提示',
        content: '服务器拥挤，请稍后再试',
        showCancel: false,
      });
      wx.hideLoading();
      console.log('err', err);
    });
};
