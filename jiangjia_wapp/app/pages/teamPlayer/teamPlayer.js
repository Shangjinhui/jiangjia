// pages/teamPlayer/teamPlayer.js
const app = getApp();
const util = require('../../libs/util.js');
// 初始化数据
var numCount; //元素个数
let systemInfo = wx.getSystemInfoSync();
let ratio = 750 / systemInfo.windowWidth;
var numSlot = 4; //一条线上的总节点数
//Canvas的宽度
var mWX = 702 / ratio;
var mWY = 413 / ratio;

//中心点
var mCenterX = mWX / 2;
var mCenterY = mWY / 2;


//角度
var mAngle;
//半径(减去的值用于给绘制的文本留空间)
var mRadius = mCenterY - 75 / ratio;
//获取指定的Canvas
var radCtx = wx.createCanvasContext("radarCanvas")

Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.imgUrl,
    isFixed: false,
    navList: [{
        id: '1',
        name: '基本信息'
      },
      {
        id: '2',
        name: '技术统计'
      },
      {
        id: '3',
        name: '比赛'
      },
    ],
    nav: '1',
    chanelArray1: [],
    id: '',
    info: '',

    statsInfo:'',

    pageNo: 1,
    limit: 10,
    isMore: true,
    list: null,//比赛列表

    tranShow:false,
    honorShow: false,


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
    cateLogo:'',

    showCanvas:true,

    scrollTop:0,
    canvasShow:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      id: options.id
    })
    
    if (options.flagCode) {
      wx.setStorageSync('otflagCode', options.flagCode)
    }
    this.getInfo()
    app.checkLogin(() => {
      
    });
  },

  getInfo: function() {
    var _this = this;
    app.load.show();
    app.ajax({
      url: app.api + 'football/player_info',
      type: 'GET',
      data: {
        playerId: _this.data.id,
      },
      success(res) {
        if (res.player_info.contract_until) {
          res.player_info.contract_until = util.fdate1(res.player_info.contract_until * 1000, 'yyyy-MM-dd');
        }
        if (res.player_info.birthday) {
          res.player_info.birthday = util.fdate1(res.player_info.birthday * 1000, 'yyyy-MM-dd');
        }



        // 惯用脚
        var name = '';
        switch (res.player_info.preferred_foot) {
          case '0':
            name = '未知';
            break;
          case '1':
            name = '左脚';
            break;
          case '2':
            name = '右脚';
            break;
          case '3':
            name = '左右脚';
            break;
        }

        res.player_info.preferred_foot_name = name;

        // 主要位置
        var position = '';
        switch (res.player_info.position) {
          case 'F':
            position = '前锋';
            break;
          case 'M':
            position = '中场';
            break;
          case 'D':
            position = '后卫';
            break;
          case 'G':
            position = '守门员';
            break;
          default:
            position = '未知';
        }
        res.player_info.position_name = position;


        //优势
        res.player_info.advantage = JSON.parse(res.player_info.advantage);
        var advantageList = _this.advantage(res.player_info.advantage);
        res.player_info.advantage_name = advantageList;

        // 劣势
        res.player_info.defect = JSON.parse(res.player_info.defect);
        var defectList = _this.advantage(res.player_info.defect);
        res.player_info.defect_name = defectList;


        // 擅长位置
        var positions = '';
        if (res.player_info.positions && res.player_info.positions.length>0){
          switch (res.player_info.positions[0]) {
            case 'LW':
              positions = '左边锋';
              break;
            case 'RW':
              positions = '右边锋';
              break;
            case 'ST':
              positions = '前锋';
              break;
            case 'AM':
              positions = '攻击型中';
              break;
            case 'ML':
              positions = '左中场';
              break;
            case 'MC':
              positions = '中路中场';
              break;
            case 'MR':
              positions = '右中场';
              break;
            case 'DM':
              positions = '防守型中';
              break;
            case 'DL':
              positions = '左后卫';
              break;
            case 'DC':
              positions = '中后卫';
              break;
            case 'DR':
              positions = '右后卫';
              break;
            case 'GK':
              positions = '守门员';
              break;
          }
        }
        
        res.player_info.positions_name = positions;


        if (res.transfer.length>0){
          let lists = res.transfer;
          for (var key in lists) {
            var item = lists[key];
            if (item.transfer_time) {
              item.time = util.fdate1(item.transfer_time * 1000, 'yyyy-MM-dd');
            }
          }
        }
        
        


        _this.setData({
          info: res,
          isShow: true
        })
        wx.setNavigationBarTitle({
          title: res.player_info.player_name
        })


        //雷达图
        var chanelArray1=[];
        var ability = JSON.parse(res.player_info.ability);
        if (ability&&ability.length>0){
          for (var key in ability) {
            var item = ability[key];
            var name;
            if (item[0] == 1) {
              name = '扑救'
            } else if (item[0] == 2) {
              name = '预判'
            } else if (item[0] == 3) {
              name = '处理球'
            } else if (item[0] == 4) {
              name = '空中'
            } else if (item[0] == 5) {
              name = '战术'
            } else if (item[0] == 6) {
              name = '进攻'
            } else if (item[0] == 7) {
              name = '防守'
            } else if (item[0] == 8) {
              name = '创造力'
            } else if (item[0] == 9) {
              name = '技术'
            }
            chanelArray1.push([name, item[1]])
          }

          var newArray=[];
          for (var key in chanelArray1){
            if(key==0){
              newArray.push(chanelArray1[key])
            }else{
              newArray.push(chanelArray1[chanelArray1.length - key])
            }
          }

          _this.setData({
            chanelArray1: newArray
          })

          numCount = _this.data.chanelArray1.length;
          mAngle = Math.PI * 2 / numCount
          _this.drawRadar()
        }

      },
      complete() {
        app.load.hide();
      }
    });
  },

  //	足球球员--技术统计
  getStats: function () {
    var _this = this;
    app.load.show();
    app.ajax({
      url: app.api + 'football/player_stats',
      type: 'GET',
      data: {
        playerId: _this.data.id,
        seasonId: _this.data.seasonId
      },
      success(res) {
        var info=res.info;
        if (JSON.stringify(info) == "{}"){
          info=''
        }
        _this.setData({
          statsInfo: info,
          categoryList: res.category
        })


        if (!_this.data.seasonId && res.category.length>0) {
          _this.getseason();
        }
      },
      complete() {
        app.load.hide();
      }
    });
  },

  //比赛
  getMatchList: function () {
    var _this = this;
    if (!_this.data.isMore) {
      return false;
    }
    app.load.show();
    app.ajax({
      url: app.api + 'football/player_match',
      type: 'GET',
      data: {
        pageNo: _this.data.pageNo,
        limit: _this.data.limit,
        playerId: _this.data.id
      },
      success(res) {
        let lists = res.list;

        for (var key in lists) {
          for (var itkey in lists[key].list) {
            var item = lists[key].list[itkey];
            if (item.match_time) {
              item.time = util.fdate1(item.match_time * 1000, 'yy/MM/dd HH:mm');
            }
          }
        }
        if (_this.data.pageNo == 1) {
          _this.setData({
            list: lists,
            isShow: true
          })
        } else {
          // var list = _this.data.list
          // console.log(list, lists)
          // if (list[list.length - 1].competition_name == lists[0].competition_name){
          //   list[list.length - 1].list = list[list.length - 1].list.concat(lists[0].list)
          //   if (lists.length >1) {
          //     for (var i = 1; i <lists.length;i++ ){
          //       list.push(lists[i])
          //     }
          //   }
          // }else{
          //   list = list.concat(lists)
          // }
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


  // 初始赋值
  getseason: function () {
    let _this = this;

    let cateDate = _this.data.categoryList;
    const cateList = [];
    const seasonList = [];

    for (let i = 0; i < cateDate.length; i++) {
      cateList.push({
        name: cateDate[i].competition_name,
        logo: cateDate[i].competition_logo
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
      cateLogo: cateList[0].logo,
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
    console.log(this.data.editseason)
    this.setData({
      condition: !this.data.condition,
      cate: this.data.editcate.name,
      cateLogo: this.data.editcate.logo,
      season: this.data.editseason.name,
      seasonId: this.data.editseason.oid,
    })
    console.log(this.data.editseason)
    this.getStats();
  },



  // 优劣势显示
  advantage:function(list){
    var advantageList = [];
    for (var key in list) {
      var item = list[key];
      var advantage = '';
      switch (item[0]) {
        case 1:
          advantage = '卸球';
          break;
        case 2:
          advantage = '罚点球';
          break;
        case 3:
          advantage = '直接任意球';
          break;
        case 4:
          advantage = '远射';
          break;
        case 5:
          advantage = '临门一脚';
          break;
        case 6:
          advantage = '传球';
          break;
        case 7:
          advantage = '组织进攻';
          break;
        case 8:
          advantage = '带球';
          break;
        case 9:
          advantage = '断球';
          break;
        case 10:
          advantage = '铲球';
          break;
        case 11:
          advantage = '稳定性';
          break;
        case 12:
          advantage = '过人';
          break;
        case 13:
          advantage = '长传';
          break;
        case 14:
          advantage = '控球';
          break;
        case 15:
          advantage = '空中对抗';
          break;
        case 16:
          advantage = '地面对抗';
          break;
        case 17:
          advantage = '失误倾向';
          break;
        case 18:
          advantage = '纪律性';
          break;
        case 19:
          advantage = '扑点球';
          break;
        case 20:
          advantage = '反应';
          break;
        case 21:
          advantage = '弃门参与进攻';
          break;
        case 22:
          advantage = '高球拦截';
          break;
        case 23:
          advantage = '处理球';
          break;
        case 24:
          advantage = '远距离射门';
          break;
        case 25:
          advantage = '站位';
          break;
        case 26:
          advantage = '高位紧逼';
          break;
        case 27:
          advantage = '远射扑救';
          break;
      }
      advantageList.push(advantage)
    }
    return advantageList;
  },

  // 雷达图
  drawRadar: function() {
    var sourceData1 = this.data.chanelArray1

    //调用
    this.drawEdge() //画五边形
    //this.drawArcEdge() //画圆
    this.drawLinePoint()
    //设置数据
    this.drawRegion(sourceData1, 'rgba(231, 20, 21, 0.1)') //第一个人的
    //设置文本数据
    this.drawTextCans(sourceData1)
    //设置节点
    this.drawCircle(sourceData1, '#E71C1D')
    //开始绘制
    radCtx.draw()
  },

  // 第一步：绘制5条边
  drawEdge: function() {
    radCtx.setStrokeStyle("#E2DFDF")
    radCtx.setLineWidth(1) //设置线宽
    for (var i = 0; i < numSlot; i++) {
      //计算半径
      radCtx.beginPath()
      var rdius = mRadius / numSlot * (i + 1)
      //画5条线段
      for (var j = 0; j < numCount; j++) {
        //坐标
        var y = mCenterY - rdius * Math.cos(mAngle * j);
        var x = mCenterX - rdius * Math.sin(mAngle * j);
        radCtx.lineTo(x, y);
      }
      radCtx.closePath()
      radCtx.stroke()
    }
  },
  // 第二步：绘制连接点
  drawLinePoint: function() {
    radCtx.beginPath();
    for (var k = 0; k < numCount; k++) {
      var y = mCenterY - mRadius * Math.cos(mAngle * k);
      var x = mCenterX - mRadius * Math.sin(mAngle * k);

      radCtx.moveTo(mCenterX, mCenterY);
      radCtx.lineTo(x, y);
    }
    radCtx.stroke();
  },
  //第三步：绘制文字（文字位置可能需要微调）
  drawTextCans: function(mData) {
    radCtx.setFillStyle("#333")
    //设置字体
    radCtx.setFontSize(26 / ratio)
    for (var n = 0; n < numCount; n++) {
      var y = mCenterY - mRadius * Math.cos(mAngle * n);
      var x = mCenterX - mRadius * Math.sin(mAngle * n);
      // radCtx.fillText(mData[n][0], x, y);
      var width = radCtx.measureText(mData[n][0]).width + radCtx.measureText(mData[n][1]).width + 10
      //通过不同的位置，调整文本的显示位置
      if (mAngle * n == 0 && mAngle * n <= Math.PI / 2) {
        radCtx.fillText(mData[n][0] + '(' + mData[n][1] + ')', x - width / 2, y - 5);
      } else if (mAngle * n > 0 && mAngle * n <= Math.PI / 2) {
        radCtx.fillText(mData[n][0] + '(' + mData[n][1] + ')', x - width - 7, y + 5);
      } else if (mAngle * n > Math.PI / 2 && mAngle * n <= Math.PI) {
        radCtx.fillText(mData[n][0] + '(' + mData[n][1] + ')', x - width - 7, y + 5);
      } else if (mAngle * n > Math.PI && mAngle * n <= Math.PI * 3 / 2) {
        radCtx.fillText(mData[n][0] + '(' + mData[n][1] + ')', x + 5, y + 5);
      } else {
        radCtx.fillText(mData[n][0] + '(' + mData[n][1] + ')', x + 7, y + 2);
      }

    }
  },
  //绘制红色数据区域(数据和填充颜色)
  drawRegion: function(mData, color) {

    radCtx.beginPath();
    for (var m = 0; m < numCount; m++) {
      var y = mCenterY - mRadius * Math.cos(mAngle * m) * mData[m][1] / 100;
      var x = mCenterX - mRadius * Math.sin(mAngle * m) * mData[m][1] / 100;
      radCtx.lineTo(x, y);
    }

    radCtx.closePath();
    radCtx.setFillStyle(color)
    radCtx.fill();

    radCtx.beginPath()
    radCtx.setStrokeStyle("#E71C1D")
    radCtx.setLineWidth(1) //设置线宽
    for (var m = 0; m < numCount; m++) {
      var y = mCenterY - mRadius * Math.cos(mAngle * m) * mData[m][1] / 100;
      var x = mCenterX - mRadius * Math.sin(mAngle * m) * mData[m][1] / 100;
      radCtx.lineTo(x, y);
    }
    radCtx.closePath()
    radCtx.stroke()
   

  },
  //画点
  drawCircle: function(mData, color) {
    var r = 1.5; //设置节点小圆点的半径
    for (var i = 0; i < numCount; i++) {
      var y = mCenterY - mRadius * Math.cos(mAngle * i) * mData[i][1] / 100;
      var x = mCenterX - mRadius * Math.sin(mAngle * i) * mData[i][1] / 100;
      radCtx.beginPath();
      radCtx.arc(x, y, r, 0, Math.PI * 2);
      radCtx.fillStyle = color;
      radCtx.fill();
    }
  },

  //主导航点击
  changeNav: function(e) {
    this.setData({
      nav: e.currentTarget.dataset.nav,
      scrollTop:0
    })
    if (this.data.nav == '1') {

    } else if (this.data.nav == '2') {
      this.getStats()
    } else if (this.data.nav == '3') {
      this.setData({
        pageNo: 1,
        isMore: true,
      })
      this.getMatchList()
    }
  },


  // 页面滑动时触发
  onPageScroll: function(e) {
    var scrollTop = e.detail ? e.detail.scrollTop : e.scrollTop

    this.setData({
      scrollTop: scrollTop
    })
  },

  showTran:function(){
    this.setData({
      tranShow: !this.data.tranShow,
      canvasShow: !this.data.canvasShow
    })
  },

  showHonor: function () {
    this.setData({
      honorShow: !this.data.honorShow,
      canvasShow: !this.data.canvasShow
    })
  },

  



  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (this.data.nav == '3') {
      this.getMatchList()
    }
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
      title: _this.data.info.player_info.player_name + '球员详情',
      path: '/pages/teamPlayer/teamPlayer?id=' + _this.data.id + '&flagCode=' + wx.getStorageSync('flagCode'),
      imageUrl: _this.data.imgUrl + 'share.jpg'
    }


  }
})