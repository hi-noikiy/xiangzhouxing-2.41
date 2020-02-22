const { request, config, wxp } = getApp();

function getBasePath (buyType) {
  buyType = buyType || getApp().buyType;
  return buyType === 'lot' ? buyType + '/' : '';
}

exports.getPreorderStatus = function () {
  return request({
    url: `${config[config.env].buyDomain}/preorder/${getBasePath()}status`,
    method: 'POST',
    data: {
      city_id: 20,
    },
  });
};

exports.preorderAdd = function (data) {
  return request({
    url: `${config[config.env].buyDomain}/preorder/${getBasePath()}add`,
    method: 'POST',
    data: data,
  });
};

exports.getPreorderViewList = function (data, buyType) {
  let method = 'view';
  buyType = buyType || getApp().buyType;
  if (buyType === 'lot') {
    method = 'history';
  }
  return request({
    url: `${config[config.env].buyDomain}/preorder/${getBasePath(buyType)}${method}`,
    method: 'POST',
    data: data || {},
  });
};

exports.getMyLotInfo = function (data) {
  return request({
    url: `${config[config.env].buyDomain}/preorder/lot/view`,
    method: 'POST',
    data: data || {},
  });
};

exports.checkCanOrder = function (data) {
  return request({
    url: `${config[config.env].buyDomain}/preorder/${getBasePath()}canOrder`,
    method: 'POST',
    data: data || {},
  });
};

exports.getPharmacyData = function () {
  return wxp.request({
    url: config.cdnDomain + config[config.env].pharmacyPath + '?t=' +
      Date.now(),
    method: 'GET',
  });
};
