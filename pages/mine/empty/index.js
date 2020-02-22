const { Anim, request } = getApp()

Anim.Page({
  data: {
    emptyIcon: 'https://imgcache.gzonline.gov.cn/cos/empty_0283358d.svg',
  },
  onLoad({ title }) {
    title && wx.setNavigationBarTitle({
      title
    })
  }
})
