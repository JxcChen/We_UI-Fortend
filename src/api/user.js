import axios from './http'

// 声明接口
const user = {
    
    addUser(addProjectData) {
        return axios.post("user/", addProjectData,)
      },

    editUser(eidt_id,edit_data) {
        return axios.put("user/" + eidt_id + "/",edit_data,)
    },
    deleteUser(user_id) {
        return axios
            .delete("user/" + user_id + "/")
    },
    updatePwd(edit_data){
        return axios.put("user/" + localStorage.getItem('UserId') + "/",edit_data)
    }
}
// 将接口进行导出 别的接口可以对其进行引用
export default user