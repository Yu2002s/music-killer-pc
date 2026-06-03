<script setup lang="ts">
import { useRoute } from 'vue-router'
import usePageRequest from '@renderer/composeable/usePageRequest'
import { getArtistAlbumPage } from '@renderer/api/artist'
import LoadingLayout from '@renderer/components/LoadingLayout.vue'
import AlbumList from '@renderer/components/AlbumList.vue'

const route = useRoute()

const { pageNo, data, error, loading, total } = usePageRequest(
  (pageNo, pageSize) => {
    return getArtistAlbumPage({
      pageNo,
      pageSize,
      artistId: +route.query.id as number
    })
  },
  {
    immediate: true
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
