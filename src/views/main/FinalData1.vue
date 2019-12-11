<template>
  <el-row class="container">
    <el-col :span="24" class="header">
      <el-select
        v-model="checkedVal"
        placeholder="请选择"
        style="width:300px"
        @change="checkInfoChange"
      >
        <el-option
          v-for="(item,index) in checkInfo"
          :key="index"
          :label="item.checkName"
          :value="item.checkId"
        ></el-option>
      </el-select>
      <el-button-group>
        <el-button type="success" round @click.native="calDetailScore" :loading="loading">计算总得分</el-button>
      </el-button-group>
    </el-col>
    <el-col :span="24" class="header">
      <template>
        <el-table
          :data="detailData"
          style="width: 95%;"
          border
          :header-cell-style="{'text-align': 'center',background:'bisque',color:'#555',  border:'1px solid #777'}"
          :cell-style="cellStyle"
          :row-style="rowStyle"
          max-height="700"
          :height="tableHeight"
          v-show="showTable"
          highlight-current-row
        >
          <el-table-column prop="name" width="100" align="center" fixed></el-table-column>
          <el-table-column label="月查考核(60分)">
            <el-table-column align="center" label="基础评分(50分)" sortable :prop="'basic'" width="160"></el-table-column>
            <el-table-column
              align="center"
              label="综合评分(20分)"
              sortable
              :prop="'comprehensive'"
              width="160"
            ></el-table-column>
          </el-table-column>
          <el-table-column label="日常工作(30分)">
            <el-table-column align="center" label="日常工作评分(20分)" :prop="'DailyWork'" width="160"></el-table-column>
            <el-table-column align="center" label="加分项" sortable :prop="'add'" width="120"></el-table-column>
            <el-table-column align="center" label="扣分项" sortable :prop="'deduct'" width="120"></el-table-column>
            <el-table-column
              align="center"
              label="班次评分(10分)"
              sortable
              :prop="'Schedule'"
              width="160"
            ></el-table-column>
          </el-table-column>
          <el-table-column
            align="center"
            label="人员互评(10分)"
            sortable
            :prop="'StaffEvaluation'"
            width="160"
          ></el-table-column>
          <el-table-column
            align="center"
            label="应得分(不含加减分)"
            sortable
            :prop="'shouldGetScore'"
            width="180"
          ></el-table-column>
          <el-table-column align="center" label="合计" sortable :prop="'sum'" width="100"></el-table-column>
        </el-table>
      </template>
    </el-col>
  </el-row>
</template>
<script>
import Data from "../../assets/js/data.js";
import common from "../../assets/js/common.js";
export default {
  data() {
    return {
      list: [],
      detailData: [],
      resultData: [],
      showTable: false,
      checkInfo: [],
      checkedVal: 0,
      checkedText: "",
      loading: false,
      tableHeight: window.innerHeight - 150
    };
  },
  methods: {
    calDetailScore() {
      this.loading = true;
      var self = this;
      this.$confirm(
        "您确定是否要计算 " + this.checkedText + " 的每月分数？",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          this.$axios
            .post(common.serverPath + "cal/finalScore", {
              params: {
                checkId: self.checkedVal
              }
            })
            .then(function(response) {
              var data = common.handerData(response, self);
              self.$message({
                type: "success",
                message: "计算成功!"
              });
              self.loading = false;
              self.loadFinalData();
            })
            .catch(function(error) {
              console.log(error);
              self.loading = false;
            });
        })
        .catch(() => {
          this.loading = false;
        });
    },
    checkInfoChange(v) {
      var self = this;
      this.checkInfo.forEach(function(item, index) {
        if (v === item.checkId) {
          self.checkedText = item.checkName;
        }
      });

      this.loadFinalData();
    },
    sortDate(a, b) {
      var aDate = new Date(a.date);
      var bDate = new Date(b.date);
      return aDate.getTime() - bDate.getTime();
    },
    checkDealData(type) {
      switch (type) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
        case 10:
        case 11:
          return true;
        default:
          return false;
      }
    },
    loadFinalData() {
      var self = this;
      this.$axios
        .get(common.serverPath + "finalScore/get", {
          params: {
            checkId: self.checkedVal
          }
        })
        .then(function(response) {
          var data = common.handerData(response, self);
          self.resultData = data;
          self.handlerFinalData();
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    handlerFinalData() {
      var self = this;
      self.showTable = true;
      //   this.resultData = [];
      let dateMap = new Map();
      let noMap = new Map();
      for (let i = 0; i < this.resultData.length; i++) {
        let obj = this.resultData[i];
        if (!self.checkDealData(obj.type)) {
          this.resultData.splice(i, 1);
          i--;
        } else {
          dateMap.set(obj.month, obj.month);
          noMap.set(obj.jnum, obj.userName);
        }
      }
      self.list = [];
      self.detailData = [];

      dateMap.forEach(function(dateItem, dateKey, dateMapObj) {
        self.list.push({ date: dateItem });
      });
      self.list.sort(self.sortDate);

      noMap.forEach(function(noItem, noKey, noMapObj) {
        let tmpData = {};
        tmpData.name = noItem;
        dateMap.forEach(function(dateItem, dateKey, dateMapObj) {
          var sum = 0;
          var shouldGetScore = 0;
          for (let i = 0; i < self.resultData.length; i++) {
            let obj = self.resultData[i];

            if (obj.jnum == noKey && obj.month == dateItem) {
              sum = sum + obj.point;
              if (obj.type == "1") {
                tmpData["basic"] = obj.point;
                shouldGetScore = shouldGetScore + obj.point;
              } else if (obj.type == "10") {
                tmpData["add"] = obj.point;
              } else if (obj.type == "11") {
                tmpData["deduct"] = obj.point;
              } else if (obj.type == "2") {
                shouldGetScore = shouldGetScore + obj.point;
                tmpData["comprehensive"] = obj.point;
              } else if (obj.type == "3") {
                shouldGetScore = shouldGetScore + obj.point;
                tmpData["DailyWork"] = obj.point;
              } else if (obj.type == "4") {
                shouldGetScore = shouldGetScore + obj.point;
                tmpData["Schedule"] = obj.point;
              } else if (obj.type == "5") {
                shouldGetScore = shouldGetScore + obj.point;
                tmpData["StaffEvaluation"] = obj.point;
              }
            }
          }
          tmpData["sum"] = sum.toFixed(2);
          tmpData["shouldGetScore"] = shouldGetScore.toFixed(2);
        });
        self.detailData.push(tmpData);
      });
    },
    cellStyle({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        return "border: 1px solid #777;background-color: rgba(240, 182, 162, 0.555);";
      } else {
        return "border: 1px solid #BBB";
      }
    },
    rowStyle ({ row, rowIndex }) {
      if (row.sum < 85) {
        return "background: rgb(252, 202, 194); color: #000";
      }else {
        return "color: #000";
      }
    }
  },
  mounted() {
    var checkInfoList = this.$store.getters.getCheckInfo.records;
    this.checkInfo = checkInfoList;
    if (this.checkInfo.length > 0) {
      this.checkedVal = this.checkInfo[0].checkId;
      this.checkedText = this.checkInfo[0].checkName;
      this.loadFinalData();
    }
  }
};
</script>
<style lang="scss" scoped>
.container {
  background-color: #fff;
  margin: 10px;
  margin-left: 20px;
  width: 95%;
  height: 1200px;
  min-width: 600px;
  min-height: 700px;
}
.header {
  margin-bottom: 10px;
  .el-button-group {
    position: absolute;
    right: 20px;
  }
}

.warning-row {
  background: rgb(252, 202, 194);
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>

