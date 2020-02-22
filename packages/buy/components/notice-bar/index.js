// pages/buy/components/notice-bar/index.js
var FONT_COLOR = '#FF9F00';
var BG_COLOR = '#FFF3DE';
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    text: {
      type: String,
      value: ''
    },
    mode: {
      type: String,
      value: ''
    },
    url: {
      type: String,
      value: ''
    },
    openType: {
      type: String,
      value: 'navigate'
    },
    leftIcon: {
      type: Boolean,
      value: true
    },
    rightIcon: {
      type: Boolean,
      value: true
    },
    color: {
      type: String,
      value: FONT_COLOR
    },
    backgroundColor: {
      type: String,
      value: BG_COLOR
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    show: true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onClickIcon: function () {
      this.setData({ show: false });
    },
    onClick: function () {
      this.triggerEvent('click');
    }
  }
})
