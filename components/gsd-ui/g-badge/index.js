// pages/g-badge/index.js
const badgePosition = 'none';
Component({
    externalClasses: ['component-class'],
    properties: {
        count: {
            type: [Number, String],
            observer(newVal) {
                this.isShowOverflowCount(newVal);
            }
        },
        dot: {
            type: Boolean,
            value: false
        },
        overflowCount: {
            type: Number,
            value: 99
        },
        position: {
            type: String,
            value: badgePosition
        }
    },
    data: {
        showOverflowCount: false
    },
    methods: {
        /**
         * 如果是整型的话，判断是否达到最大值
         *
         * @param {(number | string)} value
         */
        isShowOverflowCount(value) {
            if (typeof value === 'number' && value >= this.properties.overflowCount) {
                this.setData({
                    showOverflowCount: true
                });
            }
            else {
                this.setData({
                    showOverflowCount: false
                });
            }
        }
    }
});
