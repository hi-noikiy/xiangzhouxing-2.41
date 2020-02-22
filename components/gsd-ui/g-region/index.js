const { debounce } = require('../../gsd-lib/utils/index');
const DEFAULT_DATA = {
    range: [],
    valueIndex: []
};
Component({
    _regionData: undefined,
    _retry: 3,
    /**
     * 组件的属性列表
     */
    properties: {
        // 等级，1级为省级，2为市级，3为区县，以此类推
        level: {
            type: Number,
            value: 3
        },
        value: {
            type: Array,
            value: [],
            observer() {
                if (!this._regionData) {
                    this.initRegionData();
                }
                else {
                    this.initPicker();
                }
            },
            __type__: (value) => value
        },
        type: {
            type: String,
            value: ''
        },
        includes: {
            type: Array,
            observer() {
                if (!this._regionData) {
                    this.initRegionData();
                }
                else {
                    this.initPicker();
                }
            },
            __type__: (includes) => includes
        },
        excludes: {
            type: Array,
            observer() {
                if (!this._regionData) {
                    this.initRegionData();
                }
                else {
                    this.initPicker();
                }
            },
            __type__: (excludes) => excludes
        }
    },
    /**
     * 组件的初始数据
     */
    data: DEFAULT_DATA,
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
        // init picker，根据 level 初始化列表项
        initPicker() {
            const { value } = this.properties;
            let { range } = this.data;
            let provinceCode = '';
            const provinceData = this.getDataByParentCode('', 0);
            if (value.length > 0) {
                const findItem = this.findItemByName(provinceData, value[0]);
                if (findItem) {
                    provinceCode = findItem.code;
                }
                else {
                    provinceCode = provinceData[0].code;
                }
            }
            else {
                provinceCode = provinceData[0].code;
            }
            range[0] = provinceData;
            range = this.getRange(range, 0, provinceCode);
            this.setData({ range });
            if (value.length > 0) {
                this.setValueIndex();
            }
        },
        // // 根据 regionIndex，parentCode 获取后续的 range 数据，通过递归获取
        getRange(range, regionIndex = 0, parentCode) {
            const { level, value } = this.properties;
            if (regionIndex + 1 < level) {
                const data = this.getDataByParentCode(parentCode, regionIndex + 1);
                range[regionIndex + 1] = data;
                // 下一列的 parentCode
                const nextItem = this.findItemByName(data, value[regionIndex + 1]);
                const nextCode = (nextItem && nextItem.code) || data[0].code;
                range = this.getRange(range, regionIndex + 1, nextCode);
            }
            return range;
        },
        // //  根据 parentCode 和列表 index 获取数据列表，并在此筛选
        getDataByParentCode(parentCode, regionIndex) {
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
        // 设置当前列选的值
        setValueIndex() {
            const { value } = this.properties;
            const { range } = this.data;
            const valueIndex = value.map((name, index) => {
                const vidx = (range[index] || []).map((item) => item.name).indexOf(name);
                return vidx === -1 ? 0 : vidx;
            });
            this.setData({ valueIndex });
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
            this._retry = 3;
            return Promise.all([
                this.$request('https://fingertip-static.gdbs.gov.cn/static/city/1.json'),
                this.$request('https://fingertip-static.gdbs.gov.cn/static/city/2.json'),
                this.$request('https://fingertip-static.gdbs.gov.cn/static/city/3.json')
            ]).then(dataArr => {
                this.setStorage('region-data', dataArr)
                    .catch(err => {
                    console.error(err);
                });
                return dataArr;
            }).catch(err => {
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
        handleColumnChange: debounce(function (e) {
            const { level } = this.properties;
            const { column, value: regionIndex } = e.detail;
            const { range, valueIndex } = this.data;
            const code = range[column][regionIndex].code;
            const newRange = this.getRange(range, column, code);
            valueIndex[column] = regionIndex;
            for (let i = column + 1; i < level; i++) {
                valueIndex[i] = 0;
            }
            this.setData({ range: newRange, valueIndex });
        }, 100),
        // 改变事件
        handleChange(e) {
            const { value: valueIndex } = e.detail;
            const { range } = this.data;
            const value = valueIndex.map((vidx, index) => {
                vidx = vidx || 0;
                return range[index][vidx];
            });
            this.triggerEvent('change', { value });
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
