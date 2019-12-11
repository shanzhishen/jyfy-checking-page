import axios from 'axios';
import qs from 'qs';
import common from "./common.js";

export default {
  developmentPath: "http://127.0.0.1:8081/",
  productionPath: "http://172.20.0.54/checking/",
  server: 1,
  getServerPath: () => {
    if (process.env.NODE_ENV === 'production') {
      return common.productionPath
    } else {
      return common.developmentPath
    }
  },
  get(path, param, callback, eCallback) {
    axios.get(common.getServerPath() + path, {
        headers: {
          'server-code': common.server
        },
        params: param
      })
      .then(res => {
        if (typeof callback !== 'undefined') {
          callback(res);
        }
      })
      .catch(err => {
        console.log(err);
        if (typeof eCallback !== 'undefined') {
          eCallback();
        }
      })
  },
  post(path, param, callback, eCallback) {
    axios({
        url: common.getServerPath() + path,
        method: "post",
        data: param,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          'server-code': common.server
        },
        transformRequest: [
          function (param) {
            return qs.stringify(param);
          }
        ]
      })
      .then(response => {
        if (typeof callback === 'undefined') {
          return;
        }
        callback(response);
      })
      .catch(err => {
        console.log(err);
        if (typeof eCallback !== 'undefined') {
          eCallback();
        }
      });
  },
  postBody(path, param, callback, eCallback) {
    axios({
        url: common.getServerPath() + path,
        method: "post",
        dataType: 'JSON',
        data: param,
        headers: {
          "Content-Type": "application/json",
          'server-code': common.server
        }
      })
      .then(response => {
        if (typeof callback === 'undefined') {
          return;
        }
        callback(response);
      })
      .catch(err => {
        console.log(err);
        if (typeof eCallback !== 'undefined') {
          eCallback();
        }
      });
  },
  getDownload(path, param,fileName,self) {
    axios.get(common.getServerPath() + path, {
      params: param,
      headers: {
        'server-code': common.server
      },
      responseType: 'arraybuffer', //二进制流
    }).then(function (res) {
      var data = res.data;
      if (!data || data.byteLength === 0) {
        self.$message({
          message: '您的项目不存在或者没有需要下载的数据',
          type: 'warning'
        });
        return;
      }
      var blob = new Blob([data], {
        type: 'application/zip;charset=utf-8'
      })
      var url = window.URL.createObjectURL(blob);
      var aLink = document.createElement("a");
      aLink.style.display = "none";
      aLink.href = url;
      aLink.setAttribute("download", fileName);
      document.body.appendChild(aLink);
      aLink.click();
      document.body.removeChild(aLink); //下载完成移除元素
      window.URL.revokeObjectURL(url); //释放掉blob对象
    }).catch(function (error) {
      console.log(error)
    });
  },
  handerData(res, self) {
    let state = res.data.state;
    if (state == -1) {
      self.$message({
        message: '未登陆，请重新登陆',
        type: 'warning'
      });
      self.$router.push("/Login");
      return "error";
    } else if (state == 0) {
      self.$message({
        message: res.data.msg,
        type: 'warning'
      });
      return "error";
    } else {
      return res.data.data;
    }
  },
  getMsg(res, self) {
    let state = res.data.state;
    if (state === -1) {
      self.$message({
        message: '未登陆，请重新登陆',
        type: 'warning'
      });
      self.$router.push("/Login");
      return "error";
    } else if (state === 0) {
      self.$message({
        message: res.data.msg,
        type: 'warning'
      });
      return "error";
    } else {
      return res.data.msg;
    }
  },
  dateFormat(fmt, date) {
    var o = {
      "M+": date.getMonth() + 1, //月份 
      "d+": date.getDate(), //日 
      "H+": date.getHours(), //小时 
      "m+": date.getMinutes(), //分 
      "s+": date.getSeconds(), //秒 
      "q+": Math.floor((date.getMonth() + 3) / 3), //季度 
      "S": date.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt))
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt))
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
  },
  // 获取周一的日期
  getFirstDayOfWeek(date) {
    var day = date.getDay() || 7;
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1 - day);
  },
  getThisMenu(self) {
    let p = self.$route.path;
    var menu = self.$store.getters.getMenu;
    return menu[p];
  },
  copyObj(obj) {
    return JSON.parse(JSON.stringify(obj));
  },
}