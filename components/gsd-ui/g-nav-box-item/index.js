"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// pages/g-nav-box-item/index.js
const navigatorBehavior = require("../behaviors/navigator");
Component({
    behaviors: [navigatorBehavior],
    externalClasses: ['component-class'],
    properties: {
        // to: String,
        // toType: String,
        disabled: {
            type: Boolean,
            value: false
        },
    },
    data: {},
    methods: {
        handleTapItem() {
            if (!this.properties.disabled) {
                this.navigator();
            }
        },
    }
});
