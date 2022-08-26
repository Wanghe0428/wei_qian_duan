<template>
  <!-- 微前端基座父应用 -->

  <div>
    <!-- el-menu为elementUi库的ui导航组件 -->
    <el-menu :router="true" mode="horizontal">
      <!-- 基座可以放置自己的应用 -->
      <el-menu-item index="/">Home</el-menu-item>
      <!--基座也可以引用其他子应用  -->
      <el-menu-item index="/vue">vue应用</el-menu-item>
      <el-menu-item index="/react">react应用</el-menu-item>
      <button @click="$router.replace('/sub/vue')">replace 测试</button>
    </el-menu>
    <!-- 主应用路由渲染出口，显示默认情况的应用 -->
    <router-view></router-view>
    <!-- 以下是微前端子应用的渲染出口 -->
    <div id="container"></div>
  </div>
</template>


