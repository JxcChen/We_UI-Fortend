<template>
  <div style="box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);border-radius: 20px">
    <div style="margin:10px 10px 10px 10px;padding:10px">
      <el-button  @click="intoAddPage" style="margin-left:10px;" size="small" >新 增 页 面</el-button>
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
      <span>
        <search :searchData="searchData" @search='search'></search>
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
            @click="intoEditPage(scope.row)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            size="small"
            icon="el-icon-delete"
            @click="deletePage(scope.row)"
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
        <el-form-item label="选择项目" prop="project_id">
          <el-select size="small" v-model="form.project_id" filterable placeholder="请选择">
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
          <el-button type="primary" @click="addPage('addPageForm')">确 定</el-button>
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
          <el-select size="small" v-model="edit_form.project_id" filterable placeholder="请选择">
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
          <el-button type="primary" @click="editPage('editPageForm')">确 定</el-button>
          <el-button type="danger" @click="isEdit=false;resetForm('editPageForm')">取 消</el-button>
        </el-form-item>
        
      </el-form>
    </el-dialog>
    <pagenation
      :total="count" 
      :pageSize="pageSize" 
      @change="pageChange">
    </pagenation>
  </div>
</template>

<script>

import tcase from '../api/case'
import page from '../api/page'
import Pagenation from './Pagenation.vue'
import Search from './Search.vue'
export default {
  name: "Page",
  components:{
    Pagenation,
    Search
  },
  data() {
    return {
      // 当前页面
      currentPage:1,
      // 用例总数
      count:0,
      // 搜索内容
      searchData:'',
      pageSize: 10,
      // 页面列表
      pages:[],
      // 是否进入编辑框
      isEdit: false,
      // 是否进入新增框
      dialogFormVisible: false,
      // 用户有权限的项目
      authorProjectList:[],
      // 当前项目
      pro_id:'',
      token: localStorage.Authorization,
      // 当前用户
      currentUser: localStorage.UserId,

      // 新增表单
      form: {
        name: "",
        project_id: "",
        author: localStorage.User
      },
      // 编辑表单
      edit_form: {
        name: "",
        project_id: "",
      },
      rules:{
        name:[{required: true, message: '页面名称不能为空', trigger: 'blur'}],
        project_id:[{required: true, message: '所属项目不能为空', trigger: 'blur'}]
      },
      
      
    };
  },
  methods: {
    // 进入新增页面
    intoAddPage(){
      // 先判断是否有页面
      if(this.authorProjectList.length>0){
        this.dialogFormVisible = true
      }else{
        this.$message.error("请先添加项目")
      }
    },
    // 添加用户
    addPage(formName) {
      this.$refs[formName].validate((valid) => {
        if(valid){
          page.addPage(this.form)
        .then((response) => {
          if (response.data.code === 1) {
            this.cancleAdd(formName);
            this.getPageList(this.pro_id)
          } else {
            this.$message(response.data.msg);
          }
        })
        }else{
          return false
        }
      })
    },
    // 获取页面列表
    getPageList(pro_id){
      page.getPageList(pro_id,this.currentPage,this.pageSize).then(res =>{
        const resData = res.data.data
        // 获取后端返回的页面列表
        this.pages = resData.res_list.filter(p => p.project_id == this.pro_id)
        // 设置总页数
        this.count = resData.count
      })
    },
    // 取消添加
    cancleAdd(formName) {
      this.resetForm(formName);
      this.dialogFormVisible = false;
    },
    // 打开修改页面
    intoEditPage(user) {
      
      this.edit_form = { ...this.edit_form, ...user };
      this.isEdit = true;
    },
    // 修改用户
    editPage() {
      page.editPage(this.edit_form.id,this.edit_form)
        .then((response) => {
          if (response.data.code == 1) {
            this.isEdit = false;
            this.getPageList(this.pro_id)
          } else {
            this.$message(response.data.msg);
          }
        })
    },
    // 删除页面
    deletePage(del_page) {
      const isDel = confirm("删除该页面，会将该页面的元素一并删除；是否确定删除？")
      if(isDel){
        page.deletePage(del_page.id).then(res => {
          if(res.data.code == 1){
            this.$message.success(res.data.msg);
            this.getPageList(this.pro_id)
          }
        })
      }
      
    },
    // 重置添加表格
    resetForm(formName) {
      // 清空数据
      this.$refs[formName].resetFields()
    },
    // 修改页面后重新获取数据
    pageChange(page){
      this.currentPage = page;
      this.getPageList(this.pro_id)
    },
    search(searchData){
        page.getSearchPageList(this.pro_id,this.currentPage,this.pageSize,searchData)
        .then((res) =>{
          const resData = res.data.data
          // 获取后端返回的页面列表
          this.pages = resData.res_list.filter(p => p.project_id == this.pro_id)
          // 设置总页数
          this.count = resData.count
        })
    }
    
  },
  computed:{
  },
  watch:{
    pro_id(newValue, oldValue) {
      // 获取对应项目页面
      this.getPageList(newValue);
    },
  },
  mounted() {
    tcase.getUserProjectList()
      .then((response) => {
        response.data.data.res_pro_list.forEach((pro) => {
          this.authorProjectList.push(pro);
        });
        if (response.data.data.res_pro_list.length > 0) {
          this.pro_id = response.data.data.res_pro_list[0].id;
        } else {
          this.pro_id = "";
        }
      })
  },
};
</script>

<style>
</style>