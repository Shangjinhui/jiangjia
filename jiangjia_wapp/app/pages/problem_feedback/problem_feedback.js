// pages/problem_feedback/problem_feedback.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.imgUrl,
    isIphoneX: app.globalData.isIphoneX,

    submited: true,
    title:'',
    content:'',
    photoBaseList: [],
    photoList: [],
    photo: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.checkLogin(() => {


    });
  },
  bindinput: function (e) {
    this.setData({
      [e.currentTarget.dataset.cur]: e.detail.value
    })
  },


  //这里触发图片上传的方法
  uploadImgSubmit: function () {
    var _this = this;
    if (!_this.data.submited) { return false; }
    if (!_this.data.title) {
      wx.showToast({
        title: '请输入标题内容',
        icon: 'none',
      });
      return false;
    }
    if (!_this.data.content) {
      wx.showToast({
        title: '请详细描述您的问题',
        icon: 'none',
      });
      return false;
    }
    _this.setData({
      submited: false
    })
    app.load.show();

    var files = _this.data.photoList;
    var photoId = _this.data.photo;

    if (files.length > 0) {
      if (photoId.length == files.length) {
        _this.save();
      } else {
        var newFile = [];
        for (var key in files) {
          if (key >= photoId.length) {
            newFile.push(files[key]);
          }
        }
        _this.uploadimgs({
          url: app.api1 + 'fileupload/photo', //这里是你图片上传的接口
          path: newFile //这里是选取的图片的地址数组
        });
      }
    } else {
      _this.save();
    }

  },
  //多张图片上传
  uploadimgs: function (data) {
    var _this = this,
      i = data.i ? data.i : 0,
      success = data.success ? data.success : 0,
      fail = data.fail ? data.fail : 0;

    wx.uploadFile({
      url: data.url,
      filePath: data.path[i],
      name: 'uploadFile',
      formData: null,
      header: {
        AUTHORIZATION: wx.getStorageSync('Token'),
        PLATFORM: 3,
        AppVersion: '1.0.0'
      },
      success: (resp) => {
        success++;

        let res = JSON.parse(resp.data)

        if (res.returnCode == '0000') {
          let photo = _this.data.photo;
          photo.push(res.data.id)
          _this.setData({
            photo: photo
          })
        } else {
          wx.showToast({
            title: res.msg,
            icon: 'none'
          });
        }
      },
      fail: (res) => {
        fail++;
        app.load.hide();
        wx.showToast({
          title: JSON.parse(res.data).msg,
          icon: 'none'
        });
      },
      complete: () => {
        _this.setData({
          submited: true
        })
        i++;
        if (i == data.path.length) { //当图片传完时，停止调用   
          _this.save();
          //上传完后再执行的方法
          console.log(_this.data.photo);
        } else { //若图片还没有传完，则继续调用函数
          data.i = i;
          data.success = success;
          data.fail = fail;
          _this.uploadimgs(data);
        }

      }
    });
  },
  // 上传图片
  addImg: function () {
    var _this = this;
    wx.chooseImage({
      count: 5 - this.data.photoList.length,
      sizeType: ['original', 'compressed'],
      success: function (res) {
        const tempFilePaths = res.tempFilePaths;
        console.log(tempFilePaths)
        let photoList = _this.data.photoList;
        for (let key in tempFilePaths) {
          // 图片转base64
          app.load.show();
          wx.getFileSystemManager().readFile({
            filePath: tempFilePaths[key], //选择图片返回的相对路径
            encoding: 'base64', //编码格式
            success: res => { //成功的回调
              let photoBaseList = _this.data.photoBaseList;
              photoBaseList.push('data:image/png;base64,' + res.data)
              _this.setData({
                photoBaseList: photoBaseList
              })
              if (key == tempFilePaths.length-1){
                app.load.hide();
              }
            },
          })
        }
        _this.setData({
          photoList: photoList,
        })
      }
    })
  },
  deleteImg: function (e) {
    var _this = this;
    let cur = e.currentTarget.dataset.cur;
    let photoList = _this.data.photoList;
    let photoBaseList = _this.data.photoBaseList;

    let photo = _this.data.photo;

    // let newList = [];
    // let newPho = []
    // for (let key in photoList) {
    //   if (key != cur) {
    //     newList.push(photoList[key])
    //     if (photo[key]) {
    //       newPho.push(photo[key])
    //     }
    //   }
    // }
    photoList.splice(cur, 1);
    photoBaseList.splice(cur, 1);
    photo.splice(cur, 1);

    _this.setData({
      photoList: newList,
      photoBaseList: photoBaseList,
      photo: newPho
    })
  },

  save: function () {
    var _this = this;
    app.ajax({
      url: app.api + "common/create_suggest",
      type: 'post',
      data: {
        title: _this.data.title,
        content: _this.data.content,
        photo: _this.data.photoList.length > 0 ? _this.data.photo.join(',') : '',
      },
      success(res) {
        wx.showToast({
          title: '操作成功',
          icon: 'none',
        });
        setTimeout(function () {
          wx.navigateBack({
            delta: 1
          })
        }, 1000)
      },
      complete() {
        _this.setData({
          submited: true
        })
      }
    });
  },
})