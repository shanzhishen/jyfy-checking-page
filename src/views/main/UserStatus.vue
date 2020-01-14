<template>
  <el-row class="container">
    <el-col :span="24" class="header">
      <el-date-picker
        v-model="month"
        type="month"
        placeholder="选择月"
        value-format="yyyyMM"
        @change="changeMonth"
      ></el-date-picker>
      <span class="tips">* 管理：班次为平均分； 正常：班次为实际分数； 休息：不计入分数</span>
    </el-col>
    <el-col :span="24" class="main">
      <template>
        <el-table
          :data="userStatus"
          stripe
          style="width: 95%"
          border
          :header-cell-style="{'text-align': 'center',background:'rgba(240, 182, 162, 0.555)',color:'#555'}"
          highlight-current-row
          max-height="700"
          :height="tableHeight"
        >
          <el-table-column prop="id" type="index" label="#" width="50" align="center"></el-table-column>
          <el-table-column prop="jnum" label="工号" width="120" align="center"></el-table-column>
          <el-table-column prop="userName" label="用户" show-overflow-tooltip align="center"></el-table-column>
          <el-table-column property="onDuty" label="值班状态" width="250" align="center">
            <template slot-scope="scope">
              <el-select
                v-model="scope.row.onDuty"
                placeholder="请选择"
                @change="changeDuty($event,scope.row)"
              >
                <el-option
                  v-for="item in onDutyData"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="month" label="月份" show-overflow-tooltip align="center"></el-table-column>
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
      month: "",
      userStatus: [],
      onDutyData: [
        {
          label: "管理",
          value: 1
        },
        {
          label: "正常",
          value: 2
        },
        {
          label: "休息",
          value: 3
        }
      ],
      tableHeight: window.innerHeight - 200
    };
  },
  methods: {
    loadUserStatus() {
      var callback = res => {
        var data = common.handerData(res, this);
        this.userStatus = data;
      };
      common.get("userStatus/get", { month: this.month }, callback);
    },
    changeMonth(v) {
      this.month = v;
      this.loadUserStatus();
    },
    changeDuty(e, row) {
      var self = this;
      var param = {
        id: row.id,
        status: e
      };
      //   common.post("userStatus/set", param, self);
      var callback = res => {
        var msg = common.getMsg(res, this);
        this.$message({
          message: msg,
          type: "success"
        });
      };
      common.post("userStatus/set",param,callback);
    }
  },
  mounted() {
    this.month = common.dateFormat("yyyyMM", new Date());
    this.loadUserStatus();
  }
};
</script>

<style lang="scss" scoped>

</style>