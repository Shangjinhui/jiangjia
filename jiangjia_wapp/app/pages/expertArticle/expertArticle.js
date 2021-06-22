// pages/expertArticle/expertArticle.js
const app = getApp();
const util = require('../../libs/util.js');
var timer

// const WxParse = require('../../wxParse/wxParse.js');
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
    couShow:false,

    couList:null,//优惠券列表
    submited:true,

    coupon: '',//优惠券id
    couponInfo: '',
    price:'',

    isFirst:true



  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      id: options.id,
      status: options.status
    })
    if (options.flagCode) {
      wx.setStorageSync('otflagCode', options.flagCode)
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.setData({
      tipShow:false
    })
    app.checkLogin(() => {
      this.getInfo()
    });
  },

  //	专家解说详情
  getInfo: function() {
    var _this = this;
    if (_this.data.isFirst) { app.load.show();}
    app.ajax({
      url: app.api + 'expert/article_details',
      type: 'GET',
      data: {
        id: _this.data.id,
        status: _this.data.status
      },
      success(res) { 
        var isRefresh=false
        for (var key in res.match) {
          var item = res.match[key]
          if (item.match_time) {
            item.time = util.fdate1(item.match_time * 1000, 'MM-dd HH:mm');
            item.ftime = util.fdate1(item.match_time * 1000, 'E');
          }
          if (item.status==1){
            isRefresh=true
          }
        }
        if (isRefresh && _this.data.isFirst){
        
          timer = setInterval(function () {
            _this.getInfo()
          }, 10000)
        }

       
        if (res.haveOpen == 1) { //已付费

          for (var key in res.secret.detail) {
            var item = res.secret.detail[key]
            if (item.match_time) {
              item.time = util.fdate1(item.match_time * 1000, 'MM-dd HH:mm');
              item.ftime = util.fdate1(item.match_time * 1000, 'E');
            }
          }

          if (res.secret.type == 1 || res.secret.type == 2 ) { 
            res.secret = _this.judge1(res.secret);
          }

          if (res.secret.type == 4){
            
          }
         
          if (res.secret.content) {
            res.secret.content = res.secret.content.replace(/style=""/g, '')
            res.secret.content = res.secret.content.replace(/\<img/g, '<img style="max-width:100%;" ')
            // WxParse.wxParse('article', 'html', res.secret.content, _this, 0);
          }


        }else{
          if (_this.data.isFirst){
            _this.getCouList()
          }
        }


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


  formatImg: function (html) {
    var newContent = html.replace(/<img[^>]*>/gi, function (match, capture) {
      console.log(match)
      var match = match.replace(/style=\"(.*)\"/, '');
      // var match = match.replace(/style=""/, '');
      var match =match.findall()
      console.log(match)
      return match;

    });

    return newContent;
  },


  //数据高亮处理
  judge1: function(data) {
    for (var key in data.detail) {
      var item = data.detail[key];
      if (!item.data.spf && !item.data.rq) {
        return data
      }
      item.spfList = [{
        num: 0
      }];
      for (var rekey in item.data.spf.split(',')) {
        item.spfList.push({
          num: item.data.spf.split(',')[rekey]
        })
      }

      item.rqList = []
      for (var rekey in item.data.rq.split(',')) {
        item.rqList.push({
          num: item.data.rq.split(',')[rekey]
        })
      }


      // res 胜负平选择1 - 胜 2 - 平 3 - 负 4 - 胜平 5 - 负平',
      var list
      if (item.type == 1) { //让球
        list = item.rqList
      } else { //不让球
        list = item.spfList
      }
      if (item.res == 4) {
        list[1].checked = 1;
        list[2].checked = 1
      } else if (item.res == 5) {
        list[3].checked = 1;
        list[2].checked = 1
      } else {
        list[item.res].checked = 1
      }
    }
    return data
  },




  //我的优惠券列表
  getCouList:function(){
    var _this = this;
    app.load.show();
    app.ajax({
      url: app.api + 'expert/my_coupon',
      type: 'GET',
      success(res) {
        var lists = res
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

  showCou: function () {
    this.setData({
      couShow: !this.data.couShow
    })
  },

  chooseCou: function (e) {
    var _this = this;
    var couponInfo = e.currentTarget.dataset.item
    var coupon = _this.data.coupon;
    var price
    if (couponInfo.id == coupon){
      coupon='';
      couponInfo='';
      price = this.data.info.price
    }else{
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





  showBuy: function() {
    this.setData({
      buyShow: !this.data.buyShow
    })
  },
  showTip: function() {
    this.setData({
      buyShow:false,
      tipShow: !this.data.tipShow
    })
  },

  //解说付费
  buyNow: function() {
    var _this=this;
    if (!_this.data.submited){return false;}
    _this.setData({
      submited:false
    })
    wx.request({
      url: app.api + 'expert/direct_article_pay',
      method: 'POST',
      data: {
        id:_this.data.id,
        type: 1,
        coupon: _this.data.coupon,
      },
      header: {
        'Platform':'3',
        'Authorization': wx.getStorageSync('Token'),
        'Content-Type':'application/json'
      },
      success: (res) => {
        let resData = res.data;
        if (resData) {
          switch (resData.returnCode) {
            case '0000': //正常
              _this.showBuy();
              wx.navigateTo({
                url:'/pages/expertSuccess/expertSuccess'
              })
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

  //收藏专家
  collectInfo: function () {
    var _this = this;
    app.checkLogin(() => {
      if (!_this.data.submited) {
        return false;
      }
      _this.setData({
        submited: false
      })
      app.ajax({
        url: app.api + 'expert/collect_expert',
        type: 'GET',
        data: {
          id: _this.data.info.expert.id,
          type: _this.data.info.expert.isCollect == 1 ? 2 : 1 //	1-关注 2-取消
        },
        success(res) {
          var info = _this.data.info;
          info.expert.collect = info.expert.isCollect == 1 ? parseInt(info.expert.collect) - 1 : parseInt(info.expert.collect) + 1;
          info.expert.isCollect = info.expert.isCollect == 1 ? 0 : 1;
          _this.setData({
            info: info
          })

          wx.showToast({
            title: info.isCollect == 1 ? '关注成功' : '取消关注',
            icon: 'success',
          });

        },
        complete() {
          _this.setData({
            submited: true
          })
        }
      });
    });

  },

 


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var _this = this;
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
      title: '【' + _this.data.info.expert.nickName + '】' + _this.data.info.title,
      path: '/pages/expertArticle/expertArticle?id=' + _this.data.id + '&status=0&flagCode=' + wx.getStorageSync('flagCode'),
      imageUrl: _this.data.imgUrl + 'share.jpg'
    }


  }
})