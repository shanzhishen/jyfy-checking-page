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
      <el-badge :value="unComplete.length" :max="30">
        <el-button size="medium" @click.native="showUnComplete">未填写</el-button>
      </el-badge>&nbsp;&nbsp;&nbsp;&nbsp;
      <span style="font-size:5px;color:red">* 主任无需打分</span>
      <el-button-group>
        <el-button type="success" round @click.native="submit" :disabled="menu.cre===0">保存数据</el-button>
      </el-button-group>
    </el-col>
    <el-col :span="24" class="header">
      <template>
        <el-table
          :data="userScore"
          stripe
          style="width: 95%;min-height: 500px;height:100%"
          border
          :header-cell-style="{'text-align': 'center',background:'rgba(240, 182, 162, 0.555)',color:'#555'}"
          highlight-current-row
          max-height="700"
          :height="tableHeight"
        >
          <el-table-column type="index" width="50" align="center"></el-table-column>
          <el-table-column prop="jnum" label="工号" width="200" align="center"></el-table-column>
          <el-table-column prop="userName" label="用户" show-overflow-tooltip align="center"></el-table-column>
          <el-table-column property="points" label="员工互评(10分)" align="center" width="400">
            <template slot-scope="scope">
              <el-rate
                v-model="scope.row.points"
                :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
                :max="10"
                :low-threshold="4"
                :high-threshold="7"
                show-score
                text-color="#ff9900"
                score-template="{value}"
                :disabled="checkState>1"
              ></el-rate>
            </template>
          </el-table-column>
          <el-table-column property="points" label="得分" width="200" align="center">
            <template slot-scope="scope">
              <div style="text-aglin:center">{{scope.row.points}}</div>
            </template>
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
      checkedVal: "",
      userScore: [],
      unComplete: [],
      checkState: 0,
      tableHeight: window.innerHeight - 200,
      menu: {}
    };
  },
  methods: {
    submit() {
      var callback = res => {
        this.$message({
          message: "保存成功",
          type: "success"
        });
      };
      var param = {
        checkId: this.checkedVal,
        userScores: JSON.stringify(this.userScore)
      };
      common.post("userChecking/add",param,callback);
    },
    checkInfoChange() {
      for (let i = 0; this.checkInfo.length; i++) {
        if (this.checkInfo[i].checkId === this.checkedVal) {
          this.checkState = this.checkInfo[i].state;
          break;
        }
      }
      this.loadUserScore();
      this.loadUnComplete();
    },
    loadUserScore() {
      var callback = res => {
          var data = common.handerData(res, this);
          this.userScore = data;        
      }
      common.get("userChecking/get",{checkId: this.checkedVal},callback);
    },
    loadUnComplete() {
      var callback = res => {
          var data = common.handerData(res, this);
          this.unComplete = data;        
      }
      common.get("userChecking/unComplete",{checkId: this.checkedVal},callback);
    },
    isLeader() {
      var user = sessionStorage.getItem("user");
      var user1 = JSON.parse(user);
      if (user1.position > 1) {
        return false;
      } else {
        return true;
      }
    },
    showUnComplete() {
      this.loadUnComplete();
      let a = "";
      for (let i = 0; i < this.unComplete.length; i++) {
        if (i == 0) {
          a += this.unComplete[i].userName;
        } else {
          a += " ," + this.unComplete[i].userName;
        }
      }
      this.$alert(a, "未填写员工互评的人员");
    }
  },
  mounted() {
    var checkInfoList = this.$store.getters.getCheckInfo.records;
    this.checkInfo = checkInfoList;
    if (checkInfoList.length > 0) {
      this.checkedVal = this.checkInfo[0].checkId;
      this.checkState = this.checkInfo[0].state;
    }
    this.loadUserScore();
    this.loadUnComplete();
    this.menu = common.getThisMenu(this);
  }
};
</script>
<style lang="scss" scoped>

</style>

