/*
* 使用方法
const wxReportSdk = require('./components/gsd-lib/report/index.js');
new wxReportSdk({
    reportUrl:'http://www.qq.com',
})
*/

class wxReportSdk {
  constructor (opt) {
    this.originPage = Page;
    this.originApp = App;
    this.logTimer = null;

    this.config = {
      stopReport: false, // 停止上报
      isNet: true, // 是否上报网络信息（默认：true）
      isSys: true, // 是否上报系统信息（默认：true）
      isError: false, // 是否开启错误上报 （默认：false）
      autoReportPV: false, // 是否自动上报页面PV
      autoReportCgi: true, // 是否自动上报cgi测速
      commonPageEId: 'YSS_ALLPAGES_ONSHOW', // 统一的页面上报标志
      getRemoteParamsUrl: '',// 获取远程参数url
      reportUrl: '', // 上报url
      intervalTime: 3, // 间隔多久执行一次上报，默认3秒
      reportLogsNum: 5, // 每次合并上报记录条数，默认5次
    };

    this.reportData = {
      openid: '', // 用户标识
      platform: '', //平台 Andriod、ios、devtools
      report_type: 2, // 上报类型（枚举值）：1、cgi上报2、自定义埋点上报
      path: '', // path路径，不包括参数，可自定义路径，用作埋点上 报（全局唯一）
      type: 1, // 成功失败。1成功;2失败（非200、返回解释失败）;3 逻辑失败
      code: -711, // 返回码
      time: 0, // 延时（单位毫秒），只用作cgi上报
      apn: 'unknow', // 用户的 apn,网络类型: 2g, 3g, 4g, wifi, unknow
      desc: '', // 描述，也可用于错误描述
      rate: 100, // 采样率（100意为1/100采样（每100次请求上报一 次），未上报视为1）
      system_info: {}, // brand、model、version、system、platform、SDKVersion （获取 wx.getSystemlnfo获取）
      create_time: '', // 上报时间
      channel: '', // 渠道号
      source: '', // 事件类型， 值： page, click, cgi
      expansion1: '', // 扩展字段
      expansion2: '', // 扩展字段
      expansion3: '', // 扩展字段
      appid: '001', // 应用appid
      eid: '001', // 事件id
      scene: '', // 场景
      region: '', // 城市码
    };

    this.config = Object.assign(this.config, opt || {});
    this.reportLogs = [];
    this._init();
  }

  startReport () {
    const _this = this;
    _this._logRequest();
    _this.logTimer = setInterval(function () {
      _this._logRequest();
    }, _this.config.intervalTime * 1000);
  }

  /*点击流上报
  * eid 事件id
  * params 额外参数对象
  * */
  eventClick (eid, params = {}) {
    this._statpid({
      report_type: 2, // 上报类型（枚举值）：1、cgi上报2、自定义埋点上报
      type: 1, // 成功失败。1成功;2失败（非200、返回解释失败）;3 逻辑失败
      code: 200,
      rate: 100,
      source: 'click', // 事件类型， 值： page, click, cgi
      eid: eid, // 事件id
      exp1: params.itemId || '', // 事项id
      exp2: params.itemStatus || '', // 事项状态 entrance：进入 success：成功 fail：失败
      region: params.region || '', // 城市码
    });
  }

  /*cgi测速
  * {code:"",time:"",path:""}
  * */
  cgiSpeed (opt) {
    let type = 1;
    if (opt.code !== 0) {
      type = 2;
    }
    this._statpid({
      report_type: 1, // 上报类型（枚举值）：1、cgi上报2、自定义埋点上报
      type: type, // 成功失败。1成功;2失败（非200、返回解释失败）;3 逻辑失败
      code: opt.code, // 返回码
      path: opt.path, // cgi访问路径
      time: opt.time, // 延时（单位毫秒），只用作cgi上报
      rate: 100, // 采样率（100意为1/100采样（每100次请求上报一 次），未上报视为1）
      source: 'cgi', // 事件类型， 值： page, click, cgi
    });
  }

