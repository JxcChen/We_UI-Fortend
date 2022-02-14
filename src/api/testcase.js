// 引入ajax
import axios from './http'

// 声明接口
const testcase = {
    // 声明方法
    // 添加文本形式用例
    createCase(param){
        return axios.post("spring/testcase/addTestcase",param)
    },
    // 查询用例列表
    // get请求数据 使用params
    getCaseList(param){
        console.log("pageNum: "+param.pageNum)
        return axios.get(
            "spring/testcase/getCaseList",
            {params:{
                pageNum:param.pageNum,
                pageSize:param.pageSize
            }})
    }
}
export default testcase;