import { defineDict } from '@renderer/utils/dict'
import { Theme } from '@renderer/enums/theme'

export const themeDict = defineDict<typeof Theme>({
  AUTO: {
    label: '跟随系统',
    value: Theme.AUTO
  },
  LIGHT: {
    label: '亮色主题',
    value: Theme.LIGHT
  },
  DARK: {
    label: '深色主题',
    value: Theme.DARK
  }
})
