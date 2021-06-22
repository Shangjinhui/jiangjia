// pages/search/search.js
const app = getApp();
const util = require('../../libs/util.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.imgUrl,
    state:1,//1搜索  2搜索结果
    navList:[
      { id: 1, name:'专家'},
      { id: 2, name: '解读' },
      { id: 3, name: '比赛' }
    ],
    nav:1,

    hotList: [],
    historyList: [],
    title: '',
    isMore: true,
    pageNo: 1,
    limit: 20,
    list: null,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (wx.getStorageSync('historyList')) {
      var historyList = JSON.parse(wx.getStorageSync('historyList'));
      this.setData({
        historyList: historyList
      })
    }

    this.getSearchList();
  },

  //热门推荐
  getSearchList: function () {
    var _this = this;
    app.ajax({
      url: app.api + 'common/keyword',
      type: 'GET',
      success(res) {
        _this.setData({
          hotList: res
        })
      },
      complete() {
      }
    });
  },


  changeNav:function(e){
    this.setData({
      nav: e.currentTarget.dataset.id,
      isMore: true,
      pageNo: 1,
      list: null,
    })
    this.getList();
  },
  bindinput: function (e) {
    this.setData({
      [e.currentTarget.dataset.cur]: e.detail.value
    })
  },
  //清空搜索记录
  delHis: function () {
    wx.removeStorageSync('historyList')
    this.setData({
      historyList: []
    })
  },
  //搜索
  search: function (e) {
    var keyWord = this.data.title;
    if (!keyWord || keyWord.replace(/\s*/g, "") == '') {
      wx.showToast({
        title: '请输入关键字',
        icon: 'none',
      });
      return false;
    }
    var historyList = [keyWord];
    for (var key in this.data.historyList) {
      if (keyWord != this.data.historyList[key]) {
        historyList.push(this.data.historyList[key])
      }
    }
    if (historyList.length > 19) {
       historyList.pop();
    }
    wx.setStorageSync('historyList', JSON.stringify(historyList));
    this.setData({
      historyList: historyList,
      isMore: true,
      pageNo: 1,
      list: null,
    })
    this.getList();
    
  },
  //搜索历史
  historySearch: function (e) {
    var keyWord = e.currentTarget.dataset.name;
    this.setData({
      title: keyWord
    })
    this.search()
  },

  cancelSearch:function(){
    this.setData({
      state: 1,
      nav:1  ,
      title:''
    })
  },

  // 首页全局搜索
  getList: function () {
    var _this = this;
    if (!_this.data.isMore) {
      return false;
    }
    app.load.show();
    app.ajax({
      url: app.api + 'common/search_all',
      type: 'GET',
      data: {
        page: _this.data.pageNo,
        limit: _this.data.limit,
        type: _this.data.nav,
        word: _this.data.title
      },
      success(res) {
        let lists = res.result;
        if (lists.length > 0 && (_this.data.nav == 2 || _this.data.nav == 3)){
          for (var key in lists) {
            var item = lists[key];
            if (_this.data.nav == 2){
              if (item.createTime) {
                item.time = util.fdate(item.createTime, 'MM-dd HH:mm');
              }
              if (item.detail.length == 1) {
                item.mtime = util.fdate1(item.detail[0].match_time * 1000, 'MM-dd HH:mm')
              } else {
                if (item.detail[0].match_time > item.detail[1].match_time) {
                  item.mtime = util.fdate1(item.detail[1].match_time * 1000, 'MM-dd HH:mm')
                } else {
                  item.mtime = util.fdate1(item.detail[0].match_time * 1000, 'MM-dd HH:mm')
                }
              }

              var labelList = [];
              if (item.expert.label) {
                labelList.push(item.expert.label)
              }
              if (item.expert.continueFocus >= 3) {
                labelList.push(item.expert.continueFocus + '连红')
              }
              if (labelList.length < 2 && item.expert.focus >= 10 && item.expert.articleCount >= 20) {
                labelList.push('近20中' + item.expert.focus)
              }
              if (labelList.length < 2 && item.expert.focusArticleCount > 0) {
                labelList.push('总' + item.expert.articleCount + '中' + item.expert.focusArticleCount)
              }
              item.labelList = labelList


            }else{
              if (item.match_time) {
                item.time = util.fdate1(item.match_time * 1000, 'MM-dd HH:mm');
                item.ftime = util.fdate1(item.match_time * 1000, 'E');
              }
            }
            
           
           
          }
        }
        

        if (_this.data.pageNo == 1) {
          _this.setData({
            list: lists,
            state: 2
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
    this.getList();
  },

 
})