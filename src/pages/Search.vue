<template>
  <div style="width:250px;float:right">
    <el-input
        size="small"
        placeholder="输入名称进行搜索"
        prefix-icon="el-icon-search"
        v-model="searchData"
        style="width:200px;margin-right:10px">
    </el-input>
    <el-button icon="el-icon-search" circle size="small" @click="search"></el-button>
  </div>
    

</template>

<script>
export default {
    name:'Search',
    props:['searchData'],
    methods:{
        search(){
            this.$emit('search', this.searchData);
        }
    }
}
</script>

<style>
    
</style>