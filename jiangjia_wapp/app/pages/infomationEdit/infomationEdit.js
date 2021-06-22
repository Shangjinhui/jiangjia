// pages/infomationEdit/infomationEdit.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:'',
    submited: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.checkLogin(() => {
      this.setData({
        name: options.name
      })
    });
  },

  bindinput: function (e) {
    this.setData({
      [e.currentTarget.dataset.cur]: e.detail.value
    })
  },

  editInfo: function () {
    var _this = this;
    if (!_this.data.submited) { return false }
    if (!_this.data.name) {
      wx.showToast({
        title: '请输入名字',
        icon: 'none',
      });
      return false;
    }
    _this.setData({
      submited: false
    })
    app.ajax({
      url: app.api + 'member/info',
      type: 'post',
      data: {
        avatar: '',
        nickName: _this.data.name
      },
      success(res) {
        wx.showToast({
          title: '修改成功',
          icon: 'none',
        });
        setTimeout(function(){
          wx.navigateBack({
            delta: 1
          })
        },500)
      },
      complete() {
        _this.setData({
          submited: true
        })
      }
    });

  },


})