// pages/expert/expert.js
const app = getApp();
Page({
  /** 
   * 页面的初始数据 
   */
  data: {
    imgUrl: app.imgUrl,
    navList: [
      { id: '', name:'全部'},
      { id: 1, name: '人气榜' },
      { id: 2, name: '命中榜' },
      { id: 3, name: '连红榜' }
    ],
    nav:1,
    isActive: null,
    fixedTitle: null,
    toView: 'inTo1',
    oHeight: [],
    scroolHeight: 0,
    fixedTop: 0,

    isShow: false,
    list: null,
    keyword:'',

    submited:true

  },

  onLoad: function(options) {
    var _this = this;
    
  },
  onShow: function () {
    var _this = this;
    this.getExpertList();
  },

  bindinput: function (e) {
    this.setData({
      [e.currentTarget.dataset.cur]: e.detail.value
    })
  },

  //专家模块首页	
  getExpertList: function () {
    var _this = this;
    app.load.show();
    app.ajax({
      url: app.api + 'expert/expert_lists',
      type: 'GET',
      data: {
        type: _this.data.nav,
        keyword: _this.data.keyword
      },
      success(res) {
        let lists = res.data;
        if(_this.data.nav==''){
          var id=1
          var newList=[]
          for(var key in lists){
            var item = lists[key];
            var labelList = [];
            if (item.label) {
              labelList.push(item.label)
            }
            if (item.continueFocus >= 3) {
              labelList.push(item.continueFocus + '连红')
            }
            if (labelList.length < 2 && item.focus >= 10 && item.articleCount >= 20) {
              labelList.push('近20中' + item.focus)
            }
            if (labelList.length < 2 && item.focusArticleCount > 0) {
              labelList.push('总' + item.articleCount + '中' + item.focusArticleCount)
            }
            item.labelList = labelList;

            if (newList.length>0){
              var isHas=true
              for (var newKey in newList) {
                var newItem = newList[newKey]
                if (newItem.region == item.firstName){
                  // console.log(newItem.region, item)
                  newItem.items.push(item)
                  isHas = true
                }else{
                  isHas=false;
                }
              }
              if (!isHas){
                // console.log(key)
                newList.push({
                  id: id,
                  region: item.firstName,
                  items: [item]
                })
                id++
              }
            }else{
              newList.push({
                id: id,
                region: item.firstName,
                items: [item]
              })
              id++
            }
          }
          lists = newList;
        }else{
          if (lists.length>0){
            for (var key in lists){
              var item = lists[key];
              var labelList=[];
              if (item.label){
                labelList.push(item.label)
              }
              if (item.continueFocus >= 3){
                labelList.push(item.continueFocus +'连红')
              }
              if (labelList.length < 2 && item.focus >= 10 && item.articleCount >= 20){
                labelList.push('近20中' + item.focus )
              }
              if (labelList.length < 2 && item.focusArticleCount >0) {
                labelList.push('总'+item.articleCount+'中'+item.focusArticleCount)
              }
              item.labelList = labelList
            }
          }
        }
        _this.setData({
          list: lists,
          isShow: true
        })
        if (_this.data.nav == '') {
          _this.getBrands();
        }
      },
      complete() {
        app.load.hide();
      }
    });
  },

  //主导航点击
  changeNav: function (e) {
    this.setData({
      nav: e.currentTarget.dataset.nav,
      list:null
    })
    this.getExpertList()
  },

  // 处理数据格式，及获取分组高度
  getBrands: function() {
    var _this = this;
    var number = 0

    //计算分组高度,wx.createSelectotQuery()获取节点信息
    for (let i = 0; i < _this.data.list.length; ++i) {
      wx.createSelectorQuery().select('#inTo' + _this.data.list[i].id).boundingClientRect(function(rect) {
        number = rect.height + number;
        var newArry = [{
          'height': number,
          'key': rect.dataset.id,
          "name": _this.data.list[i].region
        }]

        _this.setData({
          oHeight: _this.data.oHeight.concat(newArry)
        })

      }).exec();
    };
  },

  //点击右侧字母导航定位触发
  scrollToViewFn: function (e) {
    var _this = this;
    var _id = e.target.dataset.id;
    for (var i = 0; i < _this.data.list.length; ++i) {
      if (_this.data.list[i].id === _id) {
        _this.setData({
          isActive: _id,
          toView: 'inTo' + _id,
        })
      }
    }
  },
  

  // 页面滑动时触发
  onPageScroll: function(e) {
    var scrollTop = e.detail ? e.detail.scrollTop : e.scrollTop
    this.setData({
      scroolHeight: scrollTop
    });
    for (let i in this.data.oHeight) {
      if (scrollTop < this.data.oHeight[i].height) {
        this.setData({
          isActive: this.data.oHeight[i].key,
          fixedTitle: this.data.oHeight[i].name
        });
        return false;
      }
    }
  },

  //收藏专家
  collectInfo:function(e){
    var _this = this;
    app.checkLogin(() => {
      var item = e.target.dataset.item;
      var idx = e.target.dataset.idx;
      if (!_this.data.submited) { return false; }
      _this.setData({ submited: false })
      app.ajax({
        url: app.api + 'expert/collect_expert',
        type: 'GET',
        data: {
          id: item.id,
          type: item.isCollect == 1 ? 2 : 1 //	1-关注 2-取消
        },
        success(res) {
          var list = _this.data.list;
          list[idx].isCollect = list[idx].isCollect == 1 ? 0 : 1
          _this.setData({
            list: list
          })
          wx.showToast({
            title: list[idx].isCollect == 1 ? '关注成功' : '取消关注',
            icon: 'success',
          });

        },
        complete() {
          _this.setData({ submited: true })
        }
      });
    });
    
  }


})