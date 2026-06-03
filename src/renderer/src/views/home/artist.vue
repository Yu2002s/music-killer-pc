<script setup lang="ts">
import LoadingLayout from '@renderer/components/LoadingLayout.vue'
import usePageRequest from '@renderer/composeable/usePageRequest'
import { getArtistPage } from '@renderer/api/artist'
import GridView from '@renderer/components/GridView.vue'
import useWindow from '@renderer/composeable/useWindow'
import 'mdui/components/avatar'

defineOptions({
  name: 'Artist'
})

const { loading, error, data, pageNo, total } = usePageRequest(
  (pageNo, pageSize) => {
    return getArtistPage({
      pageNo,
      pageSize,
      category: 0
    })
  },
  {
    immediate: true,
    initialPage: {
      pageNo: 1,
      pageSize: 50
    }
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

<style scoped lang="scss">
.artist {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
