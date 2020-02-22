// const listBehaviors = require('../behaviors/list')
Component({
    // behaviors: [listBehaviors],
    options: { multipleSlots: true },
    externalClasses: ['component-class', 'title-class'],
    properties: {
        title: String,
        xrequired: String,
        disabled: {
            type: Boolean,
            value: false
        },


    },
    data: {},
    methods: {}
});