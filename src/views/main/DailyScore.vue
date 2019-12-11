<template>
  <el-row class="container">
    <el-col :span="24" class="header">
      <!-- <el-select v-model="checkedVal" placeholder="请选择" style="width:220px">
        <el-option
          v-for="(item,index) in checkInfo"
          :key="index"
          :label="item.checkName"
          :value="item.checkId"
        ></el-option>
      </el-select>-->
      <el-date-picker
        v-model="dateRange"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyyMMdd"
      ></el-date-picker>
      <el-select v-model="clickType" placeholder="请选择类型">
        <el-option label="请选择" value></el-option>
        <el-option
          v-for="item in dailyType"
          :key="item.type"
          :label="item.typeName"
          :value="item.type"
        ></el-option>
      </el-select>
      <!-- <el-input v-model="jnum" placeholder="工号" style="width:150px"></el-input> -->
      <el-select v-model="jnum" placeholder="请选择" style="width:150px">
        <el-option value>请选择</el-option>
        <el-option
          v-for="item in userList"
          :key="item.jnum"
          :label="item.userName"
          :value="item.jnum"
        ></el-option>
      </el-select>
    </el-col>
    <el-col :span="24" class="header">
      <span style="font-size:5px;color:red">* 如果通过excel上传的数据出现错误，建议修改excel后重新上传</span>
      <el-button-group>
        <el-button
          type="primary"
          round
          @click.native="selWork"
          @keyup.enter.native="selWork()"
          icon="el-icon-search"
        >查询</el-button>
        <el-button type="success" round @click.native="addWork" icon="el-icon-plus">新增</el-button>
        <el-button type="danger" round @click.native="delWork" icon="el-icon-minus">删除</el-button>
      </el-button-group>
    </el-col>
    <el-col :span="24" class="main">
      <template>
        <el-table
          :data="daylyData"
          stripe
          style="width: 95%"
          :height="tableHeight"
          border
          :header-cell-style="{'text-align': 'center',background:'rgba(240, 182, 162, 0.555)',color:'#555'}"
          highlight-current-row
          @row-click="rowClick"
          @row-dblclick="rowDbclick"
        >
          <el-table-column type="index" width="50" align="center"></el-table-column>
          <el-table-column prop="id" label="id" width="100" align="center" v-if="false"></el-table-column>
          <el-table-column prop="jnum" label="工号" width="100" align="center"></el-table-column>
          <el-table-column prop="userName" label="名称" width="100" align="center"></el-table-column>
          <el-table-column prop="intro" label="标题" show-overflow-tooltip width="300" align="left"></el-table-column>
          <el-table-column prop="points" label="得分" width="120" align="center"></el-table-column>
          <el-table-column prop="typeName" label="得分类型" width="120" align="center"></el-table-column>
          <el-table-column
            prop="day"
            label="申请日期"
            width="120"
            align="center"
            :formatter="dayFormatter"
          ></el-table-column>
          <el-table-column prop="applyJnum" label="申请人工号" width="120" align="center"></el-table-column>
          <el-table-column prop="applyName" label="申请人姓名" width="120" align="center"></el-table-column>
          <el-table-column prop="inf1" label="备注1" show-overflow-tooltip align="center"></el-table-column>
          <el-table-column prop="inf2" label="备注2" show-overflow-tooltip align="center"></el-table-column>
        </el-table>
      </template>
    </el-col>
    <el-col :span="24" class="footer">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="pageSize"
        @current-change="currentPage"
        :current-page="page"
      ></el-pagination>
    </el-col>

    <el-dialog title="日常得分" :visible.sync="dailyFormVisible" :modal="formModel">
      <el-form :model="dailyForm" :rules="rules" ref="dailyForm">
        <el-form-item label="id" label-width="100px" prop="id" v-if="false">
          <el-input v-model="dailyForm.id" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="标题" label-width="100px" prop="intro">
          <el-input v-model="dailyForm.intro" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="得分" label-width="100px" prop="points">
          <el-input-number v-model="dailyForm.points" :min="-5" :max="5" :step="0.5"></el-input-number>
        </el-form-item>
        <el-form-item label="日期" label-width="100px" prop="day1">
          <el-date-picker
            v-model="dailyForm.day1"
            type="date"
            placeholder="选择日期"
            value-format="yyyyMMdd"
          ></el-date-picker>
        </el-form-item>

        <el-form-item label="姓名" label-width="100px" prop="jnum">
          <el-select v-model="dailyForm.jnum" placeholder="请选择" @change="changeUser">
            <el-option
              v-for="item in userList"
              :key="item.jnum"
              :label="item.userName"
              :value="item.jnum"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类型" label-width="100px" prop="type">
          <el-select v-model="dailyForm.type" placeholder="请选择类型" @change="formTypeChange">
            <el-option
              v-for="item in dailyType"
              :key="item.type"
              :label="item.typeName"
              :value="item.type"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="申请人姓名" label-width="100px" prop="applyJnum">
          <el-select v-model="dailyForm.applyJnum" placeholder="请选择" @change="changeApply">
            <el-option value>请选择</el-option>
            <el-option
              v-for="item in userList"
              :key="item.jnum"
              :label="item.userName"
              :value="item.jnum"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注1" label-width="100px" prop="inf1">
          <el-input v-model="dailyForm.inf1" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注2" label-width="100px" prop="inf2">
          <el-input v-model="dailyForm.inf2" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dailyFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="subminForm('dailyForm')" v-if="formType==='add'">增 加</el-button>
        <el-button type="primary" @click="setForm('dailyForm')" v-if="formType==='set'">修 改</el-button>
      </div>
    </el-dialog>
  </el-row>
