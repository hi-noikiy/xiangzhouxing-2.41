const { Anim, request, dayjs, utils } = getApp();

const statusMap = {
    0: '处理中',
    1: '进行中',
    2: '已办结'
}

const nationMap = {
    1: '中国大陆',
    2: '中国港澳台地区',
    3: '外国'
}

const domicilePlaceMap = {
    1: '珠海市',
    2: '广东其他地市',
    3: '湖北省',
    4: '其他'
}

const identityTypeMap = {
    1: '身份证',
    // 2: '护照',
    3: '护照',
    4: '军官证',
    8: '港澳居民来往内地通行证',
    9: '台湾居民来往内地通行证',
    6: '港澳居民居住证',
    7: '台湾居民居住证',
    11: '出入境通行证'
}

const residentFlagMap = {
    1: `是，在珠海居住了已有半年以上`,
    2: `否，我是临时来珠海的`
}

const residentConditionMap = {
    1: `一直在珠海3个月或以上`,
    2: `来/返回珠海超过14日`,
    3: `来/返回珠海不超过14日（含14日）`,
    4: `目前仍在外地`
}

const travelRegionClassMap = {
    1: `武汉`,
    2: `湖北（不含武汉）`,
    3: `中国大陆其他省(自治区)市`,
    4: `中国港澳台地区`,
    5: `国外`,
    6: `温州市`
}

const personTypeMap = {
    1: '未返穗本地常住居民',
    2: '持续在穗人员',
    3: '一月初返穗居民',
    4: '一月初来穗人员',
    5: '一月中返穗居民',
    6: '一月中来穗人员',
    11: '居家医学观察人员',
    12: '集中医学观察人员',
}

const socialContactMap = {
    1: '14日内密切接触近期有湖北旅居史者',
    2: '自我感觉14日内曾与患者接触过者',
    11: '14日内在湖北旅游居住过的人员',
    12: '14日内曾接触疑似患者',
    13: '14日内其他地方来或返回珠海人员',
    14: '其他人员'
}

const healthStateMap = {
    1: '正常活动',
    2: '居家健康服务',
    3: '集中健康服务',
    4: '集中医学观察'
}

// 1 发热 2 干咳 3 乏力 4 呼吸不畅 5 腹泻 6 流鼻涕 7 胸闷 8 寒战
const symptomTypeMap = {
    1: '自觉正常',
    2: '发热',
    3: '干咳',
    4: '乏力',
    5: '腹泻',
    6: '感冒',
    7: '头疼头晕',
    11: '发热37.3 ℃以下',
    12: '发热37.3 ℃（含）以上',
    13: '干咳',
    14: '乏力',
    15: '其它症状'
}

const booleanMap = {
    0: '否',
    1: '是'
}

const keyMap = [{
        "label": "编号",
        "key": "id"
    },
    {
        "label": "报告状态",
        "key": "statusStr"
    },
    {
        "label": "姓名",
        "key": "username"
    },
    {
        "label": "性别",
        "key": "gender"
    },
    {
        "label": "手机号码",
        "key": "phone"
    },
    {
        "label": "证件类型",
        "key": "identityTypeStr"
    },
    {
        "label": "证件号码",
        "key": "identity"
    },
    {
        "label": "国籍/地区",
        "key": "nationStr"
    },
    {
        "label": "户籍所在地",
        "key": "domicilePlaceStr"
    },
    {
        "label": "籍贯",
        "key": "nativePlace"
    },
    // {
    //   "label": "出生日期",
    //   "key": "birthday"
    // },
    {
        "label": "居住地址",
        "key": "address"
    },
    // {
    //   "label": "详细地址",
    //   "key": "street"
    // },
    // {
    //   "label": "居住区域",
    //   "key": "area"
    // },
    {
        "label": "详细地址",
        "key": "addr"
    },
    // {
    //   "label": "",
    //   "key": "appId"
    // },
    // {
    //   "label": "创建时间",
    //   "key": "createTime"
    // },
    // {
    //   "label": "2020-1-1后有湖北旅居史",
    //   "key": "recentInHubeiStr"
    // },
    // {
    //   "label": "在穗人员类型",
    //   "key": "personTypeStr"
    // },
    // {
    //   "label": "湖北居住城市",
    //   "key": "hubeiLivingCity"
    // },
    // {
    //   "label": "",
    //   "key": "hubeiLivingCode"
    // },

    // {
    //   "label": "",
    //   "key": "itemList"
    // },
    // {
    //   "label": "报告名称",
    //   "key": "reportName"
    // },
    // {
    //   "label": "",
    //   "key": "reportType"
    // },

]

