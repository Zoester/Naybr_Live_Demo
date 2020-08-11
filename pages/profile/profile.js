// pages/profile/profile.js
const app = getApp()

Page({
  data: {
    welcome_text: 'Prepare your ears. Welcome to Music Box',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  
  onLoad: function () {
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
      console.log("user info", user);
      this.setData({
        userInfo: user,
        showLoginBtn: false
      })
    }, err => {
    })
  },
})
