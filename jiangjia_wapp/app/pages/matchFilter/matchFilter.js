// pages/matchFilter/matchFilter.js
const app = getApp();
const util = require('../../libs/util.js');

Page({
  /** 
   * 页面的初始数据 
   */
  data: {
    imgUrl: app.imgUrl,
    isIphoneX: app.globalData.isIphoneX,
    navList: [{
        id: '1',
        name: '完整'
      },
      {
        id: '2',
        name: '一级'
      },
      {
        id: '3',
        name: '竞彩'
      },
      {
        id: '4',
        name: '北单'
      },
      {
        id: '5',
        name: '足彩'
      },
    ],
    nav: '1',

    fotNum: 0,

    date: '', //选中日期 2020-07-09
    competition:'',
    competitionList: [], //赛事id

    type: '',





    isActive: null,
    toView: 'inTo0',
    oHeight: [],
    scroolHeight: 0,
    fixedTop: 0,
    listMain: [], //赛事全部列表


    competition_yj: [], //一级赛事列表
    competition_jc: [], //竞彩赛事列表
    competition_bd: [], //北单赛事列表
    competition_zc: [], //足彩赛事列表


    list: [],
    matInfo: '', //筛选条件

    isChoose:false,
    isShow:false,
    isScroll:true

  },


  onLoad: function(options) {
    var _this = this;
    _this.setData({
      date: options.date,
      type: options.type,
    })
    if (wx.getStorageSync('matInfo')){
      var nowDate = util.fdate1((new Date()).getTime(), 'yyyy-MM-dd');
      var matInfo = JSON.parse(wx.getStorageSync('matInfo'));
      if (nowDate == matInfo.date){
        var competitionList = matInfo.list[options.type] && matInfo.list[options.type].competition ? matInfo.list[options.type].competition.split(',') : []
        _this.setData({
          matInfo: matInfo,
          nav: matInfo.list[options.type] && matInfo.list[options.type].nav? matInfo.list[options.type].nav :'1',
          competitionList: competitionList,
          isChoose: competitionList.length > 0?true:false
        })
        console.log(_this.data.competitionList)
      }else{
        wx.removeStorageSync('matInfo')
      }
     
    }

    _this.getList()
   
  
     
   
  },


  // 筛选列表
  getList: function() {
    var _this = this;
    app.load.show();
    app.ajax({
      url: app.api + 'football/filter_list',
      type: 'GET',
      data: {
        date: _this.data.date,
        type: _this.data.type
      },
      success(res) {
        for (var key in res.competition_list) {
          res.competition_list[key].id = key;
          res.list = _this.selected(res.competition_list[key].list,1);
        }
        res.competition_yj = _this.selected(res.competition_yj,2);
        res.competition_jc = _this.selected(res.competition_jc,3);
        res.competition_bd = _this.selected(res.competition_bd,4);
        res.competition_zc = _this.selected(res.competition_zc,5);

        _this.setData({
          listMain: res.competition_list,
          competition_yj: res.competition_yj,
          competition_jc: res.competition_jc,
          competition_bd: res.competition_bd,
          competition_zc: res.competition_zc,
        })
        
        _this.setList();

      },
      complete() {
        app.load.hide();
      }
    });
  },

  //默认全部选中
  selected: function(data,cur) {
    var competitionList = this.data.competitionList;
    for (var key in data) {
      var item = data[key];
      item.isCheck = this.data.isChoose?false:true;
      if (competitionList.length > 0 && cur == this.data.matInfo.list[this.data.type].nav){
          for (var comkey in competitionList){
              if (competitionList[comkey] == item.competition_id){
                item.isCheck = true;
                competitionList.splice(comkey, 1); 
              }
          }
        }
      }
    return data;
  },

  //tab切换
  changeNav: function(e) {
    var _this=this;
    _this.setData({
      nav: e.target.dataset.nav
    })
    _this.setList();
    
  },

  //除完整之外的初始列表赋值
  setList: function (e) {
    var _this = this;
    var list;
    if (_this.data.nav == 1) {
      _this.getBrands();
    } else if (_this.data.nav == 2) {
      this.setData({
        list: _this.data.competition_yj
      })
    } else if (_this.data.nav == 3) {
      this.setData({
        list: _this.data.competition_jc
      })
    } else if (_this.data.nav == 4) {
      this.setData({
        list: _this.data.competition_bd
      })
    } else if (_this.data.nav == 5) {
      this.setData({
        list: _this.data.competition_zc
      })
    }

    
  },

  //反赋值
  setOriginal:function(){
    var _this = this;
    var list = _this.data.list;
    if (_this.data.nav == 2) {
      this.setData({
        competition_yj:list
      })
    } else if (_this.data.nav == 3) {
      this.setData({
        competition_jc: list
      })
    } else if (_this.data.nav == 4) {
      this.setData({
        competition_bd: list
      })
    } else if (_this.data.nav == 5) {
      this.setData({
        competition_zc: list
      })
    }
  },



  //底部快捷选择
  checkNum: function(e) {
    var _this = this;
    var fotNum = e.target.dataset.cur;

    if (_this.data.nav == 1) {

      var list = _this.data.listMain;
      for (var key in list) {
        for (var listKey in list[key].list) {
          var item = list[key].list[listKey];
          if (fotNum == 1) {
            item.isCheck = false;
            if (item.yj == 1) {
              item.isCheck = true;
            }
          } else if (fotNum == 2) {
            item.isCheck = true;
          } else if (fotNum == 3) {
            item.isCheck = !item.isCheck;
          }
        }
      }
      this.setData({
        listMain: list
      })


    }else{
      var list = _this.data.list;
      for (var key in list) {
          var item = list[key];
         if (fotNum == 2) {
            item.isCheck = true;
          } else if (fotNum == 3) {
           item.isCheck = !item.isCheck;
        }
      }
      this.setData({
        list: list
      })
    }

    this.setData({
      fotNum: e.target.dataset.cur,
    })

    this.setOriginal()
  },

  //赛事选择
  checkMatch: function(e) {
    var _this = this;
    var index = e.target.dataset.index;
    var list = [];
    if (_this.data.nav == '1') { //完整
      var idx = e.target.dataset.idx;
      list = _this.data.listMain;
      // console.log(list[index].list[idx].isCheck)
      list[index].list[idx].isCheck = !list[index].list[idx].isCheck;
      _this.setData({
        listMain: list
      })
    }else{
      list = _this.data.list;
      list[index].isCheck = !list[index].isCheck;
      _this.setData({
        list: list
      })
    }

    _this.setOriginal()

  },

  confirm:function(){
    var _this=this;
    var list;
    var competitionList=[]
    if(_this.data.nav==1){
      list = _this.data.listMain;
      for (var key in list) {
        for (var listKey in list[key].list) {
          var item = list[key].list[listKey];
          if (item.isCheck){
            competitionList.push(item.competition_id)
          }
        }
      }
    }else{
      list = _this.data.list;
      for (var key in list) {
        var item = list[key];
        if (item.isCheck) {
          competitionList.push(item.competition_id)
        }
      }
    }

    if (competitionList.length==0){
      wx.showToast({
        title: '至少选择一个赛事',
        icon: 'none',
      });
      return false;
    }

    var matInfo = this.data.matInfo;
    var list = matInfo.list ? matInfo.list:[]
    list[_this.data.type] = { nav: _this.data.nav,competition: competitionList.join(',') }
    var date = util.fdate1((new Date()).getTime(), 'yyyy-MM-dd')
   
    wx.setStorageSync('matInfo', JSON.stringify({ date: date,list:list}))
    wx.setStorageSync('pageMatchFilter', '1')
    wx.navigateBack({
      delta: 1
    })
  },


  // 处理数据格式，及获取分组高度
  getBrands: function() {
    var _this = this;
    var number = 0

    //计算分组高度,wx.createSelectotQuery()获取节点信息
    for (let i = 0; i < _this.data.listMain.length; ++i) {
      wx.createSelectorQuery().select('#inTo' + _this.data.listMain[i].id).boundingClientRect(function(rect) {
        number = rect.height + number;
        var newArry = [{
          'height': number,
          'key': rect.dataset.id,
          "name": _this.data.listMain[i].first_char
        }]
        _this.setData({
          oHeight: _this.data.oHeight.concat(newArry)
        })
        
      }).exec();
    };
  },

  //点击右侧字母导航定位触发
  scrollToViewFn: function(e) {
    var _this = this;
    var _id = e.target.dataset.id;
    for (var i = 0; i < _this.data.listMain.length; ++i) {
      if (_this.data.listMain[i].id === _id) {
        _this.setData({
          isActive: _id,
          toView: 'inTo' + _id,
          isScroll:false
        })

        setTimeout(function(){
          _this.setData({
            isScroll: true
          })
        },100)
      }
    }
  },

  // 页面滑动时触发
  onPageScroll: function(e) {
    var scrollTop = e.detail ? e.detail.scrollTop : e.scrollTop
    this.setData({
      scroolHeight: scrollTop
    });
    if (!this.data.isScroll){return false;}
    if (this.data.oHeight.length == this.data.listMain.length ) {
      for (let i in this.data.oHeight) {
        if (scrollTop < this.data.oHeight[i].height) {
          this.setData({
            isActive: this.data.oHeight[i].key,
          });
          return false;
        }
      }
    }
    
  },
})