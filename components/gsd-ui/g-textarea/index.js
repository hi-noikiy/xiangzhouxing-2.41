"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// pages/g-textarea/index.js
const formControllerBehavior = require("../behaviors/formController");
const Event = require('../../gsd-lib/event/index');
const validator = require("../utils/validator");
Component({
    externalClasses: ['action-class'],
    options: {
        multipleSlots: true
    },
    __value__: '',
    // 缓存数据
    behaviors: [formControllerBehavior],
    relations: {
        '../g-form-item/index': {
            type: 'child'
        },
        '../g-form/index': {
            type: 'ancestor'
        }
    },
    properties: {
        value: {
            type: String,
            observer(newVal) {
                // 只有外部特殊设置的 value 才会触发 rerender
                if (newVal !== this.__value__) {
                    this.__value__ = newVal;
                    this.setData({
                        _value: newVal
                    });
                }
            }
        },
        placeholder: {
            type: String,
            value: '请输入内容'
        },
        label: String,
        disabled: Boolean,
        maxlength: {
            type: Number,
            value: 140
        },
        autoFocus: {
            type: Boolean,
            value: false
        },
        focus: {
            type: Boolean,
            value: false,
            observer(newVal) {
                this.setData({
                    _focus: newVal
                });
            }
        },
        height: {
            type: Number,
            value: 144
        },
        autoHeight: {
            type: Boolean,
            value: false
        },
        cursorSpacing: {
            type: Number,
            value: 72
        },
        cursor: {
            type: Number,
            value: 0
        },
        showConfirmBar: {
            type: Boolean,
            value: false
        },
        selectionStart: {
            type: Number,
            value: -1
        },
        selectionEnd: {
            type: Number,
            value: -1
        },
        adjustPosition: {
            type: Boolean,
            value: true
        },
        showCount: Boolean
    },
    data: {
        _hideElement: false,
        _value: '',
        _status: '',
        _statusMessage: '',
        _focus: false,
        _platform: wx.getSystemInfoSync().platform.toLowerCase()
    },
    ready() {
        this.initListener();
    },
    detached() {
        this.removeListener();
    },
    methods: {
        initListener() {
            Event.addEventListener('g-textarea__hidden', () => {
                this.setData({
                    _hideElement: true
                });
            }, this);
            Event.addEventListener('g-textarea__show', () => {
                this.setData({
                    _hideElement: false
                });
            }, this);
        },
        removeListener() {
            Event.removeSingleEventListener('g-textarea__hidden', () => {
                this.setData({
                    _hideElement: true
                });
            }, this);
            Event.removeSingleEventListener('g-textarea__show', () => {
                this.setData({
                    _hideElement: false
                });
            }, this);
        },
        getFormNode() {
            const form = this.getRelationNodes('../g-form/index');
            return form && form[0];
        },
        // 重置状态
        resetStatus() {
            this.setData({
                _status: '',
                _statusMessage: ''
            });
        },
        // 处理点击
        handleTap() {
            this.setData({
                _focus: true
            });
        },
        // 内部校验 input
        validateInput() {
            if (!this.id) {
                throw new Error('请提供需要校验的组件 ID');
            }
            const formData = { [this.id]: this.__value__ };
            const form = this.getFormNode();
            const rules = form && form.properties && form.properties.rules;
            // 根据校验规则，有错误显示状态，无错误重置状态
            if (rules) {
                validator(formData, rules).then((errorArr) => {
                    console.log('form-field validate: ', formData, rules, errorArr);
                    if (errorArr.length > 0) {
                        this.warn(errorArr[0]);
                    }
                    else {
                        this.resetStatus();
                    }
                });
            }
        },
        handleInput(e) {
            if (this.data._status)
                this.resetStatus();
            // 数据存到内存中
            this.__value__ = e.detail.value;
            this.setData({
                _value: e.detail.value
            });
            this.triggerEvent('input', e.detail);
            this.triggerEvent('change', e.detail);
        },
        handleFocus(e) {
            console.log('textarea focus', e);
            this.triggerEvent('focus', e.detail);
        },
        handleBlur(e) {
            console.log('textarea blur', e);
            this.validateInput();
            this.triggerEvent('blur', e.detail);
        },
        handleConfirm(e) {
            this.triggerEvent('confirm', e.detail);
        }
    }
});
