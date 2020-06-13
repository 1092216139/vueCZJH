import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../pages/Login.vue'
// 引入token验证API
import { API_TOKEN } from '@/api/apis'

Vue.use(VueRouter)

const router = new VueRouter({
    routes: [{
        // 默认为登录
        path: '/',
        name: 'Login',
        component: Login
    }, {
        // 初始化页面
        path: '/Index',
        name: 'Index',
        component: () => import('../pages/Index.vue'),
        // 权限路由
        meta: {
            role: ['super', 'normal']
        },
        children: [{
            // 首页
            path: '/Index/home',
            name: 'home',
            // 权限路由
            meta: {
                role: ['super', 'normal']
            },
            component: () => import('../pages/index/Home.vue')
        }, {
            // 订单管理
            path: '/Index/order',
            name: 'home',
            // 权限路由
            meta: {
                role: ['super', 'normal']
            },
            component: () => import('../pages/index/Order.vue')
        }, {
            // 商品管理下的商品列表
            path: '/Index/commodity/buyoff',
            name: 'buyoff',
            // 权限路由
            meta: {
                role: ['super', 'normal']
            },
            component: () => import('../pages/index/commodity/Buyoff.vue')
        }, {
            // 商品管理下的商品添加
            path: '/Index/commodity/addmerchan',
            name: 'addmerchan',
            // 权限路由
            meta: {
                role: ['super', 'normal']
            },
            component: () => import('../pages/index/commodity/Addmerchan.vue')
        }, {
            // 商品管理下的商品分类
            path: '/Index/commodity/category',
            name: 'category',
            // 权限路由
            meta: {
                role: ['super', 'normal']
            },
            component: () => import('../pages/index/commodity/Category.vue')
        }, {
            // 店铺管理
            path: '/Index/storeman',
            name: 'storeman',
            // 权限路由
            meta: {
                role: ['super']
            },
            component: () => import('../pages/index/Storeman.vue')
        }, {
            // 账号管理下的账号列表
            path: '/Index/account/acclist',
            name: 'acclist',
            // 权限路由
            meta: {
                role: ['super']
            },
            component: () => import('../pages/index/account/Acclist.vue')
        }, {
            // 账号管理下的添加账户
            path: '/Index/account/accadd',
            name: 'accadd',
            // 权限路由
            meta: {
                role: ['super']
            },
            component: () => import('../pages/index/account/Accadd.vue')
        }, {
            // 账户管理下的修改密码
            path: '/Index/account/accpwd',
            name: 'accpwd',
            // 权限路由
            meta: {
                role: ['super']
            },
            component: () => import('../pages/index/account/Accpwd.vue')
        }, {
            // 销售统计下的商品统计
            path: '/Index/market/comstats',
            name: 'comstats',
            // 权限路由
            meta: {
                role: ['super']
            },
            component: () => import('../pages/index/market/Comstats.vue')
        }, {
            // 销售统计下的订单统计
            path: '/Index/market/orderstats',
            name: 'orderstats',
            // 权限路由
            meta: {
                role: ['super']
            },
            component: () => import('../pages/index/market/Orderstats.vue')
        }, {
            // 个人中心
            path: '/Index/personal',
            name: 'personal',
            // 权限路由
            meta: {
                role: ['super', 'normal']
            },
            component: () => import('../pages/index/Personal.vue'),
        },]
    }]
})

// 参数，to：要跳转的地址
// 参数，from：当前的地址
// 参数，next：放行

router.beforeEach((to, from, next) => {
    // 路由拦截，未登录不能通过路由访问网页
    if (to.path != '/') {
        // 通过token判断登录状态拦截路由
        API_TOKEN(localStorage.getItem('usertoken')).then(res => {
            // 如果token没过期就是在登录状态，就放行
            if (res.data.code == 0) {
                // 放行
                // next()
                // 在这里再判断role,权限跳转，普通的不能访问超级的管理员
                // this.leftlist.filter(item => item.role.includes(this.role))
                // console.log(to.meta.role);
                // 判断当前这个meta里面是否包含本地返回的权限值
                let val = to.meta.role.includes(localStorage.getItem('userrole'))
                if (val == true) {
                    next()
                } else {
                    next(from.path)
                }

            } else {
                // 回到登陆页面
                next('/')
            }
        })
    } else {
        // 等于/的时候，就直接放行，否则页面什么都没有
        next()
    }
})

export default router