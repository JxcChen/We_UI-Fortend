<template>
  <div style="width: 80% ;margin-left:10%;box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);border-radius: 20px">
    <div style="margin:10px 10px 10px 10px;padding-top:10px">
      
      <span >
        当前项目：
        <el-select size="small" v-model="pro_id" filterable placeholder="请选择">
          <el-option
            v-for="pro in authorProjectList"
            :key="pro.id"
            :label="pro.name"
            :value="pro.id"
          >
          </el-option>
        </el-select>
      </span>
      <span >
        选择页面：
        <el-select size="small" v-model="page_id" filterable placeholder="请选择">
          <el-option
            v-for="page in projectPageList"
            :key="page.id"
            :label="page.name"
            :value="page.id"
          >
          </el-option>
        </el-select>
      </span>
      <el-button  @click="intoAddPage" style="margin-left:10px;" size="small" >新 增 元 素</el-button>
    </div>
    
     
    <el-table :data="eleList" stripe>
      <el-table-column prop="id" label="id" width="100px"> </el-table-column>
      <el-table-column prop="name" label="元素名称名称" width="200px"></el-table-column>
      <el-table-column prop="loc_method" label="定位方式" width="200px"></el-table-column>
      <el-table-column prop="element_location" label="元素定位"> </el-table-column>
      
      <el-table-column fixed="right" label="操作" >
        <template slot-scope="scope">
          <el-button
            size="small"
            icon='el-icon-edit'
            @click="intoEditProject(scope.row)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            size="small"
            @click="deleteElement(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 新增元素框 -->
    <el-dialog
      title="页面信息"
      :modal-append-to-body="false"
      :visible.sync="dialogFormVisible"
      width="40%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
    >
      <el-form :model="form" label-position="right" label-width="120px" :rules="rules" ref="addElementForm">
        <el-form-item label="元素id" style="display: none">
          <el-input v-model="form.id" style="width: 350px"></el-input>
        </el-form-item>
        <el-form-item label="元素名称" style="margin-top: 20px" prop="name">
          <el-input  placeholder="请输入元素名称" v-model="form.name" style="width: 350px"></el-input>
        </el-form-item>
        <el-form-item label="定位方式" style="margin-top: 20px" prop="loc_method">
          <el-select size="small" v-model="form.loc_method" filterable placeholder="请选择">
            <el-option
              v-for="(method,index) in locMethods"
              :key="index"
              :label="method.label"
              :value="method.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item label="元素定位" style="margin-top: 20px" prop="element_location">
          <el-input  placeholder="请输入元素定位" v-model="form.element_location" style="width: 350px"></el-input>
        </el-form-item>
        <el-form-item style="margin-left:40px">
          <el-button type="primary" @click="addElement('addElementForm')">确 定</el-button>
          <el-button type="danger" @click="dialogFormVisible=false;resetForm('addElementForm')">取 消</el-button>
        </el-form-item>
        
      </el-form>
    </el-dialog>
    <!-- 编辑元素框 -->
    <el-dialog
      title="页面信息"
      :visible.sync="isEdit"
      :modal-append-to-body="false"
      width="40%"
    >
      <el-form :model="edit_form" label-position="right" label-width="120px" :rules="rules" ref="editElementForm">
        <el-form-item label="元素id" style="display: none">
          <el-input v-model="edit_form.id" style="width: 350px"></el-input>
        </el-form-item>
        <el-form-item label="元素名称" style="margin-top: 20px" prop="name">
          <el-input  placeholder="请输入元素名称" v-model="edit_form.name" style="width: 350px"></el-input>
        </el-form-item>
        <el-form-item label="定位方式" style="margin-top: 20px" >
          <el-select size="small" v-model="edit_form.loc_method" filterable placeholder="请选择">
            <el-option
              v-for="(method,index) in locMethods"
              :key="index"
              :label="method.label"
              :value="method.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="元素定位" style="margin-top: 20px" prop="name">
          <el-input  placeholder="请输入元素定位" v-model="edit_form.element_location" style="width: 350px"></el-input>
        </el-form-item>
        <el-form-item label="所属页面" style="margin-top: 20px" prop="name">
          <el-select size="small" v-model="edit_form.page_id" filterable placeholder="请选择">
            <el-option
              v-for="page in projectPageList"
              :key="page.id"
              :label="page.name"
              :value="page.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="margin-left:40px">
          <el-button type="primary" @click="editElement('editElementForm')">确 定</el-button>
          <el-button type="danger" @click="isEdit=false;resetForm('editElementForm')">取 消</el-button>
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
import axios from "axios";
axios.defaults.withCredentials = true;

