<template>

    <div class="block">
        <el-pagination
            layout="prev, pager, next"
            :total="total"
            :page-size="pageSize"
            :current-page.sync="currentPage"
            @current-change="changePage"
        >
        </el-pagination>
    </div>

</template>

<script>
export default {
    name:'Pagenation',
     props : {

        //每页显示条数
        pageSize : {
            type : Number,
            default : 10
        },

        //总记录数
        total : {
            type : Number,
            default : 1
        },

    },
    methods : {
        changePage () {
            //父组件通过change方法来接受当前的页码
            this.$emit('change', this.currentPage)
        }
    },
    computed : {
    },
    data () {
        return {
            currentPage:1, //当前页码
            limit : this.pageSize, //每页显示条数
            size : this.total || 1, //总记录数
        }
    },
    watch : {

    }
}
</script>

<style scoped>

</style>