import axios from './http'

// 声明接口
const element = {
    getElementList(page_id){
        return axios.get("element/",{params:{page_id:page_id}})
    },

    addElement(addElemnetData) {
        return axios.post("element/", addElemnetData)
    },

    editElement(eidt_id,edit_data) {
        return axios.put("element/" + eidt_id + "/",edit_data,)
    },
    deleteElement(element_id) {
        return axios
            .delete("element/" + element_id + "/")
    },

}
// 将接口进行导出 别的接口可以对其进行引用
export default element