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
      <span class="tips">* 应得分：不含加减分项；合计：包含加减分项</span>
      <el-button-group>
        <el-button
          type="success"
          round
          @click.native="calDetailScore"
          :loading="loading"
          :disabled="checkState==10"
        >计算每月得分</el-button>
      </el-button-group>
    </el-col>
    <el-col :span="24" class="header">
      <template>
        <el-table
          :data="detailData"
          stripe
          style="width: 95%"
          border
          :header-cell-style="{'text-align': 'center',background:'bisque',color:'#555',  border:'1px solid #777'}"
          :cell-style="cellStyle"
          highlight-current-row
          max-height="700"
          v-show="showTable"
          :height="tableHeight"
          v-loading="tableLoading"
        >
          <el-table-column prop="name" width="100" align="center" fixed></el-table-column>
          <el-table-column
            align="center"
            :label="item.date"
            min-width="300"
            v-for="(item, index) in list"
            :key="index"
          >
            <el-table-column label="月查考核(60分)">
              <el-table-column
                align="center"
                label="基础评分(50分)"
                sortable
                :prop="'basic'+item.date"
                :formatter="valLeft2"
                width="160"
              ></el-table-column>
              <el-table-column
                align="center"
                label="综合评分(10分)"
                sortable
                :prop="'comprehensive'+item.date"
                :formatter="valLeft2"
                width="160"
              ></el-table-column>
            </el-table-column>
            <el-table-column label="日常工作(30分)">
              <el-table-column
                align="center"
                label="日常得分(20分)"
                :prop="'DailyWork'+item.date"
                :formatter="valLeft2"
                width="160"
              ></el-table-column>

              <el-table-column
                align="center"
                label="加分项"
                sortable
                :prop="'add'+item.date"
                :formatter="valLeft2"
                width="120"
              ></el-table-column>
              <el-table-column
                align="center"
                label="扣分项"
                sortable
                :prop="'deduct'+item.date"
                :formatter="valLeft2"
                width="120"
              ></el-table-column>
              <el-table-column
                align="center"
                label="班次评分(10分)"
                sortable
                :prop="'Schedule'+item.date"
                :formatter="valLeft2"
                width="160"
              ></el-table-column>
            </el-table-column>
            <el-table-column
              align="center"
              label="人员互评(10分)"
              sortable
              :prop="'StaffEvaluation'+item.date"
              :formatter="valLeft2"
              width="160"
            ></el-table-column>

            <el-table-column
              align="center"
              label="应得分(不含加减分)"
              sortable
              :prop="'shouldGetScore'+item.date"
              width="180"
            ></el-table-column>
            <el-table-column align="center" label="合计" sortable :prop="'sum'+item.date" width="120"></el-table-column>
          </el-table-column>
        </el-table>
      </template>
    </el-col>
  </el-row>
</template>
<script>
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
      checkState: 0,
      checkedText: "",
      loading: false,
      tableHeight: window.innerHeight - 200,
      tableLoading: false
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
          var callback = res => {
            var msg = common.getMsg(res, this);
            if (msg != "error") {
              this.$message({
                type: "success",
                message: "计算成功!"
              });
            }
            this.loading = false;
            this.tableLoading = false;
            this.loadFinalDetaiData();
          };
          this.tableLoading = true;
          common.post(
            "cal/finalDetailScore",
            { checkId: this.checkedVal },
            callback,
            () => {
              this.tableLoading = false;
            }
          );
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
          self.checkState = item.state;
        }
      });
      this.loadFinalDetaiData();
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
    valLeft2(row, column, cellValue, index) {
      if (typeof cellValue === "undefined" || cellValue == null) {
        return "";
      }
      return cellValue.toFixed(2);
    },
    loadFinalDetaiData() {
      this.tableLoading = true;
      var callback = res => {
        var data = common.handerData(res, this);
        this.resultData = data;
        this.handlerDetailData();
        this.tableLoading = false;
      };
      var self = this;
      common.get("detailScore/get", { checkId: this.checkedVal }, callback);
    },
    handlerDetailData() {
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
                tmpData["basic" + dateItem] = obj.point;
                shouldGetScore = shouldGetScore + obj.point;
              } else if (obj.type == "10") {
                tmpData["add" + dateItem] = obj.point;
              } else if (obj.type == "11") {
                tmpData["deduct" + dateItem] = obj.point;
              } else if (obj.type == "2") {
                shouldGetScore = shouldGetScore + obj.point;
                tmpData["comprehensive" + dateItem] = obj.point;
              } else if (obj.type == "3") {
                shouldGetScore = shouldGetScore + obj.point;
                tmpData["DailyWork" + dateItem] = obj.point;
              } else if (obj.type == "4") {
                shouldGetScore = shouldGetScore + obj.point;
                tmpData["Schedule" + dateItem] = obj.point;
              } else if (obj.type == "5") {
                shouldGetScore = shouldGetScore + obj.point;
                tmpData["StaffEvaluation" + dateItem] = obj.point;
              }
            }
          }
          if (sum == 0) {
            tmpData["sum" + dateItem] = "";
          } else {
            tmpData["sum" + dateItem] = sum.toFixed(2);
          }

          if (shouldGetScore == 0) {
            tmpData["shouldGetScore" + dateItem] = "";
          } else {
            tmpData["shouldGetScore" + dateItem] = shouldGetScore.toFixed(2);
          }
        });
        self.detailData.push(tmpData);
      });
    },
    cellStyle({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        return "border: 1px solid #777;background-color: rgba(240, 182, 162, 0.555);";
      } else if (columnIndex % 9 === 0) {
        return "border: 1px solid #DDD;border-left: 1px solid #BBB;border-top: 1px solid #BBB;border-bottom: 1px solid #BBB;border-right: 1px solid #000";
      } else {
        return "border: 1px solid #BBB";
      }
    }
  },
  mounted() {
    var checkInfoList = this.$store.getters.getCheckInfo.records;
    this.checkInfo = checkInfoList;
    if (this.checkInfo.length > 0) {
      this.checkedVal = this.checkInfo[0].checkId;
      this.checkedText = this.checkInfo[0].checkName;
      this.checkState = this.checkInfo[0].state;
      this.loadFinalDetaiData();
    }
  }
};
</script>
<style lang="scss" scoped>

</style>

