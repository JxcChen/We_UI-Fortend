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

        //页面中的可见页码，其他的以...替代, 必须是奇数
        perPages : { 
            type : Number,
            default : 5 
        },

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
        prev(){
            if (this.index > 1) {
                this.go(this.index - 1)
            }
        },
        next(){
            if (this.index < this.pages) {
                this.go(this.index + 1)
            }
        },
        first(){
            if (this.index !== 1) {
                this.go(1)
            }
        },
        last(){
            if (this.index != this.pages) {
                this.go(this.pages)
            }
        },
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
        pageIndex(val) {
            this.index = val || 1
        },
        pageSize(val) {
            this.limit = val || 10
        },
        total(val) {
            this.size = val || 1
        }
    }
}
</script>

<style scoped>

</style>