<script setup lang="ts">
import { useSearchStore } from '@renderer/store/modules/search'
import { searchArtist } from '@renderer/api/search'
import usePageRequest from '@renderer/composeable/usePageRequest'
import LoadingLayout from '@renderer/components/LoadingLayout.vue'
import GridView from '@renderer/components/GridView.vue'
import useWindow from '@renderer/composeable/useWindow'

const searchStore = useSearchStore()

const { loading, data, error, pageNo, total } = usePageRequest(
  (pageNo, pageSize) =>
    searchArtist({
      pageNo,
      pageSize,
      keyword: searchStore.keyword
    }),
  {
    immediate: !!searchStore.keyword
  }
)

const { column } = useWindow()
</script>

<template>
  <loading-layout
    v-model="pageNo"
    :loading="loading"
    :error="error"
    :total="total"
    :item-count="data.length"
    enable-load-more
  >
    <div style="height: 20px"></div>
    <grid-view :column="column" :spacing="20">
      <router-link
        v-for="item in data"
        :key="item.id"
        :to="`/artist/detail?id=${item.id}`"
        class="artist"
      >
        <mdui-avatar style="width: 80px; height: 80px" :src="item.pic300" />
        <div style="margin-top: 10px">{{ item.name }}</div>
      </router-link>
    </grid-view>
  </loading-layout>
</template>

<style scoped>
.artist {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
