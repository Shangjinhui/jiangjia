import {getData} from '@/untils/index'
import {  Message } from 'element-ui'
const state = {
    token: '',
    userInfo: null,
    quan:[],
    goldProduct:null,
  }
  // mutations：提交更新数据的方法，必须是同步的(如果需要异步使用action)。每个 mutation 都有一个字符串的 事件类型 (type) 和、
  // 一个 回调函数 (handler)。回调函数就是我们实际进行状态更改的地方，并且它会接受 state 作为第一个参数，提交载荷作为第二个参数。
  const mutations = {
    SET_TOKEN: (state, token) => {
      state.token = token;
      window.localStorage.setItem("token", token);
    },
    SET_USERINFO: (state, userInfo) => {
        state.userInfo = userInfo;
    },
    SET_QUAN: (state,quan) => {
      state.quan = quan;
    },
    SET_COIN: (state,goldProduct) => {
      state.goldProduct = goldProduct;
    },
  }
  // action：和mutation的功能大致相同，不同之处在于 ==》1. Action 提交的是 mutation，而不是直接变更状态。
  // 2. Action 可以包含任意异步操作（防止还没存好就获取导致获取不到）。
  // 修改vuex值必须走mutations，所以异步的时候就要用action转到mutations
  const actions = {
    getUserInfo({commit}){
        getData('/api/member/info',{},'GET',false).then(res=>{
            //console.log(res,'用户信息')
            if(res.data.returnCode == '0000'){
                commit('SET_USERINFO',res.data.data);
            }else{
                Message(res.data.msg);
                //登录失效，清空token和userinfo
                commit('SET_TOKEN','');
                commit('SET_USERINFO',null);
            }
        })
    },
    //解读详情里的优惠券
    getQuan({commit}){
        getData('/api/expert/my_coupon',{},'GET',false).then(res=>{
          //console.log(res,'解读详情优惠券')
          if(res.data.returnCode == '0000'){
              commit('SET_QUAN',res.data.data);
          }else{
              Message(res.data.msg);
          }
      })
    }
  }
  // vuex中的store分模块管理，需要在store的index.js中引入各个模块，为了解决不同模块命名冲突的问题，
  // 将不同模块的namespaced:true，之后在不同页面中引入getter、actions、mutations时，需要加上所属的模块名
  export default {
    namespaced: true,
    state,
    mutations,
    actions
  }