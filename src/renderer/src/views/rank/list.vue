<script setup lang="ts">
import LoadingLayout from '@renderer/components/LoadingLayout.vue'
import usePageRequest from '@renderer/composeable/usePageRequest'
import { getRankMusicPage } from '@renderer/api/rank'
import { useRoute } from 'vue-router'
import MusicList from '@renderer/components/MusicList.vue'
import { computed, ref, watch } from 'vue'
import useRequest from '@renderer/composeable/useRequest'
import { Music } from '@renderer/api/playlist/types'

const route = useRoute()

const total = ref(0)
const pageNo = ref(1)
const musicData = ref<Music[]>([])
const { loading, error, send } = useRequest(
  () => {
    return getRankMusicPage({
      pageNo: pageNo.value,
      pageSize: 20,
      rankId: route.query.id as string
    })
  },
  {
    onSuccess: (data) => {
      if (pageNo.value === 1) {
        musicData.value = data.musicList
      } else {
        musicData.value.push(...data.musicList)
      }
      total.value = data.num
    },
    immediate: true
  }
)

function onLoadMore() {
  pageNo.value++
  send()
}
</script>

<template>
  <loading-layout
    v-model="pageNo"
    :loading="loading"
    :item-count="musicData.length"
    :total="total"
    :error="error"
    enable-load-more
    @load-more="onLoadMore"
  >
    <music-list :list="musicData" />
  </loading-layout>
</template>

<style scoped></style>
