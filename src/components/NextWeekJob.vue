<template>
  <div class="jobBorder">
    <div v-for="(item, index) in jobs" :key="index">
      <el-col :span="8">
        <el-input v-model="item.content" type="textarea" placeholder="工作计划：如果没有，则无需填写" :rows="4"></el-input>
      </el-col>
      <el-col :span="7" class="midStyle">
        <el-radio-group v-model="item.degree">
          <div>
            <el-radio :label="'1'">紧急</el-radio>
            <el-radio :label="'2'">严重</el-radio>
          </div>
          <div>
            <el-radio :label="'3'">难度</el-radio>
            <el-radio :label="'4'">一般</el-radio>
          </div>
        </el-radio-group>
      </el-col>
      <el-col :span="7">
        <el-input v-model="item.operProgress" type="textarea" placeholder="解决办法" :rows="4"></el-input>
      </el-col>
      <el-col :span="2" class="midStyle">
        <el-button
          icon="el-icon-plus"
          type="text"
          @click.native="addOne"
          v-if="jobs.length-1===index"
        >添加</el-button>
        <el-button icon="el-icon-minus" type="text" v-else @click.native="delOne(index)">删除</el-button>
      </el-col>
    </div>
  </div>
</template>
<script>
import ProjectInfo from "@/assets/js/projectInfo.js";
import common from "@/assets/js/common.js";
export default {
  name: "NextWeekJob",
  data() {
    return {
      jobs: []
    };
  },
  props: ["jobList"],
  methods: {
    initJobs() {
      this.jobs = [];
      if (this.jobList === null || this.jobList.length === 0) {
        this.addOne();
      } else {
        this.jobs = this.jobList;
      }
    },
    addOne() {
      var d = common.copyObj(ProjectInfo.jobDetail);
      d.type = "4";
      this.jobs.push(d);
    },
    delOne(ind) {
      this.jobs.splice(ind, 1);
    }
  },
  mounted() {
    this.initJobs();
  },
  watch: {
    jobList: function(newValue, oldVlue) {
      this.initJobs();
    }
  }
};
</script>
<style lang="scss">
</style>