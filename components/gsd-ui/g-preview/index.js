// pages/g-preview/index.js
Component({
    relations: {
        '../g-preview-item/index': {
            type: 'child'
        }
    },
    properties: {
        type: {
            type: String,
            value: 'normal'
        },
        textAlign: {
            type: String,
            value: 'left',
        },
        labelWidth: Number
    },
    data: {},
    ready() {
        this.setAllItemsTextAlign();
    },
    methods: {
        getPreviewItems() {
            return this.getRelationNodes('../g-preview-item/index');
        },
        setAllItemsTextAlign() {
            this.getPreviewItems().forEach(item => {
                item.setPreviewItem({
                    _textAlign: this.properties.textAlign,
                    _labelWidth: this.properties.labelWidth,
                });
            });
        }
    }
});
