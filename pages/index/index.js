//index.js
//获取应用实例
const app = getApp()
const genre = ['Blues & Jazz', 'Classical', 'Country', 'EDM','Folk & Indie', 'Hip-hop', 'Reggae', 'Rock', 'Latin', 'Pop']

Page({
  data: {
    cards: [],
    genre: ['All','Blues & Jazz', 'Classical', 'Country', 'EDM','Folk & Indie', 'Hip-hop', 'Reggae', 'Rock', 'Latin', 'Pop']
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
    Cards.limit(100).offset(0).find().then((res) => {
      console.log('card content', res.data.objects);
      this.setData({
        cards: res.data.objects
      })
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
        cards: res.data.objects
      })
    })
  }



})