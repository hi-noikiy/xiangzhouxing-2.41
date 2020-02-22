// // components/dgd-weui/dgd-card-upload/dgd-card-upload.js
// import sdk = require('../../dgd-sdk/index')
// import { rejects } from 'assert'
// const wxapp = sdk.wxapp
// const _upload = sdk.api.upload
// const _download = sdk.api.download
// const typeConf = {
//   zhengjianzhao: {}
// }
// const CGI = sdk._CGI
// // 证件照最大文件尺寸 500 kb
// const maxFileSize = 500 * 1024
// Component({
//   properties: {
//     autoClip: {
//       type: Boolean,
//       value: true,
//       observer(newValue: boolean) {
//         console.log(newValue)
//         this.setData({ _isClip: newValue })
//       }
//     },
//     label: String,
//     value: {
//       type: Object,
//       value: {}
//     },
//     maxFileSize: Number,
//     action: String,
//     name: {
//       type: String,
//       value: 'file'
//     },
//     sourceType: {
//       type: Array,
//       value: [ 'album', 'camera' ],
//       __type__: (value: any[]) => value
//     },
//     data: {
//       type: Object,
//       value: {}
//     }
//   },
//   data: {
//     _isClip: true,
//     _filePath: ''
//   },
//   methods: {
//     // 切换是否自动裁剪
//     handleSwitchChange(e) {
//       this.setData({
//         _isClip: e.detail.value
//       })
//     },
//     // 上传照片
//     uploadImage() {
//       const { action, data } = this.properties
//       this.chooseImage()
//         .then((filePath: string) => {
//           wx.showLoading()
//           return this.checkMaxFileSize(filePath)
//         })
//         .then((filePath) => {
//           if (this.data._isClip) {
//             return this.uploadClipPhoto(filePath)
//           } else {
//             return filePath
//           }
//         })
//         .then((filePath) => {
//           return _upload({
//             url: action,
//             name: 'file',
//             filePath,
//             formData: data
//           }).then((res) => {
//             wx.hideLoading()
//             this.triggerEvent('change', {
//               value: {
//                 filePath
//               }
//             })
//             this.triggerEvent('upload', res)
//           })
//         })
//         .catch(err => {
//           this.handleUploadFail(err)
//         })
//     },
//     // 检查文件最大值
//     checkMaxFileSize(filePath: string) {
//       const { maxFileSize } = this.properties
//       if (!maxFileSize) {
//         return Promise.resolve(filePath)
//       }
//       return this.getFileInfo(filePath)
//         .then((res: any) => {
//           console.log('size check: ', res.size <= maxFileSize)
//           if (res.size <= maxFileSize) {
//             return filePath
//           } else {
//             wxapp.showModal({
//               title: '上传失败',
//               content: '上传的照片尺寸过大',
//               showCancel: false,
//               confirmText: '知道了'
//             })
//             throw new Error('尺寸过大')
//           }
//         })
//     },
//     // 上传到证件照裁剪
//     uploadClipPhoto(filePath: string) {
//       return _upload({
//         url: CGI.upload.zhengjianzhao,
//         name: 'file',
//         data: {
//           segmentationtype: 0
//         },
//         filePath
//       }).then((resp: any) => {
//         console.log('证件照接口返回数据：', resp)
//         if (resp.errcode === 0) {
//           return _download({
//             url: resp.data.id_photo_url
//           }).then(res => {
//             return res.tempFilePath
//           })
//         }
//         if (resp.errcode === 12095) {
//           wxapp.showModal({
//             title: '上传失败',
//             content: '未能正确识别人脸，请重新确认照片后上传',
//             showCancel: false,
//             confirmText: '知道了'
//           })
//         }
//         throw new Error('上传失败')
//       })
//     },
//     // 预览照片
//     handlePreview() {
//       sdk.wxapp.previewImage({
//         urls: [ this.properties.value.filePath ]
//       })
//     },
//     // 清除照片
//     handleRemove() {
//       this.triggerEvent('remove', { value: this.properties.value})
//       this.triggerEvent('change', { value: {} })
//     },
//     // 统一处理失败
//     handleUploadFail(err: string, isCancel = false) {
//       console.log('g-clip-photo error: ', err)
//       // 如果是取消选择的话，不做处理
//       if (isCancel) {
//         return
//       }
//       wx.hideLoading()
//       setTimeout(() => {
//         wx.showToast({
//           title: '上传失败',
//           icon: 'none'
//         })
//       }, 100)
//       this.triggerEvent('uploadFail', {message: err})
//       this.handleRemove()
//     },
//     // getFileInfo promise
//     getFileInfo(filePath: string) {
//       return new Promise((resolve, reject) => {
//         wx.getFileInfo({
//           filePath,
//           success(res: any) {
//             resolve(res)
//           },
//           fail(err: any) {
//             reject(err)
//           }
//         })
//       })
//     },
//     // 选择图片
//     chooseImage() {
//       return new Promise((resolve, reject) => {
//         wx.chooseImage({
//           count: 1,
//           sizeType: ['compressed'],
//           sourceType: this.properties.sourceType,
//           success: (res) => {
//             resolve(res.tempFilePaths[0])
//           },
//           fail: reject
//         })
//       })
//     },
//   }
// })
