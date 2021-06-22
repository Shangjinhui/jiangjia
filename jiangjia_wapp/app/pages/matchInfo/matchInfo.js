// pages/matchInfo/matchInfo.js
const app = getApp();
const util = require('../../libs/util.js');
var multiple
let systemInfo = wx.getSystemInfoSync();
var timer
Page({
  /** 
   * 页面的初始数据 
   */
  data: {
    imgUrl: app.imgUrl,
    isIphoneX: app.globalData.isIphoneX,

    id: '',

    yuan: {
      height: 110
    },
    navList: [],
    nav: '1',
    state: 1,
    isFixed: false,

    optionList: [{
        id: 1,
        name: '让球'
      },
      {
        id: 2,
        name: '欧赔'
      },
      {
        id: 3,
        name: '总进球'
      },
    ],
    option: 1,

    homeFirst: '', //主队位置
    awayFirst: '', //客队位置
    multipleX: 0, //x倍数
    multipleY: 0, //y倍数


    matchInfo: '', //比赛详情
    tliveList: [], //文章直播
    incidentsList: [], //重要事件

    tipShow: false,

    pageNo: 1,
    limit: 10,
    isMore: true,
    list: null,

    squadInfo: '', //阵容信息

    asiaList: [], //让球
    euStatsList: [], //欧赔
    euStatsInfo: '', //欧赔参数
    bsList: [], //总进球

    inteInfo: '', //情报
    analyInfo: '', //数据
    historyList: [], //历史交锋
    historyInfo: '', //历史交锋统计
    sameShow1: false,
    sameShow4: false,

    sameShow2: false,
    sameShow3: false,

    isHome: false, //是否关闭其他页面


    canWatch: false, //是否显示直播
    canSwitch:false,//是否显示指数


  },

  onLoad: function(options) {
    if(options) this.setData({
      id: options.id
    })
    var windowidth = 750;
    multiple = windowidth / systemInfo.windowWidth
    // console.log(1334 / multiple)

    var pageLength = getCurrentPages().length;
    if (pageLength >= 7) {
      this.setData({
        isHome: true
      })
    }
    if (options&&options.flagCode) {
      wx.setStorageSync('otflagCode', options.flagCode)
    }
    this.getSwitch()
    app.checkLogin(() => {
      
    });

    this.refreshShow();
  },

  refreshShow: function() {
    var _this = this;
    _this.getIpdirect();
    // _this.getInfo()
    // clearInterval(timer)
    // timer = setInterval(function () {
    //   _this.getInfo()
    // }, 30000)
    if (_this.data.nav == 1) {

    } else if (_this.data.nav == 2) {
      _this.setData({
        isMore: true,
        pageNo: 1,
        list: null,
      })
      _this.getLiveList();
    } else if (_this.data.nav == 3) {
      _this.setData({
        isMore: true,
        pageNo: 1,
        list: null,
      })
      _this.getExpertList();
    } else if (_this.data.nav == 4) {
      _this.getSquadInfo();
    } else if (_this.data.nav == 5) {
      _this.getOddsInfo();
    } else if (_this.data.nav == 6) {
      _this.getInteInfo();
    } else if (_this.data.nav == 7) {
      _this.getAnalyInfo();
    }

  },

  //通过ip获取该用户是否可以观看直播
  getIpdirect: function() {
    var _this = this;
    app.ajax({
      url: app.api + 'expert/ip_direct',
      type: 'GET',
      success(res) {
        _this.setData({
          canWatch: res.canWatchDirect == 1 ? true : false,
        })
        _this.getInfo()
        clearInterval(timer)
        timer = setInterval(function() {
          _this.getInfo()
        }, 30000)
      },
      complete() {}
    });
  },

  //是否显示指数
  getSwitch: function () {
    var _this = this;
    app.ajax({
      url: app.api + 'common/odds_switch',
      type: 'GET',
      success(res) {
        _this.setData({
          canSwitch: res.odds_switch == 1 ? true : false,
        })
       
      },
      complete() { }
    });
  },



  onUnload: function () {
    clearInterval(timer)
  },
  onHide: function () {
    clearInterval(timer)
  },

  //比赛详情-赛况
  getInfo: function() {
    var _this = this;
    app.ajax({
      url: app.api + 'football/info',
      type: 'GET',
      data: {
        matchId: _this.data.id,
      },
      success(res) {
        var match = res.match;
        if (match.startBallTime > 0) {
          var nowTime = parseInt((new Date()).getTime() / 1000)
          if (match.status_id == 2) {
            match.time = parseInt((nowTime - match.startBallTime) / 60) + 1;
          } else if (match.status_id == 4 || match.status_id == 5) {
            match.time = parseInt((nowTime - match.startBallTime) / 60) + 45 + 1;
          }
        }
        match.matchTime = util.fdate1(match.match_time * 1000, 'yyyy年MM月dd日 HH:mm');


        // canvas

        var colw = 70 / multiple;
        _this.setData({
          yuan: {
            height: colw
          }
        })
        var can1=0.5;
        if (parseInt(match.home_attack) + parseInt(match.away_attack)!=0){
          can1 = match.away_attack / (parseInt(match.home_attack) + parseInt(match.away_attack))
        }
        var can2 = 0.5;
        if (parseInt(match.home_dangerous_attack) + parseInt(match.away_dangerous_attack) != 0) {
          can2 = match.away_dangerous_attack / (parseInt(match.home_dangerous_attack) + parseInt(match.away_dangerous_attack))
        }
        var can3 = 0.5;
        if (parseInt(match.home_ball_control) + parseInt(match.away_ball_control) != 0) {
          can3 = match.away_ball_control / (parseInt(match.home_ball_control) + parseInt(match.away_ball_control))
        }
        _this.createCanvas('one', colw / 2, 'red', can1 , 1);
        _this.createCanvas('two', colw / 2, 'red', can2, 1);
        _this.createCanvas('three', colw / 2, 'red', can3, 1);
        // canvas


        //  球门比例
        match.onScale = parseInt(match.home_shots_on_target) / (parseInt(match.home_shots_on_target) + parseInt(match.away_shots_on_target))
        match.outScale = parseInt(match.home_shots_out_target) / (parseInt(match.home_shots_out_target) + parseInt(match.away_shots_out_target))



        var navList = [{
            id: '1',
            name: '赛况'
          },
          // {
          //   id: '2',
          //   name: '直播'
          // },
          {
            id: '3',
            name: '专家'
          },
          {
            id: '4',
            name: '阵容'
          },
          {
            id: '5',
            name: '指数'
          },
          {
            id: '6',
            name: '情报'
          },
          {
            id: '7',
            name: '数据'
          },
        ]
        if (match.intelligence == 0) { //是否有情报
          // navList.splice(5, 1);
          navList.splice(4, 1);

        }
        if (!_this.data.canSwitch) {
          // navList.splice(4, 1);
          navList.splice(3, 1);

        }
        if (match.lineup == 0) { //是否有阵容
          // navList.splice(3, 1);
          navList.splice(2, 1);

        }
        // if (!_this.data.canWatch) {
        //   navList.splice(1, 1);
        // }
       

        _this.setData({
          matchInfo: match,
          tliveList: res.tlive,
          incidentsList: res.incidents,
          navList: navList
        })

        if (match.status_id != 2 && match.status_id != 4 && match.status_id != 5){
          clearInterval(timer)

        }

      },
      complete() {
      }
    });
  },

  // 比赛详情--直播
  getLiveList: function() {
    var _this = this;
    if (!_this.data.isMore) {
      return false;
    }
    app.load.show();
    app.ajax({
      url: app.api + 'football/info_direct',
      type: 'GET',
      data: {
        pageNo: _this.data.pageNo,
        limit: _this.data.limit,
        matchId: _this.data.id
      },
      success(res) {
        let lists = res.list;
        for (var key in lists) {
          var item = lists[key];

          if (item.directStartTime) {
            item.time = util.fdate(item.directStartTime, 'MM-dd HH:mm');
            item.ftime = util.fdate(item.directStartTime, 'E');
          }

          var labelList = [];
          if (item.label) {
            labelList.push(item.label)
          }
          if (item.continueFocus >= 3) {
            labelList.push(item.continueFocus + '连红')
          }
          if (labelList.length < 2 && item.twenty_focus >= 10 && item.articleCount >= 20) {
            labelList.push('近20中' + item.twenty_focus)
          }
          if (labelList.length < 2 && item.focusArticleCount > 0) {
            labelList.push('总' + item.articleCount + '中' + item.focusArticleCount)
          }
          item.labelList = labelList
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
        wx.stopPullDownRefresh()
      }
    });
  },

  // 比赛详情--专家
  getExpertList: function() {
    var _this = this;
    if (!_this.data.isMore) {
      return false;
    }
    app.load.show();
    app.ajax({
      url: app.api + 'football/info_expert',
      type: 'GET',
      data: {
        pageNo: _this.data.pageNo,
        limit: _this.data.limit,
        matchId: _this.data.id
      },
      success(res) {
        let lists = res.list;
        for (var key in lists) {
          var item = lists[key];
          item.createTime = util.fdate(item.createTime, 'MM-dd HH:mm');
          if (item.directStartTime) {
            item.time = util.fdate(item.directStartTime, 'MM-dd HH:mm');
            item.ftime = util.fdate(item.directStartTime, 'E');
          }
          if (item.match.length == 1) {
            item.mtime = util.fdate1(item.match[0].match_time * 1000, 'MM-dd HH:mm')
          } else {
            if (item.match[0].match_time > item.match[1].match_time) {
              item.mtime = util.fdate1(item.match[1].match_time * 1000, 'MM-dd HH:mm')
            } else {
              item.mtime = util.fdate1(item.match[0].match_time * 1000, 'MM-dd HH:mm')
            }
          }

          var labelList = [];
          if (item.label) {
            labelList.push(item.label)
          }
          if (item.continueFocus >= 3) {
            labelList.push(item.continueFocus + '连红')
          }
          if (labelList.length < 2 && item.twenty_focus >= 10 && item.articleCount >= 20) {
            labelList.push('近20中' + item.twenty_focus)
          }
          if (labelList.length < 2 && item.focusArticleCount > 0) {
            labelList.push('总' + item.articleCount + '中' + item.focusArticleCount)
          }
          item.labelList = labelList

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
        wx.stopPullDownRefresh()
      }
    });
  },

  // 比赛详情--阵容
  getSquadInfo: function() {
    var _this = this;
    app.load.show();
    app.ajax({
      url: app.api + 'football/info_squad',
      type: 'GET',
      data: {
        matchId: _this.data.id,
      },
      success(res) {
        _this.setData({
          homeFirst: res.home_first,
          awayFirst: res.away_first,
          squadInfo: res,

          multipleX: systemInfo.windowWidth / 100,
          multipleY: 1334 / multiple / 2 / 100
        })
        console.log(_this.data.homeFirst[2].type)
      },
      complete() {
        app.load.hide();
        wx.stopPullDownRefresh()
      }
    });
  },

  // 足球比赛--指数
  getOddsInfo: function() {
    var _this = this;
    app.load.show();
    app.ajax({
      url: app.api + 'football/info_odds',
      type: 'GET',
      data: {
        matchId: _this.data.id,
      },
      success(res) {
        var euStatsInfo = res.eu_stats;

        _this.setData({
          asiaList: res.asia,
          euStatsList: res.eu,
          euStatsInfo: euStatsInfo,
          bsList: res.bs
        })


      },
      complete() {
        app.load.hide();
        wx.stopPullDownRefresh()
      }
    });
  },

  // 比赛详情--情报
  getInteInfo: function() {
    var _this = this;
    app.load.show();
    app.ajax({
      url: app.api + 'football/info_intelligence',
      type: 'GET',
      data: {
        matchId: _this.data.id,
      },
      success(res) {
        _this.setData({
          inteInfo: res,
        })

      },
      complete() {
        app.load.hide();
        wx.stopPullDownRefresh()
      }
    });
  },

  // 比赛详情--数据
  getAnalyInfo: function() {
    var _this = this;
    app.load.show();
    app.ajax({
      url: app.api + 'football/info_analysis',
      type: 'GET',
      data: {
        matchId: _this.data.id,
      },
      success(res) {
        var homeid = res.home_team_id; //主队id
        var awayid = res.away_team_id; //客队id

        // 历史交锋
        var historyList = [];
        var historyInfo = {
          win: 0,
          draw: 0,
          fail: 0,
          advance: 0,
          lose: 0,
          percent: 0
        };
        if (res.history) {
          for (var key in res.history) {
            var item = res.history[key];
            item.time = util.fdate(item.match_date, 'yyyy MM/dd');
            if (key < 10) {
              historyInfo = _this.changeInfo(historyInfo, item, homeid)
              historyList.push(item);
            }
          }
          historyInfo.percent = parseInt((historyInfo.win / historyList.length).toFixed(2) * 100);
        }

        var recentHome = [],
          recentAway = [];
        var recentHomeInfo = {
          win: 0,
          draw: 0,
          fail: 0,
          advance: 0,
          lose: 0,
          percent: 0
        };
        var recentAwayInfo = {
          win: 0,
          draw: 0,
          fail: 0,
          advance: 0,
          lose: 0,
          percent: 0
        };

        //近期战绩
        if (res.recent_match) {
          //主队
          if (res.recent_match.home_recent_match) {
            for (var key in res.recent_match.home_recent_match) {
              var item = res.recent_match.home_recent_match[key];
              item.time = util.fdate(item.match_date, 'yyyy MM/dd');
              if (key < 10) {
                recentHomeInfo = _this.changeInfo(recentHomeInfo, item, homeid)
                recentHome.push(item);
              }
            }
            recentHomeInfo.percent = parseInt((recentHomeInfo.win / recentHome.length).toFixed(2) * 100);
          }

          //客队
          if (res.recent_match.away_recent_match) {
            for (var key in res.recent_match.away_recent_match) {
              var item = res.recent_match.away_recent_match[key];
              item.time = util.fdate(item.match_date, 'yyyy MM/dd');
              if (key < 10) {
                recentAwayInfo = _this.changeInfo(recentAwayInfo, item, awayid)
                recentAway.push(item);
              }
            }
            recentAwayInfo.percent = parseInt((recentAwayInfo.win / recentAway.length).toFixed(2) * 100);
          }

        }

        _this.setData({
          analyInfo: res,
          historyList: historyList,
          historyInfo: historyInfo,
          recentHome: recentHome,
          recentHomeInfo: recentHomeInfo,
          recentAway: recentAway,
          recentAwayInfo: recentAwayInfo
        })


      },
      complete() {
        app.load.hide();
        wx.stopPullDownRefresh()
      }
    });
  },


  //历史交锋 同赛事 同主客
  showSame1: function(e) {
    var _this = this;
    var cur = e.currentTarget.dataset.cur;
    if (cur == 1) { //同主客
      _this.setData({
        sameShow1: !_this.data.sameShow1
      })
    } else { //同赛事
      _this.setData({
        sameShow4: !_this.data.sameShow4
      })
    }
    // _this.setData({
    //   sameShow1: !_this.data.sameShow1
    // })
    var list = _this.data.analyInfo.history;
    var historyList = [];
    var historyInfo = {
      win: 0,
      draw: 0,
      fail: 0,
      advance: 0,
      lose: 0,
      percent: 0
    };

    var homeid = _this.data.analyInfo.home_team_id; //主队id
    var awayid = _this.data.analyInfo.away_team_id; //客队id
    var competition_id = _this.data.matchInfo.competition_id;

    for (var key in list) {
      var item = list[key];
      item.time = util.fdate(item.match_date, 'yyyy MM/dd');
      // if (historyList.length < 10) {

      //   if (_this.data.sameShow1) {
      //     if (item.home_id == homeid && item.away_id == awayid) {
      //       historyInfo = _this.changeInfo(historyInfo, item, homeid)
      //       historyList.push(item);
      //     }
      //   } else {
      //     historyInfo = _this.changeInfo(historyInfo, item, homeid)
      //     historyList.push(item);
      //   }
      // }
      if (historyList.length < 10) {
        if (_this.data.sameShow1 && _this.data.sameShow4) {
          if (item.home_id == homeid && item.competition_id == competition_id) {
            historyInfo = _this.changeInfo(historyInfo, item, homeid);
            historyList.push(item);
          }
        } else if (_this.data.sameShow1) {
          if (item.home_id == homeid) {
            historyInfo = _this.changeInfo(historyInfo, item, homeid);
            historyList.push(item);
          }
        } else if (_this.data.sameShow4) {
          if (item.competition_id == competition_id) {
            historyInfo = _this.changeInfo(historyInfo, item, homeid);
            historyList.push(item);
          }
        } else {
          historyInfo = _this.changeInfo(historyInfo, item, homeid);
          historyList.push(item);
        }
      }
    }
    historyInfo.percent = parseInt((historyInfo.win / historyList.length).toFixed(2) * 100);

    _this.setData({
      historyInfo: historyInfo,
      historyList: historyList
    })

  },

  // 近期战绩 同主客 同赛事
  showSame2: function(e) {
    var _this = this;
    var cur = e.currentTarget.dataset.cur;
    if (cur == 1) { //同主客
      _this.setData({
        sameShow2: !_this.data.sameShow2
      })
    } else { //同赛事
      _this.setData({
        sameShow3: !_this.data.sameShow3
      })
    }
    var recent_match = _this.data.analyInfo.recent_match;

    var homeid = _this.data.analyInfo.home_team_id; //主队id
    var awayid = _this.data.analyInfo.away_team_id; //客队id
    var competition_id = _this.data.matchInfo.competition_id;

    var recentHome = [],
      recentAway = [];
    var recentHomeInfo = {
      win: 0,
      draw: 0,
      fail: 0,
      advance: 0,
      lose: 0,
      percent: 0
    };
    var recentAwayInfo = {
      win: 0,
      draw: 0,
      fail: 0,
      advance: 0,
      lose: 0,
      percent: 0
    };

    //主队
    for (var key in recent_match.home_recent_match) {
      var item = recent_match.home_recent_match[key];
      item.time = util.fdate(item.match_date, 'yyyy MM/dd');
      if (recentHome.length < 10) {
        if (_this.data.sameShow2 && _this.data.sameShow3) {
          if (item.home_id == homeid && item.competition_id == competition_id) {
            recentHomeInfo = _this.changeInfo(recentHomeInfo, item, homeid);
            recentHome.push(item);
          }
        } else if (_this.data.sameShow2) {
          if (item.home_id == homeid) {
            recentHomeInfo = _this.changeInfo(recentHomeInfo, item, homeid);
            recentHome.push(item);
          }
        } else if (_this.data.sameShow3) {
          if (item.competition_id == competition_id) {
            recentHomeInfo = _this.changeInfo(recentHomeInfo, item, homeid);
            recentHome.push(item);
          }
        } else {
          recentHomeInfo = _this.changeInfo(recentHomeInfo, item, homeid);
          recentHome.push(item);
        }
      }
    }
    recentHomeInfo.percent = (recentHomeInfo.win / recentHome.length).toFixed(2) * 100;

    //客队
    for (var key in recent_match.away_recent_match) {
      var item = recent_match.away_recent_match[key];
      item.time = util.fdate(item.match_date, 'yyyy MM/dd');
      if (recentAway.length < 10) {

        if (_this.data.sameShow2 && _this.data.sameShow3) {
          if (item.away_id == awayid && item.competition_id == competition_id) {
            recentAwayInfo = _this.changeInfo(recentAwayInfo, item, awayid)
            recentAway.push(item);
          }
        } else if (_this.data.sameShow2) {
          if (item.away_id == awayid) {
            recentAwayInfo = _this.changeInfo(recentAwayInfo, item, awayid)
            recentAway.push(item);
          }
        } else if (_this.data.sameShow3) {
          if (item.competition_id == competition_id) {
            recentAwayInfo = _this.changeInfo(recentAwayInfo, item, awayid)
            recentAway.push(item);
          }
        } else {
          recentAwayInfo = _this.changeInfo(recentAwayInfo, item, awayid)
          recentAway.push(item);
        }
      }
    }
    recentAwayInfo.percent = parseInt((recentAwayInfo.win / recentAway.length).toFixed(2) * 100);



    _this.setData({
      recentHome: recentHome,
      recentHomeInfo: recentHomeInfo,
      recentAway: recentAway,
      recentAwayInfo: recentAwayInfo
    })

  },



  // 计算战绩
  changeInfo: function(historyInfo, item, homeid) {
    if (item.home_scores > item.away_scores) { //主胜
      if (item.home_id == homeid) { //判断是否为赛事主队
        historyInfo.win = historyInfo.win + 1;
        historyInfo.advance = historyInfo.advance + item.home_scores;
        historyInfo.lose = historyInfo.lose + item.away_scores;
      } else {
        historyInfo.fail = historyInfo.fail + 1;
        historyInfo.advance = historyInfo.advance + item.away_scores;
        historyInfo.lose = historyInfo.lose + item.home_scores;
      }
    } else if (item.home_scores == item.away_scores) { //平局
      historyInfo.draw = historyInfo.draw + 1;
      historyInfo.advance = historyInfo.advance + item.home_scores;
      historyInfo.lose = historyInfo.lose + item.home_scores
    } else {
      if (item.home_id == homeid) { //判断是否为赛事主队
        historyInfo.fail = historyInfo.fail + 1;
        historyInfo.lose = historyInfo.lose + item.away_scores;
        historyInfo.advance = historyInfo.advance + item.home_scores;
      } else {
        historyInfo.win = historyInfo.win + 1;
        historyInfo.lose = historyInfo.lose + item.home_scores;
        historyInfo.advance = historyInfo.advance + item.away_scores;

      }
    }
    return historyInfo;
  },




  showTip: function() {
    this.setData({
      tipShow: !this.data.tipShow
    })
  },

  //主导航点击
  changeNav: function(e) {
    var _this = this;
    this.setData({
      nav: e.currentTarget.dataset.nav
    })
    if (_this.data.nav == 1) {
      // _this.getInfo();
    } else if (_this.data.nav == 2) {
      _this.setData({
        isMore: true,
        pageNo: 1,
        list: null,
      })
      _this.getLiveList();
    } else if (_this.data.nav == 3) {
      _this.setData({
        isMore: true,
        pageNo: 1,
        list: null,
      })
      _this.getExpertList();
    } else if (_this.data.nav == 4) {
      _this.getSquadInfo();
    } else if (_this.data.nav == 5) {
      _this.getOddsInfo();
    } else if (_this.data.nav == 6) {
      _this.getInteInfo();
    } else if (_this.data.nav == 7) {
      _this.getAnalyInfo();
    }
  },

  changeState: function(e) {
    this.setData({
      state: e.currentTarget.dataset.cur
    })
  },

  changeOption: function(e) {
    this.setData({
      option: e.currentTarget.dataset.nav
    })
  },

  //创建canvas
  createCanvas: function(id, xy, color, val, total) {
    var ctx = wx.createCanvasContext(id);
    ctx.setLineWidth(6 / multiple);
    ctx.setStrokeStyle('#E5E5E5');
    ctx.setLineCap('round');
    ctx.beginPath();
    ctx.arc(xy, xy, 0.75 * xy, 0, 2 * Math.PI, false);
    ctx.stroke();

    ctx.setLineWidth(6 / multiple);
    ctx.setStrokeStyle(color);
    ctx.setLineCap('round');
    var p = val / total;

    ctx.beginPath(xy);
    ctx.arc(xy, xy, 0.75 * xy, -90 * Math.PI / 180, (p * 360 - 90) * Math.PI / 180, true);
    ctx.textAlign = "center";
    ctx.font = '28rpx Arial';
    ctx.fillStyle = color;
    // ctx.fillText(val, xy, 1.1 * xy, xy);
    ctx.stroke(); //对当前路径进行描边
    ctx.draw();



  },


  // 页面滑动时触发
  onPageScroll: function(e) {
    var scrollTop = e.detail ? e.detail.scrollTop : e.scrollTop
    if (scrollTop > 270) {
      this.setData({
        isFixed: true
      });
    } else {
      this.setData({
        isFixed: false
      });
    }


  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var _this = this;
    if (_this.data.nav == 2) {
      _this.getLiveList();
    } else if (_this.data.nav == 3) {
      _this.getExpertList();
    }

  },

  onPullDownRefresh(){
    this.onLoad();
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    var _this = this;
    // 每日分享获得积分
    app.ajax({
      url: app.api + 'member/share_point',
      type: 'GET',
      success(res) {

      },
      complete() {}
    });

    return {
      title: '【' + _this.data.matchInfo.competition_name + '】' + _this.data.matchInfo.home_team_name + '队VS' + _this.data.matchInfo.away_team_name + '队',
      path: '/pages/matchInfo/matchInfo?id=' + _this.data.id + '&flagCode=' + wx.getStorageSync('flagCode'),
      imageUrl: _this.data.imgUrl + 'share.jpg'
    }


  }
})