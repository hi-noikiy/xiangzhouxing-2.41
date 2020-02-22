"use strict";
// pages/g-index-list/index.js
const DEFAULT_DATA = {
    _list: [],
    _keys: [],
    _isTouch: false,
    _currentKey: '',
    _scrollTop: 0,
    _scrollViewHeight: 0
};
Component({
    __firstIndexTop__: 0,
    __indexHeight__: 0,
    __itemListTop__: [],
    __headerHeight__: 0,
    options: {
        multipleSlots: true
    },
    externalClasses: ['component-class'],
    properties: {
        list: {
            type: Array,
            observer() {
                this.initLayout();
                this.initList();
            },
            __type__: (v) => v
        }
    },
    data: DEFAULT_DATA,
    ready() {
        this.initLayout();
    },
    methods: {
        // 初始化尺寸大小
        initLayout() {
            const query = this.createSelectorQuery();
            query.selectViewport().boundingClientRect();
            query.select('.list__header').boundingClientRect();
            query.select('.index__list__key').boundingClientRect();
            query.selectAll('.list__item').boundingClientRect();
            query.exec((result) => {
                console.log(result);
                const viewport = result[0];
                const listHeader = result[1];
                const indexList = result[2];
                const itemList = result[3];
                if (!indexList || !viewport || !itemList)
                    return;
                const _scrollViewHeight = viewport.height - listHeader.height;
                this.__firstIndexTop__ = indexList.top;
                this.__indexHeight__ = indexList.height;
                this.__headerHeight__ = listHeader.height;
                this.__itemListTop__ = itemList.map((item) => item.top);
                this.setData({ _scrollViewHeight });
            });
        },
        // 初始化 list
        initList() {
            const { list } = this.properties;
            const _keys = Array.from(new Set(list.map((item) => item.key)));
            // 转化 list 结构
            const _list = _keys.map((key) => {
                const data = {
                    key,
                    list: []
                };
                list.forEach((item) => {
                    if (item.key === key) {
                        data.list.push(item);
                    }
                });
                return data;
            });
            this.setData({ _keys, _list });
        },
        handleTouch(e) {
            const { __firstIndexTop__, __indexHeight__, __itemListTop__ } = this;
            const { _currentKey, _keys, _isTouch } = this.data;
            if (e.touches.length > 0 && __firstIndexTop__ > 0 && __indexHeight__ > 0) {
                const touches = e.touches[0];
                const clientY = touches.clientY;
                // 根据触摸位置计算出当前是第几个 key
                const index = Math.ceil((clientY - __firstIndexTop__) / __indexHeight__) - 1;
                const currentKey = _keys[index];
                if (currentKey) {
                    this.setData({ _scrollTop: __itemListTop__[index] - this.__headerHeight__ });
                    if (_currentKey !== currentKey) {
                        wx.vibrateShort();
                        this.setData({ _currentKey: currentKey });
                    }
                }
                if (!_isTouch) {
                    this.setData({ _isTouch: true });
                }
            }
        },
        handleTouchEnd(e) {
            this.setData({
                _isTouch: false
            });
        },
        handleChoose(e) {
            this.triggerEvent('choose', e.currentTarget.dataset.item);
        }
    }
});
module.exports = {};
