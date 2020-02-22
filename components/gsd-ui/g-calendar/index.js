"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dayjs = require('../../gsd-lib/dayjs/index');
const DEFAULT_DURATION = 500;
const WEEK_NAME = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
Component({
    properties: {
        value: {
            type: String,
            value: '',
            observer(newVal) {
                this.setData({ _value: newVal }, () => {
                    this.backToActive();
                });
            }
        },
        start: {
            type: String,
            value: dayjs().format('YYYY-MM-DD'),
            observer() {
                this.initDate();
            }
        },
        end: {
            type: String,
            value: dayjs().add(1, 'year').format('YYYY-MM-DD'),
            observer() {
                this.initDate();
            }
        },
        mode: {
            type: String,
            value: 'multiple',
            observer(_mode) {
                this.setData({ _mode }, () => {
                    this.initDate();
                });
            }
        },
        options: {
            type: Array,
            value: [],
            observer() {
                this.initDate();
            },
            __type__: (options) => options
        },
        includes: {
            type: Array,
            value: [],
            __type__: (options) => options
        },
        excludes: {
            type: Array,
            value: [],
            __type__: (options) => options
        }
    },
    data: {
        _mode: 'multiple',
        _value: '',
        _duration: DEFAULT_DURATION,
        _current: 0,
        _weekName: WEEK_NAME,
        _month: [],
        _week: []
    },
    methods: {
        // 初始化日期
        initDate() {
            const { start, end } = this.properties;
            const { _mode } = this.data;
            if (!start || !end) {
                console.warn('日历组件此次 initDate 没有 start / end 属性');
                return false;
            }
            if (_mode === 'multiple') {
                this.initMonth();
            }
            else {
                this.initWeek();
            }
            // 若有高亮点，则直接去到高亮的 current
            this.backToActive();
        },
        // 若有高亮点，则直接去到高亮的 current
        backToActive() {
            const { _value, _week, _month, _mode } = this.data;
            let index = 0;
            if (_mode === 'single') {
                index = _week.findIndex((weekDate) => {
                    return weekDate.some(item => !item.disabled && item.date === _value);
                });
            }
            else {
                index = _month.findIndex((monthData) => {
                    return monthData.date.some(item => !item.disabled && item.date === _value);
                });
            }
            this.setData({
                _current: index >= 0 ? index : 0
            });
        },
        // 初始化周模式
        initWeek() {
            const { start, end } = this.properties;
            const weekLen = dayjs(end).diff(dayjs(start), 'week') + 1;
            const _week = Array.from({ length: weekLen })
                .map((_, index) => {
                const week = dayjs(start).add(index, 'week').startOf('week');
                const weekDate = this.getDateByWeek(week);
                const weekDateOptions = this.transferWeekDateOptions(weekDate, dayjs(start), dayjs(end));
                const handleIncludesOptions = this.mergeIncludesAndExcludes(weekDateOptions, 'includes');
                const handleExcludesOptions = this.mergeIncludesAndExcludes(handleIncludesOptions, 'excludes');
                const mergeDateOptions = this.mergeDateOptions(handleExcludesOptions);
                return mergeDateOptions;
            });
            this.setData({ _week });
        },
        // 初始化月份模式
        initMonth() {
            const { start, end } = this.properties;
            const monthLen = dayjs(end).diff(dayjs(start), 'month') + 1;
            const _month = Array.from({ length: monthLen })
                .map((_, index) => {
                const month = dayjs(start).add(index, 'month').startOf('month');
                const monthDisplay = month.clone().format('YYYY年 MM月');
                const monthDate = this.getDateByMonth(month);
                const padMonthDate = this.padMonthDate(monthDate);
                const monthDateOptions = this.transferMonthDateOptions(padMonthDate, month, dayjs(start), dayjs(end));
                const handleIncludesOptions = this.mergeIncludesAndExcludes(monthDateOptions, 'includes');
                const handleExcludesOptions = this.mergeIncludesAndExcludes(handleIncludesOptions, 'excludes');
                const mergeDateOptions = this.mergeDateOptions(handleExcludesOptions);
                return {
                    month: monthDisplay,
                    date: mergeDateOptions
                };
            });
            this.setData({ _month });
        },
        // 获取某个月份的日期
        getDateByMonth(month) {
            const monthStart = month.startOf('month');
            const monthEnd = month.endOf('month');
            return Array.from({ length: monthEnd.diff(monthStart, 'day') + 1 })
                .map((_, index) => monthStart.add(index, 'day'));
        },
        // 根据周的第一天，获取周的日期
        getDateByWeek(weekStart) {
            return Array.from({ length: 7 })
                .map((_, index) => weekStart.add(index, 'day'));
        },
        // 填充月前和月底的缺失块
        padMonthDate(dates) {
            const startDate = dates[0];
            const endDate = dates[dates.length - 1];
            // 起始
            const startWeekDate = startDate.startOf('week');
            dates = Array.from({ length: startDate.diff(startWeekDate, 'day') })
                .map((_, index) => startDate.clone().subtract(index + 1, 'day'))
                .reverse().concat(dates);
            // 结束
            const endWeekDate = endDate.endOf('week');
            dates = dates.concat(Array.from({ length: endWeekDate.diff(endDate, 'day') })
                .map((_, index) => endDate.clone().add(index + 1, 'day')));
            return dates;
        },
        // 通过月份日期转化成需要的日期格式
        transferMonthDateOptions(dates, month, start, end) {
            return dates.map(date => {
                return {
                    date: date.format('YYYY-MM-DD'),
                    day: date.format('DD'),
                    month: date.format('MM'),
                    weekday: WEEK_NAME[Number(date.format('d'))],
                    disabled: !month.isSame(date.startOf('month')) || date.isBefore(start) || date.isAfter(end)
                };
            });
        },
        // 通过周日期转化格式
        transferWeekDateOptions(dates, start, end) {
            return dates.map(date => {
                return {
                    date: date.format('YYYY-MM-DD'),
                    day: date.format('DD'),
                    month: date.format('MM'),
                    weekday: WEEK_NAME[Number(date.format('d'))],
                    disabled: date.isBefore(start) || date.isAfter(end)
                };
            });
        },
        // 处理外部 options 信息
        mergeDateOptions(dateOptions) {
            const { options } = this.properties;
            return dateOptions.map(item => {
                options.some((option) => {
                    if (option.date === item.date) {
                        item = Object.assign({}, item, option);
                        return true;
                    }
                });
                return item;
            });
        },
        // 处理 includes / excludes
        mergeIncludesAndExcludes(options, type) {
            const filterArr = this.properties[type];
            if (!filterArr.length)
                return options;
            return options.map((item) => {
                const condiction = filterArr.includes(item.date) || filterArr.includes(item.weekday) || filterArr.includes(item.day);
                if (!condiction && type === 'includes') {
                    item.disabled = true;
                }
                if (condiction && type === 'excludes') {
                    item.disabled = true;
                }
                return item;
            });
        },
        // 处理日期滑动
        handleMonthSwiper(e) {
            console.log('current: ', e.detail.current);
            this.setData({
                _current: e.detail.current
            });
        },
        // 处理日期点击
        handleTapDate(e) {
            const dateOption = e.currentTarget.dataset.option;
            const { _value } = this.data;
            if (!dateOption.disabled && dateOption.date !== _value) {
                const newValue = dateOption.date;
                this.triggerEvent('change', { value: newValue });
            }
        },
        // 处理日历收缩
        handleToggleMode() {
            const { _mode } = this.data;
            const mode = _mode === 'single' ? 'multiple' : 'single';
            this.triggerEvent('modeChange', { mode });
            this.setData({
                _mode: mode
            }, () => {
                this.initDate();
            });
        },
    }
});
