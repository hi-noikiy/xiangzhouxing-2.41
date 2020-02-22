"use strict";
module.exports = Behavior({
    properties: {
        primaryText: {
            type: String,
            value: '下一步'
        },
        secondText: String
    },
    methods: {
        handlePrimaryTap(e) {
            this.triggerEvent('primaryTap', e.detail);
        },
        handleSecondTap(e) {
            this.triggerEvent('secondTap', e.detail);
        }
    }
});
