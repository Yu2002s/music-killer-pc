<template>
  <loading-layout :loading="loading" :error="error">
    <MusicList :list="data?.musicList || []" />
  </loading-layout>
</template>

<script setup lang="ts">
import useRequest from '@renderer/composeable/useRequest'
import { getAlbumMusicPage } from '@renderer/api/album'
import { useRoute } from 'vue-router'
import MusicList from '@renderer/components/MusicList.vue'
import LoadingLayout from '@renderer/components/LoadingLayout.vue'

const route = useRoute()

const { loading, data, error } = useRequest(() => getAlbumMusicPage(+route.params.id as number), {
  immediate: true
})
</script>

<style scoped lang="scss"></style>
