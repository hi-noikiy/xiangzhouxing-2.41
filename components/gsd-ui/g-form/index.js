"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// pages/g-form/index.js
const FormControllerBehavior = require("../behaviors/formController");
const primarySecondButtonBehaviors = require("../behaviors/primarySecondButton");
const validator = require("../utils/validator");
const _ = require('../utils/helper');
const Event = require('../../gsd-lib/event/index');
const { debounce } = require('../../gsd-lib/utils/index');
Component({
    __loading__: false,
    options: {
        multipleSlots: true
    },
    behaviors: [primarySecondButtonBehaviors],
    relations: {
        'form-fields': {
            type: 'descendant',
            target: FormControllerBehavior
        }
    },
    properties: {
        model: {
            type: Object,
            value: {}
        },
        rules: {
            type: Object,
            value: {},
            observer(newValue) {
                if (newValue) {
                    this.resetFormFiels();
                }
            }
        },
        showTips: {
            type: Boolean,
            value: true
        },
        showAgree: Boolean,
        autoAgree: Boolean,
        disabled: Boolean,
        buttonDirection: {
            type: String,
            value: 'horizontal'
        },
        validateType: {
            type: Object,
            value: {}
        },
        submitEvent: String,
        tipsEvent: String,
        debounceDuration: {
          type: Number,
          value: 300
        },
    },
    data: {
        _isAgree: false,
        _tipsShow: false,
        _tipsMessage: '表单提交失败'
    },
    onLoad () {
      this.handleSubmit = debounce(this.handleSubmit, this.props.debounceDuration);
    },
    ready() {
        const { submitEvent, tipsEvent } = this.properties;
        if (submitEvent) {
            Event.addEventListener(submitEvent, () => this.handleSubmit());
        }
        if (tipsEvent) {
            Event.addEventListener(tipsEvent, (data) => this.showTopTips({ message: data.target }));
        }
    },
    detached() {
        const { submitEvent } = this.properties;
        if (submitEvent) {
            Event.removeEventListener(submitEvent);
        }
    },
    methods: {
        getFormField(id) {
            const formFields = this.getFormFields();
            if (formFields && formFields.length > 0) {
                return formFields.find(node => {
                    return _.standardPath(node.id) === _.standardPath(id);
                });
            }
        },
        getFormFields() {
            return this.getRelationNodes('form-fields');
        },
        // 重置表单内的状态
        resetFormFiels() {
            (this.getFormFields() || []).forEach(node => {
                // 重置状态
                node.setData({
                    _status: '',
                    _statusMessage: ''
                });
            });
        },
        noticeFormFiels(errorConfig) {
            const formFields = this.getFormFields();
            this.showTopTips(errorConfig[0]);
            // 通知具体各个组件的状态
            if (formFields.length > 0) {
                formFields.forEach(node => {
                    // 获取到当前控件匹配到的错误规则
                    errorConfig.forEach(config => {
                        if (_.standardPath(node.id) === _.standardPath(config.name)) {
                            // 通知组件修改状态
                            if (node.warn)
                                node.warn(config);
                        }
                    });
                });
            }
        },
        // 显示顶部提示条
        showTopTips(errorConfig) {
            console.log('顶部通知框: ', errorConfig);
            if (errorConfig) {
                this.setData({
                    _tipsShow: true,
                    _tipsMessage: errorConfig.message || '表单输入有误'
                }, () => {
                    // 3秒后关闭
                    setTimeout(() => {
                        this.setData({
                            _tipsShow: false,
                            _tipsMessage: ''
                        });
                    }, 3000);
                });
            }
        },
        // 关闭提示条
        handleTipsClose(e) {
            this.setData({
                _tipsShow: e.detail.isShow
            });
        },
        handleSecondTap(event) {
            this.triggerEvent('second', {
                event
            });
        },
        handleSubmit(e) {
            const { model, rules, validateType } = this.properties;
            // 正在提交时，就不继续执行
            if (this.__loading__)
                return false;
            console.log('g-form 提交表单：', model, rules);
            this.__loading__ = true;
            validator(model, rules || {}, validateType || {})
                .then((errorArr) => {
                this.__loading__ = false;
                if (errorArr.length === 0) {
                    // 校验成功，并把数据推回给业务组件做业务处理
                    // 推送事件
                    this.triggerEvent('submit', {
                        validStatus: true,
                        value: model,
                        formId: (e && e.detail && e.detail.formId) || 'no-formID'
                    });
                }
                else {
                    // 去掉相同表单的错误信息，只保留其中一个
                    console.log(errorArr)
                    errorArr = Array.from(new Set(errorArr.map(errorField => errorField.name)))
                        .map(fieldName => {
                        let targetItem;
                        errorArr.some(item => {
                            if (item.name === fieldName) {
                                targetItem = item;
                                return true;
                            }
                        });
                        return targetItem;
                    });
                    // 校验失败，组件内部提供错误提示和状态，并把错误信息推回给业务组件处理
                    this.noticeFormFiels(errorArr);
                    // 推送事件
                    this.triggerEvent('submit', {
                        validStatus: false,
                        value: errorArr
                    });
                }
            })
                .catch(e => {
                console.log('g-form error：', e);
                this.__loading__ = false;
            });
        }
    }
});
