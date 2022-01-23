<template>
<div>
    
    <el-menu
    :default-active="activeIndex2"
    class="el-menu-demo"
    mode="horizontal"
    background-color="#4f4f4f"
    text-color="#fff"
    active-text-color="#00A2E9"
    router
    >
        <el-menu-item disabled >WE-UI</el-menu-item>
        <el-menu-item index="/case">用例管理</el-menu-item>
        <el-menu-item index="2">任务管理</el-menu-item>
        <el-menu-item index="3">人员管理</el-menu-item>
        <el-submenu index="4">
            <template slot="title">元素库管理</template>
            <el-menu-item index="4-1">元素库列表</el-menu-item>
            <el-menu-item index="4-2">页面管理</el-menu-item>
        </el-submenu>
        <el-menu-item index="/project" >项目管理</el-menu-item>
    
    </el-menu>
</div>
  


</template>

<script>
export default {
    name:'Navigation',
    data() {
      return {
        activeIndex: '1',
        activeIndex2: '1',
        circleUrl: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
        
      };
    },
  }
</script>

<style>

</style>