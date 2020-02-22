const { Anim, utils, mineStore, resetTab } = getApp()
const titleMap = {
  check: '我的健康自查上报',
  report: '我的疫情线索上报',
  affair: '我的待办'
}
Anim.Page({
  store(state) {
    return {
      todoReportList: state.mine.todoReportList,
      doingReportList: state.mine.doingReportList,
      doneReportList: state.mine.doneReportList,

      todoCheckList: state.mine.todoCheckList,
      doingCheckList: state.mine.doingCheckList,
      doneCheckList: state.mine.doneCheckList,

      todoAffairList: state.mine.todoAffairList,
      doingAffairList: state.mine.doingAffairList,
      doneAffairList: state.mine.doneAffairList
    }
  },
  data: {
    tabIndex: '0',
    todoType: 'affair',  // check 自查 report 上报 affair 待办处理
  },
  onLoad(options) {
    const todoType = options.todoType
    const tabIndex = options.index || (todoType === 'affair' ? '0' : '1')
    titleMap[todoType] && wx.setNavigationBarTitle({
      title: titleMap[todoType]
    })
    this.setData({
      tabIndex,
      todoType
    });
  },
  onShow() {
    this.fetchData()
  },
  fetchData(todoType = this.data.todoType, tabIndex = this.data.tabIndex) {
    if (todoType === 'check') {
      return mineStore.fetchCheckSelfList({
        // clueType: 0,
        clueTypes: "0,2",
        status: +tabIndex,
        "order": "DESC",
        "pageNo": 1,
        "pageSize": 100
      })
        .then(() => {
          resetTab()
        })
        .catch(err => {
          console.error(err)
          resetTab()
        })
    }
    if (todoType === 'report') {
      return mineStore.fetchReportList({
        clueType: 1,
        status: +tabIndex,
        "order": "DESC",
        "pageNo": 1,
        "pageSize": 100
      })
        .then(() => {
          resetTab()
        })
        .catch(err => {
          console.error(err)
          resetTab()
        })
    }
    if (todoType === 'affair') {
      return mineStore.fetchAffairList({
        status: +tabIndex,
        "order": "DESC",
        "pageNo": 1,
        "pageSize": 100
      })
        .then(() => {
          resetTab()
        })
        .catch(err => {
          console.error(err)
          resetTab()
        })
    }
  },
  handleTabTap(event) {
    const tabIndex = event.detail.value.key
    this.setData({
      tabIndex
    });
    this.fetchData(this.data.todoType, tabIndex)
  },
  handleItem(event) {
    const targetItem = event.target.dataset.item
    console.log('event', targetItem)
    wx.navigateTo({
      url: utils.urlJoinParams('/pages/mine/todo/detail/detail', {
        ...targetItem,
        todoType: this.data.todoType
      })
    })
  }
})
