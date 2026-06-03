// import './assets/main.css'
import 'mdui/mdui.css'
// import 'mdui'
import '@renderer/styles/base.scss'

import { createApp } from 'vue'
import App from './App.vue'

import router from '@renderer/router'
import pinia from '@renderer/store'
import { setColorScheme } from 'mdui/functions/setColorScheme.js'
import { getSavedDictValue } from '@renderer/utils/dict'
import { themeDict } from '@renderer/dict/theme'
import { StorageKey } from '@renderer/enums/storage'
import { Theme } from '@renderer/enums/theme'
import { setTheme } from 'mdui'

// 根据 #0061a4 生成一套配色方案，并将 <html> 设置为该配色方案
setColorScheme('#0061a4')

const currentTheme = getSavedDictValue(themeDict, StorageKey.THEME, Theme.AUTO)
setTheme(currentTheme)

createApp(App).use(router).use(pinia).mount('#app')
