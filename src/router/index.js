import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
import financeRouter from './modules/finance-manage'
/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    // redirect: '/home',
    // children: [
    //   {
    //     path: 'home',
    //     component: () => import('@/views/home/index'),
    //     name: 'home',
    //     meta: { title: '我的工作台', icon: 'dashboard', affix: true }
    //   }
    // ]
  },
  {
    path: '/personal',
    component: Layout,
    redirect: '/personal/personal-data',
    alwaysShow: false, 
    name:'personal',
    children: [
      {
        path: '/change-password',
        name:'change-password',
        component: () => import('@/views/personal/change-password'),
        hidden: true,
        meta: { title: '修改密码',}
      },
    ]
  },
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
   {
    path: '/workbench',
    component: Layout,
    redirect: '/home',
    id:58,
    children: [
      {
        path: 'home',
        component: () => import('@/views/home/index'),
        name: 'home',
        id:63,
        meta: { title: '我的工作台', icon: 'dashboard', affix: true }
      }
    ]
  },
  financeRouter, // 财务管理
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
