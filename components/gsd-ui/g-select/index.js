// pages/g-select/index.js
Component({
    properties: {
        dataList: Object,
        _current: Number,
        width: {
            type: String,
            value: '33.33%'
        }
    },
    externalClasses: ['my-class-btn'],
    data: {},
    methods: {
        handleTap(e) {
            const current = e.currentTarget.dataset.index;
            this.setData({ _current: current });
            this.triggerEvent('selected', e.currentTarget.dataset.index);
        }
    }
});
