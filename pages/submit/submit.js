// pages/submit/submit.js
Page({
    //可以转发的功能？
    // onShareAppMessage() {
    //   return {
    //     title: 'form',
    //     path: 'page/component/pages/form/form'
    //   }
    // },
  
    data: {
      formData: {},
      imageURL:'',
      vidURL:'',
      pickerHidden: true,
      chosen: '',
      date: '2020-01-01',
      allValue:'',
      index:0,
      genre: '',
      genreArray:['Blues & Jazz','Classical','Country','EDM','Folk & Indie','Hip-hop','Reggae','Rock','Latin','Pop']
    },

    //只能选择日期
    // bindDateChange: function(e) {
    //   this.setData({
    //     date: e.detail.value
    //   })
    // },

    
    
    
    getLocation: function() {
      let that = this
      wx.chooseLocation({
        success(res){
          console.log(res)
          that.setData({
            address: res.address,
            address_name: res.name,
            longitude: res.longitude,
            latitude: res.latitude
          })
        }
      })
    },

    onDateTimePicker:function(e){
    },

    bindPickerChange: function(e) {
      console.log('picker index发送选择改变，携带值为', e.detail.value)
      this.setData({
        genre: this.data.genreArray[e.detail.value]
      })
      console.log('show genre',this.data.genre)
    },
  
    formSubmit(e) {
      console.log('form发生了submit事件，携带数据为：', e.detail.value)
      let formData = e.detail.value
      formData.genre=this.data.genre,
      formData.vidURL= this.data.vidURL,
      formData.longitude = this.data.longitude
      formData.latitude = this.data.latitude
      formData.location = this.data.address_name
      // formData.imageURL = this.data.imageURL
      this.setData({
        formData: formData
      })

      const ProductCard = new wx.BaaS.TableObject('productCard');
      let newCard = ProductCard.create();

      newCard.set(formData)

      newCard.save().then((res)=>{
        console.log('save res',res);
        //const newReviews = this.data.reviews;
        // newReviews.push(res.data);
  
        // this.setData({
          
  
        //})
      }) 


      
      
  },
  
    formReset(e) {
      console.log('form发生了reset事件，携带数据为：', e.detail.value)
      this.setData({
        chosen: ''
      })
    },

    takeVideo:function(){
    let page = this
    wx.chooseVideo({
      sourceType: ['album','camera'],
      maxDuration: 30,
      camera: 'back',
      success(res) {
        console.log('recorded video',res.tempFilePath)
        let tempFilePath = res.tempFilePath
        page.setData({
          vidURL:tempFilePath
        })
        page.bassUploadFile(tempFilePath).then(url=>{
          console.log("testingabc", url)
          page.setData({
            vidURL: url
          })
        })        
      }
    })
  },
  bassUploadFile: function(url){
    return new Promise (function(resolve, reject){
      let MyFile = new wx.BaaS.File()
      let fileParams = {filePath: url}
      let metaData = {categoryName: 'SDK'}
        MyFile.upload(fileParams, metaData).then(res => {
            resolve(res.data.path)
          }, err => {
        })
    })
    },



    // takePhoto: function() {
    //   let that = this
    //   wx.chooseImage({
    //     count: 1,
    //     sizeType: ['original'],
    //     sourceType: ['album', 'camera'],
    //     success: function (res) {
    //       let tempFilePath = res.tempFilePaths[0]
    //       console.log(tempFilePath)
    //       that.setData({
    //         imageURL:tempFilePath
    //       })
    //     }
    //   })
    // },

    // deletePhoto(){
    //   this.setData({
    //     imageURL:''
    //   })
    // },
    
  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
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