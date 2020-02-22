// components/tips/index.js
Component({
  slot: true,
  /**
   * 组件的属性列表
   */
  properties: {
    status: {
      type: String,
      value: 'info'
    },
    to: String,
    access: Boolean,
    loopDuration: Number,
    loop: Boolean
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

  }
})
