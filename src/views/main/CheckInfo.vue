<template>
  <div class="container">
    <el-col :span="24" class="header">
      <el-button-group>
        <el-button type="success" icon="el-icon-plus" @click.native="addCheckInfoVisible=true">增加</el-button>
        <el-button type="danger" icon="el-icon-minus" @click.native="delCheckInfo">删除</el-button>
      </el-button-group>
      <span class="tips">* 考核开始：考核所有功能开启；开始计算：关闭月查考核、员工互评功能；考核结束：关闭计算功能</span>
    </el-col>
    <el-col :span="24" class="main">
      <template>
        <el-table
          :data="checkInfoList"
          stripe
          style="width: 95%"
          border
          :header-cell-style="{'text-align': 'center',background:'rgba(240, 182, 162, 0.555)',color:'#555'}"
          highlight-current-row
          @row-click="rowClick"
          :height="tableHeight"
        >
          <!-- @row-click="rowClick" -->
          <el-table-column prop="checkId" type="index" width="50" align="center"></el-table-column>
          <el-table-column
            prop="checkName"
            label="考核名称"
            width="300"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column prop="startDate" label="起始时间" align="center" width="150"></el-table-column>
          <el-table-column prop="endDate" label="结束时间" align="center" width="150"></el-table-column>
          <el-table-column prop="state" label="状态" width="200" align="center">
            <template slot-scope="scope">
              <el-select
                v-model="scope.row.state"
                placeholder="请选择"
                @change="changeState($event,scope.row)"
              >
                <el-option
                  v-for="item in checkStates"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="intro" label="简介" show-overflow-tooltip></el-table-column>
          <el-table-column
            prop="createTime"
            label="创建时间"
            width="200"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
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
      ></el-pagination>
    </el-col>
    <el-dialog title="新增" :visible.sync="addCheckInfoVisible" width="60%">
      <el-form ref="checkForm" :model="check" :rules="rules" label-width="100px">
        <el-form-item label="考察名称" prop="checkName">
          <el-input v-model="check.checkName"></el-input>
        </el-form-item>
        <el-form-item label="起始日期" prop="startDate">
          <el-date-picker
            v-model="check.startDate"
            type="date"
            placeholder="选择月"
            value-format="yyyyMMdd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="结束日期" prop="endDate">
          <el-date-picker
            v-model="check.endDate"
            type="date"
            placeholder="选择月"
            value-format="yyyyMMdd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="简 介">
          <el-input
            type="textarea"
            rows="4"
            placeholder="请输入内容"
            v-model="check.intro"
            size="medium"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click.native="onSubmit('checkForm')" :loading="isSubmit">立即创建</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import common from "../../assets/js/common.js";
export default {
  data() {
    return {
      checkInfoList: [],
      check: {
        checkId: -1,
        checkName: "",
        startDate: "",
        endDate: "",
        intro: "",
        state: 1
      },
      checkStates: [
        {
          value: 1,
          label: "考核开始"
        },
        {
          value: 2,
          label: "开始计算"
        },
        {
          value: 10,
          label: "考核结束"
        }
      ],
      page: 1,
      pageSize: 12,
      total: 0,
      isSubmit: false,
      rules: {
        checkName: [{ required: true, message: "请输入名称", trigger: "blur" }],
        startDate: [{ required: true, message: "请选择日期", trigger: "blur" }],
        endDate: [{ required: true, message: "请选择日期", trigger: "blur" }]
      },
      addCheckInfoVisible: false,
      currentRow: {},
      tableHeight: window.innerHeight - 320
    };
  },
  methods: {
    onSubmit(formName) {
      this.isSubmit = true;
      this.$refs[formName].validate(valid => {
        if (valid) {
          var callback = res => {
            var msg = common.getMsg(res, this);
            this.isSubmit = false;
            this.$message({
              message: msg,
              type: "success"
            });
            this.addCheckInfoVisible = false;

            // 修改store中的数据
            this.$emit("refreshCheckInfo");

            this.loadCheckInfo();

            // var checkInfo = this.$store.getters.getCheckInfo;
            // checkInfo.records.splice(0,0,self.check);
            // this.$store.dispatch('setCheckInfo',checkInfo);
          };
          common.post("checkInfo/add", this.check, callback);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    loadCheckInfo() {
      var callback = res => {
        var data = common.handerData(res, this);
        this.total = data.total;
        this.checkInfoList = data.records;
      };
      common.get(
        "checkInfo/getList",
        { page: this.page, pageSize: this.pageSize },
        callback
      );
    },
    currentPage(p) {
      this.page = p;
      this.loadCheckInfo();
    },
    rowClick(row, column, event) {
      this.currentRow = row;
    },
    delCheckInfo() {
      var row = this.currentRow;
      if (typeof row.checkId === "undefined" || row.checkId == null) {
        this.$message({
          message: "请先选择一条信息",
          type: "warning"
        });
        return;
      }
      var callback = res => {
        var msg = common.getMsg(res, this);
        this.$message({
          message: msg,
          type: "success"
        });
        // 在store中删除该条
        this.$emit("refreshCheckInfo");
        this.loadCheckInfo();
      };
      common.post("checkInfo/del",{checkId: this.currentRow.checkId},callback);
    },
    changeState(v, row) {
      var param = {
        checkId: row.checkId,
        state: v
      };
      var callback = res=>{
          var msg = common.getMsg(res, this);
          this.$message({
            message: msg,
            type: "success"
          });
          this.$emit("refreshCheckInfo");        
      }
      common.post("checkInfo/changeState", param, callback);
    }
  },
  mounted() {
    this.loadCheckInfo();
  }
};
</script>
<style lang="scss" scoped>
.container {
  background-color: #fff;
  margin: 10px;
  margin-left: 20px;
  width: 95%;
  min-width: 600px;
  min-height: 700px;
}
.el-form {
  width: 600px;
}

.header {
  margin-bottom: 10px;
  .el-button-group {
    right: 20px;
  }
}

.footer {
  text-align: center;
  margin: 5px;
}
</style>


