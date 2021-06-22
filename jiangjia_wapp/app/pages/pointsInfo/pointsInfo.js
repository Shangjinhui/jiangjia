// pages/pointsInfo/pointsInfo.js
const app = getApp();
const city = require('../../libs/city.js');
Page({
  /** 
   * 页面的初始数据 
   */
  data: {
    imgUrl: app.imgUrl,
    isIphoneX: app.globalData.isIphoneX,
    backShow: false,
    id:'',
    info:'',
    isShow:false,


    condition: false,
    cityData: [],//省市区总列表
    province: '',
    provinceId: '',
    provinceList: [],
    city: '',
    cityId: '',
    cityList: [],
    region: '',
    regionId: '',
    regionList: [],
    value: [0, 0, 0],
    values: [0, 0, 0],
    state: false,
    proId: 0, //拖动省下标id
    ciId: 0, //拖动城市下标id
    reId: 0, //拖动区下标id
    editprovi: '',
    editcity: '',
    editregion: '',


    name:'',
    addinfo: '',
    phone: '',

    submited: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id:options.id
    })
    this.getCity();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    app.checkLogin(() => {
      this.getInfo();
    });
  },

  getInfo: function () {
    var _this = this;
    app.load.show();
    app.ajax({
      url: app.api + 'gift/detail',
      type: 'GET',
      data:{
        id:_this.data.id
      },
      success(res) {
        if (res.content) {
          res.content = res.content.replace(/style=""/g, '')
          res.content = res.content.replace(/\<img/g, '<img style="max-width:100%;" ')
        }
        _this.setData({
          info: res,
          isShow:true
        })
      },
      complete() {
        app.load.hide();
      }
    });

  },

  //提示
  tipShow:function(){
    var _this=this;
    var info = _this.data.info;
    if (info.stock<=0){
      wx.showToast({
        title: '礼品已兑换完啦，请选择其他礼品吧～',
        icon: 'none',
      })
    }
    if (parseFloat(info.price) > parseFloat(info.userPoint)){
      wx.showToast({
        title: '积分不足无法兑换，请加油获得积分哦~',
        icon: 'none',
      })
    }
  },

  showBack:function(){
    this.setData({
      backShow: !this.data.backShow
    })
  },

  bindinput: function (e) {
    this.setData({
      [e.currentTarget.dataset.cur]: e.detail.value
    })
  },

  // 兑换积分商品
  pointExchange: function () {
    var _this = this;
    if(!_this.data.submited){return false;}
    if (!_this.data.name) {
      wx.showToast({
        title: '请输入姓名',
        icon: 'none',
      });
      return false;
    }
    if (!_this.data.phone) {
      wx.showToast({
        title: '请输入联系电话',
        icon: 'none',
      });
      return false;
    }
    if (!/^1\d{10}$/.test(_this.data.phone)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
      });
      return false;
    }

    if (!_this.data.province || !_this.data.city || !_this.data.region) {
      wx.showToast({
        title: '请选择收货地址',
        icon: 'none',
      });
      return false;
    }
    if (!_this.data.addinfo) {
      wx.showToast({
        title: '请输入详细地址',
        icon: 'none',
      });
      return false;
    }
    _this.setData({
      submited:false
    })
    app.ajax({
      url: app.api + 'gift/pointExchange',
      type: 'post',
      data: {
        gift: _this.data.id,
        name: _this.data.name,
        province: _this.data.province,
        city: _this.data.city,
        area: _this.data.region,
        info: _this.data.addinfo,
        phone: _this.data.phone,
      },
      success(res) {
        _this.setData({
          backShow:false,
          name: '',
          province:'',
          city:'',
          region: '',
          addinfo: '',
          phone: '',
        })
        wx.navigateTo({
          url: '/pages/pointsSuccess/pointsSuccess',
        })
      },
      complete() {
        _this.setData({
          submited: true
        })
      }
    });
  },



  // 省市区初始赋值
  getCity: function () {
    let _this = this;

    let cityData = city.init;
    const provinceList = [];
    const cityList = [];
    const regionList = [];

    for (let i = 0; i < cityData.length; i++) {
      provinceList.push({
        oid: cityData[i].oid,
        name: cityData[i].name
      });
    }
    for (let i = 0; i < cityData[0].subDistricts.length; i++) {
      cityList.push({
        oid: cityData[0].subDistricts[i].oid,
        name: cityData[0].subDistricts[i].name
      })
    }
    for (let i = 0; i < cityData[0].subDistricts[0].subDistricts.length; i++) {
      regionList.push({
        oid: cityData[0].subDistricts[0].subDistricts[i].oid,
        name: cityData[0].subDistricts[0].subDistricts[i].name
      })
    }

    _this.setData({
      cityData: cityData,
      provinceList: provinceList,
      cityList: cityList,
      regionList: regionList,
      editprovi: provinceList[0],
      editcity: cityList[0] ? cityList[0] : '',
      editregion: regionList[0] ? regionList[0] : '',
    })
  },

  //地址选择
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
    var cityData = this.data.cityData;

    if (val[0] != t[0]) {
      const cityList = [];
      const regionList = [];

      if (cityData[val[0]].subDistricts.length > 0) {
        for (let i = 0; i < cityData[val[0]].subDistricts.length; i++) {
          cityList.push({ oid: cityData[val[0]].subDistricts[i].oid, name: cityData[val[0]].subDistricts[i].name })
        }
      }
      if (cityData[val[0]].subDistricts[0].subDistricts.length > 0) {
        for (let i = 0; i < cityData[val[0]].subDistricts[0].subDistricts.length; i++) {
          regionList.push({ oid: cityData[val[0]].subDistricts[0].subDistricts[i].oid, name: cityData[val[0]].subDistricts[0].subDistricts[i].name })
        }
      }
      this.setData({
        editprovi: this.data.provinceList[val[0]],
        editcity: cityData[val[0]].subDistricts[0] ? cityData[val[0]].subDistricts[0] : '',
        editregion: cityData[val[0]].subDistricts[0].subDistricts[0] ? cityData[val[0]].subDistricts[0].subDistricts[0] : '',
        cityList: cityList,
        regionList: regionList,
        values: val,
        value: [val[0], 0, 0]
      })
      return;
    }
    if (val[1] != t[1]) {
      const regionList = [];
      if (cityData[val[0]].subDistricts[val[1]].subDistricts.length > 0) {
        for (let i = 0; i < cityData[val[0]].subDistricts[val[1]].subDistricts.length; i++) {
          regionList.push({ oid: cityData[val[0]].subDistricts[val[1]].subDistricts[i].oid, name: cityData[val[0]].subDistricts[val[1]].subDistricts[i].name })
        }
      }
      this.setData({
        editcity: this.data.cityList[val[1]] ? this.data.cityList[val[1]] : '',
        editregion: cityData[val[0]].subDistricts[val[1]].subDistricts[0] ? cityData[val[0]].subDistricts[val[1]].subDistricts[0] : '',
        regionList: regionList,
        values: val,
        value: [val[0], val[1], 0]
      })
      return;
    }
    if (val[2] != t[2]) {
      this.setData({
        editregion: this.data.regionList[val[2]] ? this.data.regionList[val[2]] : '',
        values: val,
        value: [val[0], val[1], val[2]]
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
    let cityData = this.data.cityData;
    let value = this.data.value;
    let buildinglist = [];

    this.setData({
      condition: !this.data.condition,
      province: this.data.editprovi.name,
      city: this.data.editcity.name,
      region: this.data.editregion.name,
      provinceId: this.data.editprovi.oid,
      cityId: this.data.editcity.oid,
      regionId: this.data.editregion.oid,

    })
  },

})