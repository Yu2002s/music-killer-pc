<template>
  <LoadingLayout
    v-model="pageNo"
    :total="total"
    :item-count="data.length"
    enable-load-more
    :error="error"
    :loading="loading"
  >
    <MusicList :list="data" />
  </LoadingLayout>
</template>

<script setup lang="ts">
import { searchMusic } from '@renderer/api/search'
import LoadingLayout from '@renderer/components/LoadingLayout.vue'
import MusicList from '@renderer/components/MusicList.vue'
import usePageRequest from '@renderer/composeable/usePageRequest'
import { useSearchStore } from '@renderer/store/modules/search'
import { watch } from 'vue'

const searchStore = useSearchStore()

const { pageNo, loading, error, total, data, refresh } = usePageRequest(
  (pageNo: number, pageSize: number) => {
    return searchMusic({
      pageNo,
      pageSize,
      keyword: searchStore.keyword
    })
  },
  {
    immediate: !!searchStore.keyword,
    initialPage: {
      pageNo: 1,
      pageSize: 20
    }
  }
)

watch(
  () => searchStore.keyword,
  (val) => {
    console.log('search:', val)
    refresh()
  }
)
</script>

<style scoped></style>
