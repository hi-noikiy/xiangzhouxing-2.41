const reportHealth = require('../../services/health-code.js');
const watch = require("../../../../utils/watch.js");
const {  Anim,  userStore,  config } = getApp()
Anim.Page({
  store: (store) => ({
    userInfo: store.user.userInfo
  }),

  /**
   * 页面的初始数据
   */
  data: {
    path: '',
    authCode: '',
    selfForm: {
      username: '',
      identity: '',
      identityType: 1
    },
    identityInputType: 'idcard',
    cardTypeRange: [{
      name: '身份证',
      value: 1
    }
    // {
    //   name: '护照',
    //   value: 3
    // },
    // {
    //   name: '军官证',
    //   value: 4
    // },
    // {
    //   name: '港澳居民来往内地通行证',
    //   value: 8
    // },
    // {
    //   name: '台湾居民来往内地通行证',
    //   value: 9
    // },
    // {
    //   name: '外国人永久居留身份证',
    //   value: 10
    // },
    // {
    //   name: '港澳居民居住证',
    //   value: 6
    // },
    // {
    //   name: '台湾居民居住证',
    //   value: 7
    // },
    // {
    //   name: '出入境通行证',
    //   value: 11
    // }
    ],
    selfFormRules: {
      username: [{
        type: 'required',
        message: '请填写姓名'
      }],
      identityType: [{
        type: 'required',
        message: '请选择证件类型'
      },],
      identity: [{
        type: 'required',
        message: '请输入证件号码'
      },
      {
        type: 'id',
        message: '请输入正确的身份证号码'
      },
      ],
    },
  },
  //提交表单
  handleSelfSubmit(e) {
    console.log(wx.getStorageSync('wx-openid'))
    if (!e.detail.validStatus) {
      return
    }
    console.log(e)
    let reg = /[^\u0020-\u007E\u00A0-\u00BE\u2E80-\uA4CF\uF900-\uFAFF\uFE30-\uFE4F\uFF00-\uFFEF\u0080-\u009F\u2000-\u201f\u2026\u2022\u20ac\r\n]/g;
    if (e.detail.value.username.match(reg)) {
      wx.showToast({
        title: '不支持表情输入',
        icon:'none'
      })
      return

    }

    if (e.detail.value.identityType == 1) {
      //身份证-需要先微信实名认证再提交
      this.authindexPara(e)
    } else {
      //其他证件-直接提交
      this.realnameSave(e)
    }

  },

 
  //获取微信支付实名认证授权码
  authindexPara(e) {
    wx.showLoading({
      title: '请稍候',
    })
    let realNameSetting = config[config.env].realNameSetting;
    if(realNameSetting == 'city'){
      wx.hideLoading();
      //获取微信支付实名认证授权码
      wx.navigateToMiniProgram({
        appId: 'wx308bd2aeb83d3345',
        path:'subPages/city/wxpay-auth/main',
        // extraData: res,
        // envVersion: 'release',
        success: (res) => {
          console.log('测试：', res)
          // 打开成功
          wx.onAppShow(res => {
            console.log('APP启动返回的参数city实名验证-开始')
            console.log(res)
            console.log('APP启动返回的参数city实名验证-结束')
            let a = res.referrerInfo.extraData;
            wx.showToast({
              title: a.code.auth_code || a.code
            })
            wx.offAppShow()
            this.data.authCode = a.code.auth_code || a.code
            this.setData({
              authCode: a.code.auth_code || a.code

            })
            this.authCode(e.detail.value)

          })

          console.log('success', res)
        },
        fail(res) {
          //错误
          wx.hideLoading();
          console.log('fail', res)
          wx.showToast({
            title: '请求失败',
            icon: 'none'
          })
        }
      })
    }else{
      reportHealth.authindexPara(wx.getStorageSync('wx-openid')).then(res => {
        console.log('跳转的参数',res);
        wx.hideLoading();
        //获取微信支付实名认证授权码
        wx.navigateToMiniProgram({
          appId: 'wx88736d7d39e2eda6',
          path: 'pages/oauth/authindex',
          extraData: res,
          envVersion: 'release',
          success: (res) => {
            // console.log('跳转认证', res);
            // 打开成功
            wx.onAppShow(res => {
                console.log('APP启动返回的参数wx支付验证-开始');
                console.log(res);
                console.log('APP启动返回的参数wx支付验证-结束');

              let a = res.referrerInfo.extraData;
              wx.showToast({
                title: a.auth_code,
              })
              wx.offAppShow()
              this.data.authCode = a.auth_code
              this.setData({
                authCode: a.auth_code
              })
              this.authCode(e.detail.value)

            })

            console.log('success', res)
          },
          fail(res) {
            //错误
            wx.hideLoading();
            console.log('fail', res)
            wx.showToast({
              title: '请求失败',
              icon: 'none'
            })
          }
        })

      }, error => {
        wx.hideLoading();

        console.log('eror', eror)
        wx.showModal({
          title: '提交失败',
          content: eror.errmsg,
          showCancel: false
        })


      })
    }
  },
  //微信实名认证判断
  authCode(data) {

    //let authCode = ' '
    wx.showLoading({
      title: '请稍候',
    })

    let value = {
      "identity": data.identity,
      "identityType": data.identityType,
      "name": data.username
      // "phone": this.data.userInfo.phone
    };
    reportHealth.wxAut(this.data.authCode, value).then(res => {
      console.log('验证：', res)
      wx.hideLoading();
      let obj = JSON.parse(res)
      let verify_openid = obj.verify_openid;
      let isSuccess = false;
      let message = '';
      if ('V_OP_NM_MA' == verify_openid) {
        // 用户与姓名匹配
        if (obj.verify_real_name == 'V_NM_ID_MA') {
          isSuccess = true;//姓名与证件号匹配
        } else {
          message = ' 姓名与证件号不匹配'
        }

      } else {
        message = ' 用户与姓名不匹配'
      }
      if (isSuccess) {
        wx.hideLoading()
      }
      wx.showModal({
        title: isSuccess ? '认证成功' : '认证失败',
        content: message,
        showCancel: false,
        success: () => {
          if (isSuccess){
            wx.navigateBack({
              delta: 1
            })
          }
           
        }
      })
      console.log('then', res)
      this.setData({
        authCode: res
      })
      

    }, error => {
      wx.hideLoading()
      wx.showToast({
        icon: 'none',
        title: '请求失败:' + error.errmsg,
      })
      console.log('error', error)
    })


  },
  //实名信息提交保存
  realnameSave(e) {
    console.log("e.detail.value++++", e.detail.value);
    let _data = e.detail.value;
    let value = {
      "identity": _data.identity,
      "identityType": _data.identityType,
      "name": _data.username,
      // "phone": this.data.userInfo.phone
    };
    wx.showLoading({
      title: '请稍候',
    })

    reportHealth.realnameSave(value).then(res => {
      wx.hideLoading();
      console.log('e++++', res)
      wx.showModal({
        title: '',
        content: '认证成功',
        showCancel: false,
        success: () => {
          if (this.data.path) {
            wx.redirectTo({
              url: this.data.path,
            })
          } else {
            wx.navigateBack({
              delta: 1
            })
          }
        }
      })
    }, error => {
      wx.hideLoading();
      console.log('eror', error)
      wx.showModal({
        title: '认证失败',
        content: error.errmsg,
        showCancel: false
      })
    })

  },

  //输入框内容变换调用
  handleFormChange(e) {
    const {
      dataset,
      id
    } = e.target
    this.setData({
      [`${dataset.form}.${id}`]: e.detail.value
    })
  },
  //表单自定义规则
  validateType: {
    symptomDscrLength(value) {
      return value.length <= 10
    },
    contentLength(value) {
      return value.length > 10
    },
    titleLength(value) {
      return value.length <= 20
    },
    checkBirthday(value) {
      if (!birthday)
        return false;
      let age = dayjs().diff(dayjs(value).format("YYYY-MM-DD"), "year");
      return age >= 0 && age <= 130;
    }
  },
  //监听页面表单数据变化
  watch: {
    'selfForm': function (data) {
      // console.log('selfForm Data Change', data)
    },
    'selfForm.identityType': function (value) {
      // console.log("这是value",value)
      const rules = this.data.selfFormRules || []
      let identityInputType = 'text'
      // 身份证 添加校验
      switch (parseInt(value)) {
        case 1:
          identityInputType = 'idcard'
          rules.identity[1] = {
            type: 'id',
            message: '请输入正确的身份证号码'
          }
          break;
        default:
          rules.identity = rules.identity.slice(0, 1)
      }

      this.setData({
        identityInputType,
        selfFormRules: rules
      })
    },
    'selfForm.identity': function (value) {
      const rules = this.data.selfFormRules || [];
      try {
        let birthday = getBirthdayFromIdcard(value);
        if (birthday && dayjs(dayjs(birthday).format("YYYYMMDD")).isValid() && dayjs().diff(dayjs(birthday).format("YYYYMMDD"), "year") <= 130) {
          this.setData({
            'selfForm.birthday': dayjs(birthday).format("YYYY-MM-DD")
          });
        }
        rules.identity.push({
          type: 'checkIdentity',
          message: '请输入合法的身份证号'
        });
        this.setData({
          selfFormRules: rules
        })
      } catch (e) { }

    },
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    watch.setWatcher(this); // 设置监听器，建议在onLoad下调用
    this.data.path = options.path
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  test() {
    let res = {
      "api_version": "1.0",
      "appid": "wx2ac2313767a99df9",
      "mch_id": "1462175602",
      "nonce_str": "7yokqksnhj2578e8ot8x0f9055fzjcvv",
      "openid": "oYecs5LlPxoQn8NzU3zXyH8ZnoUc",
      "response_type": "code",
      "scope": "pay_identity",
      "sign": "05AC0618FEBFE2CD73A07BBD6200BFB1339DE9A0E5B5D6C525CE21F4F50AE2ED",
      "sign_type": "HMAC-SHA256"
    }

    //获取微信支付实名认证授权码
    wx.navigateToMiniProgram({
      appId: 'wx88736d7d39e2eda6',
      path: 'pages/oauth/authindex',
      extraData: res,
      envVersion: 'release',
      success: (res) => {
        // 打开成功
        wx.onAppShow(res => {
          let a = res.referrerInfo.extraData;
          wx.showToast({
            title: a.auth_code,
          })
          wx.offAppShow()
          this.data.authCode = a.auth_code
          this.setData({
            authCode: a.auth_code

          })

        })

        console.log('success', res)
      },
      fail(res) {
        //错误
        console.log('fail', res)
      }
    })


  }

})