</template>
<script>
import common from "../../assets/js/common.js";
export default {
  data() {
    return {
      checkInfo: [],
      checkedVal: "",
      userScore: [],
      dateRange: [],
      jnum: "",
      daylyData: [],
      dailyType: [],
      clickType: "",
      total: 0,
      pageSize: 12,
      page: 1,
      dailyFormVisible: true,
      clickRow: null,
      dailyForm: {
        id: "",
        intro: "",
        points: 0,
        day1: "",
        jnum: "",
        userName: "",
        type: "",
        typeName: "",
        applyJnum: "",
        applyName: "",
        inf1: "",
        inf2: ""
      },
      formType: "add",
      rules: {
        intro: [{ required: true, message: "请输入标题", trigger: "blur" }],
        day1: [{ required: true, message: "请选择日期", trigger: "change" }],
        jnum: [{ required: true, message: "请输入工号", trigger: "change" }],
        type: [{ required: true, message: "请选择类型", trigger: "change" }]
      },
      tableHeight: window.innerHeight - 320,
      userList: [],
      formModel: false
    };
  },
  methods: {
    selWork() {
      this.page = 1;
      this.loadDailyWork();
    },
    addWork() {
      this.formType = "add";
      var self = this;
      self.dailyFormVisible = true;
      if (typeof self.$refs.dailyForm !== "undefined") {
        self.$nextTick(() => {
          self.$refs.dailyForm.resetFields();
          self.dailyForm.userName = "";
          self.dailyForm.applyName = "";
        });
      }
    },
    delWork() {
      this.clickRow.day += " 00:00:00";
      if (this.clickRow == null) {
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
          this.delRow();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    delRow() {
      var callback = res => {
        var msg = common.handerData(res, this);
        if (msg != "error") {
          this.$message({
            message: "删除成功",
            type: "success"
          });
        }
        this.loadDailyWork();
      };
      common.post("daily/del", this.clickRow, callback);
    },
    rowClick(row, column, event) {
      this.clickRow = row;
    },
    rowDbclick(row, column, event) {
      this.dailyForm.id = row.id;
      this.dailyForm.day1 = (row.day == null ? "" : row.day).replace(/-/g, "");
      this.dailyForm.jnum = row.jnum;
      this.dailyForm.userName = row.userName;
      this.dailyForm.points = row.points;
      this.dailyForm.intro = row.intro;
      this.dailyForm.type = row.type;
      this.dailyForm.typeName = row.typeName;
      this.dailyForm.inf1 = row.inf1;
      this.dailyForm.inf2 = row.inf2;
      this.dailyForm.applyJnum = row.applyJnum;
      this.dailyForm.applyName = row.applyName;
      this.dailyFormVisible = true;
      this.formType = "set";
    },
    subminForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var callback = res => {
            var msg = common.handerData(res, this);
            if (msg != "error") {
              this.$message({
                message: "保存成功",
                type: "success"
              });
            }
            this.dailyFormVisible = false;
            this.page = 1;
            this.loadDailyWork();
            this.$nextTick(() => {
              this.$refs.dailyForm.resetFields();
              this.dailyForm.userName = "";
              this.dailyForm.applyName = "";
            });
          };
          common.post("daily/add", this.dailyForm, callback);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    setForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var callback = res => {
            var msg = common.handerData(res, this);
            if (msg != "error") {
              this.$message({
                message: "保存成功",
                type: "success"
              });
            }
            this.dailyFormVisible = false;
            this.page = 1;
            this.loadDailyWork();
            this.$nextTick(() => {
              this.$refs.dailyForm.resetFields();
              this.dailyForm.userName = "";
              this.dailyForm.applyName = "";
            });
          };
          common.post("daily/set", this.dailyForm, callback);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 获取选择的typename
    formTypeChange(val) {
      var obj = {};
      obj = this.dailyType.find(item => {
        return item.type == val;
      });
      this.dailyForm.typeName = obj.typeName;
    },
    loadDailyType() {
      var callback = res => {
        var data = common.handerData(res, this);
        this.dailyType = data;
      };
      common.get("daily/getType", {}, callback);
    },
    currentPage(p) {
      this.page = p;
      this.loadDailyWork();
    },
    loadDailyWork() {
      var param = {
        page: this.page,
        pageSize: this.pageSize
      };

      if (this.dateRange != null && this.dateRange.length == 2) {
        param.start = this.dateRange[0];
        param.end = this.dateRange[1];
      }

      if (this.jnum != "") {
        param.jnum = this.jnum;
      }

      if (this.clickType != "") {
        param.type = this.clickType;
      }
      var callback = res => {
        var data = common.handerData(res, this);
        this.total = data.total;
        this.daylyData = data.records;
      };
      common.get("daily/get", param, callback);
    },
    dayFormatter(row, column) {
      if (row.type === 6) {
        return row.day.substr(0, 7);
      } else {
        return row.day;
      }
    },
    loadUserList() {
      var callback = res => {
        var data = common.handerData(res, this);
        this.userList = data;
      };
      common.get("user/getList", {}, callback);
    },
    changeUser(v) {
      for (let i = 0; i < this.userList.length; i++) {
        if (v === this.userList[i].jnum) {
          this.dailyForm.userName = this.userList[i].userName;
          break;
        }
      }
    },
    changeApply(v) {
      for (let i = 0; i < this.userList.length; i++) {
        if (v === this.userList[i].jnum) {
          this.dailyForm.applyName = this.userList[i].userName;
          break;
        }
      }
    }
  },

  mounted() {
    this.loadDailyType();
    this.loadDailyWork();
    this.loadUserList();
    this.dailyFormVisible = false;
    this.formModel = true;
  }
};
</script>
<style lang="scss" scoped>
.container {
  background-color: #fff;
  margin: 10px;
  margin-left: 20px;
  width: 95%;
  height: 100%;
  min-width: 800px;
  min-height: 500px;
}
.header {
  margin-bottom: 10px;
  height: 40px;
  > * {
    margin-right: 40px;
  }
}

.el-button-group {
  position: absolute;
  right: 10px;
}

.footer {
  text-align: center;
  margin: 5px;
}
</style>