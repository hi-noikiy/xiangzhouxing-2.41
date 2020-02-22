"use strict";
// pages/g-modal/index.js
Component({
    properties: {
        visible: {
            type: Boolean,
            value: false,
            observer(newValue) {
                this.setData({ _visible: newValue });
            }
        },
        title: {
            type: String,
            value: '提示'
        },
        showCancel: {
            type: Boolean,
            value: true
        },
        cancelText: {
            type: String,
            value: '取消'
        },
        cancelColor: {
            type: String,
            value: '#000000'
        },
        confirmText: {
            type: String,
            value: '确定'
        },
        confirmColor: {
            type: String,
            value: '#4293F4'
        },
        confirmInfo: {
            type: Boolean,
            value: false
        }
    },
    data: {
        _visible: false
    },
    methods: {
        handleCancel() {
            this.triggerEvent('cancel');
        },
        handleConfirm() {
            this.triggerEvent('confirm');
        }
    }
});
module.exports = {};
