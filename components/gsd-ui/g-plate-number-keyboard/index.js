// components/plate-number-keyboard/plate-number-keyboard.js
Component({

  behaviors: [],

  properties: {
    visible: { // 控制键盘显示隐藏
      type: Boolean,
      value: false,
      observer() {
        let showProvince = true
        if(this.data.plateNumber.length>=1){
          showProvince = false
        }
        this.setData({
          showProvince
        })
      }
    },
    showMain: {
      type: Boolean,
      value: false
    },
    value: { // 初始化的值
      type: String,
      value: '',
      observer(str) {
        this.setData({
          plateNumber: str
        })
      }
    },
    
  },
  data: {
    provinceHeight: 558,
    numberHieght:466,
    statusBarHeight:0,
    plateNumber: '', // 键盘操作结果值
    provinceList: {
      line1: ['京', '沪', '鄂', '湘', '川', '渝', '粤', '闽', '晋', '黑'],
      line2: ['津', '浙', '豫', '赣', '贵', '青', '琼', '宁', '吉', '蒙'],
      line3: ['冀', '苏', '皖', '桂', '云', '陕', '甘', '藏', '新', '辽'],
      line4: ['鲁', '澳', '港', '学', '挂', '领', '试', '超', '练', '警'],
      line5: ['应急', '民航'],
    },
    letterNumberList: {
      line1: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
      line2: ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'O', 'P','L'],
      line3: ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'N', 'M'],
      line4: ['Z', 'X', 'C', 'V', 'B']
    },
    showProvince: true, // 是否显示省份面板，控制省份面板和字符面板显示
    animationData: {} // 键盘动画
  }, // 私有数据，可用于模板渲染

  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function() {},
    moved: function() {},
    detached: function() {},
  },

  // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
  attached: function() {}, // 此处attached的声明会被lifetimes字段中的声明覆盖
  ready: function() {
    // 如果初始化有值，赋值，否则，置为空
    let that = this
    this.setData({
      plateNumber: this.data.value ? this.data.value : '',
      
    });

    wx.getSystemInfo({
      success: function(res) {
        console.log(res.statusBarHeight)
        that.setData({
          statusBarHeight: res.statusBarHeight,
        });
      },
      failure() {
        
      }
    })
  },

  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function() {},
    hide: function() {},
    resize: function() {},
  },

  methods: {
    /**
     * 键盘面板切换操作，控制省份内容和字符内容显示
     */
    _clickChangePlane: function() {
      this.setData({
        showProvince: !this.data.showProvince
      });
    },
    /**
     * 关闭键盘，将键盘隐藏
     */
    _closeKeyboard: function(e) {
      // 创建动画，执行键盘面板退出动画，动画结束后隐藏整个键盘组件
      // const animation = wx.createAnimation({
      //   duration: 300
      // })
      // setTimeout(function() {
      //   animation.translateY(0).step()
      //   this.setData({
      //     animationData: animation.export()
      //   })
      //   setTimeout(function() {
      //     this.setData({
      //       show: false
      //     })
      //   }.bind(this), 300);
      // }.bind(this), 100);
      this.setData({
        visible: false
      });
      //textarea穿透键盘问题 luyanhua
      this.triggerEvent('closeKeyBoard', false);
    },
    /* 触发外部绑定事件，传递结果值 */
    _handleResult: function() {
      const myEventDetail = {
        value: this.data.plateNumber // 传递到结果文本
      };
      // 触发外部绑定事件，传递结果参数
      this.triggerEvent('change', myEventDetail);
    },
    /**
     * 键盘主要键点击事件，将点击内容更新到plateNumber
     */
    _handleClick: function(e) {
      // 如果当前显示的省份面板，当即任意省份后，自动切换到字符面板，同时将结果值的第一个字符修改
      if (this.data.showProvince) {
        this.setData({
          showProvince: false
        });
      }
      let currentResult = this.data.plateNumber; // 当前的结果值
      let currentText = e.currentTarget.dataset.text; // 当前的操作值

      // 车牌号最多8位，大多数7位，新能源8位，控制不能超过8位数
      if (currentResult.length < 10) {
        this.setData({
          plateNumber: currentResult + currentText
        });

        this._handleResult();
      }
    },
    /**
     * 删除回退点击事件
     */
    _handleDelete: function() {
      let currentText = this.data.plateNumber;
      currentText = currentText.substring(0, currentText.length - 1);
      // 当当前结果值长度大于0时，可执行删减操作
      if (currentText.length >= 0) {

        let showProvince = true
        if(currentText.length>=1){
          showProvince = false
        }
        this.setData({
          showProvince,
          plateNumber: currentText
        })

        this._handleResult();
      }
    },
    /**
     * 防止点击穿透
     */
    _preventDefault: function(e) {}
  }

});