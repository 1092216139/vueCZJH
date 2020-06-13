<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>添加账号</span>
    </div>
    <!-- 
      ruleForm：input值的数组
      rules：失焦验证
     -->
    <el-form
      :model="ruleForm"
      status-icon
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="账号" prop="acc">
        <el-input v-model="ruleForm.acc" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="pwd">
        <el-input
          type="password"
          v-model="ruleForm.pwd"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="用户组" prop="userGroup">
        <el-select v-model="ruleForm.userGroup" placeholder="请选择用户组">
          <el-option label="超级管理员" value="超级管理员"></el-option>
          <el-option label="管理员" value="管理员"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')"
          >添加
        </el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
// 先引入api
import { API_ACCADD } from "@/api/apis";

export default {
  data() {
    // 账号验证
    var checkAcc = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("账号不能为空"));
      }
      setTimeout(() => {
        if (value.length < 3) {
          callback(new Error("用户名不能小于三个字符"));
        } else {
          callback();
        }
      }, 1000);
    };
    // 密码验证
    var checkPwd = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    // 这里是上面input返回的值
    return {
      ruleForm: {
        acc: "",
        pwd: "",
        userGroup: "",
      },
      // 这是失焦验证
      rules: {
        acc: [{ validator: checkAcc, trigger: "blur" }],
        pwd: [{ validator: checkPwd, trigger: "blur" }],
      },
    };
  },
  methods: {
    // 添加按钮
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 成功后直接调用接口添加账户
          // console.log(this.ruleForm.acc);
          // console.log(this.ruleForm.pwd);
          // console.log(this.ruleForm.userGroup);
          API_ACCADD(
            this.ruleForm.acc,
            this.ruleForm.pwd,
            this.ruleForm.userGroup
          ).then((res) => {
            if (res.data.code == 0) {
              // 这是element-ui里面的提示,直接用
              this.$message({
                message: "添加成功!",
                type: "success",
              });

              // 清空值
              // this.ruleForm.acc = "";
              // this.ruleForm.pwd = "";
              // this.ruleForm.userGroup = "";
              // 照搬下面的重置
              this.$refs[formName].resetFields();
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 重置按钮清空所有值
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
