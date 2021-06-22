// pages/modify_phone/modify_phone.js
const app = getApp();
var timer
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.imgUrl,
    type:1,
    phone:'',
    codeText: '获取验证码',
    smsCode:'',
    submited: true
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.checkLogin(() => {
      this.setData({
        phone: options.phone
      })
    });
  },

  bindinput: function (e) {
    this.setData({
      [e.currentTarget.dataset.cur]: e.detail.value
    })
  },


  //获取验证码
  getCode: function () {
    let _this = this;
    if (!_this.data.submited) {
      return false
    }
    if (_this.data.codeText != '获取验证码') {
      return false;
    }
    if(_this.data.type==2){
      if (!_this.data.phone) {
        wx.showToast({
          title: '请输入手机号',
          icon: 'none',
        });
        return false;
      }
      if (!/^1\d{10}$/.test(_this.data.phone)) {
        wx.showToast({
          title: '请输入正确的手机号',
          icon: 'none',
        });
        return false;
      }
    }

    _this.setData({
      submited: false
    })

    app.ajax({
      url: app.api + 'member/send_sms',
      type: 'post',
      data: {
        phone: _this.data.type == 1 ? '': _this.data.phone,
        type: _this.data.type == 1 ? 2 : 3 //1注册登录,2修改手机-原手机,3修改手机-新手机
      },
      success(res) {
        var t = 60;
        _this.setData({
          codeText: t + '秒后重发'
        })
        timer = setInterval(function () {
          if (t == 0) {
            _this.setData({
              codeText: '获取验证码'
            })
            
          } else {
            _this.setData({
              codeText: t + '秒后重发'
            })
            t--;
          } 
        }, 1000)
      },
      complete: (res) => {
        _this.setData({
          submited: true
        })
      }
    });


  },


  //绑定手机号
  bindPhone: function () {
    let _this = this;
    if (!_this.data.submited) {
      return false
    }
    if(_this.data.type==2){
      if (!_this.data.phone) {
        wx.showToast({
          title: '请输入手机号',
          icon: 'none',
        });
        return false;
      }
      if (!/^1\d{10}$/.test(_this.data.phone)) {
        wx.showToast({
          title: '请输入正确的手机号',
          icon: 'none',
        });
        return false;
      }
    }
    
    if (!_this.data.smsCode) {
      wx.showToast({
        title: '请输入验证码',
        icon: 'none',
      });
      return false;
    }
    var url, data;
    if (_this.data.type == 1) {
      url = app.api + 'member/old_phone';
      data = {
        smsCode: _this.data.smsCode,
      }
    } else {
      url = app.api + 'member/phone';
      data = {
        newPhone: _this.data.phone,
        newSmsCode: _this.data.smsCode,
      }
    }
    _this.setData({
      submited: false
    })
    app.ajax({
      url: url,
      type: 'post',
      data: data,
      success(res) {
        if (_this.data.type == 1) {
          _this.setData({
            codeText: '获取验证码',
            type:2,
            smsCode:'',
            phone:''
          })
          wx.setNavigationBarTitle({
            title: '修改手机号',
          })

          clearInterval(timer);
        } else {
          wx.showToast({
            title: '修改成功',
            icon: 'success',
          });
          setTimeout(function () {
            wx.navigateBack({
              delta: 1
            })
          }, 500)
        }

      },
      complete: (res) => {
        _this.setData({
          submited: true,
          codeText: '获取验证码'
        })
        clearInterval(timer);
      }
    });


  },
 
})