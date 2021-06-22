// pages/expertSuccess/expertSuccess.js
const app = getApp();
var timer

Page({
  /** 
   * 页面的初始数据 
   */
  data: {
    imgUrl: app.imgUrl,
    time:5
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this=this;
      timer = setInterval(function () {
        var time = _this.data.time;
        if (time > 1) {
          _this.setData({
            time: time - 1
            })
          }
         else {
          _this.goBack();
        }
      }, 1000)
    
    
  },

  goBack:function(){
    clearInterval(timer)
    wx.navigateBack({
      delta: 1
    })
  },

  onUnload: function () {
    clearInterval(timer)
  },
  onHide: function () {
    clearInterval(timer)
  },
  
})