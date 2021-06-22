// pages/invite_friends/invite_friends.js
const app = getApp();
Page({
  data: {
    imgUrl: app.imgUrl,
    info:'',
    isShow:false
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.checkLogin(() => {
      this.getInfo()
    });
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
          isShow:true
        })
      },
      complete() {
        app.load.hide();
      }
    });

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var _this=this;
    // 每日分享获得积分
    app.ajax({
      url: app.api + 'member/share_point',
      type: 'GET',
      success(res) {
       
      },
      complete() {
      }
    });

    return {
      title: '进球哨',
      path: '/pages/center/center?flagCode=' + _this.data.info.flagCode,
      imageUrl: _this.data.imgUrl + 'share.jpg'
    }

   
  }
})