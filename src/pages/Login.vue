<template>
  <div id="login">
    <el-card class="box-card login_from">
      <div slot="header" class="clearfix">
        <span>吃咤江湖系统</span>
      </div>
      <div>
        <p class="login_from_input">
          <el-input v-model="acc" clearable placeholder="请输入账号"></el-input>
        </p>
        <p class="login_from_input">
          <el-input
            v-model="pwd"
            show-password
            placeholder="请输入密码"
          ></el-input>
        </p>
        <p class="login_from_btn">
          <el-button type="primary" @click="clickLogin" :plain="error_val"
            >登录</el-button
          >
        </p>
      </div>
    </el-card>
  </div>
</template>

<script>
// 引入封装的api
import { API_LOGIN } from "../api/apis";

export default {
  data() {
    return {
      acc: "",
      pwd: "",
      // 账号密码错误的时候提示,初始值为false
      error_val: false,
      // 定义标杆值保存一个true,当点击连续点击登录会隔一段时间才能继续点,释放内存
      flag: true,
    };
  },
  methods: {
    //点击登录就调用接口,正确才登录进去
    clickLogin() {
      // 发送一次就把标杆值设置为false
      // 如果此时标杆值为false.那就直接返回不再走调用接口那一步
      if (this.flag == false) return;

      // 第一次点击登录,标杆值是false,所以直接走这一步,调用接口,判断是否有这个用户
      // 调用接口,接口在api中封装好的API_LOGIN
      API_LOGIN(this.acc, this.pwd).then((res) => {
        if (res.data.code == 0) {
          //登录成功!这是element-ui里面的提示,直接用就行了
          this.$message({
            message: "登陆成功!",
            type: "success",
          });

          // 三秒后跳转页面
          setTimeout(() => {
            this.$router.push("/Index/home");
          }, 500);

          // 把id保存在本地存储中,便于其他页面调用
          localStorage.setItem("userId", res.data.id);
          // 把token存在本地存储中
          localStorage.setItem("usertoken", res.data.token);
          // 用户名也存在本地存储中
          localStorage.setItem("useracc", this.acc);
          // 权限的role保存，用于权限看到列表数据
          localStorage.setItem("userrole", res.data.role);

          // 跳转不成功也会提示
        } else {
          this.$message.error("登录失败,用户名或密码错误");
          // 这是刚才写的账号密码错误的提示
          this.error_val = true;
        }
      });

      // 现在在三秒后把标杆值设置为true,这样用户就又能点击登录了
      setTimeout(() => {
        this.flag = true;
      }, 3000);
    },
  },
};
</script>

<style lang="less" scoped>
@base: #304156; //主题灰色
@base2: #f0f2f5; //灰色

#login {
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  background: url("../assets/imgs/beijingtu.jpg") no-repeat;
  background-size: 100% 100%;
  color: #fff;
}
.login_from {
  text-align: center;
  width: 500px;
  position: relative;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255, 255, 255, 0.2);
}
.login_from p {
  margin: 20px 0;
  font-size: 20px;
}
.login_from .login_from_btn button {
  width: 100%;
}
.clearfix {
  span {
    font-size: 24px;
    font-weight: bold;
    color: #1a79af;
  }
}
</style>
