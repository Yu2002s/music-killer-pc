import { createRouter, createWebHistory } from 'vue-router'
import routes from '@renderer/router/routes'

export default createRouter({
  history: createWebHistory(),
  routes
})
