// pages/infomation/infomation.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.imgUrl,
    avatar:'',
    avatarId:'',
    info:'',
    isChange:false,
    submited:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  onShow: function () {
    app.checkLogin(() => {
      if (!this.data.isChange){
        this.getInfo()
      }
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
          avatar: res.avatar,
          info:res,
        })
      },
      complete() {
        app.load.hide();
      }
    });

  },


  changeAvatar: function () {
    var _this = this;
    _this.setData({
      isChange:true
    })
    console.log(app.api1 )
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      success: function (res) {
        const tempFilePaths = res.tempFilePaths;
        wx.uploadFile({
          url: app.api1 + 'fileupload/photo',
          filePath: tempFilePaths[0],
          name: 'uploadFile',
          formData: null,
          header: {
            AUTHORIZATION: wx.getStorageSync('Token'),
            PLATFORM: 3,
            AppVersion: '1.0.0'
          },
          success: (resp) => {
            console.log(resp, JSON.parse(resp.data))
            let res = JSON.parse(resp.data)
            if (res.returnCode == '0000') {
              _this.setData({
                avatarId: res.data.id,
                avatar: res.data.imgurl,
              })
              _this.setData({
                isChange: false
              })
              _this.editInfo();

            } else {
              wx.showToast({
                title: res.msg,
                icon: 'none'
              });
            }
          },
          fail: (res) => {
            wx.showToast({
              title: JSON.parse(res.data).msg,
              icon: 'none'
            });
          },
          complete: () => {
            _this.setData({
              submited:true
            })
          }
        });
      }
    })
  },


  editInfo: function () {
    var _this = this;
    if (!_this.data.submited){return false}
    _this.setData({
      submited: false
    })
    app.ajax({
      url: app.api + 'member/info',
      type: 'post',
      data:{
        avatar: _this.data.avatarId,
        nickName:''
      },
      success(res) {
        
      },
      complete() {
        _this.setData({
          submited: true
        })
      }
    });

  },

  
})