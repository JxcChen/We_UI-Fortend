import Vuex from 'vuex'
import Vue from 'vue'
import axios from 'axios';

Vue.use(Vuex)

const actions = {

}

const mutations = {
    // 将登录态存到本地
    changeLogin(state,user){
        state.Authorization = user.Authorization
        localStorage.setItem('Authorization',user.Authorization)
        localStorage.setItem('User',user.name)
        localStorage.setItem('UserId',user.id)
        state.isLogin = true
    },
    getUserList(state,type){
        console.log(type)
        axios
        .get("http://127.0.0.1:8001/api/user/", {
          headers: {
            Authorization: localStorage.getItem('Authorization'),
          },
          responseType: "json",
        })
        .then((response) => {
            if(type === 'except_current'){
                
                state.users = response.data.data.filter(user => user.id != localStorage.UserId)
            }else if(type === 'all'){
                state.users = response.data.data
            }
          
        });
    }

}

const state = {
    // 登录态储存信息
    Authorization : localStorage.getItem('Authorization') ? localStorage.getItem('Authorization') : '',
    isLogin: false,
    users:[]
}


export default new Vuex.Store({
    actions,
    mutations,
    state
})