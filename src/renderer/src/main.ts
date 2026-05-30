// import './assets/main.css'
import 'mdui/mdui.css'
// import 'mdui'
import '@renderer/styles/base.scss'

import { createApp } from 'vue'
import App from './App.vue'

import router from '@renderer/router'
import pinia from '@renderer/store'
import { setColorScheme } from 'mdui/functions/setColorScheme.js'

// 根据 #0061a4 生成一套配色方案，并将 <html> 设置为该配色方案
setColorScheme('#0061a4')

router.beforeEach((to, from, next) => {
  console.log(to.path, to.fullPath, to.query)
  next()
})

createApp(App).use(router).use(pinia).mount('#app')
