//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    cards: []
  
  },
  toProductCard(event){
    let data = event.currentTarget.dataset
    let id = data.id
    console.log("id", id)
    wx.navigateTo({
      url: `/pages/show/show?id=${id}`
    })
  },
  
  onLoad: function () {
    wx.getLocation({
      type: 'wgs84',
      success (res) {
        const latitude = res.latitude
        const longitude = res.longitude
        const speed = res.speed
        const accuracy = res.accuracy
        console.log("all location data",latitude, longitude, speed, accuracy)
      }
     })
    let tableName = 'productCard'
    let Cards = new wx.BaaS.TableObject(tableName)
    Cards.find().then((res) => {
      console.log(res.data.objects);
      this.setData({
        cards: res.data.objects
      })
    })
    
  },
  
})

