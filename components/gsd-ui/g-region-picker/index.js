"use strict";
var Level;
(function (Level) {
    Level[Level["province"] = 1] = "province";
    Level[Level["city"] = 2] = "city";
    Level[Level["district"] = 3] = "district";
})(Level || (Level = {}));
const DEFAULT_DATA = {
    _range: []
};
let isLoading = false;
Component({
    _regionData: undefined,
    _retry: 3,
    /**
     * 组件的属性列表
     */
    properties: {
        visible: Boolean,
        // 等级，1级为省级，2为市级，3为区县，以此类推
        type: {
            type: String,
            value: 'district',
            observer() {
                this.initRegionData();
            }
        },
        value: {
            type: Array,
            value: [],
            observer() {
                this.initRegionData();
            },
            __type__: (value) => value
        },
        includes: {
            type: Array,
            observer() {
                this.initRegionData();
            },
            __type__: (includes) => includes
        },
        excludes: {
            type: Array,
            observer() {
                this.initRegionData();
            },
            __type__: (excludes) => excludes
        }
    },
    /**
     * 组件的初始数据
     */
    data: DEFAULT_DATA,
    ready() {
        this.initRegionData();
    },
    /**
     * 组件的方法列表
     */
    methods: {
        // 初始化获取数据
        initRegionData() {
            // 检查是否有 storage
            return this.getStorage('region-data')
                .then((dataArr) => {
                this._regionData = dataArr;
                this.initPicker();
            })
                .catch((err) => {
                console.log('init region data error', err);
                this.getRegionData()
                    .then((dataArr) => {
                    this._regionData = dataArr;
                    this.initPicker();
                });
            });
        },
        initPicker() {
            const { type, value } = this.properties;
            console.log('value', value)
            if (!value.length) {
                const provinceData = this.getDataByParentCode();
                this.setData({
                    _range: [{
                            title: '省份',
                            data: provinceData
                        }]
                });
            }
        },
        // // 根据 regionIndex，parentCode 获取后续的 range 数据，通过递归获取
        getRange(range, regionIndex = 0, parentCode) {
            const { type, value } = this.properties;
            const level = Level[type];
            if (regionIndex + 1 < parseInt(level)) {
                const data = this.getDataByParentCode(parentCode, regionIndex + 1);
                range[regionIndex + 1] = data;
                // 下一列的 parentCode
                const nextItem = this.findItemByName(data, value[regionIndex + 1]);
                const nextCode = (nextItem && nextItem.code) || data[0].code;
                range = this.getRange(range, regionIndex + 1, nextCode);
            }
            return range;
        },
        // 根据 parentCode 和列表 index 获取数据列表，并在此筛选
        getDataByParentCode(parentCode = '', regionIndex = 0) {
            const { includes, excludes } = this.properties;
            return this._regionData[regionIndex]
                .filter(item => {
                if (regionIndex > 0) {
                    return item.parent_code === parentCode;
                }
                return true;
            })
                .filter(item => {
                if (includes[regionIndex]) {
                    return includes[regionIndex].some((subItem) => {
                        return item.name === subItem;
                    });
                }
                return true;
            })
                .filter(item => {
                if (excludes[regionIndex]) {
                    return excludes[regionIndex].every((subItem) => {
                        return item.name !== subItem;
                    });
                }
                return true;
            });
        },
        // 根据 name 获取单项
        findItemByName(list, name) {
            let targetItem;
            list.some(item => {
                if (item.name.indexOf(name) !== -1) {
                    targetItem = item;
                    return true;
                }
            });
            return targetItem;
        },
        // 远端获取基础数据
        getRegionData() {
            // if (isLoading)
            //     return Promise.reject('重复请求');
            isLoading = true;
            this._retry = 3;
            return Promise.all([
                this.$request('https://fingertip-static.gdbs.gov.cn/static/city/1.json'),
                this.$request('https://fingertip-static.gdbs.gov.cn/static/city/2.json'),
                this.$request('https://fingertip-static.gdbs.gov.cn/static/city/3.json')
            ]).then(dataArr => {
                isLoading = false;
                this.setStorage('region-data', dataArr)
                    .catch(err => {
                    console.error(err);
                });
                return dataArr;
            }).catch(err => {
                isLoading = false;
                if (this._retry > 0) {
                    this.getRegionData();
                    this._retry -= 1;
                }
                else {
                    wx.showToast({
                        title: '服务繁忙',
                        icon: 'none'
                    });
                }
            });
        },
        // 列表改变事件，当前行变化后，影响的是下一行的列表数据
        handleColumnChange(e) {
            const { type } = this.properties;
            const { _range } = this.data;
            const { index, item } = e.detail;
            if (parseInt(index) < parseInt(Level[type]) - 1) {
                const nextData = this.getDataByParentCode(item.code, index + 1);
                _range[index + 1] = {
                    title: index + 1 === 1 ? '城市' : '区/县',
                    data: nextData
                };
                const newRange = _range.slice(0, index + 2);
                this.setData({ _range: newRange });
            }
            else {
                this.handleClose();
            }
        },
        // 关闭弹框后关闭
        handleChange(e) {
            const { type } = this.properties;
            const level = Level[type];
            if (e.detail.value.length === level) {
                this.triggerEvent('change', e.detail);
            }
        },
        // 处理特殊的市级数据
        checkSpecial(code) {
            const spCodes = ['4419', '4420'];
            return spCodes.some(spCode => {
                return code.indexOf(spCode) !== -1;
            });
        },
        // storage promise
        getStorage(key) {
            return new Promise((resolve, reject) => {
                wx.getStorage({
                    key,
                    success(res) {
                        resolve(res.data);
                    },
                    fail(res) {
                        reject(res);
                    }
                });
            });
        },
        setStorage(key, value) {
            return new Promise((resolve, reject) => {
                wx.setStorage({
                    key,
                    data: value,
                    success(res) {
                        resolve(res);
                    },
                    fail(res) {
                        reject(res);
                    }
                });
            });
        },
        handleClose() {
            this.triggerEvent('close');
        },
        // request promise
        $request(url) {
            return new Promise((resolve, reject) => {
                wx.request({
                    url,
                    success(res) {
                        resolve(res.data);
                    },
                    fail(res) {
                        reject(res);
                    },
                });
            });
        }
    }
});
module.exports = {};
