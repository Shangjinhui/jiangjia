// pages/expertInfo/expertInfo.js
import * as echarts from '../../ec-canvas/echarts';
const util = require('../../libs/util.js');
const app = getApp();
var chart = null;

Page({
  /** 
   * 页面的初始数据 
   */
  data: {
    imgUrl: app.imgUrl,
    id: '',
    navList: [],
    nav: 2,
    showMore: false,
    submited: true,
    info: '',

    winning: null,
    rawData: [],
    nowAvg:'',

    pageNo: 1,
    limit: 10,
    isMore: true,
    list: null,

    isHome: false,//是否关闭其他页面
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var _this = this;
    _this.setData({
      id: options.id
    })

    var pageLength = getCurrentPages().length;
    if (pageLength >= 7) {
      _this.setData({
        isHome: true
      })
    }

    if (options.flagCode) {
      wx.setStorageSync('otflagCode', options.flagCode)
    }


  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    app.checkLogin(() => {
      this.getIpdirect();
      // this.setData({
      //   navList: [
      //     { id: 2, name: '正在推荐' },
      //     { id: 3, name: '历史推荐' },
      //   ],
      //   nav: 2
      // })
      // this.getInfo()

    });
  },

  //通过ip获取该用户是否可以观看直播
  getIpdirect: function () {
    var _this = this;
    app.ajax({
      url: app.api + 'expert/ip_direct',
      type: 'GET',
      success(res) {
        if (res.canWatchDirect == 1) {
          navList.push()
          _this.setData({
            navList: [
              { id: 2, name: '正在推荐' },
              {id: 1,name: '近期直播'},
              {id: 3,name: '历史推荐'},
            ],
          })

        } else {
          _this.setData({
            navList: [
              { id: 2, name: '正在推荐' },
              { id: 3, name: '历史推荐' },
            ],
            nav:2
          })
        }

        _this.getInfo()
      },
      complete() {
      }
    });
  },

  //专家详情
  getInfo: function() {
    var _this = this;
    app.load.show();
    app.ajax({
      url: app.api + 'expert/expert_detail',
      type: 'GET',
      data: {
        id: _this.data.id,
      },
      success(res) {

        var labelList = [];
        if (res.label) {
          labelList.push(res.label)
        }
        if (res.continueFocus >= 3) {
          labelList.push(res.continueFocus + '连红')
        }
        if (labelList.length < 2 && res.focus >= 10 && res.articleCount >= 20) {
          labelList.push('近20中' + res.focus)
        }
        if (labelList.length < 2 && res.focusArticleCount > 0) {
          labelList.push('总' + res.articleCount + '中' + res.focusArticleCount)
        }
        res.labelList = labelList

        var rawData = [];
        for (var key in res.focusAvg) {
          var item = res.focusAvg[key];
          var arr = {
            name: '近' + item.count + '场',
            avg: item.focusArticleAvg*100 ,
            tx: '近' + item.count + '中' + item.focus
          }
          rawData.push(arr)
          if (res.articleCount >= 10) {
            if (item.count==10){
              _this.setData({
                nowAvg: arr
              })
            }
          } else {
            _this.setData({
              nowAvg: {
                name: '近' + res.articleCount + '场',
                avg: parseInt(res.focusArticleCount / res.articleCount * 100),
                tx: '近' + res.articleCount + '中' + res.focusArticleCount
              }
            })
          }
        }
        
        res.rawData = rawData
        _this.setData({
          rawData: _this.handleHistoryProjectTrend(rawData),
          info: res
        }, () => {
          _this.setData({
            winning: {
              onInit: _this.initChart(_this.data.rawData)
            },
          }) //初始化图表
        })
        _this.setData({
          isMore: true,
          pageNo: 1,
          list: null,
        })
        _this.getList();



        //创建节点选择器
        var query = wx.createSelectorQuery();
        //选择id
        query.select('#mjltest').boundingClientRect()
        query.exec(function (res) {
          //res就是 所有标签为mjltest的元素的信息 的数组
          //取高度
          let systemInfo = wx.getSystemInfoSync();
          let ratio = 750 / systemInfo.windowWidth
          if (res[0].height * ratio>76){
            _this.setData({
              showMore:true
            })
          }
        })

      },
      complete() {
        app.load.hide();
      }
    });

  },

  //专家详情推荐相关
  getList: function () {
    var _this = this;
    if (!_this.data.isMore) {
      return false;
    }
    app.load.show();
    app.ajax({
      url: app.api + 'expert/expert_detail_article',
      type: 'GET',
      data: {
        page: _this.data.pageNo,
        limit: _this.data.limit,
        type: _this.data.nav,
        id: _this.data.id
      },
      success(res) {
        let lists = res.data;
        for (var key in lists) {
          var item = lists[key];
          
          if (item.directStartTime ) {
            item.time = util.fdate(item.directStartTime, 'MM-dd HH:mm');
            item.ftime = util.fdate(item.directStartTime, 'E');
          }
          if (item.createTime) {
            item.time = util.fdate(item.createTime, 'MM-dd HH:mm');
          }

          if (_this.data.nav != 1){
            if (item.detail.length==1){
              item.mtime = util.fdate1(item.detail[0].match_time*1000, 'MM-dd HH:mm')
            }else{
              if (item.detail[0].match_time > item.detail[1].match_time){
                item.mtime = util.fdate1(item.detail[1].match_time * 1000, 'MM-dd HH:mm')
              }else{
                item.mtime = util.fdate1(item.detail[0].match_time * 1000, 'MM-dd HH:mm')
              }
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


  //主导航点击
  changeNav: function(e) {
    var _this=this;
    _this.setData({
      nav: e.currentTarget.dataset.nav
    })
    _this.setData({
      isMore: true,
      pageNo: 1,
      list: null,
    })
    _this.getList();
  },


  // 处理折线图数据 
  handleHistoryProjectTrend(list) {
    let json = {
      xaxis: [],
      series: []
    }
    json.start = list.length > 3 ? parseInt((list.length - 3) / list.length * 100) : 0
    json.end = 100

    list.forEach((n, index) => {
      json.xaxis.push(n.name)
      json.series.push(parseInt(n.avg))
    })
    return json
  },


  //初始化折现数据
  initChart(json) {
    var _this = this;
    return function(canvas, width, height) {
      chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      canvas.setChart(chart);
      _this.getOption(chart, json)
      return chart;
    }


  },

  getOption: function(chart, json) {
    var _this = this;
    console.log(JSON.stringify(json))
    var option = {
      xAxis: {
        type: 'category',
        data: json.xaxis,
        boundaryGap: false,
        splitLine:{show: true},
        // splitNumber: 4,
        // axisPointer: {
        //   z: 40
        // },
        axisLabel: {
          interval: json.xaxis.length>5? parseInt(json.xaxis.length / 4):0,
          //代表显示所有x轴标签显示
          textStyle: {
            color: '#8A8A8A',
            right: 'right',
            fontSize: 11
          }
        }
      },
      yAxis: {
        scale: true,
        x: 'right',
        min: 0, // 起始
        max: 100,// 终止
        axisLine: {
          lineStyle: {
            type: 'solid',
            color: '#8D8D8D',
            width: '1',
            opacity: 0.3
          }
        },

        splitLine: {
          show: true,
          lineStyle: {
            color: ['#8D8D8D'],
            width: 1,
            type: 'solid',
            opacity: 0.3
          }
        },
        // splitNumber: json.splitNumber,
        axisLabel: {
          textStyle: {
            right: 'right',
            fontSize: 10
          },
          formatter: '{value}%'
        }
      },
      grid: {
        right: '18',
        top: '24',
        bottom: '31',
        borderColor: '#DDDDDD',
        borderWidth: 4,
      },
      // dataZoom: [{
      //   type: 'inside',
      //   start: json.start,
      //   end: json.end //0数据从起始开始显示，100还是从结束时间开始
      // }],
      series: [{
        animation: true, //动画效果
        symbolSize: 9,
        type: 'line',
        data: json.series,
        label: {
          normal: {
            show: true,
            color: '#333',
            // backgroundColor: '#BC0100',
            fontSize: 8,
            padding: [2, 4],
            formatter: '{c}%',
            // formatter: function(param) {
            //   var forstr
            //   for (var key in _this.data.info.rawData){
            //     if (_this.data.info.rawData[key].name == param.name){
            //       forstr = _this.data.info.rawData[key].tx +' '+ param.value+'%'
            //     }
            //   }
            //   return forstr;
            // }
          }
        },
        itemStyle: {
          normal: {
            color: 'rgb(230, 57, 69)',
            lineStyle: {
              width: 2
            },
            rich: {}
          },
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: 'rgb(255,195,199)'
          }, {
            offset: 1,
            color: 'rgba(255,195,199,0)'
          }]),
        },
      }]
    }

    chart.clear();
    chart.setOption(option);
  },


  moreShow: function() {
    this.setData({
      showMore: false
    })
  },

  //收藏专家
  collectInfo: function() {
    var _this = this;
    app.checkLogin(() => {
      if (!_this.data.submited) {
        return false;
      }
      _this.setData({
        submited: false
      })
      app.ajax({
        url: app.api + 'expert/collect_expert',
        type: 'GET',
        data: {
          id: _this.data.id,
          type: _this.data.info.isCollect == 1 ? 2 : 1 //	1-关注 2-取消
        },
        success(res) {
          var info = _this.data.info;
          info.collect = info.isCollect == 1 ? parseInt(info.collect) - 1 : parseInt(info.collect) + 1;
          info.isCollect = info.isCollect == 1 ? 0 : 1;
          _this.setData({
            info: info
          })
          wx.showToast({
            title: info.isCollect == 1 ? '关注成功' : '取消关注',
            icon: 'success',
          });
        },
        complete() {
          _this.setData({
            submited: true
          })
        }
      });
    });

  },

  /**
  * 页面上拉触底事件的处理函数
  */
  onReachBottom: function () {
    var _this = this;
    _this.getList();

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
      title: _this.data.info.nickName+'专家详情介绍',
      path: '/pages/expertInfo/expertInfo?id=' + _this.data.id + '&flagCode=' + wx.getStorageSync('flagCode'),
      imageUrl: _this.data.imgUrl + 'share.jpg'
    }


  }
})