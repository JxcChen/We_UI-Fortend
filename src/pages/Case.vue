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
        class="my_btn"
        @click="concurrentExcution"
        >并发执行</el-button
      >
      <el-button
        size="small"
        class="my_btn"
        @click="lookReportSummary"
        >查看报告总结</el-button
      >
      <el-button
        size="small"
        class="my_btn"
        @click="dialogFormVisible = true"
        >新增用例</el-button
      >
      <el-button
        size="small"
        class="my_btn"
        @click="uploadUtils"
        >
        更新调试包
        </el-button>
      <el-button
        size="small"
        class="my_btn"
        @click="intoSetAutoTask"
        >
        自动化任务设置
        </el-button>

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
      <el-table-column prop="id" label="id" > </el-table-column>
      <el-table-column prop="name" label="用例名称" >
      </el-table-column>
      <el-table-column prop="script_name" label="脚本名称"> </el-table-column>
      <el-table-column prop="is_threads" label="是否并发" ></el-table-column>
      <el-table-column prop="is_auto_excuse_show" label="是否自动执行" ></el-table-column>
      <el-table-column fixed="right" label="操作" >
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
          <el-button
            ref="excuseBtn"
            type="danger"
            size="small"
            @click="lookReport(scope.row)"
            >报告</el-button
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
      <el-form :model="form" label-position="right" label-width="120px" :rules="rules">
        <el-form-item label="用例名称" style="margin-top: 20px"  prop="name">
          <el-input v-model="form.name" style="width: 250px" placeholder="请输入用例名称" ></el-input>
        </el-form-item>
        <el-form-item label="重试次数">
          <el-input v-model="form.retry_count" style="width: 250px" 
            placeholder="请输入重试次数 最大为5" 
            oninput="value=value.replace(/[^\d]/g,'');if(value>5)value=5;if(value<0)value=0" >
          </el-input>
        </el-form-item>
        <el-form-item label="是否并发" :required="true">
          <el-radio v-model="form.is_thread" label="1">是</el-radio>
          <el-radio v-model="form.is_thread" label="2">否</el-radio>
        </el-form-item>
        <el-form-item label="是否自动执行" :required="true">
            <el-radio v-model="form.is_auto_excuse" label="1">是</el-radio>
            <el-radio v-model="form.is_auto_excuse" label="0">否</el-radio>
        </el-form-item>
        <el-form-item label="用例脚本" :required="true">
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
        <el-button type="danger" @click="cancleAddCase"
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
      <el-form :model="edit_form" label-position="right" label-width="120px" :rules="rules" >
        <el-form-item label="用例名称" style="margin-top: 20px" prop="name">
          <el-input v-model="edit_form.name" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="重试次数">
          <el-input v-model="edit_form.retry_count" style="width: 250px"
            placeholder="请输入重试次数 最大为5" 
            oninput="value=value.replace(/[^\d]/g,'');if(value>5)value=5;if(value<0)value=0" >
          >
          </el-input>
        </el-form-item>
        <el-form-item label="是否并发" :required="true">
          <el-radio v-model="edit_form.is_thread" label="1">是</el-radio>
          <el-radio v-model="edit_form.is_thread" label="2">否</el-radio>
        </el-form-item>
        <el-form-item label="是否自动执行" :required="true">
            <el-radio v-model="edit_form.is_auto_excuse" label="1">是</el-radio>
            <el-radio v-model="edit_form.is_auto_excuse" label="0">否</el-radio>
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
            :file-list="utilsFileList"
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
        <el-button type="danger" @click="isEdit = false;fileList.splice(0,1)">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 测试报告框 -->
    <el-dialog
      title="测试报告"
      :modal-append-to-body="false"
      :visible.sync="isLookReport"
      width="80%"
    >
      <div>
        <div ref="reportHTML" v-html="htmlText" class="web-con"></div>
      </div>
      
    </el-dialog>

    <!-- 测试报告总结框 -->
    <el-dialog
      title="测试报告总结"
      :modal-append-to-body="false"
      :visible.sync="isLookReportSummary"
      width="30%"
    >
      <div style="text-align:center;font-size:16px" ref="reportSummary"></div>
      
    </el-dialog>

    <!-- 调试包操作 -->
    <el-dialog
      title="调试包更新"
      :modal-append-to-body="false"
      :visible.sync="clientUpdate"
      width="60%"
    >
      <div>
        <div>
          <h5>下载调试包:调试包中有对应的用例脚本模板,以及公用的工具包;工具包可进行更新</h5>
          <el-button
            size="small"
            style="margin-left: 10px"
            type="success"
            ><span class="link-url" @click="downloadClient">点击下载调试包</span></el-button
          >
        </div>
        <div>
          <h5>更新工具包:可对public中的公用包进行更新,上传的文件须为python文件</h5>
          <el-upload
            class="upload-demo"
            :action="uploadUtilsUrl"
            multiple
            :auto-upload="true"
            :limit="3"
            :before-upload="beforeUtilUpload"
            :file-list="utilsFileList"
            :headers="myHeader"
          >
            <el-button slot="trigger" size="small" type="success" style="margin-left: 10px"
              >点击更新工具包</el-button
            >
      </el-upload>
        </div>
      </div>
      
    </el-dialog>


    <!-- 自动化任务设置框 -->
    <el-dialog
      title="自动化任务设置"
      :modal-append-to-body="false"
      :visible.sync="isSetAuto"
      width="50%"
      
    >

    <el-tabs v-model="activeName" @tab-click="handleClick" >
      <el-tab-pane label="任务配置" name="first" style="height:200px">
        <el-form :model="autoTask" label-position="right" label-width="120px">
          <el-form-item label="是否开启" style="margin-top: 20px">
            <el-switch
              v-model="autoTask.autoSwitch"
              active-color="#13ce66"
              inactive-color="#ff4949">
            </el-switch>
          </el-form-item>
          
          <el-form-item label=" 设置执行时间">
            <el-time-select
              v-model="autoTask.autoExcuseTime"
              :picker-options="{
                start: '00:00',
                step: '00:15',
                end: '23:59'
              }"
              placeholder="选择时间">
            </el-time-select>
          </el-form-item>
          
        </el-form>
        <div align='center'>
          <el-button type="primary" @click="openOrCloseTask">确 定</el-button>
          <el-button type="danger" @click="cancleSetAuto">取 消</el-button>
        </div>
        </el-tab-pane>
        <el-tab-pane label="通知配置" name="second" style="height:220px;padding:45px 0">
          <h4>配置任务通知</h4>
          <div>
            选择通知方式: 
            <el-select size="small" v-model="sendType" placeholder="请选择通知方式">
              <el-option
                v-for="item in typeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            &nbsp&nbsp
            <span v-show="sendType==1">选择通知人员: 
              <el-select size="small" v-model="sendUserList" multiple placeholder="请选择">
                <el-option
                  v-for="u in users"
                  :key="u.id"
                  :label="u.username"
                  :value="u.id"
                >
                </el-option>
              </el-select>
            </span>

            <span v-show="sendType==2">请输入webhook地址: 
              <el-input v-model="webhook" size="small" style="width: 250px"></el-input>
            </span>
            &nbsp&nbsp
            <el-button @click="addNotice"  icon="el-icon-check" circle size='small'></el-button>
          </div>
          
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
import constant from "../constant/constant"
import {mapState,mapMutations} from 'vuex';
axios.defaults.withCredentials = true;
import tcase from "../api/case"
export default {
  name: "Project",
  data() {
    return {
      // 自动化任务任务设置默认选项
      activeName: 'first',
      sendType: '1',
      typeList:[{value:'1',label:'邮箱'},{value:'2',label:'企业微信'}],
      // 用例列表
      cases: [],
      // 邮箱收件人列表
      sendUserList:[],
      // webhook地址
      webhook:'',
      // 编辑框
      isEdit: false,
      // 新增框
      dialogFormVisible: false,
      // 自动化设置框
      isSetAuto: false,
      autoTask:{
        // 自动化开关
        autoSwitch: false,
        // 自动化执行时间
        autoExcuseTime: ''
      },
      // 保存自动化设置框编辑前的状态
      autoTaskStatus:{
        // 自动化开关
        autoSwitch: false,
        // 自动化执行时间
        autoExcuseTime: ''
      },
      // 当前项目id
      pro_id: 0,
      form: {
        name: "",
        is_thread: "1",
        retry_count: 0,
        script_name: "",
        author: localStorage.getItem("UserId"),
        is_auto_excuse: "1"
      },
      rules:{
        name :[{required: true, message: '用例名称不能为空', trigger: 'blur'}],
      },
      edit_form: {
        name: "",
        is_thread: "",
        retry_count: "",
        script_name: "",
        author: localStorage.getItem("UserId"),
        is_auto_excuse: "",
        is_auto_excuse_show: ""
      },
      // 当前用户的项目列表
      authorProjectList: [],
      // 上传的脚本列表
      fileList: [],
      // 上传的工具类列表
      utilsFileList: [],
      // 上传的脚本名称
      fileName: "",
      token: localStorage.Authorization,
      myHeader: { Authorization: localStorage.Authorization },
      // 全部项目与执行路径列表
      hostList: {},
      // 当前项目的执行路径列表
      currentHostList: [],
      // 当前执行路径
      excuseHost: "",
      // 测试报告的内容
      htmlText: "",
      // 测试报告
      isLookReport: false,
      // 报告总结
      isLookReportSummary: false,
      // 报告总结内容
      reportSummaryContent: '',
      // 调试包
      clientUpdate: false
    };
  },
  methods: {
    handleClick(tab, event) {
        
    },
    handleSuccess(file) {
      this.fileList.splice(0, 1);
    },
    beforeUtilUpload(file) {
      const isPY = file.type === 'text/x-python';
      const isLt200k = file.size / 1024 / 1024 < 0.2;

      if (!isPY) {
        this.$message.error('上传工具类只能是python文件!');
      }
      if (!isLt200k) {
        this.$message.error('上传工具类大小不能超过 200KB!');
      }
      return isPY && isLt200k;
    },
    beforeUpload(file) {
      this.form.script_name = file.name;
    },
    beforeUploadEdit(file) {
      this.edit_form.script_name = file.name;
    },
    handleExceed() {
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
      if(this.form['name']===''){
        return
      }
      let addCaseData = this.form;
      addCaseData["project_id"] = this.pro_id;
      // 上传脚本文件
      tcase.addCase(addCaseData)
      .then((response) => {
        this.dialogFormVisible = false;
        this.getCaseList(this.pro_id);
        this.resetForm();
      });
    },
    // 取消新增用例
    cancleAddCase(){
      this.dialogFormVisible = false
      this.resetForm();
    },
    // 获取对应项目下的所有用例
    getCaseList(pro_id) {
      tcase.getCaseList(pro_id)
        .then((response) => {
          // 将并发以是否进行展示
          response.data.data.forEach((c) => {
            c["is_thread"] === 1
              ? (c["is_threads"] = "是")
              : (c["is_threads"] = "否");
            c["is_auto_excuse"] == 1
            ? (c["is_auto_excuse_show"] = "是")
            : (c["is_auto_excuse_show"] = "否");
          });
          this.cases = response.data.data;
        });
    },
    // 进入修改用例页面
    intoEditCase(edit_case) {
      // edit_case是要修改的case数据
      if (edit_case.script_name !== "") {
        this.fileList.splice(0, 1, { name: edit_case.script_name });
      }
      if (edit_case.is_threads === "是") {
        edit_case["is_thread"] = "1";
      } else {
        edit_case["is_thread"] = "2";
      }
      if (edit_case.is_auto_excuse_show === "是") {
        edit_case["is_auto_excuse"] = "1";
      } else {
        edit_case["is_auto_excuse"] = "0";
      }
      this.edit_form = { ...this.edit_form, ...edit_case };
      delete this.edit_form.is_threads;
      delete this.edit_form.is_auto_excuse_show
      this.isEdit = true;
    },
    // 修改用例
    editCase() {
      if(this.edit_form.name==''){
        return
      }
      this.submitUpload();
        tcase.editCase(this.edit_form.id,this.edit_form)
        .then((response) => {
          if (response.data.code == 1) {
            this.isEdit = false;
            this.getCaseList(this.pro_id);
            this.fileList.splice(0,1)
          } else {
            alert(response.data.msg);
          }
        });
    },
    // 执行用例
    excuseCase(excuse_case) {
      tcase.excuseCase(excuse_case.id,this.excuseHost)
        .then((response) => {
          this.$message(response.data.msg);
        });
    },
    // 删除用例
    deleteCase(del_case) {
      const isDel = confirm("确定要删除该项目吗");
      if (isDel) {
        tcase.deleteCase(del_case.id)
          .then((response) => {
            this.$message(response.data.msg);
            if (response.data.code == 1) {
              this.getCaseList(this.pro_id);
            }
          });
      }
    },
    // 查看报告
    lookReport(report_case){
      axios.get(constant.baseURL+"case/report/" + report_case.id + "/",{
            headers: {
              Authorization: this.token,
            },
          })
          .then((response) => {

            if (response.data.code == 3) {
              this.$message(response.data.msg);
            }else{
              // 因为v-html不会执行js内容 所以要将返回数据中的 js内容获取出来 进行动态添加
              this.htmlText = response.data
              let JSScript = ''
              // 使用正则获取js内容
              response.data.replace(/<script.*?>([\s\S]+?)<\/script>/img,function(_,js){    //正则匹配出script中的内容
                      JSScript = js
              })
              this.$nextTick(() => {
                // 将js脚本内容插入到标签当中
                var newElement = document.createElement("script")
                newElement.innerHTML = JSScript
                this.$refs.reportHTML.append(newElement)
              })
              this.isLookReport = true
            }
          });
    },
    // 打开更新调试包并清空上传工具类列表
    uploadUtils(){
      this.utilsFileList.splice(0,3)
      this.clientUpdate =true
    },

    // 清空新增表单数据
    resetForm() {
      this.form.name = "";
      this.form.is_thread = "1";
      this.form.is_auto_excuse = "1";
      this.form.retry_count = "";
      this.form.script_name = "";
    },
    // 并发执行用例
    concurrentExcution(){
      let param = {
          project_id: this.pro_id,
          host: this.excuseHost,
        } 
      tcase.concurrentExcution(param)
      .then(response => {
        confirm(response.data.msg)
      })
    },
    // 查看项目报告总结
    lookReportSummary(){
      tcase.lookReportSummary(this.pro_id).then(response => {
        if(response.data.code === 1){
          this.isLookReportSummary = true
          this.$nextTick(() => {
            // 将js脚本内容插入到标签当中
            this.$refs.reportSummary.innerHTML = response.data.data
          })
        }else{
          this.$message(response.data.msg)
        }
      })
    },
    // 下载调试包
    downloadClient(){
      window.open(constant.baseURL+"case/downloadclient/45/")
    },
    //进入自动化任务设置编辑框
    intoSetAutoTask(){
      tcase.getProjectDetail(this.pro_id).then(response=>{
        const res_data = response.data.data
        this.autoTask.autoSwitch = res_data['is_auto'] == 1 ? true : false
        this.autoTask.autoExcuseTime = res_data['excuse_time']
      })
      // 获取已配置的任务通知
      tcase.getProjectNotice(this.pro_id).then(response=>{
        const res_data = response.data.data
        this.sendType = res_data['notice_type']+''
        this.sendUserList.splice(0)
        if(this.sendType === '1'){
          res_data['user_list'].split(',').forEach(user => {
            this.sendUserList.push(Number(user))
          })
        }
        this.webhook = res_data['webhook']

      })
      // 获取所有人员
      this.getUserList('all')
      this.autoTaskStatus = {...this.autoTaskStatus,...this.autoTask}
      this.isSetAuto = true
    },
    cancleSetAuto(){
      this.autoTask = {...this.autoTask,...this.autoTaskStatus}
      this.isSetAuto = false
    },
    // 开启或关闭自动化任务
    openOrCloseTask(){
      if(this.autoTask.autoSwitch){
        const param =  {excuse_time: this.autoTask.autoExcuseTime}
        tcase.openAutoTask(this.pro_id,param).then(response => {
          // alert(response.data.data)
          this.isSetAuto = false
          this.$message(response.data.msg)
        })
      }else{
        tcase.closeAutoTask(this.pro_id).then(response => {
          this.isSetAuto = false
          this.$message(response.data.msg)
        })
      }
    },
    ...mapMutations(['getUserList']),
    addNotice(){
      // 封装请求参数
      let requestData ={
        project_id:this.pro_id,
      }
      if(this.sendType == '1'){
        const len = this.sendUserList.length
        if(len === 0){
          this.$message.error("必须配置收件人")
          return
        }else{
          requestData['notice_type'] = 1
          let resUsers = this.sendUserList[0]
          for(var i=1;i<len;i++){
            resUsers += ','+this.sendUserList[i]
          }
          requestData['user_list'] = resUsers
        }
        
      }else{
        const webhook = this.webhook.trim()
        console.log(webhook)
        if(!webhook){
          this.$message.error('请输入webhook地址')
          return
        }
        requestData['notice_type'] = 2
        requestData['webhook'] = webhook
      }
      tcase.addNotice(requestData).then(res=>{
        this.$message(res.data.msg)
        this.isSetAuto = false
      })
    }
    
  },
  computed: {
    // 文件上传路径
    upLoadUrl() {
      return constant.baseURL+"case/uploadScript/" + this.pro_id + "/";
    },
    uploadUtilsUrl(){
      return constant.baseURL+"case/uploadUtils/" + this.pro_id + "/";
    },
    ...mapState(['users'])
  },
  watch: {
    pro_id(newValue, oldValue) {
      this.getCaseList(newValue);
      this.currentHostList = this.hostList[newValue.toString()];
      this.excuseHost = this.currentHostList[0];
    },
  },
  mounted() {
    tcase.getUserProjectList()
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

<style scoped>
  .my_btn{
    margin-left: 10px
  }
</style>