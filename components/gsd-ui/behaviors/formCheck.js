"use strict";
module.exports = Behavior({
    properties: {
        icon: String,
        disabled: Boolean,
        items: {
            type: Array,
            value: [],
            observer(items) {
                const { value } = this.properties;
                // items 修改时，重置 items 属性
                items = items.map(item => {
                    // 处理 checked 属性
                    item.checked = false;
                    // checkbox 数组类
                    if (Array.isArray(value) && -1 !== value.indexOf(String(item.value))) {
                        item.checked = true;
                    }
                    else if (String(value) === String(item.value)) {
                        // radio 字符串类
                        item.checked = true;
                    }
                    // 处理 desc 属性
                    if (typeof item.desc === 'string') {
                        item.desc = item.desc.split('\n');
                    }
                    return item;
                });
                this.setData({ _items: items });
            }
        },
        value: {
            type: [Array, String],
            observer(value) {
                // value 修改时，统一内部改成 formItem 需要的格式
                const items = this.data._items.map(item => {
                    item.checked = false;
                    if (Array.isArray(value)) {
                        if (-1 !== value.indexOf(item.value.toString())) {
                            item.checked = true;
                        }
                    }
                    else if (String(value) === String(item.value)) {
                        item.checked = true;
                    }
                    return item;
                });
                this.setData({ _items: items });
            }
        }
    },
    /**
     * 组件的初始数据
     */
    data: {
        _items: []
    },
    /**
     * 组件的方法列表
     */
    methods: {
        // change 事件
        handleChange(e) {
            this.triggerEvent('change', e.detail);
        },
        // 点击 icon
        handleIconTap(e) {
            const { dataset } = e.currentTarget;
            this.triggerEvent('iconTap', dataset.item);
        }
    }
});
