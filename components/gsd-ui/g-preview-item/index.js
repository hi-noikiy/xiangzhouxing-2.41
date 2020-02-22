"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// pages/g-preview-item/index.js
const iconBehavior = require("../behaviors/icon");
Component({
    behaviors: [iconBehavior],
    relations: {
        '../g-preview/index': {
            type: 'parent'
        }
    },
    properties: {
        label: String,
        textAlign: String,
        type: {
            type: String,
            value: 'normal'
        }
    },
    data: {
        _textAlign: 'left',
        _labelWidth: 220
    },
    methods: {
        setPreviewItem(data) {
            this.setData(data);
        }
    }
});
