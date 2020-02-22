// pages/g-timeline-item/index.js
Component({
    relations: {
        '../g-timeline/index': {
            type: 'parent'
        }
    },
    properties: {
        status: {
            type: String,
            value: 'normal'
        }
    },
    data: {
        _isLast: false
    },
    methods: {}
});
