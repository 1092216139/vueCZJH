<template>
  <div class="stats_main">
    <!-- 时间范围 -->
    <div class="block">
      <span class="demonstration">时间范围</span>
      <el-date-picker
        v-model="value2"
        type="datetimerange"
        :picker-options="pickerOptions"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        align="right"
      >
      </el-date-picker>
      <el-button type="primary">查询</el-button>
    </div>
    <!-- 图表 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>商品统计</span>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {};
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
}
</style>
