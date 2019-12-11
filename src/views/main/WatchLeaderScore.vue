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
      <!-- <span style="font-size:5px;color:red"></span> -->
    </el-col>
    <el-col :span="24" class="header">
      <template>
        <el-table
          :data="leaderTableList"
          stripe
          style="width: 95%;height:100%"
          border
          :header-cell-style="{'text-align': 'center',background:'rgba(240, 182, 162, 0.555)',color:'#555'}"
          highlight-current-row
          :height="tableHeight"
          max-height="700"
          v-loading="loading"
        >
          <el-table-column type="index" width="50" align="center"></el-table-column>
          <el-table-column prop="jnum" label="工号" width="100" align="center"></el-table-column>
          <el-table-column prop="userName" label="用户" show-overflow-tooltip align="center" fixed></el-table-column>
          <el-table-column :label="item.userName" v-for="(item,index) in leaderInfo" :key="index">
            <el-table-column
              align="center"
              label="基础评分(50分)"
              sortable
              :prop="item.jnum+'|basicPoints'"
              width="160"
            ></el-table-column>
            <el-table-column
              align="center"
              label="综合评分(10分)"
              sortable
              :prop="item.jnum+'|comPoints'"
              width="160"
            ></el-table-column>
            <el-table-column
              align="center"
              label="总分(60分)"
              sortable
              :prop="item.jnum+'|total'"
              width="160"
            ></el-table-column>
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
      checkInfo: [],
      checkedVal: 0,
      checkedText: "",
      leaderScoreList: [],
      leaderTableList: [],
      leaderInfo: [],
      tableHeight: window.innerHeight - 50,
      loading: false
    };
  },
  methods: {
    checkInfoChange() {
      for (let i = 0; this.checkInfo.length; i++) {
        if (this.checkInfo[i].checkId === this.checkedVal) {
          this.checkState = this.checkInfo[i].state;
          break;
        }
      }
      this.loadLeaderScore();
    },
    loadLeaderScore() {
      this.loading = true;

      var callback = res => {
          var data = common.handerData(res, this);
          this.leaderScoreList = data["scores"];
          this.leaderInfo = data["leaders"];
          this.confLeaderData(this.leaderScoreList);        
      }
      common.get("monthChecking/getAllScore",{checkId: this.checkedVal},callback);
    },
    confLeaderData(data) {
      var local = [];
      var map = {};
      for (let i = 0; i < data.length; i++) {
        var d = data[i];
        var key = d.jnum;
        if (typeof map[key] === "undefined") {
          var row = {
            jnum: d.jnum,
            userName: d.userName,
            leaderJnum: d.leaderJnum,
            leaderName: d.leaderName
          };
          row[d.leaderJnum + "|basicPoints"] = d.basicPoints;
          row[d.leaderJnum + "|comPoints"] = d.comPoints;
          row[d.leaderJnum + "|total"] = d.total;
          map[key] = row;
        } else {
          var row = map[key];
          row[d.leaderJnum + "|basicPoints"] = d.basicPoints;
          row[d.leaderJnum + "|comPoints"] = d.comPoints;
          row[d.leaderJnum + "|total"] = d.total;
          map[key] = row;
        }
      }
      for (let j in map) {
        local.push(map[j]);
      }
      this.leaderTableList = local;
      this.loading = false;
    },
    propName(jnum, s) {
      return jnum + s;
    }
  },
  mounted() {
    var checkInfoList = this.$store.getters.getCheckInfo.records;
    this.checkInfo = checkInfoList;
    if (this.checkInfo.length > 0) {
      this.checkedVal = this.checkInfo[0].checkId;
      this.checkedText = this.checkInfo[0].checkName;
      this.loadLeaderScore();
    }
  }
};
</script>
<style lang="scss" scoped>

</style>