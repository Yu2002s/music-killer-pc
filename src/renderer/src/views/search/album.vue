<script setup lang="ts">
import { useSearchStore } from '@renderer/store/modules/search'
import { searchAlbum } from '@renderer/api/search'
import usePageRequest from '@renderer/composeable/usePageRequest'
import AlbumList from '@renderer/components/AlbumList.vue'
import LoadingLayout from '@renderer/components/LoadingLayout.vue'

const searchStore = useSearchStore()

const { loading, data, error, pageNo, total } = usePageRequest(
  (pageNo, pageSize) =>
    searchAlbum({
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
    <AlbumList :album-list="data" />
  </loading-layout>
</template>

<style scoped></style>
