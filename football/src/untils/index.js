//引入fetch.js文件
import { fetch } from './fetch'
//定义获取数据的函数getData(),其中url,type,data对应fetch(config)中的config
export function getData(url,data = {},type = 'GET',loading = true) {
//如果type为空，默认为get方法
    if(type == 'GET'){
      return fetch({
        url: url,
        method: type,
        params: data,
        loading
      })
    }
    return fetch({
      url: url,
      method: type,
      data: data,
      loading
    })
    // if(type===''){
    //   type = 'post';
    //   return fetch({
    //     url: url,
    //     method: type,
    //     data: data
    //   })
    // }
    // if(type=='post'){
    //   return fetch({
    //     url: url,
    //     method: type,
    //     data: data
    //   })
    // }
    // if(type=='patch'){
    //   return fetch({
    //     url: url,
    //     method: type,
    //     data: data
    //   })
    // }
    // if(type=='delete'){
    //   return fetch({
    //     url: url,
    //     method: type,
    //     data: data
    //   })
    // }
    // if(type=='get'){
    //   return fetch({
    //     url: url,
    //     method: type,
    //     params: data
    //   })
    // }
}

