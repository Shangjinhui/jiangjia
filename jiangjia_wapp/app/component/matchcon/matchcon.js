const app = getApp();
Component({
  options: {
    addGlobalClass: true,
  },
  /**
   * 组件的属性列表
   */
  properties: {
    list: {
      type: Array,
      value: []
    },
    type: {
      type: String,
      value: 1
    },
    cur: {
      type: String,
      value: ''
    },
  },
  /**
   * 组件的初始数据
   */
  data: {
    imgUrl: app.imgUrl,
    submited:true
  },
  methods: {
    // 关注
    collectInfo: function (e) {
      var _this = this;
      app.checkLogin(() => {
        var item = e.target.dataset.item;
        var idx = e.target.dataset.idx;
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
            // if (_this.data.cur){
            //   _this.triggerEvent("traList" + _this.data.type + _this.data.cur, list)
            // }else{
            //   _this.triggerEvent("traList" + _this.data.type, list)
            // }
            if (_this.data.type==4){
              wx.showToast({
                title: '取消关注',
                icon: 'success',
              });
              let timer = setTimeout(()=>{
                clearTimeout(timer);
                _this.triggerEvent("traList4" , '1')
              },800)
            }else{
              var list = _this.data.list;
              list[idx].isCollect = list[idx].isCollect == 1 ? 0 : 1
              // ---关注切换赛程没有刷新，手动修改赛程关注数据
              // if(_this.data.type==2){
              //   let pages =  getCurrentPages()
              //   let parent = pages[pages.length - 1];
              //   parent.setData({list2:list})
              // }
              

              _this.setData({
                list: list
              })
              wx.showToast({
                title: list[idx].isCollect == 1 ? '关注成功' : '取消关注',
                icon: 'success',
              });
            }
          },
          complete() {
            _this.setData({
              submited: true
            })
          }
        });
      });

    },

  },

  /**
   * 组件的方法列表
   */
})