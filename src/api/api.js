// 引入其他js文件中api  在主页面中只需要通过该js文件便可调用各个api

import tcase from './case'
import project from './project'
// 声明api接口
const api ={
    // 引入user接口
    tcase,
    project
}
// 导出api接口
export default api