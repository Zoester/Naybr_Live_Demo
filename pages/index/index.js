//index.js
//获取应用实例
const app = getApp()
const genre = ['Blues & Jazz', 'Classical', 'Country', 'EDM','Folk & Indie', 'Hip-hop', 'Reggae', 'Rock', 'Latin', 'Pop']

Page({
  data: {
    //cards: [],
    events:[],
    genre: ['All','Blues & Jazz', 'Classical', 'Country', 'EDM','Folk & Indie', 'Hip-hop', 'Reggae', 'Rock', 'Latin', 'Pop'],
    map:false,
    markers: [{}],
    userLongitude:'121.446648',
    userLatitude:'31.218967'
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
    let tableName = 'productCard'
    let Cards = new wx.BaaS.TableObject(tableName)
    // 1- 100 is offset 0
  //   Cards.limit(100).offset(0).find().then((res) => {
  //     console.log('card content', res.data.objects);
  //     this.setData({
  //       events: res.data.objects
  //     })
  //   });
  // },
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
},


    //show map function bindtapped to button
    gotoMap:function(e){
      this.getLocation();
      this.setData({
        map: true

      })



    },

    gotoList:function(e){
      this.setData({
        map: false

      })
    },
      

    //getUser's current location
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

  //genre filter

  onShareAppMessage () {

  },

  selectGenre: function(e){
    let selectedGenre = e.currentTarget.dataset.genre
    let selectedGenreIndex = e.currentTarget.dataset.index
    this.setData({
      selectedGenre: selectedGenre,
      selectedGenreIndex: selectedGenreIndex
    })
    selectedGenre == 'All' ? this.onLoad() : this.searchGenre(selectedGenre)
  },

  searchGenre: function(selectedGenre){
    console.log("im here")
    let query = new wx.BaaS.Query()
    let tableName = 'productCard'
    let Cards = new wx.BaaS.TableObject(tableName)
    query.contains('genre', selectedGenre)
    console.log(selectedGenre)
    Cards.setQuery(query).find().then((res) => {
      console.log(res.data);
      this.setData({
        events: res.data.objects
      })
    })
  }



})