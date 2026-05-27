import { createRouter, createWebHistory } from 'vue-router'
import routes from '@renderer/router/routes'

export default createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: (to, from, savedPosition) => {
    /*if (savedPosition) {
      return savedPosition
    }
    return {
      top: 0
    }*/
    return null
  }
})
