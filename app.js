//app.js
App({
  onLaunch: function () {
    wx.BaaS = requirePlugin('sdkPlugin')
    wx.BaaS.wxExtend(wx.login,
     wx.getUserInfo,
     wx.requestPayment)

    wx.BaaS.init('9d9042e3aaaf5ab6d65c', {autoLogin: true})
    wx.BaaS.auth.getCurrentUser().then(user => {
      console.log('logged in from app.js', user)
      this.globalData.userInfo = user.toJSON();
      wx.setStorageSync('userInfo', user.toJSON())
    }, err => {
      this.globalData.showLoginBtn = true
    })
  },
  globalData: {
    userInfo: wx.getStorageSync('userInfo') || null,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  }
})