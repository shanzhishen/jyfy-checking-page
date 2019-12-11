<template>
  <el-row class="container">
    <el-col :span="24" class="header">
      <el-date-picker v-model="factor.day" type="date" placeholder="选择日期" value-format="yyyyMMdd"></el-date-picker>
      <el-select v-model="factor.jnum" placeholder="请选择" style="width:150px">
        <el-option value>请选择</el-option>
        <el-option
          v-for="item in userList"
          :key="item.jnum"
          :label="item.userName"
          :value="item.jnum"
        ></el-option>
      </el-select>
      <el-button-group>
        <el-button type="primary" round icon="el-icon-search" @click.native="loadStudyList">查询</el-button>
        <el-button type="success" round icon="el-icon-plus" @click.native="addOneStudy">新增</el-button>
        <el-button type="danger" round icon="el-icon-minus" @click.native="delOneStudy">删除</el-button>
      </el-button-group>
    </el-col>
    <el-col :span="24" class="main">
      <template>
        <el-table
          :data="studyList"
          stripe
          style="width: 95%"
          border
          :header-cell-style="{'text-align': 'center',background:'rgba(240, 182, 162, 0.555)',color:'#555'}"
          highlight-current-row
          :height="tableHeight"
          @row-click="rowClick"
        >
          <el-table-column type="index" width="50" align="center"></el-table-column>
          <el-table-column prop="id" label="id" width="100" align="center" v-if="false"></el-table-column>
          <el-table-column prop="title" label="题目" show-overflow-tooltip width="250" align="left"></el-table-column>
          <el-table-column prop="speakDate" label="会议日期" width="100" align="left"></el-table-column>
          <el-table-column prop="speakerJnum" label="工号" width="100" align="center"></el-table-column>
          <el-table-column prop="speakerName" label="主讲人" width="100" align="center"></el-table-column>
          <el-table-column prop="perScore" label="平均分" width="120" align="center"></el-table-column>
          <el-table-column prop="num" label="打分人数" width="120" align="center"></el-table-column>
          <el-table-column prop="remark" label="备注" show-overflow-tooltip align="left"></el-table-column>
          <el-table-column label="操作" width="180" align="center">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click.native="editStudy(scope.row)">编辑</el-button>
              <el-button @click.native="watchDetail(scope.row)" type="text" size="small">详情</el-button>
              <el-button @click.native="calScore(scope.row)" type="text" size="small" :disabled="scope.row.state==10">计算</el-button>
            </template>
          </el-table-column>
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
    <!-- 新增一个 -->
    <el-dialog :title="formType=='add'?'新增':'修改'" :visible.sync="studyFormVisible">
      <el-form :model="studyForm" :rules="rules" ref="studyForm">
        <el-form-item label="id" label-width="100px" prop="id" v-if="false">
          <el-input v-model="studyForm.id" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="主题" label-width="100px" prop="title">
          <el-input v-model="studyForm.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="主讲人" label-width="100px" prop="speakerJnum">
          <el-select v-model="studyForm.speakerJnum" placeholder="请选择" @change="changeUser">
            <el-option
              v-for="item in userList"
              :key="item.jnum"
              :label="item.userName"
              :value="item.jnum"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="会议日期" label-width="100px" prop="speakDate">
          <el-date-picker
            v-model="studyForm.speakDate"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="备注" label-width="100px" prop="remark">
          <el-input v-model="studyForm.remark" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="状态" label-width="100px" prop="state">
          <el-select v-model="studyForm.state" placeholder="请选择"  @change="chageState">
            <el-option
              v-for="item in studyState"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="studyFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click.native="submitForm('studyForm')"
          v-if="formType==='add'"
        >增 加</el-button>
        <el-button type="primary" @click.native="setForm('studyForm')" v-if="formType==='set'">修 改</el-button>
      </div>
    </el-dialog>
    <el-dialog title="详情" :visible.sync="detailVisible">
      未打分人员：
      <span
        v-for="(item, index) in detailForm.notSendUser"
        :key="index"
      >{{item.username}}, &nbsp;</span>
      <br />分数：
      <span>{{detailForm.scores || '0'}}</span>
    </el-dialog>
  </el-row>
