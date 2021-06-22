// pages/top_up/top_up.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.imgUrl,
    list:[],
    number:'',
    goldProductId:0,
    submited:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.checkLogin(() => {
      this.getList()
    });
  },


  // 充值--金币商品列表
  getList: function () {
    var _this = this;
    app.load.show();
    app.ajax({
      url: app.api + 'member/gold_product',
      type: 'GET',
      success(res) {
        _this.setData({
          list: res.list,
        })
      },
      complete() {
        app.load.hide();
      }
    });

  },

  bindinput: function (e) {
    this.setData({
      [e.currentTarget.dataset.cur]: e.detail.value,
      goldProductId:0
    })
  },

  changeId:function(e){
    var id=e.currentTarget.dataset.id;

    if (this.data.goldProductId==id){
      this.setData({
        goldProductId:0
      })
    }else{
      this.setData({
        goldProductId:id,
        number:''
      })
    }
  },

  pay:function(){
    var _this=this;
    if(!_this.data.submited){return false;}
    if (_this.data.goldProductId == 0 && !_this.data.number){
      wx.showToast({
        title: '请选择充值金额',
        icon: 'none',
      });
      return false;
    }
    if (_this.data.number){
      var isMoney = /^[0-9]+(.[0-9]{1,2})?$/;
      if (!isMoney.test(_this.data.number)) {
        wx.showToast({
          title: '请输入正确的金额格式',
          icon: 'none',
        });
        return false;
      }
    }
    

    _this.setData({
      submited: false
    })
    app.ajax({
      url: app.api + 'pay/index',
      type: 'post',
      data:{
        goldProductId: _this.data.goldProductId,
        number: _this.data.number ? _this.data.number:'1',
        paymentCode:'wechatAppletsPay'
      },
      success(res) {
        _this.wxpay(res.result)
      },
      complete() {
        _this.setData({
          submited: true
        })
      }
    });

  },


  //微信支付
  wxpay(data) {
    var _this = this;
    wx.requestPayment({
      'timeStamp': data.timeStamp,
      'nonceStr': data.nonceStr,
      'package': data.package,
      'signType': data.signType,
      'paySign': data.paySign,
      'success': function (res) {
        wx.showToast({
          title: '充值成功',
          icon: 'success',
        });
        setTimeout(function () {
          wx.navigateBack({
            delta: 1
          })
        }, 1000)
      },
      'fail': function (res) {

      }
    })
  },



})