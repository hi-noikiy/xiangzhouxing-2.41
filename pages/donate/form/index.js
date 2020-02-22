// pages/donate/form/index.js
const { Anim, request } = getApp()

Anim.Page({
  data: {
    otherObj: {},
    formData: {
      listItems: [
        {
          name: '',
          number: ''
        }
      ],
      company: '',
      user_name: '',
      phone: '',
      desc: ''
    },
    materialRange: [
      { name: '医用快速消毒液', value: '医用快速消毒液', displayName: '医用快速消毒液' },
      { name: '医用外科口罩', value: '医用外科口罩', displayName: '医用外科口罩' },
      { name: '医用一次性工作帽', value: '医用一次性工作帽', displayName: '医用一次性工作帽' },
      { name: '医用防护面屏', value: '医用防护面屏', displayName: '医用防护面屏' },
      { name: '医用一次性鞋套', value: '医用一次性鞋套', displayName: '医用一次性鞋套' },
      { name: '其他', value: '其他', displayName: '其他' }
    ],
    addIconSrc: 'https://imgcache.gzonline.gov.cn/cos/add_d7e4b605.svg',
    isNeedDesc: false,
    validateType: {
      checkLimit(value, formData) {
        console.log(value)
        return value + '' <= '9223372036854775807'
      }
    }
  },
  computed: {
    rules() {
      const {
        formData, isNeedDesc
      } = this.data

      const rules = {
        user_name: [{
          type: 'required',
          message: '请填写联系人'
        }],
        company: [{
          type: 'required',
          message: '请填写捐赠单位'
        }],
        phone: [{
          type: 'required',
          message: '请填写联系电话'
        }, {
          type: 'mobile',
          message: '手机号格式不正确'
        }]
      }
      if (isNeedDesc) {
        rules['desc'] = [{ type: 'required', message: '请填写捐赠说明' }]
      }
      formData.listItems.forEach((item, index) => {
        rules[`listItems.${index}.name`] = [{
          type: 'required',
          message: '请选择捐赠物品'
        }]
        rules[`listItems.${index}.number`] = [{
          type: 'required',
          message: '请填写捐赠数量'
        }, {
          type: 'checkLimit',
            message: '捐赠数量不得超过 9223372036854775807'
        }]
      })
      return rules
    }
  },
  /**
   * 提交表单
   */
  handleSubmit(e) {
    if (e.detail.validStatus) {
      wx.showLoading()
      request({
        url: '/donation/add',
        data: this.data.formData,
        method: 'POST'
      }).then(() => {
        wx.hideLoading()
        // 提交成功了，重定向到成功页
        wx.redirectTo({
          url: '/pages/donate/msg/index?tag=1'
        })
      }).catch(err => {
        wx.hideLoading()
        // 提交失败，跳转到失败页
        wx.redirectTo({
          url: '/pages/donate/msg/index?tag=2'
        })
      })
    }
  },
  /**
   * 添加物资
   */
  addMaterial() {
    const {
      formData
    } = this.data

    this.setData({
      formData: Object.assign({}, formData, {
        listItems: formData.listItems.concat({
          name: '',
          number: ''
        })
      })
    })
  },
  /**
   * 删除物资
   */
  removeMaterial(e) {
    const { index } = e.currentTarget.dataset
    const { formData, otherObj } = this.data
    if (formData.listItems.length === 1) {
      wx.showToast({
        title: '请至少填写一项物资',
        icon: 'none'
      })
      return
    }
    const key = `listItems[${index}].name`
    if (otherObj.hasOwnProperty(key)) {
      delete otherObj[key]
    }
    this.setData({
      otherObj: Object.assign({}, otherObj),
      isNeedDesc: !!Object.keys(otherObj).length
    })
    formData.listItems.splice(index, 1)
    this.setData({
      formData: Object.assign({}, formData)
    })
  },
  handleFormChange(e) {
    const { detail: { value }, currentTarget: { id } } = e
    if (id.indexOf('listItems') !== -1 && id.indexOf('name') !== -1) {
      // 此时改变的是捐赠物品名称，如果是“其他”，则「捐赠说明」表单项要置为必填
      const { otherObj } = this.data
      if (value === '其他') {
        otherObj[id] = 1
        this.setData({
          isNeedDesc: true,
          otherObj: Object.assign({}, otherObj)
        })
      } else {
        // 如果之前是其他，现在改变了，则删除
        if (otherObj.hasOwnProperty(id)) {
          delete otherObj[id]
        }
        this.setData({
          otherObj: Object.assign({}, otherObj),
          isNeedDesc: !!Object.keys(otherObj).length
        })
      }
    }
    this.setData({
      [`formData.${e.target.id}`]: value
    })
  }
})
