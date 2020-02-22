module.exports= {
  openTipsModal () {
    if (this.data.wllConfig.buy_type !== 'lot') {
      return;
    }
    let result_notice = this.data.wllConfig.lot_flow_info.result_notice;
    if (!result_notice.is_open) return;
    const cacheVersionKey = `__result_notice_version__`;
    if (result_notice.version !== wx.getStorageSync(cacheVersionKey)) {
      this.showNoticeModal(result_notice);
      wx.setStorageSync(cacheVersionKey, result_notice.version);
    }
  },
  showNoticeModal (result_notice) {
    if (result_notice.type === 'click') {
      result_notice = this.data.wllConfig.lot_flow_info.result_notice;
    }
    wx.showModal({
      showCancel: false,
      confirmText: '知道了',
      title: result_notice.title || '重要通知',
      content: result_notice.content,
    });
  },
}
