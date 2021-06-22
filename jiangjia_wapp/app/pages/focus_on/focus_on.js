// pages/focus_on/focus_on.js
const app = getApp();
const util = require('../../libs/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.imgUrl,
    state:1,
    pageNo: 1,
    limit: 10,
    isMore: true,
    list: null,

    submited:true
  },

  onShow: function () {
    app.checkLogin(() => {
      this.setData({
        isMore: true,
        pageNo: 1,
      })
      this.getList()
    });
  },


  changeState:function(e){
    var _this = this;
    _this.setData({
      state: e.currentTarget.dataset.id
    })
    _this.setData({
      isMore: true,
      pageNo: 1,
      list: null,
    })
    _this.getList();
  },
  getList: function () {
    var _this = this;
    if (!_this.data.isMore) {
      return false;
    }
    app.load.show();
    var url,data;

    if(_this.data.state==1){
      url = app.api + 'expert/expert_collect_list';
      data = {
        page: _this.data.pageNo,
        limit: _this.data.limit,
      }
    }else{
      url = app.api + 'football/collect';
      data = {
        pageNo: _this.data.pageNo,
        limit: _this.data.limit,
      }
    }
    app.ajax({
      url: url,
      type: 'GET',
      data: data,
      success(res) {
        let lists = _this.data.state == 2 ? res.list : res.data;

        if(_this.data.state==2){
          for (var key in lists) {
            var item = lists[key];
            let sjhDate = new Date(item.match_time*1000);
            let month = sjhDate.getMonth()+1,day = sjhDate.getDate(),hour = sjhDate.getHours(),minutes = sjhDate.getMinutes();
            month = month<10?'0'+month:month;
            day = day<10?'0'+day:day;
            hour = hour<10?'0'+hour:hour;
            minutes = minutes<10?'0'+minutes:minutes;
            item.sjhTime =  month+'-'+day+' '+hour+':'+minutes;
            item.home_position = item.home_position.replace(/[^0-9]/ig,"");
            item.away_position = item.away_position.replace(/[^0-9]/ig,"");
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

  /**
* 页面上拉触底事件的处理函数
*/
  onReachBottom: function () {
    var _this = this;
    _this.getList();
  },


  //收藏专家
  collectInfo: function (e) {
    var _this = this;
    if (!_this.data.submited) {
      return false;
    }
    var item = e.currentTarget.dataset.item;

    _this.setData({
      submited: false
    })
    app.ajax({
      url: app.api + 'expert/collect_expert',
      type: 'GET',
      data: {
        id: item.expert.id,
        type: 2 //	1-关注 2-取消
      },
      success(res) {
        wx.showToast({
          title: '取消关注',
          icon: 'none',
        });
        setTimeout(function(){
          _this.setData({
            isMore: true,
            pageNo: 1,
            list: null,
          })
          _this.getList();
        },500)
       
      },
      complete() {
        _this.setData({
          submited: true
        })
      }
    });

  },

  // 关注比赛
  collectMatch: function (e) {
    var _this = this;
    var item = e.target.dataset.item;
    if (!_this.data.submited) {
      return false;
    }
    _this.setData({
      submited: false
    })
    app.ajax({
      url: app.api + 'football/collect',
      type: 'post',
      data: {
        matchId: item.match_id,
      },
      success(res) {
        _this.setData({
          isMore: true,
          pageNo: 1,
          list: null,
        })
        _this.getList()
      },
      complete() {
        _this.setData({
          submited: true
        })
      }
    });

  },

 

})