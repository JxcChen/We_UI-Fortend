<template>
  <div>
    <el-button @click="dialogFormVisible = true">新增项目</el-button>
    <el-table  :data="projects" stripe   style="width: 100%">
      <el-table-column prop="id" label="id" width="80px"> </el-table-column>
      <el-table-column prop="name" label="项目名称" width="120px" >
      </el-table-column>
      <el-table-column prop="author_name" label="负责人" width="120px"> </el-table-column>
      <el-table-column prop="host" label="项目地址" > </el-table-column>
      <el-table-column prop="max_threads" label="最大并发" width="120px">
      </el-table-column>
      <el-table-column fixed="right" label="操作" >
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="small"
            @click="intoEditProject(scope.row)"
            >编辑</el-button
          >
          <el-button
            type="primary"
            size="small"
            @click="intoSetTeamMember(scope.row)"
            >添加协作人员</el-button
          >
          <el-button
            type="danger"
            size="small"
            @click="deleteProject(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 新增项目 -->
    <el-dialog
      title="项目信息"
      :modal-append-to-body="false"
      :visible.sync="dialogFormVisible"
      width="500px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
    >
      <el-form  ref="addProForm" :model="form" label-position="right" label-width="120px" :rules="rules">
        <el-form-item label="项目名称" style="margin-top: 20px" prop="name">
          <el-input v-model="form.name" style="width: 300px" placeholder="请输入项目名称"></el-input>
        </el-form-item>
        <el-form-item label="项目路径" :required="true" prop="host">
          <el-input v-model="form.host" style="width: 300px" placeholder="请输入项目路径 多个路径使用逗号隔开"></el-input>
        </el-form-item>
        <el-form-item label="最大并发数" >
          <el-input v-model="form.max_threads" style="width: 300px"
            placeholder="请输入最大并发数" 
            oninput="value=value.replace(/[^\d]/g,'');if(value>10)value=10;if(value<1)value=1"></el-input>
        </el-form-item>

        <el-form-item label="自动化任务路径" :required="true" prop="auto_host">
          <el-input v-model="form.auto_host" style="width: 300px" placeholder="请输入自动化路径"> </el-input>
        </el-form-item>
        <el-form-item style="margin-left:40px">
          <el-button type="primary" @click="addProject('addProForm')">确 定</el-button>
          <el-button type="danger" @click="cancleAdd('addProForm')">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 编辑项目 -->
    <el-dialog
      title="项目信息"
      :visible.sync="isEdit"
      :modal-append-to-body="false"
      width="500px"
      
    >
      <el-form ref="editProForm" :model="edit_form" label-position="right" label-width="120px" :rules="rules">
        <el-form-item label="项目id" style="margin-top: 20px; display: none">
          <el-input v-model="edit_form.id" style="width: 300px" ></el-input>
        </el-form-item>
        <el-form-item label="项目名称" style="margin-top: 20px" prop="name">
          <el-input v-model="edit_form.name" style="width: 300px" placeholder="请输入项目名称"></el-input>
        </el-form-item>
        <el-form-item label="项目路径" :required="true" prop="name">
          <el-input v-model="edit_form.host" style="width: 300px" placeholder="请输入项目路径 多个路径使用逗号隔开"></el-input>
        </el-form-item>
        <el-form-item label="最大并发数">
          <el-input
            v-model="edit_form.max_threads"
            style="width: 300px"
            placeholder="请输入最大并发数"
            oninput="value=value.replace(/[^\d]/g,'');if(value>10)value=10;if(value<1)value=1"
          ></el-input>
        </el-form-item>
        <el-form-item label="自动化任务路径" :required="true" prop="name">
          <el-input v-model="edit_form.auto_host" style="width: 300px" placeholder="请输入自动化任务路径">
          </el-input>
        </el-form-item>
        <el-form-item style="margin-left:40px">
          <el-button type="primary" @click="editProject('editProForm')">确 定</el-button>
          <el-button type="danger" @click="resetForm('editProForm');isEdit = false">取 消</el-button>
        </el-form-item>
      </el-form>
      
    </el-dialog>

      <!-- 配置协作人员 -->
    <el-dialog
      title="配置协作组员"
      :modal-append-to-body="false"
      :visible.sync="setMember"
      width="30%"
    >
      选择协作人员
      <el-select size="small" v-model="teamMembers" multiple placeholder="请选择">
        <el-option
          v-for="u in users"
          :key="u.id"
          :label="u.username"
          :value="u.id"
        >
        </el-option>
      </el-select>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="setTeamMember">确 定</el-button>
        <el-button type="danger" @click="setMember = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>

  
