// pages/center/center.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.imgUrl,
    info:'',
    isSign:0,
    isShow:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options&&options.flagCode){
      wx.setStorageSync('otflagCode', options.flagCode)
    }
    app.checkLogin(() => {
      this.getInfo()
    });
  },


  /**
   * 生命周期函数--监听页面显示
   */
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
          info:res,
          isSign: res.isSign,
          isShow:true
        })
        wx.setStorageSync('userInfo', app.Encrypt(JSON.stringify(res)))

        wx.setStorageSync('flagCode', res.flagCode)
      },
      complete() {
        app.load.hide();
        wx.stopPullDownRefresh();
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
  onPullDownRefresh(){
    this.onLoad()
  },
})