  /*页面pv上报
 * pageId 页面标识id
 * exp 额外参数
 * */
  pagePV (pageId, params = {}) {
    this._statpid({
      report_type: 2, // 上报类型（枚举值）：1、cgi上报2、自定义埋点上报
      type: 1, // 成功失败。1成功;2失败（非200、返回解释失败）;3 逻辑失败
      code: 200,
      rate: 100,
      source: 'page', // 事件类型， 值： page, click, cgi
      eid: pageId, // 事件id
      region: params.region || '', // 城市码
    });
  }

  _init () {
    if (this.config.stopReport) return;
    this._spyApp();
    this._spyPage();
    if (this.config.autoReportCgi) this._spyRequest();
    if (this.config.isNet) this._network();
    if (this.config.isSys) this._system();
  }

  // 包装App对象
  _spyApp () {
    const _this = this;
    App = (app) => {
      const _onError = app.onError || function () { };
      const _onLaunch = app.onLaunch || function () { };
      const _onHide = app.onHide || function () { };
      app.onLaunch = function (opt) {
        _this.reportData.appid = opt.referrerInfo && opt.referrerInfo.appId ||
          '';
        _this.reportData.scene = opt.scene;
        if (_this.config.getRemoteParamsUrl) {
          wx.request({
            url: _this.config.getRemoteParamsUrl,
            data: {},
          }).then((res) => {
            if (res.open) {
              _this.config = Object.assign(_this.config,
                {
                  intervalTime: res.sec || _this.config.intervalTime,
                  reportLogsNum: res.num || _this.config.reportLogsNum,
                  stopReport: !!res.stop,
                });
            }
          });
        }
        return _onLaunch.apply(this, arguments);
      };
      if (this.config.isError) {
        // 错误捕获并上报
        app.onError = function (err) {
          let errspit = err.split(/\n/) || [];
          let src, col, line;
          let errs = err.match(/\(.+?\)/);
          if (errs && errs.length) errs = errs[0];
          errs = errs.replace(/\w.+js/g, $1 => {
            src = $1;
            return '';
          });
          errs = errs.split(':');
          if (errs && errs.length > 1) line = parseInt(errs[1] || 0);
          col = parseInt(errs[2] || 0);
          _this._reportError(JSON.stringify({
            col: col,
            line: line,
            name: src,
            msg: `${errspit[0]};${errspit[1]};${errspit[2]};`,
            type: 'js',
          }));
          return _onError.apply(this, arguments);
        };
      }
      app.onHide = function () {
        if (_this.logTimer) {
          clearInterval(_this.logTimer);
        }
        _this._logRequest(true);
        return _onHide.apply(this, arguments);
      };
      _this.originApp(app);
    };
  }

  // 包装page对象
  _spyPage () {
    const _this = this;
    Page = (page) => {
      const _onShow = page.onShow || function () { };
      page.onShow = function () {
        if (_this.config.autoReportPV) {
          setTimeout(() => {
            _this.pagePV(_this.config.commonPageEId);
          }, 500);
        }
        return _onShow.apply(this, arguments);
      };
      _this.originPage(page);
    };
  }

  // 包装request
  _spyRequest () {
    const originRequest = wx.request;
    const _this = this;
    Object.defineProperty(wx, 'request', {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function () {
        const config = arguments[0] || {};
        let begintime = Date.now();
        const _complete = config.complete || function (data) { };
        config.complete = function (data) {
          // 非上报的地址才做测速上报
          if (config.url.indexOf(_this.config.reportUrl) === -1) {
            //cgi测速
            _this.cgiSpeed({
              code: data.statusCode,
              time: Date.now() - begintime,
              path: config.url,
            });
          }
          return _complete.apply(this, arguments);
        };
        return originRequest.apply(this, arguments);
      },
    });
  }

