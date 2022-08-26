# parent-vue
## qinakun框架的建议实现
实现内容：
1. 路由的动态拦截匹配子应用，重写了popState和replaceState api
2. 读取子应用
3. 渲染子应用
4. css使用shadowDom进行样式隔离（也可使用css前缀）
5. 沙箱机制可采用snapshot沙箱实现（暂未解决）

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
