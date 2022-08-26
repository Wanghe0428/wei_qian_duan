// 重写路由监听的函数，主要是实现pushState和replaceState在实现路由跳转时，popState事件监听函数不能够监听到其跳转，所以需要重写这两个路由跳转方法

// 引入handleRouter函数，用来处理路由跳转后，让其匹配子应用、加载子应用、渲染子应用
import { handleRouter } from "./handle-router";

// 用于记录上一个路由
let preRoute = ""
let nextRoute = window.location.pathname
const getPrevRoute = function () {
    return preRoute
}
const getNextRoute = function () {
    return nextRoute
}
export {
    getPrevRoute,
    getNextRoute
}

export const rewriteRouter = function () {
    // 路由的两种模式：hash、history
    // 监听hash路由使用window.onhashchange
    // 这里我们使用history路由来实现，采用history.go、history.back、history.forword方法来进行路由跳转
    // 在history路由中我们使用onpopstate事件函数来监听history路由的变化，但是popstate事件函数只能监听到history.go、forward、back的切换路由方式，
    window.addEventListener("popstate", () => {
        // popState触发的时候，路由已经完成导航了
        // 且之前的路由preRoute的就等于之前的nextRoute，
        preRoute = nextRoute
        // 而跳转的nextRoute路由就是的当前最新的window.loacation.pathname
        nextRoute = window.location.pathname
        handleRouter()
    })
    // 但是它不能够监听到pushState添加历史记录（就是在页面中点击某个a标签进行跳转的方式，点击页面顺序：a->b->c，记录的历史记录中a、b、c都存在，而replaceState则不同）、replaceState（点击页面顺序：a->b->c，记录的历史记录中只有a->c，即用c代替了b记录，b记录被删除了）切换路由的方式
    // 对于pushState、replaceState需要通过函数重写的方式进行劫持，也就是说我们重写pushState和replaceState
    // 但是我们一般都是pushState来跳转链接，是通过this.$router.replace()来触发；而pushState()是通过this.$router.push()来触发
    // 重写pushState方法
    const rawPushState = window.history.pushState
    window.history.pushState = function (...args) {
        // 导航前
        preRoute = window.location.pathname //记录跳转前的路由路径
        rawPushState.apply(window.history, args) //使用pushState进行跳转
        // 导航后
        nextRoute = window.location.pathname //记录跳转后的路由路径
        handleRouter()

        console.log("终于监视到pushState了");
    }
    // 重写replaceState方法
    const rawReplaceState = window.history.replaceState
    window.history.replaceState = function (...args) {
        // 导航前
        preRoute = window.location.pathname //记录跳转前的路由路径
        rawReplaceState.apply(window.history, args)
        // 导航后
        nextRoute = window.location.pathname //记录跳转后的路由路径
        handleRouter()
        console.log("终于监视到replaceState了");
    }
}