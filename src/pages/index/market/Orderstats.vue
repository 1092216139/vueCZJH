<template>
  <div class="stats_main">
    <!-- 时间范围 -->
    <div class="block">
      <span class="demonstration">时间范围</span>
      <!-- 
          format="yyyy 年 mm 月 dd 日 hh 时 mm 分 s 秒"
          value-format="yyyy-MM-dd hh:mm:ss"
          这是时间转换得写法
      -->
      <el-date-picker
        v-model="value"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        format="yyyy 年 mm 月 dd 日 hh 时 mm 分 s 秒"
        value-format="yyyy-MM-dd hh:mm:ss"
      >
      </el-date-picker>
      <el-button type="primary">查询</el-button>
    </div>
    <!-- 图表 -->
    <el-card class="box-card">
      <!-- echarts容器 -->
      <div id="card_echarts"></div>
    </el-card>
  </div>
</template>

<script>
// 引入echarts
import echarts from "echarts";

// API_ORDERSTATS:订单报表接口
import { API_ORDERSTATS } from "@/api/apis";
// 时间转换
import moment from "moment";

export default {
  data() {
    return {
      value: 0,
      orderTime: 0,
    };
  },

  // 在节点初始化完毕以后就初始化echarts
  mounted() {
    // console.log(this.orderTime);

    var myecharts = echarts.init(document.getElementById("card_echarts"));
    // 开启加载动画
    myecharts.showLoading();
    // 调用接口
    API_ORDERSTATS(this.orderTime).then((res) => {
      // console.log(res);
      // X轴的时间
      let orderTime = res.data.data.map((item) => {
        return (item.orderTime = moment(item.orderTime).format(
          "YYYY-MM-DD HH:mm:ss"
        ));
      });
      this.orderTime = orderTime;
      // console.log(this.orderTime);

      let orderAmount = res.data.data.map((item) => {
        return item.orderAmount;
      });
      // 时间转换格式

      let option = {
        color: ["#3398DB"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        // x轴的值
        xAxis: [
          {
            type: "category",
            data: this.orderTime,
            axisTick: {
              alignWithLabel: true,
            },
          },
        ],
        // y轴的值
        yAxis: [
          {
            type: "value",
          },
        ],
        series: [
          {
            name: "下单时间和金额",
            type: "bar",
            barWidth: "60%",
            data: orderAmount,
          },
        ],
      };
      // 初始化option
      myecharts.setOption(option);
      // 数据出现后停止加载动画
      myecharts.hideLoading();
    });
  },
};
</script>

<style lang="less" scoped>
.stats_main {
  .block {
    margin-bottom: 20px;
    align-items: center;

    .demonstration {
      padding: 0 10px 0 20px;
    }

    .el-button {
      margin-left: 10px;
      height: 42px;
      border: none;
    }
  }
  .box-card {
    #card_echarts {
      width: 100%;
      height: 300px;
      margin: auto;
    }
  }
}
</style>
