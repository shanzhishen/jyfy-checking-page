<template>
  <el-row class="container">
    <el-col :span="24" class="header">
      <span v-show="file != ''">{{file.name}}</span>
      <el-upload
        :action="uploadPath"
        :limit="1"
        accept="xlsx"
        style="width: 200px;display:inline-block"
        :on-change="onchange"
        :on-success="onSuccess"
        :on-error="onError"
        :auto-upload="false"
        ref="upload"
        :show-file-list="false"
        name="excel"
        :data="{start:month}"
      >
        <el-button slot="trigger" size="small" type="primary" round>选取文件</el-button>
        <el-button
          style="margin-left: 10px;"
          size="small"
          type="success"
          @click="submitUpload"
          round
        >上传到服务器</el-button>
      </el-upload>
      <el-button size="small" type="primary" @click.native="clearUpload" round>清空</el-button>
      <el-date-picker
        v-model="month"
        type="month"
        placeholder="选择月"
        value-format="yyyyMM"
        @change="changeMonth"
      ></el-date-picker>
    </el-col>
    <el-col :span="24" class="header">
      <template>
        <el-table
          :data="fingerData"
          stripe
          style="width: 95%"
          max-height="700"
          :height="tableHeight"
          border
          :header-cell-style="{'text-align': 'center',background:'rgba(240, 182, 162, 0.555)',color:'#555'}"
          highlight-current-row
        >
          <el-table-column type="index" width="50" align="center"></el-table-column>
          <el-table-column prop="jnum" label="工号" width="120" align="center"></el-table-column>
          <el-table-column prop="name" label="用户" show-overflow-tooltip align="center"></el-table-column>
          <el-table-column prop="needPrint" label="应按" width="120" align="center"></el-table-column>
          <el-table-column prop="realPrint" label="实按" width="120" align="center"></el-table-column>
          <el-table-column prop="printRate" label="按压率" width="120" align="center"></el-table-column>
          <el-table-column
            prop="startDate"
            label="按压月"
            width="120"
            align="center"
            :formatter="formatter"
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
      fingerData: [],
      month: "",
      file: "",
      total: 100,
      pageSize: 12,
      page: 1,
      uploadPath: common.serverPath + "upload/fingerPrint",
      tableHeight: window.innerHeight - 320
    };
  },
  methods: {
    onchange(file) {
      this.file = file;
    },
    changeMonth() {
      this.page = 1;
      this.loadFingerData();
    },
    submitUpload() {
      if (this.file == "") {
        this.$message({
          message: "请选择文件",
          type: "warning"
        });
        return;
      }

      var suf = this.file.name.substr(-4);
      if (suf != "xlsx") {
        this.$message({
          message: "请导入.xlsx文件",
          type: "warning"
        });
        return;
      } else if (this.month === "") {
        this.$message({
          message: "请选择日期",
          type: "warning"
        });
        return;
      }
      this.$confirm(
        "上传日期为：" + this.month + ",文件名为：" + this.file.name,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          center: true
        }
      )
        .then(msg => {
          this.$refs.upload.submit();
        })
        .catch(err => {
          console.log(err);
        });
    },
    clearUpload() {
      this.$refs.upload.clearFiles(this.file);
      this.file = "";
    },
    onSuccess(response, file, fileList) {},
    onError(err, file, fileList) {},
    currentPage(p) {
      this.page = p;
      this.loadFingerData();
    },
    loadFingerData() {
      var callback = res => {
        var data = common.handerData(res, this);
        this.total = data.total;
        this.fingerData = data.records;
      };
      var param = {
        month: this.month,
        page: this.page,
        pageSize: this.pageSize
      };
      common.get("finger/get", param, callback);
    },
    formatter(row, column) {
      return row.startDate.substr(0, 7);
    }
  },
  mounted() {
    this.loadFingerData();
  }
};
</script>
<style lang="scss" scoped>

</style>