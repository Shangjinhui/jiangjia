// pages/set_up/set_up.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.imgUrl,
    isChecked:true,
    isCheckeds:true,
  },
  changeSwitch:function(e){
    this.setData({
      isChecked:e.detail.value
    })
  },
  changeSwitchs:function(e){
    this.setData({
      isCheckeds:e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options){},
  onShow: function () {},
  onReachBottom: function () {},
  onShareAppMessage: function () {}
})