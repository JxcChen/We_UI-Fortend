import axios from './http'

// 声明接口
const tcase = {
  // 获取对应项目下的所有用例
  getCaseList(parmas) {
    return axios.get("case/", {
        params: {
          pro_id: parmas.pro_id,
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
  excuseCase(excuse_id,params) {
     return axios
      .get("case/excuse/" + excuse_case.id + "/", {
        params: {
          host: params.excuseHost,
        },
      })
  },
  // 删除用例
  deleteCase(del_id) {
      return axios.delete("case/" + del_id + "/", )
  },

  getUserProjectList(){
    return axios.get("project/", {
        params: {
          user_id: localStorage.getItem("UserId"),
        }
      })
  }

}
// 将接口进行导出 别的接口可以对其进行引用
export default tcase
