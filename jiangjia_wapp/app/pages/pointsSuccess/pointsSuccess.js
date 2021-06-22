// pages/pointsSuccess/pointsSuccess.js
const app = getApp();

Page({
  /** 
   * 页面的初始数据 
   */
  data: {
    imgUrl: app.imgUrl,

  },

  goBack:function(){
    wx.navigateBack({
      delta: 2
    })
  },
})