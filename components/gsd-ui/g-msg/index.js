"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// pages/g-msg/index.js
const primarySecondButtonBehaviors = require("../behaviors/primarySecondButton");
Component({
    behaviors: [primarySecondButtonBehaviors],
    properties: {
        title: String,
        status: String,
        desc: String,
        primaryText: String,
        secondText: String,
        footerFixed: Boolean
    },
    data: {}
});
