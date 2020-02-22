const { request, config, wxp } = getApp()


// 七天内帮忙上传过的账户
exports.canSaveUserList = function (data) {
  return request({
    url: '/prominent-citizens/qrcCodeRelation/v1/canSaveUserList',
    method: 'GET',
    data
  })
}

// 获取已添加用户列表
exports.getCodeUserList = function (data) {
  return request({
    url: '/prominent-citizens/qrcCodeRelation/v1/userList',
    method: 'GET',
    data
  })
}

// 通行记录
exports.getPassRegisterList = function (data) {
  return request({
    url: '/prominent-citizens/passRecord/v1/list',
    method: 'GET',
    data
  })
}

// 获取用户以及关联用户健康码状态信息
exports.getRelationStateByUser = function (data) {
  return request({
    url: '/prominent-citizens/qrcCode/v1/relationStateByUser/' +
      data.uid + '?verCodes=' + data.verCodes,
    method: 'GET'
    // data
  })
}

// 新增通行记录
exports.savePssRegisterList = function (data) {
  return request({
    url: '/passRegister/v1/save',
    method: 'POST',
    data
  })
}

// 保存健康码关系
exports.saveCodeUser = function (data) {
  return request({
    url: '/prominent-citizens/qrcCodeRelation/v1/save',
    method: 'POST',
    data: data
  })
}

// 解除健康码关系
exports.removeCodeUser = function (id) {
  return request({
    url: '/prominent-citizens/qrcCodeRelation/v1/remove/' +
      id,
    method: 'delete'
  })
}

// 自定义网格点
exports.getGridPoint = function (data) {
  return request({
    url: '/prominent-citizens/verify/v1/gridPoint-list',
    method: 'POST',
    data
  })
}

// 删除网格点
exports.removeGridPoint = function (id) {
  return request({
    url: '/prominent-citizens/verify/v1/delete-gridPoint?id=' + id,
    method: 'POST'
  })
}

// 添加查询点
exports.addGridPoint = function (data) {
  return request({
    url: '/prominent-citizens/verify/v1/add-gridPoint',
    method: 'POST',
    data
  })
}

//获取通行记录列表显示天数
exports.passRegisterDays = function (id) {
  return request({
    url: '/prominent-citizens/passRegister/v1/days',
    method: 'GET'
  })
}

// 获取通行记录
exports.passRegisterList = function (qrcId) {
  return request({
    url: '/prominent-citizens/passRecord/v1/list?qrcId=' +
      qrcId + "&time=" + new Date().getTime(),
    method: 'GET'
  })
}

// 新增通行记录
exports.passRegisterSave = function (data) {
  return request({
    url: '/prominent-citizens/passRecord/v1/save',
    method: 'POST',
    data: data
  })
}

// 获取用户健康码状态信息
exports.lastUserStatus = function (uid) {
  return request({
    url: '/prominent-citizens/helper/v1/getReportByUid?uid=' +
      uid,
    method: 'GET'
  })
}

// 获取用户健康码状态信息
exports.infoByCodeId = function (codeId) {
  return request({
    url: '/prominent-citizens/qrcCode/v1/infoByCodeId/' +
      codeId,
    method: 'GET'
  })
}

// 根据用户uid查询信息
exports.getUserInfo = function (uid) {
  return request({
    url: '/prominent-citizens/helper/v1/getUserInfo?uid=' +
      uid,
    method: 'GET'
  })
}

exports.getloginuserinfo = function (uid) {
  return request({
    url: '/wll/account/getloginuserinfo',
    method: 'GET'
  })
}

//采集员管理/
//保存采集员信息
exports.saveManagePerson = function (data) {
  return request({
    url: '/prominent-citizens/grid-manage/v1/authorize',
    method: 'POST',
    data: data
  })
}
//删除采集人信息
exports.deleteManagePerson = function (data) {
  return request({
    url: '/prominent-citizens/grid-manage/v1/relieve',
    method: 'POST',
    data: data
  })
}
//根据id获取管理员下属的采集人
exports.getManagePerson = function (userId) {
  return request({
    url: '/prominent-citizens/grid-manage/v1/operators/' +
      userId,
    method: 'GET'
  })
}

