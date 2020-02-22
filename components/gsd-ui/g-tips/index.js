"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// pages/g-tips/index.js
const navigatorBehavior = require("../behaviors/navigator");
Component({
    _timer: undefined,
    behaviors: [navigatorBehavior],
    properties: {
        status: {
            type: String,
            value: 'default'
        },
        isShow: {
            type: Boolean,
            value: true,
            observer(_isShow) {
                this.setData({ _isShow });
            }
        },
        closeable: Boolean,
        access: Boolean,
        position: String,
        loop: Boolean,
        duration: Number,
        tipsStyle: String,
        loopDuration: Number,
    },
    data: {
        _isShow: true
    },
    ready() {
        this.initTimer();
    },
    methods: {
        initTimer() {
            const { duration } = this.properties;
            if (duration > 0) {
                clearTimeout(this._timer);
                this._timer = setTimeout(() => {
                    this.handleClose();
                }, duration * 1000);
            }
        },
        handleClose() {
            this.setData({ _isShow: false });
            this.triggerEvent('close', { isShow: false });
        },
        handleTap() {
            this.navigator();
        }
    }
});
