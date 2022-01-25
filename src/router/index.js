import Vue from 'vue'
import VueRouter from 'vue-router'
// import Navigation from '../components/Navigation'

import Project from '../pages/Project'
import Case from '../pages/Case'
import Login from '../components/Login'
import Index from '../components/Index'
Vue.use(VueRouter)


// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const Router = new VueRouter({
    routes:[
		{
            name:'index',
			path:'/home',
			component:Index,
			children:[
				{
					name:'project',
					path:'project',
					component:Project
				},
				{
					name:'case',
					path:'case',
					component:Case
				},
			]
		},
		{
			name:'login',
			path:'/',
			component:Login
		},
		
    ]
})


export default Router
