"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// pages/g-input/index.js
const formControllerBehavior = require("../behaviors/formController");
const validator = require("../utils/validator");
Component({
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
        slot: Boolean,
        label: String,
        value: {
            type: String,
            value: '',
            observer(newValue, oldValue) {
                this.resetStatus();
                if (newValue && newValue !== oldValue) {
                    this.validateValue.bind(this);
                }
            }
        },
        placeholder: {
            type: String,
            value: '请输入'
        },
        disabled: Boolean,
        icon: String,
        actionText: String
    },
    data: {
        _status: '',
        _value: '',
        _statusMessage: ''
    },
    methods: {
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
        // 内部校验 input
        validateValue() {
            if (!this.id) {
                throw new Error('请提供需要校验的组件 ID');
            }
            const formData = { [this.id]: this.properties.value };
            const { rules = {}, validateType = {} } = this.getFormNode().properties;
            // 根据校验规则，有错误显示状态，无错误重置状态
            validator(formData, rules, validateType).then((errorArr) => {
                console.log('form-field validate: ', formData, rules, errorArr);
                if (errorArr.length > 0) {
                    this.setData({
                        _status: 'warn',
                        _statusMessage: errorArr[0].message
                    });
                }
                else {
                    this.resetStatus();
                }
            });
        },
        // clear
        handleTapClear(e) {
            const { disabled } = this.properties;
            if (disabled)
                return false;
        },
        // tap info
        handleTapIcon() {
            const { icon } = this.properties;
            this.triggerEvent('iconTap', { type: icon });
        },
        // action tap
        handleActionTap(e) {
            this.triggerEvent('actionTap', e.detail);
        }
    }
});
