// pages/g-picker-view/index.js
Component({
    properties: {
        dataList: Object,
        value: Number
    },
    data: {},
    methods: {
        bindChange(e) {
            this.triggerEvent('change', e.detail);
        }
    }
});
