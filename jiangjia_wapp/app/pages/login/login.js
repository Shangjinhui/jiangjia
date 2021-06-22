// pages/login/login.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.imgUrl,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  cosleAuth:function(){
    wx.switchTab({
      url: '/pages/index/index'
    })
  },
  bindGetUserInfo: function(e){
    let _this = this;
    wx.login({
      success: (res) => {
        _this.setData({
          code: res.code
        })
        // console.log(_this.data.code)
        // console.log(e.detail.encryptedData)
        // console.log(e.detail.iv)
        console.log(JSON.stringify({
          code: _this.data.code,
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv
        }))
        // return false
        if (e.detail.encryptedData) {
          app.ajax({
            url: app.api + 'member/wechat_applets',
            header: {
              'content-type': 'application/json',
            },
            type: 'post',
            data: {
              code: _this.data.code,
              encryptedData: e.detail.encryptedData,
              iv: e.detail.iv
            },
            success(res) {
              wx.setStorageSync('Token', res.data.token);
              wx.switchTab({
                url: '/pages/index/index'
              })
            },
            complete: (res) => {
            }
          });
        } else {
          wx.switchTab({
            url: '/pages/index/index'
          })
        }
      },
      fail: (res) => {
        console.log('获取用户登录态失败！' + res.errMsg)
      }
    });

    
  },

 
})