const keyMapOther = [{
        "label": "是否常住珠海",
        "key": "residentFlagStr"
    },
    {
        "label": "近期是否在珠海",
        "key": "residentConditionStr"
    },
    {
        "label": "来或返回珠海日期",
        "key": "returnDate"
    },
    {
        "label": "目前所在地",
        "key": "recentRegionName"
    },
    {
        "label": "拟返回珠海日期",
        "key": "quasiReturnDate"
    },
    {
        "label": "近一个月旅居史",
        "key": "travelRegionClassStr"
    },
    {
        "label": "近期接触史",
        "key": "socialContactStr"
    },
    {
        "label": "14日内密切接触日期",
        "key": "contactDateRecent"
    },
    {
        "label": "14日内感觉接触日期",
        "key": "contactDateLike"
    },
    {
        "label": "个人健康状态",
        "key": "healthStateStr"
    },
    {
        "label": "症状列表",
        "key": "symptomTypeStr"
    },
    {
        "label": "其它症状",
        "key": "symptomDscr"
    }
]

// 反映人信息
const reporterKeyMap = [{
        "label": "姓名",
        "key": "clueSupplier"
    },
    {
        "label": "联系电话",
        "key": "clueSupplierPhone"
    }
]

// 涉事人信息
const reportedKeyMap = [{
        "label": "姓名",
        "key": "username"
    },
    {
        "label": "性别",
        "key": "gender"
    },
    {
        "label": "联系电话",
        "key": "phone"
    },
    {
        "label": "居住地址",
        "key": "street"
    },
    {
        "label": "详细住址",
        "key": "addr"
    },
    {
        "label": "关联车牌",
        "key": "clueVehicle"
    },
    {
        "label": "涉事人类型",
        "key": "socialContact11Str"
    },
    {
        "label": "来或返回珠海日期",
        "key": "returnDate"
    },
    {
        "label": "涉事人类型",
        "key": "socialContact12Str"
    },
    {
        "label": "来或返回珠海日期",
        "key": "contactDateRecent"
    },
    {
        "label": "涉事人类型",
        "key": "socialContact13Str"
    },
    {
        "label": "来或返回珠海日期",
        "key": "quasiReturnDate"
    },
    {
        "label": "涉事人类型",
        "key": "socialContact14Str"
    }
]

// 反映内容
const reportContentKeyMap = [{
    "label": "反映详细内容",
    "key": "symptomDscr"
}]

