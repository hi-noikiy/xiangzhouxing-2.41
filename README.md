# 微应急小程序说明文档
当前小程序是从“穗康”小程序拷贝出来的项目，包含下列模块

* 健康自查上报
* 疫情线索上报
* 医疗物资捐赠
* 口罩预约购买
* 在线免费义诊
* 企业复工
* 健康码
* 卡口
* ......

请各团队根据各自的需求，选择需要使用或修改的模块。

 [toc]
 
## 文档

请参照组件和源代码例子参照使用。

* 组件文档：http://open.ywtbsupappw.sh.gov.cn/resource/mini-program/gsd-ui/base-component/g-button/

* 框架文档：http://open.ywtbsupappw.sh.gov.cn/resource/mini-program/gsd-anim/mp-anim/

## 目录结构

目录作为参考，具体以实际为准

```python
├── REAMDE.md #文档
├── app.js #应用入口，会挂载很多全局函数和数据
├── app.json
├── app.wxss
├── components
│   ├── g-speech
│   ├── gsd-lib  #功能库
│   ├── gsd-mp-charts  #图表组件
│   ├── gsd-ui  #UI 组件
│   └── weui-miniprogram
├── config
│   └── index.js  #配置文件
├── images #图片
│   ├── diagnosis
│   └── home
├── miniprogram_npm
│   └── miniprogram-api-promise
├── node_modules
│   └── miniprogram-api-promise
├── package-lock.json
├── package.json
├── pages #页面列表
│   ├── buy #口罩预约购买
│   ├── car-code #交通卡口登记
│   ├── diagnosis #免费问诊
│   ├── donate #物资捐赠
│   ├── index #首页
│   ├── mine #个人中心
│   ├── msg
│   ├── report #自主申报/线索上报
│   └── stat ##(弃用-广州版首页/数据面板页)
├── packages #页面列表
│   ├── health-code #健康码
│   ├── enterprise #企业复工
├── project.config.json
├── services #接口
│   ├── buy.js
│   ├── index.js
│   ├── region.js
│   └── report.js
├── sitemap.json
├── store #全局数据
│   ├── config.js #口罩文案
│   ├── mine.js #代办
│   └── user.js #用户属性
└── utils
    ├── request.js #请求
    ├── session.js #Session
    ├── util.js #功能库
    └── wx-promise.js
```

## 配置文件

配置文件在 /config/index.js，里面会有我们的配置信息。

```python
cityCode       #城市码 -- 6位
regionCode     #城市行政区码 -- 12位  
cityName       #城市名
cityShortName  #城市简称
env            #影响到请求的域名 dev/prod 
domain         #请求的域名
buyDomain      #预约口罩的域名（和上面的域名可能不一致）
pharmacyPath   #获取药店列表的 JSON 地址（挂到 CDN 上的）
wllConfigPath  #动态配置文件的 JSON 地址（挂到 CDN 上的）
carCodePath    #卡口API的访问路径
healthCodePath #健康码API的访问路径
appid          #后台需要的应用名（不是小程序的 APPID）
cdnDomain      #CDN 域名（静态文件）
regionLevel    #领导视图区划各级的标题名
``` 
注意:
注意:
1. appid: 替换为后台需要的应用名
2. pharmacyPath:后台提供药店列表 JSON 数据的CDN地址
3. regionPath:后端提供区划的 JSON 数据的CDN地址
4. wllConfigPath:动态配置文件的 JSON 数据的CDN地址
5. wenzhenPath:问诊医院的的 JSON 数据的CDN地址

