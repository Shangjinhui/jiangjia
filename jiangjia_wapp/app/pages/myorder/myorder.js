// pages/myorder/myorder.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.imgUrl,
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
      this.getList()
    });
  },

  getList: function () {
    var _this = this;
    if (!_this.data.isMore) {
      return false;
    }
    app.load.show();
    app.ajax({
      url: app.api + 'expert/my_order',
      type: 'GET',
      data: {
        page: _this.data.pageNo,
        limit: _this.data.limit,
      },
      success(res) {
        let lists = res.data;
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

  goInfo:function(e){
    var item = e.currentTarget.dataset.item;
    if (item.orderStaus==2){
      return false;
    }
    if(item.type==1){
      wx.navigateTo({
        url: '/pages/expertArticle/expertArticle?id=' + item.about_id+'&status=0',
      })
    }else{
      if (item.status!=2){
        wx.navigateTo({
          url: '/pages/liveInfo/liveInfo?id=' + item.about_id + '&status=0',
        })
      }
    }
  }


})