// pages/rules/rules.js
const app = getApp();
const WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    state: 1,//1消息 2活动规则  3banner单页
    isShow:false,
    info:'',
    id:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    this.setData({
      state: options.state ? options.state:1,
      id: options.id ? options.id:''
    })
    var tit;
    if(this.data.state==1){
      tit ='消息'
    } else if (this.data.state == 2) {
      tit = '活动规则'
    }
    wx.setNavigationBarTitle({
      title: tit,
    })

    app.checkLogin(() => {
      this.getInfo()
    });
  },

  getInfo: function () {
    var _this = this;
    app.load.show();
    var url,data;
    if(_this.data.state==1){
      url = app.api + 'common/notice_info'
      data = {
        id: _this.data.id
      }
    } else if(_this.data.state == 2){
      url = app.api + 'common/get_page'
      data = {
        id: 37
      }
    } else if (_this.data.state == 3) {
      url = app.api + 'common/banner_details'
      data = {
        id: _this.data.id
      }
    }
    app.ajax({
      url: url,
      type: 'GET',
      data: data,
      success(res) {
        _this.setData({
          info: res,
          isShow: true
        })
        console.log(res)
        if (res.content) {
          WxParse.wxParse('article', 'html', res.content, _this, 0);
        }
        if (_this.data.state == 3 && res.link) {
          WxParse.wxParse('article', 'html', res.link, _this, 0);
        }
      },
      complete() {
        app.load.hide();
      }
    });

  },
})