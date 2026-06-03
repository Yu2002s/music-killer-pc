import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getSavedDictValue, saveDictValue } from '@renderer/utils/dict'
import { themeDict } from '@renderer/dict/theme'
import { StorageKey } from '@renderer/enums/storage'
import { Theme } from '@renderer/enums/theme'
import { setTheme } from 'mdui'

export const useLayoutStore = defineStore('layout', () => {
  // 是否折叠侧边栏
  const isExpandBottomBar = ref(false)

  const appTheme = ref(getSavedDictValue(themeDict, StorageKey.THEME, Theme.AUTO))

  function setAppTheme(theme: Theme) {
    saveDictValue(themeDict, StorageKey.THEME, theme)
    setTheme(theme)
    appTheme.value = theme
  }

  return {
    setTheme: setAppTheme,
    theme: appTheme,
    isExpandBottomBar
  }
})
