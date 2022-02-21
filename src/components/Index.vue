<template>
    <el-container style="height: 100%; border: 1px solid #eee;">
        
        <el-header style="text-align: right; font-size: 12px">
            <template >
              <Navigation></Navigation>
            </template>
        </el-header>
        
        <el-main style="width: 1800px;margin-left:auto;margin-right:auto;" >
            <router-view></router-view>
            <el-dialog
          title="修改密码"
          :modal-append-to-body="false"
          :visible.sync="isChangePassword"
          width="60%"
        >
          <div>
            <div>
              <h5>修改密码</h5>
            </div>
          </div>
    </el-dialog>
        </el-main>
        
    </el-container>
</template>

<script>
import mapState from 'vuex'
import Navigation from './Navigation.vue'
  export default {
    name: 'Index',
    components: {
      Navigation
    },
    methods:{
     
      
    },
    computed:{
      ...mapState(['isChangePassword'])
    }

  }
</script>

<style>

</style>
