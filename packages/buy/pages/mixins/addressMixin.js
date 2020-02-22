module.exports= {
  data:{ 
    chooseAddrFail:false,
  },
  handleChooseAddrFail(e) {
    //添加规则
    const rules = this.data.rules || {}
    const addrRules = e.detail.rules || {}
    Object.assign(rules, addrRules);
    //添加字段
    const formData = this.data.formData || {}
    const addrFormData = e.detail.formData || {}
    Object.assign(formData, addrFormData);
    //删除地址验证
    delete rules.mail_address

    this.setData({
      rules,
      formData,
      chooseAddrFail: true
    })
  },
  handleUpdateAddress(e) {
    if (e.detail.addressInfo) {
      this.setData({
        'formData.mail_address': e.detail.addressInfo
      })
    }
  },
  handleUpdateAddressField(e) {
    this.setData({
      [`formData.${e.detail.id}`]: e.detail.value
    })
  },
}
