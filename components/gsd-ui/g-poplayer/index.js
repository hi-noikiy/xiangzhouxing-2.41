"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// pages/g-poplayer/index.js
const Event = require("../../gsd-lib/event/index");
Component({
    externalClasses: ['my-class'],
    properties: {
        visible: {
            type: Boolean,
            observer(newVal, oldVal) {
                if (newVal !== oldVal) {
                    // 特殊处理原生 textarea
                    if (newVal) {
                        Event.dispatch('g-textarea__hidden');
                    }
                    else {
                        setTimeout(() => {
                            Event.dispatch('g-textarea__show');
                        }, 50);
                    }
                    this.setData({
                        _visible: newVal
                    });
                }
            }
        },
        direction: {
            type: String,
            value: 'bottom'
        },
        maxWidth: {
            type: String,
            value: '50%'
        }
    },
    data: {
        _visible: false,
        __levelDirection: false
    },
    ready() {
        const { direction } = this.properties;
        if (direction === 'left' || direction === 'right') {
            this.setData({
                __levelDirection: true
            });
        }
    },
    methods: {
        handleCloseSelf(e) {
            this.triggerEvent('close', { visible: false });
        }
    }
});
