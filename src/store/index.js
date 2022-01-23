import Vuex from 'vuex'
import Vue from 'vue'


Vue.use(Vuex)

const actions = {

}

const mutations = {
    // 将登录态存到本地
    changeLogin(state,user){
        state.Authorization = user.Authorization
        localStorage.setItem('Authorization',user.Authorization)
    }
}

const state = {
    // 登录态储存信息
    Authorization : localStorage.getItem('Authorization') ? localStorage.getItem('Authorization') : ''
}


export default new Vuex.Store({
    actions,
    mutations,
    state
})