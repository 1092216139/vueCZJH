import axios from 'axios'

// 这里可以在简化一点，把这个服务器地址也另外写一下，都是为了方便维护
export const IP = 'http://localhost:5000'
// 这是店铺头像还有店铺图片的地址，也是为了外面能直接引用，便于维护
export const ALL_UPLOAD = IP + '/upload/shop/'
// 再封装一个店铺图片和头像上传的地址
export const IMGS_UPLOAD = IP + '/shop/upload/'
// 设置服务器IP地址
axios.defaults.baseURL = IP


// 因为我封装了,所以要传参进去才能获取到值,
// 前面的就是我传的参数,后面就是我拿到的这个参数要发送请求给后端
//1.API： 登录
//  account: 用户名,
//  password: 密码
export const API_LOGIN = (account, password) => axios.post("/users/checkLogin", { account, password })

//2.API: 添加账号
//  account: 账号
//  password: 密码
//  userGroup: 用户组  超级管理员|普通管理员
export const API_ACCADD = (account, password, userGroup) => axios.post("/users/add", { account, password, userGroup })

//3.API：获取账户列表
// currentPage: 当前页码
// pageSize: 每页条数

export const API_ACCLIST = (currentPage, pageSize) => axios.get("/users/list", { params: { currentPage, pageSize } })

//4. 单选 删除账号
// id: 要删除账号的id
export const API_ACCDEL = (id) => axios.get("/users/del", { params: { id } })

//5. 批量删除账号
// ids: 要删除账号的所有id
export const API_ACCDELALL = (ids) => axios.get("/users/batchdel", { params: { ids } })

//6. 修改账号
// id：要修改账号的id
// account：账号
// userGroup：用户组
export const API_ACCMOD = (id, account, userGroup) => axios.post("/users/edit", { id, account, userGroup })

// 7.验证旧密码是否正确
// oldPwd:旧密码
// id:帐号id
export const API_ACCOLDID = (id, oldPwd) => axios.get("/users/checkoldpwd", { params: { id, oldPwd } })

// 8.修改密码
// newPwd:新密码
// id:帐号id
export const API_ACCPWD = (id, newPwd) => axios.post("/users/editpwd", { id, newPwd })

//11. 验证token是否过期
// /users/checktoken
// token:是服务器返回,返回的就是字符串,在一定时间内会自动过期
export const API_TOKEN = (token) => axios.get("/users/checktoken", { params: { token } })

// 10. 获取账号（个人中心）信息
// id:帐号id
export const API_PER = (id) => axios.get("/users/accountinfo", { params: { id } })

// 11. 头像上传接口，不用写接口，在页面那边直接调用了接口
// id:帐号id
// export const API_UPHEADIMG = (id) => axios.post("/users/avatar_upload", {id})

// 19.获取商品列表
// currentPage:当前页码
// pageSize:每页条数
export const API_COMLIST = (currentPage, pageSize) => axios.get("/goods/list", { params: { currentPage, pageSize } })

// 20. 单选删除商品
// 请求地址：/goods/del
// id：要删除商品的id
export const API_COMDEL = (id) => axios.get("/goods/del", { params: { id } })

// 21. 修改商品
// name:商品名称
// category:商品分类
// price:商品价格
// imgUrl:商品图片地址
// goodsDesc:商品描述
// id:商品ID
export const API_COMMOD = (id, name, category, price, imgUrl, goodsDesc) => axios.post("/goods/edit", { id, name, category, price, imgUrl, goodsDesc })

// 13.获取分类
// currentPage:当前页码
// pageSize:每页条数
export const API_COMCATE = (currentPage, pageSize) => axios.get("/goods/catelist", { params: { currentPage, pageSize } })

// 14.删除分类
// id：分类id
export const API_COMCATEDEL = (id) => axios.get("/goods/delcate", { params: { id } })

// 15.修改分类
// id：分类id
// cateName：分类名称
// state：分类状态
export const API_COMCATEMOD = (id, cateName, state) => axios.post("/goods/editcate", { id, cateName, state })

// 12.添加分类
// cateName：分类名称
// state：是否启用
export const API_COMADD = (cateName, state) => axios.post("/goods/addcate", { cateName, state })

// 18.添加商品
// name：商品名称
// category：商品分类
// price：商品价格
// imgUrl：商品图片地址
// goodsDesc：商品描述
export const API_COMADDMER = (name, category, price, imgUrl, goodsDesc) => axios.post("/goods/add", { name, category, price, imgUrl, goodsDesc })

// 16.查询分类
// 不需要传参,直接调用接口就行了
export const API_COMQUERY = () => axios.get("/goods/categories")

// 20.首页报表接口
// 也是没有参数
export const API_HOME = () => axios.get("/order/totaldata")

// 26. 获取店铺详情
// 也是没得参数
export const API_STORE = () => axios.get("/shop/info")

// 28. 店铺内容修改
// id: 店铺id
// name: 店铺名称
// bulletin: 店铺公告
// avatar: 店铺头像
// deliveryPrice: 起送价格
// deliveryTime: 送达时间
// description: 店铺描述
// score: 店铺好评率
// sellCount: 店铺销量
// supports: string数组	活动支持
// pics：string数组	    图片上传
// date：string数组	    营业时间
// 传的对象就不用打花括号
export const API_AMEND = (newObj) => axios.post("/shop/edit", newObj)

// 30. 订单报表接口
// date	string	是	字符串格式数组，如["2019-10-01 00:00:00", "2019-10-10 00:00:00"]
export const API_ORDERSTATS = (date) => axios.get("/order/ordertotal", { params: { date } })

// 22. 获取订单列表,也是查询订单
// currentPage：当前页码
// pageSize：每页条数
// orderNo：订单号
// consignee：收货人
// phone：手机号
// orderState：订单状态
// date	string：字符串格类型如: ["2019-10-05 00:00:00","2019-10-10 00:00:00"]
export const API_ORDER = (currentPage, pageSize, orderNo, consignee, phone, orderState, date) => axios.get("/order/list", { params: { currentPage, pageSize, orderNo, consignee, phone, orderState, date } })

// 25. 修改订单
// id：要修改账号的id
// orderNo：订单号
// orderTime：下单时间
// phone：电话
// consignee：收货人
// deliverAddress：	送货地址
// deliveryTime：送达时间
// remarks：备注
// orderAmount：订单金额
// orderState：订单状态
export const API_REDACT = (newObj) => axios.post("/order/edit", newObj)

