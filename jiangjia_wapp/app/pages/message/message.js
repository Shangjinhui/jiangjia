// pages/message/message.js
const app = getApp();
const util = require('../../libs/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.imgUrl,
    state: 1,
    pageNo: 1,
    limit: 10,
    isMore: true,
    list: null,

    submited: true
  },

  onShow: function () {
    app.checkLogin(() => {
      this.setData({
        isMore: true,
        pageNo: 1,
      })
      this.getList()
    });
  },


  changeState: function (e) {
    var _this = this;
    _this.setData({
      state: e.currentTarget.dataset.id
    })
    _this.setData({
      isMore: true,
      pageNo: 1,
      list: null,
    })
    _this.getList();
  },
  getList: function () {
    var _this = this;
    if (!_this.data.isMore) {
      return false;
    }
    app.load.show();
    var url;
    if (_this.data.state == 1) {
      url = app.api + 'common/notice_list';
    } else {
      url = app.api + 'gift/ship_gift';
    }
    app.ajax({
      url: url,
      type: 'GET',
      data: {
        page: _this.data.pageNo,
        limit: _this.data.limit,
      },
      success(res) {
        let lists =  res.result;

        if (_this.data.pageNo == 1) {
          _this.setData({
            list: lists,
            isShow: true
          })
        } else {
          _this.setData({
            list: _this.data.list.concat(lists)
          })
        }
        const total = res.count;
        if (_this.data.pageNo * _this.data.limit < parseInt(total)) { // 仍未加载完
          _this.setData({
            isMore: true,
            pageNo: _this.data.pageNo + 1
          });
        } else { // 加载完了
          _this.setData({
            isMore: false
          });
        }
      },
      complete() {
        app.load.hide();
      }
    });
  },

  goInfo:function(e){
    var item = e.currentTarget.dataset.item;
    app.ajax({
      url: app.api + 'common/read_notice',
      type: 'GET',
      data: {
        id: item.id ,
        type: item.type,
      },
      success(res) {
        
      },
      complete() {
      }
    });

    if (item.type == 1) {//1-关联解说 2-关联比赛 3-文章
      wx.navigateTo({
        url: '/pages/expertArticle/expertArticle?status=1&id=' + item.content,
      })
    } else if (item.type == 2) {
      wx.navigateTo({
        url: '/pages/matchInfo/matchInfo?id=' + item.content,
      })
    }else{
      wx.navigateTo({
        url: '/pages/rules/rules?state=1&id=' + item.id,
      })
    }
  },

  /**
* 页面上拉触底事件的处理函数
*/
  onReachBottom: function () {
    var _this = this;
    _this.getList();
  },




})