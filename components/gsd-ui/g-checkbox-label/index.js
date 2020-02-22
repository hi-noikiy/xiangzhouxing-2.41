Component({
    options: {},
    properties: {
        value: {
            type: [Array, String],
            value: [],
            observer(newValue) {
                this.init(this.properties.items || [], newValue);
            }
        },
        items: {
            type: Object,
            value: {},
            observer(newValue) {
                this.init(newValue, this.properties.value);
            }
        },
        radioType: {
            type: Boolean,
            value: false
        }
    },
    data: {
        __items: {}
    },
    methods: {
        bindtap(e) {
            const { value, radioType } = this.properties;
            const { changeValue, disabled } = e.currentTarget.dataset;
            if (disabled || !changeValue) {
                return false;
            }
            if (!radioType) {
                const _value = Array.isArray(value) ? value.slice(0) : [value];
                const index = _value.indexOf(changeValue);
                if (index > -1) {
                    _value.splice(index, 1);
                }
                else {
                    _value.push(changeValue);
                }
                this.triggerEvent('change', {
                    value: _value
                });
            }
            else {
                this.triggerEvent('change', {
                    value: value === changeValue ? '' : changeValue
                });
            }
        },
        init(items, value) {
            const { radioType } = this.properties;
            const __items = items.map(item => {
                if (!radioType) {
                    return Object.assign({}, item, { checked: value.indexOf(item.value) > -1 ? true : false });
                }
                else {
                    return Object.assign({}, item, { checked: item.value === value ? true : false });
                }
            });
            this.setData({
                __items
            });
        }
    }
});