Anim.Page({
    store(state) {
        return {
            userInfo: state.user.userInfo,
        }
    },
    data: {
        formData: {
            content: ''
        },
        rules: {
            content: [{
                type: 'required',
                message: '请输入回复内容'
            }]
        },
        message: {
            "addr": "",
            "area": "",
            "dscr": "",
            "id": 0,
            "itemList": [],
            "phone": "",
            "report": "",
            "reportName": "",
            "reportType": 0,
            "status": 0,
            "username": ""
        },
        keyMap,
        keyMapOther,
        reporterKeyMap,
        reportedKeyMap,
        reportContentKeyMap,
        query: {}
    },
    onLoad(query) {
        this.setData({
            query
        });
        this.statusChange();
        this.fetchData(query)
        this.handleTodoType(query.todoType)
    },

    handleTodoType(todoType = this.data.query.todoType) {
        if (todoType === 'report') {
            const fixedKeyMap = keyMap.map(item => {
                if (item.label === '姓名') {
                    return {
                        ...item,
                        label: '涉事人'
                    }
                }
                return item
            })
            this.setData({
                keyMap: fixedKeyMap
            })
        }
    },

    onChangeForm(e) {
        this.setData({
            [`formData.${e.target.id}`]: e.detail.value
        })
    },

    fetchData(query) {
        wx.showLoading({
            title: '努力加载中...'
        })
        let url
        console.log('query', query)
        if (query.todoType === 'affair') {
            // 待办 可审批
            if (+query.reportType !== 0) {
                // 自检上报
                url = `/usercenter/affair/detail?affairId=${query.id}`
            } else {
                // 疫情线索
                url = `/usercenter/affair/detailForPneumonia?affairId=${query.id}`
            }
        } else {
            // 查看 不可审批 自主上报、疫情线索
            url = `/usercenter/report/detailForPneumonia?reportId=${query.id}`
        }
        return request({
                url
            })
            .then(data => {

                wx.hideLoading()
                console.log('getCheckSelfInfo', data)
                data.identityTypeStr = identityTypeMap[data.identityType]
                data.personTypeStr = personTypeMap[data.personType]
                    // data.birthday = '********'
                data.username = data.username || "-";
                data.symptomTypeStr = data.symptomList && data.symptomList.map(item => symptomTypeMap[item]).join(', ')
                data.socialContact = data.socialContact || "";
                data.socialContactStr = data.socialContact && data.socialContact.split(",").map(item => socialContactMap[item]).join(', ')
                if (data.socialContact) {
                    let arr = data.socialContact.split(",");
                    ["11", "12", "13", "14"].map(v => {
                        if (arr.indexOf(v) > -1) {
                            data[`socialContact${v}Str`] = socialContactMap[v];
                        }
                    })
                }
                data.healthState = data.healthState || "";
                data.healthStateStr = data.healthState && healthStateMap[data.healthState];

                data.nationStr = nationMap[data.isChinese] || "";
                data.domicilePlaceStr = domicilePlaceMap[data.domicilePlace] || "";
                data.residentFlagStr = residentFlagMap[data.residentFlag] || "";
                data.residentConditionStr = residentConditionMap[data.residentCondition] || "";
                data.travelRegionClassStr = travelRegionClassMap[data.travelRegionClass] || "";
                // data.socialContactStr = socialContactMap[data.socialContact] || "";
                data.returnDate = data.returnDate ? dayjs(data.returnDate).format("YYYY/MM/DD") : "";
                data.quasiReturnDate = data.quasiReturnDate ? dayjs(data.quasiReturnDate).format("YYYY/MM/DD") : "";
                data.contactDateRecent = data.contactDateRecent ? dayjs(data.contactDateRecent).format("YYYY/MM/DD") : "";
                data.contactDateLike = data.contactDateLike ? dayjs(data.contactDateLike).format("YYYY/MM/DD") : "";

                data.recentInHubeiStr = booleanMap[data.recentInHubei]
                data.itemList && data.itemList.forEach(item => {
                    item.commitTime = item.commitTime && dayjs(item.commitTime).format('YYYY/MM/DD HH:mm')
                    item.commiterName = item.commiterName || '管理员'
                })
                data.address = data.city && data.area && data.street && `${data.city}${data.area}${data.street}${data.community}`
                data.statusStr = statusMap[data.status]
                data.identity = data.identity && utils.hideIdCard(data.identity)

                if (data.residentFlag == 1) {
                    data.travelRegionClassStr = "";
                }
                // if(data.healthState == 1){
                //   data.symptomTypeStr = "";
                //   data.symptomDscr = "";
                // }
                this.setData({
                    message: data
                })
            })
            .catch(err => {
                wx.hideLoading()
                console.log('err', err)
            })
    },

    // 跳转
    handleTodoTap(evt) {
        const { dataset: { url } } = evt.currentTarget;
        wx.navigateTo({
            url
        });
    },
    statusChange() {
        let message = this.data.message.status
        switch (message) {
            case 'warn':
                this.setData({ statusColor: '#f13939' })
                break;
            case 'wait':
                this.setData({ statusColor: '#009E7E' })
                break;
            case 'success':
                this.setData({ statusColor: '#1DC350' })
                break;
            default:
                break;
        }
    },
    tabChange(e) {
        this.setData({
            activeKey: e.detail.value.key
        });
    },
    onTapReply(e) {
        console.log(e)
        const { validStatus, value } = e.detail
        if (!validStatus) {
            return
        }

        wx.showLoading({
            title: '努力加载中...'
        })
        request({
                url: '/usercenter/affair/reply',
                method: 'POST',
                data: {
                    affairId: this.data.query.id,
                    content: value.content
                }
            })
            .then(() => {
                wx.hideLoading()
                this.setData({
                    'formData.content': ''
                })
                this.fetchData(this.data.query)
            })
            .catch(err => {
                wx.hideLoading()
            })
    },
    onTapDone() {
        wx.showLoading({
            title: '努力加载中...'
        })
        if (!this.data.formData.content) {
            wx.showToast({
                title: '请输入回复内容'
            })
            return
        }
        request({
                url: '/usercenter/affair/finish',
                method: 'POST',
                data: {
                    affairId: this.data.query.id,
                    content: this.data.formData.content
                }
            })
            .then(() => {
                wx.hideLoading()
                this.setData({
                    'formData.content': ''
                })
                this.fetchData(this.data.query)
            })
            .catch(err => {
                wx.hideLoading()
            })
    },
    handleTap() {
        console.log(1)
    },
    onTapAccess() {
        let clueType = this.data.message.clueType || 0;

        let url = "";
        if (clueType == 1) {
            url = `/pages/report/inform/index`;
        } else if (clueType == 2) {
            url = `/pages/report/index/index?type=2`;
        } else {
            url = `/pages/report/index/index?type=1`;
        }
        wx.navigateTo({
            url
        })
    }
});