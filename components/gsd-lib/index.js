"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Event = require('./event/index');
const Map = require('./map/index');
const CryptoJS = require('./crypto/index');
const dayjs = require('./dayjs/index');
const utils = require('./utils/index');
const Storage = require('./storage/index');
const Anim = require('./anim/anim.min.js');
const wedux = Anim.wedux;
const lib = Object.assign({ 
    // 事件驱动
    Event,
    // LBS能力
    Map,
    // 加密解密
    CryptoJS,
    // 时间处理
    dayjs,
    // 全局数据状态
    wedux,
    // 开发框架
    Anim,
    // 数据缓存
    Storage }, utils);
const configList = [
    [[
            'addEventListener',
            'removeEventListener',
            'removeSingleEventListener',
            'hasEventListener',
            'dispatch',
            'getEvents'
        ], Event, lib],
    [[
            'search',
            'getSuggestion',
            'reverseGeocoder',
            'geocoder',
            'getCityList',
            'getDistrictByCityId',
            'calculateDistance'
        ], Map, lib],
    [[
            'encryptByAES',
            'decryptByAES',
        ], CryptoJS, lib],
    [[
            'mapToData',
            'observe',
        ], wedux, lib],
    [[
            'setStorageSync',
            'getStorageSync',
            'removeStorageSync',
            'clearStorageSync',
            'clearExpiredStorage'
        ], Storage, lib]
];
configList.forEach(config => {
    utils.extendMethods(...config);
});
exports.default = lib;
