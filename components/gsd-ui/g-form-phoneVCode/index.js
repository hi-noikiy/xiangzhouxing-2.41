"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// pages/g-form-phoneVCode/index.js
const formControllerBehavior = require("../behaviors/formController");
const validator = require("../utils/validator");
const utils = require("../../gsd-lib/utils/index");
Component({
    timer: undefined,
    relations: {
        '../g-form-item/index': {
            type: 'child'
        },
        '../g-form/index': {
            type: 'ancestor'
        }
    },
    behaviors: [formControllerBehavior],
    properties: {
        value: String,
        delaySecond: {
            type: Number,
            value: 60,
        },
        mobile: String,
        mobileID: String,
        maxLength: {
            type: Number,
            value: 6
        },
        placeholder: {
            type: String,
            value: '请输入手机短信验证码'
        },
        buttonText: {
            type: String,
            value: '发送验证码'
        },
        type: String
    },
    data: {
        __id: '',
        __second: undefined,
        __reSend: false
    },
    ready() {
        this.setData({
            __id: this.id
        });
    },
    methods: {
        bindVerifyAction: utils.debounce(function () {
            const { mobile, mobileID, delaySecond, disabled } = this.properties;
            const { __reSend } = this.data;
            // 如果处在重发等待，则直接返回
            if (__reSend || disabled)
                return;
            const formNode = this.getFormNode();
            const { rules = {}, validateType = {} } = formNode.properties;
            const formData = {
                [mobileID]: mobile
            };
            validator(formData, rules, validateType).then((errorArr) => {
                console.log('form-field validate: ', formData, rules, errorArr);
                if (errorArr.length > 0) {
                    const mobileNode = formNode.getFormField(mobileID);
                    mobileNode.warn(errorArr[0]);
                }
                else {
                    this.triggerEvent('tapVCode', {
                        value: mobile,
                        mobile
                    });
                    // 开始触发重试逻辑
                    if (this.timer)
                        clearInterval(this.timer);
                    this.setData({
                        __reSend: true,
                        __second: delaySecond
                    });
                    this.timer = setInterval(() => {
                        const second = this.data.__second;
                        if (second <= 1) {
                            console.log('验证码计时结束');
                            clearInterval(this.timer);
                            this.setData({
                                __reSend: false,
                                __second: delaySecond
                            });
                        }
                        else {
                            this.setData({
                                __reSend: true,
                                __second: typeof second === 'undefined' ? delaySecond : second - 1
                            });
                        }
                    }, 1000);
                }
            });
        }, 100),
        handleChange(e) {
            this.triggerEvent('change', e.detail);
        }
    }
});
