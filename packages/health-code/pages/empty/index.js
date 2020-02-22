const { Anim, request } = getApp()

Anim.Page({
  data: {
    emptyIcon: 'https://imgcache.gzonline.gov.cn/cos/empty_0283358d.svg',
    texd: '',
  },
  onLoad({ title, text, t2 }) {
    title && wx.setNavigationBarTitle({
      title
    })
    this.setData({ text, t2 })
  }
})
