<script setup lang="ts">
import 'mdui/components/list'
import 'mdui/components/list-item'
import 'mdui/components/list-subheader.js'
import 'mdui/components/switch'
import { getDictLabel, getSavedDictValue, saveDictValue } from '@renderer/utils/dict'
import { statusDict } from '@renderer/dict/common'
import { StorageKey } from '@renderer/enums/storage'
import { Status } from '@renderer/enums/common'
import { themeDict } from '@renderer/dict/theme'
import { Theme } from '@renderer/enums/theme'
import MenuPopup from '@renderer/components/MenuPopup.vue'
import { useLayoutStore } from '@renderer/store/modules/layout'

const layoutStore = useLayoutStore()

function onAutoPlayStatusChange(e: any) {
  saveDictValue(
    statusDict,
    StorageKey.AUTO_PLAY,
    e.target.checked ? Status.ENABLED : Status.DISABLED
  )
}

function onThemeChange(theme: Theme) {
  layoutStore.setTheme(theme)
}
</script>

<template>
  <div>
    <mdui-list>
      <mdui-list-subheader>播放</mdui-list-subheader>
      <mdui-list-item headline="启动后自动播放" description="在程序启动后自动播放历史歌曲">
        <mdui-switch
          slot="end-icon"
          :checked="getSavedDictValue(statusDict, StorageKey.AUTO_PLAY, Status.DISABLED)"
          @change="onAutoPlayStatusChange"
        >
        </mdui-switch>
      </mdui-list-item>
      <mdui-list-subheader>显示</mdui-list-subheader>
      <mdui-list-item headline="深色模式">
        <div slot="end-icon" style="line-height: initial">
          <MenuPopup
            :dict-type="themeDict"
            :current-value="layoutStore.theme"
            @on-menu-item-click="onThemeChange"
          >
            <mdui-button variant="text">{{
              getDictLabel(themeDict, layoutStore.theme, Theme.AUTO)
            }}</mdui-button>
          </MenuPopup>
        </div>
      </mdui-list-item>
      <mdui-list-subheader>关于</mdui-list-subheader>
      <mdui-list-item
        headline="作者"
        description="冬日暖雨"
        target="_blank"
        href="http://www.jdynb.xyz"
      ></mdui-list-item>
      <mdui-list-item
        headline="其他App下载"
        description="更新App或下载其他App"
        target="_blank"
        href="http://app.jdynb.xyz"
      ></mdui-list-item>
      <mdui-list-item
        headline="Github"
        target="_blank"
        href="https://github.com/yu2002s/music-killer-pc"
      ></mdui-list-item>
    </mdui-list>
  </div>
</template>

<style scoped></style>
