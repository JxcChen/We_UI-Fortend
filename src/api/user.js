import axios from './http'

// 声明接口
const user = {
    
    login(params){
        return axios.post('spring/userLogin',params)
    },
    register(params){
        return axios.post('spring/register',params)
    }
}
// 将接口进行导出 别的接口可以对其进行引用
export default user