import tcase from '../api/case'
import page from '../api/page'
import element from '../api/element'
import Pagenation from './Pagenation.vue'
export default {
  name: "Element",
  components:{
    Pagenation
  },
  data() {
    return {
      // 当前页面
      currentPage:1,
      // 用例总数
      count:0,
      pageSize: 10,
      // 项目列表
      authorProjectList:[],
      // 项目页面列表
      projectPageList:[],
      // 定位方法列表
      locMethods:[{
          value: 'id',
          label: 'id'
        }, {
          value: 'name',
          label: 'name'
        }, {
          value: 'xpath',
          label: 'xpath'
        }, {
          value: 'css',
          label: 'css'
        }, {
          value: 'tag',
          label: 'tag'
        }],
      eleList:[],
      pro_id:'',
      page_id:'',
      // 是否进入编辑框
      isEdit: false,
      // 用户类型列表
      userTypeList: [{"num":1,"type":"普通用户"},{"num":2,"type":"管理员"}],
      // 是否进入新增框
      dialogFormVisible: false,
      token: localStorage.Authorization,
      // 新增表单
      form: {
        name: "",
        element_location: "",
        loc_method:""
      },
      // 编辑表单
      edit_form: {
        id:"",
        name: "",
        element_location: "",
        loc_method:""
      },
      rules:{
        name:[{required: true, message: '元素名称不能为空', trigger: 'blur'}],
        element_location:[{required: true, message: '元素定位不能为空', trigger: 'blur'}],
        loc_method:[{required: true, message: '定位方式不能为空', trigger: 'blur'}],
      },
      
      
    };
  },
  methods: {
    getElementList(page_id){
      element.getElementList(page_id,this.currentPage,this.pageSize).then(res => {
        this.eleList = res.data.data.res_list
        this.count = res.data.data.count

      })
    },
    // 获取页面
    getPageList(pro_id){
      page.getPageList(pro_id).then(res =>{
        this.projectPageList = res.data.data.res_list.filter(p => p.project_id == this.pro_id)
        if(this.projectPageList.length > 0){
          // 如果有内容默认选中第一个
          this.page_id = this.projectPageList[0].id
          // 设置元素总数
        }else{
          this.page_id = ""
        }
      })
    },
    // 进入新增页面
    intoAddPage(){
      // 先判断是否有页面
      if(this.projectPageList.length>0){
        this.dialogFormVisible = true
      }else{
        this.$message.error("请先添加页面")
      }
    },
    // 添加元素
    addElement(formName) {
      this.$refs[formName].validate((valid) => {
        if(valid){
          const addData = {...this.form};
          addData['page_id'] = this.page_id;
          element.addElement(addData)
            .then((response) => {
              if (response.data.code === 1) {
                this.dialogFormVisible = false;
                this.getElementList(this.page_id);
                this.cancleAdd(formName)
              } else {
                this.$message(response.data.msg);
              }
            })
        }
        else{
          return false
        }
      })
    },
    // 取消添加
    cancleAdd(formName) {
      this.resetForm(formName);
      this.dialogFormVisible = false;
    },
    // 打开修改页面
    intoEditProject(element) {
      this.edit_form = { ...this.edit_form, ...element };
      this.isEdit = true;
    },
    // 修改元素
    editElement(formName) {
      const editData = {...this.edit_form};
      editData['page_id'] = this.page_id;
      element.editElement(editData.id,editData)
        .then((response) => {
          if (response.data.code == 1) {
            this.isEdit = false;
            this.resetForm(formName)
            this.getElementList(this.page_id);
          } else {
            this.$message(response.data.msg);
          }
        })
        .catch((err) => {
          this.$message(err.data.msg);
        });
    },
    // 删除元素
    deleteElement(del_element) {
      const isDel = confirm("确定要删除该元素吗");
      if (isDel) {
        element.deleteElement(del_element.id)
          .then((response) => {
            this.$message(response.data.msg);
            if (response.data.code == 1) {
              this.getElementList(this.page_id);
            }
          });
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
      this.getElementList(this.page_id)
    }
  },
  watch:{
    pro_id(newValue, oldValue) {
      // 获取对应项目页面
      this.getPageList(newValue);
    },
    page_id(newValue, oldValue) {
      // 如果非空就获取对应项目页面
      if(newValue != ''){
        this.getElementList(newValue);
      }else{
        // 清空页面元素数据
        this.eleList.splice(0)
      }
      
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
          this.getPageList(this.pro_id);
        } else {
          this.pro_id = "";
        }
      })
  },
};
</script>

<style>
</style>