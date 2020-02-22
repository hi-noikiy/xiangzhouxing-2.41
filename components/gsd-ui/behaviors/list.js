"use strict";
module.exports = Behavior({
    data: {
        labelWidth: 105
    },
    methods: {
        // 提供修改 label 的方法
        setLabelWidth(width) {
            if (!Number.isNaN(width)) {
                this.setData({
                    labelWidth: width
                });
            }
        },
    }
});
