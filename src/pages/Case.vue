<template>
  <div>
        <div >
            当前项目：
            <el-select size="small" v-model="pro_id" placeholder="请选择">
                <el-option
                v-for="pro in authorProjectList"
                :key="pro.id"
                :label="pro.name"
                :value="pro.id">
                </el-option>
            </el-select>
            <el-button size="small" style="margin-left:20px" @click="dialogFormVisible = true">新增用例</el-button>
        </div>
      
      <el-table
        :data="cases"
        stripe
        >
            <el-table-column
            prop="id"
            label="id"
            width="180">
            </el-table-column>
            <el-table-column
            prop="name"
            label="用例名称"
            width="180">
            </el-table-column>
            <el-table-column
            prop="script_name"
            label="脚本名称">
            </el-table-column>
            <el-table-column
            prop="is_threads"
            label="是否并发"
            width='100'>
            </el-table-column>
            <el-table-column
                fixed="right"
                label="操作"
                width="300">
                <template slot-scope="scope">
                    <el-button type="primary" size="small" @click="excuse(scope.row)" >执行</el-button>
                    <el-button type="danger" size="small" @click="intoEditCase(scope.row)">编辑</el-button>
                    <el-button type="danger" size="small" @click="deleteCase(scope.row)">删除</el-button>
                </template>
                </el-table-column>
        </el-table>
        <!-- 新增用例框 -->
        <el-dialog title="用例信息" :visible.sync="dialogFormVisible" width="30%" >
            <el-form :model="form" label-position="right" label-width="120px">
                <el-form-item label="用例名称" style="margin-top:20px">
                    <el-input v-model="form.name" style="width:350px"></el-input>
                </el-form-item>
                <el-form-item label="是否并发" >
                    <el-radio v-model="form.is_thread" label="1">是</el-radio>
                    <el-radio v-model="form.is_thread" label="2">否</el-radio>
                </el-form-item>
                <el-form-item label="重试次数" >
                    <el-input v-model="form.retry_count" style="width:350px">
                    </el-input>
                </el-form-item>
                <el-form-item label="用例脚本" >
                    <el-upload
                        ref="uploadFile"
                        class="upload-demo"
                        :action="upLoadUrl"
                        :on-success="handleSuccess"
                        :before-remove="beforeRemove"
                        :before-upload="beforeUpload"
                        multiple
                        :auto-upload="false"
                        :limit="1"
                        :on-exceed="handleExceed"
                        :file-list="fileList">
                        <el-button slot="trigger" size="small" type="success" @click="submitUpload">选择脚本文件</el-button>
                    </el-upload>
                </el-form-item>
            
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="addCase">确 定</el-button>
                <el-button type="danger" @click="dialogFormVisible = false">取 消</el-button>
            </div>
        </el-dialog>
        <!-- 编辑用例框 -->
        <el-dialog title="用例信息" :visible.sync="isEdit" width="30%" >
            <el-form :model="edit_form" label-position="right" label-width="120px">
                <el-form-item label="用例名称" style="margin-top:20px">
                    <el-input v-model="edit_form.name" style="width:350px"></el-input>
                </el-form-item>
                <el-form-item label="是否并发" >
                    <el-radio v-model="edit_form.is_thread" label="1">是</el-radio>
                    <el-radio v-model="edit_form.is_thread" label="2">否</el-radio>
                </el-form-item>
                <el-form-item label="重试次数" >
                    <el-input v-model="edit_form.retry_count" style="width:350px">
                    </el-input>
                </el-form-item>
                <el-form-item label="用例脚本" >
                    <el-upload
                        ref="uploadFile"
                        class="upload-demo"
                        :action="upLoadUrl"
                        :on-success="handleSuccess"
                        :before-remove="beforeRemove"
                        :before-upload="beforeUpload"
                        multiple
                        :auto-upload="false"
                        :limit="1"
                        :on-exceed="handleExceed"
                        :file-list="fileList">
                        <el-button slot="trigger" size="small" type="success" @click="submitUpload">选择脚本文件</el-button>
                    </el-upload>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="editCase">确 定</el-button>
                <el-button type="danger" @click="isEdit = false">取 消</el-button>
            </div>
        </el-dialog>

       
        
  </div>
  
