// pages/g-banner/index.js
Component({
    properties: {
        src: {
            type: Array,
            observer() {
                this.initBanner();
            },
            __type__: (v) => v
        }
    },
    data: {
        _autoplay: true,
        _showDots: false
    },
    methods: {
        initBanner() {
            const { src } = this.properties;
            if (src.length > 1) {
                this.setData({ _showDots: true });
            }
            else {
                this.setData({ _showDots: false });
            }
        }
    }
});
