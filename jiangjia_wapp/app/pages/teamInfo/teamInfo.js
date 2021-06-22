// pages/teamInfo/teamInfo.js
const app = getApp();
const util = require('../../libs/util.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.imgUrl,
    isFixed:false,
    navList: [
      { id: '1', name: '基本信息' },
      { id: '2', name: '积分榜' },
      { id: '3', name: '比赛' },
      { id: '4', name: '阵容' },
      { id: '5', name: '最佳球员' },
    ],
    nav: '1',
    height:0,
    current:0,
    id:'',
    info:'',
    isShow:false,



    teamStage: [],//积分联盟选项
    stageNum: 0,//积分联盟选中下标
    pointList: null,//积分列表


    pageNo: 1,
    limit: 10,
    isMore: true,
    list: null,//比赛列表
    recentMatch:'',//最新比赛

    squadInfo:'',//阵容

    playerInfo: null,//最佳球员
    typeList:[
      { id: 1, name:'射手榜'},
      { id: 2, name: '助攻榜' },
      { id: 3, name: '射门' },
      { id: 4, name: '射正' },
      { id: 5, name: '传球' },
      { id: 6, name: '成功传球' },
      { id: 7, name: '关键传球' },
      { id: 8, name: '拦截' },
      { id: 9, name: '封堵' },
      { id: 10, name: '解围' },
      { id: 11, name: '扑救' },
      { id: 12, name: '黄牌' },
      { id: 13, name: '红牌' },
      { id: 14, name: '出场时间' },

    ],
    type:1,

    isHome:false,//是否关闭其他页面


    condition: false,
    cateDate: [],//总列表
    cate: '',
    cateId: '',
    cateList: [],
    season: '',
    seasonId: '',
    seasonList: [],
    value: [0, 0],
    values: [0, 0],
    editcate: '',
    editseason: '',
    scrollTop:0,


    yearsList:[],
    year:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;

    _this.setData({
      id:options.id
    })
   
    let systemInfo = wx.getSystemInfoSync();
    var pixelRatio = 750 / systemInfo.windowWidth
    _this.setData({
      height: systemInfo.windowHeight - (72 + 112 + 144+88) / pixelRatio
    })

    if (options.flagCode) {
      wx.setStorageSync('otflagCode', options.flagCode)
    }
    _this.getInfo();
    
    app.checkLogin(() => {
      
    });
   

    var pageLength = getCurrentPages().length;
    if (pageLength>=7){
      _this.setData({
        isHome:true
      })
    }

    wx.setBackgroundColor({
      backgroundColorTop: '#022B43',
      backgroundColorBottom: '#F4F7FA',
    })

  },

  getInfo: function () {
    var _this = this;
    app.load.show();
    app.ajax({
      url: app.api + 'football/team_info',
      type: 'GET',
      data: {
        teamId: _this.data.id,
      },
      success(res) {
        
        if (res.recent_match){
          res.recent_match.match_time = util.fdate1(res.recent_match.match_time * 1000, 'yy/MM/dd HH:mm');
        }
        if (res.end_match){
          var endMatchCur = []

          for (var key in res.end_match){
            var item = res.end_match[key];
            item.time = util.fdate(item.match_time_date, 'yyyy-MM-dd');
            if (item.home_scores[0] > item.away_scores[0]){
              if (item.home_team_id==_this.data.id){
                endMatchCur.push('胜' )
              }else{
                endMatchCur.push('负')
              }
            } else if (item.home_scores[0] == item.away_scores[0]){
              endMatchCur.push('平')
            }else{
              if (item.home_team_id == _this.data.id) {
                endMatchCur.push('负')
              } else {
                endMatchCur.push('胜')
              }
            }
          }
          res.endMatchCur = endMatchCur;
        }
        _this.setData({
          info:res,
          isShow:true
        })
        wx.setNavigationBarTitle({ 
          title: res.team_info.team_name
        })
      },
      complete() {
        app.load.hide();
      }
    });
  },

  getPoint: function () {
    var _this = this;
    app.load.show();
    app.ajax({
      url: app.api + 'football/team_point',
      type: 'GET',
      data: {
        teamId: _this.data.id,
        seasonId: _this.data.stageNum ? _this.data.teamStage[_this.data.stageNum].season_id : '',//赛季id
        stageId: _this.data.stageNum ? _this.data.teamStage[_this.data.stageNum].stage_id : ''//阶段id
      },
      success(res) {
        var list = res.table;
        for(var key in list){
          var newList=[];
          var newInfo = list[key].list[0].promotion_name_zh;
          var num=0;
          for(var itkey in list[key].list){
            var item = list[key].list[itkey];
            
            if (newInfo != item.promotion_name_zh){
              num=num+1;
              newInfo = item.promotion_name_zh;
            }
            if (newList[num] && newList[num].list){
              newList[num].list.push(item);
            }else{
              var listN = { name: '', list: [], promotion_color: '' };
              listN.name = newInfo;
              listN.promotion_color = item.promotion_color;
              listN.list.push(item);
              newList[num] = listN;
            }
          }

          list[key].newList = newList
        }

        for (var key in res.team_stage){
          var item = res.team_stage[key];
          item.name = item.year + ' ' + item.competition_name + item.stage_name;
          if (item.isCheck==1){
            _this.setData({
              stageNum:key
            })
          }
        }

        _this.setData({
          teamStage: res.team_stage,
          pointList: list
        })
     
      },
      complete() {
        app.load.hide();
      }
    });
  },

  //积分联盟选择
  bindPickerChange: function (e) {
    this.setData({
      stageNum: e.detail.value
    })
    this.getPoint();
  },

  // 比赛年份筛选
  bindPickerMatch:function(e){
    this.setData({
      year: e.detail.value,
      isMore: true,
      pageNo: 1,
    })
    this.getMatchList();
  },

  // 足球球队--比赛
  getMatchList: function () {
    var _this = this;
    if (!_this.data.isMore) {
      return false;
    }
    app.load.show();
    app.ajax({
      url: app.api + 'football/team_match',
      type: 'GET',
      data: {
        pageNo: _this.data.pageNo,
        limit: _this.data.limit,
        teamId: _this.data.id,
        year: _this.data.yearsList.length > 0 ? _this.data.yearsList[_this.data.year].year:''
      },
      success(res) {
        let lists = res.list;
        for (var key in lists) {
          for (var itkey in lists[key].list){
            var item = lists[key].list[itkey];
            if (item.match_time) {
              item.time = util.fdate1(item.match_time*1000, 'yy/MM/dd HH:mm');
            }
          }
        }
        // if (res.recent_match.match_time) {
        //   res.recent_match.time = util.fdate1(res.recent_match.match_time * 1000, 'yy/MM/dd HH:mm');
        // }
        if (_this.data.pageNo == 1) {
          var year=0
          for(var key in res.years){
            var item=res.years[key];
            if(item.isCheck==1){
              year=key
            }
          }
          _this.setData({
            list: lists,
            yearsList:res.years,
            year:year,
            // recentMatch: res.recent_match,
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
    if (this.data.nav == '3') {
      this.getMatchList()
    }

  },

  // 足球球队--阵容
  getSquad: function () {
    var _this = this;
    app.load.show();
    app.ajax({
      url: app.api + 'football/team_squad',
      type: 'GET',
      data: {
        teamId: _this.data.id,
      },
      success(res) {
        _this.setData({
          squadInfo: res
        })

      },
      complete() {
        app.load.hide();
      }
    });
  },

  // 最佳球员
  getPlayer: function () {
    var _this = this;
    app.load.show();
    app.ajax({
      url: app.api + 'football/team_player',
      type: 'GET',
      data: {
        teamId: _this.data.id,
        type: _this.data.type,
        seasonId: _this.data.seasonId
      },
      success(res) {
       
        _this.setData({
          playerInfo: res.list,
          categoryList: res.category
        })

        
        if (!_this.data.seasonId && res.category.length>0){
          _this.getseason();
        }

      },
      complete() {
        app.load.hide();
      }
    });
  },


  changeType:function(e){
    var _this = this;
    _this.setData({
      type: e.currentTarget.dataset.type
    })
    _this.getPlayer();
  },
  


  // 初始赋值
  getseason: function () {
    let _this = this;

    let cateDate = _this.data.categoryList;
    const cateList = [];
    const seasonList = [];

    for (let i = 0; i < cateDate.length; i++) {
      cateList.push({
        name: cateDate[i].competition_name
      });
    }
    for (let i = 0; i < cateDate[0].season_list.length; i++) {
      seasonList.push({
        oid: cateDate[0].season_list[i].season_id,
        name: cateDate[0].season_list[i].year
      })
    }
    _this.setData({
      cateDate: cateDate,
      cateList: cateList,
      seasonList: seasonList,
      editcate: cateList[0],
      editseason: seasonList[0] ? seasonList[0] : '',
      cate: cateList[0].name,
      season: seasonList[0].name,
    })
  },

  //选择
  areaShow: function () {
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-in-out',
    });
    this.animation = animation;
    animation.translateY(-285).step();
    this.setData({
      animationData: this.animation.export(),
      maskVisual: 'show',
      condition: !this.data.condition
    });
  },
  bindChange: function (e) {
    var val = e.detail.value
    var t = this.data.values;
    var cateDate = this.data.categoryList;

    if (val[0] != t[0]) {
      const seasonList = [];
      if (cateDate[val[0]].season_list.length > 0) {
        for (let i = 0; i < cateDate[val[0]].season_list.length; i++) {
          seasonList.push({ oid: cateDate[val[0]].season_list[i].season_id, name: cateDate[val[0]].season_list[i].year })
        }
      }
      this.setData({
        editcate: this.data.cateList[val[0]],
        editseason: seasonList[0] ? seasonList[0] : '',
        seasonList: seasonList,
        values: val,
        value: [val[0], 0]
      })
      return;
    }
    if (val[1] != t[1]) {
      this.setData({
        editseason: this.data.seasonList[val[1]] ? this.data.seasonList[val[1]] : '',
        values: val,
        value: [val[0], val[1]]
      })
      return;
    }


  },
  cascadeDismiss: function () {
    this.animation.translateY(285).step();
    this.setData({
      animationData: this.animation.export(),
      maskVisual: 'hidden',
      condition: !this.data.condition
    });
  },
  opened(e) {
    this.setData({
      condition: !this.data.condition
    })
  },
  confirm: function () {
    this.setData({
      condition: !this.data.condition,
      cate: this.data.editcate.name,
      season: this.data.editseason.name,
      seasonId: this.data.editseason.oid,
    })
    this.getPlayer();
  },


  



  //主导航点击
  changeNav: function (e) {
    var _this=this;
    _this.setData({
      nav: e.currentTarget.dataset.nav
    })

    if (_this.data.nav == 1) {
      // _this.getInfo();
    }else if (_this.data.nav == 2) {
      _this.getPoint();
    } else if (_this.data.nav == 3) {
      _this.setData({
        isMore: true,
        pageNo: 1,
        list: null,
      })
      _this.getMatchList();
    } else if (_this.data.nav == 4) {
      _this.getSquad();
    } else if (_this.data.nav == 5) {
      _this.getPlayer();
    }
  },
  

  // 页面滑动时触发
  onPageScroll: function (e) {
    var scrollTop = e.detail ? e.detail.scrollTop : e.scrollTop
    this.setData({
      scrollTop: scrollTop
    });
  },

  //基础信息比赛切换
  bindchange:function(e){
    this.setData({
      current: e.detail.current
    })
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var _this = this;
    // 每日分享获得积分
    app.ajax({
      url: app.api + 'member/share_point',
      type: 'GET',
      success(res) {

      },
      complete() {
      }
    });

    return {
      title: _this.data.info.team_info.team_name + '球队详情',
      path: '/pages/teamInfo/teamInfo?id=' + _this.data.id + '&flagCode=' + wx.getStorageSync('flagCode'),
      imageUrl: _this.data.imgUrl + 'share.jpg'
    }


  }
})