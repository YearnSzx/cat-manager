import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'  // ← 新增
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import CatList from '../views/CatList.vue'
import CatForm from '../views/CatForm.vue'
import CatDetail from '../views/CatDetail.vue'
import Profile from '../views/Profile.vue'  // ← 新增

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: Home  // ← 首页不需要登录
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresGuest: true }  // ← 已登录用户不能访问
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { requiresGuest: true }  // ← 已登录用户不能访问
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { requiresAuth: true }  // ← 需要登录
  },
  {
    path: '/cats',
    name: 'CatList',
    component: CatList,
    meta: { requiresAuth: true }
  },
  {
    path: '/cats/create',
    name: 'CatCreate',
    component: CatForm,
    meta: { requiresAuth: true }
  },
  {
    path: '/cats/edit/:id',
    name: 'CatEdit',
    component: CatForm,
    meta: { requiresAuth: true }
  },
  {
    path: '/cats/:id',
    name: 'CatDetail',
    component: CatDetail,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem('token')
  
  // 需要登录但未登录
  if (to.meta.requiresAuth && !token) {
    next('/login')
  }
  // 已登录但访问登录/注册页
  else if (to.meta.requiresGuest && token) {
    next('/cats')
  }
  // 其他情况正常访问
  else {
    next()
  }
})

export default router
