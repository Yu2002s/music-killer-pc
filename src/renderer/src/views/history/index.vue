<script setup lang="ts">
import { Music } from '@renderer/api/playlist/types'
import { useQueryDB } from '@renderer/composeable/useQueryDB'
import LoadingLayout from '@renderer/components/LoadingLayout.vue'
import MusicList from '@renderer/components/MusicList.vue'
import { DBStoreName } from '@renderer/enums/store'

const { data, pageNo, total, loading, error } = useQueryDB<Music>(DBStoreName.HISTORY)

function onLoadMore() {
  pageNo.value++
}
</script>

<template>
  <LoadingLayout
    :loading="loading"
    :item-count="data.length"
    :total="total"
    :error="error"
    :page="pageNo"
    enable-load-more
    @load-more="onLoadMore"
  >
    <music-list :list="data" />
  </LoadingLayout>
</template>

<style scoped></style>
