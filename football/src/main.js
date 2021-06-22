import Vue from 'vue'
import App from './App'
import router from './router/router'
import store from './store'

import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/public.scss'

import './untils/filter'

let echarts = require('echarts/lib/echarts')
//引入折线图组件
require('echarts/lib/chart/line')
Vue.prototype.$echarts = echarts
Vue.use(Element)

//console.log(Element)
import Public from './untils/public'
Vue.prototype.$public = Public
import {getData} from './untils/index'
Vue.prototype.$fetch = getData
//console.log(this.$loading,'-----')
Vue.prototype.$myloading = (text='Loading',spinner="el-icon-loading",background="rgba(0, 0, 0, .3)") => Element.Loading.service({text,spinner,background})
//动态添加meta
import MetaInfo from 'vue-meta-info'
Vue.use(MetaInfo)

Vue.config.productionTip = false;

//刷新页面如果有token缓存则直接重新获取用户信息
let token = window.localStorage.getItem('token');
if(token){
  store.commit('userInfo/SET_TOKEN',token);
  //重新获取个人信息
  store.dispatch('userInfo/getUserInfo');
  //获取优惠券
  store.dispatch('userInfo/getQuan');
}

router.beforeEach((to, from, next) => {
  //判断是否登录
  let token = store.state.userInfo.token || window.localStorage.getItem('token');
  if(!token){
    // console.log(to.path,from)
    // return;
    //禁止进入个人中心(返回上页；没上页返回首页)
    if(to.path == '/selfCenter'){
      from.name?router.back(-1):next('/');
    }else if(to.path == '/expertArticle'){
      store.commit('until/SET_LOGINSHOW',true);
    }else{
      next();
    }
  }else{
    next();
  }
})

new Vue({
  router,
  store,
  render: h => h(App),
  mounted () {
    document.dispatchEvent(new Event('render-event'))
  }
}).$mount("#app");
