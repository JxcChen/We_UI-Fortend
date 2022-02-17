<template>
  <div>
    <el-row :gutter="0">
      <el-col :span="18">
        <div class="grid-content bg-purple">
          <el-menu
            :default-active="activeIndex2"
            class="el-menu-demo"
            mode="horizontal"
            background-color="#0074D9"
            text-color="#fff"
            active-text-color="#00A2E9"
            router
          >
            <el-menu-item disabled>WE-UI</el-menu-item>
            <el-menu-item index="case">用例管理</el-menu-item>
            <!-- <el-menu-item index="task">任务管理</el-menu-item> -->
            <el-menu-item index="user">人员管理</el-menu-item>
            <el-submenu index="4">
              <template slot="title">元素库管理</template>
              <el-menu-item index="4-1">元素库列表</el-menu-item>
              <el-menu-item index="4-2">页面管理</el-menu-item>
            </el-submenu>
            <el-menu-item index="project">项目管理</el-menu-item>
          </el-menu>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple" style="background-color: #0074d9">
          <span style="color: #fbfdff">当前用户：</span>&nbsp
          <el-dropdown style="margin-top: 15px; margin-right: 20px">
            <span class="el-dropdown-link">
              <i class="el-icon-user-solid"></i> {{ username
              }}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>修改密码</el-dropdown-item>
              <el-dropdown-item>退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "Navigation",
  data() {
    return {
      activeIndex: "1",
      activeIndex2: "1",
      circleUrl:
        "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
    };
  },
  computed: {
    username() {
      return localStorage.getItem("User");
    },
  },
};
</script>

<style scoped>
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 0px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 0px;
  min-height: 60px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
.el-dropdown-link {
  cursor: pointer;
  color: #fbfdff;
}
.el-icon-arrow-down {
  font-size: 20px;
}
</style>