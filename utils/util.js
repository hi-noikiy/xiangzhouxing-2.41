const config = require('./../config/index')

function convert_length(length) {
  return Math.round(wx.getSystemInfoSync().windowWidth * length / 750);
}

// 选择地址
function chooseLocation() {
  return new Promise((resolve, reject) => {
    //获取当前位置
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: (res) => {
        //纬度
        const latitude = res.latitude
        //经度
        const longitude = res.longitude
        //打开地图选择位置
        wx.chooseLocation({
          latitude,
          longitude,
          scale: 18,
          success: resolve,
          fail: (err) => {
            if(err.errMsg.includes('fail auth deny')) {
              wx.showModal({
                title: '无法获取定位',
                content: '请先授权获取当前定位信息',
                success(res) {
                  if(res.confirm) {
                    wx.openSetting()
                  }
                }
              })
            }
          }
        })
      },
      fail: (err) => {
        if(err.errMsg.includes('fail auth deny')) {
          wx.showModal({
            title: '无法获取定位',
            content: '请先授权获取当前定位信息',
            success(res) {
              if(res.confirm) {
                wx.openSetting()
              }
            }
          })
        }
      }
     })
  })
}

function navigateToWebview(url) {
  wx.navigateTo({
    url: '/pages/web-view/index?webUrl=' + encodeURIComponent(url),
  })
}

module.exports = {
  chooseLocation,
  navigateToWebview
}
