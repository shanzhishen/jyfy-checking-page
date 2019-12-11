<template>
  <el-row class="container">
    <el-col :span="24" class="header">
      <el-upload
        :action="uploadPath"
        :limit="1"
        accept="xlsx"
        style="width: 150px;display:inline-block"
        :before-upload="beforeUpload"
        :on-success="onSuccess"
        :on-error="onError"
        name="excel"
      >
        <el-button size="small" type="primary">点击上传</el-button>
      </el-upload>

      <el-date-picker
        v-model="dateRange"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @change="changeRange"
        value-format="yyyyMMdd"
      ></el-date-picker>
      <!-- <el-button-group>
        <el-button type="primary" round icon="el-icon-search">查询</el-button>
        <el-button type="success" round>新增</el-button>
        <el-button type="danger" round>删除</el-button>
      </el-button-group>-->
      <span style="font-size:5px;color:red">* 无法解析的数据以弹窗形式弹出，可以在日常数据中自行维护</span>
    </el-col>
    <el-col :span="24" class="header">
      <template>
        <el-table
          :data="daylyData"
          stripe
          style="width: 95%"
          border
          :header-cell-style="{'text-align': 'center',background:'rgba(240, 182, 162, 0.555)',color:'#555'}"
          @row-click="rowClick"
          highlight-current-row
          :height="tableHeight"
        >
          <el-table-column type="index" width="50" align="center"></el-table-column>
          <el-table-column prop="inf1" label="DocId" width="120" align="center"></el-table-column>
          <el-table-column prop="intro" label="内容" show-overflow-tooltip align="left"></el-table-column>
          <el-table-column prop="jnum" label="工号" width="120" align="center"></el-table-column>
          <el-table-column prop="userName" label="替班人员" width="120" align="center"></el-table-column>
          <el-table-column prop="points" label="得分" width="120" align="center"></el-table-column>
          <el-table-column prop="day" label="申请日期" width="120" align="center"></el-table-column>
          <el-table-column prop="applyName" label="申请人员" width="120" align="center"></el-table-column>
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
  </el-row>
</template>
<script>
import common from "../../assets/js/common.js";
export default {
  data() {
    return {
      dateRange: [],
      clickRow: {},
      dailyType: [],
      total: 0,
      pageSize: 12,
      page: 1,
      uploadPath: common.serverPath + "upload/changeClass",
      daylyData: [],
      tableHeight: window.innerHeight - 320
    };
  },
  methods: {
    beforeUpload(file) {
      var suf = file.name.substr(-4);
      console.log(suf);
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
      var data = response.data;
      var msg = "";
      for (let i = 0; i < data.length; i++) {
        msg += data[i] + "<br>";
      }
      if (msg != "") {
        this.$alert(msg, "失败的条目", {
          confirmButtonText: "确定",
          dangerouslyUseHTMLString: true
        });
      }
    },
    onError(err, file, fileList) {},
    changeRange() {
      //["20180601", "20180623"]
      this.page = 1;
      this.loadChangeClassData();
    },
    rowClick(row, column, event) {
      this.clickRow = row;
    },
    currentPage(p) {
      this.page = p;
      this.loadChangeClassData();
    },
    loadChangeClassData() {
      var self = this;
      var param = {
        page: this.page,
        pageSize: this.pageSize,
        type: 1
      };

      if (this.dateRange != null && this.dateRange.length == 2) {
        param.start = this.dateRange[0];
        param.end = this.dateRange[1];
      }
      var callback = res => {
        var data = common.handerData(res, this);
        this.total = data.total;
        this.daylyData = data.records;
      };
      common.get("daily/get", param, callback);
    }
  },
  mounted() {
    this.loadChangeClassData();
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
.header {
  margin-bottom: 10px;
  > * {
    margin-right: 40px;
  }
  .el-button-group {
    position: absolute;
    right: 20px;
  }
}

.footer {
  text-align: center;
  margin: 5px;
}
</style>
