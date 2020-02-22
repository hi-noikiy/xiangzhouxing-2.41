const barcode = require('./barcode');

function convert_length(length) {
  return Math.round(wx.getSystemInfoSync().windowWidth * length / 750);
}

function barc(id, code, width, height) {
  barcode.code128(wx.createCanvasContext(id), code, convert_length(width), convert_length(height))
}

// 获取购买配置信息
function getBuyFlowInfo (wllConfig) {
  let buy_flow_info = wllConfig.buy_flow_info;
  if (wllConfig.buy_type === 'lot') {
    buy_flow_info = wllConfig.lot_flow_info;
  }
  return buy_flow_info || {};
}

module.exports = {
  getBuyFlowInfo,
  barcode: barc
}
