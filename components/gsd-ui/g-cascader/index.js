"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Event = require("../../gsd-lib/event/index");
const utils = require("../../gsd-lib/utils/index");
const { debounce } = utils;
Component({
    properties: {
        value: {
            type: Array,
            observer(newValue) {
                if (newValue) {
                    this.setData({ _value: newValue });
                }
            },
            __type__: (value) => value
        },
        visible: {
            type: Boolean,
            observer(newValue) {
                // 主动触发关闭，则 trigger change
                if (newValue === false) {
                    this.handleChange();
                }
            }
        },
        range: {
            type: Array,
            observer(newRange) {
                this.updateTab();
                if (newRange) {
                    setTimeout(() => {
                        this.setData({
                            _tabActiveIndex: (newRange.length - 1).toString()
                        });
                    }, 0);
                }
            }
        }
    },
    data: {
        _tabActiveIndex: '0',
        _value: []
    },
    methods: {
        // 更新 Tab
        updateTab: debounce(() => {
            setTimeout(() => {
                Event.dispatch('g-tabs__init');
            }, 0);
        }, 0),
        // 关闭 Poplayer
        handleClose(e) {
            this.triggerEvent('close', e.detail);
        },
        // Tab 切换
        handleTabChange(e) {
            this.setData({
                _tabActiveIndex: e.detail.value.key
            });
        },
        handleChange() {
            this.triggerEvent('change', {
                value: this.data._value.map(item => item.value || item)
            });
        },
        // 选择选项
        handleChoose: debounce(function(e) {
            const { columnIndex, item } = e.currentTarget.dataset;
            const { range } = this.properties;
            const { _value } = this.data;
            if (columnIndex < range.length - 1) {
                this.setData({
                    _tabActiveIndex: (columnIndex + 1).toString()
                });
            }
            const newValue = _value.slice(0, columnIndex);
            newValue[columnIndex] = item;
            this.setData({
                _value: newValue
            }, () => {
                this.updateTab();
                // 值改变后再触发列变化
                this.triggerEvent('columnChange', {
                    item,
                    index: columnIndex
                });
            });
        }, 500)
    }
});
