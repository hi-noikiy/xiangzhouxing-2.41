// pages/g-circle/index.js
;
Component({
    properties: {
        total: {
            type: Number,
            observer() {
                this.calcRotate();
            }
        },
        current: {
            type: Number,
            observer() {
                this.calcRotate();
            }
        },
        status: String
    },
    data: {
        leftRotateDeg: 45,
        rightRotateDeg: 45
    },
    ready() {
        this.calcRotate();
    },
    methods: {
        calcRotate() {
            const { current, total } = this.properties;
            let leftRotateDeg, rightRotateDeg;
            const percent = current / total;
            if (percent === 1) {
                leftRotateDeg = 45;
                rightRotateDeg = 45;
            }
            else if (percent <= 0.5) {
                leftRotateDeg = -135;
                rightRotateDeg = 360 * percent - 135;
            }
            else {
                leftRotateDeg = 360 * (percent - 0.5) - 135;
                rightRotateDeg = 45;
            }
            this.setData({
                leftRotateDeg,
                rightRotateDeg
            });
        }
    }
});
