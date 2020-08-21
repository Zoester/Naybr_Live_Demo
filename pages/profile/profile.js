// pages/profile/profile.js
const app = getApp()

Page({
  data: {
    welcome_text: 'Prepare your ears. Welcome to Music Box',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    cards: [],
    bookmarks:[], 
    tabView: "Attendee",
    active: 0
  },

  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

    //Show Events filtered by "Attendee" / "Organiser"
  goToTab: function (event) {
    console.log(event)
    this.setData({
      tabView: event.detail.title,
    })
  },
 toProductCard(event){
  console.log("event", event)
  let data = event.currentTarget.dataset
  let id = data.id
  console.log("id", id)
  wx.navigateTo({
    url: `/pages/show/show?id=${id}`
  })
},

   //DELETE FUNCTIONS

     // BOOKMARKS UNSAVE
  deleteBookmark(event) {
    let data = event.currentTarget.dataset
    let id = data.id
    console.log("id", id)
    let Bookmark = new wx.BaaS.TableObject('cart')
    Bookmark.delete(id).then(res => {
      const newBookmarks = this.data.bookmarks;
      // console.log("res data in deletebookmark", res.data)
      const result = newBookmarks.filter(function(value, index, arr){ return id != value.id})
      this.setData({
        bookmarks: result
      })  
      wx.showToast({
        title: 'Deleted!',
        icon: 'success',
        duration: 4000,
        mask: true,
      })
      
      // success
    }, err => {
      // err
    })
  },

     // EVENTS DELETE
     deleteEvent(event) {
      let data = event.currentTarget.dataset
      let id = data.id
      console.log("id", id)
      let Product = new wx.BaaS.TableObject('productCard')
      Product.delete(id).then(res => {
        const newProducts = this.data.cards;
        // console.log("res data in deletebookmark", res.data)
        const result = newProducts.filter(function(value, index, arr){ return id != value.id})
        this.setData({
          cards: result
        })  
        wx.showToast({
          title: 'Deleted!',
          icon: 'success',
          duration: 4000,
          mask: true,
        });
        // success
      }, err => {
        // err
      })
    },
    //tab can't pass any option
    onShow: function() {
      this.onLoad()
      if (getApp().globalData.profileToTabTwo){
        
        this.setData({
          tabView: 'Organiser',
          active: 1
        })
        getApp().globalData.profileToTabTwo = false
      } 
    },
  onLoad: function (options) {
    console.log("checking if tab has options", options)
    wx.getUserInfo({
      success: (res)=>{
        console.log(res)
        this.setData({
          userInfoFrontend: res.userInfo
        })
      }
    })
    this.setData({
      showLoginBtn: app.globalData.showLoginBtn,
      userInfo: wx.getStorageSync('userInfo')
    })
    wx.BaaS.auth.getCurrentUser().then(user => {
      // user 为 currentUser 对象
    const Bookmarks = new wx.BaaS.TableObject('cart')
    let bmQuery = new wx.BaaS.Query();

    // SHOW BOOKMARKS FOR SPECIFIC USER "ATTENDEE"
    // NEW order with EXPAND will go to table & id 
    console.log("id", user.id)
    bmQuery.compare('user_id', '=', user.id);
    Bookmarks.setQuery(bmQuery).expand(['card_id']).orderBy('-created_at').find().then((res) => {
      console.log("checking if cart works", res)
      this.setData({
        bookmarks: res.data.objects,
      })
    })
    // SHOW EVENT CREATED BY SPECIFIC USER "ORGANISER"
    let tableName = 'productCard'
    let pcQuery = new wx.BaaS.Query()
    pcQuery.compare('created_by', '=', user.id);
    let Cards = new wx.BaaS.TableObject(tableName)
    Cards.setQuery(pcQuery).orderBy('-created_at').find().then((res) => {
      console.log("res data objects inside orgnizer",res.data.objects);
      this.setData({
        cards: res.data.objects
      })
    })

    console.log("user in Onload at first", user)
    this.setData({ currentUser: user })
    
    }, error => {
      console.log(error)
      this.setData({ currentUser: null })
      wx.switchTab({
        url: '/pages/profile/profile' // log in
      });
    })
    // console.log("this.globalData.userInfo", this.globalData.userInfo)

    // options is just parameter you use for all the results

  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  userInfoHandler(data) {
    wx.BaaS.auth.loginWithWechat(data).then(user => {
      // if not set to app.globalData.userIndo, then other Page data currentUser won't have access to the global data
      app.globalData.userInfo = user
      console.log("user info", user);
      this.setData({
        userInfo: user,
        showLoginBtn: false
      })
    }, err => {
    })
  },
})
