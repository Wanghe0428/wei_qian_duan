import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from "./store"
// 引入element-ui库
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// 引入qinakun框架内的方法
import { registerMicroApps, start } from "qiankun"
import actions from "./action"
// 引入自己写的src路径下的微前端框架micro_qiankun
// import { registerMicroApps, start } from "./micro_qiankun/index"
Vue.config.productionTip = false
Vue.use(ElementUI);

// 注册的应用列表
const apps = [
  // 子应用vue应用
  {
    name: 'vueApp',  //应用名字
    // 默认请求的url，并解析里面的js，因为此时父应用请求了子应用里面的资源，所以子应用必须支持跨域
    entry: "http://localhost:8001",
    //容器名，子应用挂载到哪个元素
    container: "#container",
    //路由匹配激活规则，当路由匹配到activeRule时，就会请求获取entry资源，然后渲染到container容器中
    activeRule: '/vue',
    // 通过props实现通信传递值
    props: { actions, msg: "w" }   //向子应用传递创建的全局状态
  },
  // 子应用react应用
  {
    name: "reactApp",
    // 默认请求的url，并解析这个文件里面的script标签，因为此时父应用请求了子应用里面的资源，所以子应用必须支持跨域
    entry: "http://localhost:8002",
    // 子应用挂载到哪个元素
    container: "#container",
    //激活规则，当路由切换到“/react”时，就会把本地端口为20000的子应用挂载到"#react"元素上
    activeRule: '/react'
  }
]
// 注册子应用
registerMicroApps(apps,
  // 可以设置一下加载逻辑，也可不用
  {
    beforeMount() {
      console.log(1);
    }
  })
// 启动子应用
start({
  sandbox: {
    // strictStyleIsolation: true,//使用shadow dom解决样式冲突
    experimentalStyleIsolation: true //是通过css 选择器范围来解决样式冲突，div[data-qiankun="vueApp"] #app {} 加入属性选择器进行限定
  },
  prefetch: false //取消预加载，即当不点击触发子应用加载时，不会去启动这些子应用
})
let vue = new Vue({
  router,
  store,
  render: h => h(App)
})
export default vue

vue.$mount('#app')