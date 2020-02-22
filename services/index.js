const { request, config, wxp } = getApp()

exports.fetchOverviewData = function() {
  return wxp.request({
    url: config.domain + '/qqnews/yqinfo/GetData?name=disease_china_total'
  })
}







