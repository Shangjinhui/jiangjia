// pages/liveInfo/liveInfo.js
const app = getApp();
const util = require('../../libs/util.js');
var timer

Page({
  /** 
   * 页面的初始数据 
   */
  data: {
    imgUrl: app.imgUrl,
    isIphoneX: app.globalData.isIphoneX,
    id: '',
    status: '', //0-列表进入 1-消息进入
    info: '',
    isShow: false,

    buyShow: false,
    tipShow: false,
    couShow: false,

    couList: null,//优惠券列表
    submited: true,

    coupon: '',//优惠券id
    couponInfo:'',
    price:'',
    isFirst: true



  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id,
      status: options.status ? options.status:'0',

    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      tipShow: false
    })
    app.checkLogin(() => {
      this.getInfo()
    });
  },

  getInfo: function () {
    var _this = this;
    if (_this.data.isFirst) { app.load.show(); }
   
    app.ajax({
      url: app.api + 'expert/direct_detail',
      type: 'GET',
      data: {
        id: _this.data.id,
        status: _this.data.status
      },
      success(res) {
        var labelList = [];
        if (res.expert.label) {
          labelList.push(res.expert.label)
        }
        if (res.expert.continueFocus >= 3) {
          labelList.push(res.expert.continueFocus + '连红')
        }
        if (labelList.length < 2 && res.expert.focus >= 10 && res.expert.articleCount >= 20) {
          labelList.push('近20中' + res.expert.focus)
        }
        if (labelList.length < 2 && res.expert.focusArticleCount > 0) {
          labelList.push('总' + res.expert.articleCount + '中' + res.expert.focusArticleCount)
        }
        res.labelList = labelList

       
        if (res.match_time){
          res.match_time = util.fdate1(res.match_time * 1000, 'MM-dd HH:mm');
        }
        if (res.directStartTime) {
          res.directStartTime = util.fdate(res.directStartTime, 'yyyy年MM月dd日 HH:mm');
        }

        // status_id
        if (res.status_id != 1 && res.status_id != 9 && res.status_id != 12 && res.status_id != 13 && _this.data.isFirst){
          timer = setInterval(function () {
            _this.getInfo()
          }, 10000)
        }


        if (res.isBuy == 1) { //已付费

        } else {
          if (_this.data.isFirst) {
            _this.getCouList()
          }
        }



        _this.setData({
          info: res,
          price: res.price,
          isShow: true,
          isFirst: false
        })
      },
      complete() {
        if (_this.data.isFirst) { app.load.hide(); }
       
      }
    });

  },

  onUnload: function () {
    clearInterval(timer)
  },
  onHide: function () {
    clearInterval(timer)
  },



  //我的优惠券列表
  getCouList: function () {
    var _this = this;
    app.load.show();
    app.ajax({
      url: app.api + 'expert/my_coupon',
      type: 'GET',
      success(res) {
        var lists=res
        for (var key in lists) {
          var item = lists[key];
          item.startTime = util.fdate(item.startTime, 'yyyy.MM.dd');
          item.overTime = util.fdate(item.overTime, 'yyyy.MM.dd');

        }
        _this.setData({
          couList: lists
        })
      },
      complete() {
        app.load.hide();
      }
    });
  },

  showCou:function(){
    this.setData({
      couShow: !this.data.couShow
    })
  },


  chooseCou: function (e) {
    var _this = this;
    var couponInfo = e.currentTarget.dataset.item
    var coupon = _this.data.coupon;
    var price
    if (couponInfo.id == coupon) {
      coupon = '';
      couponInfo = '';
      price = this.data.info.price
    } else {
      coupon = couponInfo.id;
      price = (this.data.info.price * couponInfo.discount / 10).toFixed(1)
    }
    _this.setData({
      coupon: coupon,
      couponInfo: couponInfo,
      couShow: false,
      price: price,
    })
  },




  showBuy: function () {
    this.setData({
      buyShow: !this.data.buyShow
    })
  },
  showTip: function () {
    this.setData({
      buyShow: false,
      tipShow: !this.data.tipShow
    })
  },

  //付费
  buyNow: function () {
    var _this = this;
    if (!_this.data.submited) { return false; }
    _this.setData({
      submited: false
    })
    wx.request({
      url: app.api + 'expert/direct_article_pay',
      method: 'POST',
      data: {
        id: _this.data.id,
        type: 2,
        coupon: _this.data.coupon,
      },
      header: {
        'Platform': '3',
        'Authorization': wx.getStorageSync('Token'),
        'Content-Type': 'application/json'
      },
      success: (res) => {
        let resData = res.data;
        if (resData) {
          switch (resData.returnCode) {
            case '0000': //正常
              wx.showToast({
                title: '请点击按钮查看直播',
                icon: 'none',
                duration: 2000
              });
              _this.showBuy();
              _this.getInfo();
              break;
            case '0030': //金币不足状态码
              _this.showTip();
              break;
            case '0013': //微信未授权
              wx.removeStorageSync('Token');
              wx.navigateTo({
                url: '/pages/login/login'
              });
              break;
            case '0012': //未绑定手机号
              wx.setStorageSync('unionId', resData.data.unionId);
              wx.removeStorageSync('Token');
              wx.navigateTo({
                url: '/pages/bindPhone/bindPhone'
              });
              break;
            case '0014': //用户登陆状态失效
              let reloadNumber = wx.getStorageSync('reloadNumber');
              if (!reloadNumber) reloadNumber = 0;
              wx.removeStorageSync('Token');
              if (reloadNumber <= 5) {
                reloadNumber++;
                wx.setStorageSync('reloadNumber', reloadNumber);
                app.checkLogin(() => {
                  _this.getInfo()
                });
              } else {
                setTimeout(() => {
                  app.load.show('登录失败', { hide: false, mask: true });
                }, 100);
              }
              break;
          }
        }
      },
      fail: (res) => {
        wx.showToast({
          title: '网络错误',
          icon: 'none',
          duration: 3000
        });
        fail(res);
      },
      complete: (res) => {
        _this.setData({
          submited: true
        })
      }
    })
  },

  goInfo:function(){
    if (this.data.info.status == 1){
      wx.navigateTo({
        url: "/pages/studio/studio?id=" + this.data.info.directId
      })
    }else{
      wx.showToast({
        title: '你的直播还未开始，请开始后进入',
        icon: 'none',
      });
    }
    
  }

})