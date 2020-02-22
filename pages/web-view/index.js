const { utils } = getApp()

Page({
  data: {
    webUrl: ''
  },
  /**
   * @param {Object} options
   * options.h5Url: string  // 如果有中文字请转码
   * options.title: string  // 网页title,但不一定能显示
   */
  onLoad(options) {
    const webUrl = decodeURIComponent(options.webUrl || options.h5Url);
    console.log('h5 url: ', webUrl);
    if (webUrl) {
      this.setData({
        webUrl
      });
    }

    if (options.title) {
      wx.setNavigationBarTitle({
        title: decodeURIComponent(options.title)
      });
    }
  }
});
