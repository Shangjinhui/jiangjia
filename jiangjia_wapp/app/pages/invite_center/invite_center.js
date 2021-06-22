// pages/invite_center/invite_center.js
const app = getApp();
Page({
  data: {
    imgUrl: app.imgUrl,
    info: '',
    isShow: false
  },

  onShow: function () {
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
          isShow: true
        })
      },
      complete() {
        app.load.hide();
      }
    });

  },

})