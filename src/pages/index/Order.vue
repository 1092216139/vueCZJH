<template>
  <div>
    <!-- 订单主体部分 -->
    <el-card class="box-card">
      <!-- 订单号等输入框 -->
      <el-form ref="form" :model="form" label-width="80px">
        <!-- 订单号等数据 -->
        <el-row :gutter="20">
          <!-- 订单号 -->
          <el-col :span="6">
            <el-form-item label="订单号">
              <el-input v-model="form.orderNo" placeholder="订单号"></el-input>
            </el-form-item>
          </el-col>

          <!-- 收货人 -->
          <el-col :span="6">
            <el-form-item label="收货人">
              <el-input
                v-model="form.consignee"
                placeholder="收货人"
              ></el-input>
            </el-form-item>
          </el-col>

          <!-- 手机号 -->
          <el-col :span="6">
            <el-form-item label="手机号">
              <el-input v-model="form.phone" placeholder="手机号"></el-input>
            </el-form-item>
          </el-col>

          <!-- 订单状态 -->
          <el-col :span="6">
            <el-form-item label="订单状态">
              <el-select placeholder="订单状态" v-model="form.orderState">
                <el-option
                  v-for="item in state"
                  :key="item.id"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 时间选择 -->
        <div class="time">
          <el-form-item label="选择时间">
            <!-- 
              format="yyyy 年 mm 月 dd 日 hh 时 mm 分 s 秒"
              value-format="yyyy-MM-dd hh:mm:ss"
              这是时间转换得写法
             -->
            <el-date-picker
              v-model="date"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              align="right"
              format="yyyy 年 mm 月 dd 日 hh 时 mm 分 s 秒"
              value-format="yyyy-MM-dd hh:mm:ss"
            >
            </el-date-picker>
          </el-form-item>
          <el-button type="primary" class="primary_btn" @click="search"
            >查询</el-button
          >
        </div>
      </el-form>
      <!-- 表格 -->
      <el-table :data="tableData" border>
        <el-table-column fixed prop="orderNo" label="订单号" width="150">
        </el-table-column>
        <el-table-column prop="orderTime" label="下单时间" width="120">
        </el-table-column>
        <el-table-column prop="phone" label="手机号" width="120">
        </el-table-column>
        <el-table-column prop="consignee" label="收货人" width="120">
        </el-table-column>
        <el-table-column prop="deliverAddress" label="配送地址" width="300">
        </el-table-column>
        <el-table-column prop="deliveryTime" label="送达时间" width="120">
        </el-table-column>
        <el-table-column prop="remarks" label="用户备注" width="120">
        </el-table-column>
        <el-table-column prop="orderAmount" label="订单金额" width="120">
        </el-table-column>
        <el-table-column prop="orderState" label="订单状态" width="120">
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" size="small"
              >查看</el-button
            >
            <el-button type="text" size="small" @click="redactClick(scope.row)"
              >编辑</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5, 10, 20, 50]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>

      <!-- 模态框 -->
      <el-dialog title="订单信息" :visible.sync="dialogFormVisible">
        <!-- :disabled="flag"禁用状态值 -->
        <el-form :model="newlist">
          <el-form-item label="订单号" :label-width="formLabelWidth">
            <el-input v-model="newlist.orderNo" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="下单时间" :label-width="formLabelWidth">
            <el-input v-model="newlist.orderTime" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="手机号" :label-width="formLabelWidth">
            <el-input v-model="newlist.phone" :disabled="flag"></el-input>
          </el-form-item>
          <el-form-item label="收货人" :label-width="formLabelWidth">
            <el-input v-model="newlist.consignee" :disabled="flag"></el-input>
          </el-form-item>
          <el-form-item label="配送地址" :label-width="formLabelWidth">
            <el-input
              v-model="newlist.deliverAddress"
              :disabled="flag"
            ></el-input>
          </el-form-item>
          <el-form-item label="送达时间" :label-width="formLabelWidth">
            <el-input
              v-model="newlist.deliveryTime"
              :disabled="flag"
            ></el-input>
          </el-form-item>
          <el-form-item label="用户备注" :label-width="formLabelWidth">
            <el-input v-model="newlist.remarks" :disabled="flag"></el-input>
          </el-form-item>
          <el-form-item label="订单金额" :label-width="formLabelWidth">
            <el-input v-model="newlist.orderAmount" :disabled="flag"></el-input>
          </el-form-item>
          <el-form-item label="订单状态" :label-width="formLabelWidth">
            <el-select placeholder="订单状态" v-model="newlist.orderState">
              <el-option
                v-for="item in state"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="sure">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
