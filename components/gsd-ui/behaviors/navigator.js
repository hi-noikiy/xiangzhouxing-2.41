"use strict";
/**
 * 处理所有包含 to 的组件
 */
module.exports = Behavior({
    properties: {
        to: {
            type: String,
            value: ''
        },
        toType: {
            type: String,
            value: 'to'
        }
    },
    data: {},
    methods: {
        // 统一提供跳转方法
        navigator() {
            const { to, toType } = this.properties;
            if (!to)
                return false;
            if (toType === 'to')
                wx.navigateTo({ url: to });
            if (toType === 'redirect')
                wx.redirectTo({ url: to });
            if (toType === 'switch')
                wx.switchTab({ url: to });
            if (toType === 'reLaunch')
                wx.reLaunch({ url: to });
        }
    }
});
