// pages/g-switch/index.js
Component({
    properties: {
        value: Boolean,
        label: String,
        desc: String,
        disabled: Boolean
    },
    data: {},
    methods: {
        handleChange() {
            if (!this.properties.disabled) {
                wx.vibrateShort();
                this.triggerEvent('change', {
                    value: !this.properties.value
                });
            }
        }
    }
});
