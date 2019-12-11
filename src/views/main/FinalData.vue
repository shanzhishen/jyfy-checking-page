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
      <span style="font-size:5px;color:red">* 应得分：不含加减分项；合计：包含加减分项</span>
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
        >
          <el-table-column prop="name" width="100" align="center" fixed></el-table-column>
          <el-table-column
            align="center"
            :label="item.date"
            min-width="300"
            v-for="(item, index) in list"
            :key="index"
          >
            <el-table-column
              align="center"
              label="应得分"
              sortable
              :prop="'basic'+item.date"
              :formatter="valLeft2"
              width="160"
            ></el-table-column>
            <el-table-column
              align="center"
              label="合计得分"
              sortable
              :prop="'comprehensive'+item.date"
              :formatter="valLeft2"
              width="160"
            ></el-table-column>
          </el-table-column>
          <el-table-column
            align="center"
            label="应得分(不含加减分)"
            sortable
            :prop="'shouldGetScore'"
            width="180"
          ></el-table-column>
          <el-table-column align="center" label="合计" sortable :prop="'sum'" width="120"></el-table-column>
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
      tableHeight: window.innerHeight - 200,
      tableLoading: false
    };
  },
  methods: {
    checkInfoChange(v) {
      var self = this;
      this.checkInfo.forEach(function(item, index) {
        if (v === item.checkId) {
          self.checkedText = item.checkName;
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
        case 8:
        case 9:
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
      var param = {
        checkId: this.checkedVal,
        types: "8,9"
      };
      common.get("detailScore/get", param, callback);
    },
    handlerDetailData() {
      var self = this;
      self.showTable = true;
      //   this.resultData = [];
      let timesMap = new Map();
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

          let a = timesMap.get(obj.jnum);
          if (typeof a === "undefined") {
            timesMap.set(obj.jnum, 1);
          } else {
            timesMap.set(obj.jnum, ++a);
          }
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
        var sum = 0;
        var shouldGetScore = 0;
        dateMap.forEach(function(dateItem, dateKey, dateMapObj) {
          for (let i = 0; i < self.resultData.length; i++) {
            let obj = self.resultData[i];
            if (obj.jnum == noKey && obj.month == dateItem) {
              if (obj.type == "8") {
                tmpData["basic" + dateItem] = obj.point;
                shouldGetScore += obj.point;
              } else if (obj.type == "9") {
                tmpData["comprehensive" + dateItem] = obj.point;
                sum += obj.point;
              }
            }
          }
          let t = timesMap.get(noKey) / 2;
          tmpData["sum"] = (sum / t).toFixed(2);
          tmpData["shouldGetScore"] = (shouldGetScore / t).toFixed(2);
        });
        self.detailData.push(tmpData);
      });
    },
    cellStyle({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        return "border: 1px solid #777;background-color: rgba(240, 182, 162, 0.555);";
      } else if (columnIndex % 8 === 0) {
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
      this.loadFinalDetaiData();
    }
  }
};
</script>
<style lang="scss" scoped>

</style>

