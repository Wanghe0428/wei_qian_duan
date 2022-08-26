<template>
  <div class="home">
    <button @click="handle1">点击向子应用发送消息</button>
    <button @click="handle2">点击向子应用发送消息</button>
    <p>当前显示的项目：{{ project }}</p>
    <div>
      <input type="text" ref="inp" v-model="val" />
      <button @click="add">点我</button>
    </div>
  </div>
</template>

<script>
import HelloWorld from "@/components/HelloWorld.vue"; //引入的HelloWorld组件
import actions from "../action";
import Vue from "../main";
export default {
  name: "Home",
  data() {
    return {
      val: "1",
      mes1: {
        project_id: "项目1",
      },
      mes2: {
        project_id: "项目2",
      },
    };
  },
  computed: {
    project() {
      return this.$store.state.project_id;
    },
  },
  mounted() {
    //测试防抖节流start
    function solution(callback, delay, ...args) {
      let time;
      return function () {
        if (time) {
          clearTimeout(time);
        }
        time = setTimeout(() => {
          callback(args[0]);
        }, delay);
      };
    }
    const callback = (data) => {
      // console.log(data);
      console.log(data);
      // console.log(this.val);
    };
    console.log(this);
    console.log(this.$refs.inp);
    // this.$refs["inp"].on("input", callback);
    // this.$refs.inp.$on("input", callback);
    // this.$refs.inp.addEventListener(
    //   "input",
    //   solution(callback, 1000, this.val)
    // );
    const inp = this.$refs.inp;
    inp.addEventListener("input", () => {
      // console.log(this.val);
    });
    // console.log(d);
    inp.addEventListener("input", () => {
      solution(callback, 1000, this.val)();
    });
    // solution(callback, 1000, this.$refs.inp.val);

    // 测试防抖节流end

    // 需要在mounted钩子函数中注册qiankun的观察者函数
    // 注册一个观察者函数
    // 一旦修改actions的内容就会触发这个onGlobalStateChange监听函数
    actions.onGlobalStateChange((state, prevState) => {
      // state为变更后的状态，prevState为变更前的状态
      console.log("主应用观察者，改变前的state为：", prevState);
      console.log("主应用观察者，改变后的state为：", state);
    });
  },
  watcher: {
    val() {
      console.log(this.val);
    },
  },
  methods: {
    add() {
      this.val++;
    },
    handle1() {
      actions.setGlobalState(this.mes1); //修改全局的actions
      this.$router.push("/vue"); //跳转到vue子应用中
    },
    handle2() {
      actions.setGlobalState(this.mes2); //修改全局的actions
      this.$router.push("/vue"); //跳转到vue子应用中
    },
  },

  components: {
    HelloWorld, //注册组件
  },
};
</script>
