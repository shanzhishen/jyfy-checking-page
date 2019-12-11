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
        <el-button type="success" round @click.native="submit" :disabled="checkState!=1">保存数据</el-button>
      </el-button-group>
    </el-col>
    <el-col :span="24" class="main">
      <template>
        <el-table
          :data="monthScore"
          stripe
          style="width: 95%"
          border
          :header-cell-style="{'text-align': 'center',background:'rgba(240, 182, 162, 0.555)',color:'#555'}"
          highlight-current-row
          :height="tableHeight"
          max-height="700"
        >
          <el-table-column type="index" width="50" align="center"></el-table-column>
          <el-table-column prop="jnum" label="工号" width="120" align="center"></el-table-column>
          <el-table-column prop="userName" label="用户" show-overflow-tooltip align="center"></el-table-column>
          <el-table-column property="basicPoints" label="基础评分(50分)" width="250" align="center">
            <template slot-scope="scope">
              <el-input-number
                v-model="scope.row.basicPoints"
                :min="0"
                :max="50"
                :disabled="checkState!=1"
              ></el-input-number>
            </template>
          </el-table-column>
          <el-table-column property="comPoints" label="综合评分(10分)" width="250" align="center">
            <template slot-scope="scope">
              <el-input-number
                v-model="scope.row.comPoints"
                :min="0"
                :max="10"
                :disabled="checkState!=1"
              ></el-input-number>
            </template>
          </el-table-column>
          <el-table-column prop="total" label="总分" show-overflow-tooltip align="center">
            <template
              slot-scope="scope"
            >{{ scope.row.total = scope.row.comPoints + scope.row.basicPoints }}</template>
          </el-table-column>
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
      checkInfo: [],
      checkedVal: "",
      checkState: 0,
      monthScore: [],
      tableHeight: window.innerHeight - 200
    };
  },
  methods: {
    submit() {
      var callback = res => {
        var msg = common.getMsg(res, this);
        this.$message({
          message: "上传成功",
          type: "success"
        });
      };
      var param = {
        checkId: this.checkedVal,
        monthScores: JSON.stringify(this.monthScore)
      };
      common.post("monthChecking/add", param, callback);
    },
    checkInfoChange() {
      for (let i = 0; this.checkInfo.length; i++) {
        if (this.checkInfo[i].checkId === this.checkedVal) {
          this.checkState = this.checkInfo[i].state;
          break;
        }
      }
      this.laodMonthScore();
    },
    laodMonthScore() {
      var callback = res => {
        var data = common.handerData(res, this);
        this.monthScore = data;
      };
      common.get("monthChecking/get", { checkId: this.checkedVal }, callback);
    }
  },
  mounted() {
    var checkInfoList = this.$store.getters.getCheckInfo.records;
    this.checkInfo = checkInfoList;
    if (checkInfoList.length > 0) {
      this.checkedVal = this.checkInfo[0].checkId;
      this.checkState = this.checkInfo[0].state;
    }
    this.laodMonthScore();
  }
};
</script>

<style lang="scss" scoped>

</style>
