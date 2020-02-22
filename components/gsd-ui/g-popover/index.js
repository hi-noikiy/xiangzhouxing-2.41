// pages/g-popover/index.js
const winHeight = wx.getSystemInfoSync().windowHeight;
const winWidth = wx.getSystemInfoSync().windowWidth;
const getPlacements = (rects, placement = 'top') => {
    const [pBox, pItem] = rects;
    const offsetY = 10;
    const offsetX = 2;
    const centerX = (pItem.width - pBox.width) / 2;
    const centerY = (pItem.height - pBox.height) / 2;
    switch (placement) {
        case 'top':
            return {
                top: -pBox.height - offsetY,
                left: centerX,
                right: 0
            };
        case 'topLeft':
            return {
                top: -pBox.height - offsetY,
                left: offsetX,
                right: 0
            };
        case 'topRight':
            return {
                top: -pBox.height - offsetY,
                left: 0,
                right: offsetX
            };
        case 'bottom':
            return {
                top: pItem.height + offsetY,
                left: centerX,
                right: 0
            };
        case 'bottomLeft':
            return {
                top: pItem.height + offsetY,
                left: offsetX,
                right: 0
            };
        case 'bottomRight':
            return {
                top: pItem.height + offsetY,
                left: 0,
                right: offsetX
            };
        case 'left':
            return {
                top: centerY,
                left: -pBox.width - offsetY,
                right: 0
            };
        case 'leftTop':
            return {
                top: offsetX,
                left: -pBox.width - offsetY,
                right: 0
            };
        case 'leftBottom':
            return {
                top: pItem.height - pBox.height,
                left: -pBox.width - offsetY,
                right: 0
            };
        case 'right':
            return {
                top: centerY,
                left: pItem.width + offsetY,
                right: 0
            };
        case 'rightTop':
            return {
                top: offsetX,
                left: pItem.width + offsetY,
                right: 0
            };
        case 'rightBottom':
            return {
                top: pItem.height - pBox.height,
                left: pItem.width + offsetY,
                right: 0
            };
        default:
            return {
                top: -pBox.height - offsetY,
                left: centerX,
                right: 0
            };
    }
};
Component({
    options: {
        multipleSlots: true
    },
    properties: {
        content: {
            type: String,
            value: 'tips'
        },
        placement: {
            type: String,
            value: 'top',
        },
        visible: {
            type: Boolean,
            value: false,
        },
        position: {
            type: String,
            value: 'static'
        }
    },
    data: {
        _popVisible: false,
        _popoStyle: ''
    },
    ready() {
        if (this.data.visible) {
            this.onShow();
        }
    },
    methods: {
        onShow() {
            const query = wx.createSelectorQuery().in(this);
            query.select('.popBox').boundingClientRect();
            query.select('.popoverItem').boundingClientRect();
            query.exec((rects) => {
                if (rects.filter((n) => !n).length)
                    return;
                const placements = getPlacements(rects, this.data.placement);
                const _popoStyle = `
            top: ${placements.top}px;
            ${placements.left ? `left: ${placements.left}px;` : ''}
            ${placements.right ? `right: ${placements.right}px;` : ''}
          `;
                this.setData({
                    _popoStyle,
                    _popVisible: true
                });
            });
        },
        onTap() {
            if (!this.data.visible) { // 显示
                this.setData({
                    visible: true,
                    _popVisible: false
                }, () => {
                    this.onShow();
                });
            }
            else {
                this.setData({
                    visible: false,
                    _popVisible: false
                });
            }
        }
    }
});
