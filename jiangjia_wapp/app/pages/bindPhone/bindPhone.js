// pages/login/login.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.imgUrl,
    content:'',
    submited:true

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  getPhoneNumber: function (e) {
    let _this = this;
    if (e.detail.errMsg == 'getPhoneNumber:fail user deny'){ //取消获取手机号
      wx.switchTab({
        url: '/pages/index/index'
      })
    }else{
      if (!_this.data.submited){return false;}
      
      wx.login({
        success: (res) => {
          _this.setData({
            code: res.code
          })
          _this.setData({
            submited: false
          })
          app.ajax({
            url: app.api + 'member/wechat_phone',
            header: {
              'content-type': 'application/json',
            },
            type: 'post',
            data: {
              code: _this.data.code,
              encryptedData: e.detail.encryptedData,
              iv: e.detail.iv
            },
            success(res) { //授权成功获取到手机号码-绑定手机↓
              _this.binding_phone(res.phone);
            },
          });
        },
        fail: (res) => {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      });
      
    }
  },
  binding_phone: function (e) { //绑定手机↓
    let _this = this;
    app.ajax({
      url: app.api + 'member/bind_phone',
      type: 'POST',
      data: {
        unionId: wx.getStorageSync('unionId'),
        phone: e,
        type: 1, //1绑定微信手机，2绑定其他手机
        flagCode: wx.getStorageSync('otflagCode') ? wx.getStorageSync('otflagCode'):''
      },
      success(res) {
        wx.setStorageSync('Token', res.token);
        wx.setStorageSync('flagCode', res.flagCode)
        wx.removeStorageSync('unionId')
        wx.removeStorageSync('otflagCode')//邀请码
        wx.showToast({
          title: '手机号码绑定成功',
          icon: 'none',
        },2000);
        setTimeout(function(){
          wx.navigateBack({
            delta: 2
          })
        },2000)
      },
      complete() {
        _this.setData({
          submited: false
        })
      }
    });
  },
  colseFun:function(){
    wx.switchTab({
      url: '/pages/index/index'
    })
  },
 
})