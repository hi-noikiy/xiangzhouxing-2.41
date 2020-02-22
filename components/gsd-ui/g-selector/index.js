// pages/g-selector/index.js
const pickerMode = 'selector';
Component({
    properties: {
        dataList: {
            type: Array,
            value: []
        },
        visible: {
            type: Boolean,
            value: true
        },
        cancelText: {
            type: String,
            value: '取消'
        },
        cancelStyle: {
            type: String,
            value: ''
        },
        confirmText: {
            type: String,
            value: '确定'
        },
        confirmStyle: {
            type: String,
            value: ''
        },
        selectorHeaderStyle: {
            type: String,
            value: ''
        },
        indicatorStyle: {
            type: String,
            value: ''
        },
        maskStyle: {
            type: String,
            value: ''
        },
        itemStyle: {
            type: String,
            value: ''
        },
        defaultValue: {
            type: Array,
            value: []
        }
    },
    data: {
        selectedVal: []
    },
    methods: {
        bindChange(e) {
            const val = e.detail.value;
            const selectedVal = val.map((item, index) => {
                return this.data.dataList[index][item];
            });
            this.setData({
                selectedVal
            });
        },
        handleClose() {
            this.setData({
                visible: false
            });
        },
        confirm() {
            const { selectedVal } = this.data;
            this.triggerEvent('select', { value: selectedVal.length > 0 ? selectedVal : this.defaultSelectedVal() });
            this.handleClose();
        },
        defaultSelectedVal() {
            const { defaultValue } = this.properties;
            const { dataList } = this.data;
            return dataList.map((item, index) => {
                return item[defaultValue[index] || 0];
            });
        }
    },
});
