"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moment = require('../../gsd-lib/dayjs/index');
const defaultFormat = 'YYYY年MM月DD日';
Component({
    externalClasses: [],
    /**
     * 组件的属性列表
     */
    properties: {
        start: String,
        end: String,
        fields: {
            type: String,
            value: 'day'
        },
        value: {
            type: Array,
            value: ['', ''],
            observer(newVal, oldVal) {
                this.setDateData();
            }
        },
        startPlaceholder: {
            type: String,
            value: '开始日期'
        },
        endPlaceholder: {
            type: String,
            value: '结束日期'
        },
        format: {
            type: String,
            value: defaultFormat
        }
    },
    /**
     * 组件的初始数据
     */
    data: {
        startValue: '',
        endValue: '',
        startDateStr: '',
        endDateStr: ''
    },
    ready() {
        this.setDateData();
    },
    /**
     * 组件的方法列表
     */
    methods: {
        // 设置日期
        setDateData() {
            const { value, format } = this.properties;
            // start
            const [start, end] = value;
            // 判断默认值
            const startValue = start ? start : moment().format('YYYY-MM-DD');
            const endValue = end ? end : moment().format('YYYY-MM-DD');
            const startDateStr = start ? moment(new Date(start)).format(format) : '';
            const endDateStr = end ? moment(new Date(end)).format(format) : '';
            this.setData({
                startValue,
                endValue,
                startDateStr,
                endDateStr
            });
        },
        // 开始日期
        handleStartChange(e) {
            const { value, format = defaultFormat } = this.properties;
            const startValue = e.detail.value;
            const startDateStr = moment(new Date(startValue)).format(format);
            const endDateStr = value[1] ? moment(new Date(value[1])).format(format) : '';
            // 实时生效，用于 start end 默认
            value[0] = startValue;
            this.triggerEvent('change', {
                value: [startValue, value[1]],
                format: [startDateStr, endDateStr]
            });
        },
        // 结束日期
        handleEndChange(e) {
            const { value, format = defaultFormat } = this.properties;
            const endValue = e.detail.value;
            const startDateStr = value[0] ? moment(new Date(value[0])).format(format) : '';
            const endDateStr = moment(new Date(endValue)).format(format);
            value[1] = endValue;
            this.triggerEvent('change', {
                value: [value[0], endValue],
                format: [startDateStr, endDateStr]
            });
        }
    }
});
