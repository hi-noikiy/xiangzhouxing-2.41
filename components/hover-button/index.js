// components/my-cpn/hover-botton/index.js
Component({

//样式开放
  externalClasses: ['add_icon'],
  options: {
    styleIsolation: 'shared'
  },
  /**
   * 组件的属性列表
   */
  properties: {
    imgSrc:{
      type:String,
      value: ''
    },
    pdfUrl:{
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {


  },

  /**
   * 组件的方法列表
   */
  methods: {
    adddetial: function () {
      
    //扩展方法
      // var myEventDetail = {} // detail对象，提供给事件监听函数
      // var myEventOption = {} // 触发事件的选项
      // this.triggerEvent('detial', myEventDetail, myEventOption)
      var url = this.data.pdfUrl
      wx.showLoading()
      wx.downloadFile({
        url: url,
        success(res) {
          let path = res.tempFilePath;
          wx.openDocument({
            filePath: path,
            fileType: "pdf",
            success() {
              wx.hideLoading()
              // wx.navigateBack({
              //   delta: 2
              // })
            }
          })
        }
      })
    }
  }
})
