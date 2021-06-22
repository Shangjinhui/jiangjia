// pages/withdraw/withdraw.js
const app = getApp();
var timer
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.imgUrl,
    typeList:[
      { id: 1, name: '支付宝' },
      { id: 2, name:'银行卡'}
    ],
    type:1,
    successShow:false,
    info:'',
    submited: true,
    amount:'',
    accountNumber: '',//支付宝账号/银行卡号
    bankName:'',
    realName:'',
    isCan:true
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.checkLogin(() => {
      this.getInfo();
    });
  },


  changeType: function (e) {
    this.setData({
      type: e.currentTarget.dataset.type,
      accountNumber: '',
      bankName: '',
      realName: '',
    })
  },

  bindinput: function (e) {
    this.setData({
      [e.currentTarget.dataset.cur]: e.detail.value
    })
  },


  //提现参数
  getInfo: function () {
    var _this = this;
    app.load.show();
    app.ajax({
      url: app.api + 'member/withdraw_param',
      type: 'GET',
      success(res) {
        var isCan;
        if (res.withdrawBalance * 1 >= res.withdrawNumber*1){
          isCan=true;
        }else{
          isCan = false;
        }
        _this.setData({
          info: res,
          isCan: isCan
        })
      },
      complete() {
        app.load.hide();
      }
    });

  },

  allAmont:function(){
      this.setData({
        amount:this.data.info.withdrawBalance
      })
  },

  // 申请提现
  withdraw: function () {
    var _this = this;
    if (!_this.data.submited) { return false; }
    if (!_this.data.isCan) { return false; }

    if (!_this.data.accountNumber) {
      wx.showToast({
        title: _this.data.type == 1 ? '请输入支付宝账号' :'请输入银行卡号',
        icon: 'none',
      });
      return false;
    }

    if(_this.data.type==2){
      if (!_this.data.realName) {
        wx.showToast({
          title: '请输入持卡人姓名',
          icon: 'none',
        });
        return false;
      }
      if (!_this.data.bankName) {
        wx.showToast({
          title: '请输入银行名称',
          icon: 'none',
        });
        return false;
      }
    }

    if (!_this.data.amount){
      wx.showToast({
        title: '请输入提现金额',
        icon: 'none',
      });
      return false;
    }
    if (_this.data.amount*1 < _this.data.info.withdrawNumber*1){
      wx.showToast({
        title: '提现金额不得小于' + _this.data.info.withdrawNumber,
        icon: 'none',
      });
      return false;
    }
    
    var isMoney = /^[0-9]+(.[0-9]{1,2})?$/;
    if (!isMoney.test(_this.data.amount)) {
      wx.showToast({
        title: '请输入正确的金额格式',
        icon: 'none',
      });
      return false;
    }
    

    _this.setData({
      submited: false
    })
    app.ajax({
      url: app.api + 'member/withdraw',
      type: 'post',
      data: {
        amount: _this.data.amount,
        accountNumber: _this.data.accountNumber,
        bankName: _this.data.bankName,
        realName: _this.data.realName,
        type:_this.data.type
      },
      success(res) {
        _this.setData({
          successShow:true
        })
        timer=setTimeout(function () {
          _this.goBack();
        }, 3000)
      },
      complete() {
        _this.setData({
          submited: true
        })

      
      }
    });

  },


  goBack:function(){
    clearTimeout(timer)
    wx.navigateBack({
      delta: 1
    })
  },

})