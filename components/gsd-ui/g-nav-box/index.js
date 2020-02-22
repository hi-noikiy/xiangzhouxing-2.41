"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// pages/g-nav-box/index.js
const navigatorBehavior = require("../behaviors/navigator");
Component({
    behaviors: [navigatorBehavior],
    externalClasses: ['component-class'],
    properties: {
        navId: String,
        title: String,
        icon: String,
        disabled: Boolean,
        // to: String,
        // toType: String,
        toText: String,
        footerText: String,
    },
    data: {},
    methods: {
        handleTapTitle(e) {
            if (!this.properties.disabled) {
                this.navigator();
                this.triggerEvent('tapTitle', e.currentTarget);
            }
        }
    }
});
