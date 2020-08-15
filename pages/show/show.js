// pages/show/show.js

const app = getApp();

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
    likes:null,
    bookmarks:[],
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {

    const ProductCard = new wx.BaaS.TableObject('productCard');
    const Reviews = new wx.BaaS.TableObject('review');

    Reviews.find().then((res)=>{
      console.log('reviewTable', res)
    })
   //show one event
    ProductCard.get(options.id).then((res)=>{
      console.log(res);
      this.setData({
        productcard: res.data,
        likes:res.data.likes
      })
    });
  //pull corresponding reviews
  let query = new wx.BaaS.Query();
  query.compare('product_id', '=', options.id);
  Reviews.setQuery(query).find().then((res)=>{
    console.log('queried object',res)
    this.setData({
      reviews: res.data.objects,
    })
  });
  let userInfo = wx.getStorageSync('userInfo')
  this.checkHasBookmarked(userInfo.id, options.id)
  },

  checkHasBookmarked: function(userId, eventId){
    let page = this
    console.log("checking", userId, eventId)
    const Cart = new wx.BaaS.TableObject('cart');

    // compare with user_id and card_id in Cart table and return a boolean to decide whether to show bookmark button
    let bmQuery1 = new wx.BaaS.Query();
    bmQuery1.compare('user_id','=', userId);
  
    let bmQuery2 = new wx.BaaS.Query();
    bmQuery2.compare('card_id', '=', eventId);
  
    // and 查询
    let andQuery = wx.BaaS.Query.and(bmQuery1, bmQuery2);
  
    Cart.setQuery(andQuery).find().then(res => {
      console.log("why i", res)
      page.setData({
        bookmarked: res.data.objects.length > 0
      })
    })
  },



    //create a new comment
  createReview:function(event){
    console.log('create review',event);
    const content = event.detail.value.content;
    console.log('clicked content', content);

    let Review = new wx.BaaS.TableObject('review');
    //create empty record locally
    let newReview = Review.create();
    console.log('what is data', this.data)
    //create data and then pass data inside local record
    const data = {
      product_id: this.options.id,
      reviews: content,
    }
    
    newReview.set(data);
    //record in BaaS
    newReview.save().then((res)=>{
      console.log('save res',res);
      const newReviews = this.data.reviews;
      newReviews.push(res.data);

      this.setData({
        reviews:newReviews,

      })
    }) 
  },

  //click heart to like
 voteUp(event){
    console.log('like',event)
    let likes = this.data.productcard.likes
    let cardLikes = new wx.BaaS.TableObject('productCard')
    let product = cardLikes.getWithoutData(event.currentTarget.dataset.id)
    console.log('productValue', product)
    product.set("likes", likes + 1).update().then((res)=>{
      console.log("res",res)
      this.setData({
        likes:res.data.likes
      })

    });
  },

  navigateToProfile(){
    wx.reLaunch({
      url: '/pages/profile/profile',
    })
  },

  addToBookmark(e){
    let page = this
    console.log('bookmark',e)
    let bookmark = new wx.BaaS.TableObject('cart')
    bookmark.find().then((res)=>{
      console.log('bookmarkTable', res)
      page.setData({
        bookmarks: res.data.objects,
      })
    })
    
    let newBookmark = bookmark.create();
    const data = {
      card_id: page.data.productcard.id,
      user_id:page.data.currentUser.id,
    }
    
    newBookmark.set(data);
    newBookmark.save().then((res)=>{
      console.log('save bookmarkres',res);
      const bookmarkArray = page.data.bookmarks;
      bookmarkArray.push(res.data);
      page.onLoad(page.options)
      page.setData({
        bookmarks:bookmarkArray,
      })
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
    // this excutes everytime when page appears 
    // instead of onload which onlu load one time
    this.setData({
      currentUser: app.globalData.userInfo,
    });

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