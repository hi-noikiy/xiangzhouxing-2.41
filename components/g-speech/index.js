// components/g-speech/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    show: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleStart() {
      console.log('start')
    },
    handleStop() {
      console.log('stop')
    },
    handleOpen() {
      this.setData({ show: true })
    },
    handleClose() {
      this.setData({ show: false })
    }
  }
})
