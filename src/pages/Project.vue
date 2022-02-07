<template>
  <div>
    <el-button @click="dialogFormVisible = true">新增项目</el-button>
    <el-table :data="projects" stripe>
      <el-table-column prop="id" label="id" width="180"> </el-table-column>
      <el-table-column prop="name" label="项目名称" width="180">
      </el-table-column>
      <el-table-column prop="author" label="负责人"> </el-table-column>
      <el-table-column prop="host" label="项目地址"> </el-table-column>
      <el-table-column prop="max_threads" label="最大并发" width="150px">
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="200">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="small"
            @click="intoEditProject(scope.row)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            size="small"
            @click="deleteProject(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      title="项目信息"
      :modal-append-to-body="false"
      :visible.sync="dialogFormVisible"
      width="30%"
    >
      <el-form :model="form" label-position="right" label-width="120px">
        <el-form-item label="项目名称" style="margin-top: 20px">
          <el-input v-model="form.name" style="width: 350px"></el-input>
        </el-form-item>
        <el-form-item label="项目路径">
          <el-input v-model="form.host" style="width: 350px"></el-input>
        </el-form-item>
        <el-form-item label="最大并发数">
          <el-input v-model="form.max_threads" style="width: 350px"></el-input>
        </el-form-item>

        <el-form-item label="自动化任务路径">
          <el-input v-model="form.auto_host" style="width: 350px"> </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addProject">确 定</el-button>
        <el-button type="danger" @click="cancleAdd">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="项目信息"
      :visible.sync="isEdit"
      :modal-append-to-body="false"
      width="30%"
    >
      <el-form :model="edit_form" label-position="right" label-width="120px">
        <el-form-item label="项目id" style="margin-top: 20px; display: none">
          <el-input v-model="edit_form.id" style="width: 350px"></el-input>
        </el-form-item>
        <el-form-item label="项目名称" style="margin-top: 20px">
          <el-input v-model="edit_form.name" style="width: 350px"></el-input>
        </el-form-item>
        <el-form-item label="项目路径">
          <el-input v-model="edit_form.host" style="width: 350px"></el-input>
        </el-form-item>
        <el-form-item label="最大并发数">
          <el-input
            v-model="edit_form.max_threads"
            style="width: 350px"
          ></el-input>
        </el-form-item>
        <el-form-item label="自动化任务路径">
          <el-input v-model="edit_form.auto_host" style="width: 350px">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editProject">确 定</el-button>
        <el-button type="danger" @click="isEdit = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
axios.defaults.withCredentials = true;
export default {
  name: "Project",
  data() {
    return {
      projects: [],
      isEdit: false,
      dialogFormVisible: false,
      form: {
        name: "",
        host: "",
        author: localStorage.getItem("UserId"),
        max_threads: "",
        auto_host: "",
      },
      edit_form: {
        id: "",
        name: "",
        host: "",
        author: localStorage.getItem("UserId"),
        max_threads: "",
        auto_host: "",
      },
      token: localStorage.Authorization,
    };
  },
  methods: {
    addProject() {
      const addProjectData = this.form;
      axios
        .post("http://127.0.0.1:8001/api/project/", addProjectData, {
          headers: {
            Authorization: this.token,
          },
        })
        .then((response) => {
          if (response.data.code === 1) {
            this.dialogFormVisible = false;
            this.getProjectList();
          } else {
            this.$message(response.data.msg);
          }
          this.resetForm();
        })
        .catch((err) => {
          this.$message("项目信息输入有误");
        });
    },
    getProjectList() {
      axios
        .get("http://127.0.0.1:8001/api/project/", {
          headers: {
            Authorization: this.token,
          },
          responseType: "json",
          params: {
            user_id: localStorage.getItem("UserId"),
          },
        })
        .then((response) => {
          this.projects = response.data.data;
        });
    },
    cancleAdd() {
      this.resetForm();
      this.dialogFormVisible = false;
    },
    intoEditProject(pro) {
      this.edit_form = { ...this.edit_form, ...pro };
      this.isEdit = true;
    },
    editProject() {
      axios
        .put(
          "http://127.0.0.1:8001/api/project/" + this.edit_form.id + "/",
          this.edit_form,
          {
            headers: {
              Authorization: this.token,
            },
            responseType: "json",
          }
        )
        .then((response) => {
          if (response.data.code == 1) {
            this.isEdit = false;
            this.getProjectList();
          } else {
            this.$message(response.data.msg);
          }
        })
        .catch((err) => {
          this.$message("项目信息输入有误");
        });
    },
    deleteProject(project) {
      const isDel = confirm("确定要删除该项目吗");
      if (isDel) {
        axios
          .delete("http://127.0.0.1:8001/api/project/" + project.id + "/", {
            headers: {
              Authorization: this.token,
            },
            responseType: "json",
          })
          .then((response) => {
            this.$message(response.data.msg);
            if (response.data.code == 1) {
              this.getProjectList();
            }
          });
      }
    },
    resetForm() {
      this.form.name = "";
      this.form.host = "";
      this.form.max_threads = "";
      this.form.auto_host = "";
    },
  },
  mounted() {
    this.getProjectList();
  },
};
</script>

<style>
</style>