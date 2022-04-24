import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    // 带登录
    {
      path: '/',
      name: 'login',
      component: require('@/views/login').default
    },
    {
      path: '/index',
      name: 'index',
      component: require('@/views/index').default
    },
    // 无登录
    // {
    //   path: '/',
    //   name: 'index',
    //   component: require('@/views/index').default
    // },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
