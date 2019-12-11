<template>
  <div class="homeBox">
    <el-container style="height: 100%" direction="vertical">
      <el-header class="homeHeader">
        <el-col :span="4" class="headerRow">
          <img src="../assets/images/title.png" style="height: 60px" />
        </el-col>
        <el-col :span="16" class="headerRow">&nbsp;</el-col>
        <el-col :span="4" class="headerRow">
          <!-- <div>欢迎：{{user.name}} &nbsp;{{user.position}}</div> -->
          <el-dropdown :hide-on-click="false">
            <span class="el-dropdown-link">
              欢迎：{{user.name}} &nbsp;{{user.pos}}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <el-button type="text" @click.native="logout">登&nbsp;&nbsp;出</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button type="text" @click.native="changePwd">修改密码</el-button>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-header>
      <el-container>
        <el-aside width="220px">
          <el-menu
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b"
            router
            :collapse="isCollapse"
            class="el-menu-vertical homeMenu"
            unique-opened
            ref="mainMenu"
            :height="menuHeight"
          >
            <!-- 导入Menu组件 -->
            <Menu :menuList="this.menuList"></Menu>
          </el-menu>
        </el-aside>
        <el-container class="mainContainer">
          <el-main class="home-content-container">
            <el-row>
              <el-col :span="24">
                <el-tabs
                  v-model="activeIndex"
                  type="card"
                  closable
                  @tab-click="tabClick"
                  @tab-remove="tabRemove"
                  class="tabs"
                  v-show="options.length !=0"
                >
                  <el-tab-pane
                    v-for="item in options"
                    :key="item.menuId"
                    :label="item.name"
                    :name="item.url"
                  ></el-tab-pane>
                </el-tabs>
              </el-col>
            </el-row>
            <el-col :span="24" class="mainView">
              <transition name="el-fade-in">
                <router-view v-on:refreshCheckInfo="loadCheckInfo"></router-view>
              </transition>
            </el-col>
          </el-main>
        </el-container>
      </el-container>
    </el-container>
    <el-dialog
      title="修改密码"
      :visible.sync="pwdDialogVisible"
      class="dialogForm"
      :close-on-click-modal="false"
      :before-close="dialogBeforClose"
    >
      <el-form ref="pwdForm" :model="pwdForm" label-width="100px" :rules="pwdRules" status-icon>
        <el-form-item label="原密码" prop="pwd">
          <el-input v-model="pwdForm.pwd" type="password" show-password autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="pwd1">
          <el-input v-model="pwdForm.pwd1" type="password" show-password autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="pwd2">
          <el-input v-model="pwdForm.pwd2" type="password" show-password autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click.native="dialogBeforClose">取 消</el-button>
        <el-button type="primary" @click.native="submitForm('pwdForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Menu from "@/components/Menu";
