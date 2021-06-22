//index.js
const app = getApp();
const util = require('../../libs/util.js');
var timer
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.imgUrl,
    isIphoneX: app.globalData.isIphoneX,
    navList:[],
    nav:1,
    isShow: false,
    type1:1,
    typeList1:[
      { id: 1, name: '人气' },
      { id: 2, name: '命中率' },
    ],//热点分类
    type2: 1,
    typeList2: [
      { id: 1, name: '人气榜' },
      { id: 2, name: '命中榜' },
      { id: 3, name: '连红榜' }
    ],//专家分类
    type3: 1,
    typeList3: [],//精彩回顾分类

    // pageNo: 1,
    pageNo1: 1,
    pageNo2: 1,
    pageNo3: 1,
    pageNo4: 1,
    limit: 10,
    isMore1: true,
    isMore2: true,
    isMore3: true,
    isMore4: true,
    list1: null,
    list2: null,

    homeExpertList: null,//热点专家列表
    expertList:null,//专家列表
    bannerList: null,//banner
    directList: null,//热点直播列表
    directListAll: null,//直播列表
    reviewList: null,//精彩回顾列表
    canWatch:false,
    isFirst:true

  },

  onLoad: function (options){
    if (wx.getStorageSync('nav')) {
      this.setData({
        nav: wx.getStorageSync('nav')
      })
      wx.removeStorageSync('nav');

    }
    this.getIpdirect()
    var _this = this;
    this.setBack()
    if (wx.getStorageSync('nav')) {
      this.setData({
        nav: wx.getStorageSync('nav')
      })
      wx.removeStorageSync('nav')
    }
    if (wx.getStorageSync('Token')) {
      app.checkLogin(() => {
        _this.getIndex();
      });
    } else {
      _this.getIndex();
    }
  },


  onShow:function(){
    // var _this = this;
    // this.setBack()
    // if (wx.getStorageSync('nav') ){
    //   this.setData({
    //     nav: wx.getStorageSync('nav')
    //   })
    //   wx.removeStorageSync('nav')
    // }
    // if (wx.getStorageSync('Token')) {
    //   app.checkLogin(() => {
    //     _this.getIndex();
    //   });
    // } else {
    //   _this.getIndex();
    // }
  },

  //通过ip获取该用户是否可以观看直播
  getIpdirect: function () {
    var _this = this;
    app.ajax({
      url: app.api + 'expert/ip_direct',
      type: 'GET',
      success(res) {
        var navList=[
            { id: 1, name: '热点' },
            { id: 2, name: '专家' },
          ]
        if (res.canWatchDirect==1){
          navList.push({ id: 3, name: '直播' })
          _this.setData({
            canWatch: true
          })
        }
        if (res.review == 1) {
          navList.push({ id: 4, name: '精彩回顾' })
        }
        _this.setData({
          navList: navList,
        })
      },
      complete() {
      }
    });
  },

  //获取首页信息
  getIndex:function(){
    clearInterval(timer);
    if(this.data.nav==1){
      if (!(this.data.bannerList && this.data.list1)){
        this.getIndexList();
      }
    } 
    if (this.data.nav == 2) { //专家
      if (!(this.data.expertList && this.data.list2)) {
        this.getExpertList();
      }
    }
    if(this.data.nav==3){//直播
      if (!(this.data.directListAll)) {
        this.getDirectList();
      }
    }
    if (this.data.nav == 4){
      if (this.data.typeList3.length==0) {
        this.getType();
      }else{
        if (!(this.data.reviewList)) {
          this.getReviewList();
        }
      }
    }
   
  },

  //主导航点击
  changeNav:function(e){
    this.setData({
      nav: e.currentTarget.dataset.nav
    })
    this.getIndex()
    if (this.data.nav == 3) {
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#022B43',
        animation: {
          duration: 400,
          timingFunc: 'easeIn'
        }
      })
    }else{
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#BC0100',
        animation: {
          duration: 400,
          timingFunc: 'easeIn'
        }
      })
    }

    this.setBack()
   
  },
  //设置背景颜色
  setBack:function(){
    if (this.data.nav == 1) {
      wx.setBackgroundColor({
        backgroundColor:'#BC0100',
        backgroundColorTop: '#BC0100',
        backgroundColorBottom: '#F4F7FA',
      })
    } else if (this.data.nav == 3) {
      wx.setBackgroundColor({
        backgroundColor:'#022B43',
        backgroundColorTop: '#022B43',
        backgroundColorBottom: '#022B43',
      })
    } else {
      wx.setBackgroundColor({
        backgroundColor:'#F4F7FA',
        backgroundColorTop: '#F4F7FA',
        backgroundColorBottom: '#F4F7FA',
      })
    }
  },

  //热点首页
  getIndexList: function () {
    var _this = this;
    if (!_this.data.isMore1) {
      return false;
    }
    app.load.show();
    app.ajax({
      url: app.api + 'common/index',
      type: 'GET',
      data: {
        page: _this.data.pageNo1,
        limit: _this.data.limit,
        type: _this.data.type1
      },
      success(res) {
        let lists = res.article.data;
        for (var key in lists) {
          var item = lists[key];
          if (item.createTime) {
            item.time = util.fdate(item.createTime, 'MM-dd HH:mm')
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

        }
        if (_this.data.pageNo1 == 1) {
          _this.setData({
            list1: lists,
            homeExpertList: res.expert,
            bannerList: res.banner,
            isShow: true
          })

          if (_this.data.canWatch && _this.data.isFirst){
            _this.getDirectIndexList();
            _this.setData({
              isFirst:false
            })
            timer = setInterval(function () {
              _this.getDirectIndexList()
            }, 30000)
          }

        } else {
          _this.setData({
            list1: _this.data.list1.concat(lists)
          })
        }
        const total = res.article.count;
        if (_this.data.pageNo1 * _this.data.limit < parseInt(total)) { // 仍未加载完
          _this.setData({
            isMore1: true,
            pageNo1: _this.data.pageNo1 + 1
          });
        } else { // 加载完了
          _this.setData({
            isMore1: false
          });
        }
      },
      complete() {
        app.load.hide();
        wx.stopPullDownRefresh();
      }
    });
  },

  //热点直播
  getDirectIndexList: function () {
    var _this = this;
    app.ajax({
      url: app.api + 'common/direct_index',
      type: 'GET',
      success(res) {
        for(var key in res){
          var item=res[key];
          if (item.directStartTime){
            item.time = util.fdate(item.directStartTime, 'MM-dd HH:mm');
          }
        }
        _this.setData({
          directList:res
        })
        
      },
      complete() {
      }
    });
  },


  //专家模块首页	
  getExpertList: function () {
    var _this = this;
    if (!_this.data.isMore2) {
      return false;
    }
    app.load.show();
    app.ajax({
      url: app.api + 'expert/expert_index',
      type: 'GET',
      data: {
        page: _this.data.pageNo2,
        limit: _this.data.limit,
        type: _this.data.type2
      },
      success(res) {
        let lists = res.article.data;
        for(var key in lists){
          var item=lists[key];
          if (item.createTime){
            item.time = util.fdate(item.createTime, 'MM-dd HH:mm')
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
        }
        if (_this.data.pageNo2 == 1) {
          _this.setData({
            list2: lists,
            expertList: res.expert,
            isShow: true
          })

        } else {
          _this.setData({
            list2: _this.data.list2.concat(lists)
          })
        }
        const total = res.article.count;
        if (_this.data.pageNo2 * _this.data.limit < parseInt(total)) { // 仍未加载完
          _this.setData({
            isMore2: true,
            pageNo2: _this.data.pageNo2 + 1
          });
        } else { // 加载完了
          _this.setData({
            isMore2: false
          });
        }
      },
      complete() {
        app.load.hide();
        wx.stopPullDownRefresh()
      }
    });
  },

  //直播列表页
  getDirectList: function () {
    var _this = this;
    if (!_this.data.isMore3) {
      return false;
    }
    app.load.show();
    app.ajax({
      url: app.api + 'expert/direct_lists',
      type: 'GET',
      data: {
        page: _this.data.pageNo3,
        limit: _this.data.limit
      },
      success(res) {
        let lists = res.data;
        for (var key in lists) {
          var item = lists[key];
          if (item.match_time) {
            item.time = util.fdate1(item.match_time*1000, 'MM-dd HH:mm');
            item.ftime = util.fdate1(item.match_time * 1000, 'E');
          }
        }
        if (_this.data.pageNo3 == 1) {
          _this.setData({
            directListAll: lists,
            isShow: true
          })

        } else {
          _this.setData({
            directListAll: _this.data.directListAll.concat(lists)
          })
        }
        const total = res.count;
        if (_this.data.pageNo3 * _this.data.limit < parseInt(total)) { // 仍未加载完
          _this.setData({
            isMore3: true,
            pageNo3: _this.data.pageNo3 + 1
          });
        } else { // 加载完了
          _this.setData({
            isMore3: false
          });
        }
      },
      complete() {
        app.load.hide();
        wx.stopPullDownRefresh()
      }
    });
  },

  //精彩回顾类别
  getType:function(){
    var _this = this;
    app.ajax({
      url: app.api + 'expert/review_type',
      type: 'GET',
      success(res) {
        _this.setData({
          typeList3: res,
          type3: res[0]? res[0].id:'',
        })
        _this.getReviewList();
      },
      complete() {
      }
    });
  },

  //分类切换
  changeType: function (e) {
    var type = e.currentTarget.dataset.type;
    var cur = e.currentTarget.dataset.cur;

    this.setData({
      [cur]: type,
    })
    if (this.data.nav == 4) {
      this.setData({
        isMore4: true,
        pageNo4: 1,
      })
      this.getReviewList();
    } else if (this.data.nav == 1){
      this.setData({
        isMore1: true,
        pageNo1: 1,
      })
      this.getIndexList();
    } else if (this.data.nav == 2) {
      this.setData({
        isMore2: true,
        pageNo2: 1,
      })
      this.getExpertList();
    } 
  },

  // 精彩回顾列表
  getReviewList: function () {
    var _this = this;
    if (!_this.data.isMore4) {
      return false;
    }
    app.load.show();
    app.ajax({
      url: app.api + 'expert/review_list',
      type: 'GET',
      data: {
        page: _this.data.pageNo4,
        limit: _this.data.limit,
        type:_this.data.type4
      },
      success(res) {
        let lists = res.data;
        for (var key in lists) {
          var item = lists[key];
          if (item.createTime) {
            item.time = util.fdate(item.createTime, 'MM-dd HH:mm');
          }
        }
        if (_this.data.pageNo4 == 1) {
          _this.setData({
            reviewList: lists,
            isShow: true
          })

        } else {
          _this.setData({
            reviewList: _this.data.reviewList.concat(lists)
          })
        }
        const total = res.count;
        if (_this.data.pageNo4 * _this.data.limit < parseInt(total)) { // 仍未加载完
          _this.setData({
            isMore4: true,
            pageNo4: _this.data.pageNo4 + 1
          });
        } else { // 加载完了
          _this.setData({
            isMore4: false
          });
        }
      },
      complete() {
        app.load.hide();
        wx.stopPullDownRefresh()
      }
    });
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var _this = this;
    if(_this.data.nav==1){
      _this.getIndexList()
    } else if (_this.data.nav ==2){
      _this.getExpertList();
    } else if (_this.data.nav == 3) {
      _this.getDirectList();
    }else{

    }
    
  },


  onUnload: function () {
    clearInterval(timer)
  },
  onHide: function () {
    clearInterval(timer)
  },


  // 轮播图类型 1-外链 2-跳转即说 3-编辑器 4-跳转比赛
  goInfo: function (e) {
    var item = e.currentTarget.dataset.item;
    if (item.type == 1) {
      wx.navigateTo({
        url: '/pages/webView/webView?link='+item.link,
      })
    } else if (item.type == 2) {
      wx.navigateTo({
        url: '/pages/expertArticle/expertArticle?id=' + item.link + '&status=0',
      })
    } else if (item.type == 4) {
      wx.navigateTo({
        url: '/pages/matchInfo/matchInfo?id=' + item.link,
      })
    } else if (item.type == 3){
      wx.navigateTo({
        url: '/pages/rules/rules?state=3&id=' + item.id,
      })
    } else if (item.type == 5) {
      wx.navigateTo({
        url: '/pages/liveInfo/liveInfo?id=' + item.link,
      })
    }
  },

  onPullDownRefresh(){
    clearInterval(timer);
    if (this.data.nav == 1) {
      this.setData({
        pageNo1:1,
        isMore1:true
      })
      this.getIndexList();
    }
    if (this.data.nav == 2) { //专家
      this.setData({
        pageNo2: 1,
        isMore2: true
      })
      this.getExpertList();
      
    }
    if (this.data.nav == 3) {//直播
      this.setData({
        pageNo3: 1,
        isMore3: true
      })
      this.getDirectList();
    }
    if (this.data.nav == 4) {
      this.setData({
        pageNo4: 1,
        isMore4: true
      })
      this.getReviewList();
    }
  },

})
