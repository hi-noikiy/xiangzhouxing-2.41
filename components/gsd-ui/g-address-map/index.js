"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// pages/g-address-map/index.js
const qMap = require("../../gsd-lib/map/index");
const Event = require("../../gsd-lib/event/index");
Component({
    externalClasses: ['component-item-class', 'title-item-class'],
    properties: {
        list: {
            type: Array,
            observer() {
                this.resetTab();
            },
            __type__: (list) => list
        },
        // navigator | selector
        mode: {
            type: String,
            value: 'navigator'
        },
        showMap: {
            type: Boolean,
            value: true
        },
        activeId: {
            type: Number,
            observer(newId) {
                this.setActiveId(newId);
            }
        },
        emptyText: {
            type: String,
            value: '当前范围内无网点'
        },
        loadUnit: {
            type: String,
            value: 'district'
        },
        regionLevel: {
            type: Number,
            value: 3
        },
        showSelect: {
            type: Boolean,
            value: true
        },
        canShowMap: {
            type: Boolean,
            value: true
        },
        regionIncludes: Array,
        regionExcludes: Array
    },
    data: {
        _regionValue: [],
        _tabActiveKey: 'list',
        _mapHeight: 0,
        _emptyListHeight: 0,
        _activeIndex: 0,
        _activeId: 0,
        _position: {
            longitude: 113.26436,
            latitude: 23.12908
        }
    },
    ready() {
        this.initLocation();
        this.initLayout();
        this.setActiveId();
    },
    methods: {
        // reset Tab 高度
        resetTab() {
            Event.dispatch('g-tabs__resetStyle');
        },
        // 初始化地图定位(个人定位)
        initLocation() {
            wx.getLocation({
                type: 'gcj02',
                success: (res) => {
                    console.log('成功获取当前定位', res);
                    const _position = {
                        longitude: res.longitude,
                        latitude: res.latitude
                    };
                    this.setData({ _position });
                }
            });
        },
        // 高亮 activeId
        setActiveId(_activeId) {
            const { list } = this.properties;
            const itemList = list;
            if (!itemList || itemList.length <= 0)
                return false;
            _activeId = _activeId || itemList[0].id;
            this.setData({
                _activeId
            }, () => {
                const _activeIndex = itemList.findIndex(item => item.id === _activeId);
                const _position = itemList[_activeIndex].position;
                this.setData({
                    _activeIndex,
                    _position
                });
            });
        },
        // 初始化空 container 高度
        // 初始化地图高度
        initLayout() {
            const { showMap } = this.properties;
            const query = this.createSelectorQuery();
            query.select('#map-address-item').boundingClientRect();
            query.selectViewport().boundingClientRect();
            query.select('#list-title').boundingClientRect();
            query.exec((result) => {
                const addressItemHeight = result[0] && result[0].height || 0;
                const viewportHeight = result[1].height || 0;
                const listTitleHeight = result[2] && result[2].height || 0;
                const tabHeight = 88 * (result[1].width / 750);
                const _mapHeight = viewportHeight - tabHeight - addressItemHeight;
                const _emptyListHeight = viewportHeight - (showMap ? tabHeight : listTitleHeight);
                this.setData({
                    _mapHeight,
                    _emptyListHeight
                }, () => {
                    this.resetTab();
                });
            });
        },
        // 处理 Tab 变化
        handleTabChange(e) {
            this.setData({
                _tabActiveKey: e.detail.value.key
            });
            this.initLayout();
        },
        // 点击 Marker
        handleActiveMarker(e) {
            const { list } = this.properties;
            this.setActiveId(e.detail.id);
        },
        // 点击列表项
        handleListItemTap(e) {
            const { mode } = this.properties;
            const data = e.currentTarget.dataset.item;
            if (mode === 'selector') {
                this.triggerEvent('choose', data);
            }
            if (mode === 'navigator') {
                this.setData({
                    _tabActiveKey: 'map',
                });
                this.setActiveId(data.item.id);
            }
        },
        // 点击地图项
        handleMapItemTap(e) {
            console.log(e);
            const { mode } = this.properties;
            const data = e.currentTarget.dataset.item;
            if (mode === 'selector') {
                this.triggerEvent('choose', data);
            }
        },
        // 导航
        handleNavigatorTap() {
            const { _activeIndex } = this.data;
            const item = this.properties.list[_activeIndex];
            const position = item.position;
            wx.openLocation({
                latitude: position.latitude,
                longitude: position.longitude,
                name: item.name,
                address: item.address
            });
        },
        // 电话
        handlePhoneTap() {
            const { _activeIndex } = this.data;
            const item = this.properties.list[_activeIndex];
            const phone = item.phone;
            if (typeof phone === 'string') {
                wx.makePhoneCall({
                    phoneNumber: phone
                });
            }
            else {
                wx.showActionSheet({
                    itemList: phone,
                    success(res) {
                        wx.makePhoneCall({
                            phoneNumber: phone[res.tapIndex],
                        });
                    }
                });
            }
        },
        // 地图更新，透传事件
        handleMapUpdate(e) {
            if (e.detail.info) {
                const info = e.detail.info;
                const _regionValue = [info.province, info.city, info.district];
                this.setData({ _regionValue });
                this.triggerEvent('mapUpdate', e.detail);
            }
        },
        // region picker 切换
        handleRegionChange(e) {
            const { showMap, loadUnit } = this.properties;
            const { _tabActiveKey } = this.data;
            if (Array.isArray(e.detail.value)) {
                const regionData = e.detail.value;
                this.setData({
                    _regionValue: regionData.map(v => v.name)
                });
                // 地图切换位置
                qMap.geocoder({
                    address: regionData.map(item => item.name).join(''),
                    success: (e) => {
                        if (e.status === 0) {
                            const _position = {
                                longitude: e.result.location.lng,
                                latitude: e.result.location.lat
                            };
                            // 有地图则需要切换地图位置
                            qMap.reverseGeocoder({
                                location: _position,
                                success: (e) => {
                                    if (e.status === 0) {
                                        const info = e.result.ad_info;
                                        Event.dispatch('g-map__setLastLocaton', info[loadUnit]);
                                        this.setData({ _position });
                                        this.triggerEvent('mapUpdate', {
                                            position: _position,
                                            info
                                        });
                                    }
                                }
                            });
                        }
                    }
                });
            }
        }
    },
});
