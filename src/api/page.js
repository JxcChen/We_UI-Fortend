import axios from './http'

// 声明接口
const page = {
    getPageList(project_id){
        return axios.post("page/",{params:{project_id:project_id}})
    },

    addPage(addPageData) {
        return axios.post("page/", addPageData)
    },

    editPage(eidt_id,edit_data) {
        return axios.put("page/" + eidt_id + "/",edit_data,)
    },
    deleteUser(page_id) {
        return axios
            .delete("http://127.0.0.1:8001/api/user/" + axios + "/")
    },

}
// 将接口进行导出 别的接口可以对其进行引用
export default page