const { request, config, wxp } = getApp();
exports.saveOrUpdate = function (data) {
  return request({
    url: config[config.env].carCodePath + '/transportRegister/v1/saveOrUpdate',
    method: 'POST',
    data: data
  });
};

//获取当前出行登记信息对应的同乘人列表
exports.getCheckPointPassagerList = function (data) {
  return request({
    url: config[config.env].carCodePath + '/transportRegister/v1/getCheckPointPassagerList',
    method: 'POST',
    data: data
  });
};

//获取七天内上报乘车人列表信息
exports.getPassengersfromLastWeek = function (data) {
  return request({
    url: config[config.env].carCodePath + '/transportRegister/v1/getPassengersfromLastWeek',
    method: 'POST',
    data: data
  });
};

//根据用户ID查询出行登记信息列表
exports.getCurrentUserRegisterList = function (data) {
  return request({
    url: config[config.env].carCodePath + '/transportRegister/v1/getCurrentUserRegisterList',
    method: 'Get',
    data
  });
};

//根据行程id获取行程二维码信息
exports.getCheckPointRegister = function (data) {
  return request({
    url: config[config.env].carCodePath + '/busDriver/v1/getCheckPointRegister?key=' + data,
    method: 'GET',
    data: data
  })
};

//通过uid获取用户信息
exports.getUserHealthInfo = function (data) {
  return request({
    url: config[config.env].carCodePath +  + '/qrcCode/v1/infoByUser/' + data,
    method: 'GET',
    data: data
  })
}


// 获取健康码
exports.getRelationStateByUser = function (data) {
  return request({
    url: config[config.env].carCodePath + '/qrcCode/v1/stateByUser/' + data.uid,
    method: 'GET',
  });
};