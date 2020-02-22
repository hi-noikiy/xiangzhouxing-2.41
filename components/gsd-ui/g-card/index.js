const type = 'radio';
Component({
    options: {},
    properties: {
        iconType: {
            type: String,
            value: type
        },
        checked: {
            type: Boolean,
            value: false
        },
        disabled: {
            type: Boolean,
            value: false
        }
    },
    data: {
        __radioType: false
    },
    ready() {
        const { iconType } = this.properties;
        if (iconType === 'radio') {
            this.setData({
                __radioType: true
            });
        }
    },
    methods: {
        bindtap() {
            const { iconType, disabled } = this.properties;
            if (iconType !== 'none' && !disabled) {
                const { checked } = this.properties;
                this.triggerEvent('change', {
                    value: !checked
                });
            }
        }
    }
});
