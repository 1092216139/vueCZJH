<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>店铺管理</span>
      <el-button style="float: right;" type="primary" @click="save"
        >保存</el-button
      >
    </div>
    <!-- 主体 -->
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="店铺名称">
        <el-input v-model="form.name" style="width:300px"></el-input>
      </el-form-item>
      <el-form-item label="店铺公告">
        <el-input
          type="textarea"
          v-model="form.bulletin"
          style="width:300px;"
        ></el-input>
      </el-form-item>
      <el-form-item label="店铺头像">
        <!-- 
           :action="imgsupload"：上传的地址
           allupload：呈现在页面中的图片地址
            -->
        <el-upload
          class="avatar-uploader"
          :action="imgsupload"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
        >
          <img
            v-if="form.avatar"
            :src="allupload + form.avatar"
            class="avatar"
          />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="店铺图片" style="width:600px">
        <!-- 
          file-list:这是上传的文件列表，也就是图片的一个地址
          例如： [{name: 'food.jpg', url: 'https://xxx.cdn.com/xxx.jpg'}]
          :action="imgsupload"：上传的地址
          :on-success="uploadPictures":图片上传成功时的事件
         -->
        <el-upload
          :action="imgsupload"
          list-type="picture-card"
          :on-remove="handleRemove"
          :file-list="fileList"
          :on-success="uploadPictures"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="配送费">
        <el-input v-model="form.deliveryPrice" style="width:300px"></el-input>
      </el-form-item>
      <el-form-item label="配送时间">
        <el-input v-model="form.deliveryTime" style="width:300px"></el-input>
      </el-form-item>
      <el-form-item label="配送描述">
        <el-input v-model="form.description" style="width:300px"></el-input>
      </el-form-item>
      <el-form-item label="店铺评分">
        <el-input v-model="form.score" style="width:300px"></el-input>
      </el-form-item>
      <el-form-item label="销量">
        <el-input v-model="form.sellCount" style="width:300px"></el-input>
      </el-form-item>
      <el-form-item label="活动">
        <el-checkbox-group v-model="checklist" style="width:400px">
          <!-- 遍历这个活动数组 -->
          <el-checkbox
            v-for="(item, index) in supports"
            :key="index"
            :label="item"
            >{{ item }}</el-checkbox
          >
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="营业时间">
        <el-time-picker
          is-range
          v-model="form.date"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          placeholder="选择时间范围"
        >
        </el-time-picker>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
// API_STORE：引入店铺详情接口
// ALL_UPLOAD:店铺头像以及店铺图片的接口，同时也可以在页面上看到这个图片
// IMGS_UPLOAD:店铺图片和头像上传的接口，同时也能在这里看到这些图片
// API_AMEND：修改店铺信息的接口
import { API_STORE, ALL_UPLOAD, IMGS_UPLOAD, API_AMEND } from "@/api/apis";

export default {
  data() {
    return {
      form: {},
      // 新数组保存后端传过来被选中的活动选项
      checklist: [],
      //活动数组
      supports: [
        "在线支付满28减5",
        "VC无限橙果汁全场8折",
        "单人精彩套餐",
        "特价饮品8折抢购",
        "单人特色套餐",
      ],
      //照片墙的值
      dialogVisible: false,
      // 店铺图片的数组
      fileList: [],
      // 店铺头像以及店铺图片的接口
      allupload: ALL_UPLOAD,
      // 店铺图片和头像上传的接口
      imgsupload: IMGS_UPLOAD,
    };
  },
  methods: {
    // 头像上传
    handleAvatarSuccess(res) {
      // console.log(res);
      // 此时店铺头像就换成当前上传的
      this.form.avatar = res.imgUrl;
    },
    // 照片墙移除的函数
    handleRemove(file, fileList) {
      // console.log(file, );
      // console.log(fileList);
      let arr = fileList.map((item) => {
        // item.url.lastIndexOf('/'+1):返回最后这个字符串出现的索引
        return item.url.slice(34);
      });
      // 直接把数组覆盖
      // console.log(arr);
      this.form.pics = arr;
      // console.log("pics", this.form.pics);
    },
    // 图片上传成功的函数
    uploadPictures(res) {
      // console.log(res);
      // 把上传的图片追加进原来页面中呈现的数组
      this.form.pics.push(res.imgUrl);
      // console.log("pics", this.form.pics);
    },
    // 点击保存调用修改店铺接口
    save() {
      // console.log("pics", this.form.pics); //上传的图片
      // console.log("date", this.form.date);//时间
      // console.log("checklist", this.checklist); //选中的活动的数组
      let newObj = { ...this.form }; //展开这个数组里面的所有值
      // console.log(newObj);
      // 图片，时间，新的照片都得转换为字符串传参
      newObj.pics = JSON.stringify(this.form.pics);
      newObj.date = JSON.stringify(this.form.date);
      newObj.supports = JSON.stringify(this.checklist);
      // 调用接口
      API_AMEND(newObj).then((res) => {
        // console.log(res);

        if (res.data.code == 0) {
          this.$message({
            message: "修改成功！",
            type: "success",
          });
        }
      });
    },
  },
  // 进入页面就调用接口，先把数组覆盖再说
  created() {
    API_STORE().then((res) => {
      // console.log(res.data.data);
      // 整个数组全部先覆盖
      this.form = res.data.data;
      // console.log(res.data.data.supports);
      // 当前选中的活动
      this.checklist = res.data.data.supports;
      // 时间
      // console.log(res.data.data.date);
      // console.log(this.form.date);

      // 店铺图片
      // console.log(res.data.data.pics);
      // 直接把数组赋值,因为取出来的都是图片的名字，得加一个地址。所以遍历
      // 而且在elementui里面这个数组的值就应该是[{name: 'food.jpg', url: 'https://xxx.cdn.com/xxx.jpg'}]
      // 但是这里name不需要，所以直接写url就行了，这一步是为了把获取到的图片展示在页面中
      this.fileList = res.data.data.pics.map((item) => {
        return { url: this.allupload + item };
      });
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
.el-card__header {
  padding: 4px 20px;
  line-height: 40px;

  .clearfix {
    span {
      font-weight: bold;
    }
  }
}
.el-textarea__inner {
  height: 100px;
}
</style>
