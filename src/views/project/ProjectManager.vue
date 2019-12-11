<template>
  <el-container class="bigContainer">
    <el-aside width="200px">
      <el-input placeholder="输入关键字进行过滤" v-model="filterText">
        <el-button slot="append" icon="el-icon-refresh" @click.native="refresh"></el-button>
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
        <el-button-group>
          <el-button type="success" icon="el-icon-plus" @click.native="addOne">增加</el-button>
          <el-button type="danger" icon="el-icon-minus" @click.native="delOneProject">删除</el-button>
        </el-button-group>
      </el-header>
      <el-main class="projectMain">
        <el-form :model="projectForm" :rules="rules" ref="projectForm">
          <el-form-item label="id" label-width="100px" prop="projectId" v-if="false">
            <el-input v-model="projectForm.projectId" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="项目名称" label-width="100px" prop="projectName">
            <el-input v-model="projectForm.projectName" autocomplete="off" style="width:500px"></el-input>
          </el-form-item>
          <el-form-item label="项目归属" label-width="100px" prop="pid">
            <el-select v-model="projectForm.pid" placeholder="请选择">
              <el-option value="0" label="无"></el-option>
              <el-option
                v-for="item in projectIds"
                :key="item.projectId"
                :label="item.projectName"
                :value="item.projectId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="项目阶段" label-width="100px" prop="stage">
            <el-select v-model="projectForm.stage" placeholder="请选择">
              <el-option
                v-for="item in stageInfo"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="项目进度" label-width="100px" prop="progress">
            <el-select v-model="projectForm.progress" placeholder="请选择">
              <el-option
                v-for="item in progressInfo"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态" label-width="100px" prop="state">
            <el-select v-model="projectForm.state" placeholder="请选择">
              <el-option
                v-for="item in stateInfo"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="负责人1" label-width="100px" prop="jnum1">
            <el-select v-model="projectForm.jnum1" placeholder="请选择">
              <el-option
                v-for="item in userList"
                :key="item.jnum"
                :label="item.userName"
                :value="item.jnum"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="负责人2" label-width="100px" prop="jnum2">
            <el-select v-model="projectForm.jnum2" placeholder="请选择">
              <el-option
                v-for="item in userList"
                :key="item.jnum"
                :label="item.userName"
                :value="item.jnum"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="负责人3" label-width="100px" prop="jnum3">
            <el-select v-model="projectForm.jnum3" placeholder="请选择">
              <el-option
                v-for="item in userList"
                :key="item.jnum"
                :label="item.userName"
                :value="item.jnum"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-button
            type="primary"
            @click.native="addOneProject('projectForm')"
            v-if="formType==='add'"
          >保 存</el-button>
          <el-button
            type="primary"
            @click.native="setForm('projectForm')"
            v-if="formType==='set'"
          >修 改</el-button>
        </el-form>
        <!-- <el-button @click="projectFormVisible = false">取 消</el-button> -->
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import Data from "@/assets/js/data.js";
import common from "@/assets/js/common.js";
import ProjectInfo from "@/assets/js/projectInfo.js";
export default {
  data() {
    return {
      filterText: "",
      userList: [],
      currentProject: {
        projectId: "",
        projectName: "",
        pid: ""
      },
      projectIds: [],
      week: new Date(),
      projectTree: [],
      projectList: [],
      currentRow: null,
      defaultProps: {
        children: "children",
        label: "projectName"
      },
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
      formType: "add",
      stageInfo: ProjectInfo.stageInfo,
      progressInfo: ProjectInfo.progressInfo,
      stateInfo: ProjectInfo.projectState,
      rules: {}
    };
  },
  methods: {
    clickProject(data) {
      this.projectForm = common.copyObj(data);
      this.formType = "set";
      this.currentRow = data;
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
    loadProjectId() {
      var callback = res => {
        var data = common.handerData(res, this);
        this.projectIds = data;
      };
      common.get("project/getProjectId", {
        pid: "0"
      }, callback);
    },
    addOne() {
      this.formType = "add";
      this.$refs.projectForm.resetFields();
      // this.loadProjectList();
    },
    addOneProject(form) {
      var callback = res => {
        var msg = common.getMsg(res, this);
        this.$message({
          message: msg,
          type: "success"
        });
        this.$refs.projectForm.resetFields();
        this.loadProjectList();
        this.loadProjectId();
      };
      common.post("project/addOneProject", this.projectForm, callback);
    },
    delOneProject() {
      if (this.currentRow == null) {
        this.$message({
          type: "danger",
          message: "请选中一行"
        });
        return;
      }
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          var param = {
            id: this.currentRow.projectId
          };
          var callback = res => {
            var msg = common.getMsg(res, this);
            this.$message({
              message: msg,
              type: "success"
            });
            this.loadProjectList();
            this.$refs.projectForm.resetFields();
          };
          common.post("project/delOneProject", param, callback);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
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
    refresh() {
      this.loadProjectList();
      this.loadUserList();
      this.loadProjectId();
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
    this.loadProjectId();
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
  .el-button {
    position: absolute;
    right: 60px;
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
</style>