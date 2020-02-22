const { request, config, wxp,Anim,userStore } = getApp();

exports.saveOrUpdate = function (data) {
  return request({
    url: config[config.env].carCodePath + '/transportRegister/v1/saveOrUpdate',
    method: 'POST',
    data: data
  });
};


// 获取健康码
exports.getRelationStateByUser = function (data) {
  return request({
    url: config[config.env].carCodePath + '/qrcCode/v1/stateByUser/' + data.uid,
    method: 'GET',
  });
};