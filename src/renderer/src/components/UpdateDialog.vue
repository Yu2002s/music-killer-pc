<script setup lang="ts">
import 'mdui/components/dialog'
import 'mdui/components/button'
import { UpdateInfo } from 'electron-updater'
import { ref } from 'vue'

defineProps<{
  updateInfo: UpdateInfo | null
  downloadProgress?: number
}>()

const isShowDialog = ref<boolean>(true)

const emit = defineEmits(['onUpdate'])

function update() {
  emit('onUpdate')
}
</script>

<template>
  <mdui-dialog
    v-if="updateInfo && isShowDialog"
    :open="updateInfo && isShowDialog"
    close-on-overlay-click
    :headline="`发现新版本(${updateInfo.version})`"
    class="example-action"
  >
    <div slot="description">
      <div v-html="updateInfo.releaseNotes"></div>
      <mdui-button
        variant="text"
        href="https://github.com/yu2002s/music-killer-pc/releases"
        target="_blank"
        >手动更新(Github)</mdui-button
      >
    </div>
    <mdui-button slot="action" variant="text" @click="isShowDialog = false">取消</mdui-button>
    <mdui-button
      slot="action"
      variant="tonal"
      :loading="(downloadProgress || -1) >= 0"
      @click="update"
      >{{
        (downloadProgress || -1) >= 0 ? `下载中(${downloadProgress.toFixed(2)})` : '更新'
      }}</mdui-button
    >
  </mdui-dialog>
</template>

<style scoped></style>
