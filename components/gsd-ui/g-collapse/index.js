;
Component({
    relations: {
        '../g-collapse-pane/index': {
            type: 'child'
        }
    },
    properties: {
        accordion: Boolean,
        defaultActiveKeys: {
            type: Array,
            value: [],
            __type__: (keys) => keys
        },
        activeKeys: {
            type: Array,
            value: [],
            __type__: (keys) => keys,
            observer() {
                this.setByActiveKeys();
            }
        }
    },
    ready() {
        this.setByActiveKeys();
    },
    methods: {
        _getAllCollapsePane() {
            const nodes = this.getRelationNodes('../g-collapse-pane/index');
            return nodes;
        },
        // 用于处理 accordion 的情况
        _setPaneCollapse(key) {
            const { accordion } = this.properties;
            const paneNodes = this._getAllCollapsePane();
            paneNodes.forEach(item => {
                if (accordion) {
                    item._setCollapse(item.properties.key !== key);
                }
                else {
                    if (item.properties.key === key) {
                        item._setCollapse();
                    }
                }
            });
            if (wx.nextTick) {
                wx.nextTick(() => this.triggerChange());
            }
            else {
                setTimeout(() => this.triggerChange(), 0);
            }
        },
        // 设置默认打开
        setByActiveKeys() {
            const { defaultActiveKeys, accordion } = this.properties;
            let { activeKeys } = this.properties;
            const paneNodes = this._getAllCollapsePane();
            if (!activeKeys || activeKeys.length === 0) {
                activeKeys = defaultActiveKeys;
            }
            // 手风琴只会默认展示第一个
            if (accordion) {
                activeKeys = activeKeys.length > 0
                    ? [defaultActiveKeys[0]]
                    : [paneNodes[0].properties.key];
            }
            paneNodes.forEach(item => {
                // 命中目标面板
                item._setCollapse(!activeKeys.includes(item.properties.key));
            });
        },
        // 触发回调
        triggerChange() {
            const paneNodes = this._getAllCollapsePane();
            this.triggerEvent('change', {
                value: paneNodes
                    .filter(item => !item.data._isCollapse)
                    .map(item => item.properties.key)
            });
        }
    }
});
