module.exports = (app) => {
  console.log('app', app)
  const { Anim, request, dayjs } = app
  const {
    observe
  } = Anim.wedux

  class Mine {
    constructor() {
      this.initMineInfo()
    }

    initMineInfo() {
      this.reportList = []
      this.todoReportList = []
      this.doingReportList = []
      this.doneReportList = []
      this.checkList = []
      this.todoCheckList = []
      this.doingCheckList = []
      this.doneCheckList = []
    }

    filterData(data) {
      data.forEach(item => {
        item.createTime = dayjs(item.createTime).format('YYYY/MM/DD HH:mm')
      })
    }

    fetchAffairList(data = {
      "order": "DESC",
      "pageNo": 1,
      "pageSize": 100,
      status: 0
    }) {
      const { status } = data
      wx.showLoading({
        title: '努力加载中...'
      })
      return request({
        url: '/usercenter/affair/list',
        method: 'POST',
        data
      })
        .then(res => {
          wx.hideLoading()
          console.log('Affair', res)
          const { pageData: data } = res
          this.filterData(data)
          if (+status === 0) {
            this.todoAffairList = data
          }
          if (+status === 1) {
            this.doingAffairList = data
          }
          if (+status === 2) {
            this.doneAffairList = data
          }
          return data
        })
        .catch(err => {
          console.error(err)
          wx.hideLoading()
        })
    }

    fetchCheckSelfList(data = {
      clueType: 0,
      "order": "DESC",
      "pageNo": 1,
      "pageSize": 100,
      status: 0
    }) {
      const { status } = data
      wx.showLoading({
        title: '努力加载中...'
      })
      return request({
        url: '/usercenter/report/getPneumoniaList',
        method: 'POST',
        data
      })
        .then(res => {
          wx.hideLoading()
          console.log('getCheckSelfInfo', res)
          const { pageData: data } = res
          this.filterData(data)
          if (+status === 0) {
            this.todoCheckList = data
          }
          if (+status === 1) {
            this.doingCheckList = data
          }
          if (+status === 2) {
            this.doneCheckList = data
          }
          return data
        })
        .catch(err => {
          console.error(err)
          wx.hideLoading()
        })
    }

    fetchReportList(data = {
      clueType: 1,
      "order": "DESC",
      "pageNo": 1,
      "pageSize": 100,
      status: 0
    }) {
      const { status } = data
      wx.showLoading({
        title: '努力加载中...'
      })
      return request({
        url: '/usercenter/report/getPneumoniaList',
        method: 'POST',
        data
      })
        .then(res => {
          wx.hideLoading()
          console.log('getReportList', res)
          const { pageData: data } = res
          this.filterData(data)
          if (+status === 0) {
            this.todoReportList = data
          }
          if (+status === 1) {
            this.doingReportList = data
          }
          if (+status === 2) {
            this.doneReportList = data
          }
          return data
        })
        .catch(err => {
          console.error(err)
          wx.hideLoading()
        })
    }

  }

  return observe(new Mine(), 'mine')
}
