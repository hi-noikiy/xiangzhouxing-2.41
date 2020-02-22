const { config, wxp } = getApp();
const { appid } = require('../config/index');
const baseUrl = config[config.env].buyDomain;

const key = 'CS3BZ-HM46F-ZJKJJ-NPNPP-YNN4J-WHFQP';

function request(options, retryTime = 2) {
  if (retryTime === 0) {
    return Promise.reject(null)
  }
  return new Promise((resolve, reject) => {
    return wxp.request({
      ...options,
      url: options.url,
      header: {
        ...options.header,
        appid
      },
      timeout: options.timeout || 15000
    }).then(({ statusCode, data }) => {
      console.log('map data:', data)
      if (data && data.status === 0) {
        return resolve(data);
      }
      return reject(data);
    })
  });
}

// 地点搜索
exports.search = function (data) {
  // &filter=category=小区,学校,写字楼
  return request({
    url: `https://apis.map.qq.com/ws/place/v1/search?keyword=${data.keyword}&boundary=nearby(${data.latitude},${data.longitude},1000)` + `&key=${key}`,
    method: 'GET',
  });
};

// 地址逆解析
exports.geocoder = function (data) {
  return request({
    url: `https://apis.map.qq.com/ws/geocoder/v1/?location=${data.latitude},${data.longitude}&get_poi=1&poi_options=radius=500` + `&key=${key}`,
    method: 'GET'
  });
}

// 获取行政编码
exports.districtCode = function(data) {
  return request({
    url: `https://apis.map.qq.com/ws/district/v1/search?keyword=${data.keyword}` + `&key=${key}`,
    method: 'GET'
  })
}

// 行政区划的子级行政区划
exports.district = function(data) {
  return request({
    url: `https://apis.map.qq.com/ws/district/v1/getchildren?id=${data.id}` + `&key=${key}`,
    method: 'GET'
  })
}
