<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>修改密码</span>
    </div>
    <el-form
      :model="ruleForm"
      status-icon
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="原密码" prop="oldpwd">
        <el-input v-model.number="ruleForm.oldpwd"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="pass">
        <el-input
          type="password"
          v-model="ruleForm.pass"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="确认新密码" prop="checkPass">
        <el-input
          type="password"
          v-model="ruleForm.checkPass"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')"
          >提交</el-button
        >
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
// 引入aixos
import { API_ACCOLDID,API_ACCPWD } from "@/api/apis";
export default {
  data() {
    // 原密码判断
    var validatePwd = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm.oldpwd !== "") {
          // console.log(this.ruleForm.oldpwd);
          // console.log(localStorage.getItem('userId'))

          // 调用验证旧密码接口
          API_ACCOLDID(
            localStorage.getItem("userId"),
            this.ruleForm.oldpwd
          ).then((res) => {
            // console.log(res);
            if (res.data.code == 0) {
              //如果验证成功提示密码正确
              this.$message({
                message: "密码正确!",
                type: "success",
              });
            } else {
              // 如果验证不成功提示密码错误
              // this.$message.error("密码错误,请输入正确的密码!");
              callback(new Error(this.$message.error("密码错误,请输入正确的密码!")));
            }
          });
        }
        callback();
      }
    };
    // 新密码判断
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入新密码"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          console.log(this.ruleForm.checkPass);
        }
        callback();
      }
    };
    // 是否与新密码相同
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入新密码"));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      // 密码框的值
      ruleForm: {
        oldpwd: "",
        pass: "",
        checkPass: "",
      },
      // 失焦验证密码框的值
      rules: {
        oldpwd: [{ validator: validatePwd, trigger: "blur" }],
        pass: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }],
      },
    };
  },
  methods: {
    // 提交
    submitForm() {
      // 点击提交调用修改密码的接口
      API_ACCPWD(localStorage.getItem("userId"),this.ruleForm.checkPass).then( res => {
        // console.log(res);
        
        if (res.data.code == 0) {
              //如果验证成功提示密码正确
              this.$message({
                message: "修改密码成功!请重新登录!",
                type: "success",
              });
              // 跳转页面
              this.$router.push("/");
            } else {
              // 如果验证不成功提示密码错误
              this.$message.error("修改失败!请重试!");
            }
      })
      // console.log(this.$refs);
    },
    // 重置清空所有值
    // formName表单的id值:ref="ruleForm"
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>

<style lang="less" scoped>
.el-input {
  width: 300px;
}
</style>
