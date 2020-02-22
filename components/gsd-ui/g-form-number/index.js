const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || Math.pow(2, 53) - 1;
const formControllerBehavior = require("../behaviors/formController");

Component({
    behaviors: [formControllerBehavior],
    options: {
        multipleSlots: true // 在组件定义时的选项中启用多slot支持
    },
    properties: {
        label: {
            type: String,
            value: ''
        },
        desc: {
            type: String,
            value: ''
        },
        min: {
            type: Number,
            value: -MAX_SAFE_INTEGER
        },
        max: {
            type: Number,
            value: MAX_SAFE_INTEGER
        },
        value: {
            type: Number,
            value: 0,
            observer(newValue) {
                const { fixed } = this.properties;
                this.setData({ _value: newValue.toFixed(fixed) });
            }
        },
        step: {
            type: Number,
            value: 1
        },
        fixed: {
            type: Number,
            value: 0
        },
        disabled: {
            type: Boolean,
            value: false
        }
    },
    data: {
        _value: 0
    },
    methods: {
        commanValue(type) {
            const { step, min, max } = this.properties;
            const { _value } = this.data;
            // 通过不同 step 获取 value
            const newValue = type === 'sub'
                ? +_value - step
                : +_value + step;
            if (type === 'sub' && newValue >= min
                ||
                    type === 'plus' && newValue <= max) {
                this.triggerEvent('change', { value: newValue });
            }
        },
        subValue() {
            this.commanValue('sub');
        },
        plusValue() {
            this.commanValue('plus');
        }
    }
});
