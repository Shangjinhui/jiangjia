// pages/reviewInfo/reviewInfo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    link:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      link: options.link ? options.link:''
    })
    var videoContext = wx.createVideoContext('myvideo', this);
    　　videoContext.requestFullScreen();//执行全屏方法
  },

  
})