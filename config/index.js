//珠海
module.exports = {
    regionCode: '440400000000', // #城市行政区码 -- 12位  用于获取疫情详情统计数据 
    cityCode: '440400', // #城市码 -- 6位
    wllConfigCacheTime: 10 * 60,// 配置信息缓存时间，10分钟
    provinceName: '广东省', // 省名称
    cityName: '珠海市', // #城市名
    cityShortName: '珠', // #城市简称 深/穗/佛
    env: 'dev', // #影响到请求的域名 dev、prod 对应下面的配置 
    domain: 'https://xzx.zhxz.cn', // #请求的域名
    dev: {
        pharmacyPath: '/cloudsa3/wyj/ypgg_data_prd2020013101.json', // #获取药店列表的 JSON 地址 (挂到 CDN 上的)
        buyDomain: 'https://skyy-dev.gzonline.gov.cn', // #预约口罩的域名 (和上面的域名可能不一致)
        wllConfigPath: '/cloudsa3/wyj/wll_mp_dev_config.json', // #动态配置文件的 JSON 地址 (挂到 CDN 上的)
        regionPath: '/zhxz20200220.json', // #区划信息的 JSON 地址 (挂到 CDN 上的)
        wenzhenPath: '/cloudsa3/wenzhen/config/entry.json', // #问诊医院的 JSON 地址 (挂到 CDN 上的)
        carCodePath: '/traffic-gate-es',
        healthCodePath: '/prominent-citizens',
        realNameSetting: 'city' //实名认证配置 city城市服务，wx微信支付
    },
    prod: {
        pharmacyPath: '/cloudsa3/wyj/ypgg_data_prd2020013101.json',
        buyDomain: 'https://skyy.gzonline.gov.cn',
        wllConfigPath: '/cloudsa3/wyj/wll_mp_prod_config.json',
        regionPath: '/cloudsa3/uc/gz202020201.json',
        wenzhenPath: '/cloudsa3/wenzhen/config/entry.json',
        carCodePath: '/traffic-gate-es',
        healthCodePath: '/prominent-citizens',
        realNameSetting: 'city' //实名认证配置 city城市服务，wx微信支付
    },
    cdnDomain: 'https://weiyingji-1301260865.cos.ap-chengdu.myqcloud.com', // #CDN域名 (静态文件)
    appid: 'microService-GUANGZHOU', // #后台需要的应用名 (不是小程序的APPID)
    // 区划层级描述 --- 用于区划级联选择器
    regionLevel: [{
            title: '市',
        },
        {
            title: '区',
        }
    ],
  }
