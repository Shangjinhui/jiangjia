// pages/teamTransfer/teamTransfer.js
const app = getApp();
const util = require('../../libs/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.imgUrl,
    navList: [
      { id: '1', name: '转入球员' },
      { id: '2', name: '转出球员' },
    ],
    nav: '1',
    pageNo: 1,
    limit: 20,
    isMore: true,
    list: null,
    isHome: false,//是否关闭其他页面

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id,
      nav: options.nav ? options.nav:'1'
    })
    this.getList()
    var pageLength = getCurrentPages().length;
    if (pageLength >= 7) {
      _this.setData({
        isHome: true
      })
    }
  },

  //主导航点击
  changeNav: function (e) {
    this.setData({
      nav: e.currentTarget.dataset.nav,
      pageNo: 1,
      isMore: true,
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
      url: app.api + 'football/transfer_list',
      type: 'GET',
      data: {
        pageNo: _this.data.pageNo,
        limit: _this.data.limit,
        teamId: _this.data.id,
        type:_this.data.nav
      },
      success(res) {
        let lists = res.list;
        for (var key in lists) {
          var item = lists[key];
          if (item.transfer_time) {
            item.time = util.fdate1(item.transfer_time*1000, 'yyyy-MM-dd');
          }
        }
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
  onReachBottom: function () {
    var _this = this;
    
      _this.getList();

  },
 

})