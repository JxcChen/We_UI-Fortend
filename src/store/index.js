import Vuex from 'vuex'
import Vue from 'vue'
import axios from '../api/http';

Vue.use(Vuex)

const actions = {

}

const mutations = {
    // 将登录态存到本地
    getUserList(state,type){
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
            }else if(type === 'userShow'){
                response.data.data.forEach(user => {
                    if(user['is_superuser']){
                      user['user_type'] = '超级管理员'
                    }else{
                      user['user_type'] = '普通用户'
                    }
                  })
                  state.users = response.data.data
            }
          
        });
    },
    changePassword(state){
      state.isChangePassword = !state.isChangePassword
    }

}

const state = {
    // 用户列表
    users:[],
    isChangePassword:false
}


export default new Vuex.Store({
    actions,
    mutations,
    state
})