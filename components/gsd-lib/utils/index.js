"use strict";
function deepClone(src) {
    // 对于数字、字符串、布尔
    if (typeof src !== 'object') {
        return src;
    }
    // 对于Date
    if (src instanceof Date) {
        return new Date(src);
    }
    // 对于数组
    if (src instanceof Array) {
        const clone = [];
        for (let i = 0, len = src.length; i < len; i++) {
            clone[i] = deepClone(src[i]);
        }
        return clone;
    }
    // 对于Object对象
    if (typeof src === 'object') {
        const clone = {};
        for (const key in src) {
            if (src.hasOwnProperty(key)) {
                clone[key] = deepClone(src[key]);
            }
        }
        return clone;
    }
}
module.exports = {
    debounce(func, wait, immediate) {
        // immediate默认为false
        let timeout;
        let args;
        let context;
        let timestamp;
        let result;
        const later = () => {
            // 当wait指定的时间间隔期间多次调用_.debounce返回的函数，则会不断更新timestamp的值，导致last < wait && last >= 0一直为true，从而不断启动新的计时器延时执行func
            const last = Date.now() - timestamp;
            if (last < wait && last >= 0) {
                timeout = setTimeout(later, wait - last);
            }
            else {
                timeout = undefined;
                if (!immediate) {
                    result = func.apply(context, args);
                    if (!timeout) {
                        context = args = undefined;
                    }
                }
            }
        };
        return function () {
            context = this;
            args = arguments;
            timestamp = Date.now();
            // 第一次调用该方法时，且immediate为true，则调用func函数
            const callNow = immediate && !timeout;
            // 在wait指定的时间间隔内首次调用该方法，则启动计时器定时调用func函数
            if (!timeout) {
                timeout = setTimeout(later, wait);
            }
            if (callNow) {
                result = func.apply(context, args);
                context = args = undefined;
            }
            return result;
        };
    },
    throttle(fn, delay) {
        let timer;
        let t_start = Date.now();
        return function () {
            const context = this;
            const args = arguments;
            const t_curr = Date.now();
            clearTimeout(timer);
            if (t_curr - t_start >= delay) {
                fn.apply(context, args);
                t_start = t_curr;
            }
            else {
                timer = setTimeout(() => {
                    fn.apply(context, args);
                }, delay);
            }
        };
    },
    deepClone,
    // 生成唯一的 GUID
    generateGUID() {
        let text = '';
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 10; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    },
    // 处理url链接，加入params参数
    urlJoinParams(url, params) {
        if (!url || !params || typeof params !== 'object') {
            return url;
        }
        const separate = url.indexOf('?') === -1 ? '?' : '&';
        const tempStr = Object.keys(params).map(key => {
            if (typeof params[key] === 'object') {
                params[key] = JSON.stringify(params[key]);
            }
            if (params[key] !== undefined) {
                return `${key}=${params[key]}`;
            }
            return '';
        }).filter(value => value).join('&');
        return `${url}${separate}${tempStr}`;
    },
    compareVersion(version1, version2) {
        const v1 = version1.split('.');
        const v2 = version2.split('.');
        const len = Math.max(v1.length, v2.length);
        while (v1.length < len) {
            v1.push('0');
        }
        while (v2.length < len) {
            v2.push('0');
        }
        for (let i = 0; i < len; i++) {
            const num1 = parseInt(v1[i], 10);
            const num2 = parseInt(v2[i], 10);
            if (num1 > num2) {
                return 1;
            }
            else if (num1 < num2) {
                return -1;
            }
        }
        return 0;
    },
    // 拓展方法
    extendMethods(methodKeys, src, target) {
        if (!methodKeys)
            return;
        methodKeys.forEach(key => {
            if (!src[key]) {
                console.warn('源对象的方法不存在：', key);
                return;
            }
            if (target[key]) {
                console.warn('目标对象已存在重复方法：', key);
                return;
            }
            target[key] = src[key].bind(src);
        });
    },
    hideIdCard(idCard, keepLength) {
        if (!idCard) {
            return idCard;
        }
        const digits = keepLength ? keepLength : 4;
        const reg = new RegExp(`(^\\w{${digits}})(\\w+)(\\w{${digits}}$)`, 'g');
        return idCard.replace(reg, (...args) => {
            let tempStr = '';
            if (args[2] && args[2].length) {
                for (let i = 0, len = args[2].length; i < len; i++) {
                    tempStr += '*';
                }
            }
            return args[1] + tempStr + args[3];
        });
    },
    hideName(name) {
        if (!name) {
            return name;
        }
        return name.replace(/(^.{1})(.+)$/g, (...args) => {
            let tempStr = '';
            if (args[2] && args[2].length) {
                tempStr = Array.from({
                    length: args[2].length + 1
                }).join('*');
            }
            return args[1] + tempStr;
        });
    },
    navigateBack(delta) {
        return new Promise((resolve) => {
            const startDelta = getCurrentPages().length - delta;
            wx.navigateBack({
                delta,
                success: () => {
                    const checkSuccess = () => {
                        setTimeout(() => {
                            const currentPageLength = getCurrentPages().length;
                            if (startDelta === currentPageLength || currentPageLength <= 1) {
                                console.log('已回退到指定页面：', getCurrentPages());
                                resolve();
                            }
                            else {
                                checkSuccess();
                            }
                        }, 100);
                    };
                    checkSuccess();
                }
            });
        });
    },
    uniqBy(arr, fn) {
        const hashMap = arr.reduce((map, item) => {
            const key = fn(item);
            if (key && !map[key]) {
                map[key] = item;
            }
            return map;
        }, {});
        return Object.keys(hashMap).map(key => hashMap[key]);
    }
};
