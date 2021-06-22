import axios from 'axios'
import {Loading} from 'element-ui'
//定义fetch函数，config为配置
//console.log(process.env.NODE_ENV,'process.env.NODE_ENV')
 //正式https://www.jinqiushao.com/index.php/ 测试http://39.99.210.26/index.php/
const baseURL = process.env.NODE_ENV === 'production'?'https://www.jinqiushao.com/index.php/':'/api';

export function fetch(config){
    //console.log(config,'config')

   return new Promise((resolve,reject) =>{
       let Load = null;
       if(config.loading) Load = Loading.service({text:'Loading',spinner:'el-icon-loading',background:'rgba(0, 0, 0, .3)'})

       const instance = axios.create({
		   baseURL: baseURL,
           //定义请求文件类型
           headers:{
              'Content-Type': 'application/json',
              'Authorization':localStorage.token?localStorage.token:'',
              'Platform':2
            },
            timeout: 10000,
        });


       //请求成功后执行的函数
        instance(config).then(res =>{
            if(config.loading){
                //预加载插件打包后多了个load mask
                Load.close();
                const loadDom = document.querySelectorAll('.el-loading-mask');
                if(loadDom.length>0) loadDom.forEach(item=>{item.remove()});
            } 
            resolve(res);
        //失败后执行的函数
        }).catch(err => {
            if(config.loading){
                //预加载插件打包后多了个load mask
                Load.close();
                const loadDom = document.querySelectorAll('.el-loading-mask');
                if(loadDom.length>0) loadDom.forEach(item=>{item.remove()});
            } 
            reject(err);
        })
    });
}

