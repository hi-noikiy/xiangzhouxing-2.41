const { request, config, wxp } = getApp();
const baseUrl = config[config.env].carCodePath;

function filterNull(data) {
  return data == null ? '' : data;
}

exports.getInspection = function (id, uid) {
  return request({
    url: baseUrl + `/trafficPolice/v1/inspection?registerId=${filterNull(id)}&uid=${filterNull(uid)}`,
    method: 'GET'
  });
};

exports.getPassenger = function (id, registerId) {

  return request({
    url: baseUrl + `/trafficPolice/v1/passenger?qrcId=${filterNull(id)}&registerId=${filterNull(registerId)}`,
    method: 'GET'
  });
};

exports.policeCheck = function (data) {
  return request({
    url: baseUrl + `/trafficPolice/v1/check_point_police_check`,
    method: 'POST',
    data
  });
};
