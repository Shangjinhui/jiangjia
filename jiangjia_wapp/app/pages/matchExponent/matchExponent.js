// pages/matchExponent/matchExponent.js
const app = getApp();
const util = require('../../libs/util.js')
Page({
  /** 
   * 页面的初始数据 
   */
  data: {
    imgUrl: app.imgUrl,
    option:'',
    companyName:'',
    id:'',
    type:'',
    num:0,
    nameList: [],
    list: [],
    isShow:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      option: options.option ? options.option:1,
      id:options.id,
      companyName: options.companyName
    })
    var tit,type;
    if(this.data.option==1){
      tit ='让球指数变化';
      type ='asia';
    } else if (this.data.option == 2) {
      tit = '欧赔指数变化';
      type = 'eu';
    } else if (this.data.option == 3) {
      tit = '总进球指数变化';
      type = 'bs';
    }

    this.setData({
      type: type
    })
    wx.setNavigationBarTitle({
      title: tit
    })

    this.getInfo();


  },

  // 足球比赛--指数
  getInfo: function () {
    var _this = this;
    app.load.show();
    app.ajax({
      url: app.api + 'football/info_odds_detail',
      type: 'GET',
      data: {
        matchId: _this.data.id,
        type: _this.data.type
      },
      success(res) {
        var list = res.list;
        var num=0;
        var newList=[];
        for(var key in list){
          var item =list[key];
          if (item.company_name == _this.data.companyName){
            num=key;
            newList = item.list
          }
        }
        for (var key in newList){
          var item = newList[key];
          if (item.match_time){
            item.time = item.match_time
          }else{
            if (item.update_at) {
              item.time = util.fdate1(item.update_at * 1000, 'MM-dd HH:mm');
            }
          }
        }
        _this.setData({
          nameList:res.list,
          num: num,
          list: newList,
          isShow:true
        })

        
      },
      complete() {
        app.load.hide();
      }
    });
  },

  changeNum:function(e){
    var num = e.currentTarget.dataset.idx;
    var newList;
    var list = this.data.nameList;
    newList = list[num].list;
    for (var key in newList) {
      var item = newList[key];
      if (item.match_time) {
        item.time = item.match_time
      } else {
        if (item.update_at) {
          item.time = util.fdate1(item.update_at * 1000, 'MM-dd HH:mm');
        }
      }
    }

    this.setData({
      num: num,
      list: newList,
    })
  }

})