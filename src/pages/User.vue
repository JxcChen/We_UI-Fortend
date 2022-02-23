<template>
  <div style="width: 80% ;margin-left:10%;box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);border-radius: 20px">
    <el-button v-show="isAdmin" @click="dialogFormVisible = true" style="margin:10px 0 10px 10px">新增用户</el-button>
    <el-table :data="users" stripe>
      <el-table-column prop="id" label="id" width="100px"> </el-table-column>
      <el-table-column prop="username" label="用户名称" width="200px">
      </el-table-column>
      <el-table-column prop="user_type" label="角色"> </el-table-column>
      <el-table-column prop="email" label="邮箱"> </el-table-column>
      
      <el-table-column fixed="right" label="操作" >
        <template slot-scope="scope">
          <el-button
            size="small"
            icon='el-icon-edit'
            @click="intoEditUser(scope.row)"
            >编辑</el-button
          >
          <el-button
            v-show="isAdmin"
            type="danger"
            size="small"
            @click="deleteUser(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 新增用户框 -->
    <el-dialog
      title="用户信息"
      :modal-append-to-body="false"
      :visible.sync="dialogFormVisible"
      width="40%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
    >
      <el-form :model="form" label-position="right" label-width="120px">
        <el-form-item label="用户名称" style="margin-top: 20px">
          <el-input  placeholder="请输入用户名" v-model="form.username" style="width: 350px"></el-input>
        </el-form-item>
        <el-form-item label="邮箱账号">
          <el-input placeholder="请输入邮箱" v-model="form.email" style="width: 350px"></el-input>
        </el-form-item>
        <el-form-item label="用户角色">
          <el-select size="small" v-model="form.is_superuser" placeholder="请选择">
            <el-option
              v-for="userType in userTypeList"
              :key="userType.num"
              :label="userType.type"
              :value="userType.num"
            >
            </el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item label="设置密码">
          <el-input v-model="form.password" style="width: 350px" placeholder="请输入密码" show-password> </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addUser">确 定</el-button>
        <el-button type="danger" @click="cancleAdd">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 编辑用户框 -->
    <el-dialog
      title="项目信息"
      :visible.sync="isEdit"
      :modal-append-to-body="false"
      width="30%"
    >
      <el-form :model="edit_form" label-position="right" label-width="120px" :rules="rules">
        <el-form-item label="用户id" style="margin-top: 20px; display: none">
          <el-input v-model="edit_form.id" style="width: 350px"></el-input>
        </el-form-item>
        <el-form-item label="用户名称" style="margin-top: 20px">
          <el-input disabled v-model="edit_form.username" style="width: 350px"></el-input>
        </el-form-item>
        <el-form-item label="邮箱账号" prop="email">
          <el-input v-model="edit_form.email" style="width: 350px"></el-input>
        </el-form-item>
        <el-form-item label="用户角色">
          <el-input 
            disabled
            v-model="edit_form.user_type"
            style="width: 350px"
          ></el-input>
        </el-form-item>
        
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editUser">确 定</el-button>
        <el-button type="danger" @click="isEdit = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
axios.defaults.withCredentials = true;
import {mapState,mapMutations} from 'vuex';
import user from '../api/user'
export default {
  name: "Project",
  data() {
    return {
      // 是否进入编辑框
      isEdit: false,
      // 用户类型列表
      userTypeList: [{"num":1,"type":"普通用户"},{"num":2,"type":"管理员"}],
      // 是否进入新增框
      dialogFormVisible: false,
      token: localStorage.Authorization,
      // 当前用户
      currentUser: localStorage.UserId,
      // 新增表单
      form: {
        username: "",
        email: "",
        password: "",
        is_superuser: "",
      },
      // 编辑表单
      edit_form: {
        id: "",
        username: "",
        email: "",
        is_superuser: "",
      },
      rules:{
        email:[{required: true, message: '邮箱不能为空', trigger: 'blur'}],
      },
      
      
    };
  },
  methods: {
    // 获取用户列表
    ...mapMutations(['getUserList']),
    // 添加用户
    addUser() {
      const addProjectData = {...this.addProjectData,...this.form}
      addProjectData['is_superuser'] = this.form['is_superuser'] === 0
      user.addUser(addProjectData)
        .then((response) => {
          if (response.data.code === 1) {
            this.dialogFormVisible = false;
            this.getUserList('userShow');
          } else {
            this.$message(response.data.msg);
          }
          this.resetForm();
        })
        .catch((err) => {
          this.$message("项目信息输入有误");
        });
    },
    // 取消添加
    cancleAdd() {
      this.resetForm();
      this.dialogFormVisible = false;
    },
    // 打开修改页面
    intoEditUser(user) {
      
      this.edit_form = { ...this.edit_form, ...user };
      // 设置角色类型  展示用
      this.edit_form['user_type'] = this.edit_form['is_superuser'] ? "超级管理员" : "普通用户"
      this.isEdit = true;
    },
    // 修改用户
    editUser() {
      if(!this.edit_form['email'].trim()){
        return
      }
      user.editUser(this.edit_form.id,this.edit_form)
        .then((response) => {
          if (response.data.code == 1) {
            this.isEdit = false;
            this.getUserList('userShow');
          } else {
            this.$message(response.data.msg);
          }
        })
        .catch((err) => {
          this.$message("项目信息输入有误");
        });
    },
    // 删除用户
    deleteUser(del_user) {
      const isDel = confirm("确定要删除该用户吗");
      if (isDel) {
        user.deleteUser(del_user.id)
          .then((response) => {
            this.$message(response.data.msg);
            if (response.data.code == 1) {
              this.getUserList('userShow');
            }
          });
      }
    },
    // 重置添加表格
    resetForm() {
      this.form.username = "";
      this.form.email="";
      this.form.password = ""
      this.form.is_superuser= "";
    },
    
  },
  computed:{
    // 判断是不是超级管理员  只有超级管理员才能添加或者删除用户
    isAdmin(){
      return this.currentUser == 1
    },
    ...mapState(['users'])
  },
  mounted() {
    this.getUserList('userShow');
  },
};
</script>

<style>
</style>