<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>商品分类</span>
      <el-button
        style="float: right; padding: 3px 0"
        type="text"
        @click="addclick"
        >添加分类</el-button
      >
    </div>
    <!-- 表格 -->
    <el-table :data="tableData" style="width: 100%">
      <el-table-column label="序号" width="180" prop="id"> </el-table-column>
      <el-table-column label="分类名称" width="180">
        <template slot-scope="props">
          <el-input v-if="props.row.judge" v-model="props.row.cateName">
          </el-input>
          <span v-else>{{ props.row.cateName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否启用" width="180">
        <template slot-scope="props">
          <!-- 这个值是要与后台联动，并且改动时能传给后端 -->
          <el-switch
            v-model="props.row.state"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="0"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="props">
          <el-button
            v-if="props.row.judge"
            type="success"
            size="mini"
            @click="handleFinish(props.$index, props.row)"
            >完成</el-button
          >
          <el-button
            v-else
            size="mini"
            @click="handleEdit(props.$index, props.row)"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(props.$index, props.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <!-- 
      :current-page="currentPage":当前页的页数
      :page-size="pageSize":每页显示条数
       :total="total":共有多少条
     -->
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
    <el-dialog
      title="添加分类"
      :visible.sync="dialogFormVisible"
      :before-close="handleClose"
    >
      <el-form :model="chengelist">
        <el-form-item label="分类名称" :label-width="formLabelWidth">
          <el-input
            v-model="chengelist.cateName"
            autocomplete="off"
            style="width:220px"
            placeholder="分类名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="是否启用" :label-width="formLabelWidth">
          <template>
            <el-switch
              v-model="chengelist.state"
              active-color="#13ce66"
              inactive-color="#ff4949"
            >
            </el-switch>
          </template>
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
// 引入接口
// API_COMCATE:分类
// API_COMCATEDEL：删除
// API_COMCATEMOD：修改
// API_COMADD：添加分类,记住传的参state都是字符串类型，一定要转换为字符串
import {
  API_COMCATE,
  API_COMCATEDEL,
  API_COMCATEMOD,
  API_COMADD,
} from "@/api/apis";

export default {
  data() {
    return {
      // 表格
      tableData: [],
      // 是否启用
      value: "1",
      // 当前页的页数
      currentPage: 1,
      // 每页显示条数
      pageSize: 5,
      // 共有多少条
      total: 0,
      // 模态框的默认值,默认分类是启用
      chengelist: {
        cateName: null,
        state: true,
      },
      // 模态框是否隐藏的值
      dialogFormVisible: false,
      // 模态框里面的input框的宽度
      formLabelWidth: "120px",
      // input框隐藏还有按钮
      // judge: false,
    };
  },
  methods: {
    // 封装分类列表的接口
    catelist() {
      API_COMCATE(this.currentPage, this.pageSize).then((res) => {
        // console.log(res);
        // 表格里面的值，也就是等于返回的这个对象的值
        this.tableData = res.data.data;
        // 总条数
        this.total = res.data.total;
      });
    },
    // 每页
    handleSizeChange(val) {
      // 每页显示的条数，就是上面的5，10，15这个值，就是:page-sizes的值
      // console.log(`${val}val`);
      this.pageSize = val;
      // 再调用一次接口
      this.catelist();
    },
    // 当前页
    handleCurrentChange(val) {
      // 当前页,点几页就是第几页的数据，赋值给上面初始化保存的值，与数据库联动，有第二页就触发函数，获取第二页的数据以此类推
      // console.log(`${val}`);
      this.currentPage = val;
      // 再调用一次接口
      this.catelist();
    },
    // 表格中的编辑
    handleEdit(index, row) {
      // 首先使用$set把这个数据添加进对象
      this.$set(row, "judge", false);
      // 为true就是input框，可以编辑
      // 当前分类选项变为input框
      row.judge = true;
    },
    // 点击完成
    handleFinish(index, row) {
      // 上面的点击编辑出现input框，现在数据改变，获得参数就是
      // row.id ,row.cateName,row.state，
      // 是否启用的转换，1是启用，0是不启用
      // 为false就是0就是不启用
      let bool = row.state == 1 ? true : false;
      // console.log(bool);
      // 提示是否改变数据
      this.$confirm("此操作不可逆！请确认是否改变数据！", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // 调用修改的接口，传参的这个bool是一个字符串，那边接收要字符串才行
          API_COMCATEMOD(row.id, row.cateName, JSON.stringify(bool)).then(
            (res) => {
              // 如果修改成功提示用户修改成功
              if (res.data.code == 0) {
                // input框隐藏，完成按钮变为编辑按钮
                row.judge = false;
                // 再次调用接口
                this.catelist();
                // 提示
                this.$message({
                  type: "success",
                  message: "修改成功!",
                });
              }
            }
          );
        }) // 取消
        .catch(() => {
          // 模态框隐藏
          this.dialogFormVisible = false;
          // 再次调用接口
          this.acclist();
          this.$message({
            type: "info",
            message: "数据未改变！",
          });
        });
    },
    // 表格中的删除
    handleDelete(index, row) {
      // console.log(index, row);
      // 删除要提示，点击确定就调用删除接口传参id值
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        // 确定
        .then(() => {
          // 调用删除接口
          API_COMCATEDEL(row.id).then((res) => {
            // console.log(res);
            if (res.data.code == 0) {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              // 在调用一次列表接口
              this.catelist();
            }
          });
        }) // 取消
        .catch(() => {
          // 再次调用接口
          this.catelist();
          this.$message({
            type: "info",
            message: "数据未改变！",
          });
        });
    },
    // 添加分类
    addclick() {
      // 模态框显示
      this.dialogFormVisible = true;
    },
    // 模态框的确定
    sure() {
      // 调用添加分类接口
      API_COMADD(
        this.chengelist.cateName,
        JSON.stringify(this.chengelist.state)
      ).then((res) => {
        if (res.data.code == 0) {
          // 模态框隐藏
          this.dialogFormVisible = false;
          // 再次调用接口
          this.catelist();
          this.$message({
            type: "info",
            message: "添加成功！",
          });
        }
      });
    },
    // 模态框的取消
    cancel() {
      // console.log(111);
      // 模态框隐藏
      this.dialogFormVisible = false;

      // 在调用一次列表
      this.catelist();
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
  // 进入页面就调用接口
  created() {
    this.catelist();
  },
};
</script>

<style lang="less" scoped>
// 分页
.el-pagination {
  margin-top: 20px;
}
.clearfix {
  span {
    font-weight: bold;
  }
}
</style>
