"use strict";
// pages/g-map/index.js
const DEFAULT_DATA = {
    _markers: [],
    _showLoad: false
};
const { debounce } = require('../../gsd-lib/utils/index');
const Event = require('../../gsd-lib/event/index');
const qMap = require('../../gsd-lib/map/index');
const ACTIVE_MARKER_PATH = 'https://imgcache.gzonline.gov.cn/cos/active_marker_c790abc5.png';
const NORMAL_MARKER_PATH = 'https://imgcache.gzonline.gov.cn/cos/normal_marker_07b4d625.png';
Component({
    _mapContext: undefined,
    _lastLocation: '',
    _tempUpdate: undefined,
    _tempLocation: '',
    properties: {
        scale: {
            type: Number,
            value: 16
        },
        // 防止地图是空白
        position: {
            type: Object,
            value: {
                longitude: 116.39694614768342,
                latitude: 39.909666770172194
            }
        },
        activeId: {
            type: Number,
            observer() {
                this._setByActiveId();
            }
        },
        markers: {
            type: Array,
            observer(markers) {
                if (markers.length > 0) {
                    this._buildMarkers();
                }
            },
            __type__: (markers) => markers
        },
        loadUnit: {
            type: String,
            value: 'district'
        }
    },
    data: DEFAULT_DATA,
    ready() {
        this._mapContext = wx.createMapContext('map', this);
        this._initListener();
    },
    methods: {
        _initListener() {
            Event.addEventListener('g-map__setLastLocaton', (res) => {
                this._lastLocation = res.target;
            });
        },
        _setByActiveId() {
            this._buildMarkers();
        },
        _buildMarkers() {
            const { activeId, markers } = this.properties;
            let activeIndex = -1;
            let _markers = markers.map((gMarker, index) => {
                const marker = {
                    id: gMarker.id,
                    title: gMarker.name,
                    longitude: gMarker.position.longitude,
                    latitude: gMarker.position.latitude
                };
                if (Number(activeId) === Number(gMarker.id)) {
                    console.log('找到激活标记', activeId);
                    activeIndex = index;
                    this._setActiveMarker(marker);
                }
                else {
                    this._setNormalMarker(marker);
                }
                return marker;
            });
            // 将高亮点放到 map 最后渲染，提高图层
            if (activeIndex >= 0) {
                _markers = _markers.concat(_markers.splice(activeIndex, 1));
            }
            this.setData({ _markers });
        },
        _setActiveMarker(marker) {
            marker.iconPath = ACTIVE_MARKER_PATH;
            marker.width = 28;
            marker.height = 44;
            marker.callout = {
                content: marker.title,
                color: '#ffffff',
                fontSize: 12,
                bgColor: '#000000',
                display: 'ALWAYS',
                padding: 5,
                borderRadius: 4
            };
            return marker;
        },
        _setNormalMarker(marker) {
            marker.iconPath = NORMAL_MARKER_PATH;
            marker.width = 24;
            marker.height = 38;
            delete marker.title;
            return marker;
        },
        _checkLoadUnit() {
            const { loadUnit } = this.properties;
            if (!['province', 'city', 'district'].includes(loadUnit)) {
                throw Error('loadUnit 的参数必须是 province, city, district。你填写的是：' + loadUnit);
            }
        },
        handleRegionChange: debounce(function (e) {
            const { _showLoad } = this.data;
            const loadUnit = this.properties.loadUnit;
            this._checkLoadUnit();
            if (e.type === 'start')
                return;
            // 获取当前最新中心坐标
            const mapContext = this._mapContext;
            mapContext.getCenterLocation({
                success: (position) => {
                    qMap.reverseGeocoder({
                        location: position,
                        success: res => {
                            const newLocation = res.result.ad_info[loadUnit];
                            const newUpdate = { position, info: res.result.ad_info };
                            console.log(this._lastLocation, newLocation);
                            if (this._lastLocation !== newLocation) {
                                // 初始化时，直接暴露事件
                                if (!this._lastLocation) {
                                    this.triggerEvent('mapUpdate', newUpdate);
                                    this._lastLocation = newLocation;
                                }
                                else if (e.type === 'end' || e.type === 'updated') {
                                    // 拖动地图改变地区时，需要有提示
                                    this.setData({ _showLoad: true });
                                }
                            }
                            else {
                                if (_showLoad)
                                    this.setData({ _showLoad: false });
                            }
                            // 暂时缓存的地理数据
                            this._tempLocation = newLocation;
                            this._tempUpdate = newUpdate;
                        }
                    });
                },
                fail: (e) => {
                    console.log('g-map error update:', e);
                }
            });
        }, 200),
        handleMarkerTap(e) {
            this.triggerEvent('activeMarker', { id: e.markerId });
        },
        handleLocationTap() {
            this._mapContext.moveToLocation();
        },
        handleLoadTap() {
            this._lastLocation = this._tempLocation;
            this.triggerEvent('mapUpdate', this._tempUpdate);
            this.setData({ _showLoad: false });
        }
    }
});
module.exports = {};
