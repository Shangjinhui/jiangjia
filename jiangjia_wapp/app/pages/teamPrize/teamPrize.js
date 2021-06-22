// pages/teamPrize/teamPrize.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.imgUrl,
    id:'',
    list:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id,
    })
    this.getInfo();
  },
  // 足球球队--荣誉列表
  getInfo: function () {
    var _this = this;
    app.load.show();
    app.ajax({
      url: app.api + 'football/honor_list',
      type: 'GET',
      data: {
        teamId: _this.data.id,
      },
      success(res) {
        _this.setData({
          list: res.list
        })
       
      },
      complete() {
        app.load.hide();
      }
    });
  },
})