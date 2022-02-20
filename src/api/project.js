import axios from './http'

export default{
    // 添加项目
    addProject(addProjectData) {
        return axios.post("/project/", addProjectData)
    },
    // 获取项目列表
    getProjectList() {
        return axios.get("project/", {
            params: {
                user_id: localStorage.getItem("UserId"),
            },
        })
    },
    // 编辑项目
    editProject(edit_id,edit_data) {
        return axios.put("/project/" + edit_id + "/",edit_data,)
    },
    // 删除项目
    deleteProject(project_id) {
        return axios.delete("project/" + project_id + "/")
    },
    // 获取项目已有的协作人员列表
    getTeamMembersList(project_id){
        return axios.get("teamMember/",{
            params:{
                project_id: project_id
            }
        })
    },
    // 设置项目协作人员
    setTeamMember(request_data){
        return axios.post("teamMember/",request_data)
    },
}