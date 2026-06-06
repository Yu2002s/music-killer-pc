<script setup lang="ts">
import '@mdui/icons/play-arrow'
import '@mdui/icons/favorite'
import '@mdui/icons/favorite-border'
import { getPlaylistInfo } from '@renderer/api/playlist'
import { Music, PlayList } from '@renderer/api/playlist/types'
import LoadingLayout from '@renderer/components/LoadingLayout.vue'
import MusicList from '@renderer/components/MusicList.vue'
import useRequest from '@renderer/composeable/useRequest'
import { onMounted, ref, toRaw } from 'vue'
import { useRoute } from 'vue-router'
import { addData, deleteData, getDataByKey } from '@renderer/db'
import { DBStoreName } from '@renderer/enums/store'
import { useAudioStore } from '@renderer/store/modules/audio'

const route = useRoute()

const musicData = ref<Music[]>([])
const pageNo = ref(1)
const pageSize = ref(20)
const total = ref(0)
const isFavorite = ref(false)
const audioStore = useAudioStore()

onMounted(async () => {
  isFavorite.value = !!(await getDataByKey(DBStoreName.FAVORITE_PLAYLIST, +route.query.id))
})

const { loading, error, data, send } = useRequest(
  () => {
    return getPlaylistInfo({
      pageNo: pageNo.value,
      pageSize: pageSize.value,
      pid: route.query.id as string
    })
  },
  {
    immediate: true,
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

function onLoadMore() {
  pageNo.value++
  send()
}

function favorite() {
  if (!data.value) {
    return
  }
  isFavorite.value = !isFavorite.value
  if (isFavorite.value) {
    const playList = structuredClone(toRaw(data.value)) as PlayList
    delete playList.musicList
    playList.updateTime = Date.now()
    addData(DBStoreName.FAVORITE_PLAYLIST, playList)
  } else {
    deleteData(DBStoreName.FAVORITE_PLAYLIST, +route.query.id)
  }
}

function play() {
  audioStore.addPlaylist(musicData.value)
}
</script>

<template>
  <loading-layout
    :model-value="pageNo"
    :loading="loading"
    :total="total"
    :item-count="musicData.length"
    :error="error"
    enable-load-more
    @load-more="onLoadMore"
  >
    <div>
      <mdui-button @click="play">
        <mdui-icon-play-arrow slot="icon"></mdui-icon-play-arrow>
        开始播放
      </mdui-button>
      <mdui-button style="margin-left: 10px" @click="favorite">
        <mdui-icon-favorite v-if="isFavorite" slot="icon"></mdui-icon-favorite>
        <mdui-icon-favorite-border v-else slot="icon"></mdui-icon-favorite-border>
        {{ isFavorite ? '取消收藏' : '收藏歌单' }}
      </mdui-button>
    </div>
    <music-list v-if="data" :list="musicData" />
  </loading-layout>
</template>

<style scoped></style>
