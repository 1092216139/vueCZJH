<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>商品列表</span>
    </div>
    <!-- 商品列表主体部分 -->
    <el-table :data="tableData" style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="商品 ID">
              <span>{{ props.row.id }}</span>
            </el-form-item>
            <el-form-item label="商品名称">
              <span>{{ props.row.name }}</span>
            </el-form-item>
            <el-form-item label="所属分类">
              <span>{{ props.row.category }}</span>
            </el-form-item>
            <el-form-item label="商品价格">
              <span>{{ props.row.price }}</span>
            </el-form-item>
            <el-form-item label="商品图片">
              <!-- <span>{{ props.row.imgUrl }}</span> -->
              <img
                :src="
                  'http://127.0.0.1:5000/upload/imgs/goods_img/' +
                    props.row.imgUrl
                "
                class="avatar"
              />
            </el-form-item>
            <el-form-item label="创建时间">
              <span>{{ props.row.ctime }}</span>
            </el-form-item>
            <el-form-item label="商品评价">
              <span>{{ props.row.rating }}</span>
            </el-form-item>
            <el-form-item label="商品销量">
              <span>{{ props.row.sellCount }}</span>
            </el-form-item>
            <el-form-item label="商品描述">
              <span>{{ props.row.goodsDesc }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="商品名称" width="180">
      </el-table-column>
      <el-table-column prop="category" label="所属分类" width="180">
      </el-table-column>
      <el-table-column prop="price" label="商品价格" width="180">
      </el-table-column>
      <el-table-column prop="imgUrl" label="商品图片" width="180">
        <template slot-scope="props">
          <img
            :src="
              'http://127.0.0.1:5000/upload/imgs/goods_img/' + props.row.imgUrl
            "
            class="avatar"
          />
        </template>
      </el-table-column>
      <el-table-column prop="goodsDesc" label="商品描述" width="180">
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="160">
        <template slot-scope="props">
          <el-button
            type="primary"
            size="small"
            @click="handleEdit(props.$index, props.row)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            size="small"
            @click="handleDelete(props.$index, props.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[5, 10, 15]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
    <!-- 模态框 -->
    <!-- 
      visible.sync:模态框隐藏状态，为true就是不隐藏
      formLabelWidth：里面框的一个宽度
      :before-close="handleClose"点击模态框旁边模态框消失的提示
     -->
    <el-dialog
      title="修改账户名和用户组"
      :visible.sync="dialogFormVisible"
      :before-close="handleClose"
    >
      <el-form :model="chengelist">
        <el-form-item label="商品名称" :label-width="formLabelWidth">
          <el-input
            v-model="chengelist.name"
            autocomplete="off"
            style="width:300px"
          ></el-input>
        </el-form-item>
        <el-form-item label="商品分类" :label-width="formLabelWidth">
          <el-select
            v-model="chengelist.category"
            placeholder="请选择商品种类"
            style="width:300px"
          >
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
        <el-form-item label="商品价格" :label-width="formLabelWidth">
          <el-input
            v-model="chengelist.price"
            autocomplete="off"
            style="width:300px"
          ></el-input>
        </el-form-item>
        <el-form-item label="商品图片地址" :label-width="formLabelWidth">
          <el-input
            v-model="chengelist.imgUrl"
            autocomplete="off"
            style="width:300px"
          ></el-input>
        </el-form-item>
        <el-form-item label="商品描述" :label-width="formLabelWidth">
          <el-input
            type="textarea"
            :rows="3"
            v-model="chengelist.goodsDesc"
            autocomplete="off"
            style="width:300px"
          ></el-input>
        </el-form-item>
        <el-form-item label="商品id" :label-width="formLabelWidth">
          <el-input
            disabled
            v-model="chengelist.id"
            autocomplete="off"
            style="width:300px"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="sure">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
// API_COMLIST:引入商品列表接口
// API_COMQUERY:查询分类的接口
// API_COMDEL:删除商品的接口
// API_COMMOD：编辑商品的接口
import { API_COMLIST, API_COMDEL, API_COMMOD, API_COMQUERY } from "@/api/apis";

export default {
  data() {
    return {
      // 列表数据
      tableData: [],
      // 当前页的页数
      currentPage: 1,
      // 每页显示条数
      pageSize: 5,
      // 共有多少条
      total: 0,
      // 模态框是否隐藏的值
      dialogFormVisible: false,
      // 模态框里面的input框的宽度
      formLabelWidth: "120px",
      // 模态框的值
      chengelist: {},
      // 分类接口的值
      categories: {},
    };
  },
  methods: {
    // 每页
    handleSizeChange(val) {
      // 每页显示的条数，就是上面的5，10，15这个值，就是:page-sizes的值
      // console.log(`${val}val`);
      this.pageSize = val;

      // 再调用一次接口，当前页面数据刷新
      this.comlist();
    },
    // 当前页
    handleCurrentChange(val) {
      // 当前页,点几页就是第几页的数据，赋值给上面初始化保存的值，与数据库联动，有第二页就触发函数，获取第二页的数据以此类推
      // console.log(`${val}`);

      this.currentPage = val;
      // 点击当前页再调用一次接口
      this.comlist();
    },
    // 封装函数
    comlist() {
      API_COMLIST(this.currentPage, this.pageSize).then((res) => {
        // total	数据总条数
        // data	当前页码对应的数据（数组）
        // id	数据唯一id
        // ctime	账号创建的时间
        // account	账号
        // userGroup	用户组
        // imgUrl	账号头像地址

        // 列表渲染的值
        this.tableData = res.data.data;
        // 总条数
        this.total = res.data.total;
      });
    },
    // 编辑
    handleEdit(index, row) {
      // console.log(index, row);
      // 点击模态框弹出
      this.dialogFormVisible = true;
      // 点击编辑账号就把当前这个选中的值渲染进模态框
      this.chengelist = row;
    },
    // 单选删除
    // idex是索引
    // row是数组
    handleDelete(index, row) {
      // console.log(index, row);
      // 删除要提示，点击确定就调用删除接口传参id值
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        API_COMDEL(row.id).then((res) => {
          if (res.data.code == 0) {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
          }
        });
        // 再调用一次上面封装的列表接口,重新渲染页面
        this.comlist();
      });
    },
    // 模态框点击确定与取消
    // 点击确定，调用修改接口
    sure() {
      // 提示是否改变数据
      this.$confirm("此操作不可逆！请确认是否改变数据！", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // 调用修改账户接口
          API_COMMOD(
            this.chengelist.id,
            this.chengelist.name,
            this.chengelist.category,
            this.chengelist.price,
            this.chengelist.imgUrl,
            this.chengelist.goodsDesc
          )
            // 确定
            .then((res) => {
              // console.log(res);
              // 如果修改成功提示用户修改成功
              if (res.data.code == 0) {
                // 模态框隐藏
                this.dialogFormVisible = false;
                // 再次调用接口
                this.comlist();
                // 提示
                this.$message({
                  type: "success",
                  message: "修改成功!",
                });
              }
            });
        })
        // 取消
        .catch(() => {
          // 模态框隐藏
          this.dialogFormVisible = false;
          // 再次调用接口
          this.comlist();
          this.$message({
            type: "info",
            message: "数据未改变！",
          });
        });
    },
    // 点击取消
    cancel() {
      // 模态框隐藏
      this.dialogFormVisible = false;
      // 再次调用接口
      this.comlist();
      this.$message({
        type: "success",
        message: "数据未改变!",
      });
      return;
    },
    // 点击模态框旁边的消失效果
    handleClose() {
      // 模态框不隐藏
      this.dialogFormVisible = true;
      // 提示
      this.$message({
        type: "success",
        message: "请确认或取消!",
      });
      return;
    },
  },
  created() {
    // 进入页面就调用一次函数
    this.comlist();
    // 进入页面就调用这个分类接口
    API_COMQUERY().then((res) => {
      // 直接把对象赋值
      this.categories = res.data.categories;
    });
  },
};
</script>

<style lang="less" scoped>
.el-card {
  // 主体描述
  .demo-table-expand {
    .el-form-item {
      margin-right: 0;
      margin-bottom: 0;
      width: 49%;
    }
  }
  // 分页
  .el-pagination {
    margin-top: 20px;
  }
  .cell {
    img {
      width: 100%;
    }
  }
}
</style>
