<script setup lang="ts">
import 'mdui/components/list'
import 'mdui/components/list-item'
import 'mdui/components/list-subheader.js'
import 'mdui/components/switch'
import { getSavedDictValue, saveDictValue } from '@renderer/utils/dict'
import { statusDict } from '@renderer/dict/common'
import { StorageKey } from '@renderer/enums/storage'
import { Status } from '@renderer/enums/common'

function onAutoPlayStatusChange(e: any) {
  saveDictValue(
    statusDict,
    StorageKey.AUTO_PLAY,
    e.target.checked ? Status.ENABLED : Status.DISABLED
  )
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
      <mdui-list-subheader>关于</mdui-list-subheader>
      <mdui-list-item
        headline="作者"
        description="冬日暖雨"
        target="_blank"
        href="http://www.jdynb.xyz"
      ></mdui-list-item>
      <mdui-list-item
        headline="其他App下载"
        target="_blank"
        href="http://app.jdynb.xyz"
      ></mdui-list-item>
    </mdui-list>
  </div>
</template>

<style scoped></style>
