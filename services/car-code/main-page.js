const { request, config, wxp } = getApp();
let baseUrl = config[config.env].carCodePath
let healthCodePath = config[config.env].healthCodePath

exports.getQrCode = function (data) {
  return request({
    url: `${healthCodePath}/qrcCode/v1/stateByUser/${data.uid}`,
    method: 'GET'
  });
};
