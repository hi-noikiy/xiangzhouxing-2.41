// pages/g-icon/index.js
let iconType;
Component({
    properties: {
        type: {
            type: String,
            value: iconType
        },
        spin: {
            type: Boolean,
            value: false
        },
        color: {
            type: String,
            value: '',
            observer(value) {
                let color = value;
                if (value === 'primary') {
                    color = '#C02C38';
                }
                this.setData({ _color: color });
            }
        },
        size: {
            type: Number,
            value: 36
        }
    },
    data: {
        _color: ''
    },
    methods: {}
});
