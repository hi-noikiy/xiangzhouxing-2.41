;
Component({
    relations: {
        '../g-collapse/index': {
            type: 'parent'
        }
    },
    properties: {
        title: String,
        disabled: Boolean,
        key: String
    },
    data: {
        _isCollapse: true
    },
    methods: {
        _getCollapseNode() {
            const nodes = this.getRelationNodes('../g-collapse/index');
            return nodes[0];
        },
        _setCollapse(isCollapse) {
            const { key } = this.properties;
            const { _isCollapse } = this.data;
            const collapseNode = this._getCollapseNode();
            isCollapse = typeof isCollapse === 'undefined' ? !_isCollapse : isCollapse;
            this.setData({
                _isCollapse: isCollapse
            });
        },
        handleToggleCollapse() {
            const { disabled, key } = this.properties;
            const collapseNode = this._getCollapseNode();
            if (!disabled) {
                collapseNode._setPaneCollapse(key);
            }
        }
    }
});