// API_ORDER：引入订单列表接口
// API_REDACT：修改订单接口
import { API_ORDER, API_REDACT } from "@/api/apis";
import moment from "moment";

export default {
  data() {
    return {
      // 表格数据
      tableData: [],
      // 订单数据
      form: {
        orderNo: "", //订单号
        consignee: "", //收货人
        phone: "", //手机号
        orderState: "", //订单状态
      },
      // 选择时间
      date: [],
      // 状态的值,写一个死的，活得在form中
      state: [
        {
          value: "已受理",
          label: "已受理",
        },
        {
          value: "派送中",
          label: "派送中",
        },
        {
          value: "已完成",
          label: "已完成",
        },
      ],
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
      // 模态框得取值
      newlist: [],
      // 禁用状态值
      flag: true,
    };
  },
  created() {
    // 进入页面就调用订单列表接口
    this.orderlist();
  },
  methods: {
    // 查询
    search() {
      // console.log("查询");
      // 再调一次接口
      // this.form.orderState === '选项一' ? this.form.orderState = '已受理' : this.form.orderState === '选项二' ? this.form.orderState = '派送中' : this.form.orderState = '已完成'
      this.orderlist();
    },
    // 每页
    handleSizeChange(val) {
      // 每页显示的条数，就是上面的5，10，15这个值，就是:page-sizes的值
      // console.log(`${val}val`);
      this.pageSize = val;
      // 再调用一次接口，当前页面数据刷新
      this.orderlist();
    },
    // 当前页
    handleCurrentChange(val) {
      // 当前页,点几页就是第几页的数据，赋值给上面初始化保存的值，与数据库联动，有第二页就触发函数，获取第二页的数据以此类推
      // console.log(`${val}`);
      this.currentPage = val;
      // // 点击当前页再调用一次接口
      this.orderlist();
    },
    // 封装表格数据
    orderlist() {
      // console.log(this.date);
      // 解构
      let { orderNo, consignee, phone, orderState } = this.form;

      API_ORDER(
        this.currentPage,
        this.pageSize,
        orderNo,
        consignee,
        phone,
        orderState,
        JSON.stringify(this.date)
      ).then((res) => {
        // console.log(res);
        let { data, total } = res.data;
        // 表格数据
        this.tableData = data;
        this.tableData.forEach((element) => {
          element.deliveryTime = moment(element.deliveryTime).format(
            "YYYY-MM-DD HH:mm:ss"
          );
          element.orderTime = moment(element.orderTime).format(
            "YYYY-MM-DD HH:mm:ss"
          );
        });

        // 总条数
        this.total = total;
      });
    },
    // 查看当前数据
    handleClick(row) {
      // console.log(row);
      // 模态框弹出
      this.dialogFormVisible = true;
      // 赋值新数组
      this.newlist = row;
    },
    // 点击编辑
    redactClick(row) {
      // console.log(row);
      // 这里也要赋值新数组，不然就出错
      this.newlist = row;
      // 模态框弹出
      this.dialogFormVisible = true;
      // 禁用取消
      this.flag = false;
    },
    // 点击取消
    cancel() {
      // 模态框隐藏
      this.dialogFormVisible = false;
      // 再调一次接口
      this.orderlist();
    },

    // 点击确定
    sure() {
      // console.log(111);
      // 把当前这个数组展开
      let newObj = { ...this.newlist };
      // 调用接口
      API_REDACT(newObj).then((res) => {
        if (res.data.code == 0) {
          this.$message({
            message: "修改成功！",
            type: "success",
          });
          // 模态框隐藏
          this.dialogFormVisible = false;
          // 再调一次接口
          this.orderlist();
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
// 分页
.time {
  display: flex;

  .primary_btn {
    height: 41px;
    margin-left: 20px;
  }
}
.el-pagination {
  margin-top: 20px;
}
</style>
