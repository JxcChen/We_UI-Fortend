<template>
    <el-container style="height: 100%; border: 1px solid #eee;">
        
        <el-header style="text-align: right; font-size: 12px">
            <template >
            <Navigation></Navigation>
            </template>
            
        </el-header>
        
        <el-main style="width: 1800px;margin-left:auto;margin-right:auto;" >
            <router-view></router-view>
        </el-main>
        
    </el-container>
</template>

<script>
import Navigation from './Navigation.vue'
  export default {
    name: 'Index',
    components: {
      Navigation
    },
    methods:{
     
      
    },


  }
</script>

<style>

</style>
