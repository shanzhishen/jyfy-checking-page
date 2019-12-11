<template>
  <el-container class="bigContainer">
    <el-aside width="200px">
      <el-input placeholder="输入关键字进行过滤" v-model="filterText">
        <el-button
          slot="append"
          icon="el-icon-refresh"
          @click.native="refresh"
          :disabled="refreshDisable"
        ></el-button>
      </el-input>
      <el-tree
        :data="projectTree"
        :props="defaultProps"
        @node-click="clickProject"
        class="filter-tree"
        :filter-node-method="filterNode"
        ref="tree"
      ></el-tree>
    </el-aside>
    <el-container>
      <el-header class="projectHead">
        <el-date-picker
          v-model="week"
          type="week"
          format="yyyy 第 WW 周"
          placeholder="选择周"
          @change="changeWeek"
          value-format="yyyy-MM-dd 00:00:00"
          :picker-options="{firstDayOfWeek:1}"
        ></el-date-picker>
        <el-button-group>
          <el-button type="success" icon="el-icon-plus" @click.native="addOne">保存</el-button>
          <el-button type="info" icon="el-icon-close" @click.native="unhandlerPaper">未提交</el-button>
          <el-button
            type="primary"
            icon="el-icon-download"
            @click.native="downloadPaper"
            v-loading.fullscreen.lock="fullscreenLoading"
          >批量导出</el-button>
          <el-button
            type="warning"
            icon="el-icon-download"
            @click.native="downloadSummary"
            v-loading.fullscreen.lock="fullscreenLoading"
          >导出总结</el-button>
        </el-button-group>
      </el-header>
      <el-main class="projectMain">
        <el-row>
          <el-form :model="paperForm" :rules="rules" ref="projectForm">
            <div class="paperTitle" :class="{'titleColor': isSubmit}">项目周报【{{weekObj.monday}}—{{weekObj.sunday}}】</div>
            <span style="font-size:5px;color:red">* 工作内容不填将不会被保存</span>
            <el-form-item
              label="项目名称："
              label-width="120px"
              prop="projectName"
            >{{projectForm.projectName}}</el-form-item>
            <el-form-item label="项目当前阶段：" label-width="120px" prop="stage">
              <el-radio-group v-model="projectForm.stage" disabled>
                <el-radio
                  :label="item.value"
                  v-for="(item, index) in stageInfo"
                  :key="index"
                >{{item.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="项目进度：" label-width="120px" prop="progress">
              <el-radio-group v-model="projectForm.progress" disabled>
                <el-radio
                  :label="item.value"
                  v-for="(item, index) in progressInfo"
                  :key="index"
                >{{item.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-col :span="8">
              <el-form-item
                label="项目负责人："
                label-width="100px"
                prop="jnum"
              >{{getNameByJnum(projectForm.jnum1)}} {{getNameByJnum(projectForm.jnum2)}} {{getNameByJnum(projectForm.jnum3) }}</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="来院工程师：" label-width="100px" prop="engineerName">
                <el-input v-model="paperForm.engineerName" autocomplete="off" placeholder="姓名"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="工时：" label-width="100px" prop="workHours">
                <el-input v-model="paperForm.workHours" autocomplete="off" placeholder="小时"></el-input>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
        <el-row>
          <div class="scTitle">本周工作</div>
          <ThisWeekJob :jobList="thisWeekJobList" ref="thisWeekJob"></ThisWeekJob>
        </el-row>
        <el-row>
          <div class="scTitle">其它工作</div>
          <OtherJob :jobList="otherJobList" ref="otherJob"></OtherJob>
        </el-row>
        <el-row>
          <div class="scTitle">出现的问题/风险与解决办法</div>
          <QuestionJob :jobList="questionJobList" ref="questionJob"></QuestionJob>
        </el-row>
        <el-row>
          <div class="scTitle">下周计划</div>
          <NextWeekJob :jobList="nextWeekJobList" ref="nextWeekJobList"></NextWeekJob>
        </el-row>
        <el-row>
          <div class="scTitle">需要协调的工作</div>
          <FittedJob :jobList="fittedJobList" ref="fittedJobList"></FittedJob>
        </el-row>
      </el-main>
    </el-container>
    <el-dialog title="未上交的周报" :visible.sync="unhandlerVisible">
      <div
        v-for="(item, index) in unhandlerPapers"
        :key="index"
      ><span v-if="typeof item.pname!=='undefined'&&item.pname!==''">{{item.pname}} - </span>{{item.projectName}} : {{getNameByJnum(item.jnum1)}} {{getNameByJnum(item.jnum2)}} {{getNameByJnum(item.jnum3)}}</div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="unhandlerVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>
<script>
import Data from "@/assets/js/data.js";
import common from "@/assets/js/common.js";
import ProjectInfo from "@/assets/js/projectInfo.js";
import ThisWeekJob from "@/components/ThisWeekJob";
import OtherJob from "@/components/OtherJob";
import QuestionJob from "@/components/QuestionJob";
import NextWeekJob from "@/components/NextWeekJob";
import FittedJob from "@/components/FittedJob";
export default {
  data() {
    return {
      filterText: "",
      userList: [],
      week: new Date((new Date().getTime()-1000*60*60*24*7)),
      projectTree: [],
      userList: [],
      projectList: [],
      defaultProps: {
        children: "children",
        label: "projectName"
      },
      // 选中的项目
      projectForm: {
        projectId: "",
        projectName: "",
        pid: "",
        pname: "",
        stage: "",
        progress: "",
        info: "",
        remark: "",
        state: "",
        jnum1: "",
        jnum2: "",
        jnum3: ""
      },
      // 选中项目和日期的周报
      paperForm: {
        weekId: "",
        projectId: "",
        projectName: "",
        engineerName: "",
        workHours: ""
      },
      // 所有的工作细节
      paperDetails: [],
      thisWeekJobList: [],
      otherJobList: [],
      questionJobList: [],
      nextWeekJobList: [],
      fittedJobList: [],
      jobDetail: {
        detailId: "",
        weekId: "",
        type: "",
        content: "",
        operSituation: "",
        operProgress: "",
        operRate: "",
        planFinishTime: "",
        degree: "",
        ord: "",
        solution: ""
      },
      weekObj: {
        monday: "",
        sunday: ""
      },
      rules: {},
      stageInfo: ProjectInfo.stageInfo,
      progressInfo: ProjectInfo.progressInfo,
      stateInfo: ProjectInfo.projectState,
      refreshDisable: false,
      unhandlerVisible: false,
      unhandlerPapers: [],
      fullscreenLoading: false,
      isSubmit: false
    };
  },
  components: { ThisWeekJob, OtherJob, QuestionJob, NextWeekJob, FittedJob },
  methods: {
    clickProject(data) {
      if (typeof data.children === "undefined") {
        this.projectForm = data;
        this.loadWeekPaperInfo();
      }
    },
    loadUserList() {
      var callback = res => {
        var data = common.handerData(res, this);
        this.userList = data;
      };
      common.get("user/getList", {}, callback);
    },
    loadProjectList() {
      var callback = res => {
        var data = common.handerData(res, this);
        if (data == null || typeof data === "undefined") {
          return;
        }
        this.projectList = data.records;
        this.projectTree = ProjectInfo.convertToTreeData(this.projectList, 0);
      };
      common.get(
        "project/getList",
        {
          page: this.page,
          pageSize: this.pageSize,
          jnum: this.jnum,
          projectName: this.projectName
        },
        callback
      );
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.projectName.indexOf(value) !== -1;
    },
    addOne() {
      if (!this.projectForm.projectId) {
        this.$message({
          message: "请选择一个项目",
          type: "warn"
        });
        return;
      }
      this.$confirm("此操作将保存该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          var details = [];
          this.setToList(details, this.$refs.thisWeekJob.jobs);
          this.setToList(details, this.$refs.otherJob.jobs);
          this.setToList(details, this.$refs.questionJob.jobs);
          this.setToList(details, this.$refs.nextWeekJobList.jobs);
          this.setToList(details, this.$refs.fittedJobList.jobs);
          var param = common.copyObj(this.paperForm);
          param.details = details;
          param.projectId = this.projectForm.projectId;
          param.projectName = this.projectForm.projectName;
          param.week =
            typeof this.week === "string"
              ? this.week
              : common.dateFormat("yyyy-MM-dd HH:mm:ss", this.week);
          var callback = res => {
            var msg = common.getMsg(res, this);
            this.$message({
              message: msg,
              type: "success"
            });
            this.loadWeekPaperInfo();
          };
          common.postBody("weekPaper/setOnePaper", param, callback);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消保存"
          });
        });
    },
    downloadPaper() {
      this.$confirm("此操作将比较耗时, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          var w = typeof this.week === "string"
                ? this.week
                : common.dateFormat("yyyy-MM-dd HH:mm:ss", this.week)
          var param = {
            week: w
          };
          var fileName = "项目周报" +  w + ".zip";
          common.getDownload("weekPaper/downPaper",param,fileName,this);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消下载"
          });
        });
    },
    downloadSummary() {
      this.$confirm("此操作将比较耗时, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          var w = typeof this.week === "string"
                ? this.week
                : common.dateFormat("yyyy-MM-dd HH:mm:ss", this.week)
          var param = {
            week: w
          };
          var fileName = "项目周报" +  w + ".docx";
          common.getDownload("weekPaper/downloadSummary",param,fileName,this);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消下载"
          });
        });
    },
    setToList(list, details) {
      for (let i = 0; i < details.length; i++) {
        let content = details[i].content;
        if (
          content === null ||
          typeof content === "undefined" ||
          content.trim() === ""
        ) {
          continue;
        }
        list.push(details[i]);
      }
    },
    setForm(form) {
      var callback = res => {
        var msg = common.getMsg(res, this);
        this.$message({
          message: msg,
          type: "success"
        });
        this.loadProjectList();
        this.$refs.projectForm.resetFields();
        this.projectFormVisible = false;
      };
      common.post("project/setOneProject", this.projectForm, callback);
    },
    changeWeek(v) {
      this.getMondyAndSundayStr();
      this.loadWeekPaperInfo();
    },
    refresh() {
      this.refreshDisable = true;
      setTimeout(() => {
        this.refreshDisable = false;
      }, 2000);
      this.loadProjectList();
    },
    getNameByJnum(jnum) {
      for (let i = 0; i < this.userList.length; i++) {
        if (jnum == this.userList[i].jnum) {
          return this.userList[i].userName;
        }
      }
      return "";
    },
    loadUserList() {
      var callback = res => {
        var data = common.handerData(res, this);
        this.userList = data;
      };
      common.get("user/getList", {}, callback);
    },
    loadWeekPaperInfo() {
      if(this.projectForm.projectId === ''){
        return;
      }
      var param = {
        week:
          typeof this.week === "string"
            ? this.week
            : common.dateFormat("yyyy-MM-dd HH:mm:ss", this.week),
        projectId: this.projectForm.projectId
      };
      var callback = res => {
        var data = common.handerData(res, this);
        console.log(data);
        if(data == null){
          this.isSubmit = true;
        }else {
          this.isSubmit = false;
        }
        this.thisWeekJobList = [];
        this.otherJobList = [];
        this.questionJobList = [];
        this.nextWeekJobList = [];
        this.fittedJobList = [];
        if (data === null) {
          this.paperForm = {
            weekId: "",
            projectId: this.projectForm.projectId,
            projectName: this.projectForm.projectName,
            engineerName: "",
            workHours: ""
          };
          return;
        }
        this.paperForm = {
          weekId: data.weekId,
          projectId: data.projectId,
          projectName: data.projectName,
          engineerName: data.engineerName,
          workHours: data.workHours
        };
        var details = data.details;
        if (details != null && typeof details !== "undefined") {
          for (let i = 0; i < details.length; i++) {
            switch (details[i].type) {
              case "1":
                this.thisWeekJobList.push(details[i]);
                break;
              case "2":
                this.otherJobList.push(details[i]);
                break;
              case "3":
                this.questionJobList.push(details[i]);
                break;
              case "4":
                this.nextWeekJobList.push(details[i]);
                break;
              case "5":
                this.fittedJobList.push(details[i]);
                break;
            }
          }
        }
      };
      common.get("weekPaper/getOne", param, callback);
    },
    getMondyAndSundayStr() {
      var now;
      if (typeof this.week === "string") {
        now = new Date(this.week.slice(0, 10).replace(/-/g, "/"));
      } else {
        now = this.week;
      }
      let mon = common.getFirstDayOfWeek(now);
      let sun = new Date(mon.getFullYear(), mon.getMonth(), mon.getDate() + 6);
      this.weekObj.monday = common.dateFormat("yyyy-MM-dd", mon);
      this.weekObj.sunday = common.dateFormat("yyyy-MM-dd", sun);
    },
    unhandlerPaper() {
      var param = {
        week:
          typeof this.week === "string"
            ? this.week
            : common.dateFormat("yyyy-MM-dd HH:mm:ss", this.week)
      };
      var callback = res => {
        var data = common.handerData(res, this);
        console.log(data);
        this.unhandlerPapers = data;
        this.unhandlerVisible = true;
      };
      common.get("weekPaper/unhandlerPaper", param, callback);
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  mounted() {
    this.loadProjectList();
    this.loadUserList();
    this.getMondyAndSundayStr();
  }
};
</script>
<style lang="scss" scoped>
.bigContainer {
  background-color: cornsilk;
  height: 100%;
  margin-top: 10px;
  margin-left: 10px;
  .el-aside {
    height: 100%;
    background-color: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  }
}

.projectMain {
  margin-left: 20px;
  margin-right: 20px;
  height: 100%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  background-color: white;
  .el-form {
    min-width: 670px;
  }
  .el-button {
    position: absolute;
    right: 60px;
  }
  .el-form-item {
    border-radius: 0px;
    border: 1px solid black;
  }
}

.projectHead {
  margin-top: 10px;
  .el-button-group {
    position: absolute;
    right: 20px;
  }
}

.el-tree-node:focus > .el-tree-node__content {
  background-color: wheat !important;
}

.paperTitle {
  font-size: 30px;
  text-align: center;
  margin-bottom: 20px;
  font-weight: bold;
}

.scTitle {
  font-size: 20px;
  text-align: center;
  margin-top: 10px;
  margin-bottom: 10px;
  min-width: 670px;
  font-weight: bold;
  height: 40px;
}

.titleColor {
  color: red
}
</style>