<template>
  <div>
    <img src="../assets/images/background.jpg" width="100%" height="100%" />
    <div class="title">
      <!-- <p>考 核 系 统</p> -->
      <img src="../assets/images/logo.png" style="height: 100px" />
    </div>
    <el-form :model="loginForm" :rules="rules" ref="loginForm" label-width="0px">
      <el-form-item prop="jnum">
        <el-input
          v-model="loginForm.jnum"
          placeholder="请输入工号"
          @keyup.enter.native="submitForm('loginForm')"
          autofocus
        ></el-input>
      </el-form-item>

      <el-form-item prop="pwd">
        <el-input
          v-model="loginForm.pwd"
          placeholder="请输入密码"
          show-password
          @keyup.enter.native="submitForm('loginForm')"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click.native="submitForm('loginForm')">登&nbsp;&nbsp;&nbsp;&nbsp;录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>


<script>
import common from "../assets/js/common.js";
export default {
  data() {
    return {
      loginForm: {
        jnum: "",
        pwd: ""
      },
      rules: {
        jnum: [{ required: true, message: "请输入用户名", trigger: "blur" }],
        pwd: [{ required: true, message: "请输入密码", trigger: "blur" }]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var callback = res => {
            var data = common.handerData(res, this);
            if (data != "error") {
              var pos = "";
              if (data.position == 1) {
                pos = "主任";
              }
              sessionStorage.setItem(
                "user",
                JSON.stringify({
                  jnum: data.jnum,
                  name: data.name,
                  position: data.position,
                  pos: pos
                })
              );
              this.$router.push("/");
            }
          };
          common.post("login", this.loginForm, callback);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  },
  mounted(){
  }
};
</script>
<style lang="scss" scoped>
img {
  z-index: -100;
  position: absolute;
  left: 0;
  top: 0;
}

.el-form {
  width: 300px;
  position: fixed;
  top: 300px;
  right: 100px;
  text-align: center;

  .el-button {
    width: 300px;
  }
}

.title {
  color: #fff;
  position: relative;
  left: 100px;
  top: 100px;
  font-size: 30px;
  margin: 0px;
}
</style>