// pages/g-timeline/index.js
Component({
    relations: {
        '../g-timeline-item/index': {
            type: 'child',
            linked() {
                console.log('insert');
                this.setTimelineItemLast();
            },
            unlinked() {
                console.log('changed');
                this.setTimelineItemLast();
            }
        }
    },
    properties: {
        pending: {
            type: Boolean
        }
    },
    ready() {
        this.setTimelineItemLast();
    },
    data: {},
    methods: {
        getTimelineItems() {
            return this.getRelationNodes('../g-timeline-item/index');
        },
        setTimelineItemLast() {
            this.getTimelineItems().forEach((item, index, arr) => {
                if (index === arr.length - 1) {
                    item.setData({ _isLast: true });
                }
                else {
                    item.setData({ _isLast: false });
                }
            });
        }
    }
});
