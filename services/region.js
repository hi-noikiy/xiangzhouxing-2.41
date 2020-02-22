const {
  request,
  config,
  wxp
} = getApp()

function fetchRegionSource() {
  return wxp.request({
    url: `${config.cdnDomain}${config[config.env].regionPath}?t=${Date.now()}`
  }).then(resp => {
    const currentRegionSource = resp.data[0].regionList[0].regionList
    getApp().currentRegionSource = currentRegionSource
    return currentRegionSource
  })
}

exports.getRegionData = function (regionCode, regionList) {
  regionList = regionList || getApp().currentRegionSource

  let promise = Promise.resolve(regionList)
  if (!regionList) {
    promise = fetchRegionSource()
  }


  promise.then(regionData => {
    const region = regionData.find(item => item.regionCode === regionCode)
    return (region && region.regionList) || []
  })

  return promise
}