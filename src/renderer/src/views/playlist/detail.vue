<script setup lang="ts">
import { getPlaylistInfo } from '@renderer/api/playlist'
import { Music } from '@renderer/api/playlist/types'
import LoadingLayout from '@renderer/components/LoadingLayout.vue'
import MusicList from '@renderer/components/MusicList.vue'
import useRequest from '@renderer/composeable/useRequest'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const musicData = ref<Music[]>([])
const pageNo = ref(1)
const pageSize = ref(20)
const total = ref(0)

const { loading, error, data, send } = useRequest(
  () => {
    return getPlaylistInfo({
      pageNo: pageNo.value,
      pageSize: pageSize.value,
      pid: route.query.id as string
    })
  },
  {
    onSuccess: (data) => {
      if (pageNo.value === 1) {
        musicData.value = data.musicList || []
      } else {
        musicData.value.push(...(data.musicList || []))
      }
      total.value = data.total
    }
  }
)

onMounted(() => {
  send()
})
</script>

<template>
  <loading-layout
    v-model="pageNo"
    :loading="loading"
    :total="total"
    :item-count="musicData.length"
    :error="error"
    enable-load-more
  >
    <music-list v-if="data" :list="musicData" />
  </loading-layout>
</template>

<style scoped></style>
