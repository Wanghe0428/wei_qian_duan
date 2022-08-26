import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)
export default new Vuex.Store({
    state: {
        state: {},
        project_id: ""
    },
    mutations: {
        setProject(state, val) {
            state.state = val
        }
    }
})