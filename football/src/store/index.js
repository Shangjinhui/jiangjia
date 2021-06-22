import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'

Vue.use(Vuex)

// https://webpack.js.org/guides/dependency-management/#requirecontext
// require.context：一次性导入，参数1：读取文件的路径。参数2：是否便利文件子目录。参数3：匹配文件测正则
// require.context函数执行后返回的是一个函数,并且这个函数有3个属性
// resolve {Function} -接受一个参数request,request为test文件夹下面匹配文件的相对路径,返回这个匹配文件相对于整个工程的相对路径

// keys {Function} -返回匹配成功模块的名字组成的数组

// id {String} -执行环境的id,返回的是一个字符串,主要用在module.hot.accept,应该是热加载?

const modulesFiles = require.context('./modules', true, /\.js$/)
//console.log('modulesFiles.keys()', modulesFiles.keys())// 相对路径集成的数组
// you do not need `import app from './modules/app'`
// it will auto require all vuex module from modules file
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  // set './app.js' => 'app'
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1') // 去除相对路径的./就变成文件名了
  const value = modulesFiles(modulePath)
  modules[moduleName] = value.default // modulesFiles(相对路径)=》对应文件default的对象
  return modules
}, {})
//console.log('modules', modules, 'getters', getters)
// vuex的modules属性可模块化vuex，可以让每一个模块拥有自己的state、mutation、action、getters,使得结构非常清晰，方便管理

// 因为modules打印格式为{app:{namespace:true,state:{},mutations:{},actions:{}}}
// 所以getters（相当于计算属性）里的函数返回对应那样
const store = new Vuex.Store({
  modules,
  getters
})

export default store;