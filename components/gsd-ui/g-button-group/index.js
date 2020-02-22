"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// pages/g-button-group/index.js
const primarySecondButtonBehaviors = require("../behaviors/primarySecondButton");
Component({
    options: {
        multipleSlots: true
    },
    behaviors: [primarySecondButtonBehaviors],
    properties: {
        disabled: Boolean,
        secondDisabled: Boolean,
        fixed: Boolean,
        agree: Boolean,
        autoAgree: Boolean,
        buttonList: Array,
        direction: {
            type: String,
            value: 'horizontal'
        }
    },
    data: {
        _agreeChecked: false
    },
    ready() {
        if (this.properties.autoAgree) {
            this.setData({ _agreeChecked: this.properties.autoAgree });
        }
    },
    methods: {
        handleAgreeChange(e) {
            this.setData({
                _agreeChecked: e.detail.value
            });
        },
        handelButtonListTap(e) {
            if (e.currentTarget.dataset.item) {
                this.triggerEvent('buttonListTap', {
                    item: e.currentTarget.dataset.item
                });
            }
        }
    }
});