// 根据id获取管理员下属的采集人
exports.getManageOperators = function (id) {
  return request({
    url: '/prominent-citizens/grid-manage/v1/operators/' +
      id,
    method: 'GET'
  })
}

// 编辑网格点
exports.updateGridMonitor = function (data) {
  return request({
    url: '/prominent-citizens/grid-monitor/v1',
    method: 'POST',
    data
  })
}

// 根据ID获取网格点
exports.getGridMonitor = function (id) {
  return request({
    url: `/prominent-citizens/grid-monitor/v1/${id}`,
    method: 'GET'
  })
}

// 添加网格点
exports.saveGridMonitor = function (data) {
  return request({
    url: `/prominent-citizens/grid-monitor/v1/increase`,
    method: 'POST',
    data
  })
}

// 根据用户id获取网格员信息
exports.getOperatorID = function (userId) {
  return request({
    url: `/prominent-citizens/grid-operator/v1/${userId}`,
    method: 'GET'
  })
}

// 根据采集员id获取列表
exports.getGridMonitorList = function (opearatorId) {
  return request({
    url: `/prominent-citizens/grid-operator/v1/points/${opearatorId}`,
    method: 'GET'
  })
}

// 根据ID获取网格监控点
exports.getGridMonitorPoints = function (manageId) {
  return request({
    url: `/prominent-citizens/grid-monitor/v1/points/${manageId}`,
    method: 'GET'
  })
}
exports.tabGrid = function (data) {
  return request({
    url: `/prominent-citizens/grid-operator/v1/choose`,
    method: 'POST',
    data: data
  })
}
//管理员确认选择网格监控点
exports.gridManageChoose = function (data) {
  return request({
    url: `/prominent-citizens/grid-manage/v1/choose`,
    method: 'POST',
    data: data
  })
}
// 删除网格监控点
exports.delGridMonitors = function (data) {
  return request({
    url: `/prominent-citizens/grid-monitor/v1/relieve`,
    method: 'POST',
    data
  })
}

// 1、根据用户id获取管理员信息
exports.getAdmanageId = function (userId) {
  return request({
    url: `/prominent-citizens/grid-manage/v1/${userId}`,
    method: 'GET'
  })
}
//根据用户id获取采集员信息  
exports.getOperatorId = function (userId) {
  return request({
    url: `/prominent-citizens/grid-operator/v1/${userId}`,
    method: 'GET'
  })
}
// 根据用户id获取认证信息
exports.delGridMonitor = function (uid) {
  return request({
    url: '/prominent-citizens/authentication/realname-aut/v1/' + uid,
    method: 'GET'
  });
}

// 根据用户id获取认证信息
exports.realnameUser = function (uid) {
  return request({
    url: '/authentication/realname-aut/v1/' + uid,
    method: 'GET'
  });
}

//微信实名认证接口
exports.wxAut = function (authCode, data) {
  return request({
    url: '/authentication/realnameWxAut/v1/wxAut?authCode=' + authCode,
    method: 'POST',
    data: data
  });
}

// 保存实名认证信息
exports.realnameSave = function (data) {
  return request({
    url: '/authentication/realname-aut/v1',
    method: 'POST',
    data: data
  });
}
//获取调用微信实名认证参数
exports.authindexPara = function (openId) {
  return request({
    url: '/authentication/realnameWxAut/v1/authindexPara?openId=' + openId,
    method: 'GET'
  });
}

// 根据健康码信息查询codeId
exports.getUserCodeId = function (data) {
  return request({
    url: '/prominent-citizens/qrcCode/v1/findCodeIdByInfo',
    method: 'GET',
    data
  });
}

// 验证码校验
exports.verifyVerCode = function (verCode) {
  return request({
    url: '/prominent-citizens/qrcCode/v1/verifyVerCode/' + verCode,
    method: 'GET'
  });
}
