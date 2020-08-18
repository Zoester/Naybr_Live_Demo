// pages/map/map.js
const app = getApp()
Page({

  /**
   * Page initial data
   */
  data: {
    events:[],
    markers: [{
    }],
    userLongitude:'121.446648',
    userLatitude:'31.218967'
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    let Cards = new wx.BaaS.TableObject('productCard')
    // 1- 100 is offset 0
    Cards.limit(100).offset(0).find().then((res) => {
      console.log('card content', res.data.objects);
      let markers = res.data.objects.map((event, index) => {
          return {
            latitude:event.latitude,
            longitude:event.longitude,
            id: event.id,
            height: 50,
            width: 50,
            iconPath: "../images/Home.png"
          }
      }).filter((event)=>{
        return event.latitude && event.longitude
      })
      console.log('marker',markers)
      this.setData({
        events: res.data.objects,
        markers
      })
    })

    this.getLocation();
  
  },

  getLocation: function() {
    wx.getLocation({
      type: 'wgs84',
      success (res) {
        const latitude = res.latitude
        const longitude = res.longitude
        const speed = res.speed
        const accuracy = res.accuracy
        this.setData({
          userLongitude: longitude,
          userLatitude: latitude
        })
      }
     })
  },
  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  }
})