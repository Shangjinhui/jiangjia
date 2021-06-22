// pages/points_mall/points_mall.js
const app = getApp();
Page({
  /** 
   * 页面的初始数据 
   */
  data: {
    imgUrl: app.imgUrl,
    navList: [
      { id: '1', name: '热门' },
      { id: '3', name: '我能兑换' },
      { id: '0', name: '全部' },
    ],
    nav: '1',

    isShow: false,
    pageNo: 1,
    limit: 10,
    isMore: true,
    list: null,
  },

  //主导航点击
  changeNav: function (e) {
    this.setData({
      nav: e.currentTarget.dataset.nav,
      isMore: true,
      pageNo: 1,
      list: null,
    })
    this.getList();
   
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      isMore: true,
      pageNo: 1,
      list: null,
    })
    app.checkLogin(() => {
      this.getList();
    });
  },

  getList: function () {
    var _this = this;
    if (!_this.data.isMore) {
      return false;
    }
    app.load.show();
    app.ajax({
      url: app.api + 'gift/lists',
      type: 'GET',
      data: {
        page: _this.data.pageNo,
        limit: _this.data.limit,
        type: _this.data.nav
      },
      success(res) {
        let lists = res.lists;
        for (var key in lists) {
          var item = lists[key];
         
        }
        if (_this.data.pageNo == 1) {
          _this.setData({
            list: lists,
            expertList: res.expert,
            bannerList: res.banner,
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
    this.getList()
  },

})