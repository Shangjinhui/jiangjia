// pages/studio/studio.js
const app = getApp();
const Mudu = require('../../libs/wechat-mudu.min')
const util = require('../../libs/util.js');

Page({
  /** 
   * 页面的初始数据 
   */
  data: {
    imgUrl: app.imgUrl,
    isIphoneX: app.globalData.isIphoneX,
    id: '',
    info:'',
    roomUrl:'',
    commentList: [],
    comment:'',
    height:0,
    scrollTop:0,
    ifBottom:true


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this=this;
   
    

    var height;
    let systemInfo = wx.getSystemInfoSync();
    let ratio= 750 / systemInfo.windowWidth
    height = systemInfo.windowHeight - (420 + 102 + 88) / ratio;
    if (_this.data.isIphoneX){
      height = height - 68 / ratio
      console.log(height)

    }
    this.setData({
      id: options.id,
      height: height
    })

   


    Mudu.Init(
      // 频道id

      this.data.id,

      // 初始化完成的回调函数，无参数
      function () {
        console.log('Mudu Web Sdk 初始化成功')

        if (wx.getStorageSync('userInfo')) {
          var info = JSON.parse(app.Decrypt(wx.getStorageSync('userInfo')))
          Mudu.Room.User.Assign({
            name: info.nickName, // string
            avatar: info.avatar, // string 网络链接
            assignId: info.id // B端平台识别id string
          }, function () {
          })
        } else {
          app.checkLogin(() => {
            _this.getInfo()
          });
        }

        _this.setData({
          roomUrl: Mudu.Room.GetPlayAddr() //获取直播间视频地址
        })

        Mudu.Room.Player.OnPlay()

        Mudu.MsgBus.On(
          // 事件名，值为Comment.New
          'Comment.New',

          // 事件处理函数，参数为新的评论，类型为object
          function (newComment) {
            console.log(newComment)
            newComment = JSON.parse(newComment);
            var commentList = _this.data.commentList;
            commentList.push({ name: newComment.username, message: newComment.message, avatar: newComment.avatar, time: util.fdate1(newComment.dateline*1000 , 'yyyy-MM-dd HH:mm')})
            console.log(newComment)
            _this.setData({
              commentList: commentList
            })

            if (_this.data.ifBottom) {
              _this.setData({
                scrollTop: commentList.length * 100
              })
            }

          }
        )

        //会在直播流状态改变时(通常是后台开始直播或者关闭直播)被触发
        Mudu.MsgBus.On(
          // 事件名，值为Room.StreamEvent
          'Room.StreamEvent',

          // 事件处理函数，参数类型为object
          function (data) {
            data = JSON.parse(data)
            if (data.event!=1){
              wx.showToast({
                title: '直播已结束',
                icon: 'none',
              });
              setTimeout(function () {
                wx.navigateBack({
                  delta: 2
                })
              }, 500)
            }
          }
        )
      }
    )

    

    // setInterval(function(){
    //   var commentList = _this.data.commentList;
    //   commentList.push({ name: '拉拉', message: '33333', avatar: '', time: 'yyyy-MM-dd HH:mm' })
    //   _this.setData({
    //     commentList: commentList,
    //   })
    // },5000)

  },
  onShow: function () {
    try {
      if ('function' === typeof Mudu.Room.reconnectSocket) {
        Mudu.Room.reconnectSocket() // 该方法在Mudu.Init成功后，才会挂载在Mudu.Room上
      }
    } catch (e) {
      console.warn('reconnect mudu socket error: ', e)
    }
  },
  onHide: function () {
    try {
      if ('function' === typeof Mudu.Room.closeSocket) {
        Mudu.Room.closeSocket() // 该方法在Mudu.Init成功后，才会挂载在Mudu.Room上
      }
    } catch (e) {
      console.warn('close mudu socket error: ', e)
    }

    Mudu.Room.Player.OnPageHide()
  },

  onPlay() {
    Mudu.Room.Player.OnPlay()
  },
  onPause() {
    Mudu.Room.Player.OnPause()
  },
  onEnded() {
    Mudu.Room.Player.OnEnded()
  },
  
  onUnload() {
    try {
      if ('function' === typeof Mudu.Room.closeSocket) {
        Mudu.Room.closeSocket() // 该方法在Mudu.Init成功后，才会挂载在Mudu.Room上
      }
    } catch (e) {
      console.warn('close mudu socket error: ', e)
    }
    Mudu.Room.Player.OnPageUnload()
  },


  bindinput: function (e) {
    this.setData({
      [e.currentTarget.dataset.cur]: e.detail.value
    })
  },
 

  getInfo: function () {
    var _this = this;
    app.load.show();
    app.ajax({
      url: app.api + 'member/info',
      type: 'GET',
      success(res) {
        var info=res
        _this.setData({
          info: res,
        })

      
        Mudu.Room.User.Assign({
          name: info.nickName, // string
          avatar: info.avatar, // string 网络链接
          assignId: info.id // B端平台识别id string
        }, function () {
        })

      },
      complete() {
        app.load.hide();
      }
    });

  },

  // 发送评论
  sendInfo:function(){
    var _this=this;
    if (!_this.data.comment){
      wx.showToast({
        title: '内容不能为空',
        icon: 'none',
      });
      return false;
    }
    Mudu.Room.Comment.Send(
      // 要发送的评论文本，类型为string
      _this.data.comment,

      // 发送完成的回调函数，参数为response对象
      function (response) {
        response = JSON.parse(response)
        if (response.status === 'y') {
          // wx.showToast({
          //   title: '发送成功',
          //   icon: 'none',
          // });
          _this.setData({
            comment:''
          })
        }
        if (response.status === 'n') {
          var rea=''
          if (response.flag =='101'){
            rea ='管理员禁止了聊天	'
          } else if (response.flag == '102') {
            rea = '观众被禁言	'
          } else if (response.flag == '104') {
            rea = '禁止匿名聊天	'
          } 
          wx.showToast({
            title: '发送失败，' + rea,
            icon: 'none',
          });
        }
      }
    )
  },

 

  scroll:function(e){
    if (e.detail.scrollHeight> e.detail.scrollTop +  this.data.height+50){
      this.setData({
        ifBottom: false
      })
    }else{
      this.setData({
        ifBottom: true
      })
    }
    
  },

 

 
})