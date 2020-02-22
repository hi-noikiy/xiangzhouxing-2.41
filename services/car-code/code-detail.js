// 私家车通行码详情页面接口

const { request, config } = getApp();
const baseUrl = config[config.env].carCodePath;

// 私家车卡口详情
exports.getTrafficgateInfo = function (data) {
  return request({
    url: baseUrl + '/transportRegister/v1/getCheckPointRegisterInfo',
    method: 'POST',
    header: {
      'content-type': 'application/x-www-form-urlencoded' //修改此处即可
    },
    data
  });
};

//获取同行人列表
exports.getPointPassengerList = function (data) {
  return request({
    url: baseUrl + '/transportRegister/v1/getCheckPointPassagerList',
    method: 'POST',
    header: {
      'content-type': 'application/x-www-form-urlencoded' //修改此处即可
    },
    data
  });
};

exports.getPassengersfromLastWeek = function (data) {
  return request({
    url: baseUrl + '/transportRegister/v1/getPassengersfromLastWeek',
    method: 'POST',
    // header: {
    //   'content-type': 'application/x-www-form-urlencoded' //修改此处即可
    // },
    data
  });
};

