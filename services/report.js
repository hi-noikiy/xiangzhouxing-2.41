const { request } = getApp()

exports.nCovSave = function(data) {
  return request({
    url: '/report/pneumonia/save',
    method: 'POST',
    data
  })
}

exports.companySave = function(data) {
  return request({
    url: '/report/enterprise/save',
    method: 'POST',
    data
  })
}

exports.hasReported = function(data = {}) {
  const isReported = wx.getStorageSync('is_reported')
  if(isReported) {
    return Promise.resolve(isReported)
  }

  return request({
    url: '/report/his/pneumonia',
    method: 'GET',
    data
  }).then(isReported => {
    wx.setStorageSync('is_reported', !!isReported)
    return !!isReported
  })
}
