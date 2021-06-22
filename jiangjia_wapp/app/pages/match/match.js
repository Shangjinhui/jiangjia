// pages/match/match.js
const app = getApp();
const util = require('../../libs/util.js');
const mqtt = require('../../libs/mqtt.min.js');

var timer;
var timer1;
var pageNum = 30;
Page({
  /** 
   * 页面的初始数据 
   */
  data: {
    imgUrl: app.imgUrl,
    isIphoneX: app.globalData.isIphoneX,
    typeList: [{
        id: '0',
        name: '全部'
      },
      {
        id: '1',
        name: '进行中'
      },
      {
        id: '2',
        name: '赛程'
      },
      {
        id: '3',
        name: '赛果'
      },
      {
        id: '4',
        name: '关注'
      },
    ],
    type: '0',
    dateList: [], //7天日期
    dateList1: [], //7天日期

    setShow: false,

    competition: '', //赛事id
    competition2: '', //赛事id
    competition3: '', //赛事id
    list: null,
    list2: null,
    list3: null,

    allList: null,
    allList2: null,
    allList3: null,

    todayList: null,
    tomorrowList: null,
    tomorrowDate: '',
    endList: null,
    allTodayList: [],
    allTomorrowList: [],
    allEndList: [],

    startDate: '', //选择开始时间
    endDate: '', //选择结束时间

    date1: '',
    startDate1: '',
    endDate1: '',
    toView: '',
    toView1: '',
    nowDate: '', //当前日期
    date: '', //选中日期 2020-07-09



    //懒加载
    isLoadMore: true,
    isReachBottom: true,
    currentNo: pageNum,
    currentNo2: pageNum,
    currentNo3: pageNum,


    submited: true,

    pageNo: 1,
    limit: 30,
    isMore: true,

    filterInfo: '' //筛选条件

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var nowDate = util.fdate1((new Date()).getTime(), 'yyyy-MM-dd')
    this.setData({
      date: nowDate,
      nowDate: nowDate,
    })
    // this.getFilterInfo();
    this.refreshShow();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    //console.log(wx.getStorageSync('pageMatchFilter'), '--')
    if (wx.getStorageSync('pageMatchFilter')) {
      this.refreshShow();
      wx.removeStorageSync('pageMatchFilter');
    }
  },

  refreshShow() {
    var _this = this;
    clearTimeout(timer)
    clearTimeout(timer1)
    _this.setData({
      isFirst: true,
      currentNo: pageNum,
    })
    var nowDate = util.fdate1((new Date()).getTime(), 'yyyy-MM-dd')
    if (wx.getStorageSync('matInfo')) {
      var matInfo = JSON.parse(wx.getStorageSync('matInfo'))
      if (matInfo.date == nowDate) {
        var competition = matInfo.list[_this.data.type] ? matInfo.list[_this.data.type].competition : ''
        if (_this.data.type == 2) {
          _this.setData({
            competition2: competition
          })
        } else if (_this.data.type == 3) {
          _this.setData({
            competition3: competition
          })
        } else {
          _this.setData({
            competition: competition
          })
        }

      } else {
        wx.removeStorageSync('matInfo')
      }
    }
    if (_this.data.type == 0) {
      app.load.show();
      _this.getTodayList();

    } else if (_this.data.type == 4) {
      app.checkLogin(() => {
        _this.setData({
          isMore: true,
          pageNo: 1,
          list: null,
        })
        _this.getCollectList()
      });
    } else {
      app.load.show();
      _this.getList();
    }
  },


  //获取之前N天(n<0)或者之后N天(n>0)
  getAnyDay: function(symbol, n) {
    symbol = symbol || '-';
    var nowDate = new Date();
    nowDate = nowDate.setDate(nowDate.getDate() + n);
    nowDate = new Date(nowDate);
    var y = nowDate.getFullYear(),
      m = nowDate.getMonth() + 1,
      d = nowDate.getDate();
    m = m < 10 ? '0' + m : m;
    d = d < 10 ? '0' + d : d;
    return y + symbol + m + symbol + d;
  },


  //主导航点击
  changeType: function(e) {
    var _this = this;
    clearTimeout(timer)
    clearTimeout(timer1)

    var type = e.currentTarget.dataset.nav;
    var matInfo = wx.getStorageSync('matInfo') ? JSON.parse(wx.getStorageSync('matInfo')) : '';
    _this.setData({
      type: type,
      date: _this.data.nowDate,
      currentNo: pageNum,
    })

    if (type != 4) {
      if (matInfo) {
        if (type == 0 || type == 1) {
          _this.setData({
            competition: matInfo.list[type] ? matInfo.list[type].competition : '',
          })
        } else if (type == 2) {
          _this.setData({
            competition2: matInfo.list[type] ? matInfo.list[type].competition : '',
          })
        } else if (type == 3) {
          _this.setData({
            competition3: matInfo.list[type] ? matInfo.list[type].competition : '',
          })
        }
        // else {
        //   matInfo.list[type] = '';
        //   _this.setData({
        //     competition: '',
        //   })
        // }
        // wx.setStorageSync('matInfo', JSON.stringify(matInfo))
      }
      if (type == '2' && _this.data.dateList.length == 0) {
        // 赛程前七天日期
        var dateList = [],
          dateListAll = [];
        for (var i = 0; i < 7; i++) {
          dateList.push({
            date: _this.getAnyDay('-', i),
            name: '星期' + util.fdate(_this.getAnyDay('-', i), 'E'),
            showDate: _this.getAnyDay('-', i).substring(5, 10)
          })
        }
        _this.setData({
          dateList: dateList,
          date: _this.data.nowDate,
          startDate: _this.data.nowDate,
          endDate: _this.getAnyDay('-', 30),
          toView: 'inTo0'
        })

      } else if (type == '3' && _this.data.dateList1.length == 0) {
        // 赛果前七天日期
        var dateList = [];
        for (var i = 0; i < 7; i++) {
          dateList[6 - i] = {
            date: _this.getAnyDay('-', -i),
            name: '星期' + util.fdate(_this.getAnyDay('-', -i), 'E'),
            showDate: _this.getAnyDay('-', -i).substring(5, 10)
          }
        }
        _this.setData({
          dateList1: dateList,
          date1: _this.data.nowDate,
          startDate1: _this.getAnyDay('-', -30),
          endDate1: _this.data.nowDate,
          toView1: 'inTo6'
        })
      }
      if (type == 0) {
        app.load.show();
        _this.setData({
          isFirst: true,
        })
        _this.getTodayList();
      } else if (type == 1) {
        app.load.show();
        _this.getList();
      } else if (type == 2) {
        app.load.show();
        _this.getList();
      } else if (type == 3 && !_this.data.list3) {
        app.load.show();
        _this.getList();
      }
    } else {
      app.load.show();
      app.checkLogin(() => {
        _this.setData({
          isMore: true,
          pageNo: 1,
          list: null,
        })
        _this.getCollectList()
      });
    }
  },

  showSet: function() {
    this.setData({
      setShow: !this.data.setShow
    })
  },

  // 前往筛选
  goFilter: function() {
    let date = this.data.type==3?this.data.date1:this.data.date;
    
    wx.navigateTo({
      url: '/pages/matchFilter/matchFilter?date=' + date + '&type=' + this.data.type,
    })
  },

  // 足球比赛列表
  getList: function() {
    var _this = this;
    if (_this.data.type != 1) {
      app.load.show();
    }
    var competition = '';
    var date = _this.data.date
    //console.log(date,'--------')
    if (_this.data.type == 1) {
      competition = _this.data.competition;
    } else if (_this.data.type == 2) {
      competition = _this.data.competition2;
    } else if (_this.data.type == 3) {
      competition = _this.data.competition3;
      date = _this.data.date1
    }
    app.ajax({
      url: app.api + 'football/list',
      type: 'GET',
      data: {
        competition: competition,
        date: date,
        type: _this.data.type
      },
      success(res) {
        let lists = res.list
        if (lists.length > 0) {
          for (var key in lists) {
            var item = lists[key];
            var nowTime = parseInt((new Date()).getTime() / 1000)
            let sjhDate = new Date(item.match_time * 1000);
            let month = sjhDate.getMonth() + 1,
              day = sjhDate.getDate(),
              hour = sjhDate.getHours(),
              minutes = sjhDate.getMinutes();
            month = month < 10 ? '0' + month : month;
            day = day < 10 ? '0' + day : day;
            hour = hour < 10 ? '0' + hour : hour;
            minutes = minutes < 10 ? '0' + minutes : minutes;
            item.sjhTime = month + '-' + day + ' ' + hour + ':' + minutes;

            if (item.status_id == 2) {
              if (item.startBallTime > 0) {
                item.time = parseInt((nowTime - item.startBallTime) / 60) + 1;
              } else {
                item.time = 0
              }
            } else if (item.status_id == 4 || item.status_id == 5) {
              if (item.startBallTime > 0) {
                item.time = parseInt((nowTime - item.startBallTime) / 60) + 45 + 1;
              } else {
                item.time = 0
              }
            }
            if (item.home_position) {
              item.home_position = (item.home_position).replace(/[^0-9]/ig, "");
            }
            if (item.away_position) {
              item.away_position = (item.away_position).replace(/[^0-9]/ig, "");
            }
            if (item.match_time) {
              item.matchtime = util.fdate1(item.match_time * 1000, 'MM-dd HH:mm');
              // item.ftime = util.fdate1(item.match_time * 1000, 'E');
            }
            item.homenum = 0
            if (item.home_position) {
              item.homenum = item.homenum + 1
            }
            if (item.home_scores[2] && item.home_scores[2] != 0) {
              item.homenum = item.homenum + 1
            }
            if (item.home_scores[3] && item.home_scores[3] != 0) {
              item.homenum = item.homenum + 1
            }
            item.awaynum = 0
            if (item.away_position) {
              item.awaynum = item.awaynum + 1
            }
            if (item.away_scores[2] && item.away_scores[2] != 0) {
              item.awaynum = item.awaynum + 1
            }
            if (item.away_scores[3] && item.away_scores[3] != 0) {
              item.awaynum = item.awaynum + 1
            }
          }
        }
        if (lists.length > pageNum) { //先加载100条
          for (var i = 0; i < pageNum; i++) {
            if (_this.data.type == 1) {
              _this.setData({
                [`list[${i}]`]: lists[i]
              });
            } else if (_this.data.type == 2) {
              _this.setData({
                [`list2[${i}]`]: lists[i]
              });
            } else if (_this.data.type == 3) {
              _this.setData({
                [`list3[${i}]`]: lists[i]
              });
            }

          }
        } else {
          if (_this.data.type == 1) {
            _this.setData({
              list: lists
            });
          } else if (_this.data.type == 2) {
            _this.setData({
              list2: lists
            });
          } else if (_this.data.type == 3) {
            _this.setData({
              list3: lists
            });
          }
        }
        if (_this.data.type == 1) {
          _this.setData({
            allList: lists
          });
        } else if (_this.data.type == 2) {
          _this.setData({
            allList2: lists
          });
        } else if (_this.data.type == 3) {
          _this.setData({
            allList3: lists
          });
        }
        _this.setData({
          isShow: true,
        })

        if (_this.data.type == 1) {
          timer = setTimeout(function() {
            _this.getList()
          }, 60000)
        }

      },
      complete() {

        app.load.hide();
        wx.stopPullDownRefresh();
      }
    });
  },


  //今日比赛
  getTodayList: function() {
    var _this = this;
    // app.load.show();
    app.ajax({
      url: app.api + 'football/today_list',
      type: 'GET',
      data: {
        competition: _this.data.competition,
      },
      success(res) {
        let lists = res.today_list;
        if (lists.length > 0) {
          for (var key in lists) {
            var item = lists[key];
            var nowTime = parseInt((new Date()).getTime() / 1000)
            if (item.status_id == 2) {
              if (item.startBallTime > 0) {
                item.time = parseInt((nowTime - item.startBallTime) / 60) + 1;
              } else {
                item.time = 0
              }
            } else if (item.status_id == 4 || item.status_id == 5) {
              if (item.startBallTime > 0) {
                item.time = parseInt((nowTime - item.startBallTime) / 60) + 45 + 1;
              } else {
                item.time = 0
              }
            }
            if (item.home_position) {
              item.home_position = (item.home_position).replace(/[^0-9]/ig, "");
            }
            if (item.away_position) {
              item.away_position = (item.away_position).replace(/[^0-9]/ig, "");
            }
            item.homenum = 0
            if (item.home_position ) {
              item.homenum = item.homenum + 1
            }
            if (item.home_scores[2] && item.home_scores[2] != 0) {
              item.homenum = item.homenum + 1
            }
            if (item.home_scores[3] && item.home_scores[3] != 0) {
              item.homenum = item.homenum + 1
            }
            item.awaynum = 0
            if (item.away_position ) {
              item.awaynum = item.awaynum + 1
            }
            if (item.away_scores[2] && item.away_scores[2] != 0) {
              item.awaynum = item.awaynum + 1
            }
            if (item.away_scores[3] && item.away_scores[3] != 0) {
              item.awaynum = item.awaynum + 1
            }

            if (item.match_time) {
              item.matchtime = util.fdate1(item.match_time * 1000, 'MM-dd HH:mm');
              // item.ftime = util.fdate1(item.match_time * 1000, 'E');
            }
          }
        }
        if (lists.length > pageNum) { //先加载100条
          for (var i = 0; i < pageNum; i++) {
            _this.setData({
              [`todayList[${i}]`]: lists[i]
            });
          }
        } else {
          _this.setData({
            todayList: lists,
          })
        }
        // _this.setData({
        //   todayList: lists,
        // })
        _this.setData({
          allTodayList: lists,
          isShow: true,
        })
        timer = setTimeout(function() {
          _this.getTodayList()
        }, 60000)

        if (_this.data.isFirst) {
          _this.setData({
            isFirst: false,
          })
          _this.getEndList();
          _this.getTomorrowList(); //--------------------------------
        }
      },
      complete() {
        app.load.hide();
        wx.stopPullDownRefresh();
      }
    });
  },

  // 明日比赛
  getTomorrowList: function() {
    var _this = this;
    app.ajax({
      url: app.api + 'football/tomorrow_list',
      type: 'GET',
      data: {
        competition: _this.data.competition,
      },
      success(res) {
        let lists = res.tomorrow_list;
        if (lists.length > 0) {
          for (var key in lists) {
            var item = lists[key];
            if (item.home_position) {
              item.home_position = (item.home_position).replace(/[^0-9]/ig, "");
            }
            if (item.away_position) {
              item.away_position = (item.away_position).replace(/[^0-9]/ig, "");
            }
            if (item.match_time) {
              item.matchtime = util.fdate1(item.match_time * 1000, 'MM-dd HH:mm');
            }
          }
        }
        //console.log(_this.data.todayList.length, pageNum, lists)
        if (_this.data.todayList.length < pageNum) {
          if (lists.length > pageNum - _this.data.todayList.length) { //先加载100条
            for (var i = 0; i < pageNum - _this.data.todayList.length; i++) {
              _this.setData({
                [`tomorrowList[${i}]`]: lists[i]
              });
            }
          } else {
            _this.setData({
              tomorrowList: lists,
            })
          }
        } else {
          _this.setData({
            tomorrowList: [],
          })
        }
        _this.setData({
          allTomorrowList: lists,
          tomorrowDate: res.tomorrow_date
        })
        _this.getEndList();
      },
      complete() {}
    });
  },

  // 已结束比赛
  getEndList: function() {
    var _this = this;
    app.ajax({
      url: app.api + 'football/end_list',
      type: 'GET',
      data: {
        competition: _this.data.competition,
      },
      success(res) {
        let lists = res.end_list;
        if (lists.length > 0) {
          for (var key in lists) {
            var item = lists[key];
            var nowTime = parseInt((new Date()).getTime() / 1000)
            if (item.home_position) {
              item.home_position = (item.home_position).replace(/[^0-9]/ig, "");
            }
            if (item.away_position) {
              item.away_position = (item.away_position).replace(/[^0-9]/ig, "");
            }
            if (item.match_time) {
              item.matchtime = util.fdate1(item.match_time * 1000, 'MM-dd HH:mm');
            }
            item.homenum = 0
            if (item.home_position) {
              item.homenum = item.homenum + 1
            }
            if (item.home_scores[2] && item.home_scores[2] != 0) {
              item.homenum = item.homenum + 1
            }
            if (item.home_scores[3] && item.home_scores[3] != 0) {
              item.homenum = item.homenum + 1
            }
            item.awaynum = 0
            if (item.away_position) {
              item.awaynum = item.awaynum + 1
            }
            if (item.away_scores[2] && item.away_scores[2] != 0) {
              item.awaynum = item.awaynum + 1
            }
            if (item.away_scores[3] && item.away_scores[3] != 0) {
              item.awaynum = item.awaynum + 1
            }
          }
        }
        if (_this.data.allTodayList.length + _this.data.allTomorrowList.length < pageNum) { //先加载100条
          if (lists.length > pageNum - _this.data.allTodayList.length + _this.data.allTomorrowList.length) { //先加载100条
            for (var i = 0; i < pageNum - _this.data.allTodayList.length + _this.data.allTomorrowList.length; i++) {
              _this.setData({
                [`endList[${i}]`]: lists[i]
              });
            }
          } else {
            _this.setData({
              endList: lists,
            })
          }
        } else {
          _this.setData({
            endList: [],
          })
        }
        _this.setData({
          allEndList: lists,
        })

        timer1 = setTimeout(function() {
          _this.getEndList()
        }, 120000)


      },
      complete() {
        app.load.hide();
        wx.stopPullDownRefresh();
      }
    });
  },

  // 上拉加载更多
  onReachBottom: function() {
    var _this = this;
    if (_this.data.type == 4) {
      _this.getCollectList();
    } else if (_this.data.type == 1) {
      this.setData({
        isLoadMore: false
      })
      var totalList = this.data.allList
      var currentNo = this.data.currentNo
      this.pushList(totalList, currentNo, 'currentNo', 'list');

    } else if (_this.data.type == 2) {
      this.setData({
        isLoadMore: false
      })
      var totalList = this.data.allList2
      var currentNo = this.data.currentNo2
      this.pushList(totalList, currentNo, 'currentNo2', 'list2');

    } else if (_this.data.type == 3) {
      this.setData({
        isLoadMore: false
      })
      var totalList = this.data.allList3
      var currentNo = this.data.currentNo3
      //console.log(totalList,currentNo,'-------')
      this.pushList(totalList, currentNo, 'currentNo3', 'list3');

    } else if (_this.data.type == 0) {
      this.setData({
        isLoadMore: false
      })
      var initList = []
      var currentNo = _this.data.currentNo;
      var allTodayList = _this.data.allTodayList;
      var allTomorrowList = _this.data.allTomorrowList;
      var allEndList = _this.data.allEndList;
      var todayList = _this.data.todayList;
      var tomorrowList = _this.data.tomorrowList;
      var endList = _this.data.endList;
      if (currentNo >= allTodayList.length + allTomorrowList.length + allEndList.length) {
        _this.setData({
          isLoadMore: true,
          isReachBottom: false
        })
        return
      }
      app.load.show();
      if (todayList.length < allTodayList.length) {
        var initList = [];
        var num = allTodayList.length - todayList.length >= pageNum ? pageNum : allTodayList.length - todayList.length;
        for (var i = 0; i < currentNo + num; i++) {
          if (allTodayList[i]) {
            initList.push(allTodayList[i])
          }
        }

        _this.setData({
          currentNo: currentNo + num,
          isLoadMore: true,
          todayList: initList
        })

      } else if (tomorrowList.length < allTomorrowList.length) {
        var initList = [];
        var num = allTomorrowList.length - tomorrowList.length >= pageNum ? pageNum : allTomorrowList.length - tomorrowList.length;
        for (var i = 0; i < currentNo + num; i++) {
          if (allTomorrowList[i]) {
            initList.push(allTomorrowList[i])
          }
        }
        _this.setData({
          currentNo: currentNo + num,
          isLoadMore: true,
          tomorrowList: initList
        })
      } else {
        var initList = [];
        var num = allEndList.length - endList.length >= pageNum ? pageNum : allEndList.length - endList.length;
        for (var i = 0; i < currentNo + num; i++) {
          if (allEndList[i]) {
            initList.push(allEndList[i])
          }
        }
        _this.setData({
          currentNo: currentNo + num,
          isLoadMore: true,
          endList: initList
        })
      }
      app.load.hide();
      wx.stopPullDownRefresh();
    }
  },

  pushList: function(totalList, currentNo, currentNoNum, list) {
    var initList = [];
    if (currentNo >= totalList.length) {
      this.setData({
        isLoadMore: true,
        isReachBottom: false
      })
      return
    }
    app.load.show();
    for (var i = 0; i < currentNo + pageNum; i++) {
      if (totalList[i]) {
        initList.push(totalList[i])
      }
    }
    this.setData({
      [currentNoNum]: currentNo + pageNum,
      isLoadMore: true,
      [list]: initList
    })
    app.load.hide();
    wx.stopPullDownRefresh();
  },

  //日期切换
  changeDate: function(e) {
    clearTimeout(timer)
    clearTimeout(timer1)
    var matInfo = wx.getStorageSync('matInfo') ? JSON.parse(wx.getStorageSync('matInfo')) : '';
    if (this.data.type == 2) {
      this.setData({
        date: e.currentTarget.dataset.num,
        competition2: '',
        list2: null,
        currentNo2:pageNum
      })
    } else {
      this.setData({
        date1: e.currentTarget.dataset.num,
        competition3: '',
        list3: null,
        currentNo3:pageNum
      })
    }
    if (matInfo) {
      matInfo.list[this.data.type] = '';
      wx.setStorageSync('matInfo', JSON.stringify(matInfo))
    }

    this.getList();

  },


  bindDateChange: function(e) {
    var dateList = this.data.type == 2 ? this.data.dateList : this.data.dateList1
    var date = e.detail.value;
    var idx = 0;
    var isHas = false
    for (var key in dateList) {
      var item = dateList[key];
      if (item.date == date) {
        idx = key
        isHas = true;
      }
    }
    if (!isHas) {
      if (this.data.type == 2) {
        dateList.push({
          date: date,
          name: '星期' + util.fdate(date, 'E'),
          showDate: date.substring(5, 10)
        })
        idx = dateList.length - 1;
      } else {
        dateList.unshift({
          date: date,
          name: '星期' + util.fdate(date, 'E'),
          showDate: date.substring(5, 10)
        })
      }
    }
    if (this.data.type == 2) {
      this.setData({
        date: date,
        dateList: dateList,
        toView: 'inTo' + idx,
        competition2: '',
        list2:null,
        currentNo2:pageNum
      })
    } else {
      this.setData({
        date1: date,
        dateList1: dateList,
        toView1: 'inTo' + idx,
        competition3: '',
        list3:null,
        currentNo3:pageNum
      })
    }

    clearTimeout(timer)
    var matInfo = wx.getStorageSync('matInfo') ? JSON.parse(wx.getStorageSync('matInfo')) : '';
    if (matInfo) {
      matInfo.list[this.data.type] = '';
      wx.setStorageSync('matInfo', JSON.stringify(matInfo))
    }
    this.getList();
  },






  // 关注列表
  getCollectList: function() {
    var _this = this;
    if (!_this.data.isMore) {
      return false;
    }
    app.load.show();
    app.ajax({
      url: app.api + 'football/collect',
      type: 'GET',
      data: {
        page: _this.data.pageNo,
        limit: _this.data.limit,
      },
      success(res) {
        var lists = res.list;
        //console.log(lists)
        for (var key in lists) {
          var item = lists[key];
          let sjhDate = new Date(item.match_time * 1000);
          let month = sjhDate.getMonth() + 1,
            day = sjhDate.getDate(),
            hour = sjhDate.getHours(),
            minutes = sjhDate.getMinutes();
          month = month < 10 ? '0' + month : month;
          day = day < 10 ? '0' + day : day;
          hour = hour < 10 ? '0' + hour : hour;
          minutes = minutes < 10 ? '0' + minutes : minutes;
          item.sjhTime = month + '-' + day + ' ' + hour + ':' + minutes;
          item.home_position = item.home_position.replace(/[^0-9]/ig, "");
          item.away_position = item.away_position.replace(/[^0-9]/ig, "");
          if (item.startBallTime > 0) {
            var nowTime = parseInt((new Date()).getTime() / 1000)
            if (item.status_id == 2) {
              item.time = parseInt((nowTime - item.startBallTime) / 60) + 1;
            } else if (item.status_id == 4 || item.status_id == 5) {
              item.time = parseInt((nowTime - item.startBallTime) / 60) + 45 + 1;
            }
          }
          item.homenum = 0
          if (item.home_position) {
            item.homenum = item.homenum + 1
          }
          if (item.home_scores[2] && item.home_scores[2] != 0) {
            item.homenum = item.homenum + 1
          }
          if (item.home_scores[3] && item.home_scores[3] != 0) {
            item.homenum = item.homenum + 1
          }
          item.awaynum = 0
          if (item.away_position) {
            item.awaynum = item.awaynum + 1
          }
          if (item.away_scores[2] && item.away_scores[2] != 0) {
            item.awaynum = item.awaynum + 1
          }
          if (item.away_scores[3] && item.away_scores[3] != 0) {
            item.awaynum = item.awaynum + 1
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
        wx.stopPullDownRefresh();
      }
    });
  },


  onUnload: function() {
    clearTimeout(timer)
    clearTimeout(timer1)
  },
  onHide: function() {
    clearTimeout(timer)
    clearTimeout(timer1)
  },

  onPullDownRefresh() {
    this.refreshShow();
  },


  traList4: function(e) {
    this.setData({
      isMore: true,
      pageNo: 1,
      list: null,
    })
    this.getCollectList()
  }


})