//index.js

const moment = require("moment")

//获取应用实例
const app = getApp()
const genre = ['Blues & Jazz', 'Classical', 'Country', 'EDM','Folk & Indie', 'Hip-hop', 'Reggae', 'Rock', 'Latin', 'Pop','Soul','Funk']

Page({
  data: {
    //cards: [],
    events:[],
    genre: ['All','Blues & Jazz', 'Classical', 'Country', 'EDM','Folk & Indie', 'Hip-hop', 'Reggae', 'Rock', 'Latin', 'Pop','Soul','Funk'],
    map:false,
    markers: [{}],
    userLongitude:'121.446648',
    userLatitude:'31.218967',
  },

  toProductCard(event){
    let data = event.currentTarget.dataset
    console.log('event', event)
    let id = data.id || event.markerId;
    console.log("id", id)
    wx.navigateTo({
      url: `/pages/show/show?id=${id}`
    })
  },
  
  onLoad: function () {
    let that = this
    let tableName = 'productCard'
    
    let Cards = new wx.BaaS.TableObject(tableName)
  //   let queryTime = new wx.BaaS.Query(tableName)
  //   // queryTime.compare('startTime', '>', now)

  //   Cards.setQuery(queryTime).find().then((res)=>{
  //   console.log('eventNow',res)
  //   that.setData({
  //     eventNow: res.data.objects,
  //   })
  // })



  Cards.limit(100).offset(0).find().then((res) => {
    console.log('card content', res.data.objects);
    const filteredEvents = this.filterExpiredEvents(res.data.objects);

    let markers = filteredEvents.map((event, index) => {
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
    console.log('res',res)

    this.setData({
      events: filteredEvents,
      markers,
    })
  })
},

filterExpiredEvents: function(allEvents) {
  let now = new Date();
  const filteredEvents = allEvents.filter((event) => {
    if(!event.startTime) return false;

    if(new Date(event.startTime).getTime() < now.getTime() + 1800000) {
      return false;
    }
    return true;
  }).map(event => {
    return {
      ...event,
      startTime: moment(event.startTime).format("YYYY-MM-DD hh:mm")
    }
  });

  // return filtered events
  return filteredEvents;
},

//filter by time, show events happening within an hour
//     eventNow: function(e){
//       let tableName = 'productCard'
//       let Cards = new wx.BaaS.TableObject(tableName)
//       let queryTime = new wx.BaaS.Query(tableName)
//       queryTime.compare('startTime', '=', options.id);
//       Cards.setQuery(queryTime).find().then((res)=>{
//       console.log('eventNow',res)
//       this.setData({
//       eventNow: res.data.objects,
//     })
//   })
// },

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
      const filteredEvents = this.filterExpiredEvents(res.data.objects);

      this.setData({
        events: filteredEvents
      })
    })
  }



})