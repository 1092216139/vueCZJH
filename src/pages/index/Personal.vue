<template>
  <el-card>
    <!-- id	账号id
           ctime	账号创建时间
           account	账号
           userGroup	用户组
           imgUrl	头像地址
      -->
    <div slot="header" class="clearfix">
      <span>管理员信息</span>
    </div>
    <div class="text item">
      <p>{{ "管理员ID: " + arr.id }}</p>
      <p>{{ "账号: " + arr.account }}</p>
      <p>{{ "用户组: " + arr.userGroup }}</p>
      <p>{{ "创建时间: " + arr.ctime }}</p>
      <p>
        <span>管理员头像:</span>
        <!-- 
          所以其实这里不用在API里面写接口，直接在这里传进去就行了，地址有了参数有了返回值
          就是:on-success="handleAvatarSuccess"这个代码里面带的
          action：上传图片的地址，就是自己的服务器的地址
          启动服务器会有整个服务器的地址，具体图片传哪里就是请求地址
          data:传参，附带的参数
         -->
        <el-upload
          class="avatar-uploader"
          action=" http://127.0.0.1:5000/users/avatar_upload"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :data="data"
        >
          <img
            v-if="arr.imgUrl"
            :src="arr.imgUrl"
            class="avatar"
            title="点击可更换头像"
          />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </p>
    </div>
  </el-card>
</template>

<script>
// 引入个人中心列表接口API_UPHEADIMG
import { API_PER } from "@/api/apis";

export default {
  data() {
    return {
      // 用户名等数据
      arr: {
        id: 1,
        ctime: 2015,
        account: "admin",
        userGroup: "管理员",
        imgUrl: "",
      },
      // 传过去的id值
      data: { id: localStorage.getItem("userId") },
    };
  },
  // 进入页面就调用个人中心页面
  created() {
    API_PER(localStorage.getItem("userId")).then((res) => {
      // console.log(res);
      // 把数组赋值
      this.arr = res.data.accountInfo;
    });
  },
  methods: {
    // 图片上传成功的返回值
    handleAvatarSuccess(res) {
      if (res.code == 0) {
        this.$message({
          message: "上传成功!三秒后刷新页面！",
          type: "success",
        });
        setTimeout(() => {
          // this.$router.push("/Index/personal");
          // 刷新页面
          window.location.reload();
        }, 3000);
      }
    },
  },
};
</script>

<style lang="less">
.text {
  p {
    border-bottom: 1px solid #ccc;
    margin: 0;
    margin-bottom: 20px;
    line-height: 40px;
  }
  p:last-child {
    border: 0;
    display: flex;

    span:first-child {
      padding-right: 20px;
    }
  }
  // 头像样式
  .avatar-uploader {
    .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
    .el-upload:hover {
      border-color: #409eff;
    }
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
}
.clearfix {
  span {
    font-weight: bold;
  }
}
</style>
