<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>账户列表</span>
    </div>
    <!-- selection-change:当选中这个框会触发该事件，selection是参数 -->
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="selectionChange"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column
        prop="account"
        label="账号"
        width="120"
      ></el-table-column>
      <el-table-column
        prop="userGroup"
        label="用户组"
        width="120"
      ></el-table-column>
      <el-table-column
        prop="ctime"
        label="创建时间"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="block">
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
    </div>
    <!-- 按钮 -->
    <el-button type="danger" @click="accdelall">批量删除</el-button>
    <el-button type="primary" @click="toggleSelection()">取消选择</el-button>

    <!-- 更改账户的模态框 -->
    <!-- 
      visible.sync:模态框隐藏状态，为true就是不隐藏
      formLabelWidth：里面框的一个宽度
      :before-close="handleClose"点击模态框旁边一个函数的提示
     -->
    <el-dialog
      title="修改账户名和用户组"
      :visible.sync="dialogFormVisible"
      :before-close="handleClose"
    >
      <el-form :model="chengelist">
        <el-form-item label="账号名" :label-width="formLabelWidth">
          <el-input
            v-model="chengelist.account"
            autocomplete="off"
            style="width:220px"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户组" :label-width="formLabelWidth">
          <el-select v-model="chengelist.userGroup" placeholder="请选择用户组">
            <el-option label="超级管理员" value="超级管理员"></el-option>
            <el-option label="普通管理员" value="普通管理员"></el-option>
          </el-select>
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
// API_ACCLIST：账户列表接口
// API_ACCDEL：单选删除账号列表数据
// API_ACCDELALL：批量删除账号列表数据
// API_ACCMOD：修改账户的
import { API_ACCLIST, API_ACCDEL, API_ACCDELALL, API_ACCMOD } from "@/api/apis";
import moment from "moment";

export default {
  data() {
    return {
      // 列表
      tableData: [],
      // 当前页的页数
      currentPage: 1,
      // 每页显示条数
      pageSize: 5,
      // 共有多少条
      total: 0,
      // 模态框的值
      chengelist: {},
      // 模态框是否隐藏的值
      dialogFormVisible: false,
      // 模态框里面的input框的宽度
      formLabelWidth: "120px",
    };
  },

  methods: {
    // 每页
    handleSizeChange(val) {
      // 每页显示的条数，就是上面的5，10，15这个值，就是:page-sizes的值
      // console.log(`${val}val`);

      this.pageSize = val;

      // 再调用一次接口，当前页面数据刷新
      this.acclist();
    },
    // 当前页
    handleCurrentChange(val) {
      // 当前页,点几页就是第几页的数据，赋值给上面初始化保存的值，与数据库联动，有第二页就触发函数，获取第二页的数据以此类推
      // console.log(`${val}`);

      this.currentPage = val;
      // 点击当前页再调用一次接口
      this.acclist();
    },
    // 封装函数，等下点击分页得时候也调用列表接口
    acclist() {
      API_ACCLIST(this.currentPage, this.pageSize).then((res) => {
        // total	数据总条数
        // data	当前页码对应的数据（数组）
        // id	数据唯一id
        // ctime	账号创建的时间
        // account	账号
        // userGroup	用户组
        // imgUrl	账号头像地址

        this.tableData = res.data.data;
        // 总条数
        this.total = res.data.total;
        // 时间转换格式
        this.tableData.forEach((item) => {
          item.ctime = moment(item.ctime).format("YYYY-MM-DD HH:mm:ss");
        });
      });
    },
    // 单选删除当前选中的数据
    // idex是索引
    // row是数组
    handleDelete(index, row) {
      // console.log(index, row);
      // console.log(row.id);

      // 删除要提示，点击确定就调用删除接口传参id值
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        // 确定
        .then(() => {
          API_ACCDEL(row.id).then((res) => {
            if (res.data.code == 0) {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
            }
          });
          // 再调用一次上面封装的列表接口,重新渲染页面
          this.acclist();
        }) // 取消
        .catch(() => {
          // 再次调用接口
          this.acclist();
          this.$message({
            type: "info",
            message: "数据未改变！",
          });
        });
    },
    // 点击批量删除，当前所有选中的数据都删除
    accdelall() {
      // console.log(this.ids);

      // 在未选中数据的时候也提示用户要选中数据才行，否则就会没选中也会出现删除的提示弹框
      // 因为this.ids是挂在触发选框的时候才挂上去，此时没触发还没挂上去，还会报错，
      // 未选中时是没触发就是为空，选中又取消选中为0
      if (!this.ids || this.ids.length == 0) {
        this.$message("请先选中数据");
        return;
      }
      // 现在调用批量删除的接口,那边接收的数据是字符串样式的所以转化为字符串JSON.stringify(this.ids)
      this.$confirm("此操作将永久删除选中的所有数据, 是否继续?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        API_ACCDELALL(JSON.stringify(this.ids)).then((res) => {
          // 如果返回值为0说明删除成功，就弹出提示
          if (res.data.code == 0) {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
          }
        });
        // 再调用一次上面封装的列表接口,重新渲染页面
        this.acclist();
      });
    },
    // 选择项选中就会触发的事件
    selectionChange(selection) {
      // 拿到的是数组：[{...},{...}]
      // console.log(selection);
      // 为了点击批量删除就能拿到这个数组。挂在this上
      // 要得只是数组上的id这个参数，所以使用map方法遍历他拿到一个新的数组挂在this上
      // this.ids = selection.map((item) => {
      //   // 返回这个id挂上去
      //   return item.id;
      // });
      this.ids = selection.map((item) => item.id); //简化版
      console.log(this);

      // console.log(this.ids);
    },
    // 取消选择
    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    // 编辑账号
    // idex是索引
    // row是数组
    handleEdit(index, row) {
      // console.log(index, row);
      // 点击模态框弹出
      this.dialogFormVisible = true;

      // 点击获取到账户名，渲染在一个模态框里面的值中
      this.chengelist = row;
      // console.log(this.chengelist);
    },
    // 点击取消
    cancel() {
      // 模态框隐藏
      this.dialogFormVisible = false;
      // 再调一次接口
      this.acclist();
      this.$message({
        type: "success",
        message: "数据未改变!",
      });
      return;
    },

    // 点击确定
    sure() {
      // 提示是否改变数据
      this.$confirm("此操作不可逆！请确认是否改变数据！", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // 调用修改账户接口
          API_ACCMOD(
            this.chengelist.id,
            this.chengelist.account,
            this.chengelist.userGroup
          ) // 确定
            .then((res) => {
              // console.log(res);
              // 如果修改成功提示用户修改成功
              if (res.data.code == 0) {
                // 模态框隐藏
                this.dialogFormVisible = false;
                // 再次调用接口
                this.acclist();
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
          this.acclist();
          this.$message({
            type: "info",
            message: "数据未改变！",
          });
        });
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

  // 进入就调用列表接口
  created() {
    this.acclist();
  },
};
</script>

<style lang="less" scoped>
// 分页
.el-pagination {
  margin: 20px 0;
}
</style>
