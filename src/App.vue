<template>
  <div id="app" :style="bgI">
    <el-container style="height: 1000px; border: 1px solid #eee;">
      
     <el-container>
      <el-header style="text-align: right; font-size: 12px">
        <template >
          <Navigation v-show="isLogin"></Navigation>
        </template>
         
      </el-header>
      
      <el-main style="width: 1800px;margin-left:auto;margin-right:auto;" >
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
  </div>
</template>

<script>
import Navigation from './components/Navigation.vue'
  export default {
    name: 'App',
    components: {
      Navigation
    },
    
    computed:{
      isLogin(){
        const islogin = localStorage.getItem('Authorization') ? true : false
        console.log(islogin)
        return islogin
      },
      bgI(){
        if(this.isLogin)
          return ''
        return {
          backgroundImage: 'url('+require('/Users/chnjx/Desktop/projects/we_ui_frotent/src/assets/template.png')+')', 
          backgroundSize:'cover',
          backgroundRepeat:'no-repeat',
          backgroundPosition:'center center',height:'100%',width:'100%'
        }
      }
    }
  }
</script>

<style>

</style>
