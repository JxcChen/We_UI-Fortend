import axios from "axios";
import {Message} from 'element-ui'
import router from '../router'
axios.defaults.withCredentials = true;
// var api = "http://stuq.ceshiren.com:8089"
var api = "http://127.0.0.1:8001/api/"
var messageInstance = null
var instance = axios.create({
    headers:{
        'Content-Type':'application/json',
    },
    baseURL:api,
    timeout:100000,
})


instance.defaults.headers.common['Authorization'] = localStorage.getItem('Authorization')
// 请求拦截器  每次发送请求都会执行以下逻辑
instance.interceptors.request.use(config=>{
    // 如果在本地中获取到token变量 就将token变量存到了请求头中
    if(localStorage.getItem('Authorization')){
        config.headers.common['Authorization'] = localStorage.getItem('Authorization')
    }
    return config
})
instance.interceptors.response.use(res=>{
    //对错误的请求结果统一处理并且有信息提示
    if(res.data.code==1){
        return Promise.resolve(res);
    }
    else{
        if (messageInstance) {
            messageInstance.close();
          }
          messageInstance = Message({
            type:'error',
            message:res.data.msg,
            center:true
        })
        // Promise.reject 返回一个带有错误原因的对象 会在console中打印出来
        return Promise.reject(res);
    }
},
    error=>{
        const {response} = error
        if(response.status==401){
            console.log(response.status)
            if (messageInstance) {
                messageInstance.close();
              }
              messageInstance = Message({
                type:'error',
                message:'请先登录',
                center:true
            })
            router.replace({
                path:'/login',
                query:{
                    // 进行重定向
                    redirect:router.currentRoute.fullPath
                }
            })
        }
        return Promise.reject(response)
    }
)

export default instance;