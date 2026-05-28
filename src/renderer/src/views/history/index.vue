<script setup lang="ts">
import { Music } from '@renderer/api/playlist/types'
import LoadingLayout from '@renderer/components/LoadingLayout.vue'
import MusicList from '@renderer/components/MusicList.vue'
import { useQueryDB } from '@renderer/composeable/useQueryDB'
import { DBStoreName } from '@renderer/enums/store'

const { data, pageNo, total, loading, error } = useQueryDB<Music>(DBStoreName.HISTORY)
</script>

<template>
  <LoadingLayout
    v-model="pageNo"
    :loading="loading"
    :item-count="data.length"
    :total="total"
    :error="error"
    enable-load-more
  >
    <music-list :list="data" />
  </LoadingLayout>
</template>

<style scoped></style>