  // 集中收集 logs 方法
  // type = 'memory' | 'storage'
  _collectLogs (item) {
    let nData = [];
    let oData = this.reportLogs;
    Array.isArray(item) ? nData = item : nData.push(item);
    // 剔除掉无值的字段，减少体积
    nData.forEach(tempItem => {
      for (let tempKey in tempItem) {
        let tempVal = tempItem[tempKey];
        if (tempVal === '' ||
          (typeof tempVal === 'object' && Object.keys(tempVal).length === 0)) {
          delete tempItem[tempKey];
        }
      }
    });
    // 内存不能超过 100 条
    let rule = oData.length > 100;
    if (rule) {
      oData.splice(0, nData.length);
    }
    this.reportLogs = oData.concat(nData);
  }

  // 埋点上报
  // eid: 统计点字串
  // desc: 描述
  // exp1?: 扩展字段1
  // exp2?: 扩展字段2
  // exp3?: 扩展字段3（默认不传，可根据产品需求）
  // source: 类型
  //
  _statpid (opt) {
    if (!opt.path) {
      let currentPages = getCurrentPages();
      if (currentPages && currentPages.length) {
        const length = currentPages.length;
        const lastpage = currentPages[length - 1];
        opt.path = lastpage.__route__;
        opt.ext = lastpage.options || {};
      }
    }
    const _statpid2 = this._getCookiedReportData(opt);
    this._collectLogs(_statpid2);
  }

  /*错误上报
  * desc 错误信息
  * */
  _reportError (desc) {
    this._statpid({
      report_type: 2, // 上报类型（枚举值）：1、cgi上报2、自定义埋点上报
      type: 3, // 成功失败。1成功;2失败（非200、返回解释失败）;3 逻辑失败
      code: -7001,
      rate: 100,
      source: 'click', // 事件类型， 值： page, click, cgi
      desc: desc, // 错误信息
    });
  }

  _getCookiedReportData (opt) {
    return Object.assign({}, this.reportData, {
      openid: wx.getStorageSync('openid') || opt.openid,
      type: opt.type,
      report_type: opt.report_type,
      eid: opt.eid || '',
      path: opt.path || '',
      desc: opt.desc || '',
      time: opt.time || 0,
      create_time: +new Date(),
      expansion1: opt.exp1 || '',
      expansion2: opt.exp2 || '',
      expansion3: opt.exp3 || '',
      expath: opt.expath || '',
      source: opt.source || '',
      region: opt.region || wx.getStorageSync('reportRegion') || '',
      ext: opt.ext || '',
    });
  }

  /*
  * cycle:是否循环上报
  * */
  _logRequest (cycle = false) {
    // 过滤掉开发者工具、测试环境的logs
    let _this = this;
    // 停止上报
    if (_this.config.stopReport) return;
    const reportLogs = _this.reportLogs;
    if (reportLogs.length === 0) {
      return;
    }
    let data = reportLogs.splice(0, _this.config.reportLogsNum);
    wx.request({
      url: _this.config.reportUrl,
      header: {
        'x-tif-sid': wx.getStorageSync('tif-sid'),
        'x-tif-did': wx.getStorageSync('tif-did'),
      },
      data,
      method: 'POST',
      complete (res) {
        if (cycle && res.data && Number(res.data.errcode) === 0 &&
          reportLogs.length > 0) {
          _this._logRequest(true);
        }
        if (res.data && (Number(res.data.errcode) !== 0)) {
          data = data.filter(item => {
            return item.rate !== 1;
          });
          data.forEach(item => {
            item.rate = 1;
          });
          if (data && data.length !== 0) {
            _this._collectLogs(data);
          }
        }
      },
    });
  }

  // 获取网络类型
  _network () {
    wx.getNetworkType({
      success: res => {
        this.reportData.apn = res.networkType;
      },
    });
  }

  // 获取系统信息
  _system () {
    wx.getSystemInfo({
      success: res => {
        this.reportData.system_info = res;
        this.reportData.platform = res.platform;
      },
    });
  }
}

module.exports = wxReportSdk;
