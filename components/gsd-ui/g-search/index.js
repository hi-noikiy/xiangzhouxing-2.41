"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// pages/g-search/index.js
const Event = require("../../gsd-lib/event/index");
Component({
    properties: {
        value: String,
        autofocus: Boolean,
        placeholder: {
            type: String,
            value: '搜索'
        },
        fill: Boolean,
        withText: Boolean,
        needChoose: Boolean,
        disabled: {
            type: Boolean,
            value: false
        }
    },
    data: {
        _isSearch: false,
        _focus: false,
        _value: ''
    },
    ready() {
        this.init();
        this.initListener();
    },
    detached() {
        this.removeListener();
    },
    methods: {
        initListener() {
            Event.addEventListener('g-search__blur', () => {
                this.setData({
                    _isSearch: false,
                    _focus: false
                });
            }, this);
            Event.addEventListener('g-search__focus', () => {
                this.setData({
                    _isSearch: true,
                    _focus: true
                });
            }, this);
        },
        removeListener() {
            Event.removeSingleEventListener('g-search__blur', () => {
                this.setData({
                    _isSearch: false,
                    _focus: false
                });
            }, this);
            Event.removeSingleEventListener('g-search__focus', () => {
                this.setData({
                    _isSearch: true,
                    _focus: true
                });
            }, this);
        },
        init() {
            const { autofocus } = this.properties;
            if (autofocus) {
                this.setData({
                    _isSearch: autofocus,
                    _focus: autofocus
                });
            }
        },
        handleInput(e) {
            this.setData({
                _value: e.detail.value,
                value: e.detail.value
            });
            this.triggerEvent('change', e.detail);
        },
        handleConfirm(e) {
            this.setData({ _focus: false });
            this.triggerEvent('confirm', e.detail);
        },
        handleInputFocus(e) {
            this.setData({
                _isSearch: true,
                _focus: true
            });
            this.triggerEvent('focus', e.detail);
        },
        handleBlur(e) {
            this.setData({
                _focus: false,
            });
            this.triggerEvent('blur', e.detail);
        },
        handleClear(e) {
            this.setData({
                _focus: true,
                _value: '',
                value: ''
            });
            this.triggerEvent('change', { value: '' });
        },
        handleCancel(e) {
            this.setData({
                _isSearch: false,
                _value: '',
                value: ''
            });
            this.triggerEvent('cancel', e.detail);
        }
    }
});
