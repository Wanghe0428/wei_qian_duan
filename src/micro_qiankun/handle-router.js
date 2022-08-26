// 此函数用来处理路由跳转后，让其处理子应用即匹配子应用、加载子应用、渲染子应用
import { getApps } from ".";
import { importHTML } from "./import-html";
import { getNextRoute, getPrevRoute } from "./rewrite-router";
export const handleRouter = async function () {
    const apps = getApps() //获取当前子应用列表数组
    // 需要先判断是否还有上一个子应用
    let preRoute = getPrevRoute() //获取上一个路由路径window.location.pathname
    let nextRoute = getNextRoute() //获取跳转后的路由路径

    // 获取上一个路由的子应用
    const preApp = apps.find(item => preRoute.startsWith(item.activeRule))

    // 2.2 然后子apps子应用中查找
    // [name, entry, container, activeRule, mount, unmout, bootStrap]
    // 获取跳转后的子应用
    const app = apps.find(item => nextRoute.startsWith(item.activeRule))//str.startWith(str1)，字符串str如果以str1开头，那么就返回true
    // 如果有上一个应用，那么就先销毁，然后再加载当前的子应用
    if (preApp) {
        await unmount(preApp)//此时preApp已经有自己的声明周期钩子的，这是在上一个子应用中已经设置的
    }
    if (!app) { //如果当前路由路径pathname没有子应用，直接return返回
        return
    }
    // 2.匹配子应用
    // 2.1 首先获取当前的路由路径 window.location.pathname
    // console.log(window.location.pathname)


    // 3.加载子应用
    // 加载子应用就是请求获取app的entry资源，资源有很多种，有HTML、css、js，所以我们要一个个来处理
    // 先来请求html资源,可以使用很多异步请求方式：ajax、aiox、fetch
    // const html = await fetch(app.entry).then(res => res.text()) //res为请求的所有资源，res.text()为请求到的数据的普通文本即页面的html
    // console.log(html)

    // 配置全局环境变量
    window.__POWERED_BY_QIANKUN__ = true
    window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__ = app.entry + "/"

    //获取自己封装的加载子应用的api 
    const {
        template, //teplate为处理之后的html模板字符串
        getExternalScripts, //调用它会得到所有的script脚本
        execScripts //用来执行文档中所有的script脚本
    } = await importHTML(app.entry) //这里必须是异步调用

    // // 4.渲染子应用，渲染到container中
    // // 获取渲染的容器
    const container = document.querySelector(app.container)
    container.append(template)

    // // 拿到html中的script脚本
    // getExternalScripts().then(res => {
    // })
    // 执行获取到的脚本，用于获取声明周期
    const appExports = await execScripts()
    // console.log(appExports);
    app.bootstrap = appExports.bootstrap
    app.mount = appExports.mount
    app.unmount = appExports.unmount
    console.log(app.mount)
    // 调用子应用的声明周期钩子函数来进行渲染
    await bootstrap(app)
    await mount(app)
    // container.innerHTML = template  //虽然此时在container中已经含有此html页面了，但是依然不能够在页面中渲染出页面
    //以上不能渲染成功的原因如下：
    // a.客户端渲染需要通过js来生成内容
    // b. 浏览器处于安全考虑，innerHTML中的script不会加载执行 ，所以需要我们手动加载执行
    // 手动加载子应用的script，执行script中的代码
    // 执行script中的字符串代码可以使用：1.使用eval(str)函数来执行字符串str的js内容；2：使用new Function
}
async function mount(app) {
    app.mount && (await app.mount({
        container: document.querySelector(app.container)
    }))
}


async function unmount(app) {
    app.unmount && (await app.unmount(app.container))
}

async function bootstrap(app) {
    app.bootstrap && (await app.bootstrap(app.container))
}