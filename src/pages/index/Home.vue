<template>
  <div>
    <!-- 订单和销售额那四个小框 -->
    <div class="home_four">
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="grid-content bg-purple home_div">
            <!-- 图标 -->
            <div class="home_div_icon">
              <span class="iconfont icon-dingdan1"></span>
            </div>
            <!-- 文字 -->
            <div class="home_div_text">
              <p>总订单</p>
              <p>{{ todayOrder }}</p>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple home_div">
            <div class="home_div_icon">
              <span class="iconfont icon-jine"></span>
            </div>
            <div class="home_div_text">
              <p>总销售额</p>
              <p>{{ totalAmount }}</p>
            </div>
          </div>
        </el-col>
        <el-col :span="6"
          ><div class="grid-content bg-purple home_div">
            <div class="home_div_icon">
              <span class="iconfont icon-dingdan"></span>
            </div>
            <div class="home_div_text">
              <p>今日订单数</p>
              <p>{{ totalOrder }}</p>
            </div>
          </div>
        </el-col>
        <el-col :span="6"
          ><div class="grid-content bg-purple home_div">
            <div class="home_div_icon">
              <span class="iconfont icon-jine_m"></span>
            </div>
            <div class="home_div_text">
              <p>今日销售额</p>
              <p>{{ totayAmount }}</p>
            </div>
          </div></el-col
        >
      </el-row>
    </div>
    <!-- 主体数据统计部分 -->
    <el-card class="box-card">
      <!-- 1.echarts容器 -->
      <div id="card_echarts"></div>
    </el-card>
  </div>
</template>

<script>
// 引入echarts
import echarts from "echarts";
// 引入首页报表接口
import { API_HOME } from "@/api/apis";

export default {
  data() {
    return {
      // 上面四个小框的值
      // 总订单
      todayOrder: 0,
      // 总销售额
      totalAmount: 0,
      // 今日订单
      totalOrder: 0,
      // 今日销售额
      totayAmount: 0,
    };
  },
  // 2.在节点全部初始化完成以后初始化echarts
  mounted() {
    var myecharts = echarts.init(document.getElementById("card_echarts"));
    // console.log(myecharts);
    // 开启加载动画
    myecharts.showLoading();
    // 3.配置表格对象(option)，让echarts根据此对象进行表格渲染
    // 但是这里要拿到数据才进行动态渲染，所以在接口里面配置对象option
    API_HOME().then((res) => {
      // console.log(res);
      // todayOrder: 189  总订单
      // totalAmount: 202466   总销售额
      // totalOrder: 5486  今日订单
      // totayAmount: 2189  今日销售额
      // 解构
      let {
        xData,
        orderData,
        amountData,
        todayOrder,
        totalAmount,
        totalOrder,
        totayAmount,
      } = res.data;
      // 把值赋值
      this.todayOrder = todayOrder; //总订单
      this.totalAmount = totalAmount; //总销售额
      this.totalOrder = totalOrder; //今日订单
      this.totayAmount = totayAmount; //今日销售额
      let option = {
        title: {
          text: "数据统计",
        },
        tooltip: {
          trigger: "axis",
        },
        legend: {
          data: ["金额数据", "订单数据"],
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        toolbox: {
          feature: {
            saveAsImage: {},
          },
        },
        // X轴的数据
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: xData,
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            name: "金额数据",
            type: "line",
            stack: "总量",
            data: amountData,
          },
          {
            name: "订单数据",
            type: "line",
            stack: "总量",
            data: orderData,
          },
        ],
      };

      myecharts.setOption(option);
      // 数据出现后停止加载动画
      myecharts.hideLoading();
    });
  },
};
</script>

<style lang="less" scoped>
/* 四个小框 */
.home_four {
  .home_div {
    display: flex;
    justify-content: space-between;
    background: #fff;
    padding: 10px 20px;
    text-align: center;
    margin: 10px 0 20px 0;
    align-items: center;

    .home_div_icon {
      .iconfont {
        font-size: 70px;
      }

      .icon-dingdan1 {
        color: #1698dc;
      }

      .icon-jine {
        color: #d4237a;
      }

      .icon-dingdan {
        color: #1296db;
      }

      .icon-jine_m {
        color: #1afa29;
      }
    }

    .home_div_text {
      p {
        margin: 0;
        font-size: 18px;
      }

      p:first-child {
        font-weight: bold;
        color: #cecece;
        padding-bottom: 10px;
      }

      p:last-child {
        font-weight: bold;
      }
    }
  }
}
/* 身体 */
.box-card {
  #card_echarts {
    width: 100%;
    height: 300px;
    margin: auto;
  }
}
</style>
