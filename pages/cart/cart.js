// pages/restaurant/detail.js
const app = getApp(); // always get data via app

Page({

  /**
   * Page initial data
   */
  data: {
    currentUser:{},
    allCard:{},
    productcard:{},
    desc:{},
    reviews:[],
    bookmarks:[]
    
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    wx.BaaS.auth.getCurrentUser().then(user => {
      // user 为 currentUser 对象
    const Bookmarks = new wx.BaaS.TableObject('cart')
    let query = new wx.BaaS.Query();

    console.log("id", user.id)
    query.compare('user_id', '=', user.id);
 
    // NEW order with EXPAND will go to table & id 
    Bookmarks.setQuery(query).expand(['card_id']).find().then((res) => {
      console.log("checking if cart works", res)
      this.setData({
        bookmarks: res.data.objects,
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
  
  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {
  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {
    this.onLoad()
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
