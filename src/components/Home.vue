<template>
    <div>
        <el-button  @click="getMsg">点击获取信息</el-button>
        <h1>{{msg}}</h1>
    </div>
  
</template>

<script>
    import axios from 'axios'
    export default {
        name:'Home',
        data() {
            return {
                msg:''
            }
        },
        methods: {
            getMsg(){
                axios.get("http://127.0.0.1:8000/api/home/").then(
                    response => {
                        this.msg = response.data
                    }
                )
            }
        },
    }
</script>

<style>

</style>