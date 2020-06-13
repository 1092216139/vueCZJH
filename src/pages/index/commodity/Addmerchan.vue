<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>商品添加</span>
    </div>
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="商品名称">
        <el-input v-model="form.name" placeholder="商品名称"></el-input>
      </el-form-item>
      <el-form-item label="商品分类">
        <el-select v-model="form.category" placeholder="请选择商品分类">
          <!-- 遍历的是分类接口的数据 -->
          <el-option
            v-for="(item, index) in categories"
            :key="index"
            :label="item.cateName"
            :value="item.cateName"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商品价格">
        <el-input-number
          v-model="form.price"
          :min="0"
          :max="1000"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="商品图片">
        <el-upload
          class="avatar-uploader"
          action="http://127.0.0.1:5000/goods/goods_img_upload"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
        >
          <img
            v-if="form.imgUrl"
            :src="'http://127.0.0.1:5000/upload/imgs/goods_img/' + form.imgUrl"
            class="avatar"
            title="点击可更换图片"
          />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="商品描述">
        <el-input type="textarea" v-model="form.goodsDesc"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">添加商品</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
// API_COMADDMER:添加商品的接口,上传图片的直接在图片地址哪里就调用接口了,不用单独再写接口
// API_COMQUERY:查询分类的接口
import { API_COMADDMER, API_COMQUERY } from "@/api/apis";

export default {
  data() {
    return {
      // 这是要传给添加商品接口的数据
      form: {
        name: "",
        category: "",
        price: 0,
        imgUrl: "",
        goodsDesc: "",
      },
      // 这是分类的接口
      categories: {},
      // 显示图片
      dialogVisible: false,
    };
  },
  methods: {
    // 点添加商品
    onSubmit() {
      // 价格要变成字符串
      console.log(JSON.stringify(this.form.price), this.form.imgUrl);

      // 添加商品的接口
      API_COMADDMER(
        this.form.name,
        this.form.category,
        JSON.stringify(this.form.price),
        this.form.imgUrl,
        this.form.goodsDesc
      ).then((res) => {
        if (res.data.code == 0) {
          this.$message({
            message: "上传成功!",
            type: "success",
          });
          // 清空值
          this.form.name = "";
          this.form.category = "";
          this.form.price = 0;
          this.form.imgUrl = "";
          this.form.goodsDesc = "";
          // 三秒后跳转商品列表接口
          setTimeout(() => {
            this.$router.push("/Index/commodity/buyoff");
          }, 3000);
        }
      });
    },
    // 图片上传成功的返回值
    handleAvatarSuccess(res) {
      if (res.code == 0) {
        this.$message({
          message: "图片上传至服务器上传成功!",
          type: "success",
        });
        // console.log(res.imgUrl);
        // 把图片地址赋值给上面的地址
        this.form.imgUrl = res.imgUrl;
        // 显示图片
        this.dialogVisible = true;
      }
    },
  },
  created() {
    // 进入页面就调用这个分类接口
    API_COMQUERY().then((res) => {
      // 直接把对象赋值
      this.categories = res.data.categories;
    });
  },
};
</script>

<style lang="less">
.avatar-uploader {
  .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;

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
}
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.el-form-item {
  width: 500px;
}
.clearfix {
  span {
    font-weight: bold;
  }
}
</style>
