<template>
  <el-row class="container">
    <el-col :span="24" class="header">
      <el-upload
        class="upload-demo"
        :action="classesPath"
        :limit="1"
        accept="xlsx"
        style="display:inline-block"
        :before-upload="beforeUpload"
        :on-success="onSuccess"
        :on-error="onError"
        ref="upload"
        name="excel"
      >
        <el-button size="small" type="primary">点击上传</el-button>
      </el-upload>

      <el-date-picker
        v-model="monday"
        type="week"
        format="周一为 yyyy-MM-dd"
        placeholder="选择周"
        @change="change"
        value-format="yyyyMMddHHmmss"
        :picker-options="{firstDayOfWeek:1}"
      ></el-date-picker>
      <span class="tips">* 上传的第一天必须是周一；最后一天建议是周日</span>
    </el-col>
    <!-- :picker-options="{firstDayOfWeek:1}" -->
    <el-col>
      <el-table
        :data="classData()"
        stripe
        style="width: 95%"
        max-height="700"
        :height="tableHeight"
        border
        :header-cell-style="{'text-align': 'center',background:'rgba(240, 182, 162, 0.555)',color:'#555'}"
      >
        <el-table-column type="index" width="50" align="center"></el-table-column>
        <el-table-column prop="jnum" label="工号" align="center" width="150"></el-table-column>
        <el-table-column prop="userName" label="姓名" align="center" width="150"></el-table-column>
        <el-table-column prop="mon1" :label="dates.d0" width="120">
          <el-table-column prop="mon" label="星期一" width="120" align="center" show-overflow-tooltip></el-table-column>
        </el-table-column>
        <el-table-column prop="tues1" :label="dates.d1" width="120">
          <el-table-column prop="tues" label="星期二" width="120" align="center" show-overflow-tooltip></el-table-column>
        </el-table-column>
        <el-table-column prop="wed1" :label="dates.d2" width="120">
          <el-table-column prop="wed" label="星期三" width="120" align="center" show-overflow-tooltip></el-table-column>
        </el-table-column>
        <el-table-column prop="thur1" :label="dates.d3" width="120">
          <el-table-column prop="thur" label="星期四" width="120" align="center" show-overflow-tooltip></el-table-column>
        </el-table-column>
        <el-table-column prop="fri1" :label="dates.d4" width="120">
          <el-table-column prop="fri" label="星期五" width="120" align="center" show-overflow-tooltip></el-table-column>
        </el-table-column>
        <el-table-column prop="sat1" :label="dates.d5" width="120">
          <el-table-column prop="sat" label="星期六" width="120" align="center" show-overflow-tooltip></el-table-column>
        </el-table-column>
        <el-table-column prop="sun1" :label="dates.d6" width="120">
          <el-table-column prop="sun" label="星期日" width="120" align="center" show-overflow-tooltip></el-table-column>
        </el-table-column>
      </el-table>
    </el-col>
    <!-- <el-col :span="24" class="footer">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="pageSize"
        @current-change="currentPage"
      ></el-pagination>
    </el-col>-->
  </el-row>
</template>
<script>
import common from "../../assets/js/common.js";
export default {
  data() {
    return {
      monday: "",
      fileList: [],
      classesPath: common.serverPath + "upload/classInfo",
      classes: [],
      dates: {
        d1: "",
        d2: "",
        d3: "",
        d4: "",
        d5: "",
        d6: "",
        d0: ""
      },
      tableHeight: window.innerHeight - 200
    };
  },
  methods: {
    change() {
      var callback = res => {
        var data = common.handerData(res, this);
        this.classes = data;
      };
      common.get("classes/get", { monday: this.monday }, callback);
    },
    classData() {
      var data = this.classes;
      if (typeof data === "undefined" || data.length === 0) {
        // this.$message({
        //   message: "排班数据还未上传",
        //   type: "info"
        // });
        return;
      }
      if (data.length % 7 !== 0) {
        this.$message({
          message: "排班数据可能有错误，请联系管理员",
          type: "warning"
        });
        return;
      }

      if (typeof data === "undefined" || data == null) {
        return;
      }
      var weekData = [];
      for (let i = 0; i < data.length; i = i + 7) {
        var week = {};
        week.jnum = data[0 + i].jnum;
        week.userName = data[0 + i].userName;
        week.mon = data[0 + i].className;
        week.tues = data[1 + i].className;
        week.wed = data[2 + i].className;
        week.thur = data[3 + i].className;
        week.fri = data[4 + i].className;
        week.sat = data[5 + i].className;
        week.sun = data[6 + i].className;

        if (i === 0) {
          this.dates.d0 = data[0 + i].day;
          this.dates.d1 = data[1 + i].day;
          this.dates.d2 = data[2 + i].day;
          this.dates.d3 = data[3 + i].day;
          this.dates.d4 = data[4 + i].day;
          this.dates.d5 = data[5 + i].day;
          this.dates.d6 = data[6 + i].day;
        }

        weekData.push(week);
      }
      return weekData;
    },
    beforeUpload(file) {
      var suf = file.name.substr(-4);
      if (suf != "xlsx") {
        this.$message({
          message: "请导入.xlsx文件",
          type: "warning"
        });
        return false;
      } else {
        return true;
      }
    },
    onSuccess(response, file, fileList) {
      this.change();
      this.$message("上传成功");
    },
    onError(err, file, fileList) {}
  },
  mounted() {}
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

.header {
  margin-bottom: 10px;
  height: 60px;
}

.el-date-picker {
  position: absolute;
  right: 50px;
}

.footer {
  text-align: center;
  margin: 5px;
}
</style>


