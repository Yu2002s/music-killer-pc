<script setup lang="ts">
import { useSearchStore } from '@renderer/store/modules/search'
import { searchPlaylist } from '@renderer/api/search'
import usePageRequest from '@renderer/composeable/usePageRequest'
import LoadingLayout from '@renderer/components/LoadingLayout.vue'
import GridPlayList from '@renderer/components/GridPlayList.vue'

const searchStore = useSearchStore()

const { loading, data, error, pageNo, total } = usePageRequest(
  (pageNo, pageSize) =>
    searchPlaylist({
      pageNo,
      pageSize,
      keyword: searchStore.keyword
    }),
  {
    immediate: !!searchStore.keyword
  }
)
</script>

<template>
  <loading-layout
    v-model="pageNo"
    :item-count="data.length"
    :loading="loading"
    :error="error"
    :total="total"
    enable-load-more
  >
    <GridPlayList :play-list="data" />
  </loading-layout>
</template>

<style scoped></style>
