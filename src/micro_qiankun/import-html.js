// 用于解析出html代码中的script脚本的方法
// 其实qiankun框架里面有用一个库即import-html-entry，其封装了一些从html文件中提取script标签，并动态执行script脚本的方法，而且这个库中也封装了沙箱机制

import { fetchResource } from "./fetch-resource"

// 这里我们仿造import-html-entry库，然后自己手写几个类似的方法
export const importHTML = async function (url) {
    // 加载子应用就是请求获取app的entry资源，资源有很多种，有HTML、css、js，所以我们要一个个来处理
    const html = await fetchResource(url)
    // 先来请求html资源,可以使用很多异步请求方式：ajax、aiox、fetch
    const template = document.createElement("div")
    template.innerHTML = html
    // 获取template的dom下的所有script脚本
    const scripts = template.querySelectorAll("script")
    // 获取所有script标签脚本代码，最后返回一个数组的形式
    const getExternalScripts = function () {
        console.log(scripts)
        // promise.all的返回值是一个promise数组
        return Promise.all(Array.from(scripts).map(script => {
            const src = script.getAttribute("src")
            if (!src) {//如果script脚本没有src，那么就是普通的script标签里面的script代码
                // 那么就只返回script里面的代码，并封装成promise对象
                return Promise.resolve(script.innerHTML)
            } else {//表示此script脚本是外链的资源，资源在src中
                return fetchResource(//需要判断src是以http开头比如http://www.nativejs.com，则资源是http外网资源;
                    // 如果是一种相对路径资源比如：/src/res则需要手动加上子应用的域名
                    src.startsWith("http") ? src : url + src
                )//直接发送异步请求
            }
        }))
    }
    // 获取并执行所有的script脚本代码
    const execScripts = async function () {
        // 拿到html中的scripts脚，它是一个script代码字符串构成的数组
        const scripts = await getExternalScripts()

        // 手动的构造一个commonJs环境，commonJs规则，里面有一个module对象，还有一个exports对象并且指向module.exports对象
        const module = { exports: {} }
        const exports = module.exports

        console.log(scripts);
        // 执行scripts数组中的script字符串代码，这里依然是使用eval函数来执行字符串代码
        scripts.forEach(script => {
            // eval执行的代码可以访问外部代码
            eval(script)
        })
        // 由于子模块到出的库格式为umd库，并且将返回的数据挂载到了window对象上，
        // 所以我们可以在window对象上拿到子应用的生命周期钩子函数，需要注意的是生命周期钩子必须写在子应用的入口文件main.js，然后webpack打包的时候首先进入入口文件，然后再递归查找依赖的文件进行打包
        // 因为我们自己构造了commonJs环境，那么我就能够通过module.exports拿到回调函数factory()返回的结果
        console.log(module.exports)
        return module.exports
    }

    return {
        template, //teplate为处理之后的html模板字符串
        getExternalScripts, //调用它会得到所有的script脚本
        execScripts //用来执行文档中所有的script脚本
    }
}
