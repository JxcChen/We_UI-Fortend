<template>
  <div style="width: 80% ;margin-left:10%;box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);border-radius: 20px">
    <div style="margin:10px 10px 10px 10px;padding-top:10px">
      <el-button  @click="dialogFormVisible = true" style="margin-left:10px;" size="small" >新 增 页 面</el-button>
      <span style="float:left">
        当前项目：
        <el-select size="small" v-model="pro_id" filterable placeholder="请选择">
            <el-option
              v-for="pro in authorProjectList"
              :key="pro.id"
              :label="pro.name"
              :value="pro.id"
              :project_index="pro.index"
            >
            </el-option>
        </el-select>
      </span>
    </div>
    
     
    <el-table :data="pages" stripe>
      <el-table-column prop="id" label="id" width="100px"> </el-table-column>
      <el-table-column prop="name" label="页面名称" width="200px">
      </el-table-column>
      <el-table-column prop="author" label="负责人"> </el-table-column>
      
      <el-table-column fixed="right" label="操作" >
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="small"
            icon='el-icon-edit'
            @click="intoEditProject(scope.row)"
            >编辑</el-button
          >
          <el-button
            type="primary"
            size="small"
            icon='el-icon-arrow-right'
            @click="intoEditProject(scope.row)"
            >查看页面元素</el-button
          >
          <el-button
            type="danger"
            size="small"
            icon="el-icon-delete"
            @click="deleteUser(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 新增页面框 -->
    <el-dialog
      title="页面信息"
      :modal-append-to-body="false"
      :visible.sync="dialogFormVisible"
      width="40%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
    >
      <el-form :model="form" label-position="right" label-width="120px" ref="addPageForm" :rules="rules">
        <el-form-item label="页面名称" style="margin-top: 20px" prop="name">
          <el-input  placeholder="请输入页面名称" v-model="form.name" style="width: 350px"></el-input>
        </el-form-item>
        <el-form-item label="选择项目">
          <el-select size="small" v-model="pro_id" filterable placeholder="请选择">
            <el-option
              v-for="pro in authorProjectList"
              :key="pro.id"
              :label="pro.name"
              :value="pro.id"
              :project_index="pro.index"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="margin-left:40px">
          <el-button type="primary" @click="addProject('addPageForm')">确 定</el-button>
          <el-button type="danger" @click="cancleAdd('addPageForm')">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 编辑页面框 -->
    <el-dialog
      title="页面信息"
      :visible.sync="isEdit"
      :modal-append-to-body="false"
      width="40%"
    >
      <el-form :model="edit_form" label-position="right" label-width="120px" :rules="rules" ref="editPageForm">
        <el-form-item label="用户id" style="display: none">
          <el-input v-model="edit_form.id" style="width: 350px"></el-input>
        </el-form-item>
        <el-form-item label="页面名称" style="margin-top: 20px" prop="name">
          <el-input  placeholder="请输入页面名称" v-model="edit_form.name" style="width: 350px"></el-input>
        </el-form-item>
        <el-form-item label="选择项目">
          <el-select size="small" v-model="pro_id" filterable placeholder="请选择">
            <el-option
              v-for="pro in authorProjectList"
              :key="pro.id"
              :label="pro.name"
              :value="pro.id"
              :project_index="pro.index"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="margin-left:40px">
          <el-button type="primary" @click="addProject('editPageForm')">确 定</el-button>
          <el-button type="danger" @click="cancleAdd('editPageForm')">取 消</el-button>
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
axios.defaults.withCredentials = true;
import {mapState,mapMutations} from 'vuex';
import page from '../api/page'
export default {
  name: "Page",
  data() {
    return {
      // 是否进入编辑框
      isEdit: false,
      // 是否进入新增框
      dialogFormVisible: false,
      
      token: localStorage.Authorization,
      // 当前用户
      currentUser: localStorage.UserId,

      // 新增表单
      form: {
        name: "",
        project_id: "",
        author: localStorage.UserId
      },
      // 编辑表单
      edit_form: {
        name: "",
        project_id: "",
      },
      rules:{
        name:[{required: true, message: '页面名称不能为空', trigger: 'blur'}],
      },
      
      
    };
  },
  methods: {
    // 添加用户
    addPage(fromName) {
      page.addPage(this.form)
        .then((response) => {
          if (response.data.code === 1) {
            this.cancleAdd(fromName);
          } else {
            this.$message(response.data.msg);
          }

        })
        .catch((err) => {
          this.$message("项目信息输入有误");
        });
    },
    getPageList(){
      page.getPageList(this)
    },
    // 取消添加
    cancleAdd(formName) {
      this.resetForm(formName);
      this.dialogFormVisible = false;
    },
    // 打开修改页面
    intoEditProject(user) {
      
      this.edit_form = { ...this.edit_form, ...user };
      // 设置角色类型  展示用
      this.edit_form['user_type'] = this.edit_form['is_superuser'] ? "超级管理员" : "普通用户"
      this.isEdit = true;
    },
    // 修改用户
    editUser() {
      if(!this.edit_form.trim()){
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
    resetForm(formName) {
      // 清空数据
      this.$refs[formName].resetFields()
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