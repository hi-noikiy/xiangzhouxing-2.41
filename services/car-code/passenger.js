const { request, config, wxp } = getApp();
const baseUrl = config[config.env].carCodePath;
const healthUrl = config[config.env].healthCodePath;

//确认行程是否开启
exports.getTravelswitchState = function (data) {
  //checkPointId 出行行程id
  return request({
    url: baseUrl + '/busDriver/v1/verificationTravelswitchState',
    method: 'GET',
    data
  });
};
//删除同行人
exports.deletePassengerById = function (data) {
  return request({
    url: baseUrl + '/trafficgate/checkpointpassenger/v1/deletePassengerById',
    method: 'GET',
    data
  });
};
//同行人信息保存
exports.SavePointPassenger = function (data) {
  return request({
    url: baseUrl + '/trafficgate/checkpointpassenger/v1/SavePointPassenger',
    method: 'POST',
    data
  });
};
//获取同行人列表
exports.getPointPassengerList = function (data) {
  return request({
    url: baseUrl + '/trafficgate/checkpointpassenger/v1/getPointPassengerList',
    method: 'POST',
    data
  });
};
//获取同行人数量
exports.getPointPassengerCount = function (data) {
  return request({
    url: baseUrl + 'trafficgate/checkpointpassenger/v1/getPointPassengerCount',
    method: 'POST',
    data
  });
};
//乘车消息推送
exports.passengerPushNew = function (data) {
  return request({
    url: baseUrl + '/trafficgate/checkpointpassenger/v1/PassengerPushNew',
    method: 'GET',
    data
  });
};
//根据行程id获取行程信息
exports.getTravelInfoById = function (data) {
  return request({
    url: baseUrl + '/busDriver/v1/getTrafficgateInfo',
    method: 'GET',
    data
  })
};
//根据行程id获取行程二维码信息
exports.getQRByRegister=function(data){
  return request({
    url: baseUrl + '/busDriver/v1/getCheckPointRegister',
    method: 'GET',
    data
  })
};
//获得当前用户的行程列表
exports.getTrafficgateList=function(data){
  return request({
    url: baseUrl + '/busDriver/v1/getTrafficgateList',
    method: 'GET',
    data
  })
};
//根据车牌号和班次查询对应的行程信息
exports.getCheckPointRegisterByCarnumber=function(data){
  return request({
    url:baseUrl+'/busDriver/v1/getCheckPointRegisterByCarnumber',
    method: 'GET',
    data
  })
};
//通过uid获取用户信息
exports.getUserHealthInfo=function(data){
  return request({
    url:healthUrl+'/qrcCode/v1/infoByUser/'+data,
    method: 'GET',
    data
  })
};
//获取近七天添加的乘车人列表信息
exports.getPassengersfromLastWeek=function(data){
  return request({
    url:baseUrl+'/transportRegister/v1/getPassengersfromLastWeek',
    method: 'POST'
  })
};
//获取七天内为他人自查上报账户
exports.getqrcCodefromLastWeek=function(data){
  return request({
    url:healthUrl+'/qrcCode/v1/reportUserList',
    method: 'GET'
  })
};
//获取当前登录用户所有行程及对应角色
exports.getPointPassengerState=function(){
  return request({
    url:baseUrl+'/trafficgate/checkpointpassenger/v1/getPointPassengerState',
    method: 'GET'
  })
}