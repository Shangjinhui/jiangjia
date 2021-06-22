// pages/task_hall/task_hall.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.imgUrl,
    info: '',
    isSign: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.checkLogin(() => {
      this.getInfo()
    });
  },

  onShow: function () {
    
  },
  getInfo: function () {
    var _this = this;
    app.load.show();
    app.ajax({
      url: app.api + 'member/info',
      type: 'GET',
      success(res) {
        _this.setData({
          info: res,
          isSign: res.isSign
        })
      },
      complete() {
        app.load.hide();
      }
    });

  },

  //	签到
  signIn: function () {
    var _this = this;
    app.load.show();
    app.ajax({
      url: app.api + 'member/qian',
      type: 'GET',
      success(res) {
        _this.setData({
          isSign: 1
        })
      },
      complete() {
        app.load.hide();
      }
    });

  },

  goHome:function(e){
    wx.setStorageSync('nav', e.currentTarget.dataset.cur)
    wx.switchTab({
      url: '/pages/index/index'
    })
  }
})