</template>
<script>
import common from "../../assets/js/common.js";
export default {
  data() {
    return {
      studyList: [],
      userList: [],
      studyForm: {
        id: "",
        title: "",
        speakerJnum: "",
        speakerName: "",
        speakDate: "",
        remark: "",
        state: ""
      },
      detailForm: {
        notSendUser: [],
        num: "",
        scores: ""
      },
      factor: {
        jnum: "",
        day: ""
      },
      currentRow: null,
      formType: "add", // set
      rules: {
        title: [{ required: true, message: "请输入主题", trigger: "blur" }],
        speakDate: [
          { required: true, message: "请选择日期", trigger: "change" }
        ],
        speakerJnum: [
          { required: true, message: "请输入工号", trigger: "change" }
        ]
      },
      studyState: [
        {
          value: "1",
          label: "开始"
        },
        {
          value: "10",
          label: "结束"
        }
      ],
      pageSize: 12,
      page: 1,
      total: 0,
      studyFormVisible: false,
      detailVisible: false,
      tableHeight: window.innerHeight - 300
    };
  },
  methods: {
    addOneStudy() {
      this.formType = "add";
      this.studyFormVisible = true;
      this.$refs.studyForm.resetFields();
    },
    currentPage(p) {
      this.page = p;
      this.loadDailyWork();
    },
    delOneStudy() {
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
            id: this.currentRow.id
          };
          var callback = res => {
            var msg = common.getMsg(res, this);
            this.$message({
              message: msg,
              type: "success"
            });
            this.loadStudyList();
          };
          common.post("businessStudy/delOneStudy", param, callback);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    loadUserList() {
      var callback = res => {
        var data = common.handerData(res, this);
        this.userList = data;
      };
      common.get("user/getList", {}, callback);
    },
    editStudy(row) {
      this.formType = "set";
      this.studyForm = {
        id: row.id,
        title: row.title,
        speakerJnum: row.speakerJnum,
        speakerName: row.speakerName,
        speakDate: row.speakDate,
        remark: row.remark,
        state: row.state
      };
      this.studyFormVisible = true;
    },
    calScore(row) {
      var param = {
        id: row.id
      };
      var callback = res => {
        var msg = common.getMsg(res, this);
        this.$message({
          message: msg,
          type: "success"
        });
        this.loadStudyList();
      };
      common.post("businessStudy/calStudyScore", param, callback);
    },
    watchDetail(row) {
      this.detailVisible = true;
      var callback = res => {
        var data = common.handerData(res, this);
        console.log(data);
        this.detailForm = data;
      };
      var param = {
        id: row.id
      };
      common.get("businessStudy/getDetailInfo", param, callback);
    },
    loadStudyList() {
      var param = {
        page: this.page,
        pageSize: this.pageSize,
        jnum: this.factor.jnum,
        day: this.factor.day
      };
      var callback = res => {
        var data = common.handerData(res, this);
        if (data === "error") {
          return;
        }
        this.studyList = data.records;
      };
      common.get("businessStudy/getList", param, callback);
    },
    changeUser(v) {
      for (let i = 0; i < this.userList.length; i++) {
        if (v === this.userList[i].jnum) {
          this.studyForm.speakerName = this.userList[i].userName;
          break;
        }
      }
    },
    chageState(v){
      this.studyForm.state = v;
    },
    rowClick(row, column, event) {
      this.currentRow = row;
    },
    submitForm(formName) {
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
            this.studyFormVisible = false;
            this.page = 1;
            this.$refs.studyForm.resetFields();
            this.loadStudyList();
          };
          common.post("businessStudy/addOneStudy", this.studyForm, callback);
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
                message: "修改成功",
                type: "success"
              });
            }
            this.studyFormVisible = false;
            this.page = 1;
            this.$refs.studyForm.resetFields();
            this.loadStudyList();
          };

          common.post("businessStudy/setOneStudy", this.studyForm, callback);
        }
      });
    }
  },
  mounted() {
    this.loadUserList();
    this.loadStudyList();
  }
};
</script>
<style lang="scss">
</style>
