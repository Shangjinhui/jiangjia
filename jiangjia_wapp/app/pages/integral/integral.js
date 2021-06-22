// pages/integral/integral.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.imgUrl,
    type:1,
    pageNo: 1,
    limit: 10,
    isMore: true,
    list: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.checkLogin(() => {
      this.getList();
    });
  },

  //主导航点击
  changeType: function (e) {
    this.setData({
      type: e.currentTarget.dataset.cur,
      isMore: true,
      pageNo: 1,
      list: null,
    })
    this.getList();

  },

  getList: function () {
    var _this = this;
    if (!_this.data.isMore) {
      return false;
    }
    app.load.show();
    app.ajax({
      url: app.api + 'gift/my_point',
      type: 'GET',
      data: {
        page: _this.data.pageNo,
        limit: _this.data.limit,
        type: _this.data.type
      },
      success(res) {
        let lists = res.list;
        for (var key in lists) {
          var item = lists[key];

        }
        if (_this.data.pageNo == 1) {
          _this.setData({
            list: lists,
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
  onReachBottom: function () {
    this.getList()
  },


})