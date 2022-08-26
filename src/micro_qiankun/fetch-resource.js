// 异步请求函数
export const fetchResource = function (url) {
    const html = fetch(url).then(res => res.text()) //res为请求的所有资源，res.text()为请求到的数据的普通文本即页面的html
    return html
}