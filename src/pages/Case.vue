<template>
  <div>
    <div>
      当前项目：
      <el-select size="small" v-model="pro_id" placeholder="请选择">
        <el-option
          v-for="pro in authorProjectList"
          :key="pro.id"
          :label="pro.name"
          :value="pro.id"
          :project_index="pro.index"
        >
        </el-option>
      </el-select>
      <el-button
        size="small"
        style="margin-left: 20px"
        @click="dialogFormVisible = true"
        >新增用例</el-button
      >
      <div style="float: right">
        执行路径：
        <el-select size="small" v-model="excuseHost" placeholder="请选择">
          <el-option
            v-for="host in currentHostList"
            :key="host.index"
            :label="host"
            :value="host"
          >
          </el-option>
        </el-select>
      </div>
    </div>

    <el-table :data="cases" stripe>
      <el-table-column prop="id" label="id" width="180"> </el-table-column>
      <el-table-column prop="name" label="用例名称" width="180">
      </el-table-column>
      <el-table-column prop="script_name" label="脚本名称"> </el-table-column>
      <el-table-column prop="is_threads" label="是否并发" width="100">
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="300">
        <template slot-scope="scope">
          <el-button
            ref="excuseBtn"
            type="primary"
            size="small"
            @click="excuseCase(scope.row)"
            >执行</el-button
          >
          <el-button
            ref="excuseBtn"
            type="danger"
            size="small"
            @click="intoEditCase(scope.row)"
            >编辑</el-button
          >
          <el-button type="danger" size="small" @click="deleteCase(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 新增用例框 -->
    <el-dialog
      title="用例信息"
      :modal-append-to-body="false"
      :visible.sync="dialogFormVisible"
      width="30%"
    >
      <el-form :model="form" label-position="right" label-width="120px">
        <el-form-item label="用例名称" style="margin-top: 20px">
          <el-input v-model="form.name" style="width: 350px"></el-input>
        </el-form-item>
        <el-form-item label="是否并发">
          <el-radio v-model="form.is_thread" label="1">是</el-radio>
          <el-radio v-model="form.is_thread" label="2">否</el-radio>
        </el-form-item>
        <el-form-item label="重试次数">
          <el-input v-model="form.retry_count" style="width: 350px"> </el-input>
        </el-form-item>
        <el-form-item label="用例脚本">
          <el-upload
            ref="uploadFile"
            class="upload-demo"
            :action="upLoadUrl"
            :on-success="handleSuccess"
            :before-remove="beforeRemove"
            :before-upload="beforeUpload"
            multiple
            :auto-upload="false"
            :limit="1"
            :on-exceed="handleExceed"
            :file-list="fileList"
            :headers="myHeader"
          >
            <el-button
              slot="trigger"
              size="small"
              type="success"
              @click="submitUpload"
              >选择脚本文件</el-button
            >
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addCase">确 定</el-button>
        <el-button type="danger" @click="dialogFormVisible = false"
          >取 消</el-button
        >
      </div>
    </el-dialog>
    <!-- 编辑用例框 -->
    <el-dialog
      title="用例信息"
      :visible.sync="isEdit"
      :modal-append-to-body="false"
      width="30%"
    >
      <el-form :model="edit_form" label-position="right" label-width="120px">
        <el-form-item label="用例名称" style="margin-top: 20px">
          <el-input v-model="edit_form.name" style="width: 350px"></el-input>
        </el-form-item>
        <el-form-item label="是否并发">
          <el-radio v-model="edit_form.is_thread" label="1">是</el-radio>
          <el-radio v-model="edit_form.is_thread" label="2">否</el-radio>
        </el-form-item>
        <el-form-item label="重试次数">
          <el-input v-model="edit_form.retry_count" style="width: 350px">
          </el-input>
        </el-form-item>
        <el-form-item label="用例脚本">
          <el-upload
            ref="uploadFile"
            class="upload-demo"
            :action="upLoadUrl"
            :on-success="handleSuccess"
            :before-remove="beforeRemove"
            :before-upload="beforeUploadEdit"
            multiple
            :auto-upload="false"
            :limit="1"
            :on-exceed="handleExceed"
            :file-list="fileList"
            :headers="myHeader"
          >
            <el-button slot="trigger" size="small" type="success"
              >选择脚本文件</el-button
            >
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editCase">确 定</el-button>
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
      cases: [],
      isEdit: false,
      isUpload: false,
      dialogFormVisible: false,
      pro_id: 0,
      form: {
        name: "",
        is_thread: "1",
        retry_count: "",
        script_name: "",
        author: localStorage.getItem("UserId"),
      },
      edit_form: {
        name: "",
        is_thread: "",
        retry_count: "",
        script_name: "",
        author: localStorage.getItem("UserId"),
      },
      authorProjectList: [],
      fileList: [],
      fileName: "",
      token: localStorage.Authorization,
      myHeader: { Authorization: localStorage.Authorization },
      excuseStatus: "执行",
      hostList: {},
      currentHostList: [],
      excuseHost: "",
    };
  },
  methods: {
    handleSuccess(file) {
      this.fileList.splice(0, 1);
    },
    beforeUpload(file) {
      this.form.script_name = file.name;
    },
    beforeUploadEdit(file) {
      this.edit_form.script_name = file.name;
    },
    handleExceed(files, fileList) {
      this.$message.warning(`一次只能上传一个脚本文件`);
    },
    beforeRemove(file, fileList) {
      const isdel = this.$confirm(`确定移除 ${file.name}？`);
      if (isdel) this.form.script_name = "";
      return isdel;
    },
    // 上传文件
    submitUpload() {
      this.$refs.uploadFile.submit();
    },
    // 添加用例
    addCase() {
      let addCaseData = this.form;
      addCaseData["project_id"] = this.pro_id;
      this.submitUpload();
      axios
        .post("http://127.0.0.1:8001/api/case/", addCaseData, {
          headers: {
            Authorization: this.token,
          },
          responseType: "json",
        })
        .then((response) => {
          console.log(response.data);
          this.dialogFormVisible = false;
          this.getCaseList(this.pro_id);
          this.resetForm();
        });
    },
    // 获取对应项目下的所有用例
    getCaseList(pro_id) {
      axios
        .get("http://127.0.0.1:8001/api/case/", {
          headers: {
            Authorization: this.token,
          },
          responseType: "json",
          params: {
            pro_id: pro_id,
          },
        })
        .then((response) => {
          // 将并发以是否进行展示
          response.data.data.forEach((c) => {
            c["is_thread"] === 1
              ? (c["is_threads"] = "是")
              : (c["is_threads"] = "否");
          });
          this.cases = response.data.data;
        });
    },
    // 进入修改用例页面
    intoEditCase(edit_case) {
      console.log(edit_case);
      if (edit_case.script_name !== "") {
        this.fileList.splice(0, 1, { name: edit_case.script_name });
      }
      if (edit_case.is_threads === "是") {
        edit_case["is_thread"] = "1";
      } else {
        edit_case["is_thread"] = "2";
      }
      this.edit_form = { ...this.edit_form, ...edit_case };
      delete this.edit_form.is_threads;
      this.isEdit = true;
    },
    // 修改用例
    editCase() {
      this.submitUpload();
      axios
        .put(
          "http://127.0.0.1:8001/api/case/" + this.edit_form.id + "/",
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
            this.getCaseList(this.pro_id);
          } else {
            alert(response.data.msg);
          }
        });
    },
    // 删除用例
    excuseCase(excuse_case) {
      // this.$refs.excuseBtn.textContent = "执行中";
      console.log(this.$refs.excuseBtn);
      axios
        .get("http://127.0.0.1:8001/api/case/excuse/" + excuse_case.id + "/", {
          headers: {
            Authorization: this.token,
          },
          responseType: "json",
          params: {
            host: this.excuseHost,
          },
        })
        .then((response) => {
          this.$message(response.data.msg);
        });
    },
    // 删除用例
    deleteCase(del_case) {
      const isDel = confirm("确定要删除该项目吗");
      if (isDel) {
        axios
          .delete("http://127.0.0.1:8001/api/case/" + del_case.id + "/", {
            headers: {
              Authorization: this.token,
            },
            responseType: "json",
          })
          .then((response) => {
            this.$message(response.data.msg);
            if (response.data.code == 1) {
              this.getCaseList(this.pro_id);
            }
          });
      }
    },
    resetForm() {
      this.form.name = "";
      this.form.is_thread = "";
      this.form.retry_count = "";
      this.form.script_name = "";
    },
  },
  computed: {
    // 文件上传路径
    upLoadUrl() {
      return "http://127.0.0.1:8001/api/case/uploadScript/" + this.pro_id + "/";
    },
  },
  watch: {
    pro_id(newValue, oleValue) {
      this.getCaseList(newValue);
      this.currentHostList = this.hostList[newValue.toString()];
      this.excuseHost = this.currentHostList[0];
    },
  },
  mounted() {
    // 获取该用户下拥有权限的项目
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
        response.data.data.res_pro_list.forEach((pro) => {
          this.authorProjectList.push(pro);
        });
        this.hostList = response.data.data.res_host_list;
        if (response.data.data.res_pro_list.length > 0) {
          this.pro_id = response.data.data.res_pro_list[0].id;
          this.getCaseList(this.pro_id);
        } else {
          this.pro_id = "";
        }
      });
  },
};
</script>

<style>
</style>