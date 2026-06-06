<script setup lang="ts">
import usePageRequest from '@renderer/composeable/usePageRequest'
import { getArtistMusicPage } from '@renderer/api/artist'
import { onBeforeRouteUpdate, useRoute } from 'vue-router'
import LoadingLayout from '@renderer/components/LoadingLayout.vue'
import MusicList from '@renderer/components/MusicList.vue'
import { onMounted } from 'vue'

const route = useRoute()

const { pageNo, data, error, loading, total, send, refresh } = usePageRequest(
  (pageNo, pageSize, artistId: number) => {
    return getArtistMusicPage({
      pageNo,
      pageSize,
      artistId: artistId || (+route.query.id as number)
    })
  }
)

onMounted(() => {
  send(+route.query.id as number)
})

onBeforeRouteUpdate((to) => {
  refresh(to.query.id)
})
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
    <MusicList :list="data" />
  </loading-layout>
</template>

<style scoped></style>
