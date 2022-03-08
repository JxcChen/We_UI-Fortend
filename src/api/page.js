import axios from './http'

// 声明接口
const page = {
    getPageList(project_id,currentPage,pageSize){
        let params = null
        if(currentPage){
            params =
                {
                    project_id:project_id,
                    current_page:currentPage,
                    page_size:pageSize
                }
        }else{
            params ={project_id:project_id}
        }
        return axios.get("page/",{params})
    },
    getSearchPageList(project_id,currentPage,pageSize,searchData){
        let params = null
        if(currentPage){
            params =
                {
                    project_id:project_id,
                    current_page:currentPage,
                    page_size:pageSize,
                    search_data:searchData
                }
        }else{
            params ={project_id:project_id}
        }
        return axios.get("page/",{params})
    },

    addPage(addPageData) {
        return axios.post("page/", addPageData)
    },

    editPage(eidt_id,edit_data) {
        return axios.put("page/" + eidt_id + "/",edit_data,)
    },
    deletePage(page_id) {
        return axios
            .delete("page/" + page_id + "/")
    },

}
// 将接口进行导出 别的接口可以对其进行引用
export default page