</template>

<script>
    import axios from 'axios'
    axios.defaults.withCredentials = true
    export default {
        
        name:'Project',
        data() {
            return {
                cases:[],
                isEdit:false,
                isUpload:false,
                dialogFormVisible: false,
                form: {
                    name: '',
                    is_thread: '1',
                    retry_count: '',
                    script_name: '',
                },
                edit_form: {
                    name: '',
                    is_thread: '',
                    retry_count: '',
                    script_name: '',
                },
                authorProjectList:[],
                fileList: [
                ],
                fileName:'',
                pro_id: 0
            }
        },
        methods:{
            handleSuccess(file) {
                this.fileList.splice(0,1)
            },
            beforeUpload(file){
                this.form.script_name = file.name
            },
            handleExceed(files, fileList) {
                this.$message.warning(`一次只能上传一个脚本文件`);
            },
            beforeRemove(file, fileList) {
                const isdel = this.$confirm(`确定移除 ${ file.name }？`)
                if(isdel)
                    this.form.script_name = ''
                return isdel;
            },
            // 上传文件
            submitUpload() {
                this.$refs.uploadFile.submit();
            },
            // 添加用例
            addCase(){
                
                const addCaseData = this.form
                axios.post("http://192.168.1.100:8001/api/case/"+this.pro_id,addCaseData).then(
                    response => {
                        this.submitUpload()
                        console.log(response.data)
                        this.dialogFormVisible = false
                        this.getCaseList(this.pro_id)
                        this.resetForm()
                    }
                )
            },
            // 获取对应项目下的所有用例
            getCaseList(pro_id){
                
                axios.get('http://192.168.1.100:8001/api/case/' + pro_id).then(
                    response => {
                        this.cases = response.data.case_list
                    }
                )
            },
            // 进入修改用例页面
            intoEditCase(edit_case){
                if(this.edit_form.script_name !== ''){
                    this.fileList.splice(0,1,{name:this.edit_form.script_name})
                }
                if(edit_case.is_threads === "是"){
                    edit_case['is_thread'] = "1"
                }else{
                    edit_case['is_thread'] = "2"
                }
                this.edit_form = {...this.edit_form,...edit_case}
                delete this.edit_form.is_threads
                this.isEdit = true
            },
            // 修改用例
            editCase(){
                axios.put('http://192.168.1.100:8001/api/case/'+this.edit_form.id+'/',this.edit_form).then(
                    response => {
                        if (response.data.code == 1){
                            this.isEdit = false
                            this.getCaseList(this.pro_id)
                        }else{
                            alert(response.data.msg)
                        }
                            
                    }
                )
            },
            deleteCase(del_case){
                const isDel = confirm("确定要删除该项目吗")
                if(isDel){
                    axios.delete('http://192.168.1.100:8001/api/case/'+del_case.id+'/').then(
                        response=> {
                            this.$message(response.data.msg)
                            if(response.data.code == 1){
                                this.getCaseList(this.pro_id)
                            }
                        }
                    )
                }
                
            },
            resetForm(){
                this.form.name = '';
                this.form.is_thread = ''
                this.form.retry_count= ''
                this.form.script_name= ''
            }

        },
        computed:{
            // 文件上传路径
            upLoadUrl(){
                return 'http://192.168.1.100:8001/api/case/uploadScript/' + this.pro_id
            },
            
        },
        mounted(){
            // 获取该用户下拥有权限的项目
            axios.get('http://192.168.1.100:8001/api/project/',{
                params:{
                    author:'admin'
                }
            }).then(
                response=> {
                    response.data.pro_list.forEach(pro => {
                        this.authorProjectList.push(pro)
                    })
                    if (response.data.pro_list.length>0){
                        this.pro_id = response.data.pro_list[0].id
                        this.getCaseList(this.pro_id);
                    }
                    else{
                        this.pro_id = ''
                    }
                        
                }
            );
            
        }
    }
</script>

<style>

</style>