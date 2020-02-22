// 大巴司机端接口

const { request, config, wxp } = getApp();

// 添加交通卡口
exports.saveCheckPointRegister = function (data) {
  return request({
    url: config[config.env].carCodePath + '/busDriver/v1/saveCheckPointRegister',
    method: 'POST',
    data: data
  });
};


// 修改行程状态（1=开启/0=关闭）
exports.updateTravelswitchState = function (data) {
  return request({
    url: config[config.env].carCodePath + '/busDriver/v1/updateTravelswitchState',
    method: 'POST',
    data: data
  });
};

// 获取大巴行程的详细信息
exports.getTrafficgateInfo = function (data) {
  return request({
    url: config[config.env].carCodePath + '/busDriver/v1/getTrafficgateInfo',
    method: 'GET',
    data
  });
};

// 获取所有车辆类型的卡口通行码
exports.getTrafficgateList = function (data) {
  return request({
    url: config[config.env].carCodePath + '/busDriver/v1/getTrafficgateList',
    method: 'GET',
    data
  });
};

// 根据行程id获取行程二维码信息
exports.getCheckPointRegister = function (data) {
  return request({
    url: config[config.env].carCodePath + '/busDriver/v1/getCheckPointRegister',
    method: 'GET',
    data
  });
};

  // 查询所有同乘人数量总数
  exports.getRegisterPassengersListCount = function (data) {
    return request({
      url: config[config.env].carCodePath + '/busDriver/v1/getRegisterPassengersListCount',
      method: 'GET',
      data
});
};

// 司机端根据行程Id查询同乘人信息列表
exports.getPointRegisterPassengersList = function (data) {
  return request({
    url: config[config.env].carCodePath + '/busDriver/v1/getPointRegisterPassengersList',
    method: 'GET',
    data
});
};

// 删除同乘人
exports.deletePassengerById = function (data) {
  return request({
    url: config[config.env].carCodePath + '/trafficgate/checkpointpassenger/v1/deletePassengerById',
    method: 'POST',
    data: data
});
};


// 删除通行码
exports.deletCheckPointRegister = function (data) {
  return request({
    url: config[config.env].carCodePath + '/busDriver/v1/deletCheckPointRegister/'+data,
    method: 'DELETE',
    data
    
});
};












