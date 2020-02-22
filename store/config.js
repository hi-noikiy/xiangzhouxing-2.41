module.exports = (app) => {
  console.log('app', app);
  const { Anim, request, config, wxp, storage } = app;
  const cacheKey = '__wll_config__';
  const {
    observe,
  } = Anim.wedux;

  class Config {
    constructor () {
      this.initConfigInfo();
    }

    initConfigInfo () {
      this.wllConfig = {};
    }

    requestConfig () {
      return wxp.request({
        url: config.cdnDomain + config[config.env].wllConfigPath + '?t=' +
          Date.now(),
        method: 'GET',
      }).then(res => {
        this.wllConfig = res.data;
        // 口罩购买方式:lot(摇号)、preorder(抢购)
        app.buyType = this.wllConfig.buy_type;
        // 缓存时间：10分钟
        storage.setStorageSync(cacheKey, this.wllConfig, config.wllConfigCacheTime);
        return this.wllConfig;
      });
    }

    fetchWllConfig () {
      const wllConfig = storage.getStorageSync(cacheKey);
      let promise = Promise.resolve(wllConfig);
      if (!wllConfig) {
        promise = this.requestConfig();
      }
      else {
        this.wllConfig = wllConfig;
        // 口罩购买方式:lot(摇号)、preorder(抢购)
        app.buyType = wllConfig.buy_type;
      }
      return promise;
    }

    weGetDecodeURIComponent(query){
      const scene = decodeURIComponent(query.scene)
      wx.request({
        url: '', //仅为示例，并非真实的接口地址
        data: {
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          console.log(res.data)
        }
      })
    }

  }

  return observe(new Config(), 'config');
};
