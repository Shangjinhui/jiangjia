// pages/inviter/inviter.js
const app = getApp();
const util = require('../../libs/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.imgUrl,
    pageNo: 1,
    limit: 20,
    isMore: true,
    list: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    app.checkLogin(() => {
      this.getList()
    });
  },

  getList: function() {
    var _this = this;
    if (!_this.data.isMore) {
      return false;
    }
    app.load.show();
    app.ajax({
      url: app.api + 'member/invite_list',
      type: 'GET',
      data: {
        pageNo: _this.data.pageNo,
        limit: _this.data.limit,
      },
      success(res) {
        let lists = res.list;
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

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var _this = this;
    _this.getList();
  },

})