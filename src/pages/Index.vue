<template>
  <el-container>
    <!-- 左边列表 -->
    <el-aside width="200px">
      <!-- default-active： 当前选中的index 
           unique-opened：只保留一个子菜单打开
      -->
      <el-menu
        :default-active="defaultActive"
        background-color="#304156"
        text-color="#fff"
        active-text-color="#4295EB"
        router
        unique-opened
      >
        <div class="list_div">
          <span class="iconfont icon-waimai"></span>
          <span>吃咤江湖会员中心</span>
        </div>
        <!-- 通过item.children判断创建那种类型的列表 -->
        <!-- 没有children就创建el-menu-item -->
        <!-- 有children就创建el-submenu -->

        <div v-for="(item, index) in newleftlist" :key="index">
          <!-- 有children就创建el-submenu -->
          <el-submenu v-if="item.children" :index="item.indexhash">
            <!-- 二级的标题 -->
            <template slot="title">
              <i :class="item.iclass"></i>
              <span>{{ item.title }}</span>
            </template>

            <!-- 二级列表 -->
            <el-menu-item
              v-for="child in item.children"
              :key="child.indexhash"
              :index="child.indexhash"
            >
              <span slot="title">{{ child.title }}</span>
            </el-menu-item>
          </el-submenu>

          <!-- 没有children就创建el-menu-item -->
          <!-- v-else是表示没得儿子就才创建这个 -->
          <el-menu-item v-else :index="item.indexhash">
            <i :class="item.iclass"></i>
            <span slot="title">{{ item.title }}</span>
          </el-menu-item>
        </div>
      </el-menu>
    </el-aside>

    <!-- 右边身体 -->
    <el-container>
      <!-- 右边头部 -->
      <el-header height="50px">
        <!-- 头左 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item v-for="item in breadarr" :key="item">{{
            item
          }}</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 头右 -->
        <div class="title_right">
          <div>
            <span v-html="userlogin"></span>
            <span v-html="username"></span>
          </div>
          <router-link to="/Index/personal">
            <el-avatar :src="img"> </el-avatar>
          </router-link>
        </div>
      </el-header>

      <!-- 右边身体 -->
      <el-main>
        <!-- 二级路由出口 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
// 引入token验证
import { API_TOKEN, API_PER } from "@/api/apis";

export default {
  data() {
    return {
      // leftlist:左边列表动态改变的数组
      // indexhash：点击跳转页面的hash值
      // iclass:选项的图标
      // title:一级；列表的名字
      // children：二级列表的值
      leftlist: [
        // 第一个就是首页的hash值
        {
          indexhash: "/Index/home",
          iclass: "el-icon-s-home",
          title: "后台首页",
          role: ["super", "normal"],
        },
        {
          indexhash: "/Index/order",
          iclass: "el-icon-document",
          title: "订单管理",
          role: ["super", "normal"],
        },
        {
          indexhash: "commodity",
          iclass: "el-icon-s-goods",
          title: "商品管理",
          role: ["super", "normal"],
          children: [
            { indexhash: "/Index/commodity/buyoff", title: "商品列表" },
            { indexhash: "/Index/commodity/addmerchan", title: "商品添加" },
            { indexhash: "/Index/commodity/category", title: "商品分类" },
          ],
        },
        {
          indexhash: "/Index/storeman",
          iclass: "el-icon-s-shop",
          title: "店铺管理",
          role: ["super"],
        },
        {
          indexhash: "account",
          iclass: "el-icon-s-custom",
          title: "账号管理",
          role: ["super"],
          children: [
            { indexhash: "/Index/account/acclist", title: "账号列表" },
            { indexhash: "/Index/account/accadd", title: "添加账号" },
            { indexhash: "/Index/account/accpwd", title: "修改密码" },
          ],
        },
        {
          indexhash: "market",
          iclass: "el-icon-s-data",
          title: "销售统计",
          role: ["super"],
          children: [
            { indexhash: "/Index/market/comstats", title: "商品统计" },
            { indexhash: "/Index/market/orderstats", title: "订单统计" },
          ],
        },
      ],
      // 权限role
      role: "",
      // 默认选中的激活值先设置为空,获取到hash值就直接覆盖,这是刷新默认首页激活样式的步骤
      defaultActive: "",
      // 保存一个为首页的数组,等下根据hash值变化改变面包屑文字
      breadarr: ["首页"],
      // 右边头部的文字
      userlogin: "欢迎你, ",
      username: "张三",
      // 定义一个头像的地址
      img: "",
    };
  },
  // 监听hash值变化
  watch: {
    //监听路由对象的变化,这一步是为了面包屑文字跟着hash值一起变化
    $route: {
      handler: (val) => {
        // 在这里this指向不正确，所以需要提前把this挂载到window上
        // 在这里取出当前的hash值(this.(val.path)),直接用this指向不正确,所以提前在事件钩子函数上面挂上this
        window._indexthis.changbreadarr(val.path);
        // 当hash值为个人中心的地址时，就刷新一次页面
        if (val.path == "/Index/personal") {
          window.location.reload();
        }
      },
      // 深度观察监听
      deep: true,
    },
  },
  // 通知组件内部data初始完毕的事件钩子函数
  created() {
    // 当前这个hash值对象,用route,所以现在得样子就是/index/home之类的
    let hash = this.$route.path;

    //根据hash值改变左边列表默认选中激活的样式
    this.defaultActive = hash;

    //挂载上面的this,也是面包屑换文字的步骤
    window._indexthis = this;

    // 把hash值传给函数,也是面包屑换文字的步骤
    this.changbreadarr(hash);

    // console.log(localStorage.getItem("usertoken"));

    // 本地存储的token取出来,验证是否过期,过期就不在登陆状态
    // 不过期就在登录状态
    API_TOKEN(localStorage.getItem("usertoken")).then((res) => {
      if (res.data.code == 0) {
        //还在登录状态
        this.username = localStorage.getItem("useracc");
      } else {
        //登录失效
        this.userlogin = "账号长时间未登录,已失效,请";
        this.username = "<a href='#/' style='color:blue;'>登录</a>";
      }
    });

    // 首先取出权限字符串，用于判断,赋值给之前保存的空role
    this.role = localStorage.getItem("userrole");

    // 调用个人中心的接口
    API_PER(localStorage.getItem("userId")).then((res) => {
      // console.log(res);
      // 把数组赋值
      this.img = res.data.accountInfo.imgUrl;
    });
  },
  methods: {
    // 根据hash值变化,也是为了改变面包屑文字
    changbreadarr(hash) {
      // 定义一个空数组
      let arr = [];
      // 通过switch来进行值得切换
      switch (hash) {
        case "/Index/home":
          arr = ["后台首页"];
          break;
        case "/Index/order":
          arr = ["订单管理"];
          break;
        case "/Index/commodity/buyoff":
          arr = ["商品管理", "商品列表"];
          break;
        case "/Index/commodity/addmerchan":
          arr = ["商品管理", "商品添加"];
          break;
        case "/Index/commodity/category":
          arr = ["商品管理", "商品分类"];
          break;
        case "/Index/storeman":
          arr = ["店铺管理"];
          break;
        case "/Index/account/acclist":
          arr = ["账号管理", "账号列表"];
          break;
        case "/Index/account/accadd":
          arr = ["账号管理", "添加账号"];
          break;
        case "/Index/account/accpwd":
          arr = ["账号管理", "修改密码"];
          break;
        case "/Index/market/comstats":
          arr = ["销售统计", "商品统计"];
          break;
        case "/Index/market/orderstats":
          arr = ["销售统计", "订单统计"];
          break;
        case "/Index/personal":
          arr = ["个人中心"];
          break;
      }

      // 赋值这个数组
      this.breadarr = arr;
    },
  },
  // 计算属性
  computed: {
    // 使用循环保存新的数组，列表就渲染这个新列表，使用filter，返回的是true和false，为true就把数据追加进去
    newleftlist() {
      // 返回结果
      // var arr = this.leftlist.filter( item => {
      //   return item.role.includes(this.role)
      // })
      // return arr
      return this.leftlist.filter((item) => item.role.includes(this.role));
    },
  },
};
</script>

<style lang="less" scoped>
@base: #304156; //主题灰色
@base2: #f0f2f5; //灰色

.el-container {
  height: 100%;
  // 左边列表
  .el-aside {
    background-color: @base;

    .list_div {
      text-align: center;
      padding: 10px 0;
      span{
        color: #fff;
        font-size: 18px;
      }
      span:first-child{
        font-size: 32px;
        color: #9BB7D8;
      }
    }

    .el-menu {
      border-right: 0;
    }
  }
  // 右边头部

  .el-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .title_right {
      display: flex;
      align-items: center;

      div {
        margin-right: 10px;
      }
    }
  }

  // 右边身体
  .el-main {
    background-color: @base2;
  }
}
</style>
