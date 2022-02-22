<template>
    <el-container style="height: 100%; border: 1px solid #eee;">
        
        <el-header style="text-align: right; font-size: 12px">
            <template >
              <Navigation></Navigation>
            </template>
        </el-header>
        
        <el-main style="width: 1800px;margin-left:auto;margin-right:auto;"  >
            <router-view></router-view>
            <el-dialog
              title="修改密码"
              :modal-append-to-body="false"
              :visible.sync="$store.state.isChangePassword"
              width="450px"
              :close-on-click-modal="false"
              :close-on-press-escape="false"
              :show-close="false"
              >
            <el-form ref="passwodForm" :model="form" label-width="80px"  :rules="rules">
              <el-form-item label="原密码" prop="old_password">
                <el-input  style="width:280px" v-model="form.old_password" size="small" placeholder="请输入原密码" show-password  ></el-input>
              </el-form-item>
              <el-form-item label="新密码" prop="new_password">
                <el-input style="width:280px" v-model="form.new_password" size="small" placeholder="请输入新密码"  show-password></el-input>
              </el-form-item>
              <el-form-item label="确认密码" prop="comfirm_password">
                <el-input style="width:280px" v-model="form.comfirm_password" size="small" placeholder="请再次输入密码" show-password></el-input>
              </el-form-item>
              <el-form-item style="margin-left:50px">
                <el-button type="primary" @click="changePwd('passwodForm')">确认</el-button>
                <el-button type="danger" @click="cancleChange('passwodForm')">取消</el-button>
              </el-form-item>
            </el-form>
         </el-dialog>
        </el-main>
        
    </el-container>
</template>

<script>
import {mapMutations} from 'vuex'
import Navigation from './Navigation.vue'
import user from '../api/user'
  export default {
    name: 'Index',
    components: {
      Navigation
    },
    data() {
      return {
        form: {
          old_password:'',
          new_password:'',
          comfirm_password:'',
        },
        rules:{
          old_password:[{required: true, message: '原始密码不能为空', trigger: 'blur'}],
          new_password:[{required: true, message: '新密码不能为空', trigger: 'blur'}],
          comfirm_password:[{required: true, message: '确认密码不能为空', trigger: 'blur'}]
        }
      };
    },
    methods:{
      ...mapMutations(['changePassword']),
      changePwd(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if(this.form.new_password === this.form.comfirm_password){
              const request_data={
                old_password:this.form.old_password,
                new_password:this.form.new_password
              }
              user.updatePwd(request_data).then(res => {
                this.$message.success(res.data.msg)
                this.changePassword()
                this.changePassword()
              }).catch(err => {
                this.$message.error(err.data.msg)
              })
              
            }else{
              this.$message.error('两次密码不一致')
            }
          } else {
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields()
      },
      cancleChange(formName){
        this.changePassword()
        this.resetForm(formName)
      }
    },
    computed:{
    }

  }
</script>

<style scoped>
  .myinput{
    width:300px
  }
</style>