import common from "../assets/js/common.js";
export default {
  data() {
    var pwd2Validator = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.pwdForm.pwd1) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    var pwd1Validator = (rule, value, callback) => {
      // 密码中必须包含大小字母、数字、特称字符，至少8个字符，最多30个字符。
      var regex = new RegExp(
        "(?=.*[0-9])(?=.*[a-zA-Z]).{6,30}"
      );
      if (!regex.test(value)) {
        callback("密码中必须包含至少6位字母和数字");
      } else {
        callback();
      }
    };
    return {
      isCollapse: false,
      activeIndex: "/Welcome",
      options: [
        //全部打开的tab数据
      ],
      menuList: [
        // 树形menu数据
      ],
      mList: [
        // 基础menu数据
      ],
      user: {
        jnum: "",
        name: "",
        position: "",
        pos: ""
      },
      pwdForm: {
        pwd: "",
        pwd1: "",
        pwd2: ""
      },
      pwdDialogVisible: false,
      pwdRules: {
        pwd: [{ required: true, message: "请输入旧密码", trigger: "blur" }],
        pwd1: [
          { required: true, message: "请输入新密码", trigger: "blur" },
          { validator: pwd1Validator, trigger: "blur" }
        ],
        pwd2: [
          { required: true, message: "请再次输入密码", trigger: "blur" },
          { validator: pwd2Validator, trigger: "blur" }
        ]
      },
      menuHeight: window.innerHeight - 60
    };
  },
  components: {
    // 插入menu子组件
    Menu
  },
  methods: {
    changeMenu() {
      this.isCollapse = !this.isCollapse;
      var aside = document.querySelector("aside");
      if (this.isCollapse) {
        aside.style.flex = "0 0 65px";
      } else {
        aside.style.flex = "0 0 230px";
      }
    },
    openFirstMenu() {
      let menu = this.menuList[0];
      if (typeof menu == "undefined" || menu == null) {
        return;
      }
      if (menu.url == null || menu.url == "") {
        this.$refs.mainMenu.open(menu.menuId + "");
      }
    },
    tabClick(tab) {
      this.$router.push({ path: this.activeIndex });
    },
    tabRemove(path) {
      let options = this.options;
      let i = 0;
      for (; i < options.length; i++) {
        if (options[i].url == path) {
          break;
        }
      }
      this.options.splice(i, 1);
      if (this.options.length == 0) {
        this.activeIndex = "/Welcome";
      } else if (i == 0) {
        this.activeIndex = this.options[0].url;
      } else {
        this.activeIndex = this.options[i - 1].url;
      }
      this.$router.push({ path: this.activeIndex });
    },
    dialogBeforClose() {
      this.pwdDialogVisible = false;
      this.$refs["pwdForm"].resetFields();
    },
    // 递归查询到的menu转为树形
    convertToTreeData(data, pid) {
      const result = [];
      let temp = [];
      for (let i = 0; i < data.length; i++) {
        if (data[i].pid === pid) {
          const obj = {
            menuId: data[i].menuId,
            name: data[i].name,
            url: data[i].url,
            img: data[i].img
          };
          temp = this.convertToTreeData(data, data[i].menuId);
          if (temp.length > 0) {
            obj.children = temp;
          }
          result.push(obj);
        }
      }
      return result;
    },
    confMenu() {
      var callback = res => {
        var data = common.handerData(res, this);
        this.mList = data;
        this.menuList = this.convertToTreeData(this.mList, 0);
        var menu = {};
        for (let i = 0; i < data.length; i++) {
          if (data[i].url != null) {
            menu[data[i].url] = data[i];
          }
        }
        this.$store.dispatch("setMenu", menu);
      };
      common.get("getMenu", {}, callback);
    },
    isLogin() {
      var user = sessionStorage.getItem("user");
      if (typeof user === "undefined" || user == null) {
        this.$router.push({ name: "Login", path: "/Login" });
        return false;
      }
      var user1 = JSON.parse(user);
      this.user.name = user1.name;
      this.user.jnum = user1.jnum;
      this.user.position = user1.position;
      this.user.pos = user1.pos;
      return true;
    },
    logout() {
      sessionStorage.removeItem("user");
      var callback = res => {
        this.$router.push({ name: "Login", path: "/Login" });
      };
      var eCallback = () => {
        this.$router.push({ name: "Login", path: "/Login" });
      };
      common.post("logout", {}, callback, eCallback);
    },
    changePwd() {
      this.pwdDialogVisible = true;
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var callback = res => {
            var msg = common.getMsg(res, this);
            if (msg !== "error") {
              this.$message({
                message: "更新成功，请下次登陆时使用新密码",
                type: "success"
              });
            }
            this.pwdDialogVisible = false;
          };
          common.post(
            "changePwd",
            {
              pwd: this.pwdForm.pwd,
              newPwd: this.pwdForm.pwd1
            },
            callback
          );
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    loadCheckInfo() {
      var callback = res => {
        var data = common.handerData(res, this);
        this.$store.dispatch("setCheckInfo", data);
        if (data.records.length >= 1) {
          this.$store.dispatch("setCheckedInfo", data.records[0].checkId);
        }
      };
      common.get("checkInfo/getList", {}, callback);
    }
  },
  beforeMount: function() {
    if (!this.isLogin()) {
      return;
    }
    this.loadCheckInfo();

    // 配置menu的数据
    this.confMenu();
    this.$router.push({ path: this.activeIndex });
    // 自动打开第一个sub-menu
    // this.openFirstMenu();
    // 加载checkInfo信息到store中
  },
  watch: {
    $route(to, from) {
      let flag = false; //判断是否页面中是否已经存在该路由下的tab页
      let op;
      let path = to.path;
      //options记录当前页面中已存在的tab页
      for (let option of this.options) {
        if (path === option.url) {
          flag = true;
          this.activeIndex = path;
          break;
        }
      }
      if (!flag) {
        for (let op of this.mList) {
          if (path === op.url) {
            this.options.push(op);
            this.activeIndex = path;
            break;
          }
        }
      }
    }
  }
};
</script>
<style lang="scss" scoped>
$p_color: #4976c9;
$header_height: 60px;
$footer_height: 20px;
#app,
.homeBox {
  padding: 0px;
  margin: 0px;
  height: 100%;
  position: relative;
}

.mainContainer {
  width: 100%;
  height: 100%;
}

.homeHeader {
  height: $header_height;
  line-height: $header_height;
  background-color: $p_color;
  .headerRow {
    height: 60px;
    text-align: center;
    .el-dropdown {
      color: #ffffff;
    }
  }
}

.home-content-container {
  width: 100%;
  padding: 0px;
  padding-bottom: $footer_height;

  .mainView {
    position: relative;
    background-color: #fff;
    box-sizing: border-box;
    min-width: 700px;
    min-height: 500px;
    height: calc(100% - 56px);
  }
  .footer {
    position: fixed;
    bottom: 0px;
    height: $footer_height;
    background-color: rgba(192, 187, 187, 0.74);
  }
}

.homeMenu {
  height: 100%;
}

.el-menu-vertical:not(.el-menu--collapse) {
  width: 219px;
}
</style>