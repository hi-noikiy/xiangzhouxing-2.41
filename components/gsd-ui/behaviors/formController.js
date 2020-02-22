"use strict";
const Event = require('../../gsd-lib/event/index');

/**
 * 处理所有表单相关组件
 */
module.exports = Behavior({
    relations: {
        '../g-form-item/index': {
            type: 'child'
        },
        '../g-form/index': {
            type: 'ancestor'
        }
    },
    properties: {
        required: Boolean,
        disabled: Boolean,
        status: {
            type: String,
            observer(_status) {
                this.setData({ _status });
            }
        },
        statusMessage: {
            type: String,
            observer(_statusMessage) {
                this.setData({ _statusMessage });
            }
        }
    },
    data: {
        _status: '',
        _statusMessage: ''
    },
    methods: {
        // 获取 Form 节点
        getFormNode() {
            const form = this.getRelationNodes('../g-form/index');
            return form && form[0];
        },
        // 对外提供 warn 方法
        warn(errorConfig) {
            this.setData({
                _status: 'warn',
                _statusMessage: errorConfig.message || '填写有误'
            }, () => {
                Event.dispatch('g-form__warn')
            });
        }
    }
});
