// pages/g-agree/index.js
Component({
    properties: {
        value: Boolean
    },
    data: {},
    methods: {
        handleChange(e) {
            this.triggerEvent('change', { value: e.detail.value.length > 0 });
        }
    }
});
