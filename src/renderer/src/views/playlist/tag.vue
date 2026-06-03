<script setup lang="ts">
import LoadingLayout from '@renderer/components/LoadingLayout.vue'
import usePageRequest from '@renderer/composeable/usePageRequest'
import { getPlaylistPage, getTagPlaylistPage } from '@renderer/api/playlist'
import { useRoute } from 'vue-router'
import { ref } from 'vue'
import GridPlayList from '@renderer/components/GridPlayList.vue'

const route = useRoute()
const currentSortBy = ref('new')

const {
  data: playlistData,
  pageNo,
  error,
  loading,
  total,
  refresh
} = usePageRequest(
  (pageNo, pageSize) =>
    getTagPlaylistPage({
      pageNo,
      pageSize,
      id: route.params.id as string,
      order: currentSortBy.value
    }),
  {
    initialPage: {
      pageNo: 1,
      pageSize: 20
    },
    immediate: true
  }
)

function onSortChange(e: any) {
  currentSortBy.value = e.target.value
  refresh()
}
</script>

<template>
  <loading-layout
    v-model="pageNo"
    :loading="loading"
    :error="error"
    :total
    enable-load-more
    :item-count="playlistData.length"
  >
    <mdui-tabs :value="currentSortBy" @change="onSortChange">
      <mdui-tab value="new">最新</mdui-tab>
      <mdui-tab value="hot">最热</mdui-tab>
    </mdui-tabs>
    <GridPlayList :play-list="playlistData" />
  </loading-layout>
</template>

<style scoped></style>
