import axios from './http'

// 声明接口
const tcase = {
  // 获取对应项目下的所有用例
  getCaseList(pro_id,currentPage,pageSize) {
    return axios.get("case/", {
        params: {
          "pro_id": pro_id,
          current_page: currentPage,
          page_size: pageSize
        },
      })
  },
  // 添加用例
  addCase(params) {
    return axios.post("case/", params)
  },
  // 修改用例
  editCase(edit_id,params) {
    return axios.put("case/" + edit_id + "/",params)
  },
  // 执行用例
  excuseCase(excuse_id,excuseHost) {
     return axios
      .get("case/excuse/" + excuse_id + "/", {
        params: {
          host: excuseHost,
        },
      })
  },
  // 删除用例
  deleteCase(del_id) {
      return axios.delete("case/" + del_id + "/", )
  },
  // 获取当前用户的项目列表
  getUserProjectList(){
    return axios.get("project/", {
        params: {
          user_id: localStorage.getItem("UserId"),
        }
      })
  },

  // 查看报告
  lookReport(case_id){
    axios.get("case/report/" + case_id + "/",{
      headers: {
        "Content-Type": "text/html; charset=utf-8"
      },
    })
    return axios.get("case/report/" + case_id + "/")
  },
  // 并发执行用例
  concurrentExcution(param){
    return axios.get("case/concurrent/",{
      params:param
    })
  },
  // 查看报告总结
  lookReportSummary(pro_id){
    return axios.get("case/reportsummary/"+pro_id+"/")
  },

  // 获取项目详情
  getProjectDetail(pro_id){
    return axios.get("project/"+pro_id+"/")
  },

  // 获取项目已配置的任务通知
  getProjectNotice(pro_id){
    return axios.get("notice/"+pro_id+"/")
  },
  //打开或关闭自动化任务
  openAutoTask(pro_id,param){
    return axios.get("case/openMonitor/" +pro_id+"/",{
      params: param,
    })
  },
  //打开或关闭自动化任务
  closeAutoTask(pro_id){
    return axios.delete("case/openMonitor/" +pro_id+"/")
  },
  // 添加任务通知
  addNotice(requestData){
    return axios.post("notice/",requestData)
  }
    

}
// 将接口进行导出 别的接口可以对其进行引用
export default tcase
