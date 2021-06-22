// pages/wallet_center/wallet_center.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.imgUrl,
    isIphoneX: app.globalData.isIphoneX,
    state:1,
    info:'',
    isShow:false,

    pageNo: 1,
    limit: 10,
    isMore: true,
    list: null,
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    app.checkLogin(() => {
      this.getInfo()
    });
  },
  getInfo: function () {
    var _this = this;
    app.load.show();
    app.ajax({
      url: app.api + 'member/info',
      type: 'GET',
      success(res) {
        _this.setData({
          info: res,
          isShow:true
        })
        _this.setData({
          isMore: true,
          pageNo: 1,
          list: null,
        })
        _this.getList()
      },
      complete() {
        app.load.hide();
      }
    });

  },
  changeState: function (e) {
    this.setData({
      state: e.currentTarget.dataset.id,
      isMore: true,
      pageNo: 1,
      list: null,
    })
    this.getList()
  },


  getList: function () {
    var _this = this;
    if (!_this.data.isMore) {
      return false;
    }
    var url;
    if(_this.data.state==1){
      url = app.api +'member/obtain_gold_list';
    } else if (_this.data.state == 2){
      url = app.api +'member/withdraw_list';
    } else  {
      url = app.api + 'member/consume_gold_list';
    }
    app.load.show();
    app.ajax({
      url: url,
      type: 'GET',
      data: {
        pageNo: _this.data.pageNo,
        limit: _this.data.limit,
      },
      success(res) {
        let lists = res.list;
        for (var key in lists) {
          var item = lists[key];

          // if (item.directStartTime) {
          //   item.time = util.fdate(item.directStartTime, 'MM-dd HH:mm');
          //   item.ftime = util.fdate(item.directStartTime, 'E');
          // }
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


})