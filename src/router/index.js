import Vue from 'vue'
import VueRouter from 'vue-router'
// import Navigation from '../components/Navigation'

import Project from '../pages/Project'
import Case from '../pages/Case'
import Login from '../components/Login'
Vue.use(VueRouter)


// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const Router = new VueRouter({
    routes:[
		{
            name:'project',
			path:'/project',
			component:Project
		},
		{
            name:'case',
			path:'/case',
			component:Case
		},
		{
			name:'login',
			path:'/login',
			component:Login
		}
    ]
})

export default Router