</template>

<script>
import axios from "axios";
import {mapState,mapMutations} from 'vuex';
axios.defaults.withCredentials = true;
import project from '../api/project'
export default {
  name: "Project",
  data() {
    return {
      projects: [],
      isEdit: false,
      dialogFormVisible: false,
      // 新增项目的表单对应数据
      form: {
        name: "",
        host: "",
        author: localStorage.getItem("UserId"),
        max_threads: 1,
        auto_host: "",
      },
      rules:{
        name:[{required: true, message: '项目名称不能为空', trigger: 'blur'}],
        host:[{required: true, message: '项目路径不能为空', trigger: 'blur'}],
        auto_host:[{required: true, message: '自动化路径不能为空', trigger: 'blur'}]
      },
      // 编辑项目的表单数据
      edit_form: {
        id: "",
        name: "",
        host: "",
        author: localStorage.getItem("UserId"),
        max_threads: 1,
        auto_host: "",
      },
      token: localStorage.Authorization,
      // 是否处于配置协作人员
      setMember: false,
      // 用户列表
      // users: [],
      // 协作人员的列表
      teamMembers: [],
      // 设置协作人员的项目id
      setTeamProjectId: 0
    };
  },
  computed:{
    ...mapState(['users']),
  },
  methods: {
    ...mapMutations(['getUserList']),
    addProject(formName) {
      // 先判断必填内容是否已填
      this.$refs[formName].validate((valid) => {
        if(valid){
          const addProjectData = this.form;
          project.addProject(addProjectData)
            .then((response) => {
              if (response.data.code === 1) {
                this.cancleAdd(formName);
                this.getProjectList();
              } else {
                this.$message(response.data.msg);
              }
        })
        .catch((err) => {
          this.$message("项目信息输入有误");
        });
        }else{
          return false;
        }
      })
      
    },
    getProjectList() {
      project.getProjectList()
        .then((response) => {
          this.projects = response.data.data.res_pro_list;
        });
    },
    cancleAdd(formName) {
      this.resetForm(formName);
      this.dialogFormVisible = false;
    },
    intoEditProject(pro) {
      this.edit_form = { ...this.edit_form, ...pro };
      this.isEdit = true;
    },
    editProject(formName) {
      this.$refs[formName].validate(valid => {
        if(valid){
          project.editProject(this.edit_form.id,this.edit_form)
            .then((response) => {
              if (response.data.code == 1) {
                this.isEdit = false;
                this.getProjectList();
              } else {
                this.$message.error(response.data.msg);
              }
            })
            .catch((err) => {
              this.$message.error("项目信息输入有误");
            });
        }else{
          return false;
        }
      })
      
    },
    deleteProject(del_project) {
      const isDel = confirm("确定要删除该项目吗");
      if (isDel) {
        project.deleteProject(del_project.id)
          .then((response) => {
            this.$message(response.data.msg);
            if (response.data.code == 1) {
              this.getProjectList();
            }
          });
      }
    },
    // 获取项目已有的协作人员列表
    getTeamMembersList(project_id){
      project.getTeamMembersList(project_id).then((response) => {
        this.teamMembers = response.data.data
      })
    },
    // 进入配置组员页面
    intoSetTeamMember(project){
      // 获取协作人员列表
      this.getTeamMembersList(project.id)
      this.setTeamProjectId = project.id
      // 获取所有人员列表
      this.getUserList('except_current')
      console.log(this.users)
      this.setMember = true
    },
    setTeamMember(){
      const request_data = {users:this.teamMembers,project_id:this.setTeamProjectId}
      project.setTeamMember(request_data).then((response) => {
        this.setMember=false
      })
    },
    resetForm(formName) {
      // 清空数据
      this.$refs[formName].resetFields()
    },
  },
  
  mounted() {
    this.getProjectList();
  },
};
</script>

<style>

  .el-table{
    width: 100%;
    .el-table__header-wrapper table,.el-table__body-wrapper table{
      width: 100% !important;
    }
    .el-table__body, .el-table__footer, .el-table__header{
      table-layout: auto;
    }
  }
</style>