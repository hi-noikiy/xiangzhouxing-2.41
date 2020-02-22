"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// pages/g-cell/index.js
const navigatorBehavior = require("../behaviors/navigator");
const iconBehavior = require("../behaviors/icon");
Component({
    behaviors: [navigatorBehavior, iconBehavior],
    externalClasses: ['component-class', 'prepend-class'],
    options: {
        multipleSlots: true
    },
    properties: {
        label: String,
        desc: String,
        access: Boolean,
        disabled: {
            type: Boolean,
            value: false
        }
    },
    data: {},
    methods: {
        handleTap(e) {
            if (!this.properties.disabled) {
                this.navigator();
                this.triggerEvent('tap', e.detail);
            }
        }
    }
});