动态配置文件：示例文件 (https://imgcache.gzonline.gov.cn/cloudsa3/wyj/ypgg_data_prd2020013101.json), 可以直接上传或自定义修改后上传

药店列表文件：示例文件 (https://imgcache.gzonline.gov.cn/cloudsa3/wyj/wll_mp_prod_config.json), 该链接为广州市数据,仅作参考,对接地市的数据需要后端提供

对接地市(当地)的区划文件：示例文件 (https://imgcache.gzonline.gov.cn/cloudsa3/uc/gz202020201.json), 该链接为广州市数据,仅作参考,对接地市的数据需要后端提供

问诊医院列表文件：示例文件 (https://imgcache.gzonline.gov.cn/cloudsa3/wenzhen/config/entry.json)

## APP 挂载的函数  

在app.js中,提供全局函数和数据,可使用 getApp().*** 获取.

```python
utils          #提供一些常用函数(常用)
request        #请求封装(常用)
config         #获取config中的配置参数(常用)
dayjs          #day.js时间日期处理库(常用)
Storage        #storage处理
wxp            #promise封装(常用)
Anim           #Anim 小程序开发框架(常用) http://open.ywtbsupappw.sh.gov.cn/resource/mini-program/gsd-anim/mp-anim/
Event          #事件封装(常用)
resetTab       #挂载重置 tab 的事件
userStore      #用户信息(常用) 基于Wedux的全局状态管理 http://open.ywtbsupappw.sh.gov.cn/resource/mini-program/sdk/wedux/
```

使用如下

```js
// 网络请求
getApp().request({ url }).then()
// 获取 config.js 配置
getApp().config.cityName
// 部分工具库函数
getApp().utils.debounce()
getApp().utils.urlJoinParams()
```

更多工具函数，请[查看文档](http://open.ywtbsupappw.sh.gov.cn/resource/mini-program/sdk/utils/)。（注意调用方式，以该文档为准）

## 全局用户数据

userStore 用户信息全局状态管理 文件位于 /store/user.js 提供如下方法: 获取用户信息fetchUserInfo()、更新用户信息updateUserInfo()、校验用户是否登录checkAuth()。

userStore 已经挂载到 app 上，使用时只需通过 getApp() 获取即可。
```js
const { userStore } = getApp()

Anim.Page({
  store: (store) => ({
    userInfo: store.user.userInfo
  }),
  onLoad() {
    console.log('用户信息', this.data.userInfo)
  }
})
```        
## 跳转 web-view

### 文件位于 /utils/util.js, navigateToWebview(url)方法,使用方式
 
示例: 页面.wxml

```html
      <view class="access-box" bind:tap="navigateToWebview" data-url="https://vp.fact.qq.com/home?ADTAG=szhz">
      <view class="img">
        <image src="/images/home/icon_news2@2x.png"></image>
      </view>
      <view class="right-content">
        <view class="title">疫情辟谣</view>
        <view class="desc">为您科学分析，认真求证疫情资讯，做到疫情鉴真全面辟谣，让真想跑赢谣言</view>
      </view>
    </view>
```

  页面逻辑.js

```js
      const { navigateToWebview } = require('../../utils/util')
      navigateToWebview(e) {
        console.log('e', e)
        const { url } = e.currentTarget.dataset
        navigateToWebview(url)
      },
```

注意: 跳转页面必须为 https ,在微信开发者后台 /mp.weixin.qq.com , 配置“开发/开发设置/业务域名”

## 口罩预约说明

口罩预约会读取cdn文件（开发：https://imgcache.gzonline.gov.cn/cloudsa3/wyj/wll_mp_dev_config.json，生产：https://imgcache.gzonline.gov.cn/cloudsa3/wyj/wll_mp_prod_config
.json）中的配置信息做控制，读取的逻辑在store/config.js中，下面是配置信息中的字段说明

```
{
  "buy_type": "lot", // 口罩购买方式:lot(摇号)、preorder(抢购)
  "feedback_open": 1, // 个人中心的帮助和反馈开关 1：开 0:关
  "buy_feedback_open": 1, // 口罩预约的帮助和反馈开关 1：开 0:关
  // 我的-->我的预约入口配置
  "personal_center_info": {
    "is_open": 1, // 是否开启，1：是 0：否
    // 关闭的提示文案
    "tips": "结果将在每晚8点提交预约申请后显示，可能稍有延迟，请耐心等候。"
  },
  // 首页提示配置
  "home_notice": {
    "is_open": 1, // 是否开启，1：是 0：否
    "title": "重要通知",// 标题
    // 内容
    "text": "尊敬的广州市民以及来穗的朋友：目前，正值防控新型肺炎的关键时期，请大家齐心协力、共克时艰，通过“穗康”微信小程序主动申报离（返）穗情况和健康状况，我们将对主动申报14天之内来自湖北或曾到过湖北（现已返穗）并有发热等相关症状（经排查核实的）的人员，配备“五个一”（一支温度计、一打口罩、一个表格、一支笔、一份宣传册）。感谢您的积极配合，祝您身体健康，家庭幸福！",
    "duration": 60 // 持续时间秒
  },
  // 口罩预约流程中的配置
  "buy_flow_info": {
    "is_open": 1, // // 是否开启，1：是 0：否
    "start_time": "20:00", // 开启时间，晚上8点，支持输入小时或者小时和分钟例如20，20:30
    "end_time": "23:00", // 结束时间，晚上23点，支持输入小时或者小时和分钟例如23，23:30
    // 预约结束，提示文案
    "oveTips": "本轮预约已结束，每晚8点开始新一轮预约，我们在努力筹集口罩资源，尽最大努力满足您的需要。",
    // 预约入口关闭提示文案
    "closeTips": "系统异常，请稍后再试。",
    // 口罩已被预约完结果页的提示文案
    "sellOutTips": "别着急，明晚8点可再次预约。我们一直在努力筹集口罩货源，尽最大努力护您周全",
    "isNeedReport": 1, // 是否开启自查上报，1：是 0：否
    // 开启的自查上报时的提示文案
    "needReportTips": "为确保能及时了解您的健康情况，预约购买口罩前须先填写健康自查上报表，请点击“确认”进行填写。",
    // 中签概率
    "probability": 100,
    // 模版消息id列表
    "tmplIds": ["kROFAr3lqfJVmdgB2jDS6DQhVTnePC6y-k-c9GiMSiA"],
    // 是否让用户订阅消息 1：是 0：否
    "is_need_subscribe_message": 0,
    // 口罩购买说明规则
    "desc": [
      "为满足广州市民购买口罩的需要，我们联合了广药集团为广大群众提供线上预约购买及配送服务。",
      "系统试运行阶段，特制定以下规则："
    ],
    // 规则列表
    "attention": [
      "系统试运行时间调整为2020年1月31日~2020年2月5日，每天晚上8点开始，市民可预约第二天的口罩。",
      "系统试运行阶段，凡预约成功的市民口罩均免费，且享受免费送货上门的服务（仅限于广州市内）。",
      "每人每天最多可预约5个口罩，预约将以提交申请的先后次序排序，先到先得。如果当日未能预约成功，可于次日晚8点再次预约。",
      "请注意：“预约登记完成”不等于“预约成功”，预约结果请前往“个人中心——我的预约”中查看，试运行阶段可能稍有延迟，请耐心等候，感谢您的谅解。",
      "为确保及时了解您的健康情况，预约前须先进行健康资料录入。建议提前填写，以免错过预约最佳时机。",
      "试运行阶段结束后具体预约规则将另行通知。"
    ],
    "interval_day": 0, // 多少天后才能再次预约
    // 已经预约，多少天内再次预约不允许预约的提示文案
    "unCanOrderText": "您的预约申请我们已经收到，请勿重复提交。结果可在“个人中心—我的预约”中查看。"
  },
  // 口罩摇号配置
  "lot_flow_info": {
    "is_open": 1, // // 是否开启，1：是 0：否
    "start_time": "00:00", // 开启时间，支持输入小时或者小时和分钟例如20，20:30
    "end_time": "24:00", // 结束时间，支持输入小时或者小时和分钟例如23，23:30
    // 预约结束，提示文案
    "oveTips": "本轮预约已结束，每晚8点开始新一轮预约，我们在努力筹集口罩资源，尽最大努力满足您的需要。",
    // 预约入口关闭提示文案
    "closeTips": "系统异常，请稍后再试。",
    // 口罩已被预约完结果页的提示文案
    "sellOutTips": "别着急，明晚8点可再次预约。我们一直在努力筹集口罩货源，尽最大努力护您周全",
    "isNeedReport": 1, // 是否开启自查上报，1：是 0：否
    // 开启的自查上报时的提示文案
    "needReportTips": "为确保能及时了解您的健康情况，预约购买口罩前须先填写健康自查上报表，请点击“确认”进行填写。",
    // 中签概率
    "probability": 100,
    // 模版消息id列表
    "tmplIds": ["kROFAr3lqfJVmdgB2jDS6DQhVTnePC6y-k-c9GiMSiA"],
    // 是否让用户订阅消息 1：是 0：否
    "is_need_subscribe_message": 0,
    // 口罩购买说明规则
    "desc": [
      "为满足广州市民购买口罩的需要，我们联合了广药集团为广大群众提供线上预约购买及配送服务。",
      "系统试运行阶段，特制定以下规则："
    ],
    // 规则列表
    "attention": [
      "系统试运行时间调整为2020年1月31日~2020年2月5日，每天晚上8点开始，市民可预约第二天的口罩。",
      "系统试运行阶段，凡预约成功的市民口罩均免费，且享受免费送货上门的服务（仅限于广州市内）。",
      "每人每天最多可预约5个口罩，预约将以提交申请的先后次序排序，先到先得。如果当日未能预约成功，可于次日晚8点再次预约。",
      "请注意：“预约登记完成”不等于“预约成功”，预约结果请前往“个人中心——我的预约”中查看，试运行阶段可能稍有延迟，请耐心等候，感谢您的谅解。",
      "为确保及时了解您的健康情况，预约前须先进行健康资料录入。建议提前填写，以免错过预约最佳时机。",
      "试运行阶段结束后具体预约规则将另行通知。"
    ],
    "interval_day": 10, // 多少天后才能再次预约
    // 已经预约，多少天内再次预约不允许预约的提示文案
    "unCanOrderText": "您的预约申请我们已经收到，请勿重复提交。结果可在“个人中心—我的预约”中查看。",
    "lot_time": "18:00", // 每天摇号出结果的时间
    "lotDelayTips": "数据更新可能稍有延迟，请耐心等候。", // 我的预约列表的顶部tips文案，如果为空则不会出现这个文案
    "express_text": "加包装物流费6元",// 预约表单快递到家的文案
    // 查看历史抢购记录按钮
    "preorderBth": {
      "isShow": 1,// 是否开启，1：是 0：否
      "text": "查看02月15日抢购预约记录" // 按钮文案
    },
    // 摇号通知结果
		"result_notice": {
      "is_open": 1, // 是否开启，1：是 0：否
      "title": "2月18日口罩摇号预约公示", // 弹窗标题
      "short_desc": "2月18日口罩摇号预约公示", // 页面公告简短内容
      // 弹窗内容
      "content": "1、2020年2月18日，在“穗康”小程序上登记且符合摇号资质合计2,443,105人。\n2、经过组织货源，可预约口罩1,436,000只。其中1,000,000只提供给“穗康”小程序用于今天下午3点预约摇号。另436,000只口罩用于大参林和采芝林自行预约。",
      "version": "1" // 版本号，每次更新需要+1
    },    
    // 摇号预约成功结果页文案
    "rgisterSuccessText": "本次预约10天内有效。2月17日起，每天18：00左右系统公布随机摇号中签名单，请耐心等候。"
  }
}
``` 
注意：

1. 开抢20分钟之前如果药店数据有更新要及时去更新cdn、和关闭我的预约入口（修改配置）

2. 后端确定预约数据处理完以后打开预约入口（修改配置）

## 健康码说明

### 我的健康码

当前小程序健康码，包含以下内容：

* 我的健康码--轮播
* 我的健康码--管理
* 我的健康码--添加
* 我的健康码--解绑
* 我的健康码--上报之后生成健康码
* ......

#### 目录结构

目录作为参考，具体以实际为准

```python
├──packages
│ ├── health-code 
│    ├── pages #页面列表
│    	 ├── report-health #健康码页面
│  	   ├── manage-code #健康码管理（添加，解绑）
│    ├── services #接口服务
│   	 ├── health-code.js #健康码等API接口
├──pages
│ ├── report
│    ├── msg #上报成功查看健康码页面
```


#### 接口说明

健康码相关接口文件位于 packages/health-code/services/health-code.js 提供如下方法: 

1. 获取用户以及关联用户: getRelationStateByUser()
2. 获取当前切换点的用户的通行记录： passRegisterList()
3. 获取当前用户关联用户的健康码列表： getCodeUserList()
4. 添加关联用户的健康码： saveCodeUser()
5. 解除关联用户的健康码： removeCodeUser()
6. 获取七天内上传过的用户列表： canSaveUserList()
7. 根据健康码信息查询codeId： getUserCodeId()


### 高级工作台

当前小程序社区工作台，包含以下模块

* 网格人员授权管理
* 采集点管理
* 通行验证
* 健康码验证


#### Packages目录结构

目录作为参考，具体以实际为准

```python
├── health-code 
│   ├── pages #页面列表
│   	├── new-workbench #社区工作台
│  		├── verification #通行验证
│   	├── add-person #采集员授权管理
|       ├── collection-point #切换采集点
|		├── collection-point-manage #采集点管理（网格员）
├		├── admin-grid #采集点管理（网格管理员）
		├── inputcode #健康码验证
│   ├── services #接口服务
│   	├── health-code.js #相关API接口
```

#### 接口说明

相关接口文件位于 packages/health-code/services/health-code.js，使用方法如下
```js
const { userStore } = getApp()
const reportHealth = require('../../services/health-code.js');
Anim.Page({
  store: (store) => ({
    userInfo: store.user.userInfo
  }),
  onLoad() {
    console.log('用户信息', this.data.userInfo)
	//获取用户角色
	 reportHealth.getloginuserinfo( ).then((res) => {
		 console.log('用户角色', res.role)
	 }))
  }
}
```  
#### 页面说明

##### 社区工作台
 需要先获取用户的角色，根据角色进行显示不同的入口
示例:  
```js
  //获取用户角色
   reportHealth.getloginuserinfo( ).then((res) => {
  	 console.log('用户角色', res.role)
   }))
```

注意: role值有：GRID_USER网格人员，GRID_MANAGER网格管理员
网格管理员需要显示 '采集员授权管理'

 ##### 通行验证
```js
 onLoad: function (options) {
   console.log('options', options)
   this.data.codeId = options.codId
   this.data.gridPointId = options.gridPointId
   }
```
 注意:进入这个页面需要传入codId（扫描二维码获取的），和当前用户所在的网格点gridPointId
  
##### 采集员授权管理
示例:  

```js
  onLoad: function (options) {
    console.log('options', options)
    this.data.userId = options.uid;
	}
	 reportHealth.getAdmanageId(this.data.userId).then(res => {
	        this.data.manageId = res.id;
			})
	//添加授权
    reportHealth.saveManagePerson({
      'userId': userId,//被授权人员uid
      "manageId": manageId//管理员id
    }).then((result) => {
      wx.showToast({
        title: '添加成功',
      })
    }
```

注意: 需要传入用户的uid，再获取管理员的id


##### 切换采集点 
示例:  

```js
       if (this.data.isGly) {
         //管理员
         this.chooseGLy()
       } else {
         //采集员
         this.chooseCjy()
       }
	   
	   //选择确定后需要持久化数据
	     wx.setStorageSync('gridPointId', pointId);//网格点id
	     wx.setStorageSync('address', address)//网格点名称
```

注意:需要传入是否管理员字段isGly，再根据权限加载不同的采集点列表，确定后

##### 采集点管理（网格管理人员）
示例:  

```js
  onLoad: function (options) {
     
      this.data.uid = options.uid
    	reportHealth.getGridPoint( ).then(res => {},error=>())
    },
 
```
  注意：需要传入用户的uid再获取采集点列表
 
##### 采集点管理（网格管理员）
示例:  

```js
 onLoad: function (options) {
    
     this.data.uid = options.uid
	reportHealth.getAdmanageId(uid).then(res => {},error=>())
   },
```
 注意：需要传入用户的uid再获取管理员信息
 
##### 健康码验证 
示例:  

```js
  onLoad: function (options) {
     this.data.gridPointId = options.gridPointId
     this.data.uid = options.uid
   },
```
注意：需要传入用户的uid和当前的网格点gridPointId


 
### 实名认证文档

当前小程序实名认证，包含以下三个页面模块

* 实名资料提交
* 实名信息查看
* 实名信息变更


#### Packages目录结构

目录作为参考，具体以实际为准

```python
├── health-code 
│   ├── pages #页面列表
│   	├── realname-submit #实名信息提交
│  		├── realname-info #实名信息查看
│   	├── realname-change #实名信息变更
│   ├── services #接口服务
│   	├── health-code.js #实名认证等API接口
```

#### 接口说明

实名相关接口文件位于 packages/health-code/services/health-code.js 提供如下方法: 获取用户实名信息 realnameUser()、保存用户实名信息 realnameSave()、微信授权码提交验证 wxAut()、微信授权码获取authindexPara()
```js
const { userStore } = getApp()
const reportHealth = require('../../services/health-code.js');
Anim.Page({
  store: (store) => ({
    userInfo: store.user.userInfo
  }),
  onLoad() {
    console.log('用户信息', this.data.userInfo)
	//获取用户实名信息
	 reportHealth.realnameUser(this.data.userInfo.uid).then((res) => {
		 console.log('用户实名信息', res)
	 }))
  }
}
```  
#### 常用方法

##### 判断是否实名
 
示例:  
```js
      reportHealth.realnameUser(uid).then((res) => {
           this.data.isRealName = (res.isAut == 1 || res.isAut == 2)
		}
      
```

注意: isAut值有：0未实名，1已知名，2已变更，3实名已过期

##### 获取实名信息
示例:  

```js
      reportHealth.realnameUser(uid).then((res) => {
           this.data.isRealName = (res.isAut == 1 || res.isAut == 2){
			   	 console.log('用户实名信息', res.realnameAut)
		   }
		}
      
```

注意: isAut值为0未实名时，无法获取realnameAut实名信息

##### 保存(变更)实名信息
示例:  

```js
     let value = {
         "identity": data.identity,//证件号码
         "identityType": data.identityType,//证件类型
         "name": data.username,//姓名
         "phone": this.data.userInfo.phone//手机号
       };

       reportHealth.realnameSave(value).then(res => {
		   	 console.log('用户实名信息保存成功' )
	   },error=>{
		   console.log('用户实名信息保存失败' )
	   })
      
```

注意: 证件号为1身份证类型需要先调用微信实名认证判断是否本人


##### 微信身份证实名授权码认证
示例:  

```js
  let value = {
      "identity": data.identity,
      "identityType": data.identityType,
      "name": data.username,
      "phone": this.data.userInfo.phone
    };
    reportHealth.wxAut('微信授权码', value).then(res => {
			 console.log('微信授权码实名认证结果',res )
	})
      
```

注意:   verify_openid='V_OP_NM_MA'用户与姓名匹配,verify_real_name == 'V_NM_ID_MA'姓名与证件号匹配
 
## 交通卡口登记说明
交通卡口登记分为五个子模块  
私家车  
大巴/中巴  
高铁/动车/火车/飞机/轮渡  
货车  
其他  

```python
├── pages #页面列表
│   ├── car-code #口罩预约购买
│   │   ├── bus-code #大巴/中巴页面
│   │   ├── code-detail #私家车/货车/其他详情页面
│   │   ├── code-edit #私家车/货车/其他编辑页面
│   │   ├── code-manage #卡口首页
│   │   ├── pub-tran-code #公共交通工具
│   │   ├── submit-success #提交成功
│   │   ├── traffic-police #交警端
├── service #接口
│   ├── car-code #交通卡口登记
│   ├── bus-code-driver.js #大巴司机接口
│   ├── code-detail.js #私家车详情接口
│   ├── code-edit.js #私家车编辑接口
│   ├── main-page.js #卡口首页接口
│   ├── passenger.js #大巴乘客接口
│   ├── pub-tran.js #公共交通工具接口
│   └── traffic-police.js #交警接口
```

### 需要修改的文件
config/index.js  

```js
module.exports = {
  	dev: {
		cardCodePath: 'https://wll-dev.govcloud.tencent.com/traffic-gate-es',
		healthCodePath1: 'https://wll-dev.govcloud.tencent.com/prominent-citizens',
		healthCodePath: 'https://wll-dev.govcloud.tencent.com/prominent-citizens'
	}
}
```

pages/stat/index.wxml  
添加在`疫情线索上报`后
```html
	    <view class="access-box" hover-class="access-box--hover" bind:tap="onTapAccess" data-url="/pages/car-code/code-manage/index">
				<view class="img">
					<image src="https://imgcache.gzonline.gov.cn/cos/traffic@2x_790da30a.png"></image>
				</view>
				<view class="right-content">
					<view class="title">交通卡口登记</view>
					<view class="desc">广东各个交通卡口检疫站申报登记</view>
				</view>
			</view>
```

### 需要注意的点
1. 目前私家车/货车/其他这三个分类的需求是相同的，所以这三个分类复用了相同的页面
1. 公共交通工具公共交通工具与私家车只有编辑页面不同，所以复用了编辑页面之外的其他页面
1. 根目录下的images下的图片由于代码拆包之后不会提示包过大，所以部分图片暂时存放于本地


## 其他提示

* 小程序有大小限制，建议图片都通过 tinypng 压缩后，再上传到 CDN 上使用。
* 涉及到经常需要修改的通知文案等，请通过动态配置下发实现。
* 自行准备 CDN 机器。
* 自行申请小程序 APPID。
* 小程序开发后台添加开发域名 / CDN 域名 / 业务域名
* CDN 的刷新，更新文件，上传到 CDN 后，记得刷新cdn内容到最新的
* 目前小程序中图片资源保存在本地 /images/home 文件夹, 后续如果遇到项目代码包过大无法上传，可将图片上传到 CDN 来节省空间

## 常见问题

【腾讯文档】微信支付实名验证文档
[微信支付实名验证](https://pay.weixin.qq.com/wiki/doc/api/realnameauth.php?chapter=60_2&index=3)

【腾讯文档】微应急小程序常见问题
https://docs.qq.com/doc/DWVVOYVJDd2d5YXZK

【腾讯文档】应急小程序标准版指引（2.2.x）
https://docs.qq.com/doc/DU2d2SmFuakhyWmlI

小程序分包使用文档,https://developers.weixin.qq.com/miniprogram/dev/framework/subpackages/